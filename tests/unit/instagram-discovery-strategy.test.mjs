import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Phase 2: Discovery Strategy Pattern & Account Chooser Security', async () => {
  const {
    SystemUserDiscovery,
    UserTokenDiscovery,
    getDiscoveryStrategy,
    createAccountSelectionToken,
    verifyAccountSelectionToken,
  } = await import('../../apps/web/src/lib/social/discovery-strategy.ts');

  const APP_SECRET = 'test_app_secret_32char_secure_key!';

  // --- 1. Strategy Dispatching ---
  it('strategy: getDiscoveryStrategy selects SystemUserDiscovery for SYSTEM_USER token', () => {
    const strategy = getDiscoveryStrategy('SYSTEM_USER');
    assert.strictEqual(strategy.tokenType, 'SYSTEM_USER');
    assert.ok(strategy instanceof SystemUserDiscovery);
  });

  it('strategy: getDiscoveryStrategy selects UserTokenDiscovery for USER token', () => {
    const strategy = getDiscoveryStrategy('USER');
    assert.strictEqual(strategy.tokenType, 'USER');
    assert.ok(strategy instanceof UserTokenDiscovery);
  });

  // --- 2. SystemUserDiscovery Execution ---
  it('strategy: SystemUserDiscovery queries /me/assigned_instagram_accounts and extracts accounts', async () => {
    const originalFetch = globalThis.fetch;
    const requests = [];

    globalThis.fetch = async (url) => {
      requests.push(url.toString());
      if (url.toString().includes('/me/assigned_instagram_accounts')) {
        return new Response(
          JSON.stringify({
            data: [
              { id: '1784140001', username: 'creator_one', name: 'Creator One' },
              { id: '1784140002', username: 'creator_two', name: 'Creator Two' },
            ],
          }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ error: { message: 'Not found' } }), { status: 404 });
    };

    try {
      const discovery = new SystemUserDiscovery();
      const accounts = await discovery.discover({
        accessToken: 'EAAB_test_system_token',
        debug: {
          app_id: '123',
          type: 'SYSTEM_USER',
          is_valid: true,
          scopes: ['instagram_basic'],
          user_id: 'su_456',
        },
        appSecret: APP_SECRET,
      });

      assert.strictEqual(accounts.length, 2);
      assert.strictEqual(accounts[0].igId, '1784140001');
      assert.strictEqual(accounts[0].username, 'creator_one');
      assert.strictEqual(accounts[0].source, 'assigned_instagram_accounts');
      assert.strictEqual(accounts[1].igId, '1784140002');
      assert.strictEqual(accounts[1].username, 'creator_two');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  // --- 3. UserTokenDiscovery Execution ---
  it('strategy: UserTokenDiscovery discovers via granular_scopes target_ids', async () => {
    const discovery = new UserTokenDiscovery();
    const accounts = await discovery.discover({
      accessToken: 'EAAB_test_user_token',
      debug: {
        app_id: '123',
        type: 'USER',
        is_valid: true,
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        granular_scopes: [
          { scope: 'instagram_basic', target_ids: ['1784149999'] },
        ],
        user_id: 'u_789',
      },
      appSecret: APP_SECRET,
    });

    assert.strictEqual(accounts.length, 1);
    assert.strictEqual(accounts[0].igId, '1784149999');
    assert.strictEqual(accounts[0].source, 'granular_scopes');
  });

  // --- 4. Server-Side Signed Selection Token Security ---
  it('chooser: signs and verifies a valid account selection token', () => {
    const token = createAccountSelectionToken(
      {
        creatorId: 'creator_abc',
        allowedIgIds: ['1784140001', '1784140002'],
        accountsMeta: [
          { igId: '1784140001', username: 'creator_one' },
          { igId: '1784140002', username: 'creator_two' },
        ],
        encryptedTokenPayload: {
          ciphertext: 'c_text',
          nonce: 'nonce_123',
          keyId: 'key_1',
        },
      },
      APP_SECRET,
      600
    );

    assert.ok(typeof token === 'string' && token.includes('.'));

    const verification = verifyAccountSelectionToken(token, 'creator_abc', APP_SECRET);
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.payload?.creatorId, 'creator_abc');
    assert.deepStrictEqual(verification.payload?.allowedIgIds, ['1784140001', '1784140002']);
  });

  it('chooser: rejects selection token when signature is tampered', () => {
    const token = createAccountSelectionToken(
      {
        creatorId: 'creator_abc',
        allowedIgIds: ['1784140001'],
        accountsMeta: [{ igId: '1784140001', username: 'creator_one' }],
        encryptedTokenPayload: { ciphertext: 'c', nonce: 'n', keyId: 'k' },
      },
      APP_SECRET,
      600
    );

    const tampered = token.slice(0, -4) + 'abcd';
    const result = verifyAccountSelectionToken(tampered, 'creator_abc', APP_SECRET);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Invalid selection token signature');
  });

  it('chooser: rejects selection token when expired', () => {
    const token = createAccountSelectionToken(
      {
        creatorId: 'creator_abc',
        allowedIgIds: ['1784140001'],
        accountsMeta: [{ igId: '1784140001', username: 'creator_one' }],
        encryptedTokenPayload: { ciphertext: 'c', nonce: 'n', keyId: 'k' },
      },
      APP_SECRET,
      -10 // Expired 10 seconds ago
    );

    const result = verifyAccountSelectionToken(token, 'creator_abc', APP_SECRET);
    assert.strictEqual(result.valid, false);
    assert.ok(result.error?.includes('expired'));
  });

  it('chooser: rejects cross-creator token hijacking attempt', () => {
    const token = createAccountSelectionToken(
      {
        creatorId: 'legit_creator_123',
        allowedIgIds: ['1784140001'],
        accountsMeta: [{ igId: '1784140001', username: 'creator_one' }],
        encryptedTokenPayload: { ciphertext: 'c', nonce: 'n', keyId: 'k' },
      },
      APP_SECRET,
      600
    );

    // Foreign creator attempts to redeem token
    const result = verifyAccountSelectionToken(token, 'attacker_creator_999', APP_SECRET);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Selection token not authorized for this creator');
  });
});
