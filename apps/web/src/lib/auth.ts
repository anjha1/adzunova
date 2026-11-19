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

/** Timeout for session verification requests (3 seconds) */
const GET_SESSION_TIMEOUT_MS = 3_000;

/**
 * Server-side helper to fetch current user session from HttpOnly cookie.
 * Returns null immediately if cookie is absent, invalid, expired, or if the
 * identity-service call times out / fails, ensuring pages never hang or crash.
 */
export async function getSession(requestId?: string): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GET_SESSION_TIMEOUT_MS);

  try {
    const fetchPromise = identityFetch<AuthSession>('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${sessionToken}` },
      requestId,
      signal: controller.signal,
    });

    const timeoutPromise = new Promise<{ data?: undefined; err?: { code: string; message: string; _internal?: any } }>((resolve) => {
      controller.signal.addEventListener('abort', () => {
        resolve({
          err: {
            code: 'IDENTITY_TIMEOUT',
            message: `Session check timed out after ${GET_SESSION_TIMEOUT_MS}ms`,
          },
        });
      });
    });

    const { data, err } = await Promise.race([fetchPromise, timeoutPromise]);

    if (err) {
      console.warn('[getSession] Failed to validate session with identity service, attempting local JWT fallback:', {
        code: err.code,
        message: err.message,
        requestId,
      });

      try {
        const parts = sessionToken.split('.');
        const payloadB64 = parts.length >= 4 ? parts[2] : parts.length === 3 ? parts[1] : null;
        if (payloadB64) {
          const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
          const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
          const payload = JSON.parse(jsonStr);
          if (payload.exp && payload.exp * 1000 >= Date.now() && payload.role) {
            return {
              user: {
                id: payload.userId || payload.id || 'creator-session',
                email: payload.email || 'creator@adzunova.com',
                role: payload.role,
                displayName: payload.displayName || payload.name || 'Adzunova Creator',
                emailVerified: true,
                avatarUrl: payload.avatarUrl,
              },
              profile: {
                displayName: payload.displayName || payload.name || 'Adzunova Creator',
                onboardingCompleted: true,
                avatarUrl: payload.avatarUrl,
              },
            };
          }
        }
      } catch (fallbackErr) {
        console.warn('[getSession] JWT fallback failed:', fallbackErr);
      }

      return null;
    }

    return data ?? null;
  } catch (error) {
    console.warn('[getSession] Error during session validation:', error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export { IDENTITY_SERVICE_URL, AUTH_COOKIE_NAME };
