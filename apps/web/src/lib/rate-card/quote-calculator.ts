import {
  computeAddonPaise,
  computeBookingQuote,
  DEFAULT_FEE_CONFIG,
  serializeBookingQuote,
} from '@adzunova/money';
import {
  RateCardItem,
  AddonType,
  PlatformFeeConfig,
  CalculatedQuoteBreakdown,
} from './types';
import { ADDON_TYPE_METADATA } from './compatibility';

export const CURRENT_PLATFORM_FEE_CONFIG: PlatformFeeConfig = {
  version: DEFAULT_FEE_CONFIG.version,
  commissionPercent: (DEFAULT_FEE_CONFIG.brandFeeBps + DEFAULT_FEE_CONFIG.creatorFeeBps) / 100,
  commissionBps: DEFAULT_FEE_CONFIG.brandFeeBps + DEFAULT_FEE_CONFIG.creatorFeeBps,
  effectiveFrom: '2026-01-01T00:00:00.000Z',
};

export const STANDARD_GST_RATE_PERCENT = DEFAULT_FEE_CONFIG.gstBps / 100;
export const STANDARD_GST_BPS = DEFAULT_FEE_CONFIG.gstBps;

/**
 * Single source of truth: delegates all quote math to @adzunova/money computeBookingQuote.
 */
export function calculateRateCardQuote(
  item: RateCardItem,
  selectedAddonTypes: AddonType[] = [],
  feeConfig: PlatformFeeConfig = CURRENT_PLATFORM_FEE_CONFIG,
  quantity = 1
): CalculatedQuoteBreakdown {
  const basePricePaise = BigInt(Math.round(item.price * 100));
  const selectedBreakdown: CalculatedQuoteBreakdown['selectedAddons'] = [];
  const addonsPaise: bigint[] = [];

  for (const addonType of selectedAddonTypes) {
    const configuredAddon = item.addons?.find(
      (a) => a.type === addonType && a.enabled
    );
    if (configuredAddon) {
      const addonPaise = computeAddonPaise(
        basePricePaise,
        configuredAddon.pricingMode,
        configuredAddon.value
      );
      addonsPaise.push(addonPaise);
      const meta = ADDON_TYPE_METADATA[addonType];
      selectedBreakdown.push({
        type: addonType,
        label: meta?.label || addonType,
        amount: Number(addonPaise) / 100,
        pricingMode: configuredAddon.pricingMode,
        value: configuredAddon.value,
      });
    }
  }

  // Split total platform commission evenly unless overridden
  const halfBps = Math.floor(feeConfig.commissionBps / 2);
  const creatorFeeBps = feeConfig.commissionBps - halfBps;

  const quote = computeBookingQuote({
    basePricePaise,
    addonsPaise,
    quantity,
    brandFeeBps: halfBps,
    creatorFeeBps,
    gstBps: STANDARD_GST_BPS,
    tdsBps: DEFAULT_FEE_CONFIG.tdsBps,
  });

  return {
    configVersion: feeConfig.version,
    currency: item.currency || 'INR',
    basePrice: Number(quote.basePricePaise) / 100,
    selectedAddons: selectedBreakdown,
    addonsTotal: Number(quote.addonsTotalPaise) / 100,
    subtotal: Number(quote.deliverableTotalPaise) / 100,
    brandFeeAmount: Number(quote.brandFeePaise) / 100,
    taxableValue: Number(quote.taxableValuePaise) / 100,
    commissionPercent: creatorFeeBps / 100,
    commissionAmount: Number(quote.creatorFeePaise) / 100,
    creatorNetPayout: Number(quote.creatorNetPayoutPaise) / 100,
    gstRatePercent: STANDARD_GST_RATE_PERCENT,
    gstAmount: Number(quote.gstPaise) / 100,
    totalBrandPayable: Number(quote.brandTotalPayablePaise) / 100,
    exactPaise: serializeBookingQuote(quote),
    calculatedAt: new Date().toISOString(),
  };
}
