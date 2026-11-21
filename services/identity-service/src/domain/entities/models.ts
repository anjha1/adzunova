export type UserRole = 'CREATOR' | 'BRAND' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION'
  | 'RESTRICTED_WORK_EMAIL_REQUIRED';

export interface UserEntity {
  _id: string;
  id?: string;
  email: string;
  normalizedEmail: string;
  passwordHash?: string;
  role: UserRole;
  emailVerified: boolean;
  avatarUrl?: string;
  displayName?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface IdentityEntity {
  _id?: any;
  userId: string;
  provider: 'google' | 'local';
  providerUserId: string;
  providerEmail: string;
  createdAt: Date;
}

export type CreatorCategory =
  | 'Influencer'
  | 'UGC Creator'
  | 'Actor'
  | 'Model'
  | 'Musician'
  | 'Photographer'
  | 'Videographer'
  | 'Designer'
  | 'Artist'
  | 'Streamer'
  | 'Other creative professional';

export interface CreatorProfileEntity {
  userId: string;
  displayName: string;
  category: CreatorCategory;
  country: string;
  bio?: string;
  location?: string;
  languages?: string[];
  portfolioUrls?: string[];
  socialLinks?: Record<string, string>;
  onboardingCompleted: boolean;
  onboardingStep: number;
  profileStatus: 'DRAFT' | 'COMPLETED' | 'VERIFIED';
  createdAt: Date;
  updatedAt: Date;
}

export type BrandBusinessType =
  | 'D2C Brand'
  | 'E-commerce Company'
  | 'Advertising Company'
  | 'Marketing Agency'
  | 'Startup'
  | 'Enterprise'
  | 'Other Business';

export interface BrandProfileEntity {
  _id?: any;
  userId: string;
  contactName: string;
  companyName: string;
  brandName?: string;
  website?: string;
  industry: string;
  businessType: BrandBusinessType;
  accountType?: 'BRAND' | 'AGENCY' | 'ENTERPRISE';
  country: string;
  logoUrl?: string;
  companySize?: string;
  pan?: string;
  gstin?: string;
  cin?: string;
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
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'RESTRICTED' | 'SUSPENDED';
  verificationDetails?: string;
  verifiedAt?: Date;
  domainVerified?: boolean;
  dpdpConsent?: {
    version: string;
    timestamp: string;
    ip?: string;
    userAgent?: string;
    purposes: string[];
  };
  checklistState?: {
    profile: boolean;
    domainProof: boolean;
    businessVerification: boolean;
    paymentMethod: boolean;
    firstCampaign: boolean;
  };
  objectives?: string[];
  teamSize?: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
  profileStatus: 'DRAFT' | 'COMPLETED' | 'VERIFIED';
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionEntity {
  _id?: any;
  userId: string;
  role: UserRole;
  sessionTokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  revokedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface VerificationTokenEntity {
  _id?: any;
  userId: string;
  tokenHash: string;
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export type BrandRole = 'OWNER' | 'ADMIN' | 'CAMPAIGN_MANAGER' | 'FINANCE' | 'LEGAL' | 'VIEWER' | string;

export interface WorkspaceEntity {
  _id?: any;
  id?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandEntity {
  _id?: any;
  id?: string;
  workspaceId: string;
  name: string;
  logoUrl?: string;
  website?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMemberEntity {
  _id?: any;
  id?: string;
  workspaceId: string;
  userId: string;
  email: string;
  name?: string;
  role: BrandRole;
  customRoleId?: string;
  brandIds: string[]; // empty means all brands in workspace
  approvalLimitMinor?: number; // minor units e.g. 10000000 = ₹1,00,000
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  joinedAt: Date;
  updatedAt: Date;
}

export interface RoleEntity {
  _id?: any;
  id?: string;
  workspaceId?: string; // null for system predefined roles
  name: string;
  slug: string;
  description?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissionEntity {
  _id?: any;
  id?: string;
  roleId: string;
  action: string;
  resourceType: string;
  conditions?: Record<string, any>;
  createdAt: Date;
}

export interface WorkspaceInvitationEntity {
  _id?: any;
  id?: string;
  workspaceId: string;
  email: string;
  role: BrandRole;
  brandIds: string[];
  invitedByUserId: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface ApprovalEntity {
  _id?: any;
  id?: string;
  workspaceId: string;
  brandId?: string;
  type: 'BOOKING_CREATION' | 'CAMPAIGN_LAUNCH' | 'PAYMENT_RELEASE';
  resourceId: string;
  requesterId: string;
  approverId?: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  amountMinor?: number;
  currency: string;
  slaDeadline?: Date;
  escalationPath?: string;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRuleEntity {
  _id?: any;
  id?: string;
  workspaceId: string;
  actionType: string;
  minAmountMinor: number;
  requiredRole: string;
  slaHours: number;
  createdAt: Date;
}

export interface AuditLogEntity {
  _id?: any;
  id?: string;
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
  createdAt: Date;
}
