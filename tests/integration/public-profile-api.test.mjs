import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getPublicProfileBySlug,
  getPublicProfileByCreatorId,
  upsertPublicProfile,
  isSlugAvailable,
  calculateProfileCompleteness,
  recordProfileEvent,
  recordProfileReport,
  getProfileAnalytics,
  seedDemoProfile,
  getCreatorPackages,
  getCreatorTopContent,
} from '../../apps/web/src/lib/public-profile/public-profile-repository.ts';

test('Public Profile Repository: Persistence & Business Rules', async (t) => {
  const testCreatorId = `test-creator-${Date.now()}`;
  const initialSlug = `creator-alpha-${Date.now()}`;
  const updatedSlug = `creator-beta-${Date.now()}`;

  await t.test('upserts new public profile with initial slug', async () => {
    const prof = await upsertPublicProfile(testCreatorId, {
      slug: initialSlug,
      displayName: 'Alpha Creator',
      bio: 'High impact tech content creator.',
      isPublished: true,
    });

    assert.equal(prof.creatorId, testCreatorId);
    assert.equal(prof.slug, initialSlug);
    assert.equal(prof.isPublished, true);
    assert.equal(prof.previousSlugs.length, 0);

    const fetched = await getPublicProfileByCreatorId(testCreatorId);
    assert.ok(fetched);
    assert.equal(fetched.displayName, 'Alpha Creator');
  });

  await t.test('updates slug and preserves previous slug for 301 redirects', async () => {
    const updated = await upsertPublicProfile(testCreatorId, {
      slug: updatedSlug,
      displayName: 'Beta Creator',
    });

    assert.equal(updated.slug, updatedSlug);
    assert.equal(updated.previousSlugs.includes(initialSlug), true, 'Previous slug must be preserved');

    // Fetch by current slug -> direct match
    const directRes = await getPublicProfileBySlug(updatedSlug);
    assert.ok(directRes.profile);
    assert.equal(directRes.isRedirect, undefined);
    assert.equal(directRes.profile.slug, updatedSlug);

    // Fetch by old slug -> 301 redirect flag
    const redirectRes = await getPublicProfileBySlug(initialSlug);
    assert.ok(redirectRes.profile);
    assert.equal(redirectRes.isRedirect, true);
    assert.equal(redirectRes.redirectSlug, updatedSlug);
  });

  await t.test('enforces slug uniqueness and collision detection', async () => {
    const anotherCreatorId = `another-creator-${Date.now()}`;

    // Active slug is taken
    const resActive = await isSlugAvailable(updatedSlug, anotherCreatorId);
    assert.equal(resActive.available, false);

    // Previous slug is also reserved and cannot be hijacked
    const resPrev = await isSlugAvailable(initialSlug, anotherCreatorId);
    assert.equal(resPrev.available, false);

    // Same creator checking their own slug
    const resSelf = await isSlugAvailable(updatedSlug, testCreatorId);
    assert.equal(resSelf.available, true);

    // Available unique slug
    const resFresh = await isSlugAvailable(`fresh-slug-${Date.now()}`, anotherCreatorId);
    assert.equal(resFresh.available, true);
  });

  await t.test('calculates profile completeness correctly', async () => {
    const mockProfile = {
      avatarUrl: 'https://example.com/pic.jpg',
      bio: 'A verified tech creator with more than 30 characters in bio.',
    };
    const mockSocial = { hasConnectedAccount: true };
    const mockRateItems = [{ status: 'ACTIVE', visibleToBrands: true }];

    const completeness = await calculateProfileCompleteness(mockProfile, mockSocial, mockRateItems);
    assert.equal(completeness.score, 100);
    assert.equal(completeness.checklist.every((c) => c.completed), true);
  });

  await t.test('records privacy-safe analytics events and aggregates metrics', async () => {
    const profile = await getPublicProfileByCreatorId(testCreatorId);
    assert.ok(profile);

    // Record views and events with hashed sessions (no raw IP)
    await recordProfileEvent({
      profileId: profile.id,
      referrer: 'https://twitter.com/post/1',
      country: 'IN',
      deviceType: 'mobile',
      sessionHash: 'hash-visitor-1',
      eventType: 'VIEW',
    });

    await recordProfileEvent({
      profileId: profile.id,
      referrer: 'https://linkedin.com',
      country: 'IN',
      deviceType: 'desktop',
      sessionHash: 'hash-visitor-2',
      eventType: 'VIEW',
    });

    await recordProfileEvent({
      profileId: profile.id,
      referrer: '',
      country: 'IN',
      deviceType: 'desktop',
      sessionHash: 'hash-visitor-1',
      eventType: 'RATECARD_VIEW',
    });

    await recordProfileEvent({
      profileId: profile.id,
      referrer: '',
      country: 'IN',
      deviceType: 'mobile',
      sessionHash: 'hash-visitor-1',
      eventType: 'SHARE_CLICK',
    });

    const analytics = await getProfileAnalytics(profile.id, 7);

    assert.equal(analytics.pageViews, 2);
    assert.equal(analytics.uniqueVisitors, 2);
    assert.equal(analytics.rateCardViews, 1);
    assert.equal(analytics.shareEvents, 1);
    assert.ok(analytics.dailySeries.length > 0);
  });

  await t.test('records and queues abuse reports', async () => {
    const profile = await getPublicProfileByCreatorId(testCreatorId);
    assert.ok(profile);

    await recordProfileReport({
      profileId: profile.id,
      slug: profile.slug,
      reason: 'MISLEADING_STATS',
      details: 'Suspected inconsistent subscriber count reported.',
      reporterHash: 'rep-hash-123',
    });

    assert.ok(true, 'Report logged without error');
  });

  await t.test('seeds demo profile @a_n_jha1 with verified data and packages', async () => {
    const demoCreatorId = 'demo-test-jha';
    const demo = await seedDemoProfile(demoCreatorId, 'a_n_jha1');

    assert.equal(demo.slug, 'a_n_jha1');
    assert.equal(demo.displayName, 'Achhuta Nand Jha');
    assert.equal(demo.isPublished, true);

    const pkgs = getCreatorPackages(demoCreatorId);
    assert.ok(pkgs.length >= 2, 'Should have at least 2 demo packages');

    const topContent = getCreatorTopContent(demoCreatorId);
    assert.ok(topContent.length >= 2, 'Should have featured portfolio items');
  });
});
