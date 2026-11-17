#!/usr/bin/env node
/**
 * Adzunova Preflight (predev hook)
 * Runs automatically before `pnpm run dev` via the "predev" lifecycle script.
 *
 * Checks:
 *  1. Node version warning (not error) for unsupported ranges
 *  2. Required env vars present and non-empty (values MASKED — no secrets printed)
 *  3. Ports 3000 and 4101 are free
 *
 * On failure prints clear remediation and exits 1.
 * Never prints any secret value.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

let failed = false;

function warn(msg)  { console.warn(`  ⚠️  ${msg}`); }
function ok(msg)    { console.log(`  ✅ ${msg}`); }
function fail(msg)  { console.error(`  ❌ ${msg}`); failed = true; }

console.log('\n🔍  Adzunova pre-dev preflight...\n');

// ── 1. Node version ──────────────────────────────────────────────────────────
const major = parseInt(process.version.replace('v', '').split('.')[0], 10);
if (major < 20) {
  fail(`Node ${process.version} is below minimum 20. Install Node 22 LTS.`);
} else if (major >= 24) {
  warn(`Node ${process.version} detected. Recommended: Node 22 LTS (.nvmrc).`);
  warn(`  pnpm dev:turbo (turbo run dev) WILL fail on Node 24 due to CVE-2024-27980.`);
  warn(`  pnpm run dev (node scripts/dev-all.mjs) is unaffected and is the default.`);
  ok(`Using node scripts/dev-all.mjs — not affected by the turbo spawn bug.`);
} else {
  ok(`Node ${process.version} ✓`);
}

// ── 2. Required env vars (masked) ───────────────────────────────────────────
function mask(val) {
  if (!val || val.length === 0) return '(empty)';
  if (val.length <= 6) return '******';
  return `${val.slice(0, 3)}...${val.slice(-3)}`;
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const idx = t.indexOf('=');
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

// Merge: root .env + identity-service .env + web .env.local
const rootEnv  = parseEnvFile(path.join(rootDir, '.env'));
const idEnv    = parseEnvFile(path.join(rootDir, 'services', 'identity-service', '.env'));
const webEnv   = parseEnvFile(path.join(rootDir, 'apps', 'web', '.env.local'));
const merged   = { ...rootEnv, ...idEnv, ...webEnv };

const REQUIRED = [
  ['GOOGLE_CLIENT_ID',     'Google OAuth client ID'],
  ['GOOGLE_CLIENT_SECRET', 'Google OAuth client secret'],
  ['AUTH_SESSION_SECRET',  'Session signing secret'],
];

for (const [key, label] of REQUIRED) {
  const val = merged[key] || process.env[key] || '';
  if (!val) {
    fail(`Missing required env var ${key} (${label}). Check root .env or identity-service .env.`);
  } else {
    ok(`${key}: ${mask(val)}`);
  }
}

// MONGODB_URI missing = fallback warning only (in-memory store is allowed in dev)
const mongoUri = merged['MONGODB_URI'] || process.env['MONGODB_URI'] || '';
if (!mongoUri) {
  warn(`MONGODB_URI not set — identity-service will use the in-memory fallback store.`);
  warn(`  Data is LOST on every restart. Set MONGODB_URI in root .env for persistence.`);
} else {
  ok(`MONGODB_URI: ${mask(mongoUri)}`);
}

// ── 3. Port availability ─────────────────────────────────────────────────────
function getPortOwner(port) {
  try {
    if (isWindows) {
      const output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
      for (const line of output.split('\n')) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
          return parts[4];
        }
      }
    } else {
      const pid = execSync(`lsof -t -i :${port}`, { encoding: 'utf8' }).trim();
      return pid || null;
    }
  } catch {}
  return null;
}

for (const port of [4101, 3000]) {
  const pid = getPortOwner(port);
  if (pid) {
    fail(`Port ${port} is already in use by PID ${pid}.`);
    fail(`  To free it: taskkill /PID ${pid} /F`);
  } else {
    ok(`Port ${port} is free ✓`);
  }
}

// ── Result ───────────────────────────────────────────────────────────────────
console.log('');
if (failed) {
  console.error('❌  Pre-dev preflight failed. Fix the issues above before starting the stack.\n');
  process.exit(1);
}
console.log('✅  Pre-dev preflight passed. Starting the stack...\n');
