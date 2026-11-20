import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase F: Meta Graph API Contract Tests (Scrubbed Fixtures)', async () => {
  process.env.META_APP_SECRET = 'test_meta_app_secret_32char_key!';
  process.env.META_APP_ID = '1476081104709396';
  process.env.INSTAGRAM_REDIRECT_URI = 'https://adzunova-web.onrender.com/api/auth/instagram/callback';

  const { probeAccountCapabilities, resolveInstagramAccountsUnified } = await import('../../apps/web/src/lib/social/meta-client.ts');
  const { classifyMetaError } = await import('../../apps/web/src/lib/social/rate-limiter.ts');
  const { normalizeDemographics } = await import('../../apps/web/src/lib/social/demographics-engine.ts');

  // Recorded & token-scrubbed Meta Graph fixtures
  const FIXTURES = {
    profileSuccess: {
      username: 'adzunova_verified_creator',
      followers_count: 42100,
      media_count: 185,
    },
    debugTokenGranularScopes: {
      data: {
        app_id: '1476081104709396',
        type: 'USER',
        application: 'Adzunova',
        is_valid: true,
        user_id: '10234567890123456',
        scopes: ['instagram_basic', 'instagram_manage_insights', 'public_profile'],
        granular_scopes: [
          {
            scope: 'instagram_basic',
            target_ids: ['17841433187658828'],
          },
          {
            scope: 'instagram_manage_insights',
            target_ids: ['17841433187658828'],
          },
        ],
      },
    },
    instagramAccountProfile: {
      id: '17841433187658828',
      username: 'a_n_jha1',
      name: 'Achhuta Nand Jha',
      followers_count: 1240,
      media_count: 42,
    },
    // Real debug_token shape for SYSTEM_USER (Unified Login / Facebook Login for Business)
    // Target_ids are EMPTY for SYSTEM_USER tokens — this is the actual observed behavior
    debugTokenSystemUser: {
      data: {
        app_id: '1476081104709396',
        type: 'SYSTEM_USER',
        application: 'Adzunova',
        is_valid: true,
        user_id: '12345678901234567',
        scopes: ['instagram_basic', 'instagram_manage_insights', 'instagram_manage_messages', 'public_profile'],
        granular_scopes: [
          { scope: 'instagram_basic', target_ids: [] },
          { scope: 'instagram_manage_insights', target_ids: [] },
          { scope: 'instagram_manage_messages', target_ids: [] },
        ],
      },
    },
    // Response from GET /me/assigned_instagram_accounts for SYSTEM_USER
    assignedInstagramAccountsSuccess: {
      data: [
        {
          id: '17841433187658828',
          username: 'a_n_jha1',
          name: 'Achhuta Nand Jha',
          profile_picture_url: null,
          followers_count: 1240,
          media_count: 42,
        },
      ],
    },
    // Response from GET /me/businesses for SYSTEM_USER (expected 400)
    meBusinessesError400: {
      error: {
        message: '(#100) Tried accessing nonexisting field (businesses) on node type (SystemUser)',
        type: 'OAuthException',
        code: 100,
        error_subcode: 33,
        fbtrace_id: 'AzK_79hL2kP',
      },
    },
    viewsSuccess: {
      data: [
        {
          name: 'views',
          period: 'day',
          title: 'Views',
          description: 'The number of times your reels were played or content was viewed',
          total_value: { value: 3420 },
          id: '17841400000000000/insights/views/day',
        },
      ],
    },
    demographicsGenderAgeSuccess: {
      data: [
        {
          name: 'follower_demographics',
          period: 'lifetime',
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['gender', 'age'],
                results: [
                  { dimension_values: ['F', '13-17'], value: 120 },
                  { dimension_values: ['M', '13-17'], value: 80 },
                  { dimension_values: ['F', '18-24'], value: 4500 },
                  { dimension_values: ['M', '18-24'], value: 3800 },
                  { dimension_values: ['U', '18-24'], value: 12000 },
                  { dimension_values: ['F', '25-34'], value: 8200 },
                  { dimension_values: ['M', '25-34'], value: 6100 },
                  { dimension_values: ['U', '25-34'], value: 5000 },
                  { dimension_values: ['F', '35-44'], value: 1100 },
                  { dimension_values: ['M', '35-44'], value: 800 },
                  { dimension_values: ['F', '45-54'], value: 250 },
                  { dimension_values: ['M', '45-54'], value: 150 },
                ],
              },
            ],
          },
        },
      ],
    },
    demographicsCountrySuccess: {
      data: [
        {
          name: 'follower_demographics',
          period: 'lifetime',
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['country'],
                results: [
                  { dimension_values: ['IN'], value: 28500 },
                  { dimension_values: ['US'], value: 8200 },
                  { dimension_values: ['AE'], value: 3400 },
                  { dimension_values: ['GB'], value: 2000 },
                ],
              },
            ],
          },
        },
      ],
    },
    errorTokenInvalid190: {
      error: {
        message: 'Error validating access token: The session has been invalidated because the user changed their password or Facebook has changed the session for security reasons.',
        type: 'OAuthException',
        code: 190,
        error_subcode: 460,
        fbtrace_id: 'AzK_79hL2kP',
      },
    },
    errorRateLimited613: {
      error: {
        message: 'Calls to this api have exceeded the rate limit. (fbtrace_id: BxM_41jKl0)',
        type: 'OAuthException',
        code: 613,
        error_subcode: 1487742,
        is_transient: true,
      },
    },
    errorPermissionDenied10: {
      error: {
        message: '(#10) Application does not have permission for this action',
        type: 'OAuthException',
        code: 10,
        fbtrace_id: 'CpQ_83mNp1',
      },
    },
  };

  it('contract: verifies probeAccountCapabilities parses real recorded Meta contract', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = decodeURIComponent(url.toString());
      if (urlStr.includes('/insights') && urlStr.includes('metric=views')) {
        return new Response(JSON.stringify(FIXTURES.viewsSuccess), { status: 200 });
      }
      if (urlStr.includes('/insights') && urlStr.includes('breakdown=gender,age')) {
        return new Response(JSON.stringify(FIXTURES.demographicsGenderAgeSuccess), { status: 200 });
      }
      if (urlStr.includes('/insights') && urlStr.includes('breakdown=country')) {
        return new Response(JSON.stringify(FIXTURES.demographicsCountrySuccess), { status: 200 });
      }
      return new Response(JSON.stringify(FIXTURES.profileSuccess), { status: 200 });
    };

    try {
      const probe = await probeAccountCapabilities('17841400000000000', 'EAAB_contract_token');

      assert.strictEqual(probe.basic_profile, true);
      assert.strictEqual(probe.views_insights, true);
      assert.strictEqual(probe.views_sample, 3420);
      assert.strictEqual(probe.demographics_gender_age, true);
      assert.strictEqual(probe.demographics_country, true);
      assert.strictEqual(probe.gender_sample_found, true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('contract: normalizes real Meta demographics responses and handles Unknown (U) gender', () => {
    const derived = normalizeDemographics(
      FIXTURES.demographicsGenderAgeSuccess,
      FIXTURES.demographicsCountrySuccess
    );

    assert.strictEqual(derived.top_country, 'IN');
    assert.strictEqual(derived.countryDistribution[0].countryCode, 'IN');
    assert.strictEqual(derived.countryDistribution[0].count, 28500);

    // Minor audience share
    assert.ok(derived.share_13_17 > 0);
    assert.ok(derived.share_18_plus > 0.95);

    // Unknown gender segment exists
    const uSegment = derived.genderDistribution.find((g) => g.gender === 'U');
    assert.ok(uSegment);
    assert.strictEqual(uSegment.count, 17000);
  });

  it('contract: accurately classifies real Meta error payloads', () => {
    const tokenCls = classifyMetaError(FIXTURES.errorTokenInvalid190);
    assert.strictEqual(tokenCls.category, 'TOKEN_INVALID');
    assert.strictEqual(tokenCls.code, 190);
    assert.strictEqual(tokenCls.isRetryable, false);

    const rateCls = classifyMetaError(FIXTURES.errorRateLimited613);
    assert.strictEqual(rateCls.category, 'RATE_LIMITED');
    assert.strictEqual(rateCls.code, 613);
    assert.strictEqual(rateCls.isRetryable, true);

    const permCls = classifyMetaError(FIXTURES.errorPermissionDenied10);
    assert.strictEqual(permCls.category, 'PERMISSION_DENIED');
    assert.strictEqual(permCls.code, 10);
    assert.strictEqual(permCls.isRetryable, false);
  });

  it('contract: resolveInstagramAccountsUnified discovers account via granular_scopes target_ids (Discovery a) without Facebook Page', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];

    globalThis.fetch = async (url) => {
      const urlStr = decodeURIComponent(url.toString());
      requests.push(urlStr);

      if (urlStr.includes('/debug_token')) {
        return new Response(JSON.stringify(FIXTURES.debugTokenGranularScopes), { status: 200 });
      }
      if (urlStr.includes('/17841433187658828')) {
        return new Response(JSON.stringify(FIXTURES.instagramAccountProfile), { status: 200 });
      }
      return new Response(JSON.stringify({ error: { message: 'Unexpected call' } }), { status: 400 });
    };

    try {
      const result = await resolveInstagramAccountsUnified('EAAB_valid_long_lived_token');

      // 1. Must stop at Discovery (a) granular_scopes
      assert.strictEqual(result.discoveryMethod, 'granular_scopes');
      assert.strictEqual(result.accounts.length, 1);
      assert.strictEqual(result.accounts[0].id, '17841433187658828');
      assert.strictEqual(result.accounts[0].username, 'a_n_jha1');
      assert.strictEqual(result.accounts[0].followers_count, 1240);
      assert.strictEqual(result.accounts[0].media_count, 42);

      // 2. Verified that NO call was made to /me/accounts (legacy Facebook Pages) or /me/businesses
      const calledPages = requests.some((r) => r.includes('/me/accounts'));
      const calledBusinesses = requests.some((r) => r.includes('/me/businesses'));
      assert.strictEqual(calledPages, false, 'Should not request Facebook Pages when granular_scopes resolves account');
      assert.strictEqual(calledBusinesses, false, 'Should not request /me/businesses when granular_scopes resolves account');

      // 3. Verified debugToken summary
      assert.strictEqual(result.debugToken.isValid, true);
      assert.strictEqual(result.debugToken.targetIdCount, 1);
      assert.strictEqual(result.debugToken.appId, '1476081104709396');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('contract: resolveInstagramAccountsUnified falls back to Discovery (c) legacy pages when granular scopes are empty', async () => {
    const originalFetch = globalThis.fetch;
    const debugTokenNoGranular = {
      data: {
        app_id: '1476081104709396',
        type: 'USER',
        is_valid: true,
        user_id: '10234567890123456',
        scopes: ['instagram_basic', 'pages_show_list'],
        granular_scopes: [],
      },
    };
    const legacyPagesResponse = {
      data: [
        {
          id: 'page_123',
          name: 'My Creator Page',
          instagram_business_account: {
            id: '17841499999999999',
            username: 'fallback_creator',
            name: 'Fallback Creator',
            followers_count: 500,
            media_count: 10,
          },
        },
      ],
    };

    globalThis.fetch = async (url) => {
      const urlStr = decodeURIComponent(url.toString());
      if (urlStr.includes('/debug_token')) {
        return new Response(JSON.stringify(debugTokenNoGranular), { status: 200 });
      }
      if (urlStr.includes('/me/businesses')) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      if (urlStr.includes('/me/accounts')) {
        return new Response(JSON.stringify(legacyPagesResponse), { status: 200 });
      }
      if (urlStr.includes('/17841499999999999')) {
        return new Response(JSON.stringify({
          id: '17841499999999999',
          username: 'fallback_creator',
          name: 'Fallback Creator',
          followers_count: 500,
          media_count: 10,
        }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: { message: 'Unexpected call' } }), { status: 400 });
    };

    try {
      const result = await resolveInstagramAccountsUnified('EAAB_valid_long_lived_token');
      assert.strictEqual(result.discoveryMethod, 'legacy_pages');
      assert.strictEqual(result.accounts.length, 1);
      assert.strictEqual(result.accounts[0].username, 'fallback_creator');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('contract: SYSTEM_USER token discovers account via GET /me/assigned_instagram_accounts (Discovery SU)', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];

    globalThis.fetch = async (url) => {
      const urlStr = decodeURIComponent(url.toString());
      requests.push(urlStr);

      if (urlStr.includes('/debug_token')) {
        return new Response(JSON.stringify(FIXTURES.debugTokenSystemUser), { status: 200 });
      }
      if (urlStr.includes('/me/assigned_instagram_accounts') || urlStr.includes('/assigned_instagram_accounts')) {
        return new Response(JSON.stringify(FIXTURES.assignedInstagramAccountsSuccess), { status: 200 });
      }
      if (urlStr.includes('/me/businesses')) {
        return new Response(JSON.stringify(FIXTURES.meBusinessesError400), { status: 400 });
      }
      if (urlStr.includes('/me/accounts')) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      if (urlStr.includes('/17841433187658828')) {
        return new Response(JSON.stringify(FIXTURES.instagramAccountProfile), { status: 200 });
      }
      return new Response(JSON.stringify({ error: { message: 'Unexpected call' } }), { status: 400 });
    };

    try {
      const result = await resolveInstagramAccountsUnified('EAAB_system_user_token');

      // Must use assigned_instagram_accounts discovery method
      assert.strictEqual(result.discoveryMethod, 'assigned_instagram_accounts');
      assert.strictEqual(result.accounts.length, 1);
      assert.strictEqual(result.accounts[0].id, '17841433187658828');
      assert.strictEqual(result.accounts[0].username, 'a_n_jha1');
      assert.strictEqual(result.accounts[0].followers_count, 1240);
      assert.strictEqual(result.accounts[0].media_count, 42);

      // Verified token type is captured
      assert.strictEqual(result.debugToken.tokenType, 'SYSTEM_USER');
      assert.strictEqual(result.debugToken.isValid, true);

      // Should NOT have called /me/businesses or /me/accounts (stopped early)
      const calledBusinesses = requests.some((r) => r.includes('/me/businesses'));
      const calledPages = requests.some((r) => r.includes('/me/accounts'));
      assert.strictEqual(calledBusinesses, false, 'Should not call /me/businesses when assigned_instagram_accounts succeeds');
      assert.strictEqual(calledPages, false, 'Should not call /me/accounts when assigned_instagram_accounts succeeds');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('contract: SYSTEM_USER token with empty assigned_instagram_accounts falls back to granular_scopes then other methods', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];

    globalThis.fetch = async (url) => {
      const urlStr = decodeURIComponent(url.toString());
      requests.push(urlStr);

      if (urlStr.includes('/debug_token')) {
        return new Response(JSON.stringify(FIXTURES.debugTokenSystemUser), { status: 200 });
      }
      if (urlStr.includes('/assigned_instagram_accounts')) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      if (urlStr.includes('/me/businesses')) {
        return new Response(JSON.stringify(FIXTURES.meBusinessesError400), { status: 400 });
      }
      if (urlStr.includes('/me/accounts')) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      if (urlStr.includes('/17841433187658828')) {
        return new Response(JSON.stringify(FIXTURES.instagramAccountProfile), { status: 200 });
      }
      return new Response(JSON.stringify({ error: { message: 'Unexpected call' } }), { status: 400 });
    };

    try {
      const result = await resolveInstagramAccountsUnified('EAAB_system_user_token_empty');

      // Should fall through all methods and return no_instagram_account_granted
      assert.strictEqual(result.discoveryMethod, 'none');
      assert.strictEqual(result.accounts.length, 0);
      assert.strictEqual(result.errorReason, 'no_instagram_account_granted');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
