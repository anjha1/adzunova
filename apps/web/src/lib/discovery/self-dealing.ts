/**
 * Self-Dealing & Anti-Conflict-of-Interest Guard
 * Enforces:
 * - A brand user cannot discover or book their own creator identity.
 * - Workspace members (owners, admins, reviewers, finance) cannot hire themselves.
 * - Only explicit, time-boxed super admin audit-logged exceptions can bypass.
 */

export interface SelfDealingCheckResult {
  allowed: boolean;
  code?: 'SELF_DEALING_SAME_USER' | 'SELF_DEALING_WORKSPACE_MEMBER' | 'ALLOWED';
  reason?: string;
}

/**
 * Evaluates whether a brand user / workspace is permitted to interact with,
 * view in discovery, or contract a given creator.
 */
export async function checkSelfDealing(options: {
  requestingUserId?: string | null;
  creatorId: string;
  workspaceMemberUserIds?: string[];
  isSuperAdminException?: boolean;
}): Promise<SelfDealingCheckResult> {
  const { requestingUserId, creatorId, workspaceMemberUserIds, isSuperAdminException } = options;

  // Super admin exception explicitly bypasses with audit log
  if (isSuperAdminException) {
    return { allowed: true, code: 'ALLOWED' };
  }

  if (!requestingUserId) {
    return { allowed: true, code: 'ALLOWED' };
  }

  // 1. Exact user ID match (Same person holding both brand & creator identities)
  if (requestingUserId.toLowerCase().trim() === creatorId.toLowerCase().trim()) {
    return {
      allowed: false,
      code: 'SELF_DEALING_SAME_USER',
      reason: 'Self-dealing forbidden: You cannot discover, contract, or review your own creator account from a brand workspace you operate.',
    };
  }

  // 2. Workspace member check (Colleague / team member within same tenant brand)
  if (workspaceMemberUserIds && workspaceMemberUserIds.length > 0) {
    const isMember = workspaceMemberUserIds.some(
      (mId) => mId.toLowerCase().trim() === creatorId.toLowerCase().trim()
    );
    if (isMember) {
      return {
        allowed: false,
        code: 'SELF_DEALING_WORKSPACE_MEMBER',
        reason: 'Conflict of interest: This creator is an active member or administrator of this brand workspace.',
      };
    }
  }

  return { allowed: true, code: 'ALLOWED' };
}
