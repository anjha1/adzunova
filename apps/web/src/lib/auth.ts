import { cookies } from 'next/headers';
import { IDENTITY_SERVICE_URL, AUTH_COOKIE_NAME } from './config';
import { identityFetch } from './identity-client';

export type { AuthUser, AuthSession, CreatorProfileData, BrandProfileData } from './auth-types';
import type { AuthSession } from './auth-types';

export { identityFetch };

/**
 * Backward-compatible helper to call identity-service with error handling.
 */
export async function identityRequest<T = Record<string, any>>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const { data, err } = await identityFetch<T>(endpoint, options);
  if (err) {
    return { error: err.message };
  }
  return { data };
}

/**
 * Server-side helper to fetch current user session from HttpOnly cookie.
 * Returns null if cookie is absent or the session is invalid/expired.
 */
export async function getSession(requestId?: string): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  const { data, err } = await identityFetch<AuthSession>('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${sessionToken}` },
    requestId,
  });

  if (err) {
    console.warn('[getSession] Failed to validate session:', {
      code: err.code,
      message: err.message,
      internal: err._internal,
      requestId,
    });
    return null;
  }

  return data ?? null;
}

export { IDENTITY_SERVICE_URL, AUTH_COOKIE_NAME };
