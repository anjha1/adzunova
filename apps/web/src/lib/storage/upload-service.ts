import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { getStorageMongoDb, AppendOnlyAssetEventRepository, incrementBlobRefCount } from '@adzunova/storage-db';
import { getClassificationPolicy, type StoragePurpose } from './classification';
import { buildIngestKey, buildPrivateKey, buildPublicKey, computeTenantShard } from './keys';
import { buildPublicCdnUrl, HARD_MAX_PRESIGN_GET_TTL_SECONDS } from './delivery';
import { StoragePortError, scrubStorageSecrets } from './errors';
import { getStorageAdapterForRole } from './runtime';
import type { ObjectStoragePort } from './port';
import { getUserStorageQuotaBytes } from './rate-limit';
import { enqueueAssetScanJob } from './scan-worker';
import {
  getPurposeUploadRules,
  reencodePublicImage,
  sanitizeDownloadFilename,
  streamAndValidateObject,
} from './validation';

const reqMongo = createRequire(path.resolve(process.cwd(), '../../packages/storage-db/package.json'));
const { ObjectId } = (() => {
  try {
    return reqMongo('mongodb');
  } catch {
    return createRequire(path.resolve(process.cwd(), 'packages/storage-db/package.json'))('mongodb');
  }
})();

export const R2_MIN_PART_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB (ADR 0001 verified)
export const R2_MAX_PARTS_WITH_MARGIN = 9000; // below 10,000 R2 hard limit

export interface AuthActor {
  userId: string;
  tenantId: string;
  ownerType: 'CREATOR' | 'BRAND';
  ownerId: string;
}

export function computeMultipartPlan(
  declaredSize: number,
  env: Record<string, string | undefined> = process.env
): { mode: 'single' | 'multipart'; partSize: number; partCount: number } {
  const threshold = Number.parseInt(env.R2_MULTIPART_THRESHOLD_BYTES || String(10 * 1024 * 1024), 10);
  if (declaredSize <= threshold) {
    return { mode: 'single', partSize: declaredSize, partCount: 1 };
  }
  const configuredPart = Number.parseInt(env.R2_MULTIPART_PART_SIZE_BYTES || String(R2_MIN_PART_SIZE_BYTES), 10);
  let partSize = Math.max(R2_MIN_PART_SIZE_BYTES, configuredPart);
  if (Math.ceil(declaredSize / partSize) > R2_MAX_PARTS_WITH_MARGIN) {
    const raw = Math.ceil(declaredSize / R2_MAX_PARTS_WITH_MARGIN);
    const mib = 1024 * 1024;
    partSize = Math.ceil(raw / mib) * mib;
  }
  const partCount = Math.max(1, Math.ceil(declaredSize / partSize));
  return { mode: 'multipart', partSize, partCount };
}

function getUploadPresignTtl(env: Record<string, string | undefined> = process.env): number {
  const raw = Number.parseInt(env.R2_UPLOAD_URL_EXPIRY || '900', 10);
  return Math.max(60, Math.min(raw, 900));
}

function getSessionTtlSeconds(env: Record<string, string | undefined> = process.env): number {
  const raw = Number.parseInt(env.UPLOAD_SESSION_TTL_SECONDS || '3600', 10);
  return Math.max(300, Math.min(raw, 86400));
}

function buildDevOrCdnPublicUrl(objectKey: string, cdnBase: string, isDevTarget: boolean): string {
  if (!isDevTarget && cdnBase) {
    return buildPublicCdnUrl(objectKey, cdnBase);
  }
  if (process.env.NEXT_PUBLIC_DEV_CDN_BASE) {
    return buildPublicCdnUrl(objectKey, process.env.NEXT_PUBLIC_DEV_CDN_BASE);
  }
  return `/api/storage/dev-public?key=${encodeURIComponent(objectKey)}`;
}

async function checkQuota(tenantId: string, declaredSize: number): Promise<void> {
  const db = await getStorageMongoDb();
  const agg = await db
    .collection('storage_asset_blobs')
    .aggregate([
      { $match: { tenantId, state: 'ACTIVE' } },
      { $group: { _id: null, total: { $sum: '$sizeBytes' } } },
    ])
    .toArray();
  const used = BigInt(agg[0]?.total || 0);
  const quota = getUserStorageQuotaBytes();
  if (used + BigInt(declaredSize) > quota) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-quota-exceeded',
      title: 'Storage Quota Exceeded',
      status: 413,
      detail: 'Your storage quota has been exceeded. Delete unused assets or contact support.',
      code: 'QUOTA_EXCEEDED',
      retryable: false,
    });
  }
}

export async function createUploadSession(params: {
  actor: AuthActor;
  purpose: StoragePurpose;
  fileName: string;
  declaredSize: number;
  declaredContentType: string;
  expectedSha256?: string;
  idempotencyKey: string;
}) {
  const policy = getClassificationPolicy(params.purpose);
  const rules = getPurposeUploadRules(params.purpose);

  if (!Number.isSafeInteger(params.declaredSize) || params.declaredSize <= 0) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-invalid-size',
      title: 'Invalid File Size',
      status: 400,
      detail: 'declaredSize must be a positive integer.',
      code: 'INVALID_SIZE',
      retryable: false,
    });
  }
  if (params.declaredSize > rules.maxBytes) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-file-too-large',
      title: 'File Too Large',
      status: 413,
      detail: `File size ${params.declaredSize} exceeds limit of ${rules.maxBytes} bytes for ${params.purpose}.`,
      code: 'FILE_TOO_LARGE',
      retryable: false,
    });
  }
  if (!rules.allowedMimeTypes.includes(params.declaredContentType)) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-unsupported-type',
      title: 'Unsupported Content Type',
      status: 415,
      detail: `Content-Type "${params.declaredContentType}" is not allowed for ${params.purpose}.`,
      code: 'UNSUPPORTED_CONTENT_TYPE',
      retryable: false,
    });
  }

  const signer = getStorageAdapterForRole('upload-signer');
  if (!signer.ok) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-not-configured',
      title: 'Storage Not Configured',
      status: 503,
      detail: signer.reason,
      code: 'STORAGE_NOT_CONFIGURED',
      retryable: false,
    });
  }

  await checkQuota(params.actor.tenantId, params.declaredSize);

  const db = await getStorageMongoDb();
  const sessions = db.collection('storage_upload_sessions');
  const existing = await sessions.findOne({
    idempotencyKey: params.idempotencyKey,
    tenantId: params.actor.tenantId,
  });

  const ttlSeconds = getUploadPresignTtl();

  if (existing) {
    if (existing.status === 'COMPLETED' && existing.result) {
      return {
        sessionId: existing.sessionUuid,
        mode: existing.mode,
        partSize: existing.partSize,
        partCount: existing.partCount,
        status: existing.status,
        completed: true,
        result: existing.result,
      };
    }
    if (existing.status === 'INITIATED' && new Date(existing.expiresAt) > new Date()) {
      const uploadUrl =
        existing.mode === 'single'
          ? await signer.port.presignPut(existing.bucket, existing.objectKey, {
            contentType: existing.contentType,
            contentLength: Number(existing.expectedBytes),
            expiresInSeconds: ttlSeconds,
          })
          : undefined;
      return {
        sessionId: existing.sessionUuid,
        mode: existing.mode,
        partSize: existing.partSize,
        partCount: existing.partCount,
        expiresAt: existing.expiresAt,
        uploadUrl,
      };
    }
  }

  const sessionUuid = crypto.randomUUID().replace(/-/g, '');
  const objectKey = buildIngestKey({ sessionId: sessionUuid, objectOrPart: 'payload.bin' });
  const plan = computeMultipartPlan(params.declaredSize);
  const bucket = signer.runtime.buckets.quarantine;
  const expiresAt = new Date(Date.now() + getSessionTtlSeconds() * 1000);
  const now = new Date();

  let uploadId: string | undefined;
  let uploadUrl: string | undefined;

  if (plan.mode === 'multipart') {
    const mp = await signer.port.createMultipart(bucket, objectKey, params.declaredContentType);
    uploadId = mp.uploadId;
  } else {
    uploadUrl = await signer.port.presignPut(bucket, objectKey, {
      contentType: params.declaredContentType,
      contentLength: params.declaredSize,
      expiresInSeconds: ttlSeconds,
    });
  }

  // Write budget: 1 write at session creation
  await sessions.insertOne({
    sessionUuid,
    idempotencyKey: params.idempotencyKey,
    ownerType: params.actor.ownerType,
    ownerId: params.actor.ownerId,
    tenantId: params.actor.tenantId,
    visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
    purpose: params.purpose,
    fileName: sanitizeDownloadFilename(params.fileName),
    bucket,
    objectKey,
    expectedBytes: params.declaredSize,
    expectedSha256: params.expectedSha256?.toLowerCase() || null,
    contentType: params.declaredContentType,
    mode: plan.mode,
    partSize: plan.partSize,
    partCount: plan.partCount,
    uploadId: uploadId || null,
    status: 'INITIATED',
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return {
    sessionId: sessionUuid,
    mode: plan.mode,
    partSize: plan.partSize,
    partCount: plan.partCount,
    expiresAt: expiresAt.toISOString(),
    uploadUrl,
  };
}

async function getOwnedSession(sessionId: string, actor: AuthActor) {
  const db = await getStorageMongoDb();
  const session = await db.collection('storage_upload_sessions').findOne({
    sessionUuid: sessionId,
    tenantId: actor.tenantId,
  });
  if (!session) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-session-not-found',
      title: 'Upload Session Not Found',
      status: 404,
      detail: 'Upload session not found.',
      code: 'SESSION_NOT_FOUND',
      retryable: false,
    });
  }
  return session;
}

export async function issuePartUploadUrls(params: {
  actor: AuthActor;
  sessionId: string;
  partNumbers: number[];
}) {
  const session = await getOwnedSession(params.sessionId, params.actor);
  if (session.status !== 'INITIATED') {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-session-closed',
      title: 'Upload Session Closed',
      status: 409,
      detail: `Cannot sign parts for session in state "${session.status}".`,
      code: 'SESSION_CLOSED',
      retryable: false,
    });
  }
  if (new Date(session.expiresAt) <= new Date()) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-session-expired',
      title: 'Upload Session Expired',
      status: 410,
      detail: 'Upload session has expired.',
      code: 'SESSION_EXPIRED',
      retryable: false,
    });
  }
  if (session.mode !== 'multipart' || !session.uploadId) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-not-multipart',
      title: 'Not a Multipart Session',
      status: 400,
      detail: 'Session is single-PUT mode.',
      code: 'NOT_MULTIPART',
      retryable: false,
    });
  }
  if (params.partNumbers.length === 0 || params.partNumbers.length > 50) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-invalid-part-batch',
      title: 'Invalid Part Batch',
      status: 400,
      detail: 'partNumbers must contain between 1 and 50 part numbers.',
      code: 'INVALID_PART_BATCH',
      retryable: false,
    });
  }

  const signer = getStorageAdapterForRole('upload-signer');
  if (!signer.ok) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-not-configured',
      title: 'Storage Not Configured',
      status: 503,
      detail: signer.reason,
      code: 'STORAGE_NOT_CONFIGURED',
      retryable: false,
    });
  }

  const ttl = Math.min(getUploadPresignTtl(), 300);
  const urls: Array<{ partNumber: number; url: string }> = [];
  for (const partNumber of params.partNumbers) {
    if (!Number.isInteger(partNumber) || partNumber < 1 || partNumber > Number(session.partCount)) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-invalid-part-number',
        title: 'Invalid Part Number',
        status: 400,
        detail: `Part number ${partNumber} is out of range (1..${session.partCount}).`,
        code: 'INVALID_PART_NUMBER',
        retryable: false,
      });
    }
    const url = await signer.port.presignPart(
      session.bucket,
      session.objectKey,
      session.uploadId,
      partNumber,
      ttl
    );
    urls.push({ partNumber, url });
  }

  return { sessionId: session.sessionUuid, expiresInSeconds: ttl, parts: urls };
}

export async function getUploadSessionStatus(params: { actor: AuthActor; sessionId: string }) {
  const session = await getOwnedSession(params.sessionId, params.actor);
  let uploadedParts: Array<{ partNumber: number; etag: string; size: number }> = [];

  if (session.mode === 'multipart' && session.uploadId && session.status === 'INITIATED') {
    const signer = getStorageAdapterForRole('upload-signer');
    if (signer.ok) {
      uploadedParts = await signer.port.listParts(session.bucket, session.objectKey, session.uploadId).catch(() => []);
    }
  }

  return {
    sessionId: session.sessionUuid,
    purpose: session.purpose,
    mode: session.mode,
    status: session.status,
    partSize: session.partSize,
    partCount: session.partCount,
    expectedBytes: Number(session.expectedBytes),
    expiresAt: session.expiresAt,
    uploadedParts,
    result: session.result || null,
  };
}

export async function abortUploadSession(params: { actor: AuthActor; sessionId: string }) {
  const session = await getOwnedSession(params.sessionId, params.actor);
  if (session.status === 'COMPLETED') {
    return { sessionId: session.sessionUuid, status: 'COMPLETED' };
  }

  const signer = getStorageAdapterForRole('upload-signer');
  const processor = getStorageAdapterForRole('processor');

  if (session.mode === 'multipart' && session.uploadId && signer.ok) {
    await signer.port.abortMultipart(session.bucket, session.objectKey, session.uploadId).catch(() => { });
  }
  if (processor.ok) {
    await processor.port.delete(session.bucket, session.objectKey).catch(() => { });
  }

  const db = await getStorageMongoDb();
  await db.collection('storage_upload_sessions').updateOne(
    { _id: session._id },
    { $set: { status: 'ABORTED', updatedAt: new Date() } }
  );

  return { sessionId: session.sessionUuid, status: 'ABORTED' };
}

export async function completeUploadSession(params: {
  actor: AuthActor;
  sessionId: string;
  parts?: Array<{ partNumber: number; etag: string }>;
}) {
  const db = await getStorageMongoDb();
  const sessions = db.collection('storage_upload_sessions');
  const session = await getOwnedSession(params.sessionId, params.actor);

  // Idempotent repeat of complete returns identical result
  if (session.status === 'COMPLETED' && session.result) {
    return session.result;
  }
  if (session.status === 'REJECTED') {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-upload-rejected',
      title: 'Upload Rejected',
      status: 422,
      detail: session.rejectionReason || 'Upload was rejected during validation.',
      code: session.rejectionCode || 'UPLOAD_REJECTED',
      retryable: false,
    });
  }
  if (session.status === 'ABORTED') {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-session-aborted',
      title: 'Upload Aborted',
      status: 409,
      detail: 'Upload session was aborted.',
      code: 'SESSION_ABORTED',
      retryable: false,
    });
  }
  if (new Date(session.expiresAt) <= new Date()) {
    await sessions.updateOne({ _id: session._id }, { $set: { status: 'EXPIRED', updatedAt: new Date() } });
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-session-expired',
      title: 'Upload Session Expired',
      status: 410,
      detail: 'Upload session has expired.',
      code: 'SESSION_EXPIRED',
      retryable: false,
    });
  }

  const signer = getStorageAdapterForRole('upload-signer');
  const processor = getStorageAdapterForRole('processor');
  if (!signer.ok || !processor.ok) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-not-configured',
      title: 'Storage Not Configured',
      status: 503,
      detail: !signer.ok ? signer.reason : processor.ok ? '' : processor.reason,
      code: 'STORAGE_NOT_CONFIGURED',
      retryable: false,
    });
  }

  const purpose = session.purpose as StoragePurpose;
  const policy = getClassificationPolicy(purpose);
  const rules = getPurposeUploadRules(purpose);

  // 1. Finalize upload in quarantine bucket
  if (session.mode === 'multipart') {
    if (!Array.isArray(params.parts) || params.parts.length !== Number(session.partCount)) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-invalid-parts',
        title: 'Invalid Multipart ETag List',
        status: 400,
        detail: `Expected ${session.partCount} parts, received ${Array.isArray(params.parts) ? params.parts.length : 0}.`,
        code: 'INVALID_PARTS_LIST',
        retryable: false,
      });
    }
    const sorted = [...params.parts].sort((a, b) => a.partNumber - b.partNumber);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].partNumber !== i + 1 || !sorted[i].etag) {
        throw new StoragePortError({
          type: 'urn:adzunova:problems:storage-invalid-parts',
          title: 'Invalid Multipart ETag List',
          status: 400,
          detail: `Part ${i + 1} is missing or out of order.`,
          code: 'INVALID_PARTS_LIST',
          retryable: false,
        });
      }
    }
    await signer.port.completeMultipart(session.bucket, session.objectKey, session.uploadId, sorted);
  } else {
    const head = await processor.port.head(session.bucket, session.objectKey);
    if (!head.exists) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-object-missing',
        title: 'Uploaded Object Not Found',
        status: 400,
        detail: 'Object has not been uploaded to quarantine yet.',
        code: 'OBJECT_NOT_UPLOADED',
        retryable: false,
      });
    }
  }

  const cleanupQuarantine = async () => {
    await processor.port.delete(session.bucket, session.objectKey).catch(() => { });
  };

  // 2. Stream from quarantine: magic bytes, size, SHA-256, conservative PDF check
  const objStream = await processor.port.get(session.bucket, session.objectKey);
  const validation = await streamAndValidateObject({
    body: objStream.body,
    allowedMimeTypes: rules.allowedMimeTypes,
    maxBytes: rules.maxBytes,
    checkPdfActiveContent: purpose === 'creator_media_kit_pdf' || purpose === 'contract_pdf' || purpose === 'invoice_pdf',
  });

  if (!validation.ok) {
    await cleanupQuarantine();
    await sessions.updateOne(
      { _id: session._id },
      {
        $set: {
          status: 'REJECTED',
          rejectionCode: validation.reasonCode,
          rejectionReason: validation.detail,
          updatedAt: new Date(),
        },
      }
    );
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-upload-rejected',
      title: 'File Validation Failed',
      status: 422,
      detail: validation.detail,
      code: validation.reasonCode,
      retryable: false,
    });
  }

  if (validation.byteLength !== Number(session.expectedBytes)) {
    await cleanupQuarantine();
    await sessions.updateOne(
      { _id: session._id },
      {
        $set: {
          status: 'REJECTED',
          rejectionCode: 'SIZE_MISMATCH',
          rejectionReason: `Uploaded bytes (${validation.byteLength}) do not match declaredSize (${session.expectedBytes}).`,
          updatedAt: new Date(),
        },
      }
    );
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-size-mismatch',
      title: 'Uploaded Size Mismatch',
      status: 422,
      detail: `Uploaded size (${validation.byteLength}) does not match declared size (${session.expectedBytes}).`,
      code: 'SIZE_MISMATCH',
      retryable: false,
    });
  }

  if (session.expectedSha256 && validation.sha256Hex !== session.expectedSha256) {
    await cleanupQuarantine();
    await sessions.updateOne(
      { _id: session._id },
      {
        $set: {
          status: 'REJECTED',
          rejectionCode: 'HASH_MISMATCH',
          rejectionReason: 'Server SHA-256 did not match client-declared SHA-256.',
          updatedAt: new Date(),
        },
      }
    );
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-hash-mismatch',
      title: 'Checksum Mismatch',
      status: 422,
      detail: 'Uploaded content hash does not match declared SHA-256.',
      code: 'HASH_MISMATCH',
      retryable: false,
    });
  }

  // 3. Promote to public or private bucket
  const assetOid = new ObjectId();
  const assetId = assetOid.toHexString();
  const assetUuid = crypto.randomUUID().replace(/-/g, '');
  const isPublicImage = Boolean(rules.imageBounds && policy.targetBucket === 'public');

  let finalBucket = processor.runtime.buckets.private;
  let finalKey = '';
  let finalSha256 = validation.sha256Hex;
  let finalBytes = validation.byteLength;
  let finalMime = validation.detectedMime;
  let publicUrl: string | null = null;
  let thumbUrl: string | null = null;
  let scanStatus: 'REENCODED' | 'QUARANTINED' | 'CLEAN' | 'REJECTED' | 'SCAN_FAILED' | 'NOT_SCANNED' = 'QUARANTINED';
  let releaseStatus: 'RELEASED' | 'BLOCKED' = 'BLOCKED';

  if (isPublicImage && rules.imageBounds) {
    if (!validation.bufferedIfSmall) {
      await cleanupQuarantine();
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-image-too-large',
        title: 'Image Too Large',
        status: 422,
        detail: 'Image exceeds in-memory re-encoding cap.',
        code: 'IMAGE_TOO_LARGE',
        retryable: false,
      });
    }
    const processed = await reencodePublicImage(validation.bufferedIfSmall, rules.imageBounds);
    finalBucket = processor.runtime.buckets.public;
    finalKey = buildPublicKey({ kind: rules.imageBounds.kind, sha256: processed.mainSha256Hex, ext: 'webp' });
    const thumbKey = buildPublicKey({
      kind: `${rules.imageBounds.kind}_thumb`,
      sha256: processed.thumbSha256Hex,
      ext: 'webp',
    });

    await processor.port.put(finalBucket, finalKey, processed.mainBuffer, {
      contentType: 'image/webp',
      contentLength: processed.mainBuffer.length,
      cacheControl: 'public, max-age=31536000, immutable',
    });
    await processor.port.put(finalBucket, thumbKey, processed.thumbBuffer, {
      contentType: 'image/webp',
      contentLength: processed.thumbBuffer.length,
      cacheControl: 'public, max-age=31536000, immutable',
    });

    finalSha256 = processed.mainSha256Hex;
    finalBytes = processed.mainBuffer.length;
    finalMime = 'image/webp';
    scanStatus = 'REENCODED';
    releaseStatus = 'RELEASED';
    publicUrl = buildDevOrCdnPublicUrl(finalKey, processor.runtime.cdnBase, processor.runtime.isDevTarget);
    thumbUrl = buildDevOrCdnPublicUrl(thumbKey, processor.runtime.cdnBase, processor.runtime.isDevTarget);
    await cleanupQuarantine();
  } else if (policy.scanPolicy === 'REQUIRED_MALWARE_SCAN') {
    // M5: Keep untrusted bytes in private quarantine bucket until malware scan passes
    finalBucket = session.bucket;
    finalKey = session.objectKey;
    scanStatus = 'QUARANTINED';
    releaseStatus = 'BLOCKED';
  } else {
    const shard = computeTenantShard(params.actor.tenantId);
    finalKey = buildPrivateKey({
      domain: purpose,
      tenantShard: shard,
      entityId: params.actor.ownerId,
      assetId,
      version: 1,
      ext: validation.detectedExt,
    });
    await processor.port.copy(session.bucket, session.objectKey, finalBucket, finalKey);
    scanStatus = 'NOT_SCANNED';
    releaseStatus = 'RELEASED';
    await cleanupQuarantine();
  }

  // 4. Persist metadata: blob (dedup + atomic refCount), media_asset, asset_version, asset_event
  const now = new Date();
  const blobs = db.collection('storage_asset_blobs');
  let blobDoc = await blobs.findOne({ sha256Hex: finalSha256, bucket: finalBucket });
  let blobId: string;
  if (!blobDoc) {
    const newBlobOid = new ObjectId();
    await blobs.insertOne({
      _id: newBlobOid,
      sha256Hex: finalSha256,
      sizeBytes: finalBytes,
      contentType: finalMime,
      dataClass: policy.dataClass,
      bucket: finalBucket,
      objectKey: finalKey,
      storageClass: 'STANDARD',
      state: 'ACTIVE',
      refCount: 0,
      ownerType: params.actor.ownerType,
      ownerId: params.actor.ownerId,
      tenantId: params.actor.tenantId,
      visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
      createdAt: now,
      updatedAt: now,
    });
    blobId = newBlobOid.toHexString();
  } else {
    blobId = String(blobDoc._id);
  }
  await incrementBlobRefCount(blobId);

  const versionOid = new ObjectId();
  await db.collection('storage_asset_versions').insertOne({
    _id: versionOid,
    assetId: assetOid,
    versionNumber: 1,
    blobId: new ObjectId(blobId),
    sha256Hex: finalSha256,
    scanStatus,
    releaseStatus,
    releasedBucket: releaseStatus === 'RELEASED' ? finalBucket : null,
    releasedKey: releaseStatus === 'RELEASED' ? finalKey : null,
    tenantId: params.actor.tenantId,
    ownerType: params.actor.ownerType,
    ownerId: params.actor.ownerId,
    createdBy: params.actor.userId,
    visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
    createdAt: now,
  });

  await db.collection('storage_media_assets').insertOne({
    _id: assetOid,
    assetUuid,
    idempotencyKey: `asset:${session.idempotencyKey}`,
    ownerType: params.actor.ownerType,
    ownerId: params.actor.ownerId,
    tenantId: params.actor.tenantId,
    visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
    dataClass: policy.dataClass,
    purpose,
    originalFileName: session.fileName,
    scanStatus,
    releaseStatus,
    currentVersionId: versionOid,
    status: 'ACTIVE',
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  if (policy.scanPolicy === 'REQUIRED_MALWARE_SCAN') {
    await enqueueAssetScanJob({
      assetId,
      versionId: versionOid.toHexString(),
      versionNumber: 1,
      tenantId: params.actor.tenantId,
      purpose,
      quarantineBucket: finalBucket,
      quarantineKey: finalKey,
      sha256Hex: finalSha256,
      sizeBytes: finalBytes,
      contentType: finalMime,
    });
  }

  const eventRepo = new AppendOnlyAssetEventRepository();
  await eventRepo.insert({
    assetId,
    eventType: 'ASSET_UPLOADED',
    actorId: params.actor.userId,
    ownerType: params.actor.ownerType,
    ownerId: params.actor.ownerId,
    tenantId: params.actor.tenantId,
    visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
    payload: { purpose, sha256Hex: finalSha256, sizeBytes: finalBytes, scanStatus },
  });

  const result = {
    sessionId: session.sessionUuid,
    assetId,
    assetUuid,
    purpose,
    visibility: policy.dataClass === 'public' ? 'PUBLIC' : 'PRIVATE',
    scanStatus,
    sha256Hex: finalSha256,
    sizeBytes: finalBytes,
    contentType: finalMime,
    publicUrl,
    thumbUrl,
    objectKey: finalKey,
    bucket: finalBucket,
  };

  // Write budget: 1 write at session complete
  await sessions.updateOne(
    { _id: session._id },
    { $set: { status: 'COMPLETED', result, updatedAt: new Date() } }
  );

  return result;
}

export async function issueAuthorizedDownloadUrl(params: {
  actor: AuthActor;
  assetId: string;
  bookingId?: string;
  readerOverride?: Pick<ObjectStoragePort, 'presignGet'>;
}) {
  if (!ObjectId.isValid(params.assetId)) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-asset-not-found',
      title: 'Asset Not Found',
      status: 404,
      detail: 'Asset not found.',
      code: 'ASSET_NOT_FOUND',
      retryable: false,
    });
  }

  const db = await getStorageMongoDb();
  const assetOid = new ObjectId(params.assetId);

  let asset;
  if (params.bookingId) {
    const link = await db.collection('storage_asset_links').findOne({
      entityType: 'booking',
      entityId: params.bookingId,
      assetId: assetOid,
    });
    if (!link) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-forbidden',
        title: 'Attachment Not Linked',
        status: 403,
        detail: 'This attachment does not belong to the specified booking.',
        code: 'ATTACHMENT_NOT_LINKED',
        retryable: false,
      });
    }
    asset = await db.collection('storage_media_assets').findOne({
      _id: assetOid,
      deletedAt: null,
    });
  } else {
    asset = await db.collection('storage_media_assets').findOne({
      _id: assetOid,
      tenantId: params.actor.tenantId,
      deletedAt: null,
    });
  }

  if (!asset) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-asset-not-found',
      title: 'Asset Not Found',
      status: 404,
      detail: 'Asset not found.',
      code: 'ASSET_NOT_FOUND',
      retryable: false,
    });
  }

  const version = await db.collection('storage_asset_versions').findOne({ _id: asset.currentVersionId });
  const blob = version ? await db.collection('storage_asset_blobs').findOne({ _id: version.blobId }) : null;
  if (!blob || !version) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-asset-not-found',
      title: 'Asset Blob Not Found',
      status: 404,
      detail: 'Asset blob not found.',
      code: 'ASSET_NOT_FOUND',
      retryable: false,
    });
  }

  // M5 Centralized Release Gate: fail closed for any un-scanned, quarantined, rejected, or failed file
  const policy = getClassificationPolicy(String(asset.purpose) as StoragePurpose);
  if (policy.scanPolicy === 'REQUIRED_MALWARE_SCAN') {
    const sStatus = String(asset.scanStatus || 'NOT_SCANNED');
    const rStatus = String(version.releaseStatus || asset.releaseStatus || 'BLOCKED');
    if (sStatus === 'REJECTED') {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-attachment-rejected',
        title: 'File Rejected',
        status: 403,
        detail: 'File rejected by malware scan and cannot be accessed.',
        code: 'ATTACHMENT_REJECTED',
        retryable: false,
      });
    }
    if (sStatus === 'SCAN_FAILED') {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-scan-unavailable',
        title: 'Scan Unavailable',
        status: 503,
        detail: 'Malware scan unavailable. File access remains blocked.',
        code: 'ATTACHMENT_SCAN_UNAVAILABLE',
        retryable: true,
      });
    }
    if (
      sStatus !== 'CLEAN' ||
      rStatus !== 'RELEASED' ||
      !version.releasedBucket ||
      !version.releasedKey
    ) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-scan-pending',
        title: 'Scan Pending',
        status: 403,
        detail: 'Uploaded — scan pending. File access is blocked until malware scan completes.',
        code: 'ATTACHMENT_SCAN_PENDING',
        retryable: true,
      });
    }
  }

  let readerPort: Pick<ObjectStoragePort, 'presignGet'>;
  let quarantineBucket = '';
  if (params.readerOverride) {
    readerPort = params.readerOverride;
  } else {
    const reader = getStorageAdapterForRole('reader');
    if (!reader.ok) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-not-configured',
        title: 'Storage Not Configured',
        status: 503,
        detail: reader.reason,
        code: 'STORAGE_NOT_CONFIGURED',
        retryable: false,
      });
    }
    readerPort = reader.port;
    quarantineBucket = reader.runtime.buckets.quarantine;
  }

  const targetBucket = version.releasedBucket ? String(version.releasedBucket) : String(blob.bucket);
  const targetKey = version.releasedKey ? String(version.releasedKey) : String(blob.objectKey);
  if (
    (quarantineBucket && targetBucket === quarantineBucket) ||
    targetKey.startsWith('ingest/')
  ) {
    throw new StoragePortError({
      type: 'urn:adzunova:problems:storage-quarantine-blocked',
      title: 'Quarantine Access Forbidden',
      status: 403,
      detail: 'Quarantined objects can never be downloaded directly.',
      code: 'QUARANTINE_ACCESS_FORBIDDEN',
      retryable: false,
    });
  }

  const envTtl = Number.parseInt(process.env.R2_DOWNLOAD_URL_EXPIRY || '300', 10);
  const ttl = Math.max(1, Math.min(envTtl, HARD_MAX_PRESIGN_GET_TTL_SECONDS));
  const safeName = sanitizeDownloadFilename(asset.originalFileName || 'document.pdf');
  const disposition = `attachment; filename="${safeName}"`;
  const url = await readerPort.presignGet(targetBucket, targetKey, ttl, disposition);

  return {
    assetId: params.assetId,
    downloadUrl: url,
    expiresInSeconds: ttl,
    scanStatus: asset.scanStatus || 'NOT_SCANNED',
    fileName: safeName,
  };
}

export async function validateAndLinkBookingAttachments(params: {
  actor: AuthActor;
  bookingId: string;
  assetIds: string[];
}): Promise<void> {
  if (params.assetIds.length === 0) return;
  const db = await getStorageMongoDb();

  for (const assetId of params.assetIds) {
    if (!ObjectId.isValid(assetId)) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-invalid-attachment',
        title: 'Invalid Attachment',
        status: 400,
        detail: `Invalid attachment ID: ${assetId}`,
        code: 'INVALID_ATTACHMENT_ID',
        retryable: false,
      });
    }

    const assetOid = new ObjectId(assetId);
    const asset = await db.collection('storage_media_assets').findOne({
      _id: assetOid,
      tenantId: params.actor.tenantId,
      ownerId: params.actor.ownerId,
      deletedAt: null,
    });

    if (!asset) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-forbidden',
        title: 'Unauthorized Attachment',
        status: 403,
        detail: 'You do not own one or more attached files.',
        code: 'ATTACHMENT_OWNERSHIP_DENIED',
        retryable: false,
      });
    }

    if (asset.purpose !== 'campaign_deliverable_draft' && asset.purpose !== 'contract_pdf') {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-invalid-purpose',
        title: 'Invalid Attachment Purpose',
        status: 400,
        detail: `Asset purpose "${asset.purpose}" cannot be attached to a booking.`,
        code: 'INVALID_ATTACHMENT_PURPOSE',
        retryable: false,
      });
    }

    const existingOtherLink = await db.collection('storage_asset_links').findOne({
      assetId: assetOid,
      entityType: 'booking',
      entityId: { $ne: params.bookingId },
    });

    if (existingOtherLink) {
      throw new StoragePortError({
        type: 'urn:adzunova:problems:storage-attachment-reused',
        title: 'Attachment Already Linked',
        status: 409,
        detail: 'This file is already linked to another booking.',
        code: 'ATTACHMENT_REUSE_FORBIDDEN',
        retryable: false,
      });
    }

    const version = await db.collection('storage_asset_versions').findOne({ _id: asset.currentVersionId });
    await db.collection('storage_asset_links').updateOne(
      {
        entityType: 'booking',
        entityId: params.bookingId,
        fieldRole: 'brief_attachment',
        assetId: assetOid,
      },
      {
        $setOnInsert: {
          assetId: assetOid,
          blobId: version?.blobId ?? assetOid,
          entityType: 'booking',
          entityId: params.bookingId,
          fieldRole: 'brief_attachment',
          ownerType: params.actor.ownerType,
          ownerId: params.actor.ownerId,
          tenantId: params.actor.tenantId,
          visibility: 'PRIVATE',
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }
}

export async function listBookingAttachmentsStatus(params: {
  bookingId: string;
  assetIds: string[];
}): Promise<
  Array<{
    assetId: string;
    fileName: string;
    contentType: string;
    scanStatus: string;
    releaseStatus: string;
    canDownload: boolean;
    isOwnerTenant: string;
  }>
> {
  if (params.assetIds.length === 0) return [];
  const db = await getStorageMongoDb();
  const validOids = params.assetIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (validOids.length === 0) return [];

  const assets = await db
    .collection('storage_media_assets')
    .find({ _id: { $in: validOids }, deletedAt: null })
    .toArray();

  const results = [];
  for (const asset of assets) {
    const version = await db.collection('storage_asset_versions').findOne({ _id: asset.currentVersionId });
    const scanStatus = String(asset.scanStatus || 'NOT_SCANNED');
    const releaseStatus = String(version?.releaseStatus || asset.releaseStatus || 'BLOCKED');
    results.push({
      assetId: String(asset._id),
      fileName: String(asset.originalFileName || 'attachment'),
      contentType: String(version?.contentType || 'application/octet-stream'),
      scanStatus,
      releaseStatus,
      canDownload: scanStatus === 'CLEAN' && releaseStatus === 'RELEASED',
      isOwnerTenant: String(asset.tenantId),
    });
  }
  return results;
}

export function safeLogStorageError(context: string, err: unknown): void {
  const msg = scrubStorageSecrets(err instanceof Error ? err.message : String(err));
  console.error(`[storage:${context}]`, msg);
}
