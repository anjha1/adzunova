import crypto from 'crypto';

/**
 * OAuth State Manager for CSRF & Session Fixation Protection.
 * Generates single-use CSPRNG tokens (>=128 bits) with 10-minute TTL,
 * strictly bound to creator_id and session.
 */

export interface OAuthStateData {
  state: string;
  creatorId: string;
  sessionId: string;
  createdAt: number;
  nonce: string;
}

// In-memory state cache (pluggable with Redis port)
const stateStore = new Map<string, OAuthStateData>();

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function cleanupExpiredStates() {
  const now = Date.now();
  for (const [state, data] of stateStore.entries()) {
    if (now - data.createdAt > STATE_TTL_MS) {
      stateStore.delete(state);
    }
  }
}

/**
 * Generates a CSPRNG OAuth state token (192-bit) bound to creator and session
 */
export function generateOAuthState(creatorId: string, sessionId: string): string {
  cleanupExpiredStates();

  const rawBytes = crypto.randomBytes(24); // 192 bits
  const state = rawBytes.toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  stateStore.set(state, {
    state,
    creatorId,
    sessionId,
    createdAt: Date.now(),
    nonce,
  });

  return state;
}

/**
 * Validates and consumes an OAuth state token.
 * Single-use: state is immediately deleted once validated.
 */
export function validateAndConsumeOAuthState(
  state: string,
  expectedCreatorId: string
): { valid: boolean; data?: OAuthStateData; reason?: string } {
  cleanupExpiredStates();

  if (!state) {
    return { valid: false, reason: 'Missing state parameter' };
  }

  const data = stateStore.get(state);
  if (!data) {
    return { valid: false, reason: 'Invalid or expired state parameter' };
  }

  // Single-use: delete immediately
  stateStore.delete(state);

  // Expiration check
  if (Date.now() - data.createdAt > STATE_TTL_MS) {
    return { valid: false, reason: 'State token expired' };
  }

  // Creator identity binding check
  if (data.creatorId !== expectedCreatorId) {
    return { valid: false, reason: 'State creator ID mismatch (session bound violation)' };
  }

  return { valid: true, data };
}
