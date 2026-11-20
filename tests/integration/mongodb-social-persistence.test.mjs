import test from 'node:test';
import assert from 'node:assert/strict';

test('MongoDB Social Persistence Integration Suite', async (t) => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) {
    console.log('Skipping MongoDB live integration test: MONGODB_URI not configured');
    return;
  }

  // Dynamically import web lib
  const {
    saveSocialAccountAndCredentials,
    getSocialAccountsByCreatorId,
    findSocialAccountByProviderId,
    getSocialCredentialByAccountId,
    disconnectSocialAccount,
  } = await import('../../apps/web/src/lib/social/social-repository.ts');

  const {
    upsertMetricPoints,
    getMetricSeries,
    saveAudienceSnapshot,
    getLatestAudienceSnapshot,
  } = await import('../../apps/web/src/lib/social/metrics-store.ts');

  const testCreatorId = `test_creator_${Date.now()}`;
  const testEmail = `creator_${Date.now()}@adzunova.com`;
  const testProviderUserId = `meta_ig_user_${Date.now()}`;

  await t.test('1. Saves social account and credentials to MongoDB Atlas', async () => {
    const res = await saveSocialAccountAndCredentials(
      {
        creator_id: testCreatorId,
        creator_email: testEmail,
        provider: 'instagram',
        provider_user_id: testProviderUserId,
        username: `test_handle_${Date.now()}`,
        account_type: 'BUSINESS',
        profile_picture_url: 'https://example.com/avatar.jpg',
        followers_count: 5432,
        media_count: 88,
        status: 'ACTIVE',
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        capabilities: { views_insights: true },
        connected_at: new Date(),
        last_synced_at: new Date(),
        next_sync_at: new Date(Date.now() + 6 * 3600 * 1000),
        sync_tier: 'HOT',
        failure_count: 0,
      },
      {
        token_ciphertext: 'enc_test_token_123',
        token_nonce: 'nonce_test_456',
        key_id: 'meta_v1',
        token_type: 'bearer',
        expires_at: new Date(Date.now() + 60 * 86400 * 1000),
        created_at: new Date(),
        rotated_at: null,
      }
    );

    assert.ok(res.accountId, 'Should return generated or assigned accountId');
    assert.equal(res.isNew, true, 'Should mark as new account');

    // Verify lookup by provider & providerUserId
    const found = await findSocialAccountByProviderId('instagram', testProviderUserId);
    assert.ok(found, 'Should find account by provider user ID');
    assert.equal(found.creator_id, testCreatorId);
    assert.equal(found.followers_count, 5432);

    // Verify lookup by creatorId
    const accounts = await getSocialAccountsByCreatorId(testCreatorId);
    assert.equal(accounts.length, 1);
    assert.equal(accounts[0].username, found.username);

    // Verify lookup by email fallback
    const accountsByEmail = await getSocialAccountsByCreatorId('unknown_session_id', testEmail);
    assert.equal(accountsByEmail.length, 1);
    assert.equal(accountsByEmail[0].id, found.id);

    // Verify credentials retrieved
    const cred = await getSocialCredentialByAccountId(found.id);
    assert.ok(cred, 'Should retrieve encrypted credentials');
    assert.equal(cred.token_ciphertext, 'enc_test_token_123');
  });

  await t.test('2. Persists and queries metric points in MongoDB', async () => {
    const account = await findSocialAccountByProviderId('instagram', testProviderUserId);
    assert.ok(account);

    const now = new Date();
    const count = await upsertMetricPoints([
      {
        accountId: account.id,
        metric: 'views',
        timestamp: new Date(now.getTime() - 3600 * 1000),
        value: 125,
        dimensions: { period: 'day' },
      },
      {
        accountId: account.id,
        metric: 'views',
        timestamp: now,
        value: 250,
        dimensions: { period: 'day' },
      },
    ]);

    assert.equal(count, 2, 'Should upsert 2 metric points');

    const series = await getMetricSeries(
      account.id,
      'views',
      new Date(now.getTime() - 24 * 3600 * 1000),
      new Date(now.getTime() + 3600 * 1000)
    );

    assert.equal(series.points.length, 2);
    assert.equal(series.points[0].value, 125);
    assert.equal(series.points[1].value, 250);
  });

  await t.test('3. Persists audience demographics snapshots in MongoDB', async () => {
    const account = await findSocialAccountByProviderId('instagram', testProviderUserId);
    assert.ok(account);

    await saveAudienceSnapshot(account.id, {
      totalFollowers: 5432,
      genderBreakdown: { male: 60, female: 40, unknown: 0 },
      ageBreakdown: { '18-24': 35, '25-34': 45 },
      countryBreakdown: { IN: 80, US: 20 },
      cityBreakdown: {},
      lastUpdated: new Date().toISOString(),
    });

    const snapshot = await getLatestAudienceSnapshot(account.id);
    assert.ok(snapshot);
    assert.equal(snapshot.totalFollowers, 5432);
    assert.equal(snapshot.countryBreakdown.IN, 80);
  });

  await t.test('4. Disconnects account and marks status REVOKED in MongoDB', async () => {
    const disconnected = await disconnectSocialAccount(testCreatorId, 'instagram');
    assert.equal(disconnected, true);

    const accounts = await getSocialAccountsByCreatorId(testCreatorId);
    assert.equal(accounts.length, 0, 'Revoked account should not be returned');

    const cred = await getSocialCredentialByAccountId(`sa_${testProviderUserId}`);
    // or test account id
    const found = await findSocialAccountByProviderId('instagram', testProviderUserId);
    assert.equal(found?.status, 'REVOKED');
  });
});
