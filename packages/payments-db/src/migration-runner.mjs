import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { runPaymentsIndexBootstrap } from './index-bootstrap.mjs';

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

const MIGRATIONS = [
  {
    version: '0001_m1_payments_foundation',
    name: 'Bootstrap payments indexes, default fee config cfg_2026_q4, and FEATURE_PAYMENTS=false',
    async up(db, uri, dbName) {
      await runPaymentsIndexBootstrap('up', uri, dbName);
      const now = new Date();
      await db.collection('pay_config_versions').updateOne(
        { version: 'cfg_2026_q4' },
        {
          $setOnInsert: {
            version: 'cfg_2026_q4',
            brandFeeBps: 500,
            creatorFeeBps: 500,
            gstBps: 1800,
            defaultTdsBps: 0,
            offerExpiryHours: 72,
            signWindowHours: 120,
            paymentWindowHours: 48,
            reviewSlaHours: 120,
            holdPeriodHours: 168,
            disputeWindowHours: 168,
            minWithdrawalPaise: 50000n,
            isActive: true,
            createdBy: 'system:migration',
            createdAt: now,
          },
        },
        { upsert: true }
      );
      await db.collection('pay_feature_flags').updateOne(
        { key: 'FEATURE_PAYMENTS' },
        {
          $setOnInsert: {
            key: 'FEATURE_PAYMENTS',
            enabled: false,
            updatedBy: 'system:migration',
            reason: 'Phase 1 default off until go-live gate passes',
            updatedAt: now,
            createdAt: now,
          },
        },
        { upsert: true }
      );
    },
    async down(db) {
      await db.collection('pay_migrations').deleteOne({ version: '0001_m1_payments_foundation' });
    },
  },
];

export async function runPaymentsMigrations({
  direction = 'up',
  dryRun = false,
  uri = loadEnvUri(),
  dbName = process.env.PAYMENTS_MONGODB_DB_NAME || 'adzunova_payments',
} = {}) {
  if (!uri) throw new Error('MONGODB_URI is required for payments migrations');
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    const applied = await db.collection('pay_migrations').find({}).toArray();
    const appliedVersions = new Set(applied.map((m) => m.version));
    const plan = [];

    if (direction === 'up') {
      for (const mig of MIGRATIONS) {
        if (!appliedVersions.has(mig.version)) {
          plan.push(mig.version);
          if (!dryRun) {
            await mig.up(db, uri, dbName);
            await db.collection('pay_migrations').insertOne({
              version: mig.version,
              name: mig.name,
              appliedAt: new Date(),
            });
          }
        }
      }
    } else if (direction === 'down') {
      const reversed = [...MIGRATIONS].reverse();
      for (const mig of reversed) {
        if (appliedVersions.has(mig.version)) {
          plan.push(mig.version);
          if (!dryRun) {
            await mig.down(db);
          }
          break;
        }
      }
    }
    return { ok: true, direction, dryRun, executed: plan };
  } finally {
    await client.close();
  }
}

const isCli =
  process.argv[1] &&
  import.meta.url.endsWith(path.basename(process.argv[1]).replace(/\\/g, '/'));
if (isCli && process.argv[1].includes('payments-db')) {
  const direction = process.argv[2] || 'up';
  const dryRun = process.argv.includes('--dry-run');
  runPaymentsMigrations({ direction, dryRun })
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
