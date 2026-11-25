import test from 'node:test';
import assert from 'node:assert/strict';

import {
  YouTubeQuotaBudgeter,
  YOUTUBE_DATA_API_COST,
  classifyGoogleApiError,
  getNextQuotaResetPT,
} from '../../apps/web/src/lib/social/youtube-quota.ts';
import {
  acquireAccountLease,
  releaseAccountLease,
} from '../../apps/web/src/lib/social/youtube-sync.ts';

test('YouTube Phase 3: Quota Budgeter, Error Classifier & Sync Leases', async (t) => {
  await t.test('forbids search.list (100 units) and uses 1-unit endpoints', () => {
    const budgeter = new YouTubeQuotaBudgeter(10_000);
    assert.equal(YOUTUBE_DATA_API_COST['channels.list'], 1);
    assert.equal(YOUTUBE_DATA_API_COST['playlistItems.list'], 1);
    assert.equal(YOUTUBE_DATA_API_COST['videos.list'], 1);
    assert.equal(YOUTUBE_DATA_API_COST['search.list'], 100);
    assert.equal(budgeter.canSpend('search.list', 'HOT'), false);
  });

  await t.test('triggers WARN_80 degradation (skips top videos) and EXHAUSTED_100 halt', () => {
    const budgeter = new YouTubeQuotaBudgeter(10);
    const fixedNow = new Date('2026-11-25T12:00:00Z');

    // Spend 8 units -> 80% burn
    for (let i = 0; i < 8; i++) {
      budgeter.recordSpend('channels.list', fixedNow);
    }
    const status80 = budgeter.getStatus(fixedNow);
    assert.equal(status80.alertLevel, 'WARN_80');
    assert.equal(status80.degradationMode, 'SKIP_TOP_VIDEOS');
    assert.equal(budgeter.canSpend('playlistItems.list', 'WARM', fixedNow), false);
    assert.equal(budgeter.canSpend('channels.list', 'HOT', fixedNow), true);

    // Spend remaining 2 units -> 100% halted
    budgeter.recordSpend('channels.list', fixedNow);
    budgeter.recordSpend('channels.list', fixedNow);
    const status100 = budgeter.getStatus(fixedNow);
    assert.equal(status100.alertLevel, 'EXHAUSTED_100');
    assert.equal(status100.degradationMode, 'HALTED');
    assert.equal(budgeter.canSpend('channels.list', 'HOT', fixedNow), false);
  });

  await t.test('classifies quotaExceeded, rateLimitExceeded, invalid_grant, and 5xx accurately', () => {
    const q = classifyGoogleApiError(403, { errors: [{ reason: 'quotaExceeded' }] });
    assert.equal(q.category, 'QUOTA_EXCEEDED');
    assert.equal(q.isRetryable, false);
    assert.ok(q.nextSyncAtOverride instanceof Date);

    const rl = classifyGoogleApiError(403, { errors: [{ reason: 'userRateLimitExceeded' }] });
    assert.equal(rl.category, 'RATE_LIMITED');
    assert.equal(rl.isRetryable, true);

    const ig = classifyGoogleApiError(401, 'invalid_grant');
    assert.equal(ig.category, 'TOKEN_INVALID');
    assert.equal(ig.isRetryable, false);

    const s500 = classifyGoogleApiError(503, 'backendError');
    assert.equal(s500.category, 'TRANSIENT_5XX');
    assert.equal(s500.isRetryable, true);

    const reset = getNextQuotaResetPT(new Date('2026-11-25T12:00:00Z'));
    assert.ok(reset.getTime() > Date.now() - 86400_000);
  });

  await t.test('enforces per-account lease lock against concurrent syncs', () => {
    assert.equal(acquireAccountLease('yt-acc-1'), true);
    assert.equal(acquireAccountLease('yt-acc-1'), false);
    releaseAccountLease('yt-acc-1');
    assert.equal(acquireAccountLease('yt-acc-1'), true);
    releaseAccountLease('yt-acc-1');
  });
});
