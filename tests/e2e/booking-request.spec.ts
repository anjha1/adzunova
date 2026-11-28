import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  beginAgreementGeneration,
  closePaymentsDb,
  finalizeAgreementPdf,
  recordVerifiedAgreementSignature,
} from '../../packages/payments-db/src/index';
import { TestESignAdapter } from '../helpers/test-esign-adapter';

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/?directConnection=true&replicaSet=rs0';
const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:4101';
const PAYMENTS_DB = process.env.PAYMENTS_MONGODB_DB_NAME || 'adzunova_payments';
const APP_DB = process.env.MONGODB_DB_NAME || 'adzunova';
const STORAGE_DB = process.env.STORAGE_MONGODB_DB_NAME || 'adzunova_storage';
const SCREENSHOT_DIR = path.resolve('tests/e2e/screenshots/m3');

const RUN_ID = Date.now().toString(36);
const CREATOR_EMAIL = `e2e.creator.${RUN_ID}@adzunova.tech`;
const BRAND_EMAIL = `e2e.brand.${RUN_ID}@adzunova.tech`;
const TEST_PASSWORD = `P@ssw0rd!${RUN_ID}`;
const CREATOR_SLUG = `e2e-booking-creator-${RUN_ID}`;

let mongoClient: MongoClient;
let creatorId = '';
let brandId = '';
let rateCardItemId = '';
let prevFeatureBookingsDoc: Record<string, unknown> | null = null;

async function registerUser(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<{ userId: string }> {
  const res = await fetch(`${IDENTITY_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(`Register ${endpoint} failed (${res.status}): ${JSON.stringify(data)}`);
  }
  const user = data.user as Record<string, unknown> | undefined;
  const id = String(user?.id ?? data.userId ?? '');
  if (!id) throw new Error(`Missing userId from ${endpoint}: ${JSON.stringify(data)}`);
  return { userId: id };
}

test.describe('M3 Booking Lifecycle E2E (Request -> Counter -> Accept)', () => {
  test.beforeAll(async () => {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();

    // 1. Enable FEATURE_BOOKINGS for E2E test run
    const payDb = mongoClient.db(PAYMENTS_DB);
    prevFeatureBookingsDoc = (await payDb
      .collection('pay_feature_flags')
      .findOne({ key: 'FEATURE_BOOKINGS' })) as Record<string, unknown> | null;
    await payDb.collection('pay_feature_flags').updateOne(
      { key: 'FEATURE_BOOKINGS' },
      { $set: { key: 'FEATURE_BOOKINGS', enabled: true, updatedAt: new Date() } },
      { upsert: true }
    );

    // 2. Create real test creator & brand via identity-service
    const cReg = await registerUser('/api/v1/auth/register/creator', {
      fullName: 'E2E Booking Creator',
      email: CREATOR_EMAIL,
      password: TEST_PASSWORD,
      country: 'IN',
      category: 'Tech',
    });
    creatorId = cReg.userId;

    const bReg = await registerUser('/api/v1/auth/register/brand', {
      fullName: 'Acme Buyer',
      workEmail: BRAND_EMAIL,
      password: TEST_PASSWORD,
      companyName: 'Acme E2E Corp',
      website: 'https://adzunova.tech',
      industry: 'Technology',
      country: 'IN',
      businessType: 'Brand',
    });
    brandId = bReg.userId;

    // Mark brand verified & emails verified in identity DB (test tooling setup)
    const idDb = mongoClient.db(
      process.env.IDENTITY_MONGODB_DB_NAME || 'adzunova_identity'
    );
    await idDb.collection('users').updateMany(
      { _id: { $in: [creatorId, brandId] } as unknown as never },
      { $set: { emailVerified: true } }
    );
    await idDb.collection('users').updateMany(
      { email: { $in: [CREATOR_EMAIL, BRAND_EMAIL] } },
      { $set: { emailVerified: true } }
    );
    await idDb.collection('brand_profiles').updateMany(
      { userId: brandId },
      { $set: { verificationStatus: 'VERIFIED', onboardingCompleted: true } }
    );

    // 3. Seed published creator public profile + active negotiable rate-card item
    const appDb = mongoClient.db(APP_DB);
    const now = new Date().toISOString();
    await appDb.collection('public_profiles').insertOne({
      id: `pub_${crypto.randomUUID()}`,
      creatorId,
      slug: CREATOR_SLUG,
      previousSlugs: [],
      displayName: 'E2E Booking Creator',
      bio: 'Verified creator for automated booking E2E verification.',
      tags: ['Tech'],
      languages: ['English'],
      location: 'Bengaluru, India',
      avatarUrl: null,
      coverUrl: null,
      isPublished: true,
      allowIndexing: false,
      sectionVisibility: {
        platforms: true,
        stats: true,
        audience: true,
        topContent: true,
        rateCard: true,
        packages: true,
      },
      hiddenPlatformIds: [],
      pinnedContentIds: [],
      hidePricesPerItem: {},
      consentRecordedAt: now,
      publishedAt: now,
      updatedAt: now,
      version: 1,
    });

    rateCardItemId = `rc_${crypto.randomUUID()}`;
    await appDb.collection('rate_card_items').insertOne({
      id: rateCardItemId,
      creatorId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      title: 'E2E Dedicated Instagram Reel',
      description: '60s dedicated product showcase reel',
      price: 25000,
      currency: 'INR',
      priceType: 'NEGOTIABLE',
      status: 'ACTIVE',
      visibleToBrands: true,
      deliveryDays: 7,
      revisionsIncluded: 2,
      addons: [],
      sortOrder: 0,
    });
  });

  test.afterAll(async () => {
    try {
      const appDb = mongoClient.db(APP_DB);
      await appDb.collection('public_profiles').deleteMany({ creatorId });
      await appDb.collection('rate_card_items').deleteMany({ creatorId });

      const payDb = mongoClient.db(PAYMENTS_DB);
      const bookingDocs = await payDb
        .collection('pay_bookings')
        .find({ $or: [{ brandId }, { creatorId }] })
        .toArray();
      const bIds = bookingDocs.map((b) => String(b.bookingId));
      await payDb.collection('pay_agreements').deleteMany({ bookingId: { $in: bIds } });
      await payDb.collection('pay_agreement_callbacks').deleteMany({});
      await payDb.collection('pay_bookings').deleteMany({
        $or: [{ brandId }, { creatorId }],
      });
      await payDb.collection('pay_notifications').deleteMany({
        $or: [{ userId: brandId }, { userId: creatorId }],
      });
      await closePaymentsDb();

      if (prevFeatureBookingsDoc) {
        await payDb
          .collection('pay_feature_flags')
          .replaceOne({ key: 'FEATURE_BOOKINGS' }, prevFeatureBookingsDoc);
      } else {
        await payDb.collection('pay_feature_flags').deleteOne({ key: 'FEATURE_BOOKINGS' });
      }

      const idDb = mongoClient.db(
        process.env.IDENTITY_MONGODB_DB_NAME || 'adzunova_identity'
      );
      await idDb.collection('brand_profiles').deleteMany({ userId: brandId });
      await idDb.collection('creator_profiles').deleteMany({ userId: creatorId });
      await idDb.collection('sessions').deleteMany({ userId: { $in: [creatorId, brandId] } });
      await idDb.collection('users').deleteMany({
        email: { $in: [CREATOR_EMAIL, BRAND_EMAIL] },
      });
    } finally {
      await mongoClient.close();
    }
  });

  test('logged-out brand redirects to sign-in, submits request, creator counters & accepts, reload persists, screenshots & axe clean', async ({
    browser,
  }) => {
    const brandContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const brandPage = await brandContext.newPage();

    // 1. Logged-out brand visits creator public profile -> clicks Request Collaboration -> Sign In
    await brandPage.goto(`/c/${CREATOR_SLUG}`);
    await expect(brandPage.getByRole('heading', { name: 'E2E Booking Creator' })).toBeVisible();
    await brandPage.getByRole('button', { name: 'Request Collaboration' }).click();
    await expect(brandPage.getByRole('button', { name: 'Brand Sign In' })).toBeVisible();
    await brandPage.getByRole('button', { name: 'Brand Sign In' }).click();
    await brandPage.waitForURL(/\/auth\/brand\/sign-in\?returnUrl=/);

    // 2. Brand signs in and returns to /c/<slug>?request=1
    await brandPage.locator('input[type="email"]').fill(BRAND_EMAIL);
    await brandPage.locator('input[type="password"]').fill(TEST_PASSWORD);
    await brandPage.locator('button[type="submit"]').click();
    await brandPage.waitForURL(new RegExp(`/c/${CREATOR_SLUG}\\?request=1`));

    // Modal opens automatically; server quote loads
    await expect(brandPage.getByRole('dialog', { name: 'Request Collaboration' })).toBeVisible();
    await expect(brandPage.getByText('Server-Calculated Quote Breakdown')).toBeVisible();

    // Screenshot 1280 light
    await brandPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'booking-modal-1280-light.png'),
      fullPage: false,
    });

    // Axe check on public profile + booking modal
    const axePublic = await new AxeBuilder({ page: brandPage })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const seriousPublic = axePublic.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(seriousPublic).toEqual([]);

    // Fill brief and submit
    await brandPage
      .locator('textarea[placeholder*="Describe campaign goals"]')
      .fill('E2E launch campaign brief for Q4 collaboration.');
    await brandPage.getByRole('button', { name: 'Submit Collaboration Request' }).click();
    await expect(brandPage.getByText('Collaboration Request Sent')).toBeVisible();

    await brandPage.getByRole('link', { name: 'View Sent Offers' }).click();
    await brandPage.waitForURL(/\/brand\/offers/);
    await expect(brandPage.getByRole('heading', { name: 'E2E Dedicated Instagram Reel' })).toBeVisible();
    await expect(brandPage.getByText('REQUESTED').first()).toBeVisible();

    // Reload persistence
    await brandPage.reload();
    await expect(brandPage.getByText('REQUESTED')).toBeVisible();

    // 3. Creator signs in on second context -> counters -> accepts
    const creatorContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const creatorPage = await creatorContext.newPage();
    await creatorPage.goto('/auth/creator/sign-in');
    await creatorPage.locator('input[type="email"]').fill(CREATOR_EMAIL);
    await creatorPage.locator('input[type="password"]').fill(TEST_PASSWORD);
    await creatorPage.locator('button[type="submit"]').click();
    await creatorPage.waitForURL(/\/creator\/(dashboard|onboarding|offers)/);

    await creatorPage.goto('/creator/offers');
    await expect(creatorPage.getByRole('heading', { name: 'E2E Dedicated Instagram Reel' })).toBeVisible();
    await expect(creatorPage.getByText('REQUESTED').first()).toBeVisible();

    // Counter round 1
    await creatorPage.getByRole('button', { name: /Counter \(0 used\)/ }).click();
    await creatorPage.locator('input[type="number"]').fill('28000');
    await creatorPage.locator('input[placeholder*="Counter note"]').fill('Includes rush edit');
    await creatorPage.getByRole('button', { name: 'Send Counter Offer' }).click();
    await expect(creatorPage.getByText('COUNTERED').first()).toBeVisible();

    // Reload persistence
    await creatorPage.reload();
    await expect(creatorPage.getByText('COUNTERED').first()).toBeVisible();

    // Accept -> Agreement Ready panel appears
    await creatorPage.getByRole('button', { name: 'Accept' }).click();
    await expect(creatorPage.getByText('ACCEPTED').first()).toBeVisible();
    await expect(creatorPage.getByText('Agreement Ready').first()).toBeVisible();
    await expect(creatorPage.getByRole('button', { name: 'Generate Agreement' })).toBeVisible();

    // Brand reloads /brand/offers and sees ACCEPTED + Agreement Ready
    await brandPage.reload();
    await expect(brandPage.getByText('ACCEPTED').first()).toBeVisible();
    await expect(brandPage.getByText('Agreement Ready').first()).toBeVisible();

    // Test-tooling agreement PDF finalization + simulated E-Sign callbacks
    // (because R2 & E-sign provider credentials are not configured in local E2E)
    const payDb = mongoClient.db(PAYMENTS_DB);
    const bookingDoc = await payDb.collection('pay_bookings').findOne({ brandId, creatorId });
    expect(bookingDoc).toBeTruthy();
    const bookingId = String(bookingDoc!.bookingId);

    const begun = await beginAgreementGeneration({
      bookingId,
      actorId: brandId,
      actorRole: 'BRAND',
      termsSnapshot: { bookingId, itemTitle: 'E2E Dedicated Instagram Reel' },
    });
    const fakePdfSha = crypto.createHash('sha256').update(`e2e-pdf-${bookingId}`).digest('hex');
    await finalizeAgreementPdf({
      agreementId: begun.agreement.agreementId,
      bookingId,
      pdfBucket: 'adzunova-dev-private',
      pdfObjectKey: `private/e2e/${begun.agreement.agreementId}_v1.pdf`,
      pdfSha256: fakePdfSha,
      pdfSizeBytes: 1024,
      provider: 'UNCONFIGURED',
      actorId: brandId,
      actorRole: 'BRAND',
    });

    // Both parties reload and see AGREEMENT_PENDING + Awaiting Your Signature + E-sign not configured
    await brandPage.reload();
    await expect(brandPage.getByText('AGREEMENT_PENDING').first()).toBeVisible();
    await expect(brandPage.getByText('Awaiting Your Signature').first()).toBeVisible();
    await expect(brandPage.getByText('E-sign not configured').first()).toBeVisible();
    await expect(brandPage.getByRole('button', { name: 'View Agreement PDF' })).toBeVisible();

    await creatorPage.reload();
    await expect(creatorPage.getByText('AGREEMENT_PENDING').first()).toBeVisible();
    await expect(creatorPage.getByText('Awaiting Your Signature').first()).toBeVisible();

    // Brand signs via test-only ESignAdapter -> Brand sees Awaiting Other Party, Creator still Awaiting Your Signature
    const testEsign = new TestESignAdapter();
    const cbBrand = testEsign.buildSignedCallback({
      callbackId: `e2e_cb_brand_${Date.now()}`,
      agreementId: begun.agreement.agreementId,
      bookingId,
      version: 1,
      pdfSha256: fakePdfSha,
      signerRole: 'BRAND',
      signerId: brandId,
    });
    await recordVerifiedAgreementSignature(await testEsign.verifyCallback(cbBrand));

    await brandPage.reload();
    await expect(brandPage.getByText('Awaiting Other Party').first()).toBeVisible();
    await creatorPage.reload();
    await expect(creatorPage.getByText('Awaiting Your Signature').first()).toBeVisible();

    // Creator signs via test-only ESignAdapter -> both see SIGNED + payment not enabled yet
    const cbCreator = testEsign.buildSignedCallback({
      callbackId: `e2e_cb_creator_${Date.now()}`,
      agreementId: begun.agreement.agreementId,
      bookingId,
      version: 1,
      pdfSha256: fakePdfSha,
      signerRole: 'CREATOR',
      signerId: creatorId,
    });
    await recordVerifiedAgreementSignature(await testEsign.verifyCallback(cbCreator));

    await creatorPage.reload();
    await expect(creatorPage.getByText('SIGNED').first()).toBeVisible();
    await expect(creatorPage.getByText('Agreement signed. Payment is not enabled yet.').first()).toBeVisible();

    await brandPage.reload();
    await expect(brandPage.getByText('SIGNED').first()).toBeVisible();
    await expect(brandPage.getByText('Agreement signed. Payment is not enabled yet.').first()).toBeVisible();
    await expect(brandPage.getByRole('button', { name: /Pay Now|Checkout/i })).toHaveCount(0);

    // M5 Attachment Quarantine & Release Gate E2E check
    const storageDb = mongoClient.db(STORAGE_DB);
    const attAssetOid = new ObjectId();
    const attVersionOid = new ObjectId();
    const attBlobOid = new ObjectId();
    const attAssetId = attAssetOid.toHexString();
    const attNow = new Date();
    await storageDb.collection('storage_asset_blobs').insertOne({
      _id: attBlobOid,
      sha256Hex: crypto.createHash('sha256').update(`e2e-m5-pdf-${RUN_ID}-${attAssetId}`).digest('hex'),
      sizeBytes: 1024,
      contentType: 'application/pdf',
      dataClass: 'internal',
      bucket: 'adzunova-dev-quarantine',
      objectKey: `ingest/e2e/${attAssetId}/payload.bin`,
      storageClass: 'STANDARD',
      state: 'ACTIVE',
      refCount: 1,
      ownerType: 'BRAND',
      ownerId: brandId,
      tenantId: `brand:${brandId}`,
      visibility: 'PRIVATE',
      createdAt: attNow,
      updatedAt: attNow,
    });
    await storageDb.collection('storage_asset_versions').insertOne({
      _id: attVersionOid,
      assetId: attAssetOid,
      versionNumber: 1,
      blobId: attBlobOid,
      scanStatus: 'QUARANTINED',
      releaseStatus: 'BLOCKED',
      releasedBucket: null,
      releasedKey: null,
      tenantId: `brand:${brandId}`,
      ownerType: 'BRAND',
      ownerId: brandId,
      createdBy: brandId,
      visibility: 'PRIVATE',
      createdAt: attNow,
    });
    await storageDb.collection('storage_media_assets').insertOne({
      _id: attAssetOid,
      assetUuid: crypto.randomUUID().replace(/-/g, ''),
      idempotencyKey: `idem_e2e_${attAssetId}`,
      ownerType: 'BRAND',
      ownerId: brandId,
      tenantId: `brand:${brandId}`,
      visibility: 'PRIVATE',
      dataClass: 'internal',
      purpose: 'campaign_deliverable_draft',
      originalFileName: 'e2e-brief.pdf',
      scanStatus: 'QUARANTINED',
      releaseStatus: 'BLOCKED',
      currentVersionId: attVersionOid,
      status: 'ACTIVE',
      deletedAt: null,
      createdAt: attNow,
      updatedAt: attNow,
    });
    await storageDb.collection('storage_asset_links').insertOne({
      assetId: attAssetOid,
      blobId: attBlobOid,
      entityType: 'booking',
      entityId: bookingId,
      fieldRole: 'brief_attachment',
      ownerType: 'BRAND',
      ownerId: brandId,
      tenantId: `brand:${brandId}`,
      visibility: 'PRIVATE',
      createdAt: attNow,
    });
    await payDb.collection('pay_bookings').updateOne(
      { bookingId },
      { $set: { assetIdsJson: JSON.stringify([attAssetId]) } }
    );

    // Reload Creator offers: sees "Uploaded — scan pending" and NO Download button; download route returns 403
    await creatorPage.reload();
    await expect(creatorPage.getByText('e2e-brief.pdf')).toBeVisible();
    await expect(creatorPage.getByText('Uploaded — scan pending')).toBeVisible();
    await expect(creatorPage.getByRole('button', { name: 'Download' })).toHaveCount(0);

    const pendingRes = await creatorPage.request.get(
      `/api/bookings/${bookingId}/attachments/${attAssetId}/download`
    );
    expect(pendingRes.status()).toBe(403);

    // Simulate clean scan release -> Creator refreshes and sees "Ready" + Download button
    await storageDb.collection('storage_asset_versions').updateOne(
      { _id: attVersionOid },
      {
        $set: {
          scanStatus: 'CLEAN',
          releaseStatus: 'RELEASED',
          releasedBucket: 'adzunova-dev-private',
          releasedKey: `private/e2e/${attAssetId}/v1.pdf`,
        },
      }
    );
    await storageDb.collection('storage_media_assets').updateOne(
      { _id: attAssetOid },
      { $set: { scanStatus: 'CLEAN', releaseStatus: 'RELEASED' } }
    );

    await creatorPage.reload();
    await expect(creatorPage.getByText('Ready').first()).toBeVisible();
    await expect(creatorPage.getByRole('button', { name: 'Download' })).toBeVisible();

    // Cleanup M5 test attachment docs
    await storageDb.collection('storage_asset_links').deleteMany({ entityId: bookingId });
    await storageDb.collection('storage_media_assets').deleteMany({ _id: attAssetOid });
    await storageDb.collection('storage_asset_versions').deleteMany({ _id: attVersionOid });
    await storageDb.collection('storage_asset_blobs').deleteMany({ _id: attBlobOid });

    // Axe check on creator inbox & brand offers
    const axeCreator = await new AxeBuilder({ page: creatorPage })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(
      axeCreator.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
    ).toEqual([]);

    await creatorPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'creator-inbox-1280-light.png'),
      fullPage: true,
    });

    const axeBrand = await new AxeBuilder({ page: brandPage })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(
      axeBrand.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
    ).toEqual([]);

    // 390px mobile + dark mode screenshots
    await brandPage.setViewportSize({ width: 390, height: 844 });
    await brandPage.emulateMedia({ colorScheme: 'dark' });
    await brandPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'brand-offers-390-dark.png'),
      fullPage: true,
    });

    await creatorPage.setViewportSize({ width: 390, height: 844 });
    await creatorPage.emulateMedia({ colorScheme: 'dark' });
    await creatorPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'creator-inbox-390-dark.png'),
      fullPage: true,
    });

    await brandContext.close();
    await creatorContext.close();
  });
});
