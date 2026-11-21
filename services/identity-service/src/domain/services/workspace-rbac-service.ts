import { WorkspaceMemberEntity, WorkspaceEntity, BrandRole } from '../entities/models';

/**
 * Enterprise RBAC & ABAC Permission Engine for Workspaces
 */

export interface PermissionDefinition {
  action: string;
  category: 'BRAND' | 'CAMPAIGN' | 'BOOKING' | 'FINANCE' | 'TEAM' | 'SETTINGS' | 'AUDIT';
  description: string;
}

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // Brand management
  { action: 'brand:read', category: 'BRAND', description: 'View assigned brands and details' },
  { action: 'brand:create', category: 'BRAND', description: 'Add new client brands to workspace' },
  { action: 'brand:edit', category: 'BRAND', description: 'Modify brand profiles and legal data' },
  { action: 'brand:delete', category: 'BRAND', description: 'Archive or delete client brands' },

  // Campaign management
  { action: 'campaign:read', category: 'CAMPAIGN', description: 'View campaigns and briefs' },
  { action: 'campaign:create', category: 'CAMPAIGN', description: 'Draft campaigns and packages' },
  { action: 'campaign:edit', category: 'CAMPAIGN', description: 'Modify campaign specifications' },
  { action: 'campaign:launch', category: 'CAMPAIGN', description: 'Publish and launch campaigns' },
  { action: 'campaign:delete', category: 'CAMPAIGN', description: 'Archive campaigns' },

  // Bookings & Offers
  { action: 'booking:read', category: 'BOOKING', description: 'View creator bookings and offers' },
  { action: 'booking:create', category: 'BOOKING', description: 'Create bookings and send creator offers' },
  { action: 'booking:approve', category: 'BOOKING', description: 'Approve bookings above approval limits' },

  // Finance & Escrow
  { action: 'payment:read', category: 'FINANCE', description: 'View financial statements and invoices' },
  { action: 'payment:create', category: 'FINANCE', description: 'Initiate payments and escrow deposits' },
  { action: 'payment:release', category: 'FINANCE', description: 'Release escrow funds to creators' },

  // Team & Workspace
  { action: 'team:read', category: 'TEAM', description: 'View team members and roles' },
  { action: 'team:invite', category: 'TEAM', description: 'Invite new members with work email' },
  { action: 'team:remove', category: 'TEAM', description: 'Remove members or revoke invites' },
  { action: 'team:manage_roles', category: 'TEAM', description: 'Assign and change member roles' },

  // Approvals & Compliance
  { action: 'approvals:read', category: 'SETTINGS', description: 'View pending and historical approval requests' },
  { action: 'approvals:decide', category: 'SETTINGS', description: 'Approve or reject workflow requests' },

  // Settings & Security
  { action: 'settings:read', category: 'SETTINGS', description: 'View workspace settings' },
  { action: 'settings:manage', category: 'SETTINGS', description: 'Manage IP allowlist, 2FA, and thresholds' },

  // Audit
  { action: 'audit:read', category: 'AUDIT', description: 'View immutable audit log trail' },
  { action: 'audit:export', category: 'AUDIT', description: 'Export tamper-evident audit logs to CSV/JSON' },
];

/**
 * Standard Role to Actions Matrix
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: PERMISSION_CATALOG.map((p) => p.action), // All permissions
  ADMIN: PERMISSION_CATALOG.map((p) => p.action), // All permissions except deleting workspace owner
  CAMPAIGN_MANAGER: [
    'brand:read',
    'campaign:read',
    'campaign:create',
    'campaign:edit',
    'campaign:launch',
    'booking:read',
    'booking:create',
    'approvals:read',
    'team:read',
    'settings:read',
  ],
  FINANCE: [
    'brand:read',
    'campaign:read',
    'booking:read',
    'booking:approve',
    'payment:read',
    'payment:create',
    'payment:release',
    'approvals:read',
    'approvals:decide',
    'audit:read',
    'audit:export',
    'team:read',
  ],
  LEGAL: [
    'brand:read',
    'campaign:read',
    'booking:read',
    'approvals:read',
    'approvals:decide',
    'audit:read',
    'audit:export',
    'team:read',
  ],
  VIEWER: [
    'brand:read',
    'campaign:read',
    'booking:read',
    'payment:read',
    'team:read',
    'approvals:read',
  ],
};

export interface PermissionCheckContext {
  member: WorkspaceMemberEntity;
  action: string;
  resource?: {
    brandId?: string;
    campaignId?: string;
    amountMinor?: number; // In minor units (e.g. ₹1,00,000 = 10000000)
  };
  workspacePolicy?: Partial<WorkspaceEntity>;
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  requiresApproval?: boolean;
  approverRole?: 'ADMIN' | 'FINANCE' | 'OWNER';
  approvalReason?: string;
}

/**
 * Evaluates RBAC (Role-Based) and ABAC (Attribute-Based) access rules.
 */
export function checkPermission(ctx: PermissionCheckContext): PermissionCheckResult {
  const { member, action, resource, workspacePolicy } = ctx;

  if (member.status !== 'ACTIVE') {
    return {
      allowed: false,
      reason: `Member account is ${member.status.toLowerCase()}. Access denied.`,
    };
  }

  // 1. Role Permission check (RBAC)
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[member.role] || [];
  const hasBasePermission = rolePermissions.includes(action) || member.role === 'OWNER';

  if (!hasBasePermission) {
    return {
      allowed: false,
      reason: `Role '${member.role}' lacks permission for action '${action}'.`,
    };
  }

  // 2. Resource Brand Scope check (Multi-brand Agency Isolation)
  if (resource?.brandId && member.brandIds && member.brandIds.length > 0) {
    const isBrandAllowed = member.brandIds.includes(resource.brandId);
    if (!isBrandAllowed) {
      return {
        allowed: false,
        reason: `Member is not authorized for brand '${resource.brandId}'. Member scope is restricted to: ${member.brandIds.join(', ')}.`,
      };
    }
  }

  // 3. Approval Limits & Financial Threshold Evaluation (ABAC)
  if (resource?.amountMinor !== undefined && resource.amountMinor > 0) {
    const defaultBookingThreshold =
      workspacePolicy?.approvalThresholds?.bookingThresholdMinor ?? 10000000; // ₹1,00,000 in minor units

    const memberLimit =
      member.approvalLimitMinor !== undefined
        ? member.approvalLimitMinor
        : member.role === 'OWNER' || member.role === 'ADMIN'
        ? Infinity
        : member.role === 'FINANCE'
        ? 50000000 // ₹5,00,000 default for Finance
        : defaultBookingThreshold;

    const isFinancialAction =
      action === 'booking:create' ||
      action === 'payment:release' ||
      action === 'campaign:launch';

    if (isFinancialAction && resource.amountMinor > memberLimit) {
      return {
        allowed: true, // Allowed to initiate, but triggers approval workflow
        requiresApproval: true,
        approverRole: member.role === 'FINANCE' ? 'OWNER' : 'FINANCE',
        approvalReason: `Amount of ₹${(resource.amountMinor / 100).toLocaleString('en-IN')} exceeds member approval limit of ₹${(memberLimit / 100).toLocaleString('en-IN')}. Requires ${member.role === 'FINANCE' ? 'Owner' : 'Finance/Admin'} approval.`,
      };
    }
  }

  return { allowed: true };
}

/**
 * IP Allowlist evaluation: Checks if client IP matches an IP address or CIDR range.
 */
export function isIpAllowed(clientIp: string, allowlist: string[]): boolean {
  if (!allowlist || allowlist.length === 0) {
    return true; // No restriction configured
  }

  const cleanIp = clientIp.trim();

  return allowlist.some((rule) => {
    const cleanRule = rule.trim();
    if (!cleanRule) return false;

    // Exact match
    if (cleanRule === cleanIp) return true;

    // CIDR match (e.g. 192.168.1.0/24 or 10.0.0.0/8)
    if (cleanRule.includes('/')) {
      return ipMatchesCidr(cleanIp, cleanRule);
    }

    return false;
  });
}

function ipToLong(ip: string): number | null {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  return (
    ((parts[0] << 24) |
      (parts[1] << 16) |
      (parts[2] << 8) |
      parts[3]) >>>
    0
  );
}

function ipMatchesCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split('/');
  const bits = parseInt(bitsStr, 10);
  if (isNaN(bits) || bits < 0 || bits > 32) return false;

  const ipNum = ipToLong(ip);
  const rangeNum = ipToLong(range);
  if (ipNum === null || rangeNum === null) return false;

  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipNum & mask) === (rangeNum & mask);
}

/**
 * 2FA Policy Compliance Evaluation
 */
export function isTwoFactorCompliant(
  user: { twoFactorEnabled?: boolean },
  workspace: { twoFactorRequired: boolean }
): boolean {
  if (!workspace.twoFactorRequired) {
    return true;
  }
  return Boolean(user.twoFactorEnabled);
}
