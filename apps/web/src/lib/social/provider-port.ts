import type { SyncResult } from './sync-worker';

export type SocialProviderId = 'instagram' | 'youtube';

export interface SocialProviderSyncOptions {
  forceDemographics?: boolean;
  isInitialBackfill?: boolean;
}

/**
 * Unified port implemented by every social platform adapter (Instagram, YouTube).
 * Shared scheduler, locking, outbox, and sync routes invoke this port without
 * branching on provider-specific internals.
 */
export interface SocialProviderPort {
  readonly provider: SocialProviderId;
  syncAccount(accountId: string, options?: SocialProviderSyncOptions): Promise<SyncResult>;
}
