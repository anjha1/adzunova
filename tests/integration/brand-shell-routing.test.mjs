import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BRAND_NAV_ITEMS } from '../../apps/web/src/components/brand/shell/brand-nav-config.ts';

test('Brand Shell - All 21 Navigation Routes Exist on Disk', () => {
  BRAND_NAV_ITEMS.forEach((item) => {
    // Convert /brand/<slug> to apps/web/src/app/brand/<slug>/page.tsx
    const routeSegment = item.href.replace('/brand/', '');
    const pagePath = path.resolve('apps/web/src/app/brand', routeSegment, 'page.tsx');

    assert.ok(
      fs.existsSync(pagePath),
      `Expected route page to exist at: ${pagePath} for route ${item.href}`
    );

    const content = fs.readFileSync(pagePath, 'utf8');
    assert.ok(
      content.includes('export default'),
      `Page ${pagePath} must have a default export`
    );
  });
});

test('Brand Shell - Layout and Server-Side Guard Exist', () => {
  const layoutPath = path.resolve('apps/web/src/app/brand/layout.tsx');
  assert.ok(fs.existsSync(layoutPath), 'apps/web/src/app/brand/layout.tsx must exist');

  const content = fs.readFileSync(layoutPath, 'utf8');
  assert.ok(content.includes('getSession'), 'Layout must check getSession() server-side');
  assert.ok(content.includes('BrandForbiddenView'), 'Layout must have 403 Forbidden view');
  assert.ok(content.includes('BrandShell'), 'Layout must wrap children with BrandShell');
  assert.ok(content.includes("user.role !== 'BRAND'"), 'Layout must verify user.role is BRAND');
});

test('Brand Shell - Dedicated 403 Forbidden Page Exists', () => {
  const forbiddenPath = path.resolve('apps/web/src/app/brand/403/page.tsx');
  assert.ok(fs.existsSync(forbiddenPath), 'apps/web/src/app/brand/403/page.tsx must exist');

  const content = fs.readFileSync(forbiddenPath, 'utf8');
  assert.ok(content.includes('Access Restricted'), '403 page must display Access Restricted');
  assert.ok(content.includes('Return to Creator Dashboard'), '403 page must offer link to creator dashboard');
});

test('Brand Shell - Component Ecosystem Completeness', () => {
  const componentFiles = [
    'brand-nav-config.ts',
    'brand-shell-icons.tsx',
    'brand-workspace-switcher.tsx',
    'brand-global-search.tsx',
    'brand-header.tsx',
    'brand-sidebar.tsx',
    'brand-mobile-bottom-nav.tsx',
    'brand-mobile-more-sheet.tsx',
    'brand-shell.tsx',
    'brand-page-container.tsx',
  ];

  componentFiles.forEach((file) => {
    const filePath = path.resolve('apps/web/src/components/brand/shell', file);
    assert.ok(fs.existsSync(filePath), `Shell component file must exist: ${filePath}`);
  });
});
