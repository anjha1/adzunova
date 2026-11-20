import {
  RateCardItem,
  AddonType,
  PlatformFeeConfig,
  CalculatedQuoteBreakdown,
} from './types';
import { ADDON_TYPE_METADATA } from './compatibility';

export const CURRENT_PLATFORM_FEE_CONFIG: PlatformFeeConfig = {
  version: 'cfg_2026_q4',
  commissionPercent: 10,
  commissionBps: 1000, // 10.00%
  effectiveFrom: '2026-01-01T00:00:00.000Z',
};

export const STANDARD_GST_RATE_PERCENT = 18;
export const STANDARD_GST_BPS = 1800; // 18.00%

/**
 * Calculates a reproducible, decimal-safe breakdown of a deliverable quote.
 * All arithmetic is performed in integer paise (minor units) to prevent floating-point drift.
 */
export function calculateRateCardQuote(
  item: RateCardItem,
  selectedAddonTypes: AddonType[] = [],
  feeConfig: PlatformFeeConfig = CURRENT_PLATFORM_FEE_CONFIG
): CalculatedQuoteBreakdown {
  const basePaise = Math.round(item.price * 100);

  const selectedBreakdown: CalculatedQuoteBreakdown['selectedAddons'] = [];
  let addonsTotalPaise = 0;

  for (const addonType of selectedAddonTypes) {
    const configuredAddon = item.addons?.find(
      (a) => a.type === addonType && a.enabled
    );

    if (configuredAddon) {
      let addonPaise = 0;
      if (configuredAddon.pricingMode === 'PERCENT_OF_BASE') {
        addonPaise = Math.round((basePaise * configuredAddon.value) / 100);
      } else {
        addonPaise = Math.round(configuredAddon.value * 100);
      }

      addonsTotalPaise += addonPaise;
      const meta = ADDON_TYPE_METADATA[addonType];

      selectedBreakdown.push({
        type: addonType,
        label: meta?.label || addonType,
        amount: addonPaise / 100,
        pricingMode: configuredAddon.pricingMode,
        value: configuredAddon.value,
      });
    }
  }

  const subtotalPaise = basePaise + addonsTotalPaise;
  const commissionPaise = Math.round(
    (subtotalPaise * feeConfig.commissionBps) / 10000
  );
  const creatorNetPayoutPaise = Math.max(0, subtotalPaise - commissionPaise);
  const gstPaise = Math.round((subtotalPaise * STANDARD_GST_BPS) / 10000);
  const totalBrandPayablePaise = subtotalPaise + gstPaise;

  return {
    configVersion: feeConfig.version,
    currency: item.currency || 'INR',
    basePrice: basePaise / 100,
    selectedAddons: selectedBreakdown,
    addonsTotal: addonsTotalPaise / 100,
    subtotal: subtotalPaise / 100,
    commissionPercent: feeConfig.commissionPercent,
    commissionAmount: commissionPaise / 100,
    creatorNetPayout: creatorNetPayoutPaise / 100,
    gstRatePercent: STANDARD_GST_RATE_PERCENT,
    gstAmount: gstPaise / 100,
    totalBrandPayable: totalBrandPayablePaise / 100,
    calculatedAt: new Date().toISOString(),
  };
}
