/**
 * Central Mock Creator Data Source
 * Gated behind NEXT_PUBLIC_USE_MOCK_DATA.
 * All demo metrics are explicitly tagged as isDemo: true and unverified.
 */

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface CreatorDashboardMockData {
  isDemo: boolean;
  currency: string;
  currencySymbol: string;
  totalEarnings: number;
  earningsGrowthPercent: number;
  pendingEscrow: number;
  pendingEscrowDeliverablesCount: number;
  activeCampaignsCount: number;
  nextDeadlineDays: number;
  audienceScore: number;
  audienceScorePercentile: number;
  actionItems: Array<{
    id: string;
    brandName: string;
    title: string;
    amount: number;
    escrowGuaranteed: boolean;
    expiresInText: string;
    type: 'OFFER' | 'REVISION';
    href: string;
  }>;
  socialAccounts: Array<{
    id: string;
    platform: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'X';
    platformCode: string;
    handle: string;
    name: string;
    followers: string;
    followersExact: number;
    engagementRate: string;
    monthlyGrowth: string;
    ratePerUnit: string;
    rateFormat: string;
    isOAuthVerified: boolean;
    lastSynced: string;
  }>;
  aiInsights: {
    marketPercentile: string;
    niche: string;
    currentReelRate: number;
    suggestedReelRate: number;
    acceptanceProbability: string;
  };
}

export const MOCK_CREATOR_DASHBOARD: CreatorDashboardMockData = {
  isDemo: true,
  currency: 'INR',
  currencySymbol: '₹',
  totalEarnings: 185000,
  earningsGrowthPercent: 24.5,
  pendingEscrow: 65000,
  pendingEscrowDeliverablesCount: 2,
  activeCampaignsCount: 3,
  nextDeadlineDays: 3,
  audienceScore: 94,
  audienceScorePercentile: 5,
  actionItems: [
    {
      id: 'act-1',
      brandName: 'TechStyle Co.',
      title: 'Dedicated Reel Sponsorship',
      amount: 65000,
      escrowGuaranteed: true,
      expiresInText: 'Expires in 14h',
      type: 'OFFER',
      href: '/creator/offers',
    },
    {
      id: 'act-2',
      brandName: 'Aura Audio',
      title: 'Campaign #1084 Caption Revision',
      amount: 0,
      escrowGuaranteed: true,
      expiresInText: 'Due in 2 days',
      type: 'REVISION',
      href: '/creator/campaigns',
    },
  ],
  socialAccounts: [
    {
      id: 'soc-ig',
      platform: 'INSTAGRAM',
      platformCode: 'IG',
      handle: '@creator_official',
      name: 'Creator Official',
      followers: '1.2M',
      followersExact: 1240000,
      engagementRate: '4.8%',
      monthlyGrowth: '+12.4k followers',
      ratePerUnit: '₹50,000',
      rateFormat: '1-min Reel',
      isOAuthVerified: false, // In demo, clearly labeled unverified
      lastSynced: '2 hours ago',
    },
    {
      id: 'soc-yt',
      platform: 'YOUTUBE',
      platformCode: 'YT',
      handle: '@creatortech',
      name: 'Creator Tech & Lifestyle',
      followers: '6.2M',
      followersExact: 6200000,
      engagementRate: '7.1%',
      monthlyGrowth: '+45k subs',
      ratePerUnit: '₹1,00,000',
      rateFormat: 'Dedicated Video',
      isOAuthVerified: false,
      lastSynced: '1 hour ago',
    },
  ],
  aiInsights: {
    marketPercentile: 'p45',
    niche: 'Consumer Tech',
    currentReelRate: 50000,
    suggestedReelRate: 62000,
    acceptanceProbability: '85%',
  },
};
