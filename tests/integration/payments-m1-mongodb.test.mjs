import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  getPaymentsMongoDb,
  closePaymentsDb,
  beginIdempotentOperation,
  completeIdempotentOperation,
  appendPaymentAuditEvent,
  verifyAuditHashChain,
  enqueueOutboxEvent,
  claimNextOutboxEvent,
  markOutboxPublished,
  markOutboxFailed,
  consumeEventOnce,
  replayDlqOutboxEvent,
  MongoQueueAdapter,
  MongoRateLimitAdapter,
  consumeDailyProbeQuota,
  getActiveFeeConfig,
  isPaymentFeatureEnabled,
  recordConfigApproval,
  hasActiveConfigApproval,
} from '../../packages/payments-db/src/index.ts';
import { runPaymentsIndexBootstrap } from '../../packages/payments-db/src/index-bootstrap.mjs';
import { runPaymentsMigrations } from '../../packages/payments-db/src/migration-runner.mjs';
import { PaymentsWorker } from '../../apps/web/src/lib/payments/worker.ts';

const TEST_DB_NAME = `adzunova_payments_test_${process.pid}`;
process.env.PAYMENTS_MONGODB_DB_NAME = TEST_DB_NAME;

test.after(async () => {
  try {
    const db = await getPaymentsMongoDb();
    await db.dropDatabase();
  } finally {
    await closePaymentsDb();
  }
});

test('1. Payments migrations, index bootstrap verify, default fee config & feature flag', async () => {
  const mig = await runPaymentsMigrations({ direction: 'up', dbName: TEST_DB_NAME });
  assert.equal(mig.ok, true);
  assert.equal(mig.executed.includes('0001_m1_payments_foundation'), true);

  const idxVerify = await runPaymentsIndexBootstrap('verify', undefined, TEST_DB_NAME);
  assert.equal(idxVerify.ok, true);
  assert.equal(idxVerify.missing.length, 0);

  const cfg = await getActiveFeeConfig();
  assert.ok(cfg);
  assert.equal(cfg.version, 'cfg_2026_q4');
  assert.equal(cfg.brandFeeBps, 500);
  assert.equal(cfg.creatorFeeBps, 500);
  assert.equal(cfg.gstBps, 1800);

  const featureEnabled = await isPaymentFeatureEnabled('FEATURE_PAYMENTS');
  assert.equal(featureEnabled, false);
});

test('2. Idempotency concurrency: 5 parallel calls with same key acquire exactly once and replay', async () => {
  const key = `idem_${crypto.randomUUID()}`;
  const payload = { bookingId: 'bk_1', amountPaise: '3717000' };

  const results = await Promise.all(
    Array.from({ length: 5 }, () =>
      beginIdempotentOperation({ scope: 'test_create_order', key, requestPayload: payload })
    )
  );
  const acquired = results.filter((r) => r.state === 'ACQUIRED');
  assert.equal(acquired.length, 1);

  await completeIdempotentOperation({
    scope: 'test_create_order',
    key,
    statusCode: 201,
    body: { orderId: 'ord_123' },
  });

  const replay = await beginIdempotentOperation({
    scope: 'test_create_order',
    key,
    requestPayload: payload,
  });
  assert.equal(replay.state, 'REPLAY');
  assert.deepEqual(replay.response, { statusCode: 201, body: { orderId: 'ord_123' } });

  await assert.rejects(
    () =>
      beginIdempotentOperation({
        scope: 'test_create_order',
        key,
        requestPayload: { bookingId: 'bk_1', amountPaise: '9999999' },
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'IDEMPOTENCY_KEY_PAYLOAD_MISMATCH'
  );
});

test('3. Audit hash chain & owner live_probe approval record', async () => {
  await recordConfigApproval({
    approvalType: 'RAZORPAY_LIVE_PROBE',
    approvedBy: 'owner_test',
    scope: 'live_probe_unpaid_order_only',
    reason: 'Owner override ADR 0005',
  });
  assert.equal(await hasActiveConfigApproval('RAZORPAY_LIVE_PROBE'), true);

  await appendPaymentAuditEvent({
    actorId: 'system',
    actorRole: 'SYSTEM',
    action: 'TEST_AUDIT_STEP',
    resourceType: 'TEST',
    resourceId: 'res_1',
    payload: { note: 'clean', secret: 'rzp_live_SHOULDSCRUB99' },
  });

  const chain = await verifyAuditHashChain();
  assert.equal(chain.ok, true);
  assert.ok(chain.checked >= 2);
});

test('4. Outbox -> Worker lease -> Idempotent consumer -> DLQ -> Replay', async () => {
  const eventId = await enqueueOutboxEvent({
    eventType: 'TEST_EVENT',
    aggregateType: 'BOOKING',
    aggregateId: 'bk_outbox_1',
    payload: { step: 1 },
    maxAttempts: 2,
  });

  const c1 = await claimNextOutboxEvent('worker_a');
  assert.ok(c1);
  assert.equal(c1.eventId, eventId);
  assert.equal(await markOutboxFailed(c1, 'transient error 1'), 'RETRY');

  // Force nextAttemptAt to now for immediate second claim
  const db = await getPaymentsMongoDb();
  await db.collection('pay_outbox_events').updateOne({ eventId }, { $set: { nextAttemptAt: new Date() } });

  const c2 = await claimNextOutboxEvent('worker_b');
  assert.ok(c2);
  assert.equal(await markOutboxFailed(c2, 'permanent error 2'), 'DLQ');

  const replayed = await replayDlqOutboxEvent(eventId, 'admin_1');
  assert.equal(replayed, true);

  const worker = new PaymentsWorker('worker_c');
  let handled = 0;
  const tick = await worker.runOnce({
    onOutboxEvent: async () => {
      handled += 1;
    },
  });
  assert.equal(tick.outboxProcessed, 1);
  assert.equal(handled, 1);

  // Idempotent consumer executes once even when called twice
  let execCount = 0;
  const r1 = await consumeEventOnce({
    consumerName: 'test_consumer',
    eventId,
    handler: async () => {
      execCount += 1;
    },
  });
  const r2 = await consumeEventOnce({
    consumerName: 'test_consumer',
    eventId,
    handler: async () => {
      execCount += 1;
    },
  });
  assert.equal(r1.processed, true);
  assert.equal(r2.duplicate, true);
  assert.equal(execCount, 1);

  // Unused import check
  assert.equal(typeof markOutboxPublished, 'function');
});

test('5. MongoQueueAdapter atomic lease concurrency + MongoRateLimitAdapter + DailyProbeQuota', async () => {
  const queue = new MongoQueueAdapter();
  const dedupKey = `job_${crypto.randomUUID()}`;
  const e1 = await queue.enqueue({
    queueName: 'payments_default',
    jobType: 'TIMER_CHECK',
    dedupKey,
    payload: { bookingId: 'bk_q1' },
  });
  const e2 = await queue.enqueue({
    queueName: 'payments_default',
    jobType: 'TIMER_CHECK',
    dedupKey,
    payload: { bookingId: 'bk_q1' },
  });
  assert.equal(e1.enqueued, true);
  assert.equal(e2.enqueued, false);

  const leases = await Promise.all([
    queue.leaseNext('payments_default', 'w1'),
    queue.leaseNext('payments_default', 'w2'),
    queue.leaseNext('payments_default', 'w3'),
  ]);
  const winners = leases.filter(Boolean);
  assert.equal(winners.length, 1);
  assert.equal(await queue.ack(dedupKey, winners[0].lockedBy), true);

  const rl = new MongoRateLimitAdapter();
  const bucket = `rl_${crypto.randomUUID()}`;
  const rlResults = await Promise.all([
    rl.consume(bucket, 2, 60),
    rl.consume(bucket, 2, 60),
    rl.consume(bucket, 2, 60),
  ]);
  assert.equal(rlResults.filter((r) => r.allowed).length, 2);

  // Daily probe cap concurrency: cap=3, 5 concurrent calls -> 3 allowed
  const provider = `probe_${crypto.randomUUID().slice(0, 8)}`;
  const quotaCalls = await Promise.all(
    Array.from({ length: 5 }, () => consumeDailyProbeQuota(provider, 3))
  );
  assert.equal(quotaCalls.filter((q) => q.allowed).length, 3);
});
