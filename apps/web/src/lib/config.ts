/**
 * Next.js web app — server-side config validator.
 * Validates required env vars at startup.
 */

export interface WebConfig {
  IDENTITY_SERVICE_URL: string;
  AUTH_COOKIE_NAME: string;
  IS_DEVELOPMENT: boolean;
}

function loadConfig(): WebConfig {
  const identityUrl = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:4101';
  const cookieName = process.env.AUTH_COOKIE_NAME || 'adzunova_session';
  const isDev = (process.env.NODE_ENV ?? 'development') !== 'production';

  return {
    IDENTITY_SERVICE_URL: identityUrl,
    AUTH_COOKIE_NAME: cookieName,
    IS_DEVELOPMENT: isDev,
  };
}

const config = loadConfig();

export const IDENTITY_SERVICE_URL = config.IDENTITY_SERVICE_URL;
export const AUTH_COOKIE_NAME = config.AUTH_COOKIE_NAME;
export const IS_DEVELOPMENT = config.IS_DEVELOPMENT;

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, '');
  }

  const host = req.headers.get('host');
  if (host && !host.includes('localhost:10000') && !host.includes('127.0.0.1:10000')) {
    return `${forwardedProto}://${host}`;
  }

  if (req.nextUrl.origin.includes('localhost:10000') || req.nextUrl.origin.includes('127.0.0.1:10000')) {
    return 'https://adzunova-web.onrender.com';
  }

  return req.nextUrl.origin;
}
