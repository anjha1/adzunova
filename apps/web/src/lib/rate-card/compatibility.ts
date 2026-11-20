import {
  RateCardPlatform,
  ContentFormat,
  DeliverableType,
  AddonType,
} from './types';

export const PLATFORM_METADATA: Record<
  RateCardPlatform,
  { label: string; icon: string; badgeColor: string; defaultCurrency: string }
> = {
  INSTAGRAM: {
    label: 'Instagram',
    icon: 'Instagram',
    badgeColor: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    defaultCurrency: 'INR',
  },
  YOUTUBE: {
    label: 'YouTube',
    icon: 'Video',
    badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20',
    defaultCurrency: 'INR',
  },
  TIKTOK: {
    label: 'TikTok',
    icon: 'Share2',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    defaultCurrency: 'INR',
  },
  FACEBOOK: {
    label: 'Facebook',
    icon: 'Facebook',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    defaultCurrency: 'INR',
  },
  X: {
    label: 'X (Twitter)',
    icon: 'Twitter',
    badgeColor: 'bg-foreground/10 text-foreground border-foreground/20',
    defaultCurrency: 'INR',
  },
  LINKEDIN: {
    label: 'LinkedIn',
    icon: 'Linkedin',
    badgeColor: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    defaultCurrency: 'INR',
  },
};

export const FORMAT_METADATA: Record<
  ContentFormat,
  { label: string; description: string; defaultDurationSeconds?: number }
> = {
  REEL: { label: 'Reel', description: 'Vertical 9:16 short video up to 90s', defaultDurationSeconds: 60 },
  SHORT: { label: 'Short', description: 'Vertical short-form video under 60s', defaultDurationSeconds: 60 },
  LONG_VIDEO: { label: 'Long-form Video', description: 'Horizontal 16:9 in-depth video', defaultDurationSeconds: 600 },
  STORY: { label: 'Story', description: '24-hour ephemeral post or slide sequence', defaultDurationSeconds: 15 },
  POST: { label: 'Static Post', description: 'High-res image post with brand caption' },
  CAROUSEL: { label: 'Carousel (Multi-slide)', description: 'Multi-image or graphic slides with swipe engagement' },
  LIVE: { label: 'Live Stream', description: 'Real-time interactive session with live Q&A / product showcase', defaultDurationSeconds: 1800 },
};

export const DELIVERABLE_TYPE_METADATA: Record<
  DeliverableType,
  { label: string; description: string }
> = {
  DEDICATED_VIDEO: {
    label: 'Dedicated Video',
    description: 'Entire deliverable focused 100% on the brand, product, or campaign.',
  },
  BRAND_INTEGRATION: {
    label: 'Brand Integration / Segment',
    description: '60-120s integrated product spotlight within organic content.',
  },
  LOGO_BANNER_PLACEMENT: {
    label: 'Logo / Banner Placement',
    description: 'Visible on-screen branding or watermark throughout the content.',
  },
  AD_CREATIVE: {
    label: 'Performance Ad Creative (UGC)',
    description: 'Content produced specifically for brand paid advertising usage.',
  },
  STORY_MENTION: {
    label: 'Story Mention + Swipe Up',
    description: 'Dedicated slide with direct link sticker and discount code.',
  },
  LINK_IN_BIO: {
    label: 'Link in Bio (30 Days)',
    description: 'Featured top link in creator profile bio with tracking parameters.',
  },
};

export const ADDON_TYPE_METADATA: Record<
  AddonType,
  { label: string; defaultPricingMode: 'PERCENT_OF_BASE' | 'FIXED_AMOUNT'; defaultValue: number; allowedDurations?: number[] }
> = {
  USAGE_RIGHTS: {
    label: 'Paid Ad Usage Rights',
    defaultPricingMode: 'PERCENT_OF_BASE',
    defaultValue: 20,
    allowedDurations: [30, 60, 90, 365],
  },
  EXCLUSIVITY: {
    label: 'Category Exclusivity',
    defaultPricingMode: 'PERCENT_OF_BASE',
    defaultValue: 30,
    allowedDurations: [7, 15, 30, 90],
  },
  RUSH_DELIVERY: {
    label: 'Rush Turnaround (<48h)',
    defaultPricingMode: 'PERCENT_OF_BASE',
    defaultValue: 25,
  },
  EXTRA_REVISION: {
    label: 'Additional Revision Round',
    defaultPricingMode: 'FIXED_AMOUNT',
    defaultValue: 2500,
  },
  RAW_FOOTAGE: {
    label: 'Raw B-Roll & Footage Files',
    defaultPricingMode: 'PERCENT_OF_BASE',
    defaultValue: 35,
  },
  WHITELISTING_SPARK_ADS: {
    label: 'Whitelisting / Spark Ads Access',
    defaultPricingMode: 'PERCENT_OF_BASE',
    defaultValue: 25,
    allowedDurations: [30, 60, 90],
  },
};

export const PLATFORM_FORMAT_MAP: Record<RateCardPlatform, ContentFormat[]> = {
  INSTAGRAM: ['REEL', 'STORY', 'POST', 'CAROUSEL', 'LIVE'],
  YOUTUBE: ['SHORT', 'LONG_VIDEO', 'POST', 'LIVE'],
  TIKTOK: ['SHORT', 'REEL', 'LIVE'],
  FACEBOOK: ['REEL', 'LONG_VIDEO', 'POST', 'STORY', 'LIVE'],
  X: ['POST', 'LONG_VIDEO', 'LIVE'],
  LINKEDIN: ['POST', 'LONG_VIDEO', 'CAROUSEL'],
};

export function isPlatformFormatCompatible(
  platform: RateCardPlatform,
  format: ContentFormat
): boolean {
  const allowed = PLATFORM_FORMAT_MAP[platform];
  return Boolean(allowed && allowed.includes(format));
}

export function getSupportedFormats(platform: RateCardPlatform): ContentFormat[] {
  return PLATFORM_FORMAT_MAP[platform] || [];
}

export function generateSuggestedTitle(
  platform: RateCardPlatform,
  format: ContentFormat,
  deliverableType: DeliverableType,
  durationSeconds?: number | null
): string {
  const platMeta = PLATFORM_METADATA[platform]?.label || platform;
  const formatMeta = FORMAT_METADATA[format]?.label || format;
  const deliverableMeta = DELIVERABLE_TYPE_METADATA[deliverableType]?.label || deliverableType;

  let durationText = '';
  if (durationSeconds) {
    if (durationSeconds < 60) {
      durationText = `${durationSeconds}s `;
    } else {
      const minutes = Math.round(durationSeconds / 60);
      durationText = `${minutes} Min `;
    }
  }

  if (deliverableType === 'DEDICATED_VIDEO') {
    return `${durationText}Dedicated ${platMeta} ${formatMeta}`.trim();
  }
  if (deliverableType === 'BRAND_INTEGRATION') {
    return `${platMeta} ${formatMeta} Brand Integration`.trim();
  }
  return `${platMeta} ${formatMeta} - ${deliverableMeta}`.trim();
}
