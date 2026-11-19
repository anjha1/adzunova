/**
 * Rate Limiting, Header Parsing, and Circuit Breaker for Meta Graph API
 */

export interface MetaAppUsage {
  call_count: number;
  total_cputime: number;
  total_time: number;
  max_percentage: number;
}

export interface MetaBusinessUsage {
  call_count: number;
  total_cputime: number;
  total_time: number;
  estimated_time_to_regain_access?: number;
  type?: string;
  max_percentage: number;
}

export interface ParsedRateLimitHeaders {
  appUsage: MetaAppUsage | null;
  businessUsage: MetaBusinessUsage[] | null;
  maxUtilizationPct: number;
  shouldThrottle: boolean;
  timeToRegainMinutes?: number;
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerStatus {
  state: CircuitBreakerState;
  lastFailureAt: number | null;
  backoffMs: number;
  failureCount: number;
  nextAttemptAllowedAt: number;
}

export type MetaErrorCodeCategory =
  | 'TOKEN_INVALID'
  | 'RATE_LIMITED'
  | 'PERMISSION_DENIED'
  | 'TRANSIENT_ERROR'
  | 'UNKNOWN_ERROR';

export interface ClassifiedMetaError {
  category: MetaErrorCodeCategory;
  code: number;
  subcode?: number;
  message: string;
  isRetryable: boolean;
  recommendedBackoffSeconds: number;
}

/**
 * Parses x-app-usage header
 * Header example: '{"call_count": 28, "total_cputime": 15, "total_time": 20}'
 */
export function parseAppUsageHeader(headerValue: string | null | undefined): MetaAppUsage | null {
  if (!headerValue) return null;
  try {
    const parsed = JSON.parse(headerValue);
    const call_count = Number(parsed.call_count || 0);
    const total_cputime = Number(parsed.total_cputime || 0);
    const total_time = Number(parsed.total_time || 0);
    const max_percentage = Math.max(call_count, total_cputime, total_time);
    return { call_count, total_cputime, total_time, max_percentage };
  } catch {
    return null;
  }
}

/**
 * Parses x-business-use-case-usage header
 * Header example: '{"123456789":[{"type":"instagram","call_count":40,"total_cputime":35,"total_time":42,"estimated_time_to_regain_access":0}]}'
 */
export function parseBusinessUsageHeader(headerValue: string | null | undefined): MetaBusinessUsage[] | null {
  if (!headerValue) return null;
  try {
    const parsed = JSON.parse(headerValue);
    const results: MetaBusinessUsage[] = [];

    for (const key of Object.keys(parsed)) {
      const items = Array.isArray(parsed[key]) ? parsed[key] : [parsed[key]];
      for (const item of items) {
        if (!item) continue;
        const call_count = Number(item.call_count || 0);
        const total_cputime = Number(item.total_cputime || 0);
        const total_time = Number(item.total_time || 0);
        const max_percentage = Math.max(call_count, total_cputime, total_time);
        results.push({
          call_count,
          total_cputime,
          total_time,
          estimated_time_to_regain_access: item.estimated_time_to_regain_access,
          type: item.type,
          max_percentage,
        });
      }
    }

    return results.length > 0 ? results : null;
  } catch {
    return null;
  }
}

/**
 * Extracts and consolidates Meta rate-limit headers from a Headers object
 */
export function evaluateRateLimitHeaders(headers: Headers | Record<string, string>): ParsedRateLimitHeaders {
  const getHeader = (name: string): string | null => {
    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name);
    }
    const record = headers as Record<string, string>;
    return record[name] || record[name.toLowerCase()] || null;
  };

  const appUsage = parseAppUsageHeader(getHeader('x-app-usage'));
  const businessUsage = parseBusinessUsageHeader(getHeader('x-business-use-case-usage'));

  let maxUtilizationPct = 0;
  let timeToRegainMinutes: number | undefined;

  if (appUsage) {
    maxUtilizationPct = Math.max(maxUtilizationPct, appUsage.max_percentage);
  }

  if (businessUsage) {
    for (const bu of businessUsage) {
      maxUtilizationPct = Math.max(maxUtilizationPct, bu.max_percentage);
      if (bu.estimated_time_to_regain_access && bu.estimated_time_to_regain_access > 0) {
        timeToRegainMinutes = Math.max(timeToRegainMinutes || 0, bu.estimated_time_to_regain_access);
      }
    }
  }

  // Throttle aggressively when utilization reaches or exceeds 90%
  const shouldThrottle = maxUtilizationPct >= 90;

  return {
    appUsage,
    businessUsage,
    maxUtilizationPct,
    shouldThrottle,
    timeToRegainMinutes,
  };
}

/**
 * Classifies Meta Graph API error responses
 */
export function classifyMetaError(error: any): ClassifiedMetaError {
  const code = Number(error?.code || error?.error?.code || 0);
  const subcode = error?.error_subcode || error?.error?.error_subcode;
  const message = String(error?.message || error?.error?.message || 'Unknown Graph API error');

  // Token errors: Error 190 (Invalid OAuth 2.0 Access Token, expired, or revoked)
  if (code === 190 || subcode === 463 || subcode === 467 || subcode === 460) {
    return {
      category: 'TOKEN_INVALID',
      code,
      subcode,
      message,
      isRetryable: false,
      recommendedBackoffSeconds: 0,
    };
  }

  // Throttling / Rate limits: 4 (Too many calls), 17 (User request limit reached), 32 (Page request limit reached), 613 (Calls to this api have exceeded the rate limit)
  if (code === 4 || code === 17 || code === 32 || code === 613) {
    return {
      category: 'RATE_LIMITED',
      code,
      subcode,
      message,
      isRetryable: true,
      recommendedBackoffSeconds: 300, // 5 minutes backoff
    };
  }

  // Permission issues: 10 (Permission Denied), 200..299
  if (code === 10 || (code >= 200 && code < 300)) {
    return {
      category: 'PERMISSION_DENIED',
      code,
      subcode,
      message,
      isRetryable: false,
      recommendedBackoffSeconds: 0,
    };
  }

  // Transient infrastructure errors: 1, 2, 500..599
  if (code === 1 || code === 2 || (code >= 500 && code <= 599)) {
    return {
      category: 'TRANSIENT_ERROR',
      code,
      subcode,
      message,
      isRetryable: true,
      recommendedBackoffSeconds: 60,
    };
  }

  return {
    category: 'UNKNOWN_ERROR',
    code,
    subcode,
    message,
    isRetryable: false,
    recommendedBackoffSeconds: 0,
  };
}

/**
 * Circuit Breaker implementation per Meta Graph API endpoint
 */
export class MetaCircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private lastFailureAt: number | null = null;
  private backoffMs = 5000; // Base backoff 5s
  private readonly maxBackoffMs = 300000; // Max 5m
  private readonly failureThreshold = 3;

  getStatus(): CircuitBreakerStatus {
    const now = Date.now();
    let effectiveState = this.state;
    let nextAllowed = 0;

    if (this.state === 'OPEN') {
      if (this.lastFailureAt && now - this.lastFailureAt >= this.backoffMs) {
        effectiveState = 'HALF_OPEN';
      } else {
        nextAllowed = (this.lastFailureAt || now) + this.backoffMs;
      }
    }

    return {
      state: effectiveState,
      lastFailureAt: this.lastFailureAt,
      backoffMs: this.backoffMs,
      failureCount: this.failureCount,
      nextAttemptAllowedAt: nextAllowed,
    };
  }

  canExecute(): boolean {
    const status = this.getStatus();
    return status.state === 'CLOSED' || status.state === 'HALF_OPEN';
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.backoffMs = 5000;
    this.lastFailureAt = null;
  }

  recordFailure(isThrottling = false): void {
    this.failureCount++;
    this.lastFailureAt = Date.now();

    if (isThrottling || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      // Exponential backoff
      this.backoffMs = Math.min(this.backoffMs * 2, this.maxBackoffMs);
    }
  }

  forceOpen(durationMs = 60000): void {
    this.state = 'OPEN';
    this.lastFailureAt = Date.now();
    this.backoffMs = durationMs;
  }
}

/**
 * Applies random jitter between minPct and maxPct (e.g. -15% to +15%)
 * to avoid synchronized thundering herd spikes
 */
export function applyJitter(
  baseValue: number,
  minPct = -0.15,
  maxPct = 0.15
): number {
  if (baseValue <= 0) return 0;
  const factor = 1 + minPct + Math.random() * (maxPct - minPct);
  return Math.round(baseValue * factor);
}

/**
 * Creates an idempotent deduplication key for scheduled sync jobs
 */
export function getJobDeduplicationKey(
  accountId: string,
  metricGroup: string,
  windowIsoDate: string
): string {
  // Window formatted to hour (e.g., 2026-11-19T14)
  const hourWindow = windowIsoDate.substring(0, 13);
  return `sync:${accountId}:${metricGroup}:${hourWindow}`;
}
