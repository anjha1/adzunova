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

export const PAY_RAW_INDEX_SPECS = [
  {
    collection: 'pay_idempotency',
    name: 'uniq_pay_idempotency_scope_key',
    key: { scope: 1, key: 1 },
    unique: true,
  },
  {
    collection: 'pay_idempotency',
    name: 'ttl_pay_idempotency_expiresAt',
    key: { expiresAt: 1 },
    expireAfterSeconds: 0,
  },
  {
    collection: 'pay_rate_limit_buckets',
    name: 'uniq_pay_rate_limit_bucketKey',
    key: { bucketKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_rate_limit_buckets',
    name: 'ttl_pay_rate_limit_expiresAt',
    key: { expiresAt: 1 },
    expireAfterSeconds: 0,
  },
  {
    collection: 'pay_outbox_events',
    name: 'uniq_pay_outbox_eventId',
    key: { eventId: 1 },
    unique: true,
  },
  {
    collection: 'pay_outbox_events',
    name: 'idx_pay_outbox_poll',
    key: { status: 1, nextAttemptAt: 1, lockedUntil: 1 },
  },
  {
    collection: 'pay_consumed_events',
    name: 'uniq_pay_consumed_consumer_event',
    key: { consumerName: 1, eventId: 1 },
    unique: true,
  },
  {
    collection: 'pay_audit_events',
    name: 'uniq_pay_audit_seq',
    key: { seq: 1 },
    unique: true,
  },
  {
    collection: 'pay_audit_events',
    name: 'uniq_pay_audit_hash',
    key: { hash: 1 },
    unique: true,
  },
  {
    collection: 'pay_queue_jobs',
    name: 'uniq_pay_queue_dedupKey',
    key: { dedupKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_queue_jobs',
    name: 'idx_pay_queue_poll',
    key: { queueName: 1, status: 1, runAt: 1, lockedUntil: 1 },
  },
  {
    collection: 'pay_config_versions',
    name: 'uniq_pay_config_version',
    key: { version: 1 },
    unique: true,
  },
  {
    collection: 'pay_feature_flags',
    name: 'uniq_pay_feature_flag_key',
    key: { key: 1 },
    unique: true,
  },
  {
    collection: 'pay_daily_probe_counters',
    name: 'uniq_pay_daily_probe_dayKey',
    key: { dayKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_ledger_accounts',
    name: 'uniq_pay_ledger_accountKey',
    key: { accountKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_ledger_entries',
    name: 'uniq_pay_ledger_entryId',
    key: { entryId: 1 },
    unique: true,
  },
  {
    collection: 'pay_ledger_entries',
    name: 'uniq_pay_ledger_idempotencyKey',
    key: { idempotencyKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_ledger_lines',
    name: 'uniq_pay_ledger_line_entry_idx',
    key: { entryId: 1, lineIndex: 1 },
    unique: true,
  },
  {
    collection: 'pay_ledger_lines',
    name: 'idx_pay_ledger_lines_account_created',
    key: { accountKey: 1, createdAt: -1 },
  },
  {
    collection: 'pay_bookings',
    name: 'uniq_pay_booking_id',
    key: { bookingId: 1 },
    unique: true,
  },
  {
    collection: 'pay_bookings',
    name: 'uniq_pay_booking_open_brand_creator_item',
    key: { brandId: 1, creatorId: 1, itemKey: 1 },
    unique: true,
    partialFilterExpression: { isOpen: true },
  },
  {
    collection: 'pay_bookings',
    name: 'idx_pay_bookings_brand_created',
    key: { brandId: 1, createdAt: -1 },
  },
  {
    collection: 'pay_bookings',
    name: 'idx_pay_bookings_creator_created',
    key: { creatorId: 1, createdAt: -1 },
  },
  {
    collection: 'pay_bookings',
    name: 'idx_pay_bookings_status_expires',
    key: { status: 1, expiresAt: 1 },
  },
  {
    collection: 'pay_booking_events',
    name: 'uniq_pay_booking_event_id',
    key: { eventId: 1 },
    unique: true,
  },
  {
    collection: 'pay_booking_events',
    name: 'idx_pay_booking_events_booking_created',
    key: { bookingId: 1, createdAt: 1 },
  },
  {
    collection: 'pay_notifications',
    name: 'uniq_pay_notification_id',
    key: { notifId: 1 },
    unique: true,
  },
  {
    collection: 'pay_notifications',
    name: 'idx_pay_notifications_user_read',
    key: { userId: 1, readAt: 1, createdAt: -1 },
  },
  {
    collection: 'pay_agreements',
    name: 'uniq_pay_agreement_id',
    key: { agreementId: 1 },
    unique: true,
  },
  {
    collection: 'pay_agreements',
    name: 'uniq_pay_agreement_idempotencyKey',
    key: { idempotencyKey: 1 },
    unique: true,
  },
  {
    collection: 'pay_agreements',
    name: 'uniq_pay_agreement_active_booking',
    key: { bookingId: 1 },
    unique: true,
    partialFilterExpression: { isActive: true },
  },
  {
    collection: 'pay_agreements',
    name: 'idx_pay_agreements_status_expires',
    key: { status: 1, expiresAt: 1 },
  },
  {
    collection: 'pay_agreement_callbacks',
    name: 'uniq_pay_agreement_callback_id',
    key: { callbackId: 1 },
    unique: true,
  },
];

export async function runPaymentsIndexBootstrap(
  mode = 'up',
  uri = loadEnvUri(),
  dbName = process.env.PAYMENTS_MONGODB_DB_NAME || 'adzunova_payments'
) {
  if (!uri) throw new Error('MONGODB_URI is required for payments index bootstrap');
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(dbName);
    if (mode === 'up') {
      for (const spec of PAY_RAW_INDEX_SPECS) {
        const { collection, ...indexDef } = spec;
        await db.command({ createIndexes: collection, indexes: [indexDef] });
      }
      return { ok: true, mode, count: PAY_RAW_INDEX_SPECS.length };
    }

    if (mode === 'down') {
      for (const spec of PAY_RAW_INDEX_SPECS) {
        try {
          await db.collection(spec.collection).dropIndex(spec.name);
        } catch {
          // ignore if absent
        }
      }
      return { ok: true, mode, count: PAY_RAW_INDEX_SPECS.length };
    }

    if (mode === 'verify') {
      const missing = [];
      const present = [];
      for (const spec of PAY_RAW_INDEX_SPECS) {
        const cols = await db.listCollections({ name: spec.collection }).toArray();
        if (cols.length === 0) {
          missing.push(`${spec.collection}.${spec.name}`);
          continue;
        }
        const indexes = await db.collection(spec.collection).listIndexes().toArray();
        const found = indexes.some((idx) => idx.name === spec.name);
        if (found) present.push(`${spec.collection}.${spec.name}`);
        else missing.push(`${spec.collection}.${spec.name}`);
      }
      return { ok: missing.length === 0, mode, present, missing };
    }

    throw new Error(`Unknown index bootstrap mode: ${mode}`);
  } finally {
    await client.close();
  }
}

const isCli =
  process.argv[1] &&
  import.meta.url.endsWith(path.basename(process.argv[1]).replace(/\\/g, '/'));
if (isCli && process.argv[1].includes('payments-db')) {
  const mode = process.argv[2] || 'verify';
  runPaymentsIndexBootstrap(mode)
    .then((res) => {
      console.log(JSON.stringify(res, null, 2));
      if (!res.ok) process.exit(1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
