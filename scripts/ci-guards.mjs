import fs from 'fs';
import path from 'path';
import { checkStorageGuardRulesForFile } from './storage-guard-rules.mjs';

let failed = false;

function getAllFiles(dir, exts = ['.tsx', '.ts']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(full, exts));
    } else if (exts.includes(path.extname(item.name))) {
      files.push(full);
    }
  }
  return files;
}

const creatorAppDir = path.resolve('apps/web/src/app/creator');
const creatorCompDir = path.resolve('apps/web/src/components/creator');
const brandAppDir = path.resolve('apps/web/src/app/brand');
const brandCompDir = path.resolve('apps/web/src/components/brand');

const allAuditedFiles = [
  ...getAllFiles(creatorAppDir),
  ...getAllFiles(creatorCompDir),
  ...getAllFiles(brandAppDir),
  ...getAllFiles(brandCompDir),
];
const allAuditedPageFiles = [
  ...getAllFiles(creatorAppDir),
  ...getAllFiles(brandAppDir),
];

console.log(`[CI Guard] Checking ${allAuditedFiles.length} files (creator & brand)...\n`);

// Guard (a): Hardcoded color utilities in creator & brand code
console.log('--- Guard (a): Hardcoded Color Utilities & Hex ---');
const colorRegex = /\b(bg-white|bg-black|bg-slate-\d+|text-slate-\d+|border-slate-\d+|text-gray-\d+|border-gray-\d+|#[0-9a-fA-F]{3,6}|rgb\()/;
let colorViolations = 0;

for (const file of allAuditedFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // ignore comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    const match = line.match(colorRegex);
    if (match) {
      console.error(`  FAIL [Hardcoded Color]: ${path.relative(process.cwd(), file)}:${idx + 1} found "${match[0]}"`);
      colorViolations++;
      failed = true;
    }
  });
}
if (colorViolations === 0) {
  console.log('  PASS: Zero hardcoded color utilities found.\n');
} else {
  console.error(`  FAIL: Found ${colorViolations} hardcoded color utilities.\n`);
}

// Guard (b): Imports from mock/fixtures/sample paths in app/creator/** and app/brand/**
console.log('--- Guard (b): Forbidden Mock/Fixture/Sample Imports in app/(creator|brand)/** ---');
const mockImportRegex = /from\s+['"][^'"]*(mock|fixtures|sample)[^'"]*['"]/;
let mockImportViolations = 0;

for (const file of allAuditedPageFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (mockImportRegex.test(line)) {
      console.error(`  FAIL [Mock Import]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      mockImportViolations++;
      failed = true;
    }
  });
}
if (mockImportViolations === 0) {
  console.log('  PASS: Zero mock/fixture/sample imports found.\n');
} else {
  console.error(`  FAIL: Found ${mockImportViolations} mock import violations.\n`);
}

// Guard (c): Deny-list grep of forbidden strings
console.log('--- Guard (c): Forbidden Deny-List Strings in app/(creator|brand)/** ---');
const denyList = [
  'Lorem',
  'Coming soon',
  'Phase 2',
  'demo',
  'mock',
  'sample',
  '98/100',
  '₹1,499',
  '194J',
  'fine-tuned',
  'Zero-risk',
  'escrow protected',
  '25,000',
  'Corporate Verified',
  'Institutional',
  'custodial',
  'Playbook',
  'automate escrow',
  'badgeText="ENTERPRISE"',
  '>Enterprise<',
  '(Enterprise)',
];

let denyViolations = 0;
for (const file of allAuditedPageFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const term of denyList) {
      // Use word boundary for words, literal includes for phrases
      const regex = term.includes(' ') || term.includes('/') || term.includes('₹') || term.includes('=') || term.includes('>') || term.includes('(')
        ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        : new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(line)) {
        console.error(`  FAIL [Deny-list string "${term}"]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
        denyViolations++;
        failed = true;
      }
    }
  });
}
if (denyViolations === 0) {
  console.log('  PASS: Zero deny-list strings found.\n');
} else {
  console.error(`  FAIL: Found ${denyViolations} deny-list violations.\n`);
}

// Guard (d): Number-literal heuristic lint for JSX text nodes in creator & brand pages
console.log('--- Guard (d): Unexplained Digits in JSX Text Nodes in app/(creator|brand)/** ---');
// Match raw JSX text with digits like >482.5K<, >1.24M<, >1420<, >94 / 100<
const unexplainedNumberRegex = />\s*(\d+(\.\d+)?([KkMm%])?)\s*</;
let numberViolations = 0;
for (const file of allAuditedPageFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    const match = line.match(unexplainedNumberRegex);
    if (match) {
      // Allow 0 or — or standard zero states
      if (match[1] === '0') return;
      console.error(`  FAIL [Unexplained JSX Number Literal]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      numberViolations++;
      failed = true;
    }
  });
}
if (numberViolations === 0) {
  console.log('  PASS: Zero unexplained JSX number literals found.\n');
} else {
  console.error(`  FAIL: Found ${numberViolations} unexplained JSX number literal violations.\n`);
}

// Guard (e): Forbidden Meta Graph Messaging Endpoints & Webhooks
console.log('--- Guard (e): Forbidden Meta Messaging Endpoints & Webhooks in apps/web/src/** ---');
const allWebSourceFiles = getAllFiles(path.resolve('apps/web/src'), ['.ts', '.tsx', '.js', '.mjs']);
const forbiddenMessagingPatterns = [
  { name: 'Meta Graph Messaging Edge', regex: /graph\.facebook\.com\/[^'"`]*\/(conversations|messages|inbox|threads)\b/i },
  { name: 'Meta Graph Messaging Edge Template', regex: /\/\$\{[^}]+\}\/(conversations|messages|threads)\b/ },
  { name: 'Meta Messaging Webhook: message_reactions', regex: /\bmessage_reactions\b/ },
  { name: 'Meta Messaging Webhook: messaging_postbacks', regex: /\bmessaging_postbacks\b/ },
  { name: 'Meta Messaging Webhook: messaging_optins', regex: /\bmessaging_optins\b/ },
  { name: 'Meta Messaging Webhook: messaging_referral', regex: /\bmessaging_referral\b/ },
  { name: 'Meta Messaging Webhook: messaging_seen', regex: /\bmessaging_seen\b/ },
  { name: 'Meta Messaging Webhook: message_reads', regex: /\bmessage_reads\b/ },
  { name: 'Meta Messaging Webhook: message_echoes', regex: /\bmessage_echoes\b/ },
  { name: 'Meta Standby Webhook: standby', regex: /\bstandby\b/ },
];

let messagingViolations = 0;
for (const file of allWebSourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const pattern of forbiddenMessagingPatterns) {
      if (pattern.regex.test(line)) {
        console.error(`  FAIL [Forbidden Messaging Reference "${pattern.name}"]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
        messagingViolations++;
        failed = true;
      }
    }
  });
}
if (messagingViolations === 0) {
  console.log(`  PASS: Zero forbidden Meta messaging references across ${allWebSourceFiles.length} files.\n`);
} else {
  console.error(`  FAIL: Found ${messagingViolations} forbidden Meta messaging references.\n`);
}

// Guard (f): Stock Photo URLs in apps/web/src/** (outside detection deny-list)
console.log('--- Guard (f): Stock Photo URLs in apps/web/src/** ---');
const stockPhotoDomains = [
  'images.unsplash.com',
  'unsplash.com',
  'images.pexels.com',
  'pexels.com',
  'pixabay.com',
  'picsum.photos',
  'dicebear.com',
  'randomuser.me',
  'placeholder.com',
];
let stockPhotoViolations = 0;
for (const file of allWebSourceFiles) {
  // Allow formatters.ts which defines the detection deny-list
  if (file.endsWith('formatters.ts')) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const domain of stockPhotoDomains) {
      if (line.includes(domain)) {
        console.error(`  FAIL [Stock Photo URL "${domain}"]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
        stockPhotoViolations++;
        failed = true;
      }
    }
  });
}
if (stockPhotoViolations === 0) {
  console.log(`  PASS: Zero stock photo URLs found across ${allWebSourceFiles.length} files.\n`);
} else {
  console.error(`  FAIL: Found ${stockPhotoViolations} stock photo URL violations.\n`);
}

// Guard (g): Synthesized Profile Seed & Fake Fallback Profiles
console.log('--- Guard (g): Zero Synthetic Demo Seeds in apps/web/src/** ---');
const syntheticSeedPatterns = [
  /\bseedDemoProfile\b/,
  /\bgetInitialDefaultSeedItems\b/,
  /Industry benchmark standard/i,
  /100% Platform Verified/i,
];
let seedViolations = 0;
for (const file of allWebSourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    for (const pattern of syntheticSeedPatterns) {
      if (pattern.test(line)) {
        console.error(`  FAIL [Synthetic Seed Violation]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
        seedViolations++;
        failed = true;
      }
    }
  });
}
if (seedViolations === 0) {
  console.log(`  PASS: Zero synthetic seeds or benchmark fabrications found.\n`);
} else {
  console.error(`  FAIL: Found ${seedViolations} synthetic seed violations.\n`);
}

// Guard (h): Verification Date Integrity (Zero Render-Time new Date() formatted as Verification Date)
console.log('--- Guard (h): Verification Date Integrity in apps/web/src/** ---');
let dateViolations = 0;
const publicRenderFiles = [
  ...getAllFiles(path.resolve('apps/web/src/app/c')),
  ...getAllFiles(path.resolve('apps/web/src/components/creator/public-profile')),
  ...getAllFiles(path.resolve('apps/web/src/app/brand/discover')),
];
for (const file of publicRenderFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    // Check if new Date() is being called directly inline inside "Verified on" or "Verified via"
    if (/Verified.*new Date\(\)/i.test(line) || /new Date\(\).*Verified/i.test(line)) {
      console.error(`  FAIL [Render-time verification date]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      dateViolations++;
      failed = true;
    }
  });
}
if (dateViolations === 0) {
  console.log(`  PASS: Zero render-time fake verification dates found in public render paths.\n`);
} else {
  console.error(`  FAIL: Found ${dateViolations} fake verification date violations.\n`);
}

// Guard (i): Discovery Read Model Integrity (Zero faker / Math.random in discovery & rate card logic)
console.log('--- Guard (i): Discovery Read Model & Rate Card Logic Integrity ---');
const coreTruthFiles = [
  ...getAllFiles(path.resolve('apps/web/src/lib/discovery')),
  ...getAllFiles(path.resolve('apps/web/src/lib/public-profile')),
  ...getAllFiles(path.resolve('apps/web/src/lib/rate-card')),
];
let coreTruthViolations = 0;
for (const file of coreTruthFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (/\bMath\.random\(\)/.test(line)) {
      console.error(`  FAIL [Randomized Metric]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      coreTruthViolations++;
      failed = true;
    }
    if (/\bfaker\b/.test(line)) {
      console.error(`  FAIL [Faker Import/Call]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      coreTruthViolations++;
      failed = true;
    }
  });
}
if (coreTruthViolations === 0) {
  console.log(`  PASS: Zero random metrics or faker calls in discovery & public profile engines.\n`);
} else {
  console.error(`  FAIL: Found ${coreTruthViolations} truth violations in discovery logic.\n`);
}

// Guard (j): No literal deployment hostnames in non-test source files
console.log('--- Guard (j): Zero Literal Deployment Hostnames in Non-Test Source ---');
const serviceDirs = fs.existsSync(path.resolve('services'))
  ? fs.readdirSync(path.resolve('services'), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.resolve('services', d.name, 'src'))
  : [];
const nonTestSrcFiles = [
  ...allWebSourceFiles,
  ...serviceDirs.flatMap((d) => getAllFiles(d, ['.ts', '.tsx', '.js', '.mjs'])),
];
const literalHostnameRegex = /https?:\/\/[^\s'"`]*(adzunova\.tech|adzunova\.com|onrender\.com)/i;
let hostnameViolations = 0;
for (const file of nonTestSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (literalHostnameRegex.test(line)) {
      console.error(`  FAIL [Literal Hostname]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      hostnameViolations++;
      failed = true;
    }
  });
}
if (hostnameViolations === 0) {
  console.log(`  PASS: Zero literal deployment hostnames across ${nonTestSrcFiles.length} non-test source files.\n`);
} else {
  console.error(`  FAIL: Found ${hostnameViolations} literal deployment hostname violations.\n`);
}

// Guard (k): Forbidden YouTube Write / Monetary Scopes
console.log('--- Guard (k): Zero Forbidden YouTube Write or Monetary Scopes ---');
const forbiddenYouTubeScopeRegex = /(yt-analytics-monetary\.readonly|auth\/youtube\.force-ssl|auth\/youtube\.upload|auth\/youtubepartner|auth\/youtube['"\s])/i;
let ytScopeViolations = 0;
for (const file of nonTestSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (forbiddenYouTubeScopeRegex.test(line)) {
      console.error(`  FAIL [Forbidden YouTube Scope]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${line.trim()}`);
      ytScopeViolations++;
      failed = true;
    }
  });
}
if (ytScopeViolations === 0) {
  console.log(`  PASS: Zero YouTube write or monetary scopes across ${nonTestSrcFiles.length} non-test source files.\n`);
} else {
  console.error(`  FAIL: Found ${ytScopeViolations} forbidden YouTube scope violations.\n`);
}

// Guard (l): Storage S0-S12 Security, Truth & Precision Guards
console.log('--- Guard (l): Storage S0-S12 Rules (r2.dev, client secrets, claims, logging, float bytes) ---');
let storageGuardViolations = 0;
for (const file of nonTestSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const violations = checkStorageGuardRulesForFile(file, content);
  for (const v of violations) {
    console.error(`  FAIL [Storage "${v.rule}"]: ${path.relative(process.cwd(), file)}:${v.line}: ${v.snippet}`);
    storageGuardViolations++;
    failed = true;
  }
}
if (storageGuardViolations === 0) {
  console.log(`  PASS: Zero storage guard violations across ${nonTestSrcFiles.length} non-test source files.\n`);
} else {
  console.error(`  FAIL: Found ${storageGuardViolations} storage guard violations.\n`);
}

// Guard (m): Payments M1-M9 Security, Truth, Live-Probe & Precision Guards
console.log('--- Guard (m): Payments Rules (no test stubs in prod, no client secrets, no float money, no secret logging) ---');
let paymentGuardViolations = 0;
for (const file of nonTestSrcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const normPath = file.replace(/\\/g, '/');
  const isClient = content.includes("'use client'") || content.includes('"use client"');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    if (/PaymentProviderStub|InMemoryPayment/i.test(line)) {
      console.error(`  FAIL [Payment Stub in Prod]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${t}`);
      paymentGuardViolations++;
      failed = true;
    }
    if (isClient && /(RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET|rzp_live_)/.test(line)) {
      console.error(`  FAIL [Payment Secret in Client]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${t}`);
      paymentGuardViolations++;
      failed = true;
    }
    if (/console\.(log|info|warn|error)\(/.test(line) && /(keySecret|webhookSecret|RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET)/.test(line)) {
      console.error(`  FAIL [Payment Secret Logged]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${t}`);
      paymentGuardViolations++;
      failed = true;
    }
    if (normPath.includes('/payments/') && /Math\.(round|floor|ceil)\(/.test(line)) {
      console.error(`  FAIL [Float Money Math]: ${path.relative(process.cwd(), file)}:${idx + 1}: ${t}`);
      paymentGuardViolations++;
      failed = true;
    }
  });
}
if (paymentGuardViolations === 0) {
  console.log(`  PASS: Zero payment guard violations across ${nonTestSrcFiles.length} non-test source files.\n`);
} else {
  console.error(`  FAIL: Found ${paymentGuardViolations} payment guard violations.\n`);
}

if (failed) {
  console.error('\n[CI Guard] FAILED. Fix violations above before proceeding.');
  process.exit(1);
} else {
  console.log('\n[CI Guard] ALL CHECKS PASSED.');
  process.exit(0);
}
