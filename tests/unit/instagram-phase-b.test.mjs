import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

// Dynamically test encryption logic
describe('Phase B1 & B3: Envelope Encryption (AES-256-GCM)', async () => {
  const { encryptToken, decryptToken } = await import('../../apps/web/src/lib/social/security/encryption.ts');

  it('successfully encrypts and decrypts a long-lived Meta EA token', () => {
    const rawToken = 'EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4';
    const encrypted = encryptToken(rawToken);

    assert.ok(encrypted.ciphertext.includes(':'), 'Ciphertext must contain ciphertext:tag');
    assert.strictEqual(encrypted.nonce.length, 24, 'Nonce must be 12 bytes (24 hex characters)');
    assert.strictEqual(encrypted.keyId, 'v1');

    const decrypted = decryptToken(encrypted.ciphertext, encrypted.nonce, encrypted.keyId);
    assert.strictEqual(decrypted, rawToken);
  });

  it('rejects tampered ciphertext with authentication tag failure', () => {
    const rawToken = 'EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4';
    const encrypted = encryptToken(rawToken);

    // Tamper with the ciphertext
    const [ct, tag] = encrypted.ciphertext.split(':');
    const tamperedCt = (ct.startsWith('a') ? 'b' : 'a') + ct.slice(1);
    const tamperedPayload = `${tamperedCt}:${tag}`;

    assert.throws(() => {
      decryptToken(tamperedPayload, encrypted.nonce, encrypted.keyId);
    }, /Unsupported state or unable to authenticate data|bad decrypt/i);
  });
});

describe('Phase B3: Log Scrubber & Meta Paging URL Sanitization', async () => {
  const { scrubSensitiveData, stripTokenFromPagingUrl } = await import('../../apps/web/src/lib/social/security/log-scrubber.ts');

  it('redacts Meta EA tokens and query parameters from log messages', () => {
    const testLog = 'Connected with token EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4 on url https://graph.facebook.com/v27.0/me?access_token=EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4&client_secret=secret123';
    const scrubbed = scrubSensitiveData(testLog);

    assert.strictEqual(scrubbed.includes('EAABsbCS1iHg'), false, 'Token must not appear in scrubbed log');
    assert.strictEqual(scrubbed.includes('secret123'), false, 'Client secret must not appear in scrubbed log');
    assert.ok(scrubbed.includes('[REDACTED_META_TOKEN]'));
  });

  it('strips access_token and appsecret_proof from Meta paging URLs', () => {
    const rawPagingUrl = 'https://graph.facebook.com/v27.0/17841400000000/insights?metric=views&period=day&access_token=EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4&appsecret_proof=abcd1234efgh5678&after=QVFIU1...';
    const cleaned = stripTokenFromPagingUrl(rawPagingUrl);

    assert.ok(cleaned, 'Cleaned URL must exist');
    assert.strictEqual(cleaned.includes('access_token='), false, 'access_token must be stripped');
    assert.strictEqual(cleaned.includes('appsecret_proof='), false, 'appsecret_proof must be stripped');
    assert.ok(cleaned.includes('metric=views'), 'Legitimate query parameters must be preserved');
    assert.ok(cleaned.includes('after=QVFIU1'), 'Pagination cursor must be preserved');
  });
});

describe('Phase B2 & B3: Meta AppSecret Proof & Signed Request Verification', async () => {
  const { createAppSecretProof, verifyMetaSignedRequest } = await import('../../apps/web/src/lib/social/security/meta-signature.ts');

  const testSecret = '76523a088a22bd794bdc9461e9ffec17';
  const testToken = 'EAABsbCS1iHgBAO7x9Y5Z3K8m2N1p4Q9wL6sT0vR2eX5yZ8uI1oP4';

  it('computes HMAC-SHA256 appsecret_proof correctly', () => {
    const proof = createAppSecretProof(testToken, testSecret);
    const expected = crypto.createHmac('sha256', testSecret).update(testToken).digest('hex');

    assert.strictEqual(proof, expected);
    assert.strictEqual(proof.length, 64);
  });

  it('verifies valid Meta signed_request using constant-time comparison', () => {
    const payloadObj = {
      user_id: '1784140555666777',
      algorithm: 'HMAC-SHA256',
      issued_at: Math.floor(Date.now() / 1000) - 30, // 30s ago
    };
    const encodedPayload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
    const signature = crypto.createHmac('sha256', testSecret).update(encodedPayload).digest('base64url');
    const signedRequest = `${signature}.${encodedPayload}`;

    const result = verifyMetaSignedRequest(signedRequest, testSecret);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.payload?.user_id, '1784140555666777');
  });

  it('rejects tampered or forged signed_request', () => {
    const payloadObj = { user_id: '1784140555666777', algorithm: 'HMAC-SHA256', issued_at: Math.floor(Date.now() / 1000) };
    const encodedPayload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
    const forgedSignature = crypto.createHmac('sha256', 'wrong_secret').update(encodedPayload).digest('base64url');
    const forgedRequest = `${forgedSignature}.${encodedPayload}`;

    const result = verifyMetaSignedRequest(forgedRequest, testSecret);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.error, 'Signature mismatch');
  });

  it('rejects replay attack with duplicate signed_request', () => {
    const payloadObj = {
      user_id: 'replay_user_123',
      algorithm: 'HMAC-SHA256',
      issued_at: Math.floor(Date.now() / 1000) - 10,
    };
    const encodedPayload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
    const signature = crypto.createHmac('sha256', testSecret).update(encodedPayload).digest('base64url');
    const signedRequest = `${signature}.${encodedPayload}`;

    const first = verifyMetaSignedRequest(signedRequest, testSecret);
    assert.strictEqual(first.valid, true);

    // Second execution with identical payload and signature
    const replay = verifyMetaSignedRequest(signedRequest, testSecret);
    assert.strictEqual(replay.valid, false);
    assert.strictEqual(replay.error, 'Replay attack detected: signed_request already processed');
  });
});

describe('Phase B2: OAuth CSPRNG State Management', async () => {
  const { generateOAuthState, validateAndConsumeOAuthState } = await import('../../apps/web/src/lib/social/oauth-state.ts');

  it('generates state with >= 128 bits of entropy (192-bit hex)', () => {
    const state = generateOAuthState('creator-123', 'session-abc');
    assert.strictEqual(state.length, 48, '48 hex chars = 24 bytes = 192 bits');
  });

  it('validates state and enforces single-use semantics', () => {
    const state = generateOAuthState('creator-123', 'session-abc');

    const firstUse = validateAndConsumeOAuthState(state, 'creator-123');
    assert.strictEqual(firstUse.valid, true);
    assert.strictEqual(firstUse.data?.creatorId, 'creator-123');

    // Second use must fail immediately
    const secondUse = validateAndConsumeOAuthState(state, 'creator-123');
    assert.strictEqual(secondUse.valid, false);
    assert.strictEqual(secondUse.reason, 'Invalid or expired state parameter');
  });

  it('rejects state validation when foreign creator tries to claim it', () => {
    const state = generateOAuthState('creator-legit', 'session-legit');

    const attack = validateAndConsumeOAuthState(state, 'creator-attacker');
    assert.strictEqual(attack.valid, false);
    assert.strictEqual(attack.reason, 'State creator ID mismatch (session bound violation)');
  });
});

describe('Phase B2: Social Repository & Duplicate Account Conflict Detection', async () => {
  const {
    saveSocialAccountAndCredentials,
    getSocialAccountsByCreatorId,
    disconnectSocialAccount,
    deauthorizeMetaUser,
    recordDataDeletionRequest,
    getDataDeletionStatus,
  } = await import('../../apps/web/src/lib/social/social-repository.ts');

  it('persists social account and retrieves without leaking credentials', async () => {
    const creatorId = 'creator-repo-test-1';
    const providerUserId = 'ig-user-111222';

    await saveSocialAccountAndCredentials(
      {
        creator_id: creatorId,
        provider: 'instagram',
        provider_user_id: providerUserId,
        username: 'adzunova_creator',
        account_type: 'BUSINESS',
        profile_picture_url: 'https://images.adzunova.com/avatar.jpg',
        followers_count: 52000,
        media_count: 140,
        status: 'ACTIVE',
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        capabilities: { views_insights: true, demographics_gender_age: true },
        connected_at: new Date(),
        last_synced_at: new Date(),
        next_sync_at: new Date(Date.now() + 6 * 3600 * 1000),
        sync_tier: 'HOT',
        failure_count: 0,
      },
      {
        token_ciphertext: 'mock_cipher:mock_tag',
        token_nonce: 'mock_nonce_1234',
        key_id: 'v1',
        token_type: 'long_lived_user',
        expires_at: new Date(Date.now() + 60 * 86400 * 1000),
        created_at: new Date(),
        rotated_at: null,
      }
    );

    const accounts = await getSocialAccountsByCreatorId(creatorId);
    assert.strictEqual(accounts.length, 1);
    const acc = accounts[0];
    assert.strictEqual(acc.username, 'adzunova_creator');
    assert.strictEqual(acc.followers_count, 52000);
    // Credentials must NEVER be present on the account record
    assert.strictEqual('token_ciphertext' in acc, false);
    assert.strictEqual('token_nonce' in acc, false);
  });

  it('throws 409 conflict when an Instagram account is already claimed by another creator', async () => {
    const creatorA = 'creator-owner';
    const creatorB = 'creator-impostor';
    const providerUserId = 'ig-user-shared-999';

    // Creator A connects
    await saveSocialAccountAndCredentials(
      {
        creator_id: creatorA,
        provider: 'instagram',
        provider_user_id: providerUserId,
        username: 'official_brand_creator',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 100000,
        media_count: 50,
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
        token_ciphertext: 'ct:tag',
        token_nonce: 'nonce',
        key_id: 'v1',
        token_type: 'long_lived_user',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // Creator B attempts to claim the same Instagram account
    await assert.rejects(
      async () => {
        await saveSocialAccountAndCredentials(
          {
            creator_id: creatorB,
            provider: 'instagram',
            provider_user_id: providerUserId,
            username: 'official_brand_creator',
            account_type: 'BUSINESS',
            profile_picture_url: null,
            followers_count: 100000,
            media_count: 50,
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
            token_ciphertext: 'ct2:tag2',
            token_nonce: 'nonce2',
            key_id: 'v1',
            token_type: 'long_lived_user',
            expires_at: null,
            created_at: new Date(),
            rotated_at: null,
          }
        );
      },
      /already linked to another creator profile/
    );
  });

  it('supports user disconnect and marks account REVOKED', async () => {
    const creatorId = 'creator-disconnect-test';
    const providerUserId = 'ig-disconnect-123';

    await saveSocialAccountAndCredentials(
      {
        creator_id: creatorId,
        provider: 'instagram',
        provider_user_id: providerUserId,
        username: 'user_to_disconnect',
        account_type: 'BUSINESS',
        profile_picture_url: null,
        followers_count: 1000,
        media_count: 10,
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
        token_ciphertext: 'ct:tag',
        token_nonce: 'nonce',
        key_id: 'v1',
        token_type: 'long_lived_user',
        expires_at: null,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    const disconnected = await disconnectSocialAccount(creatorId, 'instagram');
    assert.strictEqual(disconnected, true);

    const activeList = await getSocialAccountsByCreatorId(creatorId);
    assert.strictEqual(activeList.length, 0, 'Revoked account must not appear in active listings');
  });

  it('records Meta data deletion requests and returns searchable confirmation code', async () => {
    const metaUserId = 'meta_delete_user_777';
    const record = await recordDataDeletionRequest(metaUserId, 'instagram');

    assert.ok(record.confirmation_code.startsWith('del_'));
    assert.strictEqual(record.status, 'COMPLETED');

    const retrieved = await getDataDeletionStatus(record.confirmation_code);
    assert.ok(retrieved);
    assert.strictEqual(retrieved?.confirmation_code, record.confirmation_code);
    assert.strictEqual(retrieved?.provider_user_id, metaUserId);
  });
});
