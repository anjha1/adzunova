import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  acceptBooking,
  attachProviderOrderToAttempt,
  beginAgreementGeneration,
  beginOrReusePaymentAttempt,
  cancelBooking,
  cancelOrFailPaymentAttempt,
  closePaymentsDb,
  createBookingRequest,
  finalizeAgreementPdf,
  getBookingPaymentSummary,
  getBookingWithEvents,
  getPaymentsMongoDb,
  markAttemptVerificationPending,
  postLedgerEntry,
  processVerifiedPaymentWebhook,
  recordVerifiedAgreementSignature,
  runPaymentReconciliation,
  verifyLedgerInvariants,
} from '../../packages/payments-db/src/index';
import { runPaymentsIndexBootstrap } from '../../packages/payments-db/src/index-bootstrap.mjs';
import { loadPaymentsEnv } from '../../apps/web/src/lib/payments/env';
import { RazorpayGatewayAdapter } from '../../apps/web/src/lib/payments/razorpay-adapter';

const BRAND_ID = `brand_m6_${Date.now()}`;
const CREATOR_ID = `creator_m6_${Date.now()}`;
const OUTSIDER_BRAND = `outsider_m6_${Date.now()}`;
const TEST_KEY_ID = 'rzp_test_m6UnitKey000001';
const TEST_KEY_SECRET = 'rzp_test_m6_secret_0000000000000001';
const TEST_WEBHOOK_SECRET = 'rzp_test_m6_whsec_0000000000000001';

const quoteSnap = {
  breakdown: {
    basePrice: 10000,
    addonsTotal: 0,
    brandFeeAmount: 500,
    gstAmount: 1890,
    totalBrandPayable: 12390,
    creatorNetPayout: 9500,
  },
};

async function createSignedBooking(suffix) {
  const booking = await createBookingRequest({
    brandId: BRAND_ID,
    brandName: 'Acme M6 Brand',
    creatorId: CREATOR_ID,
    creatorName: 'Creator M6',
    itemKind: 'RATE_CARD_ITEM',
    itemKey: `rc_m6_${suffix}_${Date.now()}`,
    rateCardItemId: `rc_m6_${suffix}_${Date.now()}`,
    itemTitle: `Deliverable M6 ${suffix}`,
    pricingType: 'FIXED',
    selectedAddons: [],
    quantity: 1,
    deliveryDate: '2026-12-30',
    brief: 'M6 Razorpay test checkout verification brief.',
    referenceLinks: [],
    assetIds: [],
    quoteSnapshot: quoteSnap,
    feeConfigVersion: 'cfg_2026_q4',
    rateCardItemVersion: 1,
  });

  await acceptBooking({ bookingId: booking.bookingId, creatorId: CREATOR_ID });
  const begun = await beginAgreementGeneration({
    bookingId: booking.bookingId,
    actorId: BRAND_ID,
    actorRole: 'BRAND',
    termsSnapshot: { bookingId: booking.bookingId },
  });
  const sha = crypto.createHash('sha256').update(`m6-${booking.bookingId}`).digest('hex');
  await finalizeAgreementPdf({
    agreementId: begun.agreement.agreementId,
    bookingId: booking.bookingId,
    pdfBucket: 'adzunova-dev-private',
    pdfObjectKey: `private/m6/${begun.agreement.agreementId}.pdf`,
    pdfSha256: sha,
    pdfSizeBytes: 512,
    provider: 'UNCONFIGURED',
    actorId: BRAND_ID,
    actorRole: 'BRAND',
  });
  await recordVerifiedAgreementSignature({
    agreementId: begun.agreement.agreementId,
    bookingId: booking.bookingId,
    version: 1,
    pdfSha256: sha,
    signerRole: 'BRAND',
    signerId: BRAND_ID,
    callbackId: `m6_b_${booking.bookingId}`,
    provider: 'TEST',
    evidence: { ok: true },
  });
  await recordVerifiedAgreementSignature({
    agreementId: begun.agreement.agreementId,
    bookingId: booking.bookingId,
    version: 1,
    pdfSha256: sha,
    signerRole: 'CREATOR',
    signerId: CREATOR_ID,
    callbackId: `m6_c_${booking.bookingId}`,
    provider: 'TEST',
    evidence: { ok: true },
  });
  return booking;
}

test('M6 Razorpay Test-Mode Checkout, Webhooks, Ledger & Reconciliation (MongoDB rs0)', async (t) => {
  const boot = await runPaymentsIndexBootstrap('up');
  assert.equal(boot.ok, true);
  const db = await getPaymentsMongoDb();

  t.after(async () => {
    await db.collection('pay_bookings').deleteMany({ $or: [{ brandId: BRAND_ID }, { creatorId: CREATOR_ID }] });
    await db.collection('pay_agreements').deleteMany({});
    await db.collection('pay_agreement_callbacks').deleteMany({});
    await db.collection('pay_payment_attempts').deleteMany({ brandId: BRAND_ID });
    await db.collection('pay_webhook_events').deleteMany({});
    await db.collection('pay_reconciliation_items').deleteMany({});
    await closePaymentsDb();
  });

  await t.test('1. Env alias resolution (RAZORPAY_API_KEY/SECRET) + live-key refusal + signature verification', async () => {
    const env = loadPaymentsEnv({
      RAZORPAY_MODE: 'test',
      RAZORPAY_API_KEY: TEST_KEY_ID,
      RAZORPAY_API_SECRET: TEST_KEY_SECRET,
      NEXT_PUBLIC_RAZORPAY_KEY_ID: TEST_KEY_ID,
    });
    assert.equal(env.razorpayConfigured, true);
    assert.equal(env.razorpayPublicKeyId, TEST_KEY_ID);
    assert.equal(env.razorpayWebhookConfigured, false);

    assert.throws(
      () =>
        loadPaymentsEnv({
          RAZORPAY_MODE: 'test',
          RAZORPAY_API_KEY: 'rzp_live_00000000000001',
          RAZORPAY_API_SECRET: TEST_KEY_SECRET,
        }),
      /refused/
    );

    const noWhAdapter = new RazorpayGatewayAdapter({
      RAZORPAY_MODE: 'test',
      RAZORPAY_API_KEY: TEST_KEY_ID,
      RAZORPAY_API_SECRET: TEST_KEY_SECRET,
    });
    assert.throws(() => noWhAdapter.verifyWebhookSignature({ rawBody: '{}', signature: 'abc' }), /not configured/);

    const adapter = new RazorpayGatewayAdapter({
      RAZORPAY_MODE: 'test',
      RAZORPAY_API_KEY: TEST_KEY_ID,
      RAZORPAY_API_SECRET: TEST_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET,
    });

    const goodSig = crypto
      .createHmac('sha256', TEST_KEY_SECRET)
      .update('order_test_1|pay_test_1')
      .digest('hex');
    assert.equal(
      adapter.verifyCheckoutSignature({ orderId: 'order_test_1', paymentId: 'pay_test_1', signature: goodSig }),
      true
    );
    assert.equal(
      adapter.verifyCheckoutSignature({ orderId: 'order_test_1', paymentId: 'pay_test_1', signature: '0'.repeat(64) }),
      false
    );

    const rawBody = JSON.stringify({ event: 'payment.captured' });
    const whSig = crypto.createHmac('sha256', TEST_WEBHOOK_SECRET).update(rawBody).digest('hex');
    assert.equal(adapter.verifyWebhookSignature({ rawBody, signature: whSig }), true);
    assert.equal(adapter.verifyWebhookSignature({ rawBody, signature: '0'.repeat(64) }), false);
  });

  await t.test('2. Unauthorized/unsigned checkout blocked, concurrent attempt reuse, cancel/retry, and webhook -> FUNDS_SECURED', async () => {
    // Unsigned booking must fail checkout
    const unsigned = await createBookingRequest({
      brandId: BRAND_ID,
      brandName: 'Acme M6 Brand',
      creatorId: CREATOR_ID,
      creatorName: 'Creator M6',
      itemKind: 'RATE_CARD_ITEM',
      itemKey: `rc_m6_uns_${Date.now()}`,
      rateCardItemId: `rc_m6_uns_${Date.now()}`,
      itemTitle: 'Unsigned Item',
      pricingType: 'FIXED',
      selectedAddons: [],
      quantity: 1,
      deliveryDate: '2026-12-30',
      brief: 'Unsigned booking checkout block test.',
      referenceLinks: [],
      assetIds: [],
      quoteSnapshot: quoteSnap,
      feeConfigVersion: 'cfg_2026_q4',
      rateCardItemVersion: 1,
    });
    await assert.rejects(
      () => beginOrReusePaymentAttempt({ bookingId: unsigned.bookingId, brandId: BRAND_ID }),
      /must be SIGNED/
    );

    const signedBooking = await createSignedBooking('main');

    // Unauthorized brand rejected
    await assert.rejects(
      () => beginOrReusePaymentAttempt({ bookingId: signedBooking.bookingId, brandId: OUTSIDER_BRAND }),
      /Only the authorized brand/
    );

    // Concurrent checkout requests -> exactly 1 active attempt created/reused
    const [a1, a2] = await Promise.all([
      beginOrReusePaymentAttempt({ bookingId: signedBooking.bookingId, brandId: BRAND_ID }),
      beginOrReusePaymentAttempt({ bookingId: signedBooking.bookingId, brandId: BRAND_ID }),
    ]);
    assert.equal(a1.attempt.attemptId, a2.attempt.attemptId);
    assert.equal(a1.attempt.amountPaise, '1239000');

    // Cancel and retry creates a new attempt
    await cancelOrFailPaymentAttempt({
      bookingId: signedBooking.bookingId,
      brandId: BRAND_ID,
      attemptId: a1.attempt.attemptId,
      status: 'CANCELLED',
      reason: 'User dismissed modal',
    });

    const retried = await beginOrReusePaymentAttempt({ bookingId: signedBooking.bookingId, brandId: BRAND_ID });
    assert.notEqual(retried.attempt.attemptId, a1.attempt.attemptId);
    assert.equal(retried.reused, false);

    const orderId = `order_m6_${Date.now()}`;
    const paymentId = `pay_m6_${Date.now()}`;
    await attachProviderOrderToAttempt({
      attemptId: retried.attempt.attemptId,
      bookingId: signedBooking.bookingId,
      providerOrderId: orderId,
      actorId: BRAND_ID,
    });

    // Browser callback verification marks VERIFICATION_PENDING only (does NOT unlock work)
    const pending = await markAttemptVerificationPending({
      bookingId: signedBooking.bookingId,
      brandId: BRAND_ID,
      providerOrderId: orderId,
      providerPaymentId: paymentId,
    });
    assert.equal(pending.status, 'VERIFICATION_PENDING');
    const midBooking = await getBookingWithEvents(signedBooking.bookingId);
    assert.equal(midBooking?.booking.status, 'PAYMENT_PENDING');

    // Regression test: CAPTURED_NO_ROUTE persists capture & ledger, but keeps booking out of FUNDS_SECURED and blocks creator work
    const wHoldPending = await processVerifiedPaymentWebhook({
      eventId: `evt_cap_${Date.now()}`,
      eventType: 'payment.captured',
      orderId,
      paymentId,
      amountPaise: BigInt(1239000),
      currency: 'INR',
      providerStatus: 'captured',
      payloadHash: 'a'.repeat(64),
    });
    assert.equal(wHoldPending.outcome, 'CAPTURED_HOLD_PENDING');
    assert.ok(wHoldPending.receiptNumber?.startsWith('RCPT-'));

    const holdPendingSummary = await getBookingPaymentSummary({
      bookingId: signedBooking.bookingId,
      actorId: CREATOR_ID,
      actorRole: 'CREATOR',
    });
    assert.equal(holdPendingSummary.bookingStatus, 'PAYMENT_PENDING');
    assert.equal(holdPendingSummary.latestAttempt?.status, 'CAPTURED');
    assert.equal(holdPendingSummary.latestAttempt?.holdOrSettlementStatus, 'CAPTURED_NO_ROUTE');
    assert.equal(holdPendingSummary.holdNote, 'Payment received. Funds protection is pending.');

    // Duplicate eventId / order.paid for same (orderId, paymentId) -> same businessOpId, no double ledger posting
    const wDup = await processVerifiedPaymentWebhook({
      eventId: `evt_cap_dup_${Date.now()}`,
      eventType: 'order.paid',
      orderId,
      paymentId,
      amountPaise: BigInt(1239000),
      currency: 'INR',
      providerStatus: 'paid',
      payloadHash: 'b'.repeat(64),
      routeHoldVerified: true,
    });
    assert.equal(wDup.outcome, 'FUNDS_SECURED');

    const ledgerCount = await db
      .collection('pay_ledger_entries')
      .countDocuments({ bookingId: signedBooking.bookingId });
    assert.equal(ledgerCount, 1);

    const inv = await verifyLedgerInvariants();
    assert.equal(inv.ok, true);

    const summary = await getBookingPaymentSummary({
      bookingId: signedBooking.bookingId,
      actorId: CREATOR_ID,
      actorRole: 'CREATOR',
    });
    assert.equal(summary.bookingStatus, 'FUNDS_SECURED');
    assert.equal(summary.taxInvoiceStatus, 'NOT_CONFIGURED');
  });

  await t.test('3. Amount mismatch, late payment after cancellation, crash recovery, and reconciliation', async () => {
    // (a) Amount mismatch -> RECONCILIATION_REQUIRED
    const bMismatch = await createSignedBooking('mismatch');
    const attM = await beginOrReusePaymentAttempt({ bookingId: bMismatch.bookingId, brandId: BRAND_ID });
    const ordM = `order_mis_${Date.now()}`;
    await attachProviderOrderToAttempt({
      attemptId: attM.attempt.attemptId,
      bookingId: bMismatch.bookingId,
      providerOrderId: ordM,
      actorId: BRAND_ID,
    });
    const misRes = await processVerifiedPaymentWebhook({
      eventId: `evt_mis_${Date.now()}`,
      eventType: 'payment.captured',
      orderId: ordM,
      paymentId: `pay_mis_${Date.now()}`,
      amountPaise: BigInt(100), // wrong amount
      currency: 'INR',
      providerStatus: 'captured',
      payloadHash: 'c'.repeat(64),
    });
    assert.equal(misRes.outcome, 'RECONCILIATION_REQUIRED');

    // (b) Late payment after cancellation -> never reopens booking
    const bLate = await createSignedBooking('late');
    const attL = await beginOrReusePaymentAttempt({ bookingId: bLate.bookingId, brandId: BRAND_ID });
    const ordL = `order_late_${Date.now()}`;
    await attachProviderOrderToAttempt({
      attemptId: attL.attempt.attemptId,
      bookingId: bLate.bookingId,
      providerOrderId: ordL,
      actorId: BRAND_ID,
    });
    // Force booking cancelled in DB to simulate late arrival after cancellation
    await db.collection('pay_bookings').updateOne(
      { bookingId: bLate.bookingId },
      { $set: { status: 'CANCELLED', isOpen: false } }
    );
    const lateRes = await processVerifiedPaymentWebhook({
      eventId: `evt_late_${Date.now()}`,
      eventType: 'payment.captured',
      orderId: ordL,
      paymentId: `pay_late_${Date.now()}`,
      amountPaise: BigInt(1239000),
      currency: 'INR',
      providerStatus: 'captured',
      payloadHash: 'd'.repeat(64),
    });
    assert.equal(lateRes.outcome, 'RECONCILIATION_REQUIRED');
    const afterLate = await getBookingWithEvents(bLate.bookingId);
    assert.equal(afterLate?.booking.status, 'CANCELLED');

    // (c) Crash recovery: ledger already posted for businessOpId, booking still PAYMENT_PENDING -> retry completes FUNDS_SECURED
    const bCrash = await createSignedBooking('crash');
    const attC = await beginOrReusePaymentAttempt({ bookingId: bCrash.bookingId, brandId: BRAND_ID });
    const ordC = `order_crash_${Date.now()}`;
    const payC = `pay_crash_${Date.now()}`;
    await attachProviderOrderToAttempt({
      attemptId: attC.attempt.attemptId,
      bookingId: bCrash.bookingId,
      providerOrderId: ordC,
      actorId: BRAND_ID,
    });
    await postLedgerEntry({
      idempotencyKey: `payment_capture:${ordC}:${payC}`,
      bookingId: bCrash.bookingId,
      eventType: 'PAYMENT_CAPTURED',
      actorId: 'crash-sim',
      actorRole: 'SYSTEM',
      reason: 'Simulated pre-crash ledger commit',
      lines: [
        { accountCode: 'BRAND_PAYMENT_CLEARING', ownerType: 'BRAND', ownerId: BRAND_ID, direction: 'DEBIT', amountPaise: BigInt(1239000) },
        { accountCode: 'ESCROW_HELD', ownerType: 'PLATFORM', ownerId: 'adzunova', direction: 'CREDIT', amountPaise: BigInt(1000000) },
        { accountCode: 'PLATFORM_REVENUE', ownerType: 'PLATFORM', ownerId: 'adzunova', direction: 'CREDIT', amountPaise: BigInt(50000) },
        { accountCode: 'GST_PAYABLE', ownerType: 'PLATFORM', ownerId: 'adzunova', direction: 'CREDIT', amountPaise: BigInt(189000) },
      ],
    });
    const recRes = await processVerifiedPaymentWebhook({
      eventId: `evt_crash_${Date.now()}`,
      eventType: 'payment.captured',
      orderId: ordC,
      paymentId: payC,
      amountPaise: BigInt(1239000),
      currency: 'INR',
      providerStatus: 'captured',
      payloadHash: 'e'.repeat(64),
      routeHoldVerified: true,
    });
    assert.equal(recRes.outcome, 'FUNDS_SECURED');
    const afterCrash = await getBookingWithEvents(bCrash.bookingId);
    assert.equal(afterCrash?.booking.status, 'FUNDS_SECURED');

    const recon = await runPaymentReconciliation(30);
    assert.ok(recon.openReconItemsCount >= 2);
    const routeRecon = await db
      .collection('pay_reconciliation_items')
      .countDocuments({ kind: 'ROUTE_HOLD_UNAVAILABLE', status: 'OPEN' });
    assert.ok(routeRecon >= 1);
  });
});
