#!/usr/bin/env node
import { createRequire } from 'node:module';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const reqStorageDb = createRequire(path.resolve(process.cwd(), 'packages/storage-db/package.json'));
const { MongoClient } = reqStorageDb('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/adzunova_storage?replicaSet=rs0';
const dbName = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage';
const requestedSeedDocs = Number.parseInt(process.env.SEED_DOCS || '1000000', 10);

function detectAtlasM0(connUri) {
  return connUri.includes('mongodb+srv://') && process.env.STORAGE_ATLAS_TIER !== 'M10+';
}

function getFreeDiskBytes(targetPath) {
  try {
    const stat = fs.statfsSync(targetPath);
    return Number(stat.bavail) * Number(stat.bsize);
  } catch {
    return Infinity;
  }
}

async function run() {
  const isAtlasM0 = detectAtlasM0(uri);
  const freeBytes = getFreeDiskBytes(path.resolve(process.cwd()));
  const minBytesFor1M = 2 * 1024 * 1024 * 1024; // 2 GB safety threshold

  let targetDocs = requestedSeedDocs;
  let capReason = null;
  if (isAtlasM0 && targetDocs > 200000) {
    targetDocs = 200000;
    capReason = 'Atlas M0 detected (512 MB limit)';
  } else if (freeBytes < minBytesFor1M && targetDocs > 200000) {
    targetDocs = 200000;
    capReason = `Low disk space (${(freeBytes / (1024 ** 3)).toFixed(2)} GB free < 2 GB)`;
  }

  console.log(`SEED TARGET: ${targetDocs.toLocaleString()} documents${capReason ? ` (capped from ${requestedSeedDocs.toLocaleString()}: ${capReason})` : ''}`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const assets = db.collection('storage_media_assets');
  const events = db.collection('storage_asset_events');

  const existing = await assets.countDocuments({ idempotencyKey: /^seed-hot-/ });
  if (existing < targetDocs) {
    const toInsert = targetDocs - existing;
    console.log(`Inserting ${toInsert.toLocaleString()} synthetic storage_media_assets docs in batches of 10,000...`);
    const batchSize = 10000;
    const baseTime = Date.UTC(2026, 0, 1);
    let inserted = 0;

    while (inserted < toInsert) {
      const count = Math.min(batchSize, toInsert - inserted);
      const batch = new Array(count);
      const eventBatch = new Array(Math.min(count, 2000));
      for (let i = 0; i < count; i++) {
        const idx = existing + inserted + i;
        const tenantIdx = idx % 100;
        const ownerIdx = idx % 500;
        const createdAt = new Date(baseTime + idx * 10);
        const assetId = crypto.createHash('md5').update(`seed-${idx}`).digest('hex').slice(0, 24);
        batch[i] = {
          _id: assetId,
          assetUuid: `seed-uuid-${idx}`,
          tenantId: `tenant_${tenantIdx}`,
          ownerType: 'CREATOR',
          ownerId: `creator_${ownerIdx}`,
          visibility: idx % 3 === 0 ? 'PUBLIC' : 'PRIVATE',
          dataClass: idx % 3 === 0 ? 'public_avatar' : 'private_contract',
          purpose: 'seed_benchmark',
          status: idx % 20 === 0 ? 'SOFT_DELETED' : 'READY',
          idempotencyKey: `seed-hot-${idx}`,
          currentVersionId: null,
          deletedAt: idx % 20 === 0 ? createdAt : null,
          expiresAt: null,
          createdAt,
          updatedAt: createdAt,
        };
        if (i < eventBatch.length) {
          eventBatch[i] = {
            assetId,
            tenantId: `tenant_${tenantIdx}`,
            eventType: 'ASSET_SEEDED',
            payload: { seq: idx },
            prevHash: '0'.repeat(64),
            eventHash: crypto.createHash('sha256').update(`ev-${idx}`).digest('hex'),
            createdAt,
          };
        }
      }
      await assets.insertMany(batch, { ordered: false }).catch(() => {});
      await events.insertMany(eventBatch, { ordered: false }).catch(() => {});
      inserted += count;
      if (inserted % 100000 === 0 || inserted === toInsert) {
        console.log(`  Seeded ${(existing + inserted).toLocaleString()} / ${targetDocs.toLocaleString()}`);
      }
    }
  } else {
    console.log(`Already seeded with ${existing.toLocaleString()} docs.`);
  }

  const totalAssets = await assets.countDocuments({});
  console.log(`\nRunning EXPLAIN ("executionStats") on dataset size: ${totalAssets.toLocaleString()} documents\n`);

  const queries = [
    {
      name: 'Hot Query 1: Owner listing (tenantId + ownerType + ownerId + createdAt DESC, non-deleted)',
      cursor: assets.find({ tenantId: 'tenant_1', ownerType: 'CREATOR', ownerId: 'creator_1', deletedAt: null }).sort({ createdAt: -1 }).limit(25),
    },
    {
      name: 'Hot Query 2: Keyset cursor pagination (page 2 after cursor)',
      cursor: assets.find({ tenantId: 'tenant_1', createdAt: { $lt: new Date(Date.UTC(2026, 0, 1) + 5000000) } }).sort({ createdAt: -1, _id: -1 }).limit(25),
    },
    {
      name: 'Hot Query 3: Idempotency key exact lookup',
      cursor: assets.find({ idempotencyKey: 'seed-hot-12345' }).limit(1),
    },
    {
      name: 'Hot Query 4: Append-only asset_events timeline for assetId',
      cursor: events.find({ assetId: crypto.createHash('md5').update('seed-0').digest('hex').slice(0, 24) }).sort({ createdAt: 1 }).limit(50),
    },
  ];

  const findIxScan = (plan) => {
    if (!plan) return null;
    if (plan.stage === 'IXSCAN' || plan.stage === 'COLLSCAN') return plan;
    return findIxScan(plan.inputStage) || (plan.inputStages && plan.inputStages.map(findIxScan).find(Boolean)) || null;
  };

  for (const q of queries) {
    const exp = await q.cursor.explain('executionStats');
    const stats = exp.executionStats || {};
    const leaf = findIxScan(exp.queryPlanner?.winningPlan) || exp.queryPlanner?.winningPlan;
    const stage = leaf?.stage || 'UNKNOWN';
    const indexName = leaf?.indexName || 'N/A';
    console.log(`=== ${q.name} ===`);
    console.log(JSON.stringify({
      winningStage: stage,
      indexName,
      nReturned: stats.nReturned,
      totalKeysExamined: stats.totalKeysExamined,
      totalDocsExamined: stats.totalDocsExamined,
      executionTimeMillis: stats.executionTimeMillis,
    }, null, 2));
  }

  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
