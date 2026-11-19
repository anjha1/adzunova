import fs from 'fs';
import path from 'path';

const files = [
  'apps/web/src/app/creator/layout.tsx',
  'apps/web/src/app/creator/accounts/page.tsx',
  'apps/web/src/app/creator/affiliate/page.tsx',
  'apps/web/src/app/creator/analytics/page.tsx',
  'apps/web/src/app/creator/analytics/trends/page.tsx',
  'apps/web/src/app/creator/availability/page.tsx',
  'apps/web/src/app/creator/campaigns/page.tsx',
  'apps/web/src/app/creator/content/page.tsx',
  'apps/web/src/app/creator/contracts/page.tsx',
  'apps/web/src/app/creator/dashboard/page.tsx',
  'apps/web/src/app/creator/earnings/page.tsx',
  'apps/web/src/app/creator/growth/page.tsx',
  'apps/web/src/app/creator/media-kit/page.tsx',
  'apps/web/src/app/creator/messages/page.tsx',
  'apps/web/src/app/creator/offers/page.tsx',
  'apps/web/src/app/creator/onboarding/page.tsx',
  'apps/web/src/app/creator/packages/page.tsx',
  'apps/web/src/app/creator/profile/page.tsx',
  'apps/web/src/app/creator/rate-card/page.tsx',
  'apps/web/src/app/creator/referrals/page.tsx',
  'apps/web/src/app/creator/reviews/page.tsx',
  'apps/web/src/app/creator/settings/page.tsx',
  'apps/web/src/app/creator/subscription/page.tsx',
  'apps/web/src/app/creator/support/page.tsx',
  'apps/web/src/app/creator/trust/page.tsx',
  'apps/web/src/components/creator/module-placeholder.tsx',
  'apps/web/src/components/creator/shell/creator-header.tsx',
  'apps/web/src/components/creator/shell/creator-shell.tsx',
  'apps/web/src/components/creator/shell/creator-sidebar.tsx',
  'apps/web/src/components/creator/shell/mobile-bottom-nav.tsx',
  'apps/web/src/components/creator/shell/mobile-more-sheet.tsx',
  'apps/web/src/components/creator/shell/nav-config.ts',
  'apps/web/src/components/creator/shell/shell-icons.tsx',
  'apps/web/src/components/creator/ui/empty-state.tsx',
  'apps/web/src/components/creator/ui/error-state.tsx',
  'apps/web/src/components/creator/ui/money.tsx',
  'apps/web/src/components/creator/ui/page-header.tsx',
  'apps/web/src/components/creator/ui/stat-card.tsx',
  'apps/web/src/components/creator/ui/status-badge.tsx',
];

const patterns = [
  { name: 'Fake Brands', regex: /Nordic Audio|FitPro/i },
  { name: 'Fake Persons', regex: /Rohan Sharma|Priya Patel|Achhuta Creative|Alex Rivera/i },
  { name: 'Fake Metric Numbers', regex: /482\.5K|1\.24M|4\.92%|94 \/ 100|98 \/ 100|10615000|3115000|6500000|3500000/ },
  { name: 'Fixed Dates', regex: /November 2026|Nov \d+|Oct \d+/ },
  { name: 'Claims without backend', regex: /escrow protect|fine-tuned|encrypted|Zero-risk|Double-entry ledger verified|100% Escrow|Statutory TDS Withholding|Section 194J/i },
  { name: 'Fixed Demographic percentages', regex: /India \(Tier 1|United States|18-24 years/ },
  { name: 'Hardcoded Plan Prices / Rates', regex: /₹1,499|₹1,899|2\.0% Volume/ },
  { name: 'Hardcoded Color Utility', regex: /\b(bg-white|bg-black|text-slate-\d+|bg-slate-\d+|border-slate-\d+|text-gray-\d+|border-gray-\d+|#[0-9a-fA-F]{3,6}|rgb\()/ }
];

console.log('# Audit summary\n');

for (const rel of files) {
  const full = path.resolve(rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  const lines = content.split('\n');

  const findings = [];
  lines.forEach((line, idx) => {
    for (const pat of patterns) {
      if (pat.regex.test(line)) {
        findings.push({ lineNum: idx + 1, type: pat.name, match: line.trim() });
      }
    }
  });

  if (findings.length > 0) {
    console.log(`### ${rel} (${findings.length} findings)`);
    findings.slice(0, 5).forEach(f => {
      console.log(`- L${f.lineNum} [${f.type}]: ${f.match.slice(0, 80)}`);
    });
    if (findings.length > 5) {
      console.log(`- ... and ${findings.length - 5} more`);
    }
    console.log('');
  }
}
