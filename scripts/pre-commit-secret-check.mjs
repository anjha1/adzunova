import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();

const SECRET_PATTERNS = [
  { name: 'RAZORPAY_LIVE_KEY', regex: /\brzp_live_[A-Za-z0-9]{8,}\b/g },
  { name: 'RAZORPAY_TEST_KEY', regex: /\brzp_test_[A-Za-z0-9]{8,}\b/g },
  { name: 'MONGODB_URI_CREDENTIALS', regex: /mongodb(?:\+srv)?:\/\/[^/\s:@]+:[^/\s@]+@[^\s'"]+/g },
  { name: 'PEM_PRIVATE_KEY', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { name: 'AWS_ACCESS_KEY_ID', regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  {
    name: 'HARDCODED_SECRET_ASSIGNMENT',
    regex: /\b[A-Z0-9_]*(?:SECRET|API_KEY|ACCESS_KEY|AUTH_TOKEN|PRIVATE_KEY)[A-Z0-9_]*\s*[:=]\s*['"][A-Za-z0-9+/=_-]{24,}['"]/g,
  },
];

const SERVER_ONLY_ENV_NAMES = [
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'MONGODB_URI',
  'R2_DEV_SECRET_ACCESS_KEY',
  'R2_DEV_ACCESS_KEY_ID',
  'INTERNAL_SERVICE_SECRET',
  'JWT_SECRET',
  'SESSION_SECRET',
];

function loadEnvSecretsInMemory() {
  const secrets = new Map();
  for (const envName of ['.env', '.env.local', '.env.production', '.env.development']) {
    const full = path.join(ROOT, envName);
    if (!fs.existsSync(full)) continue;
    const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (
        val.length >= 12 &&
        /(SECRET|KEY|TOKEN|PASSWORD|URI)/i.test(key) &&
        !key.startsWith('NEXT_PUBLIC_') &&
        !/^(off|false|true|localhost)/i.test(val) &&
        !/^https?:\/\/[^@]+$/i.test(val) &&
        !/(placeholder|example|changeme|your_|replace_with|dummy|dev_only|test_secret|dev_secret|mock|sample|fake|local|123456|000000)/i.test(val) &&
        !val.startsWith('mongodb://127.0.0.1') &&
        !val.startsWith('mongodb://localhost')
      ) {
        secrets.set(key, val);
      }
    }
  }
  return secrets;
}

function walkDir(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkDir(full, exts));
    } else if (!exts || exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

export function scanContentForSecrets(content, relPath, envSecrets = new Map(), options = {}) {
  const violations = [];
  const allowPlaceholder = Boolean(options.allowTestPlaceholders);

  for (const rule of SECRET_PATTERNS) {
    rule.regex.lastIndex = 0;
    const matches = content.match(rule.regex);
    if (!matches) continue;
    if (allowPlaceholder) {
      // Even in tests, real env secret values are never allowed
      continue;
    }
    violations.push({ file: relPath, rule: rule.name });
  }

  for (const [keyName, secretVal] of envSecrets.entries()) {
    if (content.includes(secretVal)) {
      violations.push({ file: relPath, rule: `LEAKED_ENV_VALUE:${keyName}` });
    }
  }

  return violations;
}

export function runSecretCheck(rootDir = ROOT) {
  const violations = [];

  // 1. Check .env files are not git-tracked
  let trackedFiles = [];
  try {
    const out = execSync('git ls-files', { cwd: rootDir, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    trackedFiles = out.split(/\r?\n/).filter(Boolean);
  } catch {
    trackedFiles = [];
  }

  for (const tf of trackedFiles) {
    const base = path.basename(tf);
    if (base === '.env' || (base.startsWith('.env.') && base !== '.env.example' && !base.endsWith('.example'))) {
      violations.push({ file: tf, rule: 'TRACKED_ENV_FILE' });
    }
  }

  const envSecrets = loadEnvSecretsInMemory();

  // 2. Scan tracked files
  for (const tf of trackedFiles) {
    const full = path.join(rootDir, tf);
    if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) continue;
    if (/\.(png|jpg|jpeg|webp|gif|ico|pdf|woff2?|ttf|eot|lock|zip)$/i.test(tf)) continue;
    const content = fs.readFileSync(full, 'utf8');
    const isTestOrFixture =
      tf === '.env.example' ||
      tf.endsWith('.env.example') ||
      tf.startsWith('tests/') ||
      tf.includes('.test.') ||
      tf.includes('.spec.') ||
      tf === 'scripts/pre-commit-secret-check.mjs';
    violations.push(
      ...scanContentForSecrets(content, tf, envSecrets, {
        allowTestPlaceholders: isTestOrFixture,
      })
    );
  }

  // 3. Scan docs/ and tests/fixtures/ even if untracked
  for (const extraDir of ['docs', 'tests/fixtures']) {
    for (const full of walkDir(path.join(rootDir, extraDir))) {
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      if (/\.(png|jpg|jpeg|webp|gif|ico|pdf)$/i.test(rel)) continue;
      const content = fs.readFileSync(full, 'utf8');
      violations.push(...scanContentForSecrets(content, rel, envSecrets, { allowTestPlaceholders: false }));
    }
  }

  // 4. Scan built client bundle apps/web/.next/static for secrets & server-only env names
  const nextStaticDir = path.join(rootDir, 'apps', 'web', '.next', 'static');
  for (const full of walkDir(nextStaticDir, ['.js', '.css', '.json'])) {
    const rel = path.relative(rootDir, full).replace(/\\/g, '/');
    const content = fs.readFileSync(full, 'utf8');
    violations.push(...scanContentForSecrets(content, rel, envSecrets, { allowTestPlaceholders: false }));
    for (const serverVar of SERVER_ONLY_ENV_NAMES) {
      if (content.includes(serverVar)) {
        violations.push({ file: rel, rule: `CLIENT_BUNDLE_SERVER_ENV_NAME:${serverVar}` });
      }
    }
  }

  // Deduplicate by file+rule
  const seen = new Set();
  const unique = [];
  for (const v of violations) {
    const k = `${v.file}::${v.rule}`;
    if (!seen.has(k)) {
      seen.add(k);
      unique.push(v);
    }
  }

  return { ok: unique.length === 0, violations: unique };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

if (isMain) {
  const res = runSecretCheck(ROOT);
  if (!res.ok) {
    console.error('[secret-check] FAILED:');
    for (const v of res.violations) {
      console.error(`  - ${v.file} [${v.rule}]`);
    }
    process.exit(1);
  }
  console.log('[secret-check] PASS: 0 secret/env leaks detected.');
}
