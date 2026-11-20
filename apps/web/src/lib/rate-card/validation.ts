import { z } from 'zod';
import { isPlatformFormatCompatible } from './compatibility';
import {
  RateCardPlatform,
  ContentFormat,
  DeliverableType,
  PriceType,
  RateCardStatus,
  AddonType,
  AddonPricingMode,
} from './types';

export const platformEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'FACEBOOK',
  'X',
  'LINKEDIN',
] as const);

export const contentFormatEnum = z.enum([
  'REEL',
  'SHORT',
  'LONG_VIDEO',
  'STORY',
  'POST',
  'CAROUSEL',
  'LIVE',
] as const);

export const deliverableTypeEnum = z.enum([
  'DEDICATED_VIDEO',
  'BRAND_INTEGRATION',
  'LOGO_BANNER_PLACEMENT',
  'AD_CREATIVE',
  'STORY_MENTION',
  'LINK_IN_BIO',
] as const);

export const priceTypeEnum = z.enum(['FIXED', 'NEGOTIABLE'] as const);

export const rateCardStatusEnum = z.enum(['ACTIVE', 'PAUSED', 'DRAFT'] as const);

export const addonTypeEnum = z.enum([
  'USAGE_RIGHTS',
  'EXCLUSIVITY',
  'RUSH_DELIVERY',
  'EXTRA_REVISION',
  'RAW_FOOTAGE',
  'WHITELISTING_SPARK_ADS',
] as const);

export const addonPricingModeEnum = z.enum([
  'PERCENT_OF_BASE',
  'FIXED_AMOUNT',
] as const);

export const rateCardAddonSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  type: addonTypeEnum,
  enabled: z.boolean().default(true),
  pricingMode: addonPricingModeEnum,
  value: z.number().min(0, 'Add-on value must be non-negative'),
  durationDays: z.number().int().positive().nullable().optional(),
  rushWithinHours: z.number().int().positive().nullable().optional(),
});

export const createRateCardItemSchema = z
  .object({
    platform: platformEnum,
    contentFormat: contentFormatEnum,
    deliverableType: deliverableTypeEnum,
    durationSeconds: z.number().int().positive().nullable().optional(),
    price: z.number().min(0, 'Price cannot be negative'),
    currency: z.string().min(3).max(3).default('INR'),
    priceType: priceTypeEnum.default('FIXED'),
    minimumBookingAmount: z.number().positive().nullable().optional(),
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(80, 'Title cannot exceed 80 characters'),
    description: z.string().max(1000, 'Description cannot exceed 1000 characters').default(''),
    deliveryDays: z.number().int().min(1, 'Delivery must be at least 1 day').max(90, 'Delivery cannot exceed 90 days'),
    freeRevisions: z.number().int().min(0, 'Revisions cannot be negative').max(10, 'Revisions cannot exceed 10').default(1),
    publishOnMyChannel: z.boolean().default(true),
    scriptApprovalRequired: z.boolean().default(true),
    status: rateCardStatusEnum.default('ACTIVE'),
    visibleToBrands: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
    addons: z.array(rateCardAddonSchema).default([]),
  })
  .refine(
    (data) => isPlatformFormatCompatible(data.platform, data.contentFormat),
    {
      message: 'The selected content format is not supported on this platform',
      path: ['contentFormat'],
    }
  )
  .refine(
    (data) => {
      if (data.status === 'ACTIVE' && data.price <= 0) {
        return false;
      }
      return true;
    },
    {
      message: 'Active rate card deliverables must have a starting price greater than ₹0',
      path: ['price'],
    }
  );

export const updateRateCardItemSchema = createRateCardItemSchema.and(
  z.object({
    version: z.number().int().positive({ message: 'Version is required for optimistic concurrency' }),
  })
);

export const updateRateCardStatusSchema = z.object({
  status: rateCardStatusEnum,
  expectedVersion: z.number().int().positive().optional(),
});

export const reorderRateCardItemsSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1, 'At least one item id required'),
});

export const quoteSimulationRequestSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  selectedAddonTypes: z.array(addonTypeEnum).default([]),
});

export type CreateRateCardItemInput = z.infer<typeof createRateCardItemSchema>;
export type UpdateRateCardItemInput = z.infer<typeof updateRateCardItemSchema>;
export type UpdateRateCardStatusInput = z.infer<typeof updateRateCardStatusSchema>;
export type ReorderRateCardItemsInput = z.infer<typeof reorderRateCardItemsSchema>;
export type QuoteSimulationRequest = z.infer<typeof quoteSimulationRequestSchema>;
