/**
 * Adzunova Creator Discovery & Search Type System
 */

export interface CreatorSearchQuery {
  query?: string; // Text search on creator name, handle, bio, or niche
  platform?: 'all' | 'instagram' | 'youtube';
  minFollowers?: number;
  maxFollowers?: number;
  minBudget?: number; // Starting rate card price in INR
  maxBudget?: number; // Starting rate card price in INR
  budgetAmount?: number; // Budget-First Search: total campaign budget
  deliverableFormat?: 'REEL' | 'STORY' | 'POST' | 'VIDEO' | 'ANY';
  category?: string; // Niche e.g. Tech, Fashion, Lifestyle
  creatorCountry?: string;
  creatorCity?: string;
  audienceCountry?: string; // Top audience country code (e.g. IN, US)
  min18PlusShare?: number; // Minimum 18+ audience share percentage (0-100)
  max1317Share?: number; // Maximum 13-17 audience share percentage (0-100)
  minEngagementRate?: number; // Percentage e.g. 2.5
  verifiedOnly?: boolean; // Default true (only real OAuth-verified creators)
  sortBy?: 'best_match' | 'price_asc' | 'price_desc' | 'followers_desc' | 'engagement_desc';
  cursor?: string; // Base64 cursor for keyset pagination
  limit?: number; // Default 20, max 50 (scraping defense cap)
  requestingUserId?: string; // Self-dealing guard: ID of authenticated brand user
  workspaceId?: string; // Self-dealing guard: workspace ID of requesting brand
}

export interface CreatorCardData {
  creatorId: string;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  bio?: string;
  category: string;
  country: string;
  city?: string;

  // Social Verification & Metrics
  primaryPlatform: 'instagram' | 'youtube';
  handle: string;
  followersCount: number;
  views24h?: number;
  mediaCount: number;
  engagementRate: number | null; // Percentage e.g. 3.8, or null if insufficient sample data
  verifiedStatus: 'VERIFIED' | 'SOCIAL_VERIFIED';
  verifiedBadgeText: string;
  dataAsOfText: string; // e.g. "Data as of Nov 20, 2026 (Meta estimate)"

  // Audience Insights (Excluded if no snapshot)
  audienceMetrics?: {
    hasSnapshot: boolean;
    share18Plus: number | null;
    share1317: number | null;
    topCountry: string | null;
    computedAt?: string;
  };

  // Pricing & Deliverables from Active Rate Card
  startingPriceMinor: number | null; // In minor units e.g. 1500000 = ₹15,000, null if not published
  currency: string;
  availableDeliverables: string[];

  // Transparent Best Match Algorithm Score (null when no query criteria are provided)
  matchScore: number | null; // 0 to 100 or null
  matchExplanation: string;
}

export interface SearchFacets {
  platforms: Record<string, number>;
  categories: Record<string, number>;
  followerBands: {
    under10k: number;
    k10to50k: number;
    k50to200k: number;
    k200kto1m: number;
    over1m: number;
  };
  audienceCountries: Record<string, number>;
}

export interface CreatorSearchResult {
  items: CreatorCardData[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount: number;
  facets: SearchFacets;
  queryMeta: {
    tookMs: number;
    cached: boolean;
    budgetEvaluated?: boolean;
    effectiveBudgetMinor?: number;
  };
}

export interface ShortlistEntity {
  id: string;
  workspaceId: string;
  name: string;
  creatorIds: string[];
  createdAt: string;
  updatedAt: string;
}
