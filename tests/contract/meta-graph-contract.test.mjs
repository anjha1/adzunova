import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase F: Meta Graph API Contract Tests (Scrubbed Fixtures)', async () => {
  const { probeAccountCapabilities } = await import('../../apps/web/src/lib/social/meta-client.ts');
  const { classifyMetaError } = await import('../../apps/web/src/lib/social/rate-limiter.ts');
  const { normalizeDemographics } = await import('../../apps/web/src/lib/social/demographics-engine.ts');

  // Recorded & token-scrubbed Meta Graph fixtures
  const FIXTURES = {
    profileSuccess: {
      username: 'adzunova_verified_creator',
      followers_count: 42100,
      media_count: 185,
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
});
