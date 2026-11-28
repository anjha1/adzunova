import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  getPaymentsMongoDb,
  closePaymentsDb,
  postLedgerEntry,
  getLedgerAccountBalance,
  verifyLedgerInvariants,
  verifyAuditHashChain,
} from '../../packages/payments-db/src/index.ts';
import { runPaymentsIndexBootstrap } from '../../packages/payments-db/src/index-bootstrap.mjs';
import { runPaymentsMigrations } from '../../packages/payments-db/src/migration-runner.mjs';
import { computeBookingQuote } from '../../packages/money/src/index.ts';

const TEST_DB_NAME = `adzunova_payments_m2_test_${process.pid}`;
process.env.PAYMENTS_MONGODB_DB_NAME = TEST_DB_NAME;

test.after(async () => {
  try {
    const db = await getPaymentsMongoDb();
    await db.dropDatabase();
  } finally {
    await closePaymentsDb();
  }
});

test('1. Setup M2 test database and verify golden quote vector', async () => {
  const mig = await runPaymentsMigrations({ direction: 'up', dbName: TEST_DB_NAME });
  assert.equal(mig.ok, true);
  const idx = await runPaymentsIndexBootstrap('up', undefined, TEST_DB_NAME);
  assert.equal(idx.ok, true);

  const quote = computeBookingQuote({
    basePricePaise: 2_500_000n,
    addonsPaise: [500_000n],
    brandFeeBps: 500,
    creatorFeeBps: 500,
    gstBps: 1800,
    tdsBps: 0,
  });
  assert.equal(quote.deliverableTotalPaise, 3_000_000n);
  assert.equal(quote.brandFeePaise, 150_000n);
  assert.equal(quote.gstPaise, 567_000n);
  assert.equal(quote.brandTotalPayablePaise, 3_717_000n);
  assert.equal(quote.creatorNetPayoutPaise, 2_850_000n);
  assert.equal(quote.platformRevenuePaise, 300_000n);
});

test('2. Double-entry ledger: post payment held, idempotent replay, and imbalance rejection', async () => {
  const bookingId = `bkg_${crypto.randomUUID()}`;
  const idemKey = `pay_capture_${bookingId}`;

  const first = await postLedgerEntry({
    idempotencyKey: idemKey,
    bookingId,
    eventType: 'PAYMENT_CAPTURED_TO_ESCROW',
    actorId: 'system_webhook',
    actorRole: 'SYSTEM',
    reason: 'Brand payment captured into escrow',
    lines: [
      {
        accountCode: 'BRAND_PAYMENT_CLEARING',
        ownerType: 'PLATFORM',
        ownerId: 'platform',
        direction: 'DEBIT',
        amountPaise: 3_717_000n,
      },
      {
        accountCode: 'ESCROW_HELD',
        ownerType: 'BRAND',
        ownerId: 'brand_1',
        direction: 'CREDIT',
        amountPaise: 3_717_000n,
      },
    ],
  });

  assert.equal(first.idempotentReplay, false);
  assert.equal(first.totalPaise, 3_717_000n);

  const replay = await postLedgerEntry({
    idempotencyKey: idemKey,
    bookingId,
    eventType: 'PAYMENT_CAPTURED_TO_ESCROW',
    actorId: 'system_webhook',
    actorRole: 'SYSTEM',
    reason: 'Duplicate webhook retry',
    lines: [
      {
        accountCode: 'BRAND_PAYMENT_CLEARING',
        ownerType: 'PLATFORM',
        ownerId: 'platform',
        direction: 'DEBIT',
        amountPaise: 3_717_000n,
      },
      {
        accountCode: 'ESCROW_HELD',
        ownerType: 'BRAND',
        ownerId: 'brand_1',
        direction: 'CREDIT',
        amountPaise: 3_717_000n,
      },
    ],
  });
  assert.equal(replay.idempotentReplay, true);
  assert.equal(replay.entryId, first.entryId);

  const escrowBal = await getLedgerAccountBalance({
    accountCode: 'ESCROW_HELD',
    ownerType: 'BRAND',
    ownerId: 'brand_1',
  });
  assert.equal(escrowBal.balancePaise, 3_717_000n);

  await assert.rejects(
    () =>
      postLedgerEntry({
        idempotencyKey: `bad_${crypto.randomUUID()}`,
        bookingId,
        eventType: 'BAD_ENTRY',
        actorId: 'system',
        actorRole: 'SYSTEM',
        reason: 'Imbalanced test',
        lines: [
          {
            accountCode: 'BRAND_PAYMENT_CLEARING',
            ownerType: 'PLATFORM',
            ownerId: 'platform',
            direction: 'DEBIT',
            amountPaise: 1000n,
          },
          {
            accountCode: 'ESCROW_HELD',
            ownerType: 'BRAND',
            ownerId: 'brand_1',
            direction: 'CREDIT',
            amountPaise: 999n,
          },
        ],
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'LEDGER_IMBALANCE' && err?.status === 422
  );
});

test('3. Release split, concurrent idempotency, and invariant checker (including corruption detection)', async () => {
  const bookingId = `bkg_${crypto.randomUUID()}`;

  // Hold first
  await postLedgerEntry({
    idempotencyKey: `hold_${bookingId}`,
    bookingId,
    eventType: 'PAYMENT_CAPTURED_TO_ESCROW',
    actorId: 'system',
    actorRole: 'SYSTEM',
    reason: 'Hold escrow',
    lines: [
      {
        accountCode: 'BRAND_PAYMENT_CLEARING',
        ownerType: 'PLATFORM',
        ownerId: 'platform',
        direction: 'DEBIT',
        amountPaise: 3_717_000n,
      },
      {
        accountCode: 'ESCROW_HELD',
        ownerType: 'BRAND',
        ownerId: 'brand_2',
        direction: 'CREDIT',
        amountPaise: 3_717_000n,
      },
    ],
  });

  // Release split: DR ESCROW_HELD 3717000 = CR CREATOR_PAYABLE 2850000 + CR PLATFORM_REVENUE 300000 + CR GST_PAYABLE 567000
  const concurrentKey = `release_${bookingId}`;
  const results = await Promise.all(
    [1, 2, 3].map(() =>
      postLedgerEntry({
        idempotencyKey: concurrentKey,
        bookingId,
        eventType: 'ESCROW_RELEASED',
        actorId: 'system',
        actorRole: 'SYSTEM',
        reason: 'Release escrow after verification',
        lines: [
          {
            accountCode: 'ESCROW_HELD',
            ownerType: 'BRAND',
            ownerId: 'brand_2',
            direction: 'DEBIT',
            amountPaise: 3_717_000n,
          },
          {
            accountCode: 'CREATOR_PAYABLE',
            ownerType: 'CREATOR',
            ownerId: 'creator_2',
            direction: 'CREDIT',
            amountPaise: 2_850_000n,
          },
          {
            accountCode: 'PLATFORM_REVENUE',
            ownerType: 'PLATFORM',
            ownerId: 'platform',
            direction: 'CREDIT',
            amountPaise: 300_000n,
          },
          {
            accountCode: 'GST_PAYABLE',
            ownerType: 'PLATFORM',
            ownerId: 'platform',
            direction: 'CREDIT',
            amountPaise: 567_000n,
          },
        ],
      }).catch((err) => err)
    )
  );

  // With concurrent unique index races, every call either succeeds (1 fresh + replays) or hits duplicate key if raced inside tx;
  // verify at least 1 succeeded and final balance is exact
  const successes = results.filter((r) => r && !(r instanceof Error));
  assert.ok(successes.length >= 1, 'At least one concurrent release must succeed');

  const creatorBal = await getLedgerAccountBalance({
    accountCode: 'CREATOR_PAYABLE',
    ownerType: 'CREATOR',
    ownerId: 'creator_2',
  });
  assert.equal(creatorBal.balancePaise, 2_850_000n);

  const brand2Escrow = await getLedgerAccountBalance({
    accountCode: 'ESCROW_HELD',
    ownerType: 'BRAND',
    ownerId: 'brand_2',
  });
  assert.equal(brand2Escrow.balancePaise, 0n);

  const invariants = await verifyLedgerInvariants();
  assert.equal(invariants.ok, true);
  assert.equal(invariants.globalDebitPaise, invariants.globalCreditPaise);

  const auditChain = await verifyAuditHashChain();
  assert.equal(auditChain.ok, true);

  // Inject corruption and confirm verifyLedgerInvariants catches it
  const db = await getPaymentsMongoDb();
  await db.collection('pay_ledger_accounts').updateOne(
    { accountKey: 'CREATOR_PAYABLE:CREATOR:creator_2:INR' },
    { $inc: { balancePaise: 100 } }
  );
  const corrupted = await verifyLedgerInvariants();
  assert.equal(corrupted.ok, false);
  assert.ok(corrupted.errors.some((e) => e.includes('Account projection mismatch')));
});
