/**
 * Next.js web app — server-side config validator.
 * Validates required env vars at startup.
 */

export interface WebConfig {
  IDENTITY_SERVICE_URL: string;
  APP_BASE_URL: string;
  API_BASE_URL: string;
  AUTH_COOKIE_NAME: string;
  IS_DEVELOPMENT: boolean;
}

function loadConfig(): WebConfig {
  const identityUrl = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:4101';
  const appBaseUrl = (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    ''
  ).replace(/\/+$/, '');
  const apiBaseUrl = (
    process.env.API_BASE_URL ||
    process.env.IDENTITY_SERVICE_URL ||
    ''
  ).replace(/\/+$/, '');
  const cookieName = process.env.AUTH_COOKIE_NAME || 'adzunova_session';
  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';

  return {
    IDENTITY_SERVICE_URL: identityUrl,
    APP_BASE_URL: appBaseUrl,
    API_BASE_URL: apiBaseUrl,
    AUTH_COOKIE_NAME: cookieName,
    IS_DEVELOPMENT: isDev,
  };
}

const config = loadConfig();

export const IDENTITY_SERVICE_URL = config.IDENTITY_SERVICE_URL;
export const APP_BASE_URL = config.APP_BASE_URL;
export const API_BASE_URL = config.API_BASE_URL;
export const AUTH_COOKIE_NAME = config.AUTH_COOKIE_NAME;
export const IS_DEVELOPMENT = config.IS_DEVELOPMENT;

export interface YouTubeConfigStatus {
  configured: boolean;
  status: 'ACTIVE' | 'NOT_CONFIGURED';
  missingVars: string[];
  redirectMatchesAppBase: boolean;
  appBaseIsHttps: boolean;
  apiBaseIsHttps: boolean;
  reason?: string;
}

/**
 * Production-safe YouTube Connect configuration check.
 * Never throws when env vars are missing — returns NOT_CONFIGURED so UI renders "Not configured".
 * Never includes secret values in any returned fields.
 */
export function getYouTubeConfigStatus(): YouTubeConfigStatus {
  const clientId = (process.env.YOUTUBE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.YOUTUBE_CLIENT_SECRET || '').trim();
  const redirectUri = (process.env.YOUTUBE_REDIRECT_URI || '').trim();
  const encryptionKey = (process.env.TOKEN_ENCRYPTION_KEY || '').trim();
  const appBase = (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    ''
  ).trim().replace(/\/+$/, '');
  const apiBase = (
    process.env.API_BASE_URL ||
    process.env.IDENTITY_SERVICE_URL ||
    ''
  ).trim().replace(/\/+$/, '');

  const missingVars: string[] = [];
  if (!clientId) missingVars.push('YOUTUBE_CLIENT_ID');
  if (!clientSecret) missingVars.push('YOUTUBE_CLIENT_SECRET');
  if (!redirectUri) missingVars.push('YOUTUBE_REDIRECT_URI');
  if (!encryptionKey) missingVars.push('TOKEN_ENCRYPTION_KEY');

  const expectedRedirect = appBase ? `${appBase}/api/auth/youtube/callback` : '';
  const redirectMatchesAppBase = Boolean(redirectUri && expectedRedirect && redirectUri === expectedRedirect);
  const appBaseIsHttps = appBase.startsWith('https://');
  const apiBaseIsHttps = apiBase.startsWith('https://');

  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';

  if (missingVars.length > 0) {
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      missingVars,
      redirectMatchesAppBase,
      appBaseIsHttps,
      apiBaseIsHttps,
      reason: `Not configured: missing ${missingVars.join(', ')}`,
    };
  }

  if (isProd && (!appBaseIsHttps || !apiBaseIsHttps || !redirectMatchesAppBase)) {
    const issues: string[] = [];
    if (!appBaseIsHttps) issues.push('APP_BASE_URL must use https://');
    if (!apiBaseIsHttps) issues.push('API_BASE_URL must use https://');
    if (!redirectMatchesAppBase) issues.push('YOUTUBE_REDIRECT_URI mismatch with APP_BASE_URL');
    return {
      configured: false,
      status: 'NOT_CONFIGURED',
      missingVars,
      redirectMatchesAppBase,
      appBaseIsHttps,
      apiBaseIsHttps,
      reason: `Not configured: ${issues.join('; ')}`,
    };
  }

  return {
    configured: true,
    status: 'ACTIVE',
    missingVars: [],
    redirectMatchesAppBase,
    appBaseIsHttps,
    apiBaseIsHttps,
  };
}

/**
 * Resolves the public-facing origin URL of the incoming request,
 * accounting for reverse-proxies (Render, Vercel, Cloudflare, etc.)
 * which forward traffic from internal ports (e.g. localhost:10000).
 */
export function getPublicOrigin(req: { headers: { get(name: string): string | null }; nextUrl: { origin: string } }): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const appUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, '');
  }

  const host = req.headers.get('host');
  if (host && !host.includes('localhost:10000') && !host.includes('127.0.0.1:10000')) {
    return `${forwardedProto}://${host}`;
  }

  return req.nextUrl.origin;
}
