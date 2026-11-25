import test from 'node:test';
import assert from 'node:assert/strict';

import {
  saveSocialAccountAndCredentials,
  getSocialAccountsByCreatorId,
  getSocialCredentialByAccountId,
  disconnectSocialAccount,
  purgeStaleRevokedYouTubeData,
  _resetInMemoryStore,
} from '../../apps/web/src/lib/social/social-repository.ts';
import { encryptToken, decryptToken } from '../../apps/web/src/lib/social/security/encryption.ts';

test('YouTube Phase 8 Integration: Persistence, Credentials Isolation & Retention', async (t) => {
  // Force isolated in-memory test store by clearing MONGODB_URI in this test process
  const prevMongo = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;
  process.env.TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
  _resetInMemoryStore();

  t.after(() => {
    if (prevMongo) process.env.MONGODB_URI = prevMongo;
  });

  await t.test('persists YouTube channel + encrypted refresh token and never leaks credentials in list queries', async () => {
    const encrypted = encryptToken('1//0gTestRefreshToken_NeverLeaked');
    const saved = await saveSocialAccountAndCredentials(
      {
        creator_id: 'creator_yt_1',
        provider: 'youtube',
        provider_user_id: 'UC_test_channel_001',
        username: '@techcreator',
        account_type: 'Tech Creator Channel',
        profile_picture_url: null,
        followers_count: 42000,
        media_count: 120,
        status: 'ACTIVE',
        scopes: [
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/yt-analytics.readonly',
        ],
        capabilities: { hiddenSubscriberCount: false, dataThroughDate: '2026-11-23' },
        connected_at: new Date(),
        last_synced_at: new Date(),
        next_sync_at: new Date(Date.now() + 3600_000),
        sync_tier: 'WARM',
        failure_count: 0,
      },
      {
        token_ciphertext: encrypted.ciphertext,
        token_nonce: encrypted.nonce,
        key_id: encrypted.keyId,
        token_type: 'refresh_token',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    assert.equal(saved.isNew, true);

    const accounts = await getSocialAccountsByCreatorId('creator_yt_1');
    assert.equal(accounts.length, 1);
    assert.equal(accounts[0].provider, 'youtube');
    assert.equal(accounts[0].token_ciphertext, undefined);

    const cred = await getSocialCredentialByAccountId(saved.accountId);
    assert.ok(cred);
    assert.equal(decryptToken(cred.token_ciphertext, cred.token_nonce), '1//0gTestRefreshToken_NeverLeaked');
  });

  await t.test('blocks duplicate YouTube channel takeover across creators (409 conflict)', async () => {
    const encrypted = encryptToken('1//0gOtherToken');
    await assert.rejects(
      () =>
        saveSocialAccountAndCredentials(
          {
            creator_id: 'creator_yt_2',
            provider: 'youtube',
            provider_user_id: 'UC_test_channel_001',
            username: '@techcreator',
            account_type: 'Tech Creator Channel',
            profile_picture_url: null,
            followers_count: 42000,
            media_count: 120,
            status: 'ACTIVE',
            scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
            capabilities: {},
            connected_at: new Date(),
            last_synced_at: new Date(),
            next_sync_at: new Date(),
            sync_tier: 'WARM',
            failure_count: 0,
          },
          {
            token_ciphertext: encrypted.ciphertext,
            token_nonce: encrypted.nonce,
            key_id: encrypted.keyId,
            token_type: 'refresh_token',
            expires_at: null,
            created_at: new Date(),
            rotated_at: null,
          }
        ),
      /already linked to another creator/i
    );
  });

  await t.test('disconnects YouTube channel, deletes credentials, marks REVOKED, and purges stale data', async () => {
    const ok = await disconnectSocialAccount('creator_yt_1', 'youtube', { deleteMetrics: true });
    assert.equal(ok, true);

    const active = await getSocialAccountsByCreatorId('creator_yt_1');
    assert.equal(active.length, 0);

    const purgeRes = await purgeStaleRevokedYouTubeData(0);
    assert.ok(purgeRes.purgedAccounts >= 1);
  });
});
