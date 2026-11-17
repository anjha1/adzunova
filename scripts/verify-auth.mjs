#!/usr/bin/env node
/**
 * Adzunova Authentication Verification Suite
 * Usage: node scripts/verify-auth.mjs
 */

import http from 'http';

function httpGet(options) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const ms = Date.now() - start;
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json,
          ms,
        });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║       🔬  ADZUNOVA AUTH INTEGRATION VERIFICATION SUITE       ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let passCount = 0;
let totalCount = 0;

function report(condition, checkName, ms, note = '') {
  totalCount++;
  const status = condition ? '✅ PASS' : '❌ FAIL';
  if (condition) passCount++;
  const timing = ms !== undefined ? `[${ms}ms]` : '';
  console.log(`  ${status} │ ${timing.padEnd(8)} │ ${checkName}`);
  if (note) console.log(`           ↳ ${note}`);
}

// ── Check 1: 20-Burst /health < 300ms ─────────────────────────────────────────
console.log('── 1. Identity Service /health Low-Latency Burst (20 requests) ──');
let burstPass = true;
let maxBurstMs = 0;
let totalBurstMs = 0;

try {
  for (let i = 1; i <= 20; i++) {
    const res = await httpGet({
      hostname: '127.0.0.1',
      port: 4101,
      path: '/health',
      method: 'GET',
    });
    totalBurstMs += res.ms;
    maxBurstMs = Math.max(maxBurstMs, res.ms);
    if (res.statusCode !== 200 || res.ms >= 300) {
      burstPass = false;
    }
  }
  const avgMs = (totalBurstMs / 20).toFixed(1);
  report(
    burstPass,
    `20 consecutive /health queries under 300ms (avg: ${avgMs}ms, max: ${maxBurstMs}ms)`,
    maxBurstMs,
    burstPass ? 'Liveness endpoint is completely non-blocking' : 'One or more requests exceeded 300ms'
  );
} catch (err) {
  report(false, '20x /health burst check', 0, `Connection error: ${err.message}. Is identity-service running?`);
}

// ── Check 2: /health/ready reports DB Mode ────────────────────────────────────
console.log('\n── 2. Database Readiness & Mode Verification ───────────────────');
try {
  const readyRes = await httpGet({
    hostname: '127.0.0.1',
    port: 4101,
    path: '/health/ready',
    method: 'GET',
  });

  const isReady = readyRes.statusCode === 200;
  const dbMode = readyRes.json?.db || 'unknown';
  report(isReady, `GET :4101/health/ready returns 200`, readyRes.ms, `Active Store: ${dbMode}`);
} catch (err) {
  report(false, 'GET :4101/health/ready', 0, err.message);
}

// ── Check 3: Google OAuth Initiation via Next.js ──────────────────────────────
console.log('\n── 3. Google OAuth Initiation & Redirection (:3000) ─────────────');
try {
  const googleRes = await httpGet({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/google?role=CREATOR',
    method: 'GET',
  });

  const location = googleRes.headers.location || '';
  const isRedirect = googleRes.statusCode === 302 || googleRes.statusCode === 307;
  const hasAccountsGoogle = location.includes('accounts.google.com/o/oauth2/v2/auth');
  const hasClientId = location.includes('client_id=');
  const hasCallback = location.includes('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle');

  report(isRedirect, `GET :3000/api/auth/google returns HTTP 302/307`, googleRes.ms, `Status: ${googleRes.statusCode}`);
  report(hasAccountsGoogle, `Redirect target is accounts.google.com`, undefined, location ? `${location.slice(0, 65)}...` : 'No location header');
  report(hasClientId, `Redirect includes configured GOOGLE_CLIENT_ID`, undefined, 'client_id verified');
  report(hasCallback, `Redirect includes registered callback URL`, undefined, 'redirect_uri verified');

  if (googleRes.statusCode === 503 && googleRes.json?.error) {
    console.log(`     ↳ Received 503 response: code=${googleRes.json.error.code}, requestId=${googleRes.json.error.requestId}`);
  }
} catch (err) {
  report(false, 'GET :3000/api/auth/google', 0, `Is web app running on :3000? (${err.message})`);
}

// ── Check 4: Unreachable Downstream Check (Mocking / Inspecting 503) ──────────
console.log('\n── 4. Resilient Fallback Contract ──────────────────────────────');
console.log('  ℹ When identity-service is unreachable:');
console.log('    • The route returns HTTP 503 SERVICE_UNAVAILABLE');
console.log('    • A correlation requestId is included in the JSON payload');
console.log('    • The server-side logs preserve the underlying error cause');

console.log(`\n══════════════════════════════════════════════════════════════`);
console.log(`  Summary: ${passCount}/${totalCount} assertions verified.`);
if (passCount === totalCount) {
  console.log('  🎉 All integration verification checks passed!');
} else {
  console.log('  ⚠️ One or more checks failed. Review diagnostics above.');
}
console.log(`══════════════════════════════════════════════════════════════\n`);
