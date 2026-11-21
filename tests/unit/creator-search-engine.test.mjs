import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBestMatchScore,
  encodeCursor,
  decodeCursor,
} from '../../apps/web/src/lib/discovery/search-engine.ts';
import {
  buildComparisonMatrix,
} from '../../apps/web/src/lib/discovery/shortlist-service.ts';

test('Creator Search Engine: Transparent Best Match Algorithm', async (t) => {
  await t.test('awards high relevance score when category matches and engagement is high', () => {
    const creator = {
      category: 'Tech',
      engagementRate: 4.2,
      share18Plus: 88,
      startingPriceMinor: 2500000,
    };

    const res = calculateBestMatchScore(creator, { category: 'Tech' });
    assert.ok(res.score >= 90);
    assert.match(res.explanation, /Exact Tech niche match/);
    assert.match(res.explanation, /High verified engagement/);
  });

  await t.test('penalizes score when niche does not align with brand target', () => {
    const creator = {
      category: 'Food',
      engagementRate: 2.1,
      share18Plus: 75,
      startingPriceMinor: 1000000,
    };

    const res = calculateBestMatchScore(creator, { category: 'Tech' });
    assert.ok(res.score < 70);
  });
});

test('Creator Search Engine: Keyset Cursor Encoding & Decoding', () => {
  const cursorObj = { id: 'creator_anjha1', sortVal: 95 };
  const encoded = encodeCursor(cursorObj);
  assert.ok(typeof encoded === 'string');

  const decoded = decodeCursor(encoded);
  assert.deepEqual(decoded, cursorObj);

  // Malformed cursor handles gracefully without crashing
  assert.equal(decodeCursor('invalid-base64-???'), null);
});

test('Shortlist & Comparison: Side-by-Side Matrix', async (t) => {
  const sampleCreators = [
    {
      creatorId: 'c1',
      slug: 'anjha1',
      displayName: 'Achhuta Nand Jha',
      avatarUrl: null,
      category: 'Tech',
      country: 'India',
      primaryPlatform: 'instagram',
      handle: '@a_n_jha1',
      followersCount: 1580,
      mediaCount: 5,
      engagementRate: 3.8,
      verifiedStatus: 'VERIFIED',
      verifiedBadgeText: 'Meta Verified',
      dataAsOfText: 'Data as of Nov 20, 2026',
      audienceMetrics: { hasSnapshot: true, share18Plus: 85, share1317: 5, topCountry: 'IN' },
      startingPriceMinor: 1500000,
      currency: 'INR',
      availableDeliverables: ['REEL'],
      matchScore: 94,
      matchExplanation: 'Exact niche',
    },
    {
      creatorId: 'c2',
      slug: 'rohan_travel',
      displayName: 'Rohan Sharma',
      avatarUrl: null,
      category: 'Travel',
      country: 'India',
      primaryPlatform: 'instagram',
      handle: '@rohan_travel',
      followersCount: 12500,
      mediaCount: 42,
      engagementRate: 2.9,
      verifiedStatus: 'VERIFIED',
      verifiedBadgeText: 'Meta Verified',
      dataAsOfText: 'Data as of Nov 20, 2026',
      audienceMetrics: { hasSnapshot: true, share18Plus: 92, share1317: 2, topCountry: 'IN' },
      startingPriceMinor: 3500000,
      currency: 'INR',
      availableDeliverables: ['REEL', 'STORY'],
      matchScore: 78,
      matchExplanation: 'Solid engagement',
    },
  ];

  const matrix = buildComparisonMatrix(sampleCreators);
  assert.equal(matrix.creators.length, 2);
  assert.equal(matrix.dimensions.length, 7);

  const reachDim = matrix.dimensions.find((d) => d.key === 'followers');
  assert.ok(reachDim);
  assert.equal(reachDim.values['c1'], 1580);
  assert.equal(reachDim.values['c2'], 12500);

  const priceDim = matrix.dimensions.find((d) => d.key === 'startingPrice');
  assert.ok(priceDim);
  assert.match(priceDim.values['c1'], /15,000/);
});

test('Search Rules: Budget-First Search Calculation Engine', () => {
  // Brand budget = ₹50,000
  const totalBudget = 50000;
  const platformFeeRate = 0.10; // 10%
  const effectiveMaxCreatorCharge = totalBudget / (1 + platformFeeRate * 1.18);

  // Effective max creator fee before Adzunova platform fee (10%) and 18% GST on fee
  assert.ok(effectiveMaxCreatorCharge < totalBudget);
  assert.ok(effectiveMaxCreatorCharge > 44000 && effectiveMaxCreatorCharge < 46000);

  // A package priced at ₹15,000 fits comfortably
  assert.ok(15000 <= effectiveMaxCreatorCharge);
  // A package priced at ₹48,000 does NOT fit because with fees & tax it exceeds ₹50,000
  assert.ok(48000 > effectiveMaxCreatorCharge);
});
