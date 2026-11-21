import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRAND_NAV_SECTIONS,
  BRAND_NAV_ITEMS,
  MOBILE_BRAND_PRIMARY_TABS,
  getFilteredBrandNavItems,
  getActiveBrandRoute,
} from '../../apps/web/src/components/brand/shell/brand-nav-config.ts';

test('Brand Navigation Configuration - Section Integrity', () => {
  const sectionIds = BRAND_NAV_SECTIONS.map((s) => s.id);
  assert.deepEqual(sectionIds, [
    'main',
    'work',
    'finance',
    'insights',
    'trust',
    'workspace',
    'support',
  ]);

  // Ensure every item belongs to a valid section
  BRAND_NAV_ITEMS.forEach((item) => {
    assert.ok(
      sectionIds.includes(item.section),
      `Item ${item.title} has invalid section: ${item.section}`
    );
    assert.ok(item.href.startsWith('/brand/'), `Item ${item.title} must link to /brand/*`);
    assert.ok(item.iconName.length > 0, `Item ${item.title} must specify an iconName`);
  });
});

test('Brand Navigation - Longest-Prefix Active Route Matching', () => {
  // Exact match
  assert.equal(getActiveBrandRoute('/brand/dashboard'), '/brand/dashboard');
  assert.equal(getActiveBrandRoute('/brand/discover'), '/brand/discover');
  assert.equal(getActiveBrandRoute('/brand/campaigns'), '/brand/campaigns');
  assert.equal(getActiveBrandRoute('/brand/finance'), '/brand/finance');

  // Sub-routes prefix matching
  assert.equal(getActiveBrandRoute('/brand/campaigns/new'), '/brand/campaigns');
  assert.equal(getActiveBrandRoute('/brand/campaigns/cmp_123/milestones'), '/brand/campaigns');
  assert.equal(getActiveBrandRoute('/brand/discover/creators/cr_456'), '/brand/discover');
  assert.equal(getActiveBrandRoute('/brand/settings/billing'), '/brand/settings');

  // Fallbacks
  assert.equal(getActiveBrandRoute(null), '/brand/dashboard');
  assert.equal(getActiveBrandRoute(''), '/brand/dashboard');
  assert.equal(getActiveBrandRoute('/unknown/route'), '');
});

test('Brand Navigation - Role-Based Permission Filtering', () => {
  // OWNER role has access to all non-flagged routes
  const ownerItems = getFilteredBrandNavItems('OWNER', {});
  const ownerHrefs = ownerItems.map((i) => i.href);
  assert.ok(ownerHrefs.includes('/brand/dashboard'));
  assert.ok(ownerHrefs.includes('/brand/finance'));
  assert.ok(ownerHrefs.includes('/brand/team'));
  assert.ok(ownerHrefs.includes('/brand/contracts'));

  // FINANCE role only sees FINANCE and general routes, NOT team or brand safety
  const financeItems = getFilteredBrandNavItems('FINANCE', {});
  const financeHrefs = financeItems.map((i) => i.href);
  assert.ok(financeHrefs.includes('/brand/finance'));
  assert.ok(financeHrefs.includes('/brand/invoices'));
  assert.ok(financeHrefs.includes('/brand/budgets'));
  assert.ok(!financeHrefs.includes('/brand/team'), 'Finance role should not access Team & Roles');
  assert.ok(!financeHrefs.includes('/brand/safety'), 'Finance role should not access Brand Safety');

  // LEGAL role sees Contracts, Disputes, Audit Log, but NOT Finance or Team
  const legalItems = getFilteredBrandNavItems('LEGAL', {});
  const legalHrefs = legalItems.map((i) => i.href);
  assert.ok(legalHrefs.includes('/brand/contracts'));
  assert.ok(legalHrefs.includes('/brand/disputes'));
  assert.ok(legalHrefs.includes('/brand/audit-log'));
  assert.ok(!legalHrefs.includes('/brand/finance'), 'Legal role should not access Wallet & Escrow');
  assert.ok(!legalHrefs.includes('/brand/team'), 'Legal role should not access Team');

  // VIEWER role has read access to dashboard, discover, campaigns, offers, contracts, content-review
  const viewerItems = getFilteredBrandNavItems('VIEWER', {});
  const viewerHrefs = viewerItems.map((i) => i.href);
  assert.ok(viewerHrefs.includes('/brand/dashboard'));
  assert.ok(viewerHrefs.includes('/brand/campaigns'));
  assert.ok(viewerHrefs.includes('/brand/contracts'));
  assert.ok(!viewerHrefs.includes('/brand/team'));
  assert.ok(!viewerHrefs.includes('/brand/finance'));
});

test('Brand Navigation - Feature Flag Gating for Messages', () => {
  // Without flag: Messages is hidden
  const withoutFlag = getFilteredBrandNavItems('OWNER', {});
  assert.ok(!withoutFlag.some((i) => i.href === '/brand/messages'));

  // With flag enabled: Messages is visible
  const withFlag = getFilteredBrandNavItems('OWNER', {
    NEXT_PUBLIC_ENABLE_BRAND_MESSAGES: true,
  });
  assert.ok(withFlag.some((i) => i.href === '/brand/messages'));
});

test('Brand Mobile Navigation - Primary Tabs Definition', () => {
  assert.equal(MOBILE_BRAND_PRIMARY_TABS.length, 5);
  const titles = MOBILE_BRAND_PRIMARY_TABS.map((t) => t.title);
  assert.deepEqual(titles, ['Home', 'Discover', 'Campaigns', 'Finance', 'More']);
});
