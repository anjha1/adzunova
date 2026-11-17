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
