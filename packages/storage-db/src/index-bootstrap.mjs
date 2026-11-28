import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';

function loadEnvUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  for (const candidate of ['.env.local', '.env']) {
    const p = path.resolve(candidate);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (t.startsWith('MONGODB_URI=')) {
        return t.slice('MONGODB_URI='.length).trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return '';
}

export const RAW_INDEX_SPECS = [
  {
    collection: 'storage_upload_sessions',
    name: 'ttl_upload_sessions_expiresAt',
    key: { expiresAt: 1 },
    expireAfterSeconds: 0,
  },
  {
    collection: 'storage_media_assets',
    name: 'ttl_exports_media_assets_expiresAt',
    key: { expiresAt: 1 },
    expireAfterSeconds: 0,
    partialFilterExpression: { purpose: 'async_export' },
  },
  {
    collection: 'storage_asset_blobs',
    name: 'partial_active_blobs_tenant_createdAt',
    key: { tenantId: 1, createdAt: -1 },
    partialFilterExpression: { state: 'ACTIVE' },
  },
  {
    collection: 'storage_media_assets',
    name: 'partial_non_deleted_assets_owner',
    key: { tenantId: 1, ownerType: 1, ownerId: 1, createdAt: -1 },
    partialFilterExpression: { deletedAt: null },
  },
  {
    collection: 'storage_media_assets',
    name: 'idx_media_assets_tenant_keyset',
    key: { tenantId: 1, createdAt: -1, _id: -1 },
  },
  {
    collection: 'storage_scan_jobs',
    name: 'uniq_storage_scan_job_id',
    key: { jobId: 1 },
    unique: true,
  },
  {
    collection: 'storage_scan_jobs',
    name: 'uniq_storage_scan_dedupKey',
    key: { dedupKey: 1 },
    unique: true,
  },
  {
    collection: 'storage_scan_jobs',
    name: 'idx_storage_scan_poll',
    key: { status: 1, runAt: 1, lockedUntil: 1 },
  },
  {
    collection: 'storage_scan_jobs',
    name: 'idx_storage_scan_asset_ver',
    key: { assetId: 1, versionNumber: 1 },
  },
];

export async function runIndexBootstrap(mode = 'up', uri = loadEnvUri(), dbName = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage') {
  if (!uri) throw new Error('MONGODB_URI is required for index bootstrap');
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    if (mode === 'up') {
      for (const spec of RAW_INDEX_SPECS) {
        const { collection, ...indexDef } = spec;
        await db.command({ createIndexes: collection, indexes: [indexDef] });
      }
      return { ok: true, mode, count: RAW_INDEX_SPECS.length };
    }

    if (mode === 'down') {
      for (const spec of RAW_INDEX_SPECS) {
        try {
          await db.collection(spec.collection).dropIndex(spec.name);
        } catch {
          // ignore if already absent
        }
      }
      return { ok: true, mode, count: RAW_INDEX_SPECS.length };
    }

    if (mode === 'verify') {
      const missing = [];
      const present = [];
      for (const spec of RAW_INDEX_SPECS) {
        const cols = await db.listCollections({ name: spec.collection }).toArray();
        if (cols.length === 0) {
          missing.push(`${spec.collection}.${spec.name}`);
          continue;
        }
        const existing = await db.collection(spec.collection).indexes();
        const found = existing.some((ix) => ix.name === spec.name);
        if (found) present.push(`${spec.collection}.${spec.name}`);
        else missing.push(`${spec.collection}.${spec.name}`);
      }
      return { ok: missing.length === 0, mode, present, missing };
    }

    throw new Error(`Unknown index-bootstrap mode: ${mode}`);
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const mode = process.argv[2] || 'verify';
  runIndexBootstrap(mode)
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
      if (!res.ok) process.exit(1);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
