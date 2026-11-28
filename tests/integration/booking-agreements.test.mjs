import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  acceptBooking,
  acceptCounterOffer,
  assertValidBookingTransition,
  closePaymentsDb,
  counterBooking,
  createBookingRequest,
  expireAgreement,
  getActiveAgreementForBooking,
  getBookingWithEvents,
  getPaymentsMongoDb,
  recordVerifiedAgreementSignature,
  verifyAuditHashChain,
} from '../../packages/payments-db/src/index';
import { runPaymentsIndexBootstrap } from '../../packages/payments-db/src/index-bootstrap.mjs';
import {
  generateOrGetBookingAgreement,
  initiateAgreementSigning,
  issueAuthorizedAgreementPdfUrl,
  issueReplacementBookingAgreement,
} from '../../apps/web/src/lib/bookings/agreement-service';
import { UnconfiguredESignAdapter } from '../../apps/web/src/lib/bookings/esign-port';
import { InMemoryFakeStorageAdapter } from '../../apps/web/src/lib/storage/testing/in-memory-fake';
import { TestESignAdapter } from '../helpers/test-esign-adapter';

const TEST_BRAND_A = `brand_m4_a_${Date.now()}`;
const TEST_CREATOR_A = `creator_m4_a_${Date.now()}`;
const TEST_OUTSIDER = `outsider_m4_${Date.now()}`;
const PRIVATE_BUCKET = 'adzunova-dev-private';

const sampleQuote = {
  breakdown: {
    basePrice: 25000,
    addonsTotal: 5000,
    brandFeeAmount: 1500,
    gstAmount: 5670,
    totalBrandPayable: 37170,
    creatorNetPayout: 28500,
  },
};

test('M4 Agreements & E-Sign Lifecycle (MongoDB rs0)', async (t) => {
  const boot = await runPaymentsIndexBootstrap('up');
  assert.equal(boot.ok, true);

  const db = await getPaymentsMongoDb();
  const fakeStorage = new InMemoryFakeStorageAdapter();
  const testEsign = new TestESignAdapter();

  t.after(async () => {
    await db.collection('pay_bookings').deleteMany({
      $or: [{ brandId: TEST_BRAND_A }, { creatorId: TEST_CREATOR_A }],
    });
    await db.collection('pay_agreements').deleteMany({});
    await db.collection('pay_agreement_callbacks').deleteMany({});
    await closePaymentsDb();
  });

  await t.test('1. Original accepted booking -> idempotent PDF generation, retryable storage failure, cross-account denial', async () => {
    const booking = await createBookingRequest({
      brandId: TEST_BRAND_A,
      brandName: 'Acme M4 Brand',
      creatorId: TEST_CREATOR_A,
      creatorName: 'Creator M4',
      itemKind: 'RATE_CARD_ITEM',
      itemKey: `rc_m4_1_${Date.now()}`,
      rateCardItemId: `rc_m4_1_${Date.now()}`,
      itemTitle: 'Instagram Reel M4',
      pricingType: 'NEGOTIABLE',
      selectedAddons: ['USAGE_RIGHTS'],
      quantity: 1,
      deliveryDate: '2026-12-20',
      brief: 'Launch campaign brief for M4 agreement test.',
      referenceLinks: ['https://example.com'],
      assetIds: [],
      quoteSnapshot: sampleQuote,
      feeConfigVersion: 'cfg_2026_q4',
      rateCardItemVersion: 1,
    });

    await acceptBooking({ bookingId: booking.bookingId, creatorId: TEST_CREATOR_A });

    // Simulate failed R2 put -> must be retryable and leave booking ACCEPTED
    const failingStorage = {
      async put() {
        throw new Error('Simulated R2 network timeout');
      },
    };
    await assert.rejects(
      () =>
        generateOrGetBookingAgreement({
          bookingId: booking.bookingId,
          actorId: TEST_BRAND_A,
          actorRole: 'BRAND',
          storageOverride: { port: failingStorage, privateBucket: PRIVATE_BUCKET },
        }),
      /Could not store agreement PDF/
    );

    const mid = await getBookingWithEvents(booking.bookingId);
    assert.equal(mid?.booking.status, 'ACCEPTED');

    // Retry succeeds and transitions ACCEPTED -> AGREEMENT_PENDING
    const gen1 = await generateOrGetBookingAgreement({
      bookingId: booking.bookingId,
      actorId: TEST_BRAND_A,
      actorRole: 'BRAND',
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(gen1.agreement.status, 'PENDING_SIGNATURES');
    assert.equal(gen1.agreement.version, 1);
    assert.ok(gen1.agreement.pdfObjectKey?.startsWith('private/'));
    assert.ok(gen1.agreement.pdfSha256 && gen1.agreement.pdfSha256.length === 64);

    // Verify stored PDF bytes match sha256 and %PDF-1.4 header
    const stored = await fakeStorage.get(PRIVATE_BUCKET, gen1.agreement.pdfObjectKey);
    const chunks = [];
    for await (const chunk of stored.body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buf = Buffer.concat(chunks);
    assert.ok(buf.toString('utf8', 0, 8).startsWith('%PDF-1.4'));
    assert.equal(crypto.createHash('sha256').update(buf).digest('hex'), gen1.agreement.pdfSha256);

    // Duplicate/concurrent generation returns same active agreement
    const gen2 = await generateOrGetBookingAgreement({
      bookingId: booking.bookingId,
      actorId: TEST_CREATOR_A,
      actorRole: 'CREATOR',
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(gen2.agreement.agreementId, gen1.agreement.agreementId);
    assert.equal(gen2.created, false);

    // Authorized PDF URL works for brand & creator, denied for outsider
    const brandPdf = await issueAuthorizedAgreementPdfUrl({
      bookingId: booking.bookingId,
      actorId: TEST_BRAND_A,
      actorRole: 'BRAND',
      readerOverride: fakeStorage,
    });
    assert.ok(brandPdf.downloadUrl.includes(gen1.agreement.pdfObjectKey));
    assert.equal(brandPdf.sha256, gen1.agreement.pdfSha256);

    await assert.rejects(
      () =>
        issueAuthorizedAgreementPdfUrl({
          bookingId: booking.bookingId,
          actorId: TEST_OUTSIDER,
          actorRole: 'BRAND',
          readerOverride: fakeStorage,
        }),
      /not authorized/
    );

    // Unconfigured E-Sign fails closed
    const unconfigured = new UnconfiguredESignAdapter();
    await assert.rejects(() => unconfigured.createSigningSession({}), /E-sign not configured/);

    // Test E-Sign session + callback verification + replay + concurrent/dual signature -> SIGNED
    const signSession = await initiateAgreementSigning({
      bookingId: booking.bookingId,
      actorId: TEST_BRAND_A,
      actorRole: 'BRAND',
      esignOverride: testEsign,
    });
    assert.ok(signSession.envelopeId.includes(gen1.agreement.agreementId));

    // Mismatched hash rejected
    await assert.rejects(
      () =>
        recordVerifiedAgreementSignature({
          agreementId: gen1.agreement.agreementId,
          bookingId: booking.bookingId,
          version: 1,
          pdfSha256: '0'.repeat(64),
          signerRole: 'BRAND',
          signerId: TEST_BRAND_A,
          callbackId: `cb_bad_${Date.now()}`,
          provider: testEsign.providerName,
          evidence: { sig: 'bad' },
        }),
      /does not match/
    );

    // Brand verified callback
    const cbBrand = testEsign.buildSignedCallback({
      callbackId: `cb_brand_${Date.now()}`,
      agreementId: gen1.agreement.agreementId,
      bookingId: booking.bookingId,
      version: 1,
      pdfSha256: gen1.agreement.pdfSha256,
      signerRole: 'BRAND',
      signerId: TEST_BRAND_A,
    });
    const verifiedBrand = await testEsign.verifyCallback(cbBrand);
    const sig1 = await recordVerifiedAgreementSignature(verifiedBrand);
    assert.equal(sig1.agreement.status, 'PENDING_SIGNATURES');
    assert.equal(sig1.bookingStatus, 'AGREEMENT_PENDING');
    assert.ok(sig1.agreement.brandSignedAt);
    assert.equal(sig1.agreement.creatorSignedAt, null);

    // Duplicate callback replay -> idempotent
    const replay = await recordVerifiedAgreementSignature(verifiedBrand);
    assert.equal(replay.duplicate, true);
    assert.equal(replay.bookingStatus, 'AGREEMENT_PENDING');

    // Creator verified callback -> transitions AGREEMENT_PENDING -> SIGNED once
    const cbCreator = testEsign.buildSignedCallback({
      callbackId: `cb_creator_${Date.now()}`,
      agreementId: gen1.agreement.agreementId,
      bookingId: booking.bookingId,
      version: 1,
      pdfSha256: gen1.agreement.pdfSha256,
      signerRole: 'CREATOR',
      signerId: TEST_CREATOR_A,
    });
    const verifiedCreator = await testEsign.verifyCallback(cbCreator);
    const sig2 = await recordVerifiedAgreementSignature(verifiedCreator);
    assert.equal(sig2.agreement.status, 'SIGNED');
    assert.equal(sig2.bookingStatus, 'SIGNED');
    assert.ok(sig2.agreement.signedAt);

    // No checkout transition allowed from SIGNED in M4
    assert.throws(() => assertValidBookingTransition('SIGNED', 'ACCEPTED'), /Cannot transition/);

    const chainCheck = await verifyAuditHashChain();
    assert.equal(chainCheck.ok, true);
  });

  await t.test('2. Counter-offer accepted by brand -> replacement agreement v2 resets signatures', async () => {
    const booking = await createBookingRequest({
      brandId: TEST_BRAND_A,
      brandName: 'Acme M4 Brand',
      creatorId: TEST_CREATOR_A,
      creatorName: 'Creator M4',
      itemKind: 'RATE_CARD_ITEM',
      itemKey: `rc_m4_2_${Date.now()}`,
      rateCardItemId: `rc_m4_2_${Date.now()}`,
      itemTitle: 'YouTube Integration M4',
      pricingType: 'NEGOTIABLE',
      selectedAddons: [],
      quantity: 1,
      deliveryDate: '2026-12-22',
      brief: 'Counter-offer agreement test brief.',
      referenceLinks: [],
      assetIds: [],
      quoteSnapshot: sampleQuote,
      feeConfigVersion: 'cfg_2026_q4',
      rateCardItemVersion: 1,
    });

    await counterBooking({
      bookingId: booking.bookingId,
      creatorId: TEST_CREATOR_A,
      newDeliveryDate: '2026-12-28',
      proposedPriceInr: 30000,
      newQuoteSnapshot: {
        breakdown: {
          basePrice: 30000,
          addonsTotal: 0,
          brandFeeAmount: 1500,
          gstAmount: 5670,
          totalBrandPayable: 37170,
          creatorNetPayout: 28500,
        },
      },
      note: 'Adjusted date and price',
    });

    // Brand accepts counter-offer
    const accepted = await acceptCounterOffer({
      bookingId: booking.bookingId,
      brandId: TEST_BRAND_A,
    });
    assert.equal(accepted.status, 'ACCEPTED');

    const v1 = await generateOrGetBookingAgreement({
      bookingId: booking.bookingId,
      actorId: TEST_BRAND_A,
      actorRole: 'BRAND',
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(v1.agreement.version, 1);

    // Brand signs v1
    await recordVerifiedAgreementSignature({
      agreementId: v1.agreement.agreementId,
      bookingId: booking.bookingId,
      version: 1,
      pdfSha256: v1.agreement.pdfSha256,
      signerRole: 'BRAND',
      signerId: TEST_BRAND_A,
      callbackId: `cb_v1_b_${Date.now()}`,
      provider: testEsign.providerName,
      evidence: { ok: true },
    });

    // Replacement agreement -> v2 resets both signatures
    const v2 = await issueReplacementBookingAgreement({
      bookingId: booking.bookingId,
      actorId: TEST_CREATOR_A,
      actorRole: 'CREATOR',
      reason: 'Updated usage clause',
      storageOverride: { port: fakeStorage, privateBucket: PRIVATE_BUCKET },
    });
    assert.equal(v2.version, 2);
    assert.equal(v2.brandSignedAt, null);
    assert.equal(v2.creatorSignedAt, null);

    // Expiry is idempotent and rejects late signatures
    const exp1 = await expireAgreement({
      agreementId: v2.agreementId,
      bookingId: booking.bookingId,
    });
    assert.equal(exp1.bookingStatus, 'EXPIRED');
    const exp2 = await expireAgreement({
      agreementId: v2.agreementId,
      bookingId: booking.bookingId,
    });
    assert.equal(exp2.alreadyExpired, true);

    await assert.rejects(
      () =>
        recordVerifiedAgreementSignature({
          agreementId: v2.agreementId,
          bookingId: booking.bookingId,
          version: 2,
          pdfSha256: v2.pdfSha256,
          signerRole: 'CREATOR',
          signerId: TEST_CREATOR_A,
          callbackId: `cb_late_${Date.now()}`,
          provider: testEsign.providerName,
          evidence: { ok: true },
        }),
      /deadline has passed/
    );

    const active = await getActiveAgreementForBooking(booking.bookingId);
    assert.equal(active?.status, 'EXPIRED');
  });
});
