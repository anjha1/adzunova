export type RateCardPlatform =
  | 'INSTAGRAM'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'FACEBOOK'
  | 'X'
  | 'LINKEDIN';

export type ContentFormat =
  | 'REEL'
  | 'SHORT'
  | 'LONG_VIDEO'
  | 'STORY'
  | 'POST'
  | 'CAROUSEL'
  | 'LIVE';

export type DeliverableType =
  | 'DEDICATED_VIDEO'
  | 'BRAND_INTEGRATION'
  | 'LOGO_BANNER_PLACEMENT'
  | 'AD_CREATIVE'
  | 'STORY_MENTION'
  | 'LINK_IN_BIO';

export type PriceType = 'FIXED' | 'NEGOTIABLE';

export type RateCardStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT';

export type AddonType =
  | 'USAGE_RIGHTS'
  | 'EXCLUSIVITY'
  | 'RUSH_DELIVERY'
  | 'EXTRA_REVISION'
  | 'RAW_FOOTAGE'
  | 'WHITELISTING_SPARK_ADS';

export type AddonPricingMode = 'PERCENT_OF_BASE' | 'FIXED_AMOUNT';

export interface RateCardAddon {
  id: string;
  type: AddonType;
  enabled: boolean;
  pricingMode: AddonPricingMode;
  value: number; // Percentage (e.g. 20 for 20%) or Fixed amount in INR
  durationDays?: number | null; // e.g. 30, 60, 90, 365
  rushWithinHours?: number | null; // default 48
}

export interface RateCardItem {
  id: string;
  creatorId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  platform: RateCardPlatform;
  contentFormat: ContentFormat;
  deliverableType: DeliverableType;
  durationSeconds?: number | null; // 15, 30, 60, 120, 300, 600, or custom
  price: number; // Decimal in standard units, e.g. 25000 (INR)
  currency: string; // Default 'INR'
  priceType: PriceType;
  minimumBookingAmount?: number | null;

  title: string;
  description: string;
  deliveryDays: number; // 1-90
  freeRevisions: number; // 0-10

  publishOnMyChannel: boolean;
  scriptApprovalRequired: boolean;
  status: RateCardStatus;
  visibleToBrands: boolean;
  sortOrder: number;

  addons: RateCardAddon[];
}

export interface PlatformFeeConfig {
  version: string; // e.g. 'cfg_2026_q4'
  commissionPercent: number; // e.g. 10
  commissionBps: number; // e.g. 1000
  effectiveFrom: string;
}

export interface CalculatedQuoteBreakdown {
  configVersion: string;
  currency: string;
  basePrice: number;
  selectedAddons: Array<{
    type: AddonType;
    label: string;
    amount: number;
    pricingMode: AddonPricingMode;
    value: number;
  }>;
  addonsTotal: number;
  subtotal: number; // Base + Addons
  commissionPercent: number;
  commissionAmount: number;
  creatorNetPayout: number; // Subtotal - commissionAmount
  gstRatePercent: number;
  gstAmount: number; // 18% standard GST on subtotal
  totalBrandPayable: number; // Subtotal + gstAmount
  calculatedAt: string;
}
