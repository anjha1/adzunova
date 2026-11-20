import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateRateCardQuote,
  CURRENT_PLATFORM_FEE_CONFIG,
  STANDARD_GST_RATE_PERCENT,
} from '../../apps/web/src/lib/rate-card/quote-calculator.ts';
import {
  isPlatformFormatCompatible,
  generateSuggestedTitle,
  getSupportedFormats,
} from '../../apps/web/src/lib/rate-card/compatibility.ts';
import {
  createRateCardItemSchema,
  updateRateCardStatusSchema,
} from '../../apps/web/src/lib/rate-card/validation.ts';

test('Rate Card Quote Engine: Decimal-Safe Arithmetic & Rounding', async (t) => {
  await t.test('calculates base deliverable with no add-ons accurately', () => {
    const item = {
      id: 'test-item-1',
      creatorId: 'c1',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      durationSeconds: 60,
      price: 25000,
      currency: 'INR',
      priceType: 'FIXED',
      minimumBookingAmount: null,
      title: '1 Min Dedicated Instagram Reel',
      description: 'Test reel',
      deliveryDays: 5,
      freeRevisions: 1,
      publishOnMyChannel: true,
      scriptApprovalRequired: true,
      status: 'ACTIVE',
      visibleToBrands: true,
      sortOrder: 0,
      addons: [],
    };

    const quote = calculateRateCardQuote(item, []);

    assert.equal(quote.basePrice, 25000);
    assert.equal(quote.subtotal, 25000);
    assert.equal(quote.commissionPercent, 10);
    assert.equal(quote.commissionAmount, 2500); // 10% of 25,000 = 2,500
    assert.equal(quote.creatorNetPayout, 22500); // 25,000 - 2,500 = 22,500
    assert.equal(quote.gstRatePercent, 18);
    assert.equal(quote.gstAmount, 4500); // 18% of 25,000 = 4,500
    assert.equal(quote.totalBrandPayable, 29500); // 25,000 + 4,500 = 29,500
    assert.equal(quote.configVersion, 'cfg_2026_q4');
  });

  await t.test('calculates percent and fixed add-ons without floating point drift', () => {
    const item = {
      id: 'test-item-2',
      creatorId: 'c1',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      platform: 'YOUTUBE',
      contentFormat: 'LONG_VIDEO',
      deliverableType: 'DEDICATED_VIDEO',
      durationSeconds: 600,
      price: 40000,
      currency: 'INR',
      priceType: 'FIXED',
      minimumBookingAmount: null,
      title: 'YouTube Dedicated Video',
      description: 'Test long video',
      deliveryDays: 7,
      freeRevisions: 2,
      publishOnMyChannel: true,
      scriptApprovalRequired: true,
      status: 'ACTIVE',
      visibleToBrands: true,
      sortOrder: 1,
      addons: [
        {
          id: 'a1',
          type: 'USAGE_RIGHTS',
          enabled: true,
          pricingMode: 'PERCENT_OF_BASE',
          value: 20, // +20% = ₹8,000
          durationDays: 30,
        },
        {
          id: 'a2',
          type: 'EXTRA_REVISION',
          enabled: true,
          pricingMode: 'FIXED_AMOUNT',
          value: 3500, // +₹3,500
        },
      ],
    };

    const quote = calculateRateCardQuote(item, ['USAGE_RIGHTS', 'EXTRA_REVISION']);

    assert.equal(quote.basePrice, 40000);
    assert.equal(quote.selectedAddons.length, 2);
    assert.equal(quote.selectedAddons[0].amount, 8000);
    assert.equal(quote.selectedAddons[1].amount, 3500);
    assert.equal(quote.addonsTotal, 11500);
    assert.equal(quote.subtotal, 51500); // 40,000 + 11,500 = 51,500
    assert.equal(quote.commissionAmount, 5150); // 10% of 51,500
    assert.equal(quote.creatorNetPayout, 46350); // 51,500 - 5,150 = 46,350
    assert.equal(quote.gstAmount, 9270); // 18% of 51,500
    assert.equal(quote.totalBrandPayable, 60770); // 51,500 + 9,270 = 60,770
  });
});

test('Platform & Format Compatibility Matrix', async (t) => {
  await t.test('allows valid platform/format pairings', () => {
    assert.equal(isPlatformFormatCompatible('INSTAGRAM', 'REEL'), true);
    assert.equal(isPlatformFormatCompatible('INSTAGRAM', 'STORY'), true);
    assert.equal(isPlatformFormatCompatible('YOUTUBE', 'LONG_VIDEO'), true);
    assert.equal(isPlatformFormatCompatible('YOUTUBE', 'SHORT'), true);
    assert.equal(isPlatformFormatCompatible('TIKTOK', 'SHORT'), true);
    assert.equal(isPlatformFormatCompatible('LINKEDIN', 'CAROUSEL'), true);
  });

  await t.test('rejects incompatible platform/format pairings', () => {
    assert.equal(isPlatformFormatCompatible('YOUTUBE', 'STORY'), false);
    assert.equal(isPlatformFormatCompatible('TIKTOK', 'LONG_VIDEO'), false);
    assert.equal(isPlatformFormatCompatible('LINKEDIN', 'REEL'), false);
  });

  await t.test('generates expected title templates', () => {
    const titleReel = generateSuggestedTitle('INSTAGRAM', 'REEL', 'DEDICATED_VIDEO', 60);
    assert.equal(titleReel, '1 Min Dedicated Instagram Reel');

    const titleYoutube = generateSuggestedTitle('YOUTUBE', 'LONG_VIDEO', 'BRAND_INTEGRATION', 600);
    assert.equal(titleYoutube, 'YouTube Long-form Video Brand Integration');
  });
});

test('Zod Rate Card Schemas & Strict Business Rules', async (t) => {
  await t.test('strictly blocks ACTIVE items with price ₹0', () => {
    const result = createRateCardItemSchema.safeParse({
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      title: 'Free Reel',
      price: 0,
      status: 'ACTIVE',
      deliveryDays: 5,
    });

    assert.equal(result.success, false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      assert.ok(errors.price);
      assert.match(errors.price[0], /greater than ₹0/);
    }
  });

  await t.test('allows DRAFT items with price 0', () => {
    const result = createRateCardItemSchema.safeParse({
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      title: 'Draft Reel',
      price: 0,
      status: 'DRAFT',
      deliveryDays: 5,
    });

    assert.equal(result.success, true);
  });

  await t.test('rejects incompatible format in create schema', () => {
    const result = createRateCardItemSchema.safeParse({
      platform: 'TIKTOK',
      contentFormat: 'LONG_VIDEO', // Incompatible on TikTok
      deliverableType: 'DEDICATED_VIDEO',
      title: 'TikTok Long Video',
      price: 15000,
      status: 'ACTIVE',
      deliveryDays: 3,
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.contentFormat);
    }
  });

  await t.test('enforces turnaround delivery bounds (1 to 90 days)', () => {
    const tooLow = createRateCardItemSchema.safeParse({
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      title: 'Same Hour Reel',
      price: 20000,
      deliveryDays: 0,
      status: 'ACTIVE',
    });
    assert.equal(tooLow.success, false);

    const tooHigh = createRateCardItemSchema.safeParse({
      platform: 'INSTAGRAM',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      title: 'Half Year Reel',
      price: 20000,
      deliveryDays: 120,
      status: 'ACTIVE',
    });
    assert.equal(tooHigh.success, false);
  });
});
