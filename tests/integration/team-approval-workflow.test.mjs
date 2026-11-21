import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createApprovalRequest,
  evaluateApprovalDecision,
  checkSlaStatus,
} from '../../services/identity-service/src/domain/services/approval-workflow-service.ts';
import { evaluateWorkEmail } from '../../services/identity-service/src/domain/services/work-email-policy.ts';

test('Approval Workflows: Creation, Validation & Escalation', async (t) => {
  const approval = createApprovalRequest({
    workspaceId: 'ws_corp_ogilvy',
    brandId: 'brand_cadbury_in',
    type: 'BOOKING_CREATION',
    resourceId: 'booking_cadbury_diwali',
    requesterId: 'user_cm_rohan',
    amountMinor: 25000000, // ₹2,50,000
    currency: 'INR',
    slaHours: 48,
  });

  assert.equal(approval.decision, 'PENDING');
  assert.equal(approval.amountMinor, 25000000);
  assert.ok(approval.slaDeadline);

  await t.test('strictly blocks self-approval by the requester', () => {
    const requesterAsApprover = {
      workspaceId: 'ws_corp_ogilvy',
      userId: 'user_cm_rohan', // Same as requesterId
      email: 'rohan@ogilvy.co.in',
      role: 'ADMIN',
      status: 'ACTIVE',
      brandIds: [],
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    assert.throws(
      () => {
        evaluateApprovalDecision(approval, {
          approvalId: approval._id,
          approver: requesterAsApprover,
          decision: 'APPROVED',
        });
      },
      (err) => {
        assert.match(err.message, /Self-approval prohibited/i);
        return true;
      }
    );
  });

  await t.test('strictly blocks approval from roles lacking financial authority (Viewer, CM)', () => {
    const viewerApprover = {
      workspaceId: 'ws_corp_ogilvy',
      userId: 'user_viewer_priya',
      email: 'priya@ogilvy.co.in',
      role: 'VIEWER',
      status: 'ACTIVE',
      brandIds: [],
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    assert.throws(
      () => {
        evaluateApprovalDecision(approval, {
          approvalId: approval._id,
          approver: viewerApprover,
          decision: 'APPROVED',
        });
      },
      (err) => {
        assert.match(err.message, /Insufficient role authority/i);
        return true;
      }
    );
  });

  await t.test('enforces approver limit thresholds', () => {
    const financeWithSmallLimit = {
      workspaceId: 'ws_corp_ogilvy',
      userId: 'user_junior_fin',
      email: 'junior.fin@ogilvy.co.in',
      role: 'FINANCE',
      status: 'ACTIVE',
      brandIds: [],
      approvalLimitMinor: 10000000, // ₹1,00,000 < ₹2,50,000 required
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    assert.throws(
      () => {
        evaluateApprovalDecision(approval, {
          approvalId: approval._id,
          approver: financeWithSmallLimit,
          decision: 'APPROVED',
        });
      },
      (err) => {
        assert.match(err.message, /exceeds approver limit/i);
        return true;
      }
    );
  });

  await t.test('requires mandatory reason when rejecting', () => {
    const adminApprover = {
      workspaceId: 'ws_corp_ogilvy',
      userId: 'user_admin_deepak',
      email: 'deepak@ogilvy.co.in',
      role: 'ADMIN',
      status: 'ACTIVE',
      brandIds: [],
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    assert.throws(
      () => {
        evaluateApprovalDecision(approval, {
          approvalId: approval._id,
          approver: adminApprover,
          decision: 'REJECTED',
          reason: '', // Empty reason
        });
      },
      (err) => {
        assert.match(err.message, /detailed reason/i);
        return true;
      }
    );
  });

  await t.test('successfully approves with audit payload generation', () => {
    const seniorFinanceApprover = {
      workspaceId: 'ws_corp_ogilvy',
      userId: 'user_senior_fin',
      email: 'finance.director@ogilvy.co.in',
      role: 'FINANCE',
      status: 'ACTIVE',
      brandIds: [],
      approvalLimitMinor: 50000000, // ₹5,00,000 > ₹2,50,000
      joinedAt: new Date(),
      updatedAt: new Date(),
    };

    const { updatedApproval, auditPayload } = evaluateApprovalDecision(approval, {
      approvalId: approval._id,
      approver: seniorFinanceApprover,
      decision: 'APPROVED',
      reason: 'Diwali budget allocation approved per Q3 brand plan.',
    });

    assert.equal(updatedApproval.decision, 'APPROVED');
    assert.equal(updatedApproval.approverId, seniorFinanceApprover.userId);
    assert.equal(auditPayload.decision, 'APPROVED');
    assert.equal(auditPayload.amountMinor, 25000000);
  });

  await t.test('computes SLA status and remaining window accurately', () => {
    const sla = checkSlaStatus(approval);
    assert.equal(sla.isBreached, false);
    assert.ok(sla.hoursRemaining > 40 && sla.hoursRemaining <= 48);
  });
});

test('Team Invitations: Work-Email Enforcement on Invites', async () => {
  // Team invitations must strictly reject free/consumer emails (Phase B policy engine)
  const consumerInvite = await evaluateWorkEmail('contractor@gmail.com');
  assert.equal(consumerInvite.allowed, false);
  assert.equal(consumerInvite.reason, 'FREE_EMAIL_NOT_ALLOWED');

  const corporateInvite = await evaluateWorkEmail('campaign.lead@tatacliq.com');
  assert.equal(corporateInvite.allowed, true);
  assert.equal(corporateInvite.domain, 'tatacliq.com');
});
