#!/usr/bin/env node
/**
 * YouTube Connect Preflight Check (Phase 0)
 *
 * Prints (names only, NEVER values):
 *  - Whether each required/optional env var is PRESENT or MISSING
 *  - Whether YOUTUBE_REDIRECT_URI equals ${APP_BASE_URL}/api/auth/youtube/callback
 *  - Whether APP_BASE_URL and API_BASE_URL use https://
 *
 * Never exits non-zero just because YouTube vars are unconfigured in dev:
 * missing configuration must surface cleanly as "Not configured".
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const eqIdx = trimmed.indexOf('=');
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
  return env;
}

const rootEnv = parseEnvFile(path.join(rootDir, '.env'));
const idEnv = parseEnvFile(path.join(rootDir, 'services', 'identity-service', '.env'));
const webEnv = parseEnvFile(path.join(rootDir, 'apps', 'web', '.env.local'));

// Process env overrides file env, matching runtime precedence
const mergedEnv = {
  ...rootEnv,
  ...idEnv,
  ...webEnv,
};

function getEnv(name) {
  const procVal = process.env[name];
  if (typeof procVal === 'string' && procVal.trim().length > 0) {
    return procVal.trim();
  }
  const fileVal = mergedEnv[name];
  return typeof fileVal === 'string' ? fileVal.trim() : '';
}

const ENV_CHECKS = [
  { name: 'YOUTUBE_CLIENT_ID', required: true },
  { name: 'YOUTUBE_CLIENT_SECRET', required: true },
  { name: 'YOUTUBE_REDIRECT_URI', required: true },
  { name: 'TOKEN_ENCRYPTION_KEY', required: true },
  { name: 'APP_BASE_URL', required: true },
  { name: 'API_BASE_URL', required: true },
  { name: 'DEBUG_OAUTH', required: false },
];

console.log('\n[YouTube Preflight] Environment Variable Presence (names only — values never printed):');
const missingRequired = [];
for (const item of ENV_CHECKS) {
  const present = getEnv(item.name).length > 0;
  const tag = present ? 'PRESENT' : 'MISSING';
  const reqLabel = item.required ? 'required' : 'optional';
  console.log(`  - ${item.name} (${reqLabel}): ${tag}`);
  if (item.required && !present) {
    missingRequired.push(item.name);
  }
}

const appBaseUrl = getEnv('APP_BASE_URL');
const apiBaseUrl = getEnv('API_BASE_URL');
const youtubeRedirectUri = getEnv('YOUTUBE_REDIRECT_URI');

const appBaseNormalized = appBaseUrl.replace(/\/+$/, '');
const expectedRedirectUri = appBaseNormalized
  ? `${appBaseNormalized}/api/auth/youtube/callback`
  : '';

const redirectMatchesAppBase = Boolean(
  youtubeRedirectUri &&
  expectedRedirectUri &&
  youtubeRedirectUri === expectedRedirectUri
);

const appBaseIsHttps = appBaseUrl.startsWith('https://');
const apiBaseIsHttps = apiBaseUrl.startsWith('https://');

console.log('\n[YouTube Preflight] URL & Protocol Checks:');
console.log(
  `  - YOUTUBE_REDIRECT_URI === \${APP_BASE_URL}/api/auth/youtube/callback: ${
    !youtubeRedirectUri || !appBaseUrl
      ? 'UNKNOWN (one or both vars MISSING)'
      : redirectMatchesAppBase
      ? 'PASS'
      : 'MISMATCH'
  }`
);
console.log(
  `  - APP_BASE_URL uses https://: ${
    !appBaseUrl ? 'MISSING' : appBaseIsHttps ? 'PASS (https)' : 'FAIL (not https)'
  }`
);
console.log(
  `  - API_BASE_URL uses https://: ${
    !apiBaseUrl ? 'MISSING' : apiBaseIsHttps ? 'PASS (https)' : 'FAIL (not https)'
  }`
);

const isConfigured =
  missingRequired.length === 0 &&
  redirectMatchesAppBase &&
  appBaseIsHttps &&
  apiBaseIsHttps;

console.log('\n[YouTube Preflight] Summary:');
if (isConfigured) {
  console.log('  - YouTube Connect Status: CONFIGURED');
} else {
  console.log('  - YouTube Connect Status: NOT CONFIGURED (graceful fallback active)');
  if (missingRequired.length > 0) {
    console.log(`  - Missing required vars: ${missingRequired.join(', ')}`);
  }
}
console.log('');
