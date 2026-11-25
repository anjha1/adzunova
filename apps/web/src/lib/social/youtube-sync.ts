import {
  getSocialAccountById,
  updateSocialAccountSyncState,
  emitSocialOutboxEvent,
  logSocialAuditAction,
} from './social-repository';
import { calculateNextSyncDate, SyncResult } from './sync-worker';
import { getValidYouTubeAccessToken, YouTubeTokenError } from './youtube-token-service';
import {
  globalYouTubeQuotaBudgeter,
  youtubeDataCircuitBreaker,
  youtubeAnalyticsCircuitBreaker,
  classifyGoogleApiError,
} from './youtube-quota';
import { upsertMetricPoints, saveAudienceSnapshot, MetricPoint } from './metrics-store';
import type {
  DerivedAudienceMetrics,
  StandardAgeBucket,
  AgeDistributionItem,
  GenderDistributionItem,
  CountryDistributionItem,
} from './demographics-engine';
import { scrubSensitiveData } from './security/log-scrubber';
import {
  getYouTubeFeatureFlags,
  recordYouTubeGoogleApiError,
  recordYouTubeSyncOutcome,
} from './youtube-observability';
import type { SocialProviderPort, SocialProviderSyncOptions } from './provider-port';

const YOUTUBE_DATA_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_ANALYTICS_API_BASE = 'https://youtubeanalytics.googleapis.com/v2';

// Per-account in-process lease lock (prevents concurrent syncs of the same account)
const activeAccountLeases = new Map<string, number>();
const LEASE_TTL_MS = 5 * 60 * 1000;

export function acquireAccountLease(accountId: string): boolean {
  const now = Date.now();
  const existingExpiry = activeAccountLeases.get(accountId);
  if (existingExpiry && existingExpiry > now) {
    return false;
  }
  activeAccountLeases.set(accountId, now + LEASE_TTL_MS);
  return true;
}

export function releaseAccountLease(accountId: string): void {
  activeAccountLeases.delete(accountId);
}

function formatDateYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface YouTubeTopVideo {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  views: number;
  likes: number;
  comments: number;
  duration: string | null;
}

export async function syncYouTubeAccount(
  accountId: string,
  options: SocialProviderSyncOptions = {}
): Promise<SyncResult> {
  if (!getYouTubeFeatureFlags().youtubeSyncEnabled) {
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'SYNC_DISABLED',
        code: 503,
        message: 'YouTube background sync is temporarily disabled via feature flag.',
      },
      nextSyncAt: new Date(Date.now() + 3600 * 1000),
    };
  }

  const account = await getSocialAccountById(accountId);
  if (!account) {
    throw new Error(`YouTube account not found: ${accountId}`);
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

  if (!acquireAccountLease(accountId)) {
    return {
      accountId,
      success: false,
      metricsCollected: [],
      error: {
        category: 'LEASE_CONTENDED',
        code: 0,
        message: 'Another sync worker currently holds the lease for this account',
      },
      nextSyncAt: new Date(Date.now() + 300 * 1000),
    };
  }

  const metricsCollected: string[] = [];
  const capabilities: Record<string, any> = { ...(account.capabilities || {}) };
  let newFollowersCount: number | undefined;
  let newMediaCount: number | undefined;
  let demographicsCollected = false;

  try {
    // 1. Obtain valid short-lived access token (refreshes from encrypted refresh token)
    let accessToken: string;
    try {
      accessToken = await getValidYouTubeAccessToken(accountId, account.creator_id);
    } catch (tokErr) {
      if (tokErr instanceof YouTubeTokenError && tokErr.code === 'RECONNECT_REQUIRED') {
        return {
          accountId,
          success: false,
          metricsCollected: [],
          error: {
            category: 'TOKEN_INVALID',
            code: 401,
            message: tokErr.message,
          },
          nextSyncAt: new Date(Date.now() + 7 * 86400 * 1000),
        };
      }
      throw tokErr;
    }

    // 2. Check Data API circuit breaker & daily quota budget
    if (!youtubeDataCircuitBreaker.canExecute()) {
      return {
        accountId,
        success: false,
        metricsCollected: [],
        error: {
          category: 'CIRCUIT_BREAKER_OPEN',
          code: 503,
          message: 'YouTube Data API circuit breaker open due to upstream errors',
        },
        nextSyncAt: new Date(Date.now() + 300 * 1000),
      };
    }

    if (!globalYouTubeQuotaBudgeter.canSpend('channels.list', account.sync_tier)) {
      const qStatus = globalYouTubeQuotaBudgeter.getStatus();
      return {
        accountId,
        success: false,
        metricsCollected: [],
        error: {
          category: 'QUOTA_EXCEEDED',
          code: 403,
          message: 'Daily YouTube Data API quota budget reached; pausing until PT midnight reset.',
        },
        nextSyncAt: qStatus.nextResetAt,
      };
    }

    // 3. Channel Statistics (with partial response fields= to minimize payload)
    const chUrl =
      `${YOUTUBE_DATA_API_BASE}/channels` +
      `?part=id,snippet,statistics,contentDetails&mine=true` +
      `&fields=items(id,snippet(title,customUrl,thumbnails(default,medium,high)),statistics(subscriberCount,hiddenSubscriberCount,viewCount,videoCount),contentDetails(relatedPlaylists/uploads))`;

    globalYouTubeQuotaBudgeter.recordSpend('channels.list');
    const chRes = await fetch(chUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const chData = await chRes.json();

    if (!chRes.ok || chData?.error) {
      const classified = classifyGoogleApiError(chRes.status, chData?.error);
      recordYouTubeGoogleApiError(classified.reason, accountId);
      recordYouTubeSyncOutcome(account.sync_tier, false);
      if (classified.category === 'QUOTA_EXCEEDED') {
        globalYouTubeQuotaBudgeter.markExhausted();
      } else if (classified.category === 'RATE_LIMITED' || classified.category === 'TRANSIENT_5XX') {
        youtubeDataCircuitBreaker.recordFailure();
      }

      const nextFailureCount = account.failure_count + 1;
      const nextSync = classified.nextSyncAtOverride || calculateNextSyncDate(account.sync_tier, nextFailureCount);
      await updateSocialAccountSyncState(accountId, {
        failure_count: nextFailureCount,
        next_sync_at: nextSync,
      });
      await emitSocialOutboxEvent('SyncFailed', account.creator_id, {
        accountId,
        provider: 'youtube',
        category: classified.category,
        reason: classified.reason,
      });

      return {
        accountId,
        success: false,
        metricsCollected: [],
        error: {
          category: classified.category,
          code: chRes.status,
          message: scrubSensitiveData(classified.message),
        },
        nextSyncAt: nextSync,
      };
    }

    youtubeDataCircuitBreaker.recordSuccess();
    const ch = Array.isArray(chData?.items) ? chData.items[0] : null;
    if (!ch) {
      throw new Error('No YouTube channel returned for authenticated account');
    }

    const hiddenSubs = Boolean(ch.statistics?.hiddenSubscriberCount);
    const subscriberCount = hiddenSubs ? null : Number(ch.statistics?.subscriberCount || 0);
    const totalViews = Number(ch.statistics?.viewCount || 0);
    const videoCount = Number(ch.statistics?.videoCount || 0);
    const uploadsPlaylistId = ch.contentDetails?.relatedPlaylists?.uploads || null;

    newFollowersCount = subscriberCount ?? 0;
    newMediaCount = videoCount;
    metricsCollected.push('channel_stats');

    const now = new Date();
    const todayStr = formatDateYmd(now);
    const corePoints: MetricPoint[] = [
      {
        accountId,
        metric: 'total_views',
        timestamp: now,
        value: totalViews,
        dimensions: { period: 'lifetime', metricDate: todayStr },
      },
      {
        accountId,
        metric: 'video_count',
        timestamp: now,
        value: videoCount,
        dimensions: { period: 'lifetime', metricDate: todayStr },
      },
    ];
    if (subscriberCount !== null) {
      corePoints.push({
        accountId,
        metric: 'subscribers',
        timestamp: now,
        value: subscriberCount,
        dimensions: { period: 'lifetime', metricDate: todayStr },
      });
    }
    await upsertMetricPoints(corePoints);

    capabilities.hiddenSubscriberCount = hiddenSubs;
    capabilities.totalChannelViews = totalViews;
    capabilities.uploadsPlaylistId = uploadsPlaylistId;

    // 4. Analytics API: Daily series + Viewer Demographics (ageGroup, gender) + Country Views
    let dataThroughDate: string | null = null;
    const quotaStatus = globalYouTubeQuotaBudgeter.getStatus();

    if (
      youtubeAnalyticsCircuitBreaker.canExecute() &&
      quotaStatus.degradationMode !== 'HALTED' &&
      quotaStatus.degradationMode !== 'CORE_STATS_ONLY'
    ) {
      const lookbackDays = options.isInitialBackfill ? 90 : 30;
      const startDate = formatDateYmd(new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000));
      const endDate = todayStr;

      // 4a. Daily series
      try {
        const seriesUrl = new URL(`${YOUTUBE_ANALYTICS_API_BASE}/reports`);
        seriesUrl.searchParams.set('ids', 'channel==MINE');
        seriesUrl.searchParams.set('startDate', startDate);
        seriesUrl.searchParams.set('endDate', endDate);
        seriesUrl.searchParams.set('metrics', 'views,estimatedMinutesWatched,subscribersGained,subscribersLost');
        seriesUrl.searchParams.set('dimensions', 'day');
        seriesUrl.searchParams.set('sort', 'day');

        const sRes = await fetch(seriesUrl.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const sData = await sRes.json();

        if (sRes.ok && Array.isArray(sData?.rows)) {
          youtubeAnalyticsCircuitBreaker.recordSuccess();
          const seriesPoints: MetricPoint[] = [];
          for (const row of sData.rows) {
            const [dayStr, views, watchMins, gained, lost] = row;
            if (!dayStr) continue;
            dataThroughDate = dayStr;
            const dayDate = new Date(`${dayStr}T00:00:00Z`);
            seriesPoints.push(
              { accountId, metric: 'daily_views', timestamp: dayDate, value: Number(views || 0), dimensions: { period: 'day', basis: 'VIEWERS' } },
              { accountId, metric: 'watch_minutes', timestamp: dayDate, value: Number(watchMins || 0), dimensions: { period: 'day', basis: 'VIEWERS' } },
              { accountId, metric: 'subscribers_gained', timestamp: dayDate, value: Number(gained || 0), dimensions: { period: 'day' } },
              { accountId, metric: 'subscribers_lost', timestamp: dayDate, value: Number(lost || 0), dimensions: { period: 'day' } }
            );
          }
          if (seriesPoints.length > 0) {
            await upsertMetricPoints(seriesPoints);
            metricsCollected.push('analytics_daily_series');
          }
          capabilities.analyticsDailySeries = { available: true, rowCount: sData.rows.length };
        } else {
          const reason = sData?.error?.errors?.[0]?.reason || `http_${sRes.status}`;
          capabilities.analyticsDailySeries = { available: false, reason };
        }
      } catch (err) {
        youtubeAnalyticsCircuitBreaker.recordFailure();
        capabilities.analyticsDailySeries = {
          available: false,
          reason: err instanceof Error ? scrubSensitiveData(err.message) : 'analytics_fetch_failed',
        };
      }

      // 4b. Viewer Demographics (ageGroup x gender) + Country Views
      try {
        const demoUrl = new URL(`${YOUTUBE_ANALYTICS_API_BASE}/reports`);
        demoUrl.searchParams.set('ids', 'channel==MINE');
        demoUrl.searchParams.set('startDate', startDate);
        demoUrl.searchParams.set('endDate', endDate);
        demoUrl.searchParams.set('metrics', 'viewerPercentage');
        demoUrl.searchParams.set('dimensions', 'ageGroup,gender');

        const countryUrl = new URL(`${YOUTUBE_ANALYTICS_API_BASE}/reports`);
        countryUrl.searchParams.set('ids', 'channel==MINE');
        countryUrl.searchParams.set('startDate', startDate);
        countryUrl.searchParams.set('endDate', endDate);
        countryUrl.searchParams.set('metrics', 'views');
        countryUrl.searchParams.set('dimensions', 'country');
        countryUrl.searchParams.set('sort', '-views');
        countryUrl.searchParams.set('maxResults', '25');

        const [dRes, cRes] = await Promise.all([
          fetch(demoUrl.toString(), { headers: { Authorization: `Bearer ${accessToken}` } }),
          fetch(countryUrl.toString(), { headers: { Authorization: `Bearer ${accessToken}` } }),
        ]);
        const [dData, cData] = await Promise.all([dRes.json(), cRes.json()]);

        const ageGenderRows = Array.isArray(dData?.rows) ? dData.rows : [];
        const countryRows = Array.isArray(cData?.rows) ? cData.rows : [];

        if (dRes.ok && ageGenderRows.length > 0) {
          const mapAgeBucket = (raw: string): StandardAgeBucket | null => {
            const norm = raw.replace(/^age/i, '').replace(/-$/, '+');
            if (norm === '65+') return '65+';
            if (['13-17', '18-24', '25-34', '35-44', '45-54', '55-64'].includes(norm)) {
              return norm as StandardAgeBucket;
            }
            return null;
          };

          const agePct = new Map<StandardAgeBucket, number>();
          const genderPct = new Map<'F' | 'M' | 'U', number>();

          for (const [rawAge, rawGender, pct] of ageGenderRows) {
            const val = Number(pct || 0);
            const bucket = rawAge ? mapAgeBucket(String(rawAge)) : null;
            if (bucket) {
              agePct.set(bucket, (agePct.get(bucket) || 0) + val);
            }
            const gKey: 'F' | 'M' | 'U' =
              rawGender === 'female' ? 'F' : rawGender === 'male' ? 'M' : 'U';
            genderPct.set(gKey, (genderPct.get(gKey) || 0) + val);
          }

          const ageDistribution: AgeDistributionItem[] = Array.from(agePct.entries()).map(([bucket, pct]) => ({
            bucket,
            count: Math.round(pct),
            percentage: Number((pct / 100).toFixed(4)),
          }));

          const genderDistribution: GenderDistributionItem[] = Array.from(genderPct.entries()).map(([gender, pct]) => ({
            gender,
            label: gender === 'F' ? 'Female' : gender === 'M' ? 'Male' : 'Unknown / Not Reported',
            count: Math.round(pct),
            percentage: Number((pct / 100).toFixed(4)),
          }));

          const totalCountryViews = countryRows.reduce((sum: number, r: any[]) => sum + Number(r[1] || 0), 0);
          const countryDistribution: CountryDistributionItem[] = countryRows
            .filter((r: any[]) => Boolean(r[0]) && totalCountryViews > 0)
            .map(([code, views]: [string, number]) => ({
              countryCode: String(code),
              count: Number(views || 0),
              percentage: Number((Number(views || 0) / totalCountryViews).toFixed(4)),
            }));

          const share13_17 = Number(((agePct.get('13-17') || 0) / 100).toFixed(4));
          const share18_34 = Number((((agePct.get('18-24') || 0) + (agePct.get('25-34') || 0)) / 100).toFixed(4));
          const share18_plus = Number((1 - share13_17).toFixed(4));
          const knownGenderPct = (genderPct.get('F') || 0) + (genderPct.get('M') || 0);
          const dominantAge = ageDistribution.slice().sort((a, b) => b.percentage - a.percentage)[0]?.bucket || null;

          const derivedSnapshot: DerivedAudienceMetrics = {
            totalAudienceSampled: totalCountryViews || 100,
            share_18_plus: share18_plus,
            share_13_17: share13_17,
            share_18_34: share18_34,
            dominant_age_bucket: dominantAge,
            gender_known_share: Number((knownGenderPct / 100).toFixed(4)),
            top_country: countryDistribution[0]?.countryCode || null,
            ageDistribution,
            genderDistribution,
            countryDistribution,
            hasCountryBreakdown: countryDistribution.length > 0,
            computedAt: now.toISOString(),
          };

          await saveAudienceSnapshot(accountId, derivedSnapshot);
          demographicsCollected = true;
          metricsCollected.push('viewer_demographics');
          capabilities.viewerDemographics = { available: true, basis: 'VIEWERS' };
          await emitSocialOutboxEvent('AudienceSnapshotUpdated', account.creator_id, {
            accountId,
            provider: 'youtube',
            basis: 'VIEWERS',
            snapshotDate: dataThroughDate || todayStr,
          });
        } else {
          const reason = dData?.error?.errors?.[0]?.reason || (dRes.ok ? 'insufficientData' : `http_${dRes.status}`);
          capabilities.viewerDemographics = { available: false, reason, basis: 'VIEWERS' };
        }
      } catch (err) {
        capabilities.viewerDemographics = {
          available: false,
          reason: err instanceof Error ? scrubSensitiveData(err.message) : 'demographics_fetch_failed',
          basis: 'VIEWERS',
        };
      }
    }

    // 5. Top Videos via uploads playlist + batched videos.list (skipped if quota >= 80%)
    let topVideos: YouTubeTopVideo[] = [];
    if (
      uploadsPlaylistId &&
      globalYouTubeQuotaBudgeter.canSpend('playlistItems.list', account.sync_tier) &&
      globalYouTubeQuotaBudgeter.canSpend('videos.list', account.sync_tier)
    ) {
      globalYouTubeQuotaBudgeter.recordSpend('playlistItems.list');
      const plUrl =
        `${YOUTUBE_DATA_API_BASE}/playlistItems?part=contentDetails&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=10` +
        `&fields=items(contentDetails(videoId))`;
      const plRes = await fetch(plUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
      const plData = await plRes.json();
      const videoIds = (Array.isArray(plData?.items) ? plData.items : [])
        .map((it: any) => it?.contentDetails?.videoId)
        .filter((id: unknown): id is string => typeof id === 'string');

      if (videoIds.length > 0) {
        globalYouTubeQuotaBudgeter.recordSpend('videos.list');
        const vidUrl =
          `${YOUTUBE_DATA_API_BASE}/videos?part=id,snippet,statistics,contentDetails&id=${encodeURIComponent(videoIds.join(','))}` +
          `&fields=items(id,snippet(title,publishedAt,thumbnails(medium,high)),statistics(viewCount,likeCount,commentCount),contentDetails(duration))`;
        const vidRes = await fetch(vidUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
        const vidData = await vidRes.json();
        const vidItems = Array.isArray(vidData?.items) ? vidData.items : [];
        topVideos = vidItems.map((v: any) => ({
          videoId: v.id,
          title: v.snippet?.title || '',
          publishedAt: v.snippet?.publishedAt || '',
          thumbnailUrl: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url || null,
          views: Number(v.statistics?.viewCount || 0),
          likes: Number(v.statistics?.likeCount || 0),
          comments: Number(v.statistics?.commentCount || 0),
          duration: v.contentDetails?.duration || null,
        }));
        metricsCollected.push('top_videos');
      }
    }

    capabilities.dataThroughDate = dataThroughDate;
    capabilities.topVideosCount = topVideos.length;

    const nextSyncAt = calculateNextSyncDate(account.sync_tier, 0);
    await updateSocialAccountSyncState(accountId, {
      followers_count: newFollowersCount,
      media_count: newMediaCount,
      last_synced_at: now,
      next_sync_at: nextSyncAt,
      failure_count: 0,
      capabilities,
    });

    await emitSocialOutboxEvent('MetricsUpdated', account.creator_id, {
      accountId,
      provider: 'youtube',
      metricsCollected,
      subscribers: subscriberCount,
      hiddenSubscriberCount: hiddenSubs,
      totalViews,
      videoCount,
      dataThroughDate,
    });

    await logSocialAuditAction(account.creator_id, 'CAPABILITY_CHANGED', 'youtube', {
      accountId,
      capabilitiesSummary: Object.keys(capabilities),
      dataThroughDate,
    });

    recordYouTubeSyncOutcome(account.sync_tier, true);

    return {
      accountId,
      success: true,
      metricsCollected,
      newFollowersCount,
      newMediaCount,
      demographicsCollected,
      nextSyncAt,
    };
  } finally {
    releaseAccountLease(accountId);
  }
}

export const YouTubeProviderAdapter: SocialProviderPort = {
  provider: 'youtube',
  syncAccount: syncYouTubeAccount,
};
