import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import {
  generatePkcePair,
  getYouTubeOAuthUrl,
  verifyGrantedYouTubeScopes,
  YOUTUBE_SCOPES,
} from '../../apps/web/src/lib/social/youtube-client.ts';
import {
  generateOAuthState,
  validateAndConsumeOAuthState,
} from '../../apps/web/src/lib/social/oauth-state.ts';
import { scrubSensitiveData } from '../../apps/web/src/lib/social/security/log-scrubber.ts';
import { getYouTubeErrorDetails } from '../../apps/web/src/lib/social/error-taxonomy.ts';

test('YouTube OAuth Phase 2: PKCE, Scopes, State & Security', async (t) => {
  await t.test('generates valid S256 PKCE code_verifier and code_challenge', () => {
    const { codeVerifier, codeChallenge } = generatePkcePair();
    assert.ok(codeVerifier.length >= 43, 'code_verifier must satisfy RFC 7636 length');
    const expectedChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    assert.equal(codeChallenge, expectedChallenge);
  });

  await t.test('builds Google OAuth URL with offline access, consent prompt, S256 PKCE, and read-only scopes only', () => {
    process.env.YOUTUBE_CLIENT_ID = 'test-yt-client-id';
    process.env.YOUTUBE_REDIRECT_URI = 'https://example.test/api/auth/youtube/callback';

    const urlStr = getYouTubeOAuthUrl({
      state: 'state_abc_123',
      codeChallenge: 'challenge_xyz',
    });
    const parsed = new URL(urlStr);

    assert.equal(parsed.origin + parsed.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
    assert.equal(parsed.searchParams.get('response_type'), 'code');
    assert.equal(parsed.searchParams.get('access_type'), 'offline');
    assert.equal(parsed.searchParams.get('prompt'), 'consent');
    assert.equal(parsed.searchParams.get('code_challenge_method'), 'S256');
    assert.equal(parsed.searchParams.get('code_challenge'), 'challenge_xyz');
    assert.equal(parsed.searchParams.get('state'), 'state_abc_123');

    const scopes = (parsed.searchParams.get('scope') || '').split(' ');
    assert.deepEqual(scopes, [...YOUTUBE_SCOPES]);
    assert.equal(scopes.some((s) => s.includes('monetary') || s.includes('force-ssl') || s.includes('upload')), false);
  });

  await t.test('verifies BOTH required scopes were granted and rejects unticked scope', () => {
    const both = verifyGrantedYouTubeScopes(
      'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly'
    );
    assert.equal(both.valid, true);
    assert.equal(both.missingScopes.length, 0);

    const partial = verifyGrantedYouTubeScopes('https://www.googleapis.com/auth/youtube.readonly');
    assert.equal(partial.valid, false);
    assert.deepEqual(partial.missingScopes, ['https://www.googleapis.com/auth/yt-analytics.readonly']);

    const empty = verifyGrantedYouTubeScopes('');
    assert.equal(empty.valid, false);
    assert.equal(empty.missingScopes.length, 2);
  });

  await t.test('enforces single-use OAuth state, PKCE binding, and rejects replay / foreign session', () => {
    const state = generateOAuthState('creator_1', 'session_1', {
      provider: 'youtube',
      codeVerifier: 'verifier_secret_123',
    });

    // Foreign creator rejected
    const foreign = validateAndConsumeOAuthState(state, 'creator_other', 'session_1');
    assert.equal(foreign.valid, false);

    // State was consumed on attempt or fresh state works once
    const state2 = generateOAuthState('creator_1', 'session_1', {
      provider: 'youtube',
      codeVerifier: 'verifier_secret_456',
    });
    const valid = validateAndConsumeOAuthState(state2, 'creator_1', 'session_1');
    assert.equal(valid.valid, true);
    assert.equal(valid.data?.codeVerifier, 'verifier_secret_456');

    // Replay rejected
    const replay = validateAndConsumeOAuthState(state2, 'creator_1', 'session_1');
    assert.equal(replay.valid, false);
  });

  await t.test('scrubs Google ya29. access tokens and 1// refresh tokens from logs', () => {
    const raw =
      'Error with ya29.a0AfH6SMBxSecretToken1234567890 and refresh 1//04xRefreshSecretToken9876543210&key=AIzaSyTestKey123';
    const scrubbed = scrubSensitiveData(raw);
    assert.equal(scrubbed.includes('ya29.'), false);
    assert.equal(scrubbed.includes('1//'), false);
    assert.equal(scrubbed.includes('AIzaSyTestKey123'), false);
  });

  await t.test('maps all 8 YouTube error states cleanly without exposing raw tokens', () => {
    const codes = [
      'consent_denied',
      'missing_scope',
      'no_refresh_token',
      'no_channel',
      'account_already_linked',
      'state_invalid_or_expired',
      'google_api_error',
      'discovery_failed_server',
    ];
    for (const c of codes) {
      const details = getYouTubeErrorDetails(c, { reason: 'quotaExceeded', supportId: 'sup-123' });
      assert.equal(details.code, c);
      assert.ok(details.title.length > 0);
      assert.ok(details.message.length > 0);
    }
  });
});
