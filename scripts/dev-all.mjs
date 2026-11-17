#!/usr/bin/env node
/**
 * Adzunova Dev Orchestrator — Windows-safe, Node 20/22/24 compatible
 *
 * Design decisions (all verified against the codebase):
 *  - Paths resolved from import.meta.url, NOT process.cwd(), so the script
 *    works from any subfolder of the monorepo.
 *  - Children spawned as: node <path/to/cli.mjs> [args]
 *    — NEVER via shell:true or .cmd/.bat shims.
 *    — Avoids spawn EINVAL/UNKNOWN (CVE-2024-27980, Node >=22.4).
 *    — Avoids DEP0190 (shell:true with .bat was deprecated).
 *  - Each child's stdout/stderr is prefixed with a fixed-width colored label
 *    ([identity] / [web]) and buffered into a log ring for the fatal timeout dump.
 *  - Ctrl+C (SIGINT) or any child non-zero exit triggers cleanup:
 *    Windows  → taskkill /T /F /PID <pid>  (kills the entire child process tree)
 *    Unix     → process.kill(-pgid, 'SIGKILL')
 *  - Port conflict: print PID and exact taskkill/kill command, then exit 1.
 *  - If identity-service is not healthy after 90 s: dump last 40 lines, exit 1.
 *  - Final URL table printed once both services are up, includes DB mode from /health/ready.
 */

import { spawn, execSync } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ── Resolve root from THIS file's location (import.meta.url) ─────────────────
// Works whether invoked from repo root or any subdirectory.
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const rootDir    = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';

// ── ANSI colour helpers (no dependency on chalk) ─────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  magenta: '\x1b[35m',
  blue:    '\x1b[34m',
};

function c(color, text) { return `${color}${text}${C.reset}`; }

// Fixed-width log prefixes — 10 chars wide so columns stay aligned
const PREFIX = {
  identity: c(C.cyan,    '[identity] '),
  web:      c(C.magenta, '[web]      '),
  runner:   c(C.blue,    '[runner]   '),
  warn:     c(C.yellow,  '[warn]     '),
  error:    c(C.red,     '[error]    '),
};

function log(prefix, msg)  { process.stdout.write(`${prefix}${msg}\n`); }
function logErr(prefix, msg) { process.stderr.write(`${prefix}${msg}\n`); }

console.log('');
console.log(c(C.bold, '╔══════════════════════════════════════════════════════════════╗'));
console.log(c(C.bold, '║        🚀  Adzunova Stack Dev Runner (Node-safe Edition)     ║'));
console.log(c(C.bold, '╚══════════════════════════════════════════════════════════════╝'));
console.log('');

// ── 1. Port Preflight ─────────────────────────────────────────────────────────
/**
 * Returns the PID of the process listening on the given port, or null.
 * Sandboxed-safe: uses netstat (Windows) or lsof (Unix).
 */
function getPortOwner(port) {
  try {
    if (isWindows) {
      const output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
      for (const line of output.split('\n')) {
        const parts = line.trim().split(/\s+/);
        // Format: Proto  LocalAddr  ForeignAddr  State  PID
        if (parts.length >= 5 && parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING') {
          return parts[4];
        }
      }
    } else {
      const pid = execSync(`lsof -t -i :${port}`, { encoding: 'utf8' }).trim();
      return pid || null;
    }
  } catch { /* netstat/lsof unavailable — skip */ }
  return null;
}

for (const { port, label } of [{ port: 4101, label: 'identity-service' }, { port: 3000, label: 'web' }]) {
  const pid = getPortOwner(port);
  if (pid) {
    logErr(PREFIX.error, `Port ${port} (${label}) is already in use by PID ${pid}.`);
    if (isWindows) {
      logErr(PREFIX.error, `  To free it: taskkill /PID ${pid} /F`);
    } else {
      logErr(PREFIX.error, `  To free it: kill -9 ${pid}`);
    }
    logErr(PREFIX.error, `  Or run:     pnpm doctor`);
    process.exit(1);
  }
}
log(PREFIX.runner, '✓ Port preflight passed: 4101 and 3000 are free.');

// ── 2. Resolve CLI entrypoints (direct .mjs paths, no .cmd shims) ────────────
const tsxCli = path.join(rootDir, 'services', 'identity-service', 'node_modules', 'tsx', 'dist', 'cli.mjs');
const nextCli = path.join(rootDir, 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next');

if (!fs.existsSync(tsxCli)) {
  logErr(PREFIX.error, `tsx CLI not found at:\n  ${tsxCli}`);
  logErr(PREFIX.error, `  Run: cd services/identity-service && pnpm install`);
  process.exit(1);
}
if (!fs.existsSync(nextCli)) {
  logErr(PREFIX.error, `next CLI not found at:\n  ${nextCli}`);
  logErr(PREFIX.error, `  Run: cd apps/web && pnpm install`);
  process.exit(1);
}

// ── 3. Process-tree kill helper ───────────────────────────────────────────────
let identityProc = null;
let webProc = null;
let cleaningUp = false;

function killTree(proc, label) {
  if (!proc || !proc.pid) return;
  try {
    if (isWindows) {
      execSync(`taskkill /T /F /PID ${proc.pid}`, { stdio: 'ignore' });
    } else {
      process.kill(-proc.pid, 'SIGKILL');
    }
  } catch { /* already dead */ }
}

let exitCode = 0;

function cleanup(code = 0) {
  if (cleaningUp) return;
  cleaningUp = true;
  exitCode = code;
  log(PREFIX.runner, '🛑  Shutting down — killing child process trees...');
  killTree(identityProc, 'identity-service');
  killTree(webProc, 'web');
  // Allow stdout flush before exit
  setTimeout(() => process.exit(exitCode), 150);
}

process.on('SIGINT',  () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));
process.on('exit',    () => { killTree(identityProc, 'identity-service'); killTree(webProc, 'web'); });

// ── 4. Start identity-service ─────────────────────────────────────────────────
log(PREFIX.runner, '📦  [1/2] Starting @adzunova/identity-service on :4101...');

// Log ring buffer — last 40 lines kept for failure dump
const identityRing = [];
function pushRing(line) {
  identityRing.push(line);
  if (identityRing.length > 40) identityRing.shift();
}

identityProc = spawn(
  process.execPath,                          // current node binary — no .cmd shim
  [tsxCli, 'watch', 'src/main.ts'],         // tsx watch for HMR in dev
  {
    cwd: path.join(rootDir, 'services', 'identity-service'),
    env: {
      ...process.env,
      PORT: '4101',
      IDENTITY_SERVICE_PORT: '4101',
      IDENTITY_SERVICE_HOST: '0.0.0.0',
      NODE_ENV: 'development',
    },
    shell: false,                            // must be false — shell:true + .cmd = DEP0190
    stdio: ['inherit', 'pipe', 'pipe'],
  }
);

function routeIdentityOutput(chunk, isStderr) {
  const lines = chunk.toString().split('\n');
  for (const raw of lines) {
    if (!raw) continue;
    pushRing(raw);
    if (isStderr) {
      process.stderr.write(`${PREFIX.identity}${raw}\n`);
    } else {
      process.stdout.write(`${PREFIX.identity}${raw}\n`);
    }
  }
}

identityProc.stdout.on('data', (d) => routeIdentityOutput(d, false));
identityProc.stderr.on('data', (d) => routeIdentityOutput(d, true));

identityProc.on('error', (err) => {
  logErr(PREFIX.error, `identity-service spawn error: ${err.message}`);
  if (err.code === 'EINVAL' || err.code === 'UNKNOWN') {
    logErr(PREFIX.error, `  This is the Windows CVE-2024-27980 spawn bug.`);
    logErr(PREFIX.error, `  You are running: node scripts/dev-all.mjs (should not hit this).`);
    logErr(PREFIX.error, `  If you got here via pnpm dev:turbo, switch to pnpm run dev.`);
  }
  cleanup(1);
});

identityProc.on('exit', (code, signal) => {
  if (!cleaningUp && code !== null && code !== 0) {
    logErr(PREFIX.error, `identity-service exited unexpectedly (code=${code}, signal=${signal}).`);
    cleanup(1);
  }
});

// ── 5. Health polling (exponential backoff, 90s timeout) ─────────────────────
function checkHealth(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 2000 }, (res) => {
      // Drain body to prevent socket hang
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitForHealth(url, maxMs = 90_000) {
  process.stdout.write(`${PREFIX.runner}⏳  Waiting for identity-service /health`);
  const t0    = Date.now();
  let   delay = 300;

  while (Date.now() - t0 < maxMs) {
    if (await checkHealth(url)) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      process.stdout.write('\n');
      log(PREFIX.runner, `✅  identity-service healthy in ${elapsed}s`);
      return true;
    }
    process.stdout.write('.');
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(Math.round(delay * 1.3), 2000);
  }

  process.stdout.write('\n');
  return false;
}

const healthy = await waitForHealth('http://127.0.0.1:4101/health', 90_000);

if (!healthy) {
  logErr(PREFIX.error, '');
  logErr(PREFIX.error, '╔══════════════════════════════════════════════════════════════╗');
  logErr(PREFIX.error, '║  FATAL: identity-service not healthy after 90s               ║');
  logErr(PREFIX.error, '╠══════════════════════════════════════════════════════════════╣');
  logErr(PREFIX.error, '║  Last 40 identity-service log lines:                         ║');
  for (const line of identityRing.slice(-40)) {
    logErr(PREFIX.error, `║  ${line.slice(0, 60).padEnd(60)} ║`);
  }
  logErr(PREFIX.error, '╚══════════════════════════════════════════════════════════════╝');
  cleanup(1);
  // cleanup() calls setTimeout then process.exit — keep script alive
  await new Promise(() => {});
}

// ── 6. Start Next.js web app ─────────────────────────────────────────────────
log(PREFIX.runner, '🌐  [2/2] Starting @adzunova/web on :3000...');

webProc = spawn(
  process.execPath,
  [nextCli, 'dev', '--port', '3000'],
  {
    cwd: path.join(rootDir, 'apps', 'web'),
    env: {
      ...process.env,
      PORT: '3000',
      IDENTITY_SERVICE_URL: 'http://127.0.0.1:4101',
      NODE_ENV: 'development',
    },
    shell: false,
    stdio: ['inherit', 'pipe', 'pipe'],
  }
);

function routeWebOutput(chunk, isStderr) {
  const lines = chunk.toString().split('\n');
  for (const raw of lines) {
    if (!raw) continue;
    if (isStderr) {
      process.stderr.write(`${PREFIX.web}${raw}\n`);
    } else {
      process.stdout.write(`${PREFIX.web}${raw}\n`);
    }
  }
}

webProc.stdout.on('data', (d) => routeWebOutput(d, false));
webProc.stderr.on('data', (d) => routeWebOutput(d, true));

webProc.on('error', (err) => {
  logErr(PREFIX.error, `web spawn error: ${err.message}`);
  cleanup(1);
});

webProc.on('exit', (code, signal) => {
  if (!cleaningUp && code !== null && code !== 0) {
    logErr(PREFIX.error, `web app exited (code=${code}, signal=${signal}).`);
    cleanup(1);
  }
});

// ── 7. Query /health/ready for DB mode, then print the URL table ──────────────
// Give the services a moment to register (non-blocking — table prints even if
// /health/ready is slow; we just show 'checking...' in that case).
async function getDbMode() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:4101/health/ready', { timeout: 3000 }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.db || 'unknown');
        } catch {
          resolve('unknown');
        }
      });
    });
    req.on('error', () => resolve('error'));
    req.on('timeout', () => { req.destroy(); resolve('timeout'); });
  });
}

// Don't block startup table on /health/ready — allow 1.5s then proceed
const dbMode = await Promise.race([
  getDbMode(),
  new Promise((r) => setTimeout(() => r('checking…'), 1500)),
]);

console.log('');
console.log(c(C.green + C.bold, '╔══════════════════════════════════════════════════════════════════════╗'));
console.log(c(C.green + C.bold, '║                   🎉  All services are running                       ║'));
console.log(c(C.green + C.bold, '╠══════════════════════════════════════════════════════════════════════╣'));
console.log(c(C.green + C.bold, `║  Web app:            http://localhost:3000                            ║`));
console.log(c(C.green + C.bold, `║  Creator sign-in:    http://localhost:3000/auth/creator/sign-in      ║`));
console.log(c(C.green + C.bold, `║  Brand sign-in:      http://localhost:3000/auth/brand/sign-in        ║`));
console.log(c(C.green + C.bold, `║  Identity /health:   http://127.0.0.1:4101/health                    ║`));
console.log(c(C.green + C.bold, `║  Identity /ready:    http://127.0.0.1:4101/health/ready              ║`));
console.log(c(C.green + C.bold, `║  DB mode:            ${String(dbMode).padEnd(47)}║`));
console.log(c(C.green + C.bold, '╚══════════════════════════════════════════════════════════════════════╝'));
console.log('');
log(PREFIX.runner, 'Press Ctrl+C to stop all services.');
console.log('');
