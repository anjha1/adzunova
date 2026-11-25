/**
 * Sharded Sync Scheduler for Instagram Pipeline
 * Dispatches jobs with shard partitioning, tier evaluation, deduplication, and concurrency limits.
 */

import { getDueAccountsForSync, updateSocialAccountSyncState, SocialAccount } from './social-repository';
import { syncInstagramAccount, SyncResult } from './sync-worker';
import { YouTubeProviderAdapter } from './youtube-sync';
import { getJobDeduplicationKey } from './rate-limiter';

export interface SchedulerOptions {
  batchSize?: number;
  maxConcurrency?: number;
  shardIndex?: number;
  totalShards?: number;
}

export interface SchedulerRunSummary {
  accountsEvaluated: number;
  jobsDispatched: number;
  jobsDeduplicated: number;
  successCount: number;
  failureCount: number;
  results: SyncResult[];
  durationMs: number;
}

// In-memory deduplication set for active/recent sync windows
const activeJobDeduplicationSet = new Set<string>();

/**
 * Computes deterministic shard assignment: hash(accountId) % totalShards
 */
export function getAccountShard(accountId: string, totalShards: number): number {
  if (totalShards <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < accountId.length; i++) {
    hash = (hash * 31 + accountId.charCodeAt(i)) >>> 0;
  }
  return hash % totalShards;
}

/**
 * Automatically calculates sync tier based on creator activity and campaign presence
 */
export function determineSyncTier(
  account: SocialAccount,
  hasActiveCampaigns = false,
  hoursSinceLastLogin = 72
): 'HOT' | 'WARM' | 'COLD' {
  // HOT: Active campaign currently running, or creator logged in within 48h
  if (hasActiveCampaigns || hoursSinceLastLogin <= 48) {
    return 'HOT';
  }

  // COLD: Inactive creator (>30 days since last login) or multiple consecutive failures
  if (hoursSinceLastLogin > 30 * 24 || account.failure_count >= 5) {
    return 'COLD';
  }

  // WARM: Standard active creator
  return 'WARM';
}

/**
 * Runs a single scheduler iteration
 */
export async function runSchedulerIteration(
  options: SchedulerOptions = {}
): Promise<SchedulerRunSummary> {
  const startTime = Date.now();
  const batchSize = options.batchSize || 20;
  const maxConcurrency = options.maxConcurrency || 5;
  const shardIndex = options.shardIndex ?? 0;
  const totalShards = options.totalShards ?? 1;

  // 1. Fetch due accounts
  const dueAccounts = await getDueAccountsForSync(batchSize * 2);
  const results: SyncResult[] = [];

  let jobsDeduplicated = 0;
  let jobsDispatched = 0;
  let successCount = 0;
  let failureCount = 0;

  // 2. Filter by shard
  const shardAccounts = dueAccounts.filter(
    (acc) => getAccountShard(acc.id, totalShards) === shardIndex
  );

  // 3. Process with concurrency pool
  const accountsToProcess: SocialAccount[] = [];

  for (const acc of shardAccounts) {
    if (accountsToProcess.length >= batchSize) break;

    // Deduplication check
    const dedupKey = getJobDeduplicationKey(acc.id, 'all', new Date().toISOString());
    if (activeJobDeduplicationSet.has(dedupKey)) {
      jobsDeduplicated++;
      continue;
    }

    activeJobDeduplicationSet.add(dedupKey);
    // Auto-expire dedup keys after 1 hour
    setTimeout(() => activeJobDeduplicationSet.delete(dedupKey), 3600 * 1000).unref?.();

    accountsToProcess.push(acc);
  }

  // 4. Execute concurrently up to maxConcurrency
  for (let i = 0; i < accountsToProcess.length; i += maxConcurrency) {
    const chunk = accountsToProcess.slice(i, i + maxConcurrency);
    const chunkPromises = chunk.map(async (acc) => {
      jobsDispatched++;
      try {
        const res =
          acc.provider === 'youtube'
            ? await YouTubeProviderAdapter.syncAccount(acc.id)
            : await syncInstagramAccount(acc.id);
        if (res.success) {
          successCount++;
        } else {
          failureCount++;
        }
        return res;
      } catch (err) {
        failureCount++;
        return {
          accountId: acc.id,
          success: false,
          metricsCollected: [],
          error: {
            category: 'SCHEDULER_ERROR',
            code: 0,
            message: err instanceof Error ? err.message : 'Unknown execution error',
          },
          nextSyncAt: new Date(Date.now() + 300 * 1000),
        };
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return {
    accountsEvaluated: dueAccounts.length,
    jobsDispatched,
    jobsDeduplicated,
    successCount,
    failureCount,
    results,
    durationMs: Date.now() - startTime,
  };
}
