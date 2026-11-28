import {
  computeBookingQuote,
  DEFAULT_FEE_CONFIG,
  serializeBookingQuote,
} from '@adzunova/money';
import { AppProblemError } from '@adzunova/problem-details';
import { getRateCardItemById } from '@/lib/rate-card/rate-card-repository';
import { calculateRateCardQuote } from '@/lib/rate-card/quote-calculator';
import type { AddonType } from '@/lib/rate-card/types';
import { getPublicActivePackageById } from '@/lib/creator/packages-repository';

export interface ResolvedBookingQuote {
  itemKind: 'RATE_CARD_ITEM' | 'PACKAGE';
  itemKey: string;
  rateCardItemId: string | null;
  packageId: string | null;
  itemTitle: string;
  pricingType: 'FIXED' | 'NEGOTIABLE';
  itemVersion: number;
  selectedAddons: string[];
  quantity: number;
  feeConfigVersion: string;
  breakdown: Record<string, unknown>;
}

export async function resolveServerBookingQuote(params: {
  creatorId: string;
  rateCardItemId?: string;
  packageId?: string;
  selectedAddons?: string[];
  quantity?: number;
  overrideBasePriceInr?: number;
}): Promise<ResolvedBookingQuote> {
  const quantity = Math.max(1, Math.min(100, Math.trunc(params.quantity ?? 1)));

  if (params.packageId) {
    const pkg = await getPublicActivePackageById(params.creatorId, params.packageId);
    if (!pkg) {
      throw new AppProblemError({
        status: 404,
        code: 'PACKAGE_NOT_AVAILABLE',
        title: 'Package Not Available',
        detail: 'Selected creator package is not active or does not exist.',
      });
    }

    const basePricePaise =
      params.overrideBasePriceInr !== undefined
        ? BigInt(Math.round(params.overrideBasePriceInr * 100))
        : BigInt(pkg.discountedPricePaise);

    const quote = computeBookingQuote({
      basePricePaise,
      addonsPaise: [],
      quantity,
      brandFeeBps: DEFAULT_FEE_CONFIG.brandFeeBps,
      creatorFeeBps: DEFAULT_FEE_CONFIG.creatorFeeBps,
      gstBps: DEFAULT_FEE_CONFIG.gstBps,
      tdsBps: DEFAULT_FEE_CONFIG.tdsBps,
    });

    const exactPaise = serializeBookingQuote(quote);
    return {
      itemKind: 'PACKAGE',
      itemKey: pkg.id,
      rateCardItemId: null,
      packageId: pkg.id,
      itemTitle: pkg.name,
      pricingType: 'FIXED',
      itemVersion: pkg.version,
      selectedAddons: [],
      quantity,
      feeConfigVersion: DEFAULT_FEE_CONFIG.version,
      breakdown: {
        configVersion: DEFAULT_FEE_CONFIG.version,
        currency: 'INR',
        basePrice: Number(quote.basePricePaise) / 100,
        addonsTotal: 0,
        subtotal: Number(quote.deliverableTotalPaise) / 100,
        brandFeeAmount: Number(quote.brandFeePaise) / 100,
        taxableValue: Number(quote.taxableValuePaise) / 100,
        commissionAmount: Number(quote.creatorFeePaise) / 100,
        creatorNetPayout: Number(quote.creatorNetPayoutPaise) / 100,
        gstAmount: Number(quote.gstPaise) / 100,
        totalBrandPayable: Number(quote.brandTotalPayablePaise) / 100,
        exactPaise,
      },
    };
  }

  if (!params.rateCardItemId) {
    throw new AppProblemError({
      status: 400,
      code: 'BOOKING_ITEM_REQUIRED',
      title: 'Deliverable Required',
      detail: 'Select an active rate-card deliverable or package.',
    });
  }

  const item = await getRateCardItemById(params.creatorId, params.rateCardItemId);
  if (!item || item.status !== 'ACTIVE' || item.deletedAt !== null) {
    throw new AppProblemError({
      status: 404,
      code: 'RATE_CARD_ITEM_NOT_AVAILABLE',
      title: 'Deliverable Not Available',
      detail: 'Selected rate-card deliverable is not active or publicly visible.',
    });
  }

  const pricingType = item.priceType === 'NEGOTIABLE' ? 'NEGOTIABLE' : 'FIXED';
  const effectiveItem =
    params.overrideBasePriceInr !== undefined && pricingType === 'NEGOTIABLE'
      ? { ...item, price: params.overrideBasePriceInr }
      : item;

  const selectedAddons = Array.isArray(params.selectedAddons)
    ? (params.selectedAddons as AddonType[])
    : [];

  const breakdown = calculateRateCardQuote(
    effectiveItem,
    selectedAddons,
    undefined,
    quantity
  );

  return {
    itemKind: 'RATE_CARD_ITEM',
    itemKey: item.id,
    rateCardItemId: item.id,
    packageId: null,
    itemTitle: item.title,
    pricingType,
    itemVersion: item.version ?? 1,
    selectedAddons: breakdown.selectedAddons.map((a) => a.type),
    quantity,
    feeConfigVersion: breakdown.configVersion,
    breakdown: breakdown as unknown as Record<string, unknown>,
  };
}
