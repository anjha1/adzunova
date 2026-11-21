import test from 'node:test';
import assert from 'node:assert/strict';
import { creatorSearchEngine } from '../../apps/web/src/lib/discovery/search-engine.ts';
import {
  getWorkspaceShortlists,
  createShortlist,
  toggleCreatorInShortlist,
} from '../../apps/web/src/lib/discovery/shortlist-service.ts';
import { upsertPublicProfile } from '../../apps/web/src/lib/public-profile/public-profile-repository.ts';
import { createRateCardItem } from '../../apps/web/src/lib/rate-card/rate-card-repository.ts';

test('Creator Discovery Engine: Search, Filtering & Truth Guarantees', async (t) => {
  const authenticCreatorId = 'd4dc7a3863c3030b5c840255';

  // Setup test fixture for isolated test runner
  await upsertPublicProfile(authenticCreatorId, {
    slug: 'anjha1',
    displayName: 'Achhuta Nand Jha',
    tags: ['Tech & Gadgets'],
    isPublished: true,
  });
  await createRateCardItem(authenticCreatorId, {
    platform: 'INSTAGRAM',
    contentFormat: 'REEL',
    deliverableType: 'DEDICATED_VIDEO',
    title: 'Dedicated Instagram Reel',
    price: 15000,
    status: 'ACTIVE',
    visibleToBrands: true,
  });

  await t.test('searches verified creator index and returns authentic card data', async () => {
    const res = await creatorSearchEngine.search({ limit: 10 });
    assert.ok(res.items.length > 0);
    assert.ok(res.totalCount > 0);

    const first = res.items[0];
    assert.ok(first.creatorId);
    assert.ok(first.handle);
    assert.equal(first.verifiedStatus, 'VERIFIED');
    assert.match(first.dataAsOfText, /Meta estimate|Meta OAuth/i);
    // When no query criteria are supplied, match score is null (never fake 75%)
    assert.equal(first.matchScore, null);

    // When brand specifies query criteria, match score is computed
    const targeted = await creatorSearchEngine.search({ category: first.category });
    assert.ok(targeted.items[0].matchScore !== null);
    assert.ok(targeted.items[0].matchScore > 0);
  });

  await t.test('filters by platform channel', async () => {
    const res = await creatorSearchEngine.search({ platform: 'instagram' });
    for (const item of res.items) {
      assert.equal(item.primaryPlatform, 'instagram');
    }
  });

  await t.test('excludes creators when demographic threshold is set higher than actual snapshot', async () => {
    // No creator on test index has 99.9% 18+ share
    const res = await creatorSearchEngine.search({ min18PlusShare: 99.9 });
    assert.equal(res.items.length, 0);
  });

  await t.test('computes facet breakdown across platforms, categories and reach bands', async () => {
    const facets = await creatorSearchEngine.getFacets({});
    assert.ok(facets.platforms);
    assert.ok(facets.categories);
    assert.ok(facets.followerBands);
  });

  await t.test('budget-first search successfully matches packages within total ceiling', async () => {
    // Budget ₹50,000 matches starter packages around ₹15,000
    const res = await creatorSearchEngine.search({ budgetAmount: 50000 });
    assert.ok(res.items.length > 0);
    assert.equal(res.queryMeta.budgetEvaluated, true);
  });

  await t.test('enforces self-dealing guard: brand owner cannot discover their own creator identity', async () => {
    // When brand user is the creator themselves
    const selfRes = await creatorSearchEngine.search({ requestingUserId: authenticCreatorId });
    assert.equal(selfRes.items.length, 0, 'Self-creator must be excluded from discovery');

    // When brand user is independent third party
    const independentRes = await creatorSearchEngine.search({ requestingUserId: 'different_brand_user_uuid' });
    assert.ok(independentRes.items.length > 0, 'Independent creator must appear in discovery');
    assert.equal(independentRes.items[0].creatorId, authenticCreatorId);
  });
});

test('Workspace Shortlists: Tenant Isolation & Toggle Operations', async (t) => {
  const ws1 = 'ws_enterprise_tata';
  const ws2 = 'ws_enterprise_reliance';

  const lists1 = await getWorkspaceShortlists(ws1);
  assert.ok(lists1.length > 0);
  const listId1 = lists1[0].id;

  // Toggle creator into ws1's shortlist
  const toggleRes = await toggleCreatorInShortlist(ws1, listId1, 'creator_anjha1');
  assert.equal(toggleRes.inShortlist, true);

  // Verify ws2 does not see creator in its shortlists (Tenant Isolation)
  const lists2 = await getWorkspaceShortlists(ws2);
  const listId2 = lists2[0].id;
  assert.ok(!lists2[0].creatorIds.includes('creator_anjha1'));

  // Toggle again in ws1 to remove
  const toggleOff = await toggleCreatorInShortlist(ws1, listId1, 'creator_anjha1');
  assert.equal(toggleOff.inShortlist, false);
});
