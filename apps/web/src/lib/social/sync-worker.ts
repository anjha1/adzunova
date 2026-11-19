/**
 * Instagram Data Pipeline Sync Worker
 * Orchestrates API calls, rate limiting, error classification, metrics storage, and outbox events.
 */

import {
  getSocialAccountById,
  getSocialCredentialByAccountId,
  updateSocialAccountSyncState,
  emitSocialOutboxEvent,
  SocialAccount,
} from './social-repository';
import { decryptToken } from './security/encryption';
import { createAppSecretProof } from './security/meta-signature';
import { scrubSensitiveData, stripTokenFromPagingUrl } from './security/log-scrubber';
import {
  MetaCircuitBreaker,
  evaluateRateLimitHeaders,
  classifyMetaError,
  applyJitter,
} from './rate-limiter';
import { normalizeDemographics } from './demographics-engine';
import { upsertMetricPoints, saveAudienceSnapshot, MetricPoint } from './metrics-store';

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || 'v27.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// Global shared circuit breaker for Graph API calls
export const globalGraphCircuitBreaker = new MetaCircuitBreaker();

export interface SyncResult {
  accountId: string;
  success: boolean;
  metricsCollected: string[];
  newFollowersCount?: number;
  newMediaCount?: number;
  newViews24h?: number;
  demographicsCollected?: boolean;
  error?: {
    category: string;
    code: number;
    message: string;
  };
  nextSyncAt: Date;
}

/**
 * Calculates next sync time with tier-based frequency and jitter
 */
export function calculateNextSyncDate(tier: 'HOT' | 'WARM' | 'COLD', failureCount = 0): Date {
  let baseSeconds: number;

  if (failureCount > 0) {
    // Exponential backoff for failures: 5m, 15m, 45m, up to 6h
    baseSeconds = Math.min(300 * Math.pow(3, failureCount - 1), 21600);
  } else {
    switch (tier) {
      case 'HOT':
        baseSeconds = 4 * 3600; // 4 hours
        break;
      case 'WARM':
        baseSeconds = 24 * 3600; // 24 hours
        break;
      case 'COLD':
      default:
        baseSeconds = 7 * 86400; // 7 days
        break;
    }
  }

  const jitteredSeconds = applyJitter(baseSeconds, -0.15, 0.15);
  return new Date(Date.now() + jitteredSeconds * 1000);
}

/**
 * Executes a full synchronization cycle for a connected Instagram account
 */
export async function syncInstagramAccount(
  accountId: string,
  options: { forceDemographics?: boolean } = {}
): Promise<SyncResult> {
  const account = await getSocialAccountById(accountId);
  if (!account) {
    throw new Error(`Account not found: ${accountId}`);
  }

  if (account.status !== 'ACTIVE') {
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'ACCOUNT_NOT_ACTIVE',
        code: 0,
        message: `Account is in ${account.status} status`,
      },
      nextSyncAt: new Date(Date.now() + 86400 * 1000),
    };
  }

  // 1. Check Circuit Breaker
  if (!globalGraphCircuitBreaker.canExecute()) {
    const nextSync = new Date(Date.now() + 300 * 1000);
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'CIRCUIT_BREAKER_OPEN',
        code: 0,
        message: 'Graph API circuit breaker is currently open due to upstream throttling or errors',
      },
      nextSyncAt: nextSync,
    };
  }

  // 2. Fetch and Decrypt Access Token
  const credential = await getSocialCredentialByAccountId(accountId);
  if (!credential) {
    await updateSocialAccountSyncState(accountId, { status: 'RECONNECT_REQUIRED' });
    await emitSocialOutboxEvent('SocialTokenInvalid', account.creator_id, {
      accountId,
      reason: 'MISSING_CREDENTIALS',
    });
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'TOKEN_INVALID',
        code: 190,
        message: 'No credentials found for account',
      },
      nextSyncAt: new Date(Date.now() + 86400 * 1000),
    };
  }

  let accessToken: string;
  try {
    accessToken = decryptToken(credential.token_ciphertext, credential.token_nonce, credential.key_id);
  } catch (err) {
    await updateSocialAccountSyncState(accountId, { status: 'RECONNECT_REQUIRED' });
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'DECRYPTION_FAILED',
        code: 0,
        message: err instanceof Error ? err.message : 'Failed to decrypt access token',
      },
      nextSyncAt: new Date(Date.now() + 86400 * 1000),
    };
  }

  const appSecret = process.env.META_APP_SECRET || '';
  const appsecretProof = appSecret ? createAppSecretProof(accessToken, appSecret) : '';
  const igAccountId = account.provider_user_id;

  const collectedMetrics: string[] = [];
  const metricPointsToStore: MetricPoint[] = [];
  const now = new Date();
  let newFollowers = account.followers_count;
  let newMediaCount = account.media_count;
  let views24h: number | undefined;
  let demographicsRan = false;

  try {
    // 3. Sync Basic Profile (Followers, Media Count)
    const profileUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}`);
    profileUrl.searchParams.set('fields', 'username,followers_count,media_count');
    profileUrl.searchParams.set('access_token', accessToken);
    if (appsecretProof) profileUrl.searchParams.set('appsecret_proof', appsecretProof);

    const profileRes = await fetch(profileUrl.toString());
    const rateLimits = evaluateRateLimitHeaders(profileRes.headers);

    if (rateLimits.shouldThrottle) {
      globalGraphCircuitBreaker.forceOpen(60000); // 1 min cool-down
    }

    const profileData = await profileRes.json();
    if (!profileRes.ok || profileData.error) {
      const classified = classifyMetaError(profileData.error);
      if (classified.category === 'TOKEN_INVALID') {
        await updateSocialAccountSyncState(accountId, {
          status: 'RECONNECT_REQUIRED',
          failure_count: account.failure_count + 1,
        });
        await emitSocialOutboxEvent('SocialTokenInvalid', account.creator_id, {
          accountId,
          code: classified.code,
          message: scrubSensitiveData(classified.message),
        });
      } else if (classified.category === 'RATE_LIMITED') {
        globalGraphCircuitBreaker.recordFailure(true);
      }

      const nextSync = calculateNextSyncDate(account.sync_tier, account.failure_count + 1);
      await updateSocialAccountSyncState(accountId, {
        failure_count: account.failure_count + 1,
        next_sync_at: nextSync,
      });

      return {
        accountId,
        success: false,
        metricsCollected: collectedMetrics,
        error: {
          category: classified.category,
          code: classified.code,
          message: scrubSensitiveData(classified.message),
        },
        nextSyncAt: nextSync,
      };
    }

    // Profile sync succeeded
    globalGraphCircuitBreaker.recordSuccess();
    newFollowers = Number(profileData.followers_count || 0);
    newMediaCount = Number(profileData.media_count || 0);

    collectedMetrics.push('followers_count', 'media_count');
    metricPointsToStore.push(
      {
        accountId,
        metric: 'followers_count',
        timestamp: now,
        value: newFollowers,
      },
      {
        accountId,
        metric: 'media_count',
        timestamp: now,
        value: newMediaCount,
      }
    );

    // 4. Sync Views Insights (Daily)
    try {
      const viewsUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
      viewsUrl.searchParams.set('metric', 'views');
      viewsUrl.searchParams.set('metric_type', 'total_value');
      viewsUrl.searchParams.set('period', 'day');
      viewsUrl.searchParams.set('access_token', accessToken);
      if (appsecretProof) viewsUrl.searchParams.set('appsecret_proof', appsecretProof);

      const viewsRes = await fetch(viewsUrl.toString());
      const viewsData = await viewsRes.json();

      if (viewsRes.ok && Array.isArray(viewsData.data) && viewsData.data.length > 0) {
        views24h = Number(viewsData.data[0]?.total_value?.value || 0);
        collectedMetrics.push('views');
        metricPointsToStore.push({
          accountId,
          metric: 'views',
          timestamp: now,
          value: views24h,
          dimensions: { period: 'day' },
        });
      }
    } catch (viewsErr) {
      console.warn(`[SyncWorker] Views insight sync failed for ${accountId}:`, viewsErr);
    }

    // 5. Demographics Sync (Weekly or Forced)
    const shouldRunDemographics =
      options.forceDemographics ||
      !account.last_synced_at ||
      Date.now() - new Date(account.last_synced_at).getTime() >= 7 * 86400 * 1000;

    if (shouldRunDemographics) {
      try {
        // Gender & Age
        const demoUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
        demoUrl.searchParams.set('metric', 'follower_demographics');
        demoUrl.searchParams.set('period', 'lifetime');
        demoUrl.searchParams.set('metric_type', 'total_value');
        demoUrl.searchParams.set('breakdown', 'gender,age');
        demoUrl.searchParams.set('access_token', accessToken);
        if (appsecretProof) demoUrl.searchParams.set('appsecret_proof', appsecretProof);

        const demoRes = await fetch(demoUrl.toString());
        const demoData = await demoRes.json();

        // Country
        const countryUrl = new URL(`${GRAPH_BASE_URL}/${igAccountId}/insights`);
        countryUrl.searchParams.set('metric', 'follower_demographics');
        countryUrl.searchParams.set('period', 'lifetime');
        countryUrl.searchParams.set('metric_type', 'total_value');
        countryUrl.searchParams.set('breakdown', 'country');
        countryUrl.searchParams.set('access_token', accessToken);
        if (appsecretProof) countryUrl.searchParams.set('appsecret_proof', appsecretProof);

        const countryRes = await fetch(countryUrl.toString());
        const countryData = await countryRes.json();

        if (demoRes.ok && demoData.data) {
          const derived = normalizeDemographics(demoData, countryRes.ok ? countryData : undefined);
          await saveAudienceSnapshot(accountId, derived);
          demographicsRan = true;
          collectedMetrics.push('demographics');

          await emitSocialOutboxEvent('AudienceSnapshotUpdated', account.creator_id, {
            accountId,
            share_18_plus: derived.share_18_plus,
            share_13_17: derived.share_13_17,
            share_18_34: derived.share_18_34,
            dominant_age_bucket: derived.dominant_age_bucket,
            gender_known_share: derived.gender_known_share,
            top_country: derived.top_country,
          });
        }
      } catch (demoErr) {
        console.warn(`[SyncWorker] Demographics sync failed for ${accountId}:`, demoErr);
      }
    }

    // 6. Persist Time Series Metric Points
    if (metricPointsToStore.length > 0) {
      await upsertMetricPoints(metricPointsToStore);
    }

    // 7. Calculate Next Sync Date with Jitter and Reset Failures
    const nextSyncAt = calculateNextSyncDate(account.sync_tier, 0);

    // 8. Update Social Account State
    await updateSocialAccountSyncState(accountId, {
      followers_count: newFollowers,
      media_count: newMediaCount,
      last_synced_at: now,
      next_sync_at: nextSyncAt,
      failure_count: 0,
    });

    // 9. Emit MetricsUpdated Outbox Event
    await emitSocialOutboxEvent('MetricsUpdated', account.creator_id, {
      accountId,
      followersCount: newFollowers,
      mediaCount: newMediaCount,
      views24h,
      collectedMetrics,
      syncedAt: now.toISOString(),
    });

    return {
      accountId,
      success: true,
      metricsCollected: collectedMetrics,
      newFollowersCount: newFollowers,
      newMediaCount,
      newViews24h: views24h,
      demographicsCollected: demographicsRan,
      nextSyncAt,
    };
  } catch (err) {
    const errorMsg = scrubSensitiveData(err instanceof Error ? err.message : 'Unknown sync error');
    const nextSync = calculateNextSyncDate(account.sync_tier, account.failure_count + 1);

    await updateSocialAccountSyncState(accountId, {
      failure_count: account.failure_count + 1,
      next_sync_at: nextSync,
    });

    await emitSocialOutboxEvent('SyncFailed', account.creator_id, {
      accountId,
      error: errorMsg,
      failureCount: account.failure_count + 1,
    });

    return {
      accountId,
      success: false,
      metricsCollected: collectedMetrics,
      error: {
        category: 'UNEXPECTED_EXCEPTION',
        code: 0,
        message: errorMsg,
      },
      nextSyncAt: nextSync,
    };
  }
}
