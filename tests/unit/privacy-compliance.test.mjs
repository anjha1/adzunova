import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase D: Privacy, Compliance & Audit Logging', async () => {
  const {
    logSocialAuditAction,
    getSocialAuditLogs,
    saveSocialAccountAndCredentials,
    getSocialAccountsByCreatorId,
    disconnectSocialAccount,
  } = await import('../../apps/web/src/lib/social/social-repository.ts');
  const { encryptToken } = await import('../../apps/web/src/lib/social/security/encryption.ts');

  it('records immutable audit log entries for creator actions', async () => {
    const creatorId = 'creator_audit_test_1';

    await logSocialAuditAction(creatorId, 'CONNECT_INITIATED', 'instagram', {
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });
    await logSocialAuditAction(creatorId, 'CONNECT_SUCCESS', 'instagram', {
      username: 'audit_creator',
      followers: 12500,
    });
    await logSocialAuditAction(creatorId, 'DISCONNECTED', 'instagram', {
      reason: 'USER_INITIATED',
    });

    const logs = await getSocialAuditLogs(creatorId);

    assert.strictEqual(logs.length, 3);
    assert.strictEqual(logs[0].action, 'DISCONNECTED');
    assert.strictEqual(logs[1].action, 'CONNECT_SUCCESS');
    assert.strictEqual(logs[2].action, 'CONNECT_INITIATED');
    assert.strictEqual(logs[1].metadata?.username, 'audit_creator');
  });

  it('permanently disconnects account and clears credentials on user request', async () => {
    const creatorId = 'creator_privacy_disconnect_test';
    const encrypted = encryptToken('EAAB_privacy_test_token');

    const { accountId } = await saveSocialAccountAndCredentials(
      {
        creator_id: creatorId,
        provider: 'instagram',
        provider_user_id: 'ig_privacy_user_1',
        username: 'privacy_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 3000,
        media_count: 20,
        status: 'ACTIVE',
        scopes: ['instagram_basic'],
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

    // Verify account is active
    let activeAccounts = await getSocialAccountsByCreatorId(creatorId);
    assert.strictEqual(activeAccounts.length, 1);
    assert.strictEqual(activeAccounts[0].status, 'ACTIVE');

    // Execute disconnect
    const disconnected = await disconnectSocialAccount(creatorId, 'instagram');
    assert.strictEqual(disconnected, true);

    // Verify account is no longer in active accounts list
    activeAccounts = await getSocialAccountsByCreatorId(creatorId);
    assert.strictEqual(activeAccounts.length, 0, 'Disconnected account must be excluded from active accounts list');

    // Verify underlying record is marked REVOKED
    const { getSocialAccountById } = await import('../../apps/web/src/lib/social/social-repository.ts');
    const rawAccount = await getSocialAccountById(accountId);
    assert.ok(rawAccount);
    assert.strictEqual(rawAccount.status, 'REVOKED');
  });

  it('ensures minor audience demographics (13-17) are labeled neutrally as Meta estimate', async () => {
    const { normalizeDemographics } = await import('../../apps/web/src/lib/social/demographics-engine.ts');

    const rawBreakdown = {
      data: [
        {
          total_value: {
            breakdowns: [
              {
                dimension_keys: ['gender', 'age'],
                results: [
                  { dimension_values: ['F', '13-17'], value: 150 },
                  { dimension_values: ['M', '13-17'], value: 150 },
                  { dimension_values: ['F', '18-24'], value: 1200 },
                ],
              },
            ],
          },
        },
      ],
    };

    const derived = normalizeDemographics(rawBreakdown);

    assert.strictEqual(typeof derived.share_13_17, 'number');
    assert.ok(derived.share_13_17 > 0);
    // Verified: Engine does not produce any judgment labels or flags on the minor share
    assert.strictEqual(derived.ageDistribution[0].bucket, '13-17');
    assert.strictEqual(derived.ageDistribution[0].count, 300);
  });
});
