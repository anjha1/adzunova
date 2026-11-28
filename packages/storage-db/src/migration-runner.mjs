import { MongoClient } from 'mongodb';
import crypto from 'node:crypto';
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

export const STORAGE_MIGRATIONS = [
  {
    id: '0001_init_storage_collections',
    description: 'Create core storage_* collections if missing',
    up: async (db) => {
      const required = [
        'storage_media_assets',
        'storage_asset_versions',
        'storage_asset_blobs',
        'storage_asset_links',
        'storage_asset_events',
        'storage_upload_sessions',
        'storage_schema_migrations',
      ];
      const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));
      for (const name of required) {
        if (!existing.has(name)) {
          await db.createCollection(name);
        }
      }
    },
    down: async (db) => {
      const targets = [
        'storage_media_assets',
        'storage_asset_versions',
        'storage_asset_blobs',
        'storage_asset_links',
        'storage_asset_events',
        'storage_upload_sessions',
      ];
      const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));
      for (const name of targets) {
        if (existing.has(name)) {
          await db.dropCollection(name);
        }
      }
    },
  },
];

function computeChecksum(m) {
  return crypto
    .createHash('sha256')
    .update(`${m.id}:${m.description}:${m.up.toString()}:${m.down.toString()}`)
    .digest('hex');
}

export async function runStorageMigrations(
  direction = 'up',
  options = {},
  uri = loadEnvUri(),
  dbName = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage'
) {
  if (!uri) throw new Error('MONGODB_URI is required for storage migrations');
  const dryRun = Boolean(options.dryRun);
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const migCol = db.collection('storage_schema_migrations');
    const appliedDocs = await migCol.find({}).toArray();
    const appliedIds = new Set(appliedDocs.map((d) => d.id));
    const actions = [];

    if (direction === 'up') {
      for (const m of STORAGE_MIGRATIONS) {
        if (appliedIds.has(m.id)) continue;
        const checksum = computeChecksum(m);
        if (!dryRun) {
          await m.up(db);
          await migCol.insertOne({ id: m.id, checksum, appliedAt: new Date() });
        }
        actions.push({ id: m.id, action: 'up', checksum, dryRun });
      }
    } else if (direction === 'down') {
      for (const m of [...STORAGE_MIGRATIONS].reverse()) {
        if (!appliedIds.has(m.id)) continue;
        if (!dryRun) {
          await m.down(db);
          await migCol.deleteOne({ id: m.id });
        }
        actions.push({ id: m.id, action: 'down', dryRun });
      }
    } else {
      throw new Error(`Invalid migration direction: ${direction}`);
    }

    return { ok: true, direction, dryRun, actions };
  } finally {
    await client.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const dir = process.argv[2] || 'up';
  const dryRun = process.argv.includes('--dry-run');
  runStorageMigrations(dir, { dryRun })
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
