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
  website?: string;
  industry?: string;
  businessType?: string;
  country?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'SUSPENDED';
  subscriptionPlan?: string;
  currency?: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: CreatorProfileData & BrandProfileData;
}
