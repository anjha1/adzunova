import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  getPaymentsMongoDb,
  closePaymentsDb,
  createBookingRequest,
  acceptBooking,
  rejectBooking,
  counterBooking,
  expireBooking,
  getBookingWithEvents,
  listBookingsForUser,
  listUserNotifications,
  verifyAuditHashChain,
} from '../../packages/payments-db/src/index.ts';
import { runPaymentsIndexBootstrap } from '../../packages/payments-db/src/index-bootstrap.mjs';
import { runPaymentsMigrations } from '../../packages/payments-db/src/migration-runner.mjs';

const TEST_DB_NAME = `adzunova_bookings_m3_test_${process.pid}`;
process.env.PAYMENTS_MONGODB_DB_NAME = TEST_DB_NAME;

test.after(async () => {
  try {
    const db = await getPaymentsMongoDb();
    await db.dropDatabase();
  } finally {
    await closePaymentsDb();
  }
});

test('1. Setup M3 booking database & indexes', async () => {
  const mig = await runPaymentsMigrations({ direction: 'up', dbName: TEST_DB_NAME });
  assert.equal(mig.ok, true);
  const idx = await runPaymentsIndexBootstrap('up', undefined, TEST_DB_NAME);
  assert.equal(idx.ok, true);
});

test('2. Full booking lifecycle: create, duplicate block, counter (max 3), accept, reject, expire', async () => {
  const brandId = `brand_${crypto.randomUUID()}`;
  const creatorId = `creator_${crypto.randomUUID()}`;

  // Negotiable item booking
  const b1 = await createBookingRequest({
    brandId,
    brandName: 'Acme Corp',
    creatorId,
    creatorName: 'Creator One',
    creatorSlug: 'creator-one',
    itemKind: 'RATE_CARD_ITEM',
    itemKey: 'item_neg_1',
    rateCardItemId: 'item_neg_1',
    itemTitle: 'Instagram Reel',
    pricingType: 'NEGOTIABLE',
    selectedAddons: [],
    quantity: 1,
    deliveryDate: '2026-12-20',
    brief: 'Launch campaign brief. Contact test@acme.com or +919988776655.',
    referenceLinks: ['https://acme.example/brief'],
    assetIds: [],
    quoteSnapshot: { basePrice: 25000, totalBrandPayable: 30975, creatorNetPayout: 23750 },
    feeConfigVersion: 'cfg_2026_q4',
    rateCardItemVersion: 1,
  });

  assert.equal(b1.status, 'REQUESTED');
  assert.equal(b1.contactMaskedCount, 2);
  assert.equal(b1.brief.includes('test@acme.com'), false);

  // Duplicate open request blocked -> 409
  await assert.rejects(
    () =>
      createBookingRequest({
        brandId,
        brandName: 'Acme Corp',
        creatorId,
        creatorName: 'Creator One',
        itemKind: 'RATE_CARD_ITEM',
        itemKey: 'item_neg_1',
        rateCardItemId: 'item_neg_1',
        itemTitle: 'Instagram Reel',
        pricingType: 'NEGOTIABLE',
        selectedAddons: [],
        quantity: 1,
        deliveryDate: '2026-12-22',
        brief: 'Duplicate request should fail.',
        referenceLinks: [],
        assetIds: [],
        quoteSnapshot: { totalBrandPayable: 30975 },
        feeConfigVersion: 'cfg_2026_q4',
        rateCardItemVersion: 1,
      }),
    (err) => err?.status === 409 && err?.code === 'DUPLICATE_BOOKING_REQUEST'
  );

  // 72h expiry timer queued
  const db = await getPaymentsMongoDb();
  const job = await db
    .collection('pay_queue_jobs')
    .findOne({ dedupKey: `booking:${b1.bookingId}:expire:r0` });
  assert.ok(job, '72h expiry queue job must be scheduled');

  // Counter 3 rounds
  for (let r = 1; r <= 3; r++) {
    const c = await counterBooking({
      bookingId: b1.bookingId,
      creatorId,
      newDeliveryDate: `2026-12-2${r}`,
      newQuoteSnapshot: { basePrice: 27000 + r * 1000, creatorNetPayout: 25650 },
      proposedPriceInr: 27000 + r * 1000,
      note: `Counter round ${r}`,
    });
    assert.equal(c.status, 'COUNTERED');
    assert.equal(c.counterRound, r);
  }

  // 4th counter -> 409 MAX_COUNTER_ROUNDS_EXCEEDED
  await assert.rejects(
    () =>
      counterBooking({
        bookingId: b1.bookingId,
        creatorId,
        newQuoteSnapshot: { basePrice: 35000 },
        proposedPriceInr: 35000,
      }),
    (err) => err?.status === 409 && err?.code === 'MAX_COUNTER_ROUNDS_EXCEEDED'
  );

  // Accept
  const accepted = await acceptBooking({ bookingId: b1.bookingId, creatorId });
  assert.equal(accepted.status, 'ACCEPTED');
  assert.equal(accepted.isOpen, false);

  // Fixed-price item rejects price counter, allows reject with reason
  const b2 = await createBookingRequest({
    brandId,
    brandName: 'Acme Corp',
    creatorId,
    creatorName: 'Creator One',
    itemKind: 'RATE_CARD_ITEM',
    itemKey: 'item_fixed_2',
    rateCardItemId: 'item_fixed_2',
    itemTitle: 'YouTube Short',
    pricingType: 'FIXED',
    selectedAddons: [],
    quantity: 1,
    deliveryDate: '2026-12-25',
    brief: 'Fixed deliverable brief for product review.',
    referenceLinks: [],
    assetIds: [],
    quoteSnapshot: { basePrice: 15000, totalBrandPayable: 18585, creatorNetPayout: 14250 },
    feeConfigVersion: 'cfg_2026_q4',
    rateCardItemVersion: 1,
  });

  await assert.rejects(
    () =>
      counterBooking({
        bookingId: b2.bookingId,
        creatorId,
        newQuoteSnapshot: { basePrice: 20000 },
        proposedPriceInr: 20000,
      }),
    (err) => err?.status === 409 && err?.code === 'FIXED_PRICE_CANNOT_BE_COUNTERED'
  );

  const rejected = await rejectBooking({
    bookingId: b2.bookingId,
    creatorId,
    reason: 'Timeline unavailable',
  });
  assert.equal(rejected.status, 'REJECTED');

  // Expiry transition
  const b3 = await createBookingRequest({
    brandId,
    brandName: 'Acme Corp',
    creatorId,
    creatorName: 'Creator One',
    itemKind: 'PACKAGE',
    itemKey: 'pkg_3',
    packageId: 'pkg_3',
    itemTitle: 'Combo Bundle',
    pricingType: 'FIXED',
    selectedAddons: [],
    quantity: 1,
    deliveryDate: '2026-12-28',
    brief: 'Bundle campaign brief for Q4 launch.',
    referenceLinks: [],
    assetIds: [],
    quoteSnapshot: { basePrice: 40000, totalBrandPayable: 49560, creatorNetPayout: 38000 },
    feeConfigVersion: 'cfg_2026_q4',
    rateCardItemVersion: 1,
  });
  const expired = await expireBooking(b3.bookingId);
  assert.equal(expired.status, 'EXPIRED');

  // Events timeline + listing + notifications + audit hash chain
  const details = await getBookingWithEvents(b1.bookingId);
  assert.equal(details?.events.length, 5); // REQUESTED + 3x COUNTERED + ACCEPTED

  const brandList = await listBookingsForUser({ userId: brandId, role: 'BRAND' });
  assert.equal(brandList.items.length, 3);

  const brandNotifs = await listUserNotifications(brandId);
  assert.ok(brandNotifs.length >= 4);

  const auditChain = await verifyAuditHashChain();
  assert.equal(auditChain.ok, true);
});
