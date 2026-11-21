import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkPermission,
  isIpAllowed,
  isTwoFactorCompliant,
  DEFAULT_ROLE_PERMISSIONS,
} from '../../services/identity-service/src/domain/services/workspace-rbac-service.ts';

test('Workspace RBAC: Role Permissions Matrix', async (t) => {
  const baseMember = {
    workspaceId: 'ws_enterprise_1',
    userId: 'user_cm_1',
    email: 'campaigns@nike.co.in',
    status: 'ACTIVE',
    brandIds: [],
    joinedAt: new Date(),
    updatedAt: new Date(),
  };

  await t.test('Campaign Manager has permissions to draft campaigns but cannot release payments', () => {
    const cm = { ...baseMember, role: 'CAMPAIGN_MANAGER' };

    const launchRes = checkPermission({ member: cm, action: 'campaign:create' });
    assert.equal(launchRes.allowed, true);

    const paymentRes = checkPermission({ member: cm, action: 'payment:release' });
    assert.equal(paymentRes.allowed, false);
    assert.match(paymentRes.reason || '', /lacks permission/i);
  });

  await t.test('Finance has permissions to release payments and view audit logs', () => {
    const fin = { ...baseMember, role: 'FINANCE' };

    const payRes = checkPermission({ member: fin, action: 'payment:release' });
    assert.equal(payRes.allowed, true);

    const auditRes = checkPermission({ member: fin, action: 'audit:read' });
    assert.equal(auditRes.allowed, true);

    const campaignCreate = checkPermission({ member: fin, action: 'campaign:create' });
    assert.equal(campaignCreate.allowed, false);
  });

  await t.test('Viewer has strictly read-only permissions across campaigns and bookings', () => {
    const viewer = { ...baseMember, role: 'VIEWER' };

    assert.equal(checkPermission({ member: viewer, action: 'campaign:read' }).allowed, true);
    assert.equal(checkPermission({ member: viewer, action: 'booking:read' }).allowed, true);
    assert.equal(checkPermission({ member: viewer, action: 'booking:create' }).allowed, false);
    assert.equal(checkPermission({ member: viewer, action: 'team:invite' }).allowed, false);
  });

  await t.test('Owner has superuser permissions across all workspace actions', () => {
    const owner = { ...baseMember, role: 'OWNER' };
    assert.equal(checkPermission({ member: owner, action: 'settings:manage' }).allowed, true);
    assert.equal(checkPermission({ member: owner, action: 'team:remove' }).allowed, true);
    assert.equal(checkPermission({ member: owner, action: 'payment:release' }).allowed, true);
  });
});

test('Workspace Multi-Brand Agency Scoping (ABAC Isolation)', async (t) => {
  const agencyMember = {
    workspaceId: 'ws_agency_ogilvy',
    userId: 'user_media_buyer',
    email: 'buyer@ogilvy.co.in',
    role: 'CAMPAIGN_MANAGER',
    status: 'ACTIVE',
    brandIds: ['brand_nike_in', 'brand_cadbury_in'], // Scoped only to Nike and Cadbury
    joinedAt: new Date(),
    updatedAt: new Date(),
  };

  await t.test('allows action when resource belongs to an assigned client brand', () => {
    const res = checkPermission({
      member: agencyMember,
      action: 'campaign:create',
      resource: { brandId: 'brand_nike_in' },
    });
    assert.equal(res.allowed, true);
  });

  await t.test('strictly blocks action when resource belongs to an unassigned client brand', () => {
    const res = checkPermission({
      member: agencyMember,
      action: 'campaign:create',
      resource: { brandId: 'brand_samsung_in' }, // Not in member brandIds
    });
    assert.equal(res.allowed, false);
    assert.match(res.reason || '', /restricted/i);
  });
});

test('Workspace ABAC: Approval Limits & Financial Thresholds', async (t) => {
  const memberWithLimit = {
    workspaceId: 'ws_corp_1',
    userId: 'user_marketing_lead',
    email: 'lead@tata.com',
    role: 'CAMPAIGN_MANAGER',
    status: 'ACTIVE',
    brandIds: [],
    approvalLimitMinor: 5000000, // ₹50,000 limit
    joinedAt: new Date(),
    updatedAt: new Date(),
  };

  await t.test('permits booking below limit without triggering approval workflow', () => {
    const res = checkPermission({
      member: memberWithLimit,
      action: 'booking:create',
      resource: { amountMinor: 4000000 }, // ₹40,000
    });
    assert.equal(res.allowed, true);
    assert.equal(res.requiresApproval, undefined);
  });

  await t.test('triggers mandatory approval workflow when amount exceeds approval limit', () => {
    const res = checkPermission({
      member: memberWithLimit,
      action: 'booking:create',
      resource: { amountMinor: 15000000 }, // ₹1,50,000 > ₹50,000
    });
    assert.equal(res.allowed, true);
    assert.equal(res.requiresApproval, true);
    assert.equal(res.approverRole, 'FINANCE');
    assert.match(res.approvalReason || '', /exceeds member approval limit/i);
  });
});

test('Enterprise Security: IP Allowlist & 2FA Enforcement', async (t) => {
  await t.test('validates exact and CIDR block IP allowlisting', () => {
    const allowlist = ['198.51.100.25', '10.0.0.0/8', '192.168.1.0/24'];

    assert.equal(isIpAllowed('198.51.100.25', allowlist), true);
    assert.equal(isIpAllowed('10.50.12.99', allowlist), true);
    assert.equal(isIpAllowed('192.168.1.42', allowlist), true);

    // Blocked IPs
    assert.equal(isIpAllowed('198.51.100.26', allowlist), false);
    assert.equal(isIpAllowed('172.16.0.1', allowlist), false);
    assert.equal(isIpAllowed('203.0.113.195', allowlist), false);
  });

  await t.test('evaluates workspace 2FA compliance', () => {
    const enforcedWorkspace = { twoFactorRequired: true };
    const optionalWorkspace = { twoFactorRequired: false };

    assert.equal(isTwoFactorCompliant({ twoFactorEnabled: true }, enforcedWorkspace), true);
    assert.equal(isTwoFactorCompliant({ twoFactorEnabled: false }, enforcedWorkspace), false);
    assert.equal(isTwoFactorCompliant({ twoFactorEnabled: false }, optionalWorkspace), true);
  });
});
