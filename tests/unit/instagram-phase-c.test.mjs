import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase C: Rate Limit Header Parser & Circuit Breaker', async () => {
  const {
    parseAppUsageHeader,
    parseBusinessUsageHeader,
    evaluateRateLimitHeaders,
    MetaCircuitBreaker,
    classifyMetaError,
    applyJitter,
    getJobDeduplicationKey,
  } = await import('../../apps/web/src/lib/social/rate-limiter.ts');

  it('parses x-app-usage header and calculates max utilization', () => {
    const raw = JSON.stringify({ call_count: 28, total_cputime: 15, total_time: 42 });
    const parsed = parseAppUsageHeader(raw);

    assert.ok(parsed);
    assert.strictEqual(parsed.call_count, 28);
    assert.strictEqual(parsed.total_cputime, 15);
    assert.strictEqual(parsed.total_time, 42);
    assert.strictEqual(parsed.max_percentage, 42);
  });

  it('parses x-business-use-case-usage header with nested objects', () => {
    const raw = JSON.stringify({
      '123456789': [
        {
          type: 'instagram',
          call_count: 55,
          total_cputime: 60,
          total_time: 75,
          estimated_time_to_regain_access: 10,
        },
      ],
    });
    const parsed = parseBusinessUsageHeader(raw);

    assert.ok(parsed);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].max_percentage, 75);
    assert.strictEqual(parsed[0].estimated_time_to_regain_access, 10);
  });

  it('evaluates rate-limit threshold and flags throttling at >= 90% utilization', () => {
    const highHeaders = {
      'x-app-usage': JSON.stringify({ call_count: 92, total_cputime: 80, total_time: 85 }),
    };
    const evalHigh = evaluateRateLimitHeaders(highHeaders);
    assert.strictEqual(evalHigh.maxUtilizationPct, 92);
    assert.strictEqual(evalHigh.shouldThrottle, true);

    const normalHeaders = {
      'x-app-usage': JSON.stringify({ call_count: 45, total_cputime: 30, total_time: 50 }),
    };
    const evalNormal = evaluateRateLimitHeaders(normalHeaders);
    assert.strictEqual(evalNormal.maxUtilizationPct, 50);
    assert.strictEqual(evalNormal.shouldThrottle, false);
  });

  it('transitions circuit breaker states: CLOSED -> OPEN -> HALF_OPEN -> CLOSED', async () => {
    const cb = new MetaCircuitBreaker();
    assert.strictEqual(cb.getStatus().state, 'CLOSED');
    assert.strictEqual(cb.canExecute(), true);

    // Record failures up to threshold (3)
    cb.recordFailure(false);
    cb.recordFailure(false);
    assert.strictEqual(cb.getStatus().state, 'CLOSED');

    cb.recordFailure(false); // 3rd failure triggers OPEN
    assert.strictEqual(cb.getStatus().state, 'OPEN');
    assert.strictEqual(cb.canExecute(), false);

    // Force short timeout for test verification
    cb.forceOpen(20); // 20ms backoff
    assert.strictEqual(cb.getStatus().state, 'OPEN');

    await new Promise((resolve) => setTimeout(resolve, 30));

    // After timeout, becomes HALF_OPEN
    assert.strictEqual(cb.getStatus().state, 'HALF_OPEN');
    assert.strictEqual(cb.canExecute(), true);

    // Success recovers back to CLOSED
    cb.recordSuccess();
    assert.strictEqual(cb.getStatus().state, 'CLOSED');
    assert.strictEqual(cb.getStatus().failureCount, 0);
  });

  it('classifies Meta Graph API error codes accurately', () => {
    // Error 190: Invalid token
    const tokenErr = classifyMetaError({ code: 190, message: 'Invalid OAuth access token' });
    assert.strictEqual(tokenErr.category, 'TOKEN_INVALID');
    assert.strictEqual(tokenErr.isRetryable, false);

    // Error 4 / 17 / 32 / 613: Throttling
    const throttleErr = classifyMetaError({ code: 613, message: 'Calls to this api have exceeded the rate limit' });
    assert.strictEqual(throttleErr.category, 'RATE_LIMITED');
    assert.strictEqual(throttleErr.isRetryable, true);
    assert.ok(throttleErr.recommendedBackoffSeconds > 0);

    // Error 10: Permission
    const permErr = classifyMetaError({ code: 10, message: 'Application does not have permission' });
    assert.strictEqual(permErr.category, 'PERMISSION_DENIED');
    assert.strictEqual(permErr.isRetryable, false);

    // Error 500: Transient
    const transientErr = classifyMetaError({ code: 500, message: 'An unknown error occurred' });
    assert.strictEqual(transientErr.category, 'TRANSIENT_ERROR');
    assert.strictEqual(transientErr.isRetryable, true);
  });

  it('bounds random jitter strictly within +/- 15%', () => {
    const base = 10000;
    for (let i = 0; i < 50; i++) {
      const jittered = applyJitter(base, -0.15, 0.15);
      assert.ok(jittered >= 8500 && jittered <= 11500, `Jitter ${jittered} outside +/-15%`);
    }
  });

  it('generates consistent, deterministic job deduplication keys', () => {
    const key1 = getJobDeduplicationKey('acc_123', 'views', '2026-11-19T14:35:10.000Z');
    const key2 = getJobDeduplicationKey('acc_123', 'views', '2026-11-19T14:59:59.000Z');
    const keyDiffHour = getJobDeduplicationKey('acc_123', 'views', '2026-11-19T15:00:00.000Z');

    assert.strictEqual(key1, key2, 'Same hour must produce identical deduplication key');
    assert.notStrictEqual(key1, keyDiffHour, 'Different hours must produce distinct deduplication keys');
    assert.strictEqual(key1, 'sync:acc_123:views:2026-11-19T14');
  });
});

describe('Phase C: Demographics Engine & Derived Audience Metrics', async () => {
  const { normalizeDemographics, STANDARD_AGE_BUCKETS } = await import(
    '../../apps/web/src/lib/social/demographics-engine.ts'
  );

  it('normalizes all 7 age buckets and retains Unknown (U) gender as distinct segment', () => {
    const mockGenderAgeResponse = {
      data: [
        {
          name: 'follower_demographics',
          period: 'lifetime',
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['gender', 'age'],
                results: [
                  { dimension_values: ['F', '13-17'], value: 50 },
                  { dimension_values: ['M', '13-17'], value: 50 },
                  { dimension_values: ['F', '18-24'], value: 300 },
                  { dimension_values: ['M', '24-34'], value: 500 }, // edge case matching 25-34
                  { dimension_values: ['U', '25-34'], value: 2000 }, // High unknown count
                  { dimension_values: ['F', '35-44'], value: 100 },
                  { dimension_values: ['M', '45-54'], value: 50 },
                  { dimension_values: ['F', '55-64'], value: 25 },
                  { dimension_values: ['M', '65+'], value: 25 },
                ],
              },
            ],
          },
        },
      ],
    };

    const mockCountryResponse = {
      data: [
        {
          name: 'follower_demographics',
          period: 'lifetime',
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['country'],
                results: [
                  { dimension_values: ['IN'], value: 2200 },
                  { dimension_values: ['US'], value: 600 },
                  { dimension_values: ['AE'], value: 300 },
                ],
              },
            ],
          },
        },
      ],
    };

    const derived = normalizeDemographics(mockGenderAgeResponse, mockCountryResponse);

    // Verify all 7 buckets exist
    assert.strictEqual(derived.ageDistribution.length, 7);
    for (let i = 0; i < STANDARD_AGE_BUCKETS.length; i++) {
      assert.strictEqual(derived.ageDistribution[i].bucket, STANDARD_AGE_BUCKETS[i]);
    }

    // Verify 13-17 minor share calculation
    assert.ok(derived.share_13_17 > 0, '13-17 share must be calculated');
    assert.ok(derived.share_18_plus > 0, '18+ share must be calculated');
    assert.strictEqual(Number((derived.share_18_plus + derived.share_13_17).toFixed(2)), 1.0);

    // Dominant age bucket should be 25-34 due to the large U sample
    assert.strictEqual(derived.dominant_age_bucket, '25-34');

    // Unknown gender segment must exist with descriptive note
    const uSegment = derived.genderDistribution.find((g) => g.gender === 'U');
    assert.ok(uSegment, 'Unknown gender segment must be preserved');
    assert.strictEqual(uSegment.count, 2000);
    assert.ok(uSegment.note?.includes('Meta estimate'), 'Must include Meta estimate note');

    // Country verification
    assert.strictEqual(derived.top_country, 'IN');
    assert.strictEqual(derived.hasCountryBreakdown, true);
    assert.strictEqual(derived.countryDistribution[0].countryCode, 'IN');
    assert.strictEqual(derived.countryDistribution[0].count, 2200);
  });

  it('handles empty or missing country breakdown with graceful fallback', () => {
    const mockGenderAgeOnly = {
      data: [
        {
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['gender', 'age'],
                results: [{ dimension_values: ['F', '18-24'], value: 100 }],
              },
            ],
          },
        },
      ],
    };

    const derived = normalizeDemographics(mockGenderAgeOnly, undefined);
    assert.strictEqual(derived.hasCountryBreakdown, false);
    assert.strictEqual(derived.top_country, null);
    assert.strictEqual(derived.countryDistribution.length, 0);
    assert.strictEqual(derived.dominant_age_bucket, '18-24');
    assert.strictEqual(derived.share_18_plus, 1.0);
    assert.strictEqual(derived.share_13_17, 0.0);
  });
});

describe('Phase C: Time Series Metrics Store', async () => {
  const {
    upsertMetricPoints,
    getMetricSeries,
    saveAudienceSnapshot,
    getLatestAudienceSnapshot,
    _resetInMemoryMetrics,
  } = await import('../../apps/web/src/lib/social/metrics-store.ts');

  beforeEach(() => {
    _resetInMemoryMetrics();
  });

  it('upserts metric points idempotently and retrieves range series', async () => {
    const t1 = new Date('2026-11-19T10:00:00.000Z');
    const t2 = new Date('2026-11-19T11:00:00.000Z');

    await upsertMetricPoints([
      { accountId: 'acc_test_1', metric: 'views', timestamp: t1, value: 500 },
      { accountId: 'acc_test_1', metric: 'views', timestamp: t2, value: 750 },
    ]);

    // Query series
    const series = await getMetricSeries(
      'acc_test_1',
      'views',
      new Date('2026-11-19T09:00:00.000Z'),
      new Date('2026-11-19T12:00:00.000Z')
    );

    assert.strictEqual(series.points.length, 2);
    assert.strictEqual(series.points[0].value, 500);
    assert.strictEqual(series.points[1].value, 750);

    // Upsert identical timestamp with updated value (idempotent update)
    await upsertMetricPoints([
      { accountId: 'acc_test_1', metric: 'views', timestamp: t1, value: 550 },
    ]);

    const updatedSeries = await getMetricSeries(
      'acc_test_1',
      'views',
      new Date('2026-11-19T09:00:00.000Z'),
      new Date('2026-11-19T12:00:00.000Z')
    );

    assert.strictEqual(updatedSeries.points.length, 2, 'Must not duplicate identical timestamp');
    assert.strictEqual(updatedSeries.points[0].value, 550, 'Value must be updated idempotently');
  });

  it('persists and retrieves audience demographics snapshots', async () => {
    const mockSnapshot = {
      totalAudienceSampled: 5000,
      share_18_plus: 0.92,
      share_13_17: 0.08,
      share_18_34: 0.74,
      dominant_age_bucket: '18-24',
      gender_known_share: 0.85,
      top_country: 'IN',
      ageDistribution: [],
      genderDistribution: [],
      countryDistribution: [],
      hasCountryBreakdown: true,
      computedAt: new Date().toISOString(),
    };

    await saveAudienceSnapshot('acc_test_snapshot', mockSnapshot);
    const retrieved = await getLatestAudienceSnapshot('acc_test_snapshot');

    assert.ok(retrieved);
    assert.strictEqual(retrieved.top_country, 'IN');
    assert.strictEqual(retrieved.share_18_plus, 0.92);
    assert.strictEqual(retrieved.dominant_age_bucket, '18-24');
  });
});

describe('Phase C: Scheduler & Shard Partitioning', async () => {
  const { getAccountShard, determineSyncTier } = await import(
    '../../apps/web/src/lib/social/scheduler.ts'
  );

  it('assigns shards deterministically and spreads across shards', () => {
    const shard0 = getAccountShard('acc_001', 4);
    const shardAgain = getAccountShard('acc_001', 4);
    assert.strictEqual(shard0, shardAgain, 'Shard assignment must be deterministic');

    // Test distribution across 4 shards
    const distribution = [0, 0, 0, 0];
    for (let i = 0; i < 100; i++) {
      const s = getAccountShard(`test_creator_account_${i}`, 4);
      distribution[s]++;
    }
    for (const count of distribution) {
      assert.ok(count > 10, 'Each shard must receive work');
    }
  });

  it('calculates sync tiers dynamically based on activity and campaign status', () => {
    const mockAccount = {
      id: 'acc_1',
      creator_id: 'cr_1',
      provider: 'instagram',
      provider_user_id: '123',
      username: 'creator1',
      account_type: 'BUSINESS',
      profile_picture_url: null,
      followers_count: 10000,
      media_count: 150,
      status: 'ACTIVE',
      scopes: [],
      capabilities: {},
      connected_at: new Date(),
      last_synced_at: new Date(),
      next_sync_at: new Date(),
      sync_tier: 'WARM',
      failure_count: 0,
    };

    // Active campaigns -> HOT tier
    assert.strictEqual(determineSyncTier(mockAccount, true, 10), 'HOT');

    // Recent login (<48h) -> HOT tier
    assert.strictEqual(determineSyncTier(mockAccount, false, 24), 'HOT');

    // Inactive (>30d) -> COLD tier
    assert.strictEqual(determineSyncTier(mockAccount, false, 35 * 24), 'COLD');

    // Multiple consecutive failures (>=5) -> COLD tier (backoff)
    const failingAccount = { ...mockAccount, failure_count: 5 };
    assert.strictEqual(determineSyncTier(failingAccount, false, 100), 'COLD');

    // Normal active without campaigns -> WARM tier
    assert.strictEqual(determineSyncTier(mockAccount, false, 72), 'WARM');
  });
});

describe('Phase C: Sync Worker Pipeline Execution & Outbox Events', async () => {
  const { saveSocialAccountAndCredentials, getSocialAccountById, getSocialOutboxEvents } = await import(
    '../../apps/web/src/lib/social/social-repository.ts'
  );
  const { encryptToken } = await import('../../apps/web/src/lib/social/security/encryption.ts');
  const { syncInstagramAccount, calculateNextSyncDate } = await import(
    '../../apps/web/src/lib/social/sync-worker.ts'
  );

  it('calculates tier-based next_sync_at with jitter and failure backoff', () => {
    const now = Date.now();
    const hotSync = calculateNextSyncDate('HOT', 0);
    const warmSync = calculateNextSyncDate('WARM', 0);
    const coldSync = calculateNextSyncDate('COLD', 0);

    // HOT ~4h (14400s +/- 15% = 12240s to 16560s)
    const hotDiff = (hotSync.getTime() - now) / 1000;
    assert.ok(hotDiff >= 12000 && hotDiff <= 17000, `HOT diff was ${hotDiff}`);

    // WARM ~24h (86400s +/- 15% = 73440s to 99360s)
    const warmDiff = (warmSync.getTime() - now) / 1000;
    assert.ok(warmDiff >= 73000 && warmDiff <= 100000, `WARM diff was ${warmDiff}`);

    // COLD ~7d
    const coldDiff = (coldSync.getTime() - now) / 1000;
    assert.ok(coldDiff >= 500000 && coldDiff <= 700000, `COLD diff was ${coldDiff}`);

    // Failure backoff should increase delay
    const failSync1 = calculateNextSyncDate('WARM', 1);
    const failSync2 = calculateNextSyncDate('WARM', 2);
    assert.ok(failSync2.getTime() > failSync1.getTime(), 'Subsequent failure must increase backoff');
  });

  it('runs sync cycle, updates account state, and emits outbox events on success', async () => {
    const encrypted = encryptToken('EAAB_valid_test_token_123');
    const { accountId } = await saveSocialAccountAndCredentials(
      {
        creator_id: 'creator_phase_c_1',
        provider: 'instagram',
        provider_user_id: 'ig_user_phase_c_1',
        username: 'phase_c_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 5000,
        media_count: 50,
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        capabilities: { basic_profile: true, views_insights: true },
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
        expires_at: new Date(Date.now() + 60 * 86400 * 1000),
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // Mock global fetch for Graph API responses
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/insights') && urlStr.includes('metric=views')) {
        return new Response(
          JSON.stringify({
            data: [{ name: 'views', period: 'day', total_value: { value: 1250 } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json', 'x-app-usage': '{"call_count":10,"total_cputime":5,"total_time":8}' } }
        );
      }
      if (urlStr.includes('/insights') && urlStr.includes('metric=follower_demographics')) {
        return new Response(
          JSON.stringify({
            data: [
              {
                name: 'follower_demographics',
                period: 'lifetime',
                total_value: {
                  breakdowns: [
                    {
                      dimension_keys: ['gender', 'age'],
                      results: [
                        { dimension_values: ['F', '18-24'], value: 2000 },
                        { dimension_values: ['M', '25-34'], value: 3500 },
                      ],
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Profile request
      return new Response(
        JSON.stringify({
          username: 'phase_c_creator',
          followers_count: 5500,
          media_count: 52,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'x-app-usage': '{"call_count":12,"total_cputime":6,"total_time":10}' } }
      );
    };

    try {
      const result = await syncInstagramAccount(accountId, { forceDemographics: true });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.newFollowersCount, 5500);
      assert.strictEqual(result.newMediaCount, 52);
      assert.strictEqual(result.newViews24h, 1250);
      assert.strictEqual(result.demographicsCollected, true);

      // Verify account state was updated in repository
      const updatedAccount = await getSocialAccountById(accountId);
      assert.ok(updatedAccount);
      assert.strictEqual(updatedAccount.followers_count, 5500);
      assert.strictEqual(updatedAccount.media_count, 52);
      assert.strictEqual(updatedAccount.failure_count, 0);
      assert.ok(updatedAccount.last_synced_at !== null);

      // Verify outbox events were emitted
      const outbox = await getSocialOutboxEvents(10);
      const metricsEvent = outbox.find((e) => e.event_type === 'MetricsUpdated');
      const audienceEvent = outbox.find((e) => e.event_type === 'AudienceSnapshotUpdated');

      assert.ok(metricsEvent, 'MetricsUpdated event must be in outbox');
      assert.strictEqual(metricsEvent.payload.followersCount, 5500);
      assert.strictEqual(metricsEvent.payload.views24h, 1250);

      assert.ok(audienceEvent, 'AudienceSnapshotUpdated event must be in outbox');
      assert.strictEqual(audienceEvent.payload.share_18_plus, 1.0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('handles Meta Error 190 (token expired): transitions to RECONNECT_REQUIRED and emits SocialTokenInvalid', async () => {
    const encrypted = encryptToken('EAAB_expired_token_test');
    const { accountId } = await saveSocialAccountAndCredentials(
      {
        creator_id: 'creator_phase_c_expired',
        provider: 'instagram',
        provider_user_id: 'ig_user_phase_c_expired',
        username: 'expired_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 1000,
        media_count: 10,
        scopes: ['instagram_basic'],
        capabilities: { basic_profile: true },
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

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      return new Response(
        JSON.stringify({
          error: {
            message: 'Error validating access token: Session has expired.',
            type: 'OAuthException',
            code: 190,
            error_subcode: 463,
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    };

    try {
      const result = await syncInstagramAccount(accountId);

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error?.category, 'TOKEN_INVALID');
      assert.strictEqual(result.error?.code, 190);

      // Verify status changed to RECONNECT_REQUIRED
      const updatedAccount = await getSocialAccountById(accountId);
      assert.ok(updatedAccount);
      assert.strictEqual(updatedAccount.status, 'RECONNECT_REQUIRED');

      // Verify SocialTokenInvalid event in outbox
      const outbox = await getSocialOutboxEvents(10);
      const tokenInvalidEvent = outbox.find(
        (e) => e.event_type === 'SocialTokenInvalid' && e.aggregate_id === 'creator_phase_c_expired'
      );
      assert.ok(tokenInvalidEvent, 'SocialTokenInvalid event must be emitted');
      assert.strictEqual(tokenInvalidEvent.payload.code, 190);
    } finally {
      globalThis.fetch = originalFetch;
    }
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
