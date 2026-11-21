/**
 * Shared auth TypeScript interfaces used across the web app.
 */

export interface AuthUser {
  id: string;
  email: string;
  role: 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPER_ADMIN';
  emailVerified?: boolean;
  avatarUrl?: string;
  displayName?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'RESTRICTED_WORK_EMAIL_REQUIRED';
}

export interface CreatorProfileData {
  displayName?: string;
  category?: string;
  country?: string;
  bio?: string;
  avatarUrl?: string;
  portfolioUrl?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
}

export interface BrandProfileData {
  contactName?: string;
  companyName?: string;
  brandName?: string;
  website?: string;
  industry?: string;
  businessType?: string;
  accountType?: 'BRAND' | 'AGENCY' | 'ENTERPRISE';
  country?: string;
  logoUrl?: string;
  companySize?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'RESTRICTED' | 'SUSPENDED';
  verificationDetails?: string;
  verifiedAt?: string;
  subscriptionPlan?: string;
  currency?: string;
  pan?: string;
  gstin?: string;
  cin?: string;
  domainVerified?: boolean;
  legalAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  billingContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  dpdpConsent?: {
    version: string;
    timestamp: string;
    purposes: string[];
  };
  checklistState?: {
    profile: boolean;
    domainProof: boolean;
    businessVerification: boolean;
    paymentMethod: boolean;
    firstCampaign: boolean;
  };
}

export interface AuthSession {
  user: AuthUser;
  profile: CreatorProfileData & BrandProfileData;
}

export type BrandRole = 'OWNER' | 'ADMIN' | 'CAMPAIGN_MANAGER' | 'FINANCE' | 'LEGAL' | 'VIEWER' | string;

export interface WorkspaceMemberData {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  name?: string;
  role: BrandRole;
  customRoleId?: string;
  brandIds: string[];
  approvalLimitMinor?: number;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  joinedAt: string;
}

export interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
  type: 'BRAND' | 'AGENCY' | 'ENTERPRISE';
  ownerId: string;
  billingCurrency: string;
  ipAllowlist: string[];
  twoFactorRequired: boolean;
  approvalThresholds?: {
    bookingThresholdMinor?: number;
    campaignThresholdMinor?: number;
    paymentThresholdMinor?: number;
  };
}

export interface ApprovalData {
  id: string;
  workspaceId: string;
  brandId?: string;
  type: 'BOOKING_CREATION' | 'CAMPAIGN_LAUNCH' | 'PAYMENT_RELEASE';
  resourceId: string;
  requesterId: string;
  requesterName?: string;
  approverId?: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  amountMinor?: number;
  currency: string;
  slaDeadline?: string;
  escalationPath?: string;
  decidedAt?: string;
  createdAt: string;
}

export interface AuditLogData {
  id: string;
  workspaceId: string;
  actorId: string;
  actorEmail?: string;
  actorIp?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousHash: string;
  hash: string;
  payload?: any;
  createdAt: string;
}
