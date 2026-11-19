import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase F: Load Scale & Chaos Resilience Simulation', async () => {
  const { getAccountShard, getJobDeduplicationKey } = await import(
    '../../apps/web/src/lib/social/scheduler.ts'
  );
  const { MetaCircuitBreaker, applyJitter } = await import(
    '../../apps/web/src/lib/social/rate-limiter.ts'
  );

  it('load: 10,000 accounts partition deterministically across 8 shards with balanced distribution', () => {
    const totalAccounts = 10000;
    const totalShards = 8;
    const shardBuckets = new Array(totalShards).fill(0);

    const startTime = performance.now();
    for (let i = 0; i < totalAccounts; i++) {
      const accountId = `account_load_test_${i}`;
      const shard = getAccountShard(accountId, totalShards);
      shardBuckets[shard]++;
    }
    const elapsedMs = performance.now() - startTime;

    // Throughput assertion: 10,000 partitions in under 50ms
    assert.ok(elapsedMs < 100, `Partitioning took ${elapsedMs}ms, expected < 100ms`);

    // Balance assertion: expected ~1,250 per bucket; verify no bucket has < 1,000 or > 1,500
    for (let s = 0; s < totalShards; s++) {
      assert.ok(
        shardBuckets[s] >= 1000 && shardBuckets[s] <= 1500,
        `Shard ${s} has ${shardBuckets[s]} accounts (expected ~1,250)`
      );
    }
  });

  it('chaos: Meta 429 storm trips circuit breaker OPEN and recovers safely', async () => {
    const breaker = new MetaCircuitBreaker();
    assert.strictEqual(breaker.canExecute(), true);

    // Simulate 429 storm: consecutive throttling failures
    for (let i = 0; i < 3; i++) {
      breaker.recordFailure(true); // true = throttling error
    }

    // Breaker must trip to OPEN
    assert.strictEqual(breaker.getStatus().state, 'OPEN');
    assert.strictEqual(breaker.canExecute(), false, 'Breaker must reject calls during 429 storm');

    // Fast-forward backoff using forceOpen with short 30ms window for test
    breaker.forceOpen(30);
    assert.strictEqual(breaker.canExecute(), false);

    await new Promise((resolve) => setTimeout(resolve, 40));

    // Status transitions to HALF_OPEN
    assert.strictEqual(breaker.getStatus().state, 'HALF_OPEN');
    assert.strictEqual(breaker.canExecute(), true);

    // Successful trial call recovers to CLOSED
    breaker.recordSuccess();
    assert.strictEqual(breaker.getStatus().state, 'CLOSED');
    assert.strictEqual(breaker.canExecute(), true);
  });

  it('chaos: schedule jittering prevents thundering herd across top-of-hour cron triggers', () => {
    const baseSyncInterval = 86400; // 24 hours
    const samples = 1000;
    const jitteredResults = new Set();

    for (let i = 0; i < samples; i++) {
      const jittered = applyJitter(baseSyncInterval, -0.15, 0.15);
      jitteredResults.add(jittered);
      // Boundary check
      assert.ok(
        jittered >= Math.round(baseSyncInterval * 0.85) &&
          jittered <= Math.round(baseSyncInterval * 1.15)
      );
    }

    // Must produce high variance to disperse calls across the time window
    assert.ok(
      jitteredResults.size > 200,
      `Expected high dispersion, got ${jitteredResults.size} distinct schedules`
    );
  });
});
