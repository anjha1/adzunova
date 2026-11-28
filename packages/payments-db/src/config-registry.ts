import { getPaymentsMongoDb } from './client';
import { appendPaymentAuditEvent } from './audit';

export interface FeeConfigSnapshot {
  version: string;
  brandFeeBps: number;
  creatorFeeBps: number;
  gstBps: number;
  defaultTdsBps: number;
  offerExpiryHours: number;
  signWindowHours: number;
  paymentWindowHours: number;
  reviewSlaHours: number;
  holdPeriodHours: number;
  disputeWindowHours: number;
  minWithdrawalPaise: bigint;
}

export async function getActiveFeeConfig(): Promise<FeeConfigSnapshot | null> {
  const db = await getPaymentsMongoDb();
  const doc = await db
    .collection('pay_config_versions')
    .findOne({ isActive: true }, { sort: { createdAt: -1 } });
  if (!doc) return null;
  return {
    version: String(doc.version),
    brandFeeBps: Number(doc.brandFeeBps),
    creatorFeeBps: Number(doc.creatorFeeBps),
    gstBps: Number(doc.gstBps),
    defaultTdsBps: Number(doc.defaultTdsBps ?? 0),
    offerExpiryHours: Number(doc.offerExpiryHours ?? 72),
    signWindowHours: Number(doc.signWindowHours ?? 120),
    paymentWindowHours: Number(doc.paymentWindowHours ?? 48),
    reviewSlaHours: Number(doc.reviewSlaHours ?? 120),
    holdPeriodHours: Number(doc.holdPeriodHours ?? 168),
    disputeWindowHours: Number(doc.disputeWindowHours ?? 168),
    minWithdrawalPaise: BigInt(doc.minWithdrawalPaise ?? 50000),
  };
}

export async function isPaymentFeatureEnabled(key: string): Promise<boolean> {
  const db = await getPaymentsMongoDb();
  const flag = await db.collection('pay_feature_flags').findOne({ key });
  return flag?.enabled === true;
}

export async function isBookingFeatureEnabled(): Promise<boolean> {
  if (process.env.FEATURE_BOOKINGS === 'true') {
    return true;
  }
  try {
    return await isPaymentFeatureEnabled('FEATURE_BOOKINGS');
  } catch {
    return false;
  }
}

export async function recordConfigApproval(params: {
  approvalType: 'RAZORPAY_LIVE_PROBE' | 'RAZORPAY_LIVE_MONEY' | 'MANUAL_MONEY_ACTION';
  approvedBy: string;
  scope: string;
  reason: string;
}): Promise<void> {
  const db = await getPaymentsMongoDb();
  const approvedAt = new Date();
  await db.collection('pay_config_approvals').insertOne({
    approvalType: params.approvalType,
    approvedBy: params.approvedBy,
    scope: params.scope,
    reason: params.reason,
    isActive: true,
    approvedAt,
    revokedAt: null,
  });
  await appendPaymentAuditEvent({
    actorId: params.approvedBy,
    actorRole: 'OWNER',
    action: `CONFIG_APPROVAL_${params.approvalType}`,
    resourceType: 'CONFIG_APPROVAL',
    resourceId: params.approvalType,
    reason: params.reason,
    payload: {
      approvalType: params.approvalType,
      scope: params.scope,
      approvedAt: approvedAt.toISOString(),
    },
  });
}

export async function hasActiveConfigApproval(
  approvalType: 'RAZORPAY_LIVE_PROBE' | 'RAZORPAY_LIVE_MONEY' | 'MANUAL_MONEY_ACTION'
): Promise<boolean> {
  const db = await getPaymentsMongoDb();
  const doc = await db.collection('pay_config_approvals').findOne({
    approvalType,
    isActive: true,
    revokedAt: null,
  });
  return Boolean(doc);
}
