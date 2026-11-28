import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { createRequire } from 'node:module';
import path from 'node:path';
import { AppendOnlyAssetEventRepository, getStorageMongoDb } from '@adzunova/storage-db';
import { getClassificationPolicy, type StoragePurpose } from './classification';
import { buildPrivateKey, computeTenantShard } from './keys';
import { getStorageAdapterForRole } from './runtime';
import { getScanAdapter, type ScanPort } from './scanner';
import type { ObjectStoragePort } from './port';

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
  };
  return map[mime.toLowerCase()] || 'bin';
}

const reqMongo = createRequire(path.resolve(process.cwd(), '../../packages/storage-db/package.json'));
const { ObjectId } = (() => {
  try {
    return reqMongo('mongodb');
  } catch {
    return createRequire(path.resolve(process.cwd(), 'packages/storage-db/package.json'))('mongodb');
  }
})();

export interface EnqueueScanJobInput {
  assetId: string;
  versionId: string;
  versionNumber: number;
  tenantId: string;
  purpose: string;
  quarantineBucket: string;
  quarantineKey: string;
  sha256Hex: string;
  sizeBytes: number;
  contentType: string;
}

export async function enqueueAssetScanJob(input: EnqueueScanJobInput): Promise<{ jobId: string; created: boolean }> {
  const db = await getStorageMongoDb();
  const dedupKey = `scan:${input.assetId}:v${input.versionNumber}:${input.sha256Hex}`;
  const jobId = `scn_${crypto.randomUUID()}`;
  const now = new Date();

  try {
    await db.collection('storage_scan_jobs').insertOne({
      jobId,
      dedupKey,
      assetId: new ObjectId(input.assetId),
      versionId: new ObjectId(input.versionId),
      versionNumber: input.versionNumber,
      tenantId: input.tenantId,
      purpose: input.purpose,
      quarantineBucket: input.quarantineBucket,
      quarantineKey: input.quarantineKey,
      sha256Hex: input.sha256Hex,
      sizeBytes: input.sizeBytes,
      contentType: input.contentType,
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 5,
      runAt: now,
      lockedBy: null,
      lockedUntil: null,
      lastError: null,
      verdictSignature: null,
      scannerProvider: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });
    return { jobId, created: true };
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      const existing = await db.collection('storage_scan_jobs').findOne({ dedupKey });
      if (existing) {
        return { jobId: String(existing.jobId), created: false };
      }
    }
    throw err;
  }
}

export interface ProcessScanResult {
  processed: boolean;
  jobId?: string;
  outcome?: 'CLEAN' | 'REJECTED' | 'RETRY_SCHEDULED' | 'DLQ' | 'SUPERSEDED';
  detail?: string;
}

export async function processNextScanJob(params: {
  workerId: string;
  leaseMs?: number;
  scanPortOverride?: ScanPort;
  storageOverride?: {
    port: Pick<ObjectStoragePort, 'get' | 'head' | 'copy' | 'delete'>;
    privateBucket: string;
  };
}): Promise<ProcessScanResult> {
  const db = await getStorageMongoDb();
  const jobs = db.collection('storage_scan_jobs');
  const assets = db.collection('storage_media_assets');
  const versions = db.collection('storage_asset_versions');
  const blobs = db.collection('storage_asset_blobs');
  const eventRepo = new AppendOnlyAssetEventRepository();

  const now = new Date();
  const leaseMs = params.leaseMs ?? 30_000;
  const lockedUntil = new Date(now.getTime() + leaseMs);

  const job = await jobs.findOneAndUpdate(
    {
      $or: [
        { status: 'PENDING', runAt: { $lte: now } },
        { status: 'LEASED', lockedUntil: { $lte: now } },
      ],
    },
    {
      $set: {
        status: 'LEASED',
        lockedBy: params.workerId,
        lockedUntil,
        updatedAt: now,
      },
    },
    { sort: { runAt: 1 }, returnDocument: 'after' }
  );

  if (!job) {
    return { processed: false };
  }

  const jobId = String(job.jobId);
  const assetIdHex = String(job.assetId);
  const versionIdHex = String(job.versionId);

  const asset = await assets.findOne({ _id: job.assetId, deletedAt: null });
  const version = await versions.findOne({ _id: job.versionId });

  // Stale / superseded check: never let an older version release a newer version
  if (
    !asset ||
    !version ||
    String(asset.currentVersionId) !== versionIdHex ||
    Number(version.versionNumber) !== Number(job.versionNumber) ||
    String(version.sha256Hex || job.sha256Hex) !== String(job.sha256Hex)
  ) {
    await jobs.updateOne(
      { jobId, lockedBy: params.workerId },
      {
        $set: {
          status: 'SUPERSEDED',
          lockedBy: null,
          lockedUntil: null,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
    return { processed: true, jobId, outcome: 'SUPERSEDED', detail: 'Asset version superseded' };
  }

  await assets.updateOne(
    { _id: asset._id, scanStatus: { $in: ['QUARANTINED', 'SCAN_FAILED'] } },
    { $set: { scanStatus: 'SCANNING', updatedAt: new Date() } }
  );

  let storagePort: Pick<ObjectStoragePort, 'get' | 'head' | 'copy' | 'delete'>;
  let privateBucket: string;
  if (params.storageOverride) {
    storagePort = params.storageOverride.port;
    privateBucket = params.storageOverride.privateBucket;
  } else {
    const adapter = getStorageAdapterForRole('processor');
    if (!adapter.ok) {
      return await scheduleRetryOrDlq(job, params.workerId, adapter.reason, true);
    }
    storagePort = adapter.port;
    privateBucket = adapter.runtime.buckets.private;
  }

  const scanPort = params.scanPortOverride ?? getScanAdapter();

  let computedHash = '';
  let streamedBytes = 0;
  let verdict;
  try {
    const obj = await storagePort.get(String(job.quarantineBucket), String(job.quarantineKey));
    const hasher = crypto.createHash('sha256');
    const tee = new PassThrough();
    obj.body.on('data', (chunk: Buffer | string) => {
      const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      streamedBytes += b.length;
      hasher.update(b);
    });
    obj.body.pipe(tee);

    verdict = await scanPort.scanStream({
      stream: tee,
      sizeBytes: Number(job.sizeBytes),
      sha256Hex: String(job.sha256Hex),
      contentType: String(job.contentType),
      assetId: assetIdHex,
      versionNumber: Number(job.versionNumber),
    });
    computedHash = hasher.digest('hex');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage stream failed';
    return await scheduleRetryOrDlq(job, params.workerId, msg, true);
  }

  // Integrity check: object bytes in quarantine must match recorded hash & size
  if (
    verdict.status === 'CLEAN' &&
    (computedHash !== String(job.sha256Hex) || streamedBytes !== Number(job.sizeBytes))
  ) {
    await jobs.updateOne(
      { jobId, lockedBy: params.workerId },
      {
        $set: {
          status: 'REJECTED',
          lastError: 'Quarantine object hash or size mismatch',
          scannerProvider: verdict.scannerProvider,
          lockedBy: null,
          lockedUntil: null,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
    await versions.updateOne(
      { _id: version._id },
      { $set: { scanStatus: 'REJECTED', releaseStatus: 'BLOCKED', updatedAt: new Date() } }
    );
    await assets.updateOne(
      { _id: asset._id, currentVersionId: version._id },
      { $set: { scanStatus: 'REJECTED', releaseStatus: 'BLOCKED', updatedAt: new Date() } }
    );
    return { processed: true, jobId, outcome: 'REJECTED', detail: 'Integrity hash mismatch' };
  }

  if (verdict.status === 'REJECTED') {
    const doneAt = new Date();
    await jobs.updateOne(
      { jobId, lockedBy: params.workerId },
      {
        $set: {
          status: 'REJECTED',
          lastError: verdict.detail,
          verdictSignature: verdict.signatureName ?? verdict.reasonCode,
          scannerProvider: verdict.scannerProvider,
          lockedBy: null,
          lockedUntil: null,
          completedAt: doneAt,
          updatedAt: doneAt,
        },
      }
    );
    await versions.updateOne(
      { _id: version._id },
      {
        $set: {
          scanStatus: 'REJECTED',
          releaseStatus: 'BLOCKED',
          rejectionCode: verdict.reasonCode,
          scannedAt: doneAt,
          updatedAt: doneAt,
        },
      }
    );
    await assets.updateOne(
      { _id: asset._id, currentVersionId: version._id },
      {
        $set: {
          scanStatus: 'REJECTED',
          releaseStatus: 'BLOCKED',
          updatedAt: doneAt,
        },
      }
    );
    await eventRepo.insert({
      assetId: assetIdHex,
      eventType: 'ASSET_SCAN_REJECTED',
      actorId: `worker:${params.workerId}`,
      ownerType: String(asset.ownerType),
      ownerId: String(asset.ownerId),
      tenantId: String(asset.tenantId),
      visibility: String(asset.visibility),
      payload: {
        versionNumber: Number(job.versionNumber),
        reasonCode: verdict.reasonCode,
        scannerProvider: verdict.scannerProvider,
      },
    });
    return { processed: true, jobId, outcome: 'REJECTED', detail: verdict.detail };
  }

  if (verdict.status === 'SCAN_FAILED') {
    return await scheduleRetryOrDlq(job, params.workerId, verdict.detail, verdict.retryable);
  }

  // verdict.status === 'CLEAN' -> Idempotent Two-Step Promotion to private R2
  const purpose = String(job.purpose) as StoragePurpose;
  const policy = getClassificationPolicy(purpose);
  const ext = mimeToExt(String(job.contentType));
  const shard = computeTenantShard(String(job.tenantId));
  const destKey = buildPrivateKey({
    domain: purpose,
    tenantShard: shard,
    entityId: String(asset.ownerId),
    assetId: assetIdHex,
    version: Number(job.versionNumber),
    ext,
  });

  try {
    const existingDest = await storagePort.head(privateBucket, destKey);
    if (!existingDest.exists) {
      await storagePort.copy(
        String(job.quarantineBucket),
        String(job.quarantineKey),
        privateBucket,
        destKey
      );
    }
    const verifiedDest = await storagePort.head(privateBucket, destKey);
    if (!verifiedDest.exists || (verifiedDest.contentLength !== undefined && verifiedDest.contentLength !== Number(job.sizeBytes))) {
      throw new Error('Promoted object verification failed');
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Promotion copy failed';
    return await scheduleRetryOrDlq(job, params.workerId, msg, true);
  }

  const releasedAt = new Date();
  await blobs.updateOne(
    { _id: version.blobId },
    {
      $set: {
        bucket: privateBucket,
        objectKey: destKey,
        dataClass: policy.dataClass,
        updatedAt: releasedAt,
      },
    }
  );
  await versions.updateOne(
    { _id: version._id },
    {
      $set: {
        scanStatus: 'CLEAN',
        releaseStatus: 'RELEASED',
        releasedBucket: privateBucket,
        releasedKey: destKey,
        scannerProvider: verdict.scannerProvider,
        scannedAt: releasedAt,
        updatedAt: releasedAt,
      },
    }
  );
  await assets.updateOne(
    { _id: asset._id, currentVersionId: version._id },
    {
      $set: {
        scanStatus: 'CLEAN',
        releaseStatus: 'RELEASED',
        updatedAt: releasedAt,
      },
    }
  );
  await jobs.updateOne(
    { jobId, lockedBy: params.workerId },
    {
      $set: {
        status: 'CLEAN',
        scannerProvider: verdict.scannerProvider,
        lockedBy: null,
        lockedUntil: null,
        completedAt: releasedAt,
        updatedAt: releasedAt,
      },
    }
  );

  // Best-effort cleanup of quarantine object ONLY after DB promotion is committed
  await storagePort.delete(String(job.quarantineBucket), String(job.quarantineKey)).catch(() => {});

  await eventRepo.insert({
    assetId: assetIdHex,
    eventType: 'ASSET_SCAN_CLEAN_RELEASED',
    actorId: `worker:${params.workerId}`,
    ownerType: String(asset.ownerType),
    ownerId: String(asset.ownerId),
    tenantId: String(asset.tenantId),
    visibility: String(asset.visibility),
    payload: {
      versionNumber: Number(job.versionNumber),
      sha256Hex: String(job.sha256Hex),
      scannerProvider: verdict.scannerProvider,
    },
  });

  return { processed: true, jobId, outcome: 'CLEAN', detail: 'Scanned clean and released to private R2' };
}

async function scheduleRetryOrDlq(
  job: Record<string, unknown>,
  workerId: string,
  errorDetail: string,
  retryable: boolean
): Promise<ProcessScanResult> {
  const db = await getStorageMongoDb();
  const jobs = db.collection('storage_scan_jobs');
  const assets = db.collection('storage_media_assets');
  const versions = db.collection('storage_asset_versions');

  const attempts = Number(job.attempts ?? 0) + 1;
  const maxAttempts = Number(job.maxAttempts ?? 5);
  const now = new Date();
  const jobId = String(job.jobId);

  if (!retryable || attempts >= maxAttempts) {
    await jobs.updateOne(
      { jobId, lockedBy: workerId },
      {
        $set: {
          status: 'DLQ',
          attempts,
          lastError: errorDetail,
          lockedBy: null,
          lockedUntil: null,
          updatedAt: now,
        },
      }
    );
    const versionOid = new ObjectId(String(job.versionId));
    const assetOid = new ObjectId(String(job.assetId));
    await versions.updateOne(
      { _id: versionOid },
      { $set: { scanStatus: 'SCAN_FAILED', releaseStatus: 'BLOCKED', updatedAt: now } }
    );
    await assets.updateOne(
      { _id: assetOid, currentVersionId: versionOid },
      { $set: { scanStatus: 'SCAN_FAILED', releaseStatus: 'BLOCKED', updatedAt: now } }
    );
    return { processed: true, jobId, outcome: 'DLQ', detail: errorDetail };
  }

  const backoffMs = Math.min(60_000, 1000 * Math.pow(2, attempts));
  const versionOid = new ObjectId(String(job.versionId));
  const assetOid = new ObjectId(String(job.assetId));
  await jobs.updateOne(
    { jobId, lockedBy: workerId },
    {
      $set: {
        status: 'PENDING',
        attempts,
        lastError: errorDetail,
        runAt: new Date(now.getTime() + backoffMs),
        lockedBy: null,
        lockedUntil: null,
        updatedAt: now,
      },
    }
  );
  await versions.updateOne(
    { _id: versionOid },
    { $set: { scanStatus: 'SCAN_FAILED', releaseStatus: 'BLOCKED', updatedAt: now } }
  );
  await assets.updateOne(
    { _id: assetOid, currentVersionId: versionOid },
    { $set: { scanStatus: 'SCAN_FAILED', releaseStatus: 'BLOCKED', updatedAt: now } }
  );
  return { processed: true, jobId, outcome: 'RETRY_SCHEDULED', detail: errorDetail };
}

export async function getScannerMetrics(): Promise<{
  scannerConfigured: boolean;
  scannerProvider: string;
  pendingCount: number;
  oldestPendingAgeSeconds: number;
  dlqCount: number;
  rejectedCount: number;
  totalRetries: number;
}> {
  const db = await getStorageMongoDb();
  const jobs = db.collection('storage_scan_jobs');
  const adapter = getScanAdapter();

  const [pendingCount, dlqCount, rejectedCount, oldestPending, retryAgg] = await Promise.all([
    jobs.countDocuments({ status: { $in: ['PENDING', 'LEASED'] } }),
    jobs.countDocuments({ status: 'DLQ' }),
    jobs.countDocuments({ status: 'REJECTED' }),
    jobs.find({ status: 'PENDING' }).sort({ createdAt: 1 }).limit(1).toArray(),
    jobs.aggregate([{ $group: { _id: null, retries: { $sum: '$attempts' } } }]).toArray(),
  ]);

  const oldestPendingAgeSeconds =
    oldestPending.length > 0
      ? Math.max(0, Math.floor((Date.now() - new Date(oldestPending[0].createdAt as Date).getTime()) / 1000))
      : 0;

  return {
    scannerConfigured: adapter.isConfigured(),
    scannerProvider: adapter.providerName,
    pendingCount,
    oldestPendingAgeSeconds,
    dlqCount,
    rejectedCount,
    totalRetries: Number(retryAgg[0]?.retries ?? 0),
  };
}
