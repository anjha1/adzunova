import { decryptToken } from './security/encryption';
import { refreshYouTubeAccessToken } from './youtube-client';
import {
  getSocialCredentialByAccountId,
  markSocialAccountReconnectRequired,
} from './social-repository';

interface CachedAccessToken {
  accessToken: string;
  expiresAtMs: number;
}

// Short-lived access token cache (never stores refresh tokens in plain memory long-term)
const accessTokenCache = new Map<string, CachedAccessToken>();
const EXPIRY_SKEW_MS = 60 * 1000; // Refresh 60s before expiry

export class YouTubeTokenError extends Error {
  constructor(
    public readonly code: 'RECONNECT_REQUIRED' | 'TRANSIENT_ERROR' | 'NOT_FOUND',
    message: string,
    public readonly googleError?: string
  ) {
    super(message);
    this.name = 'YouTubeTokenError';
  }
}

export function clearYouTubeAccessTokenCache(accountId: string): void {
  accessTokenCache.delete(accountId);
}

/**
 * Returns a valid short-lived Google OAuth access token for a connected YouTube account.
 * Refreshes server-side on demand using the encrypted refresh token.
 * On invalid_grant (revoked access or Google OAuth Testing 7-day expiry), marks account
 * RECONNECT_REQUIRED immediately without retry storms.
 */
export async function getValidYouTubeAccessToken(
  accountId: string,
  creatorId: string
): Promise<string> {
  const cached = accessTokenCache.get(accountId);
  if (cached && Date.now() < cached.expiresAtMs - EXPIRY_SKEW_MS) {
    return cached.accessToken;
  }

  const cred = await getSocialCredentialByAccountId(accountId);
  if (!cred) {
    throw new YouTubeTokenError(
      'NOT_FOUND',
      'No stored credentials found for this YouTube account. Please reconnect.'
    );
  }

  const refreshToken = decryptToken(cred.token_ciphertext, cred.token_nonce);
  const res = await refreshYouTubeAccessToken(refreshToken);

  if (res.status === 200 && res.data.access_token) {
    const expiresInSec = typeof res.data.expires_in === 'number' ? res.data.expires_in : 3600;
    accessTokenCache.set(accountId, {
      accessToken: res.data.access_token,
      expiresAtMs: Date.now() + expiresInSec * 1000,
    });
    return res.data.access_token;
  }

  const errCode = res.data.error || `http_${res.status}`;

  // invalid_grant or unauthorized_client => permanent until user re-consents
  if (errCode === 'invalid_grant' || errCode === 'unauthorized_client' || res.status === 400 || res.status === 401) {
    accessTokenCache.delete(accountId);
    const reason =
      errCode === 'invalid_grant'
        ? 'Google authorization expired or was revoked (note: while consent screen is in Testing mode, refresh tokens expire after 7 days). Please reconnect your YouTube channel.'
        : `Google token refresh rejected (${errCode}). Please reconnect your YouTube channel.`;
    await markSocialAccountReconnectRequired(accountId, creatorId, 'youtube', reason);
    throw new YouTubeTokenError('RECONNECT_REQUIRED', reason, errCode);
  }

  throw new YouTubeTokenError(
    'TRANSIENT_ERROR',
    `Temporary failure refreshing YouTube access token (${errCode}).`,
    errCode
  );
}
