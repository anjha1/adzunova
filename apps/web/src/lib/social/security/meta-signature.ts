import crypto from 'crypto';

/**
 * Meta Signature Verification & AppSecret Proof.
 * Implements Meta platform security requirements:
 * 1. appsecret_proof HMAC-SHA256 calculation for Graph API calls
 * 2. Constant-time verification of signed_request for deauthorize & data deletion callbacks
 * 3. Replay attack prevention cache
 */

// In-memory replay cache with TTL (10 minutes)
const replayCache = new Map<string, number>();

function cleanupReplayCache() {
  const now = Date.now();
  for (const [key, expiresAt] of replayCache.entries()) {
    if (expiresAt < now) {
      replayCache.delete(key);
    }
  }
}

/**
 * Generates appsecret_proof for Meta Graph API calls.
 * appsecret_proof = HMAC-SHA256(access_token, app_secret)
 */
export function createAppSecretProof(accessToken: string, appSecret: string): string {
  if (!accessToken || !appSecret) {
    throw new Error('Access token and app secret are required to generate appsecret_proof');
  }
  return crypto.createHmac('sha256', appSecret).update(accessToken).digest('hex');
}

export interface SignedRequestResult {
  valid: boolean;
  payload?: {
    user_id?: string;
    algorithm?: string;
    issued_at?: number;
    [key: string]: any;
  };
  error?: string;
}

/**
 * Validates Meta signed_request sent to deauthorize and data-deletion webhooks.
 * Spec: <encoded_sig>.<encoded_envelope>
 */
export function verifyMetaSignedRequest(signedRequest: string, appSecret: string): SignedRequestResult {
  if (!signedRequest || !appSecret) {
    return { valid: false, error: 'Missing signed_request or app secret' };
  }

  const parts = signedRequest.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed signed_request format. Expected sig.payload' };
  }

  const [encodedSig, encodedPayload] = parts;

  try {
    // 1. Decode signature (base64url)
    const normalizedSig = encodedSig.replace(/-/g, '+').replace(/_/g, '/');
    const signature = Buffer.from(normalizedSig, 'base64');

    // 2. Compute expected HMAC-SHA256 signature over encodedPayload
    const expectedSig = crypto.createHmac('sha256', appSecret).update(encodedPayload).digest();

    // 3. Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSig.length || !crypto.timingSafeEqual(signature, expectedSig)) {
      return { valid: false, error: 'Signature mismatch' };
    }

    // 4. Decode payload JSON (base64url)
    const normalizedPayload = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = Buffer.from(normalizedPayload, 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);

    // 5. Verify algorithm
    if (payload.algorithm && payload.algorithm.toUpperCase() !== 'HMAC-SHA256') {
      return { valid: false, error: `Unsupported algorithm: ${payload.algorithm}` };
    }

    // 6. Replay attack check: verify issued_at is within acceptable drift window (15 mins)
    const nowSec = Math.floor(Date.now() / 1000);
    if (payload.issued_at && Math.abs(nowSec - payload.issued_at) > 900) {
      return { valid: false, error: 'Request expired (issued_at drift exceeds 15 minutes)' };
    }

    // 7. Replay cache check
    cleanupReplayCache();
    const replayKey = `${payload.user_id}_${payload.issued_at}_${encodedSig.slice(0, 16)}`;
    if (replayCache.has(replayKey)) {
      return { valid: false, error: 'Replay attack detected: signed_request already processed' };
    }
    replayCache.set(replayKey, Date.now() + 10 * 60 * 1000); // 10 min TTL

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err instanceof Error ? err.message : 'Unknown parsing error' };
  }
}
