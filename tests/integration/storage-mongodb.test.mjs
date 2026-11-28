import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';

const reqStorageDb = createRequire(path.resolve(process.cwd(), 'packages/storage-db/package.json'));
const { ObjectId } = reqStorageDb('mongodb');

import { getStoragePrisma, getStorageMongoDb } from '../../packages/storage-db/src/client.ts';
import { runIndexBootstrap } from '../../packages/storage-db/src/index-bootstrap.mjs';
import { runStorageMigrations } from '../../packages/storage-db/src/migration-runner.mjs';
import {
  AppendOnlyAssetEventRepository,
  incrementBlobRefCount,
  decrementBlobRefCountAndMaybeTombstone,
  reconcileBlobRefCounts,
} from '../../packages/storage-db/src/repositories.ts';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/adzunova_storage?replicaSet=rs0';
const dbName = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage';

test('Integration (MongoDB rs0): Storage metadata, append-only events, refCounts & migrations', async (t) => {
  const db = await getStorageMongoDb();
  const prisma = getStoragePrisma();

  const runId = crypto.randomBytes(4).toString('hex');
  const tenantId = `tenant_test_${runId}`;
  const assetOid = new ObjectId();
  const assetId = assetOid.toHexString();
  const blobHash = crypto.createHash('sha256').update(`blob-${runId}`).digest('hex');

  t.after(async () => {
    await db.collection('storage_asset_events').deleteMany({ tenantId }).catch(() => {});
    await db.collection('storage_asset_versions').deleteMany({ assetId: assetOid }).catch(() => {});
    await db.collection('storage_media_assets').deleteMany({ tenantId }).catch(() => {});
    await db.collection('storage_asset_blobs').deleteMany({ sha256Hex: blobHash }).catch(() => {});
    await prisma.$disconnect();
    await globalThis.storageMongoClient?.close?.();
  });

  await t.test('1. Index bootstrap verify passes and migrations dry-run succeeds', async () => {
    const verifyRes = await runIndexBootstrap('verify', uri, dbName);
    assert.equal(verifyRes.ok, true);

    const upDry = await runStorageMigrations('up', { dryRun: true }, uri, dbName);
    assert.equal(upDry.dryRun, true);
  });

  await t.test('2. Idempotency key uniqueness prevents duplicate asset creation', async () => {
    const idemp = `idemp-${runId}`;
    const doc = {
      _id: assetOid,
      assetUuid: `uuid-${runId}`,
      tenantId,
      ownerType: 'CREATOR',
      ownerId: 'creator_1',
      visibility: 'PRIVATE',
      dataClass: 'private_contract',
      purpose: 'contract_pdf',
      status: 'READY',
      idempotencyKey: idemp,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection('storage_media_assets').insertOne(doc);
    await assert.rejects(
      () => db.collection('storage_media_assets').insertOne({
        ...doc,
        _id: new ObjectId(),
        assetUuid: `uuid-2-${runId}`,
      }),
      (err) => err.code === 11000,
    );
  });

  await t.test('3. Append-only AssetEventRepository maintains SHA-256 hash chain', async () => {
    const repo = new AppendOnlyAssetEventRepository();
    await repo.insert({
      assetId,
      eventType: 'ASSET_CREATED',
      actorId: 'actor_1',
      ownerType: 'CREATOR',
      ownerId: 'creator_1',
      tenantId,
      visibility: 'PRIVATE',
      payload: { step: 1 },
    });
    await repo.insert({
      assetId,
      eventType: 'VERSION_COMMITTED',
      actorId: 'actor_1',
      ownerType: 'CREATOR',
      ownerId: 'creator_1',
      tenantId,
      visibility: 'PRIVATE',
      payload: { step: 2 },
    });

    const chain = await repo.verifyHashChain(assetId);
    assert.equal(chain.valid, true);
    assert.equal(chain.checked, 2);
  });

  await t.test('4. Atomic blob refCount increment, conditional decrement >= 0, tombstone & reconcile', async () => {
    const blobOid = new ObjectId();
    const blobId = blobOid.toHexString();
    await db.collection('storage_asset_blobs').insertOne({
      _id: blobOid,
      sha256Hex: blobHash,
      sizeBytes: 4096,
      contentType: 'application/pdf',
      dataClass: 'private_contract',
      bucket: 'adzunova-dev-private',
      objectKey: `private/contracts/0000/ent_1/${assetId}/v1/original.pdf`,
      storageClass: 'STANDARD',
      state: 'ACTIVE',
      refCount: 0,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const incRes = await incrementBlobRefCount(blobId);
    assert.equal(incRes, 1);

    const decRes = await decrementBlobRefCountAndMaybeTombstone(blobId);
    assert.equal(decRes.refCount, 0);
    assert.equal(decRes.tombstoned, true);

    // Second decrement must not go negative
    const dec2 = await decrementBlobRefCountAndMaybeTombstone(blobId);
    assert.equal(dec2.refCount, 0);

    const rec = await reconcileBlobRefCounts();
    assert.equal(typeof rec.checked, 'number');
  });

  await t.test('5. Transactional Prisma version creation & cross-tenant isolation returns null (403/404)', async () => {
    const version = await prisma.$transaction(async (tx) => {
      const v = await tx.assetVersion.create({
        data: {
          assetId,
          versionNumber: 1,
          blobId: new ObjectId().toHexString(),
          tenantId,
          ownerType: 'CREATOR',
          ownerId: 'creator_1',
          createdBy: 'creator_1',
          visibility: 'PRIVATE',
        },
      });
      await tx.mediaAsset.update({
        where: { id: assetId },
        data: { currentVersionId: v.id },
      });
      return v;
    });
    assert.equal(version.versionNumber, 1);

    const crossTenant = await prisma.mediaAsset.findFirst({
      where: { id: assetId, tenantId: 'other_tenant_forbidden' },
    });
    assert.equal(crossTenant, null);
  });
});
