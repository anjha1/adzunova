import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase F: Security, Isolation & Token Leakage Prevention', async () => {
  const { scrubSensitiveData, stripTokenFromPagingUrl } = await import(
    '../../apps/web/src/lib/social/security/log-scrubber.ts'
  );
  const { encryptToken } = await import('../../apps/web/src/lib/social/security/encryption.ts');
  const {
    saveSocialAccountAndCredentials,
    getSocialAccountsByCreatorId,
    disconnectSocialAccount,
  } = await import('../../apps/web/src/lib/social/social-repository.ts');

  it('security: token never appears in scrubbed log outputs or exception strings', () => {
    const rawSecret = 'EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4';
    const rawUrl = `https://graph.facebook.com/v27.0/me?access_token=${rawSecret}&appsecret_proof=abcdef123456`;

    const scrubbedLog = scrubSensitiveData(`Error connecting: ${rawUrl}`);
    assert.strictEqual(scrubbedLog.includes(rawSecret), false, 'Token must not leak into logs');
    assert.ok(scrubbedLog.includes('[REDACTED]'));

    // Paging URL stripping
    const sanitizedUrl = stripTokenFromPagingUrl(
      `https://graph.facebook.com/v27.0/1784/insights?access_token=${rawSecret}&after=QVFIU...`
    );
    assert.strictEqual(sanitizedUrl.includes(rawSecret), false, 'Paging URL must not store token');
    assert.ok(sanitizedUrl.includes('after=QVFIU'));
  });

  it('security: enforces strict creator boundary (cross-creator disconnect blocked)', async () => {
    const creatorA = 'creator_alpha_sec';
    const creatorB = 'creator_beta_sec';
    const encrypted = encryptToken('EAAB_isolated_token');

    // Create account for Creator A
    await saveSocialAccountAndCredentials(
      {
        creator_id: creatorA,
        provider: 'instagram',
        provider_user_id: 'ig_user_alpha',
        username: 'creator_alpha',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 5000,
        media_count: 50,
        status: 'ACTIVE',
        scopes: [],
        capabilities: {},
        connected_at: new Date(),
        last_synced_at: null,
        next_sync_at: null,
        sync_tier: 'WARM',
        failure_count: 0,
      },
      {
        token_ciphertext: encrypted.ciphertext,
        token_nonce: encrypted.nonce,
        key_id: encrypted.keyId,
        token_type: 'bearer',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // Creator B attempts to disconnect Creator A's account
    const disconnectResult = await disconnectSocialAccount(creatorB, 'instagram');
    assert.strictEqual(disconnectResult, false, 'Creator B must not be able to disconnect Creator A account');

    // Verify Creator A account is still active and untampered
    const accountsA = await getSocialAccountsByCreatorId(creatorA);
    assert.strictEqual(accountsA.length, 1);
    assert.strictEqual(accountsA[0].status, 'ACTIVE');
  });

  it('security: prevents duplicate account takeover across creators with 409 error', async () => {
    const creator1 = 'creator_original_owner';
    const creator2 = 'creator_attacker';
    const encrypted = encryptToken('EAAB_token');

    await saveSocialAccountAndCredentials(
      {
        creator_id: creator1,
        provider: 'instagram',
        provider_user_id: 'ig_shared_handle_123',
        username: 'original_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 10000,
        media_count: 100,
        status: 'ACTIVE',
        scopes: [],
        capabilities: {},
        connected_at: new Date(),
        last_synced_at: null,
        next_sync_at: null,
        sync_tier: 'WARM',
        failure_count: 0,
      },
      {
        token_ciphertext: encrypted.ciphertext,
        token_nonce: encrypted.nonce,
        key_id: encrypted.keyId,
        token_type: 'bearer',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // Creator 2 tries to link the same instagram provider_user_id
    await assert.rejects(
      async () => {
        await saveSocialAccountAndCredentials(
          {
            creator_id: creator2,
            provider: 'instagram',
            provider_user_id: 'ig_shared_handle_123',
            username: 'original_creator',
            account_type: 'BUSINESS',
            profile_picture_url: null,
            followers_count: 10000,
            media_count: 100,
            status: 'ACTIVE',
            scopes: [],
            capabilities: {},
            connected_at: new Date(),
            last_synced_at: null,
            next_sync_at: null,
            sync_tier: 'WARM',
            failure_count: 0,
          },
          {
            token_ciphertext: encrypted.ciphertext,
            token_nonce: encrypted.nonce,
            key_id: encrypted.keyId,
            token_type: 'bearer',
            expires_at: null,
            created_at: new Date(),
            rotated_at: null,
          }
        );
      },
      /already linked to another creator profile/
    );
  });
});

test.after(async () => {
  const { closeSocialDb } = await import('../../apps/web/src/lib/social/social-repository.ts');
  await closeSocialDb();
});
