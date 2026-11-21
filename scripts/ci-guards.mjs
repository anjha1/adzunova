import fs from 'fs';
import path from 'path';

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

if (failed) {
  console.error('\n[CI Guard] FAILED. Fix violations above before proceeding.');
  process.exit(1);
} else {
  console.log('\n[CI Guard] ALL CHECKS PASSED.');
  process.exit(0);
}
