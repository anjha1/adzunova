import crypto from 'crypto';
import { ApprovalEntity, WorkspaceMemberEntity } from '../entities/models';

/**
 * Enterprise Multi-Stage Approval Workflow Engine
 * Manages booking, campaign launch, and payment escrow release approvals with SLA tracking.
 */

export interface CreateApprovalInput {
  workspaceId: string;
  brandId?: string;
  type: 'BOOKING_CREATION' | 'CAMPAIGN_LAUNCH' | 'PAYMENT_RELEASE';
  resourceId: string;
  requesterId: string;
  amountMinor?: number;
  currency?: string;
  slaHours?: number;
  escalationPath?: string;
}

export interface DecideApprovalInput {
  approvalId: string;
  approver: WorkspaceMemberEntity;
  decision: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export function createApprovalRequest(input: CreateApprovalInput): ApprovalEntity {
  const now = new Date();
  const slaHours = input.slaHours || 24;
  const slaDeadline = new Date(now.getTime() + slaHours * 3600 * 1000);

  return {
    _id: crypto.randomBytes(12).toString('hex'),
    workspaceId: input.workspaceId,
    brandId: input.brandId,
    type: input.type,
    resourceId: input.resourceId,
    requesterId: input.requesterId,
    decision: 'PENDING',
    amountMinor: input.amountMinor,
    currency: input.currency || 'INR',
    slaDeadline,
    escalationPath: input.escalationPath || 'ADMIN',
    createdAt: now,
    updatedAt: now,
  };
}

export function evaluateApprovalDecision(
  approval: ApprovalEntity,
  input: DecideApprovalInput
): { updatedApproval: ApprovalEntity; auditPayload: Record<string, any> } {
  const { approver, decision, reason } = input;

  if (approval.decision !== 'PENDING') {
    throw new Error(`Approval request has already been decided (${approval.decision}).`);
  }

  // Self-approval is strictly forbidden
  if (approval.requesterId === approver.userId) {
    throw new Error('Self-approval prohibited: Requesters cannot approve their own workflow requests.');
  }

  // Approver role authority check
  const allowedApproverRoles = ['OWNER', 'ADMIN', 'FINANCE'];
  if (!allowedApproverRoles.includes(approver.role)) {
    throw new Error(`Insufficient role authority: Role '${approver.role}' cannot make approval decisions.`);
  }

  // If financial or booking action, check approver limit
  if (approval.amountMinor && approver.approvalLimitMinor !== undefined) {
    if (approver.role !== 'OWNER' && approver.role !== 'ADMIN' && approver.approvalLimitMinor < approval.amountMinor) {
      throw new Error(
        `Amount ₹${(approval.amountMinor / 100).toLocaleString('en-IN')} exceeds approver limit of ₹${(approver.approvalLimitMinor / 100).toLocaleString('en-IN')}. Escalation required.`
      );
    }
  }

  // Rejection requires a mandatory explanation
  if (decision === 'REJECTED' && (!reason || reason.trim().length < 5)) {
    throw new Error('A detailed reason (at least 5 characters) is required when rejecting an approval request.');
  }

  const now = new Date();
  const updatedApproval: ApprovalEntity = {
    ...approval,
    approverId: approver.userId,
    decision,
    reason: reason?.trim(),
    decidedAt: now,
    updatedAt: now,
  };

  const auditPayload = {
    approvalId: approval._id || approval.id,
    type: approval.type,
    resourceId: approval.resourceId,
    requesterId: approval.requesterId,
    approverId: approver.userId,
    decision,
    reason: reason?.trim() || null,
    amountMinor: approval.amountMinor,
    currency: approval.currency,
  };

  return { updatedApproval, auditPayload };
}

/**
 * Checks whether an approval request has breached its SLA deadline
 */
export function checkSlaStatus(approval: ApprovalEntity): {
  isBreached: boolean;
  hoursRemaining: number;
} {
  if (!approval.slaDeadline || approval.decision !== 'PENDING') {
    return { isBreached: false, hoursRemaining: 0 };
  }

  const now = Date.now();
  const deadline = new Date(approval.slaDeadline).getTime();
  const diffMs = deadline - now;
  const hoursRemaining = Math.round((diffMs / (3600 * 1000)) * 10) / 10;

  return {
    isBreached: diffMs < 0,
    hoursRemaining: Math.max(0, hoursRemaining),
  };
}
