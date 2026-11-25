import { globalYouTubeQuotaBudgeter } from './youtube-quota';

export interface YouTubeFeatureFlags {
  youtubeConnectEnabled: boolean;
  youtubeSyncEnabled: boolean;
  debugOAuthEnabled: boolean;
}

export function getYouTubeFeatureFlags(): YouTubeFeatureFlags {
  return {
    youtubeConnectEnabled: process.env.FEATURE_YOUTUBE_CONNECT !== 'false',
    youtubeSyncEnabled: process.env.FEATURE_YOUTUBE_SYNC !== 'false',
    debugOAuthEnabled: process.env.DEBUG_OAUTH === 'true',
  };
}

interface ObservabilityCounters {
  connectAttempts: number;
  connectSuccess: number;
  connectFailuresByCode: Record<string, number>;
  tokenInvalidCount: number;
  googleApiErrorsByReason: Record<string, number>;
  syncSuccessByTier: Record<string, number>;
  syncFailureByTier: Record<string, number>;
  dlqCount: number;
}

const counters: ObservabilityCounters = {
  connectAttempts: 0,
  connectSuccess: 0,
  connectFailuresByCode: {},
  tokenInvalidCount: 0,
  googleApiErrorsByReason: {},
  syncSuccessByTier: { HOT: 0, WARM: 0, COLD: 0 },
  syncFailureByTier: { HOT: 0, WARM: 0, COLD: 0 },
  dlqCount: 0,
};

export function recordYouTubeConnectAttempt(correlationId: string): void {
  counters.connectAttempts += 1;
  if (process.env.DEBUG_OAUTH === 'true') {
    console.log(`[YouTubeMetrics] connect_attempt correlationId=${correlationId}`);
  }
}

export function recordYouTubeConnectResult(
  outcome: 'success' | 'failure',
  correlationId: string,
  errorCode?: string
): void {
  if (outcome === 'success') {
    counters.connectSuccess += 1;
  } else {
    const key = errorCode || 'unknown';
    counters.connectFailuresByCode[key] = (counters.connectFailuresByCode[key] || 0) + 1;
  }
  if (process.env.DEBUG_OAUTH === 'true') {
    console.log(
      `[YouTubeMetrics] connect_result outcome=${outcome} errorCode=${errorCode || 'none'} correlationId=${correlationId}`
    );
  }
}

export function recordYouTubeGoogleApiError(reason: string, correlationId?: string): void {
  const key = reason || 'unknown';
  counters.googleApiErrorsByReason[key] = (counters.googleApiErrorsByReason[key] || 0) + 1;
  if (key === 'invalid_grant') {
    counters.tokenInvalidCount += 1;
    if (counters.tokenInvalidCount >= 5) {
      console.error(
        `[YouTubeAlert] invalid_grant spike detected count=${counters.tokenInvalidCount} correlationId=${correlationId || 'none'}`
      );
    }
  }
}

export function recordYouTubeSyncOutcome(tier: 'HOT' | 'WARM' | 'COLD', success: boolean): void {
  if (success) {
    counters.syncSuccessByTier[tier] = (counters.syncSuccessByTier[tier] || 0) + 1;
  } else {
    counters.syncFailureByTier[tier] = (counters.syncFailureByTier[tier] || 0) + 1;
    counters.dlqCount += 1;
  }
}

export function getYouTubeObservabilitySnapshot() {
  const quota = globalYouTubeQuotaBudgeter.getStatus();
  const alerts: string[] = [];
  if (quota.burnPct >= 80) alerts.push(`QUOTA_BURN_${quota.burnPct}_PCT`);
  if (counters.tokenInvalidCount >= 5) alerts.push('INVALID_GRANT_SPIKE');
  if (counters.dlqCount >= 10) alerts.push('SYNC_DLQ_ELEVATED');

  return {
    flags: getYouTubeFeatureFlags(),
    counters: { ...counters },
    quota,
    alerts,
  };
}
