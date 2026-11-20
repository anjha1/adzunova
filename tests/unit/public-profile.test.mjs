import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateSlug,
  isReservedSlug,
  isValidSlugFormat,
  RESERVED_SLUGS,
} from '../../apps/web/src/lib/public-profile/validation.ts';
import {
  serializePublicProfile,
  formatIndianRupees,
  formatCompactCount,
  sanitizeText,
  sanitizeExternalUrl,
} from '../../apps/web/src/lib/public-profile/serializer.ts';
import { DEFAULT_SECTION_VISIBILITY } from '../../apps/web/src/lib/public-profile/types.ts';

test('Public Creator Profile: Slug Validation & Rules', async (t) => {
  await t.test('accepts valid custom slugs', () => {
    assert.equal(validateSlug('tech-creator').isValid, true);
    assert.equal(validateSlug('a-n-jha1').isValid, true);
    assert.equal(validateSlug('creator123').isValid, true);
    assert.equal(validateSlug('john-doe-99').isValid, true);
  });

  await t.test('rejects reserved system keywords', () => {
    assert.equal(isReservedSlug('admin'), true);
    assert.equal(isReservedSlug('api'), true);
    assert.equal(isReservedSlug('login'), true);
    assert.equal(isReservedSlug('brand'), true);
    assert.equal(isReservedSlug('creator'), true);
    assert.equal(isReservedSlug('terms'), true);

    const res = validateSlug('admin');
    assert.equal(res.isValid, false);
    assert.match(res.error, /reserved/i);
  });

  await t.test('rejects invalid slug lengths and characters', () => {
    // Too short (< 3)
    assert.equal(validateSlug('ab').isValid, false);

    // Too long (> 30)
    assert.equal(validateSlug('a'.repeat(31)).isValid, false);

    // Leading or trailing hyphen
    assert.equal(validateSlug('-tech').isValid, false);
    assert.equal(validateSlug('tech-').isValid, false);

    // Consecutive hyphens
    assert.equal(validateSlug('tech--lead').isValid, false);

    // Special characters
    assert.equal(validateSlug('tech_lead').isValid, false);
    assert.equal(validateSlug('tech.lead').isValid, false);
    assert.equal(validateSlug('tech@lead').isValid, false);
  });
});

test('Public Creator Profile: Number & Text Formatting', async (t) => {
  await t.test('formats Indian Rupee currency correctly', () => {
    assert.equal(formatIndianRupees(0), '₹0');
    assert.equal(formatIndianRupees(5000), '₹5,000');
    assert.equal(formatIndianRupees(25000), '₹25,000');
    assert.equal(formatIndianRupees(125000), '₹1,25,000');
    assert.equal(formatIndianRupees(1000000), '₹10,00,000');
  });

  await t.test('formats compact follower and view counts', () => {
    assert.equal(formatCompactCount(450), '450');
    assert.equal(formatCompactCount(1580), '1.58K');
    assert.equal(formatCompactCount(45000), '45K');
    assert.equal(formatCompactCount(150000), '1.5L');
    assert.equal(formatCompactCount(1200000), '12L');
    assert.equal(formatCompactCount(10000000), '1Cr');
  });

  await t.test('sanitizes untrusted text and URLs against XSS', () => {
    assert.equal(sanitizeText('<script>alert(1)</script>Hello'), 'alert(1)Hello');
    assert.equal(sanitizeText('Normal bio text with #cool tags'), 'Normal bio text with #cool tags');
    assert.equal(sanitizeExternalUrl('javascript:alert(1)'), null);
    assert.equal(sanitizeExternalUrl('https://instagram.com/creator'), 'https://instagram.com/creator');
    assert.equal(sanitizeExternalUrl('http://example.com'), 'http://example.com/');
  });
});

test('Public Creator Profile: Strict DTO Security & Privacy Engine', async (t) => {
  const mockProfile = {
    id: 'pp-12345',
    creatorId: 'c-secret-internal-id',
    slug: 'techstar',
    previousSlugs: ['old-slug'],
    isPublished: true,
    allowIndexing: true,
    displayName: 'Tech Star Creator',
    bio: 'Professional AI content creator.',
    tags: ['Tech', 'AI'],
    languages: ['English', 'Hindi'],
    location: 'Bengaluru, India',
    avatarUrl: 'https://example.com/avatar.jpg',
    coverUrl: null,
    sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    hiddenPlatformIds: [],
    pinnedContentIds: [],
    hidePricesPerItem: { 'item-2': true },
    consentRecordedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  const mockSocialLatest = {
    hasConnectedAccount: true,
    totalReach: 1580,
    totalViews24h: 18,
    audienceScore: 78,
    audienceScoreDisplay: '78/100',
    isScoreComplete: true,
    verificationLabel: 'Verified via Instagram API on Nov 20, 2026',
    accounts: [
      {
        id: 'acc-ig-1',
        provider: 'instagram',
        username: 'techstar_ig',
        followers_count: 1580,
        mediaCount: 12,
        status: 'ACTIVE',
        lastSyncedAt: new Date().toISOString(),
      },
    ],
    demographics: {
      share18Plus: 94,
      share13To17: 2, // minor segment under threshold (2% < 5%)
      genderDistribution: [{ label: 'Male', percentage: 65 }, { label: 'Female', percentage: 35 }],
      ageDistribution: [{ bucket: '18-24', percentage: 45 }, { bucket: '25-34', percentage: 40 }],
      countries: [{ countryCode: 'IN', countryName: 'India', percentage: 80 }],
    },
    followersSeries: [{ timestamp: '2026-11-20', value: 1580 }],
  };

  const mockRateCardItems = [
    {
      id: 'item-1',
      creatorId: 'c-secret-internal-id',
      platform: 'INSTAGRAM',
      title: 'Dedicated Reel',
      description: 'Full vertical reel',
      contentFormat: 'REEL',
      deliverableType: 'DEDICATED_VIDEO',
      price: 25000,
      currency: 'INR',
      status: 'ACTIVE',
      visibleToBrands: true,
      deliveryDays: 5,
      freeRevisions: 1,
      addons: [{ type: 'USAGE_RIGHTS', enabled: true, pricingMode: 'PERCENT_OF_BASE', value: 20 }],
    },
    {
      id: 'item-2',
      creatorId: 'c-secret-internal-id',
      platform: 'INSTAGRAM',
      title: 'VIP Brand Story Sequence',
      description: 'Exclusive 5-story series',
      contentFormat: 'STORY',
      deliverableType: 'STORY_MENTION',
      price: 40000,
      currency: 'INR',
      status: 'ACTIVE',
      visibleToBrands: true,
      deliveryDays: 3,
      freeRevisions: 1,
      addons: [],
    },
    {
      id: 'item-3-draft',
      creatorId: 'c-secret-internal-id',
      platform: 'INSTAGRAM',
      title: 'Draft Unfinished Item',
      price: 0,
      status: 'DRAFT',
      visibleToBrands: true,
    },
    {
      id: 'item-4-hidden',
      creatorId: 'c-secret-internal-id',
      platform: 'INSTAGRAM',
      title: 'Hidden Item',
      price: 15000,
      status: 'ACTIVE',
      visibleToBrands: false,
    },
  ];

  await t.test('strictly NEVER leaks sensitive creator or platform credentials', () => {
    const dto = serializePublicProfile({
      profile: mockProfile,
      latestSocial: mockSocialLatest,
      rateCardItems: mockRateCardItems,
    });

    const jsonString = JSON.stringify(dto);

    // Guaranteed ZERO leaks
    assert.equal(jsonString.includes('c-secret-internal-id'), false, 'creatorId MUST NOT leak');
    assert.equal(jsonString.includes('commission'), false, 'commission MUST NOT leak');
    assert.equal(jsonString.includes('payout'), false, 'payout MUST NOT leak');
    assert.equal(jsonString.includes('bank'), false, 'bank info MUST NOT leak');
    assert.equal(jsonString.includes('token'), false, 'tokens MUST NOT leak');
    assert.equal(jsonString.includes('email'), false, 'emails MUST NOT leak');
  });

  await t.test('filters rate card to only ACTIVE and visible items', () => {
    const dto = serializePublicProfile({
      profile: mockProfile,
      latestSocial: mockSocialLatest,
      rateCardItems: mockRateCardItems,
    });

    assert.ok(dto.rateCard);
    assert.equal(dto.rateCard.items.length, 2, 'Should only contain the 2 active & visible items');
    assert.equal(dto.rateCard.items.some((i) => i.id === 'item-3-draft'), false);
    assert.equal(dto.rateCard.items.some((i) => i.id === 'item-4-hidden'), false);

    // Item 1: visible price
    const item1 = dto.rateCard.items.find((i) => i.id === 'item-1');
    assert.equal(item1?.price, 25000);
    assert.equal(item1?.isPriceHidden, false);

    // Item 2: hidePricesPerItem = true -> price is null and isPriceHidden = true
    const item2 = dto.rateCard.items.find((i) => i.id === 'item-2');
    assert.equal(item2?.price, null);
    assert.equal(item2?.isPriceHidden, true);
  });

  await t.test('protects DPDP minor demographic threshold', () => {
    const dto = serializePublicProfile({
      profile: mockProfile,
      latestSocial: mockSocialLatest,
      rateCardItems: mockRateCardItems,
    });

    assert.ok(dto.audience);
    // 2% is < 5% threshold, must be suppressed to null
    assert.equal(dto.audience.share13To17, null);
    assert.equal(dto.audience.share18Plus, 94);
  });

  await t.test('respects section visibility toggles', () => {
    const hiddenProfile = {
      ...mockProfile,
      sectionVisibility: {
        platforms: false,
        stats: false,
        audience: false,
        topContent: false,
        rateCard: false,
        packages: false,
      },
    };

    const dto = serializePublicProfile({
      profile: hiddenProfile,
      latestSocial: mockSocialLatest,
      rateCardItems: mockRateCardItems,
    });

    assert.equal(dto.platforms, undefined, 'Platforms should be omitted');
    assert.equal(dto.stats, undefined, 'Stats should be omitted');
    assert.equal(dto.audience, undefined, 'Audience should be omitted');
    assert.equal(dto.topContent, undefined, 'Top content should be omitted');
    assert.equal(dto.rateCard, undefined, 'Rate card should be omitted');
    assert.equal(dto.packages, undefined, 'Packages should be omitted');
  });
});
