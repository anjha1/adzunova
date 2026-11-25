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
  provider?: 'instagram' | 'youtube';
  codeVerifier?: string;
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

function constantTimeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generates a CSPRNG OAuth state token (192-bit) bound to creator and session
 */
export function generateOAuthState(
  creatorId: string,
  sessionId: string,
  options?: { provider?: 'instagram' | 'youtube'; codeVerifier?: string }
): string {
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
    provider: options?.provider,
    codeVerifier: options?.codeVerifier,
  });

  return state;
}

/**
 * Validates and consumes an OAuth state token.
 * Single-use: state is immediately deleted once validated.
 */
export function validateAndConsumeOAuthState(
  state: string,
  expectedCreatorId: string,
  expectedSessionId?: string
): { valid: boolean; data?: OAuthStateData; reason?: string } {
  cleanupExpiredStates();

  if (!state) {
    return { valid: false, reason: 'Missing state parameter' };
  }

  let matchedKey: string | null = null;
  let matchedData: OAuthStateData | undefined;
  for (const [storedKey, storedVal] of stateStore.entries()) {
    if (constantTimeMatch(storedKey, state)) {
      matchedKey = storedKey;
      matchedData = storedVal;
      break;
    }
  }

  if (!matchedKey || !matchedData) {
    return { valid: false, reason: 'Invalid or expired state parameter' };
  }

  // Single-use: delete immediately
  stateStore.delete(matchedKey);

  // Expiration check
  if (Date.now() - matchedData.createdAt > STATE_TTL_MS) {
    return { valid: false, reason: 'State token expired' };
  }

  // Creator identity binding check
  if (!constantTimeMatch(matchedData.creatorId, expectedCreatorId)) {
    return { valid: false, reason: 'State creator ID mismatch (session bound violation)' };
  }

  if (expectedSessionId && !constantTimeMatch(matchedData.sessionId, expectedSessionId)) {
    return { valid: false, reason: 'State session ID mismatch (session bound violation)' };
  }

  return { valid: true, data: matchedData };
}

/**
 * Persistent OAuth State Store (MongoDB-backed with 10-minute TTL & atomic single-use).
 * Survives process restarts and multi-instance deployments; falls back to in-memory only when MONGODB_URI is unset.
 */
let oauthMongoClient: import('mongodb').MongoClient | null = null;
let oauthMongoIndexEnsured = false;

async function getOAuthStateCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) return null;
  try {
    if (!oauthMongoClient) {
      const { MongoClient } = await import('mongodb');
      oauthMongoClient = new MongoClient(uri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000,
      });
      await oauthMongoClient.connect();
    }
    const db = oauthMongoClient.db(process.env.MONGODB_DB_NAME || 'adzunova');
    const col = db.collection('oauth_states');
    if (!oauthMongoIndexEnsured) {
      await Promise.allSettled([
        col.createIndex({ state: 1 }, { unique: true, background: true }),
        col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, background: true }),
      ]);
      oauthMongoIndexEnsured = true;
    }
    return col;
  } catch {
    return null;
  }
}

export async function generatePersistentOAuthState(
  creatorId: string,
  sessionId: string,
  options?: { provider?: 'instagram' | 'youtube'; codeVerifier?: string }
): Promise<string> {
  const state = crypto.randomBytes(24).toString('hex'); // 192 bits CSPRNG
  const nonce = crypto.randomBytes(16).toString('hex');
  const now = Date.now();
  const record: OAuthStateData & { expiresAt: Date } = {
    state,
    creatorId,
    sessionId,
    createdAt: now,
    nonce,
    provider: options?.provider,
    codeVerifier: options?.codeVerifier,
    expiresAt: new Date(now + STATE_TTL_MS),
  };

  const col = await getOAuthStateCollection();
  if (col) {
    await col.insertOne(record);
    return state;
  }

  stateStore.set(state, record);
  return state;
}

export async function validateAndConsumePersistentOAuthState(
  state: string,
  expectedCreatorId: string,
  expectedSessionId?: string
): Promise<{ valid: boolean; data?: OAuthStateData; reason?: string }> {
  if (!state) {
    return { valid: false, reason: 'Missing state parameter' };
  }

  const col = await getOAuthStateCollection();
  if (col) {
    const doc = await col.findOneAndDelete({ state });
    if (!doc) {
      return { valid: false, reason: 'Invalid or expired state parameter' };
    }
    const data = doc as unknown as OAuthStateData;
    if (!constantTimeMatch(data.state, state)) {
      return { valid: false, reason: 'Invalid state parameter' };
    }
    if (Date.now() - data.createdAt > STATE_TTL_MS) {
      return { valid: false, reason: 'State token expired' };
    }
    if (!constantTimeMatch(data.creatorId, expectedCreatorId)) {
      return { valid: false, reason: 'State creator ID mismatch (session bound violation)' };
    }
    if (expectedSessionId && !constantTimeMatch(data.sessionId, expectedSessionId)) {
      return { valid: false, reason: 'State session ID mismatch (session bound violation)' };
    }
    return { valid: true, data };
  }

  return validateAndConsumeOAuthState(state, expectedCreatorId, expectedSessionId);
}
