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
  userId: string;
  contactName: string;
  companyName: string;
  website?: string;
  industry: string;
  businessType: BrandBusinessType;
  country: string;
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
