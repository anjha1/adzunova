/**
 * YouTube API Quota Budgeter, Adaptive Error Classifier & Endpoint-Family Circuit Breakers.
 *
 * Official Data API v3 Quota Reference:
 * https://developers.google.com/youtube/v3/determine_quota_cost
 *  - channels.list:      1 unit
 *  - playlistItems.list: 1 unit
 *  - videos.list:        1 unit (supports up to 50 batched video IDs per call)
 *  - search.list:      100 units (prohibited in sync pipeline)
 * Default project quota: 10,000 units/day, resetting at midnight Pacific Time.
 */

import { MetaCircuitBreaker } from './rate-limiter';

export const YOUTUBE_DATA_API_COST = {
  'channels.list': 1,
  'playlistItems.list': 1,
  'videos.list': 1,
  'search.list': 100,
} as const;

export type YouTubeDataEndpoint = keyof typeof YOUTUBE_DATA_API_COST;
export type YouTubeEndpointFamily = 'data_api' | 'analytics_api';

export interface QuotaBurnStatus {
  dateKeyPT: string;
  usedUnits: number;
  dailyLimit: number;
  burnPct: number;
  alertLevel: 'NORMAL' | 'WARN_80' | 'EXHAUSTED_100';
  degradationMode: 'FULL' | 'SKIP_TOP_VIDEOS' | 'CORE_STATS_ONLY' | 'HALTED';
  nextResetAt: Date;
}

/**
 * Returns YYYY-MM-DD in America/Los_Angeles (Google YouTube Data API quota timezone).
 */
export function getPacificDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Computes the next midnight in America/Los_Angeles (quota reset timestamp).
 */
export function getNextQuotaResetPT(now = new Date()): Date {
  // Approximate PT midnight safely (UTC-7/UTC-8): find next PT date change at 08:00 UTC (PST)
  const ptDateStr = getPacificDateKey(now);
  const [y, m, d] = ptDateStr.split('-').map(Number);
  // 08:00 UTC next day covers standard PST midnight; +5m buffer for clock skew
  return new Date(Date.UTC(y, m - 1, d + 1, 8, 5, 0));
}

export class YouTubeQuotaBudgeter {
  private usedByDayPT = new Map<string, number>();
  private exhaustedDays = new Set<string>();

  constructor(
    private readonly dailyLimit = Number(process.env.YOUTUBE_DAILY_QUOTA_LIMIT || 10_000)
  ) {}

  getStatus(now = new Date()): QuotaBurnStatus {
    const dateKeyPT = getPacificDateKey(now);
    const usedUnits = this.usedByDayPT.get(dateKeyPT) || 0;
    const isExhausted = this.exhaustedDays.has(dateKeyPT) || usedUnits >= this.dailyLimit;
    const burnPct = Math.min(100, Math.round((usedUnits / Math.max(1, this.dailyLimit)) * 100));

    let alertLevel: QuotaBurnStatus['alertLevel'] = 'NORMAL';
    if (isExhausted || burnPct >= 100) alertLevel = 'EXHAUSTED_100';
    else if (burnPct >= 80) alertLevel = 'WARN_80';

    let degradationMode: QuotaBurnStatus['degradationMode'] = 'FULL';
    if (isExhausted || burnPct >= 100) degradationMode = 'HALTED';
    else if (burnPct >= 90) degradationMode = 'CORE_STATS_ONLY';
    else if (burnPct >= 80) degradationMode = 'SKIP_TOP_VIDEOS';

    return {
      dateKeyPT,
      usedUnits,
      dailyLimit: this.dailyLimit,
      burnPct,
      alertLevel,
      degradationMode,
      nextResetAt: getNextQuotaResetPT(now),
    };
  }

  canSpend(endpoint: YouTubeDataEndpoint, tier: 'HOT' | 'WARM' | 'COLD' = 'WARM', now = new Date()): boolean {
    if (endpoint === 'search.list') return false; // Never spend 100 units on search.list
    const status = this.getStatus(now);
    if (status.degradationMode === 'HALTED') return false;

    const cost = YOUTUBE_DATA_API_COST[endpoint];
    if (status.usedUnits + cost > status.dailyLimit) return false;

    // Graceful degradation order: skip top videos first (>=80%), then demographics/warm (>=90%)
    if (status.degradationMode === 'SKIP_TOP_VIDEOS' && (endpoint === 'playlistItems.list' || endpoint === 'videos.list')) {
      return false;
    }
    if (status.degradationMode === 'CORE_STATS_ONLY' && tier !== 'HOT' && endpoint !== 'channels.list') {
      return false;
    }

    return true;
  }

  recordSpend(endpoint: YouTubeDataEndpoint, now = new Date()): QuotaBurnStatus {
    const dateKeyPT = getPacificDateKey(now);
    const current = this.usedByDayPT.get(dateKeyPT) || 0;
    this.usedByDayPT.set(dateKeyPT, current + YOUTUBE_DATA_API_COST[endpoint]);
    const status = this.getStatus(now);
    if (status.alertLevel === 'WARN_80') {
      console.warn(`[YouTubeQuota] Alert: 80%+ daily quota consumed (${status.usedUnits}/${status.dailyLimit} units)`);
    } else if (status.alertLevel === 'EXHAUSTED_100') {
      console.error(`[YouTubeQuota] Alert: 100% daily quota reached (${status.usedUnits}/${status.dailyLimit} units)`);
    }
    return status;
  }

  markExhausted(now = new Date()): void {
    const dateKeyPT = getPacificDateKey(now);
    this.exhaustedDays.add(dateKeyPT);
  }
}

export const globalYouTubeQuotaBudgeter = new YouTubeQuotaBudgeter();

// Separate circuit breakers per Google endpoint family
export const youtubeDataCircuitBreaker = new MetaCircuitBreaker();
export const youtubeAnalyticsCircuitBreaker = new MetaCircuitBreaker();

export type GoogleErrorCategory =
  | 'QUOTA_EXCEEDED'
  | 'RATE_LIMITED'
  | 'TOKEN_INVALID'
  | 'NON_RETRYABLE'
  | 'TRANSIENT_5XX'
  | 'UNKNOWN';

export interface ClassifiedGoogleError {
  category: GoogleErrorCategory;
  httpStatus: number;
  reason: string;
  message: string;
  isRetryable: boolean;
  nextSyncAtOverride?: Date;
}

export function classifyGoogleApiError(
  httpStatus: number,
  errorBody?: { code?: number; message?: string; errors?: Array<{ reason?: string; message?: string }> } | string
): ClassifiedGoogleError {
  const reason =
    typeof errorBody === 'object' && errorBody?.errors?.[0]?.reason
      ? errorBody.errors[0].reason
      : typeof errorBody === 'string'
      ? errorBody
      : `http_${httpStatus}`;

  const message =
    typeof errorBody === 'object' && errorBody?.message
      ? errorBody.message
      : `Google API HTTP ${httpStatus} (${reason})`;

  if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
    return {
      category: 'QUOTA_EXCEEDED',
      httpStatus,
      reason,
      message,
      isRetryable: false,
      nextSyncAtOverride: getNextQuotaResetPT(),
    };
  }

  if (
    httpStatus === 429 ||
    reason === 'rateLimitExceeded' ||
    reason === 'userRateLimitExceeded'
  ) {
    return {
      category: 'RATE_LIMITED',
      httpStatus,
      reason,
      message,
      isRetryable: true,
    };
  }

  if (httpStatus === 401 || reason === 'invalid_grant' || reason === 'authError') {
    return {
      category: 'TOKEN_INVALID',
      httpStatus,
      reason,
      message,
      isRetryable: false,
    };
  }

  if (
    reason === 'accessNotConfigured' ||
    reason === 'insufficientPermissions' ||
    reason === 'forbidden' ||
    reason === 'channelNotFound' ||
    httpStatus === 400 ||
    httpStatus === 403 ||
    httpStatus === 404
  ) {
    return {
      category: 'NON_RETRYABLE',
      httpStatus,
      reason,
      message,
      isRetryable: false,
    };
  }

  if (httpStatus >= 500) {
    return {
      category: 'TRANSIENT_5XX',
      httpStatus,
      reason,
      message,
      isRetryable: true,
    };
  }

  return {
    category: 'UNKNOWN',
    httpStatus,
    reason,
    message,
    isRetryable: false,
  };
}
