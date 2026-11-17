#!/usr/bin/env node
/**
 * Adzunova Diagnostic Doctor
 * Run via: pnpm doctor (or node scripts/doctor.mjs)
 */

import http from 'http';
import net from 'net';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

const results = [];

function record(category, check, status, note = '') {
  results.push({ category, check, status: status ? 'PASS' : 'FAIL', note });
}

function mask(val) {
  if (!val) return '(empty)';
  if (val.length <= 6) return '******';
  return `${val.slice(0, 3)}...${val.slice(-3)}`;
}

// ── 1. Node Version ──────────────────────────────────────────────────────────
const nodeVer = process.version;
const majorVer = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
// Node 20+ is supported. Warn on 24 about turbo — not about dev-all.
const isSupported = majorVer >= 20;
let nodeNote = nodeVer;
if (majorVer >= 24) {
  nodeNote = `${nodeVer} (⚠️  pnpm dev:turbo fails; pnpm run dev is fine)`;
}
record('Runtime', 'Node.js Version', isSupported, nodeNote);

// ── 2. Configuration & Env Files ─────────────────────────────────────────────
const envFiles = [
  { file: path.join(rootDir, '.env'), name: 'Root .env' },
  { file: path.join(rootDir, 'services', 'identity-service', '.env'), name: 'Identity .env' },
  { file: path.join(rootDir, 'apps', 'web', '.env.local'), name: 'Web .env.local' },
];

for (const { file, name } of envFiles) {
  const exists = fs.existsSync(file);
  record('Environment Files', name, exists, exists ? 'Found' : 'Missing');
}

// Parse root .env
let rootEnv = {};
if (fs.existsSync(path.join(rootDir, '.env'))) {
  const lines = fs.readFileSync(path.join(rootDir, '.env'), 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      rootEnv[key] = val;
    }
  }
}

record('Variables (Masked)', 'MONGODB_URI', Boolean(rootEnv.MONGODB_URI), mask(rootEnv.MONGODB_URI));
record('Variables (Masked)', 'GOOGLE_CLIENT_ID', Boolean(rootEnv.GOOGLE_CLIENT_ID), mask(rootEnv.GOOGLE_CLIENT_ID));
record('Variables (Masked)', 'GOOGLE_CLIENT_SECRET', Boolean(rootEnv.GOOGLE_CLIENT_SECRET), mask(rootEnv.GOOGLE_CLIENT_SECRET));
record('Variables (Masked)', 'AUTH_SESSION_SECRET', Boolean(rootEnv.AUTH_SESSION_SECRET), mask(rootEnv.AUTH_SESSION_SECRET));
record('Variables (Masked)', 'IDENTITY_SERVICE_URL', Boolean(rootEnv.IDENTITY_SERVICE_URL || 'http://127.0.0.1:4101'), rootEnv.IDENTITY_SERVICE_URL || '127.0.0.1:4101 (default)');

// ── 3. Port Listeners & Process Owners ────────────────────────────────────────
function getPortOwner(port) {
  try {
    if (isWindows) {
      const output = execSync(`netstat -ano -p tcp`, { encoding: 'utf8' });
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

const pid4101 = getPortOwner(4101);
record('Port Listeners', 'Port 4101 (identity-service)', Boolean(pid4101), pid4101 ? `Listening (PID: ${pid4101})` : 'Not running');

const pid3000 = getPortOwner(3000);
record('Port Listeners', 'Port 3000 (web app)', Boolean(pid3000), pid3000 ? `Listening (PID: ${pid3000})` : 'Not running');

// ── 4. Service HTTP Health ───────────────────────────────────────────────────
function httpGet(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const ms = Date.now() - start;
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), ms });
        } catch {
          resolve({ status: res.statusCode, body: data, ms });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 0, error: err.message, ms: Date.now() - start }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'TIMEOUT', ms: timeoutMs });
    });
  });
}

if (pid4101) {
  const healthRes = await httpGet('http://127.0.0.1:4101/health');
  record('Health Endpoints', 'GET :4101/health (liveness)', healthRes.status === 200, `HTTP ${healthRes.status} in ${healthRes.ms}ms`);

  const readyRes = await httpGet('http://127.0.0.1:4101/health/ready');
  const dbType = readyRes.body?.db || 'unknown';
  record('Health Endpoints', 'GET :4101/health/ready (store)', readyRes.status === 200, `Store: ${dbType}`);
} else {
  record('Health Endpoints', 'GET :4101/health (liveness)', false, 'Service not listening');
  record('Health Endpoints', 'GET :4101/health/ready (store)', false, 'Service not listening');
}

// ── 5. Render Output Table ───────────────────────────────────────────────────
console.log('\n╔═════════════════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                         🩺  ADZUNOVA AUTH STACK DIAGNOSTIC DOCTOR                           ║');
console.log('╠═════════════════════════════════════════════════════════════════════════════════════════════╣');
console.log('║ Category            │ Check                          │ Status │ Diagnostic Detail            ║');
console.log('╟─────────────────────┼────────────────────────────────┼────────┼──────────────────────────────╢');

for (const r of results) {
  const cat = r.category.padEnd(19).slice(0, 19);
  const chk = r.check.padEnd(30).slice(0, 30);
  const st = r.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
  const nt = r.note.padEnd(28).slice(0, 28);
  console.log(`║ ${cat} │ ${chk} │ ${st} │ ${nt} ║`);
}
console.log('╚═════════════════════════════════════════════════════════════════════════════════════════════╝\n');
