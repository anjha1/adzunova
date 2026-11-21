import { RateCardPlatform, ContentFormat, DeliverableType, AddonType } from '../rate-card/types';

export interface SectionVisibility {
  platforms: boolean;
  stats: boolean;
  audience: boolean;
  topContent: boolean;
  rateCard: boolean;
  packages: boolean;
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  platforms: true,
  stats: true,
  audience: true,
  topContent: true,
  rateCard: true,
  packages: true,
};

export interface PublicProfile {
  id: string;
  creatorId: string;
  slug: string;
  previousSlugs: string[];
  isPublished: boolean;
  allowIndexing: boolean;
  displayName: string;
  bio: string;
  tags: string[];
  languages: string[];
  location: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  sectionVisibility: SectionVisibility;
  hiddenPlatformIds: string[];
  pinnedContentIds: string[];
  hidePricesPerItem: Record<string, boolean>; // itemId -> true if hidden
  consentRecordedAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  version: number;
}

export type VerificationStatus = 'VERIFIED' | 'EXPIRED' | 'UNVERIFIED';

export interface PlatformSnapshot {
  id: string;
  creatorId: string;
  platform: RateCardPlatform | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK' | 'X' | 'LINKEDIN';
  handle: string;
  profileUrl: string;
  profilePictureUrl?: string | null;
  followers: number;
  avgViews: number;
  engagementRate: number; // percentage e.g. 3.4
  contentCount: number;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  source: string; // e.g. 'Meta Graph API v21.0'
  fetchedAt: string;
  trendSeries?: Array<{ timestamp: string; value: number }>;
}

export type ProfileEventType =
  | 'VIEW'
  | 'SHARE_CLICK'
  | 'RATECARD_VIEW'
  | 'PLATFORM_LINK_CLICK'
  | 'MESSAGE_CTA_CLICK'
  | 'REPORT';

export interface ProfileViewEvent {
  id: string;
  profileId: string;
  timestamp: string;
  referrer: string;
  country: string; // coarse 2-letter country code
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown';
  sessionHash: string; // SHA-256 hash of IP + user agent + salt (never raw IP)
  eventType: ProfileEventType;
  metadata?: Record<string, any>;
}

export interface ProfileReport {
  id: string;
  profileId: string;
  slug: string;
  reason: 'IMPERSONATION' | 'MISLEADING_STATS' | 'HARASSMENT' | 'SCAM' | 'OTHER';
  details: string;
  reporterHash: string; // privacy-safe hash
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  createdAt: string;
}

export interface PublicPackageItem {
  id: string;
  name: string;
  tagline: string;
  deliverables: string[];
  priceInr: number;
  turnaroundDays: number;
  revisions: number;
  isActive: boolean;
}

export interface PublicTopContentItem {
  id: string;
  thumbnailUrl: string;
  platform: string;
  title: string;
  views: number;
  likes: number;
  publishedAt: string;
  permalink: string;
  isPinned: boolean;
}

export interface PublicRateCardItemDTO {
  id: string;
  platform: RateCardPlatform;
  title: string;
  description: string;
  contentFormat: ContentFormat;
  deliverableType: DeliverableType;
  durationSeconds: number | null;
  price: number | null; // null if creator chose hidePrice
  isPriceHidden: boolean;
  priceType: 'FIXED' | 'STARTING_AT' | 'NEGOTIABLE';
  currency: string;
  deliveryDays: number;
  freeRevisions: number;
  publishOnMyChannel: boolean;
  scriptApprovalRequired: boolean;
  addons: Array<{
    type: AddonType;
    label: string;
    pricingMode: 'PERCENT_OF_BASE' | 'FIXED_AMOUNT';
    value: number;
    durationDays?: number | null;
  }>;
}

/**
 * Strict Public Creator Profile DTO
 * NEVER leaks: creatorId, emails, phone, internal IDs, tokens, banking/payout info,
 * platform commission, internal pricing configs, net earnings, or minor micro-data.
 */
export interface PublicCreatorProfileDTO {
  slug: string;
  displayName: string;
  handle: string;
  bio: string;
  tags: string[];
  languages: string[];
  location: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  isVerifiedCreator: boolean;
  lastVerifiedAt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  sectionVisibility: SectionVisibility;
  allowIndexing: boolean;

  // 3.2 Connected Platforms
  platforms?: Array<{
    platform: string;
    handle: string;
    profileUrl: string;
    profilePictureUrl?: string | null;
    followers: number;
    avgViews: number;
    engagementRate: number | null;
    contentCount: number;
    verificationStatus: VerificationStatus;
    verifiedLabel: string;
    isStale: boolean; // older than 7 days
    fetchedAt: string;
    trendSeries: Array<{ timestamp: string; value: number }>;
  }>;

  // 3.3 Aggregate Stats
  stats?: {
    totalVerifiedReach: number;
    totalPublishedContent: number;
    averageEngagementRate: number | null;
    audienceQualityScore: number | null;
    audienceQualityDisplay: string;
    qualityReason?: string;
  };

  // 3.4 Audience Insights
  audience?: {
    sourceLabel: string;
    share18Plus: number | null;
    share13To17: number | null; // only aggregate percentage, suppressed if below threshold
    genderDistribution: Array<{ label: string; percentage: number }>;
    ageDistribution: Array<{ bucket: string; percentage: number }>;
    topCountries: Array<{ countryCode: string; countryName: string; percentage: number }>;
  };

  // 3.5 Top Content
  topContent?: PublicTopContentItem[];

  // 3.6 Rate Card
  rateCard?: {
    startingPriceInr: number | null;
    items: PublicRateCardItemDTO[];
    updatedAt: string;
    version: string;
  };

  // 3.7 Packages
  packages?: PublicPackageItem[];

  // SEO & OpenGraph metadata
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImageUrl: string;
  };
}
