import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateOAuthState,
  validateAndConsumeOAuthState,
} from '../../apps/web/src/lib/social/oauth-state.ts';
import {
  getYouTubeFeatureFlags,
  recordYouTubeConnectAttempt,
  recordYouTubeConnectResult,
  recordYouTubeGoogleApiError,
  getYouTubeObservabilitySnapshot,
} from '../../apps/web/src/lib/social/youtube-observability.ts';
import { scrubSensitiveData } from '../../apps/web/src/lib/social/security/log-scrubber.ts';

test('YouTube Phase 7 Security: Threat Model, Kill Switches & Observability', async (t) => {
  await t.test('rejects state fixation, foreign session, and replay attacks', () => {
    const state = generateOAuthState('creator-A', 'session-A', {
      provider: 'youtube',
      codeVerifier: 'pkce-verifier-A',
    });

    // Foreign session with same creatorId rejected
    const badSession = validateAndConsumeOAuthState(state, 'creator-A', 'session-B');
    assert.equal(badSession.valid, false);

    // State was single-use consumed; replay fails
    const replay = validateAndConsumeOAuthState(state, 'creator-A', 'session-A');
    assert.equal(replay.valid, false);
  });

  await t.test('respects feature flag kill switches (youtube.connect, youtube.sync, DEBUG_OAUTH)', () => {
    process.env.FEATURE_YOUTUBE_CONNECT = 'false';
    process.env.FEATURE_YOUTUBE_SYNC = 'false';
    process.env.DEBUG_OAUTH = 'false';

    const flags = getYouTubeFeatureFlags();
    assert.equal(flags.youtubeConnectEnabled, false);
    assert.equal(flags.youtubeSyncEnabled, false);
    assert.equal(flags.debugOAuthEnabled, false);

    delete process.env.FEATURE_YOUTUBE_CONNECT;
    delete process.env.FEATURE_YOUTUBE_SYNC;
  });

  await t.test('tracks observability counters and triggers invalid_grant spike alert', () => {
    recordYouTubeConnectAttempt('corr-1');
    recordYouTubeConnectResult('failure', 'corr-1', 'consent_denied');
    for (let i = 0; i < 5; i++) {
      recordYouTubeGoogleApiError('invalid_grant', `corr-${i}`);
    }
    const snap = getYouTubeObservabilitySnapshot();
    assert.ok(snap.counters.connectAttempts >= 1);
    assert.ok(snap.counters.connectFailuresByCode.consent_denied >= 1);
    assert.ok(snap.alerts.includes('INVALID_GRANT_SPIKE'));
  });

  await t.test('scrubs all Google OAuth secret patterns from error strings', () => {
    const leaked =
      'https://oauth2.googleapis.com/token?code=4/0AX4XfWhSecret&client_secret=GOCSPX-secret123&refresh_token=1//0gSecretRefreshToken1234567890&access_token=ya29.a0AfBSecretAccessToken1234567890';
    const clean = scrubSensitiveData(leaked);
    assert.equal(clean.includes('GOCSPX-secret123'), false);
    assert.equal(clean.includes('1//0gSecret'), false);
    assert.equal(clean.includes('ya29.a0AfB'), false);
    assert.equal(clean.includes('4/0AX4XfWhSecret'), false);
  });
});
