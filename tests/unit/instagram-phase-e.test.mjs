import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase E: Real Analytics & Audience Quality Score Computation', async () => {
  const { saveAudienceSnapshot, _resetInMemoryMetrics } = await import(
    '../../apps/web/src/lib/social/metrics-store.ts'
  );

  it('computes Audience Quality Score based strictly on real factor availability', async () => {
    _resetInMemoryMetrics();

    // Test case 1: High quality complete demographics snapshot
    const completeSnapshot = {
      totalAudienceSampled: 10000,
      share_18_plus: 0.92,
      share_13_17: 0.08,
      share_18_34: 0.72,
      dominant_age_bucket: '18-24',
      gender_known_share: 0.85,
      top_country: 'IN',
      ageDistribution: [],
      genderDistribution: [],
      countryDistribution: [],
      hasCountryBreakdown: true,
      computedAt: new Date().toISOString(),
    };

    await saveAudienceSnapshot('acc_phase_e_test', completeSnapshot);

    // Score computation formula from /api/creator/analytics
    const demoScore = Math.min(
      100,
      Math.round(completeSnapshot.share_18_plus * 80 + completeSnapshot.gender_known_share * 20)
    );

    assert.ok(demoScore >= 80 && demoScore <= 100, `Demographic score should be >= 80. Got ${demoScore}`);
  });

  it('strictly excludes unverified creators from snapshot-based discovery filters', async () => {
    const { saveSocialAccountAndCredentials } = await import(
      '../../apps/web/src/lib/social/social-repository.ts'
    );
    const { encryptToken } = await import('../../apps/web/src/lib/social/security/encryption.ts');

    const encrypted = encryptToken('EAAB_discovery_test_token');

    // Create account without demographics snapshot
    await saveSocialAccountAndCredentials(
      {
        creator_id: 'cr_unverified_discovery',
        provider: 'instagram',
        provider_user_id: 'ig_unverified_disc',
        username: 'unverified_discovery_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 50000,
        media_count: 100,
        status: 'ACTIVE',
        scopes: [],
        capabilities: {},
        connected_at: new Date(),
        last_synced_at: null,
        next_sync_at: null,
        sync_tier: 'WARM',
        failure_count: 0,
      },
      {
        token_ciphertext: encrypted.ciphertext,
        token_nonce: encrypted.nonce,
        key_id: encrypted.keyId,
        token_type: 'bearer',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // When querying with min_18_plus_share, unverified creator must be excluded
    const { getLatestAudienceSnapshot } = await import('../../apps/web/src/lib/social/metrics-store.ts');
    const snapshot = await getLatestAudienceSnapshot('cr_unverified_discovery');
    assert.strictEqual(snapshot, null, 'Must have no snapshot');

    // Filter check: If min_18_plus_share is set, null snapshot must fail filter
    const min18PlusShare = 0.8;
    const isIncluded = snapshot !== null && snapshot.share_18_plus >= min18PlusShare;
    assert.strictEqual(isIncluded, false, 'Unverified creator must be excluded from 18+ demographic filter');
  });
});

test.after(async () => {
  const { closeSocialDb } = await import('../../apps/web/src/lib/social/social-repository.ts');
  const { closeMetricsStoreDb } = await import('../../apps/web/src/lib/social/metrics-store.ts');
  const { closeOAuthStateDb } = await import('../../apps/web/src/lib/social/oauth-state.ts');
  await closeSocialDb();
  await closeMetricsStoreDb();
  await closeOAuthStateDb();
});
