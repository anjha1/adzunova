import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import net from 'node:net';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import path from 'node:path';
import { getStorageMongoDb } from '../../packages/storage-db/src/index';
import { runIndexBootstrap } from '../../packages/storage-db/src/index-bootstrap.mjs';
import { InMemoryFakeStorageAdapter } from '../../apps/web/src/lib/storage/testing/in-memory-fake';
import { ClamAVStreamAdapter, UnconfiguredScanAdapter } from '../../apps/web/src/lib/storage/scanner';
import { enqueueAssetScanJob, getScannerMetrics, processNextScanJob } from '../../apps/web/src/lib/storage/scan-worker';
import {
  issueAuthorizedDownloadUrl,
  validateAndLinkBookingAttachments,
} from '../../apps/web/src/lib/storage/upload-service';
import { TestScanAdapter } from '../helpers/test-scan-adapter';

const { ObjectId } = createRequire(path.resolve(process.cwd(), 'packages/storage-db/package.json'))('mongodb');

const QUARANTINE_BUCKET = 'adzunova-dev-quarantine';
const PRIVATE_BUCKET = 'adzunova-dev-private';
const TEST_BRAND = `brand_m5_${Date.now()}`;
const TEST_CREATOR = `creator_m5_${Date.now()}`;

async function seedQuarantinedPdfAsset(params) {
  const buf = Buffer.from(params.content, 'utf8');
  const sha256Hex = crypto.createHash('sha256').update(buf).digest('hex');
  const assetOid = new ObjectId();
  const assetId = assetOid.toHexString();
  const blobOid = new ObjectId();
  const versionOid = new ObjectId();
  const qKey = `ingest/test/${assetId}/payload.bin`;
  const now = new Date();

  await params.storage.put(QUARANTINE_BUCKET, qKey, buf, { contentType: 'application/pdf' });

  await params.db.collection('storage_asset_blobs').insertOne({
    _id: blobOid,
    sha256Hex,
    sizeBytes: buf.length,
    contentType: 'application/pdf',
    dataClass: 'internal',
    bucket: QUARANTINE_BUCKET,
    objectKey: qKey,
    storageClass: 'STANDARD',
    state: 'ACTIVE',
    refCount: 1,
    ownerType: 'BRAND',
    ownerId: params.ownerId,
    tenantId: params.tenantId,
    visibility: 'PRIVATE',
    createdAt: now,
    updatedAt: now,
  });

  const scanStatus = params.scanStatus ?? 'QUARANTINED';
  await params.db.collection('storage_asset_versions').insertOne({
    _id: versionOid,
    assetId: assetOid,
    versionNumber: 1,
    blobId: blobOid,
    sha256Hex,
    scanStatus,
    releaseStatus: 'BLOCKED',
    releasedBucket: null,
    releasedKey: null,
    tenantId: params.tenantId,
    ownerType: 'BRAND',
    ownerId: params.ownerId,
    createdBy: params.ownerId,
    visibility: 'PRIVATE',
    createdAt: now,
  });

  await params.db.collection('storage_media_assets').insertOne({
    _id: assetOid,
    assetUuid: crypto.randomUUID().replace(/-/g, ''),
    idempotencyKey: `idem_${assetId}`,
    ownerType: 'BRAND',
    ownerId: params.ownerId,
    tenantId: params.tenantId,
    visibility: 'PRIVATE',
    dataClass: 'internal',
    purpose: 'campaign_deliverable_draft',
    originalFileName: 'brief.pdf',
    scanStatus,
    releaseStatus: 'BLOCKED',
    currentVersionId: versionOid,
    status: 'ACTIVE',
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  return { assetId, assetOid, versionId: versionOid.toHexString(), versionOid, blobOid, sha256Hex, sizeBytes: buf.length, qKey };
}

test('M5 Quarantine, Malware Scanning & Release Gate (MongoDB rs0)', async (t) => {
  const boot = await runIndexBootstrap('up');
  assert.equal(boot.ok, true);
  const db = await getStorageMongoDb();
  const fakeStorage = new InMemoryFakeStorageAdapter();
  const brandActor = {
    userId: TEST_BRAND,
    tenantId: `brand:${TEST_BRAND}`,
    ownerType: 'BRAND',
    ownerId: TEST_BRAND,
  };
  const creatorActor = {
    userId: TEST_CREATOR,
    tenantId: `creator:${TEST_CREATOR}`,
    ownerType: 'CREATOR',
    ownerId: TEST_CREATOR,
  };

  t.after(async () => {
    await db.collection('storage_scan_jobs').deleteMany({ tenantId: brandActor.tenantId });
    await db.collection('storage_asset_links').deleteMany({ tenantId: brandActor.tenantId });
    await db.collection('storage_media_assets').deleteMany({ tenantId: brandActor.tenantId });
    await db.collection('storage_asset_versions').deleteMany({ tenantId: brandActor.tenantId });
    await db.collection('storage_asset_blobs').deleteMany({ tenantId: brandActor.tenantId });
    await db.client?.close?.();
  });

  await t.test('1. Quarantined file blocked -> duplicate enqueue deduped -> concurrent worker lease -> clean release & authorized download', async () => {
    const seeded = await seedQuarantinedPdfAsset({
      db,
      storage: fakeStorage,
      ownerId: TEST_BRAND,
      tenantId: brandActor.tenantId,
      content: '%PDF-1.4\nM5 clean attachment bytes\n%%EOF',
    });

    const bookingId = `bk_m5_${Date.now()}`;
    await validateAndLinkBookingAttachments({
      actor: brandActor,
      bookingId,
      assetIds: [seeded.assetId],
    });

    // Unauthorized reuse on another booking must fail with 409
    await assert.rejects(
      () =>
        validateAndLinkBookingAttachments({
          actor: brandActor,
          bookingId: `bk_other_${Date.now()}`,
          assetIds: [seeded.assetId],
        }),
      /already linked/
    );

    // Quarantined file must fail closed for both owner and counterparty
    await assert.rejects(
      () => issueAuthorizedDownloadUrl({ actor: creatorActor, assetId: seeded.assetId, bookingId }),
      /scan pending/
    );

    // Enqueue twice -> second is deduplicated
    const q1 = await enqueueAssetScanJob({
      assetId: seeded.assetId,
      versionId: seeded.versionId,
      versionNumber: 1,
      tenantId: brandActor.tenantId,
      purpose: 'campaign_deliverable_draft',
      quarantineBucket: QUARANTINE_BUCKET,
      quarantineKey: seeded.qKey,
      sha256Hex: seeded.sha256Hex,
      sizeBytes: seeded.sizeBytes,
      contentType: 'application/pdf',
    });
    const q2 = await enqueueAssetScanJob({
      assetId: seeded.assetId,
      versionId: seeded.versionId,
      versionNumber: 1,
      tenantId: brandActor.tenantId,
      purpose: 'campaign_deliverable_draft',
      quarantineBucket: QUARANTINE_BUCKET,
      quarantineKey: seeded.qKey,
      sha256Hex: seeded.sha256Hex,
      sizeBytes: seeded.sizeBytes,
      contentType: 'application/pdf',
    });
    assert.equal(q1.created, true);
    assert.equal(q2.created, false);
    assert.equal(q1.jobId, q2.jobId);

    // Run 2 concurrent workers -> exactly 1 claims & promotes
    const scanFake = new TestScanAdapter('CLEAN');
    const [w1, w2] = await Promise.all([
      processNextScanJob({
        workerId: 'worker-1',
        scanPortOverride: scanFake,
        storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
      }),
      processNextScanJob({
        workerId: 'worker-2',
        scanPortOverride: scanFake,
        storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
      }),
    ]);

    const processed = [w1, w2].filter((r) => r.processed);
    assert.equal(processed.length, 1);
    assert.equal(processed[0].outcome, 'CLEAN');

    // Quarantine object deleted after DB commit
    const qHead = await fakeStorage.head(QUARANTINE_BUCKET, seeded.qKey);
    assert.equal(qHead.exists, false);

    // Now creator (booking participant) can download via presigned URL; unlinked booking fails
    const dl = await issueAuthorizedDownloadUrl({
      actor: creatorActor,
      assetId: seeded.assetId,
      bookingId,
      readerOverride: fakeStorage,
    });
    assert.equal(dl.scanStatus, 'CLEAN');
    assert.ok(dl.downloadUrl.includes(PRIVATE_BUCKET));

    await assert.rejects(
      () =>
        issueAuthorizedDownloadUrl({
          actor: creatorActor,
          assetId: seeded.assetId,
          bookingId: 'bk_wrong',
          readerOverride: fakeStorage,
        }),
      /does not belong/
    );
  });

  await t.test('2. Missing scanner, timeout, unsupported size, hash mismatch, stale version, failed promotion retry', async () => {
    // (a) Unconfigured scanner fails closed
    const unconf = new UnconfiguredScanAdapter();
    const unconfVerdict = await unconf.scanStream({
      stream: Readable.from(Buffer.from('abc')),
      sizeBytes: 3,
      sha256Hex: 'a'.repeat(64),
      contentType: 'application/pdf',
      assetId: 'a1',
      versionNumber: 1,
    });
    assert.equal(unconfVerdict.status, 'SCAN_FAILED');
    assert.equal(unconfVerdict.reasonCode, 'SCANNER_NOT_CONFIGURED');

    // (b) ClamAVStreamAdapter rejects oversized files & handles socket timeout
    const oversized = new ClamAVStreamAdapter('127.0.0.1', 3310, 500, 10);
    const overVerdict = await oversized.scanStream({
      stream: Readable.from(Buffer.from('0123456789abcdef')),
      sizeBytes: 16,
      sha256Hex: 'b'.repeat(64),
      contentType: 'application/pdf',
      assetId: 'a2',
      versionNumber: 1,
    });
    assert.equal(overVerdict.status, 'REJECTED');
    assert.equal(overVerdict.reasonCode, 'SCAN_UNSUPPORTED_SIZE');

    const silentServer = net.createServer(() => {});
    await new Promise((resolve) => silentServer.listen(0, '127.0.0.1', resolve));
    const addr = silentServer.address();
    const timeoutClam = new ClamAVStreamAdapter('127.0.0.1', addr.port, 100, 1024);
    const timeoutVerdict = await timeoutClam.scanStream({
      stream: Readable.from(Buffer.from('hello')),
      sizeBytes: 5,
      sha256Hex: 'c'.repeat(64),
      contentType: 'application/pdf',
      assetId: 'a3',
      versionNumber: 1,
    });
    silentServer.close();
    assert.equal(timeoutVerdict.status, 'SCAN_FAILED');
    assert.equal(timeoutVerdict.reasonCode, 'SCANNER_TIMEOUT');

    // (c) Hash mismatch in quarantine -> REJECTED
    const tampered = await seedQuarantinedPdfAsset({
      db,
      storage: fakeStorage,
      ownerId: TEST_BRAND,
      tenantId: brandActor.tenantId,
      content: 'original bytes',
    });
    await fakeStorage.put(QUARANTINE_BUCKET, tampered.qKey, Buffer.from('tampered bytes'), {
      contentType: 'application/pdf',
    });
    await enqueueAssetScanJob({
      assetId: tampered.assetId,
      versionId: tampered.versionId,
      versionNumber: 1,
      tenantId: brandActor.tenantId,
      purpose: 'campaign_deliverable_draft',
      quarantineBucket: QUARANTINE_BUCKET,
      quarantineKey: tampered.qKey,
      sha256Hex: tampered.sha256Hex,
      sizeBytes: tampered.sizeBytes,
      contentType: 'application/pdf',
    });
    const tamperRes = await processNextScanJob({
      workerId: 'worker-tamper',
      scanPortOverride: new TestScanAdapter('CLEAN'),
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(tamperRes.outcome, 'REJECTED');

    // (d) Stale version job -> SUPERSEDED, never releases newer version
    const stale = await seedQuarantinedPdfAsset({
      db,
      storage: fakeStorage,
      ownerId: TEST_BRAND,
      tenantId: brandActor.tenantId,
      content: 'v1 bytes',
    });
    await enqueueAssetScanJob({
      assetId: stale.assetId,
      versionId: stale.versionId,
      versionNumber: 1,
      tenantId: brandActor.tenantId,
      purpose: 'campaign_deliverable_draft',
      quarantineBucket: QUARANTINE_BUCKET,
      quarantineKey: stale.qKey,
      sha256Hex: stale.sha256Hex,
      sizeBytes: stale.sizeBytes,
      contentType: 'application/pdf',
    });
    await db.collection('storage_media_assets').updateOne(
      { _id: stale.assetOid },
      { $set: { currentVersionId: new ObjectId() } }
    );
    const staleRes = await processNextScanJob({
      workerId: 'worker-stale',
      scanPortOverride: new TestScanAdapter('CLEAN'),
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(staleRes.outcome, 'SUPERSEDED');

    // (e) Failed promotion copy -> RETRY_SCHEDULED -> idempotent retry succeeds
    const promo = await seedQuarantinedPdfAsset({
      db,
      storage: fakeStorage,
      ownerId: TEST_BRAND,
      tenantId: brandActor.tenantId,
      content: '%PDF-1.4\nretry promotion\n%%EOF',
    });
    await enqueueAssetScanJob({
      assetId: promo.assetId,
      versionId: promo.versionId,
      versionNumber: 1,
      tenantId: brandActor.tenantId,
      purpose: 'campaign_deliverable_draft',
      quarantineBucket: QUARANTINE_BUCKET,
      quarantineKey: promo.qKey,
      sha256Hex: promo.sha256Hex,
      sizeBytes: promo.sizeBytes,
      contentType: 'application/pdf',
    });
    let failOnce = true;
    const flakyStorage = {
      get: fakeStorage.get.bind(fakeStorage),
      head: fakeStorage.head.bind(fakeStorage),
      delete: fakeStorage.delete.bind(fakeStorage),
      async copy(sb, sk, dbk, dk) {
        if (failOnce) {
          failOnce = false;
          throw new Error('Transient R2 copy error');
        }
        return fakeStorage.copy(sb, sk, dbk, dk);
      },
    };
    const r1 = await processNextScanJob({
      workerId: 'worker-flaky',
      scanPortOverride: new TestScanAdapter('CLEAN'),
      storageOverride: { port: flakyStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(r1.outcome, 'RETRY_SCHEDULED');
    // Force runAt to now so retry executes immediately
    await db.collection('storage_scan_jobs').updateOne(
      { jobId: r1.jobId },
      { $set: { runAt: new Date(0) } }
    );
    const r2 = await processNextScanJob({
      workerId: 'worker-flaky',
      scanPortOverride: new TestScanAdapter('CLEAN'),
      storageOverride: { port: flakyStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(r2.outcome, 'CLEAN');

    // (f) Legacy NOT_SCANNED asset fails closed
    const legacy = await seedQuarantinedPdfAsset({
      db,
      storage: fakeStorage,
      ownerId: TEST_BRAND,
      tenantId: brandActor.tenantId,
      content: 'legacy unscanned',
      scanStatus: 'NOT_SCANNED',
    });
    await assert.rejects(
      () => issueAuthorizedDownloadUrl({ actor: brandActor, assetId: legacy.assetId }),
      /scan pending/
    );

    const metrics = await getScannerMetrics();
    assert.equal(typeof metrics.pendingCount, 'number');
    assert.ok(metrics.rejectedCount >= 1);
    assert.ok(metrics.totalRetries >= 1);
  });
});
