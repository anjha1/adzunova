import { TaxPolicyPort, TaxContext, IndiaGstTaxPolicy } from './tax-policy';
import { FxPort, FxRateResult } from './fx-port';

/**
 * Standard ISO 4217 Currency Definition Table
 * minorUnitExponent:
 *  - 2 for INR (paise), USD (cents), EUR (cents), AED (fils)
 *  - 0 for JPY (yen), KRW (won)
 *  - 3 for BHD, KWD, OMR
 */
export interface CurrencyDefinition {
  code: string;
  symbol: string;
  minorUnitExponent: number;
}

export const CURRENCY_TABLE: Record<string, CurrencyDefinition> = {
  INR: { code: 'INR', symbol: '₹', minorUnitExponent: 2 },
  USD: { code: 'USD', symbol: '$', minorUnitExponent: 2 },
  EUR: { code: 'EUR', symbol: '€', minorUnitExponent: 2 },
  AED: { code: 'AED', symbol: 'د.إ', minorUnitExponent: 2 },
  GBP: { code: 'GBP', symbol: '£', minorUnitExponent: 2 },
  JPY: { code: 'JPY', symbol: '¥', minorUnitExponent: 0 },
};

export interface PricingConfig {
  configVersion: string; // e.g. "cfg_v2.4.0" (immutable quote guarantee)
  commissionBps: number; // e.g. 1000 = 10.00%
  rushBps: number; // e.g. 2500 = 25.00%
  revisionSurchargeMinorUnits: number; // in currency base units
  rounding: 'half-even' | 'half-up';
  taxPolicy: TaxPolicyPort;
}

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  configVersion: 'cfg_2026_q4',
  commissionBps: 1000, // 10.00% platform commission
  rushBps: 2500, // +25.00% rush surcharge
  revisionSurchargeMinorUnits: 250000, // ₹2,500.00 per revision
  rounding: 'half-even',
  taxPolicy: new IndiaGstTaxPolicy(),
};

export interface UsageRightsAddon {
  type: 'ORGANIC_ONLY' | 'PAID_ADS_30D' | 'PAID_ADS_90D' | 'PERPETUAL_WHITELIST';
  percentageMultiplier: number;
}

export interface ExclusivityAddon {
  category: string;
  days: number;
  fixedFeeMinorUnits: number;
}

export interface RateItemInput {
  basePriceMinorUnits: number;
  durationSeconds?: number;
  shootHours?: number;
  usageRights?: UsageRightsAddon;
  exclusivity?: ExclusivityAddon;
  rushDeliveryDays?: number;
  includedRevisions: number;
  requestedRevisions: number;
}

export interface BundlePackageInput {
  name: string;
  items: RateItemInput[];
  bundleDiscountPercent: number;
}

export interface CalculatedQuote {
  configVersion: string;
  subtotalMinorUnits: number;
  usageRightsMinorUnits: number;
  exclusivityMinorUnits: number;
  rushFeeMinorUnits: number;
  revisionsFeeMinorUnits: number;
  bundleDiscountMinorUnits: number;
  grossTotalMinorUnits: number;
  platformFeeMinorUnits: number;
  taxName: string;
  taxAmountMinorUnits: number;
  creatorNetPayoutMinorUnits: number;
  currency: string;
  fxRate?: FxRateResult;
  calculatedAt: string;
}

export class PricingEngine {
  /**
   * Banker's rounding / round half to even
   */
  public static roundHalfEven(val: number): number {
    const floor = Math.floor(val);
    const diff = val - floor;
    if (diff === 0.5) {
      return floor % 2 === 0 ? floor : floor + 1;
    }
    return Math.round(val);
  }

  public static round(val: number, method: 'half-even' | 'half-up'): number {
    return method === 'half-even' ? this.roundHalfEven(val) : Math.round(val);
  }

  /**
   * Calculate single rate item quote
   */
  public static calculateItemQuote(
    item: RateItemInput,
    currency = 'INR',
    config: PricingConfig = DEFAULT_PRICING_CONFIG,
    taxContext: TaxContext = { countryCode: 'IN', isExportService: false, isRegisteredBusiness: false }
  ): CalculatedQuote {
    let subtotal = item.basePriceMinorUnits;

    if (item.shootHours && item.shootHours > 1) {
      subtotal = subtotal * item.shootHours;
    }

    let usageRights = 0;
    if (item.usageRights && item.usageRights.percentageMultiplier > 0) {
      usageRights = this.round(subtotal * item.usageRights.percentageMultiplier, config.rounding);
    }

    let exclusivity = 0;
    if (item.exclusivity && item.exclusivity.fixedFeeMinorUnits > 0) {
      exclusivity = item.exclusivity.fixedFeeMinorUnits;
    }

    let rushFee = 0;
    if (item.rushDeliveryDays !== undefined && item.rushDeliveryDays <= 2) {
      rushFee = this.round((subtotal * config.rushBps) / 10000, config.rounding);
    }

    let revisionsFee = 0;
    if (item.requestedRevisions > item.includedRevisions) {
      const extra = item.requestedRevisions - item.includedRevisions;
      revisionsFee = extra * config.revisionSurchargeMinorUnits;
    }

    const grossTotal = subtotal + usageRights + exclusivity + rushFee + revisionsFee;
    const platformFee = this.round((grossTotal * config.commissionBps) / 10000, config.rounding);
    const taxResult = config.taxPolicy.calculateTax(grossTotal, taxContext);
    const creatorNetPayout = grossTotal - platformFee;

    return {
      configVersion: config.configVersion,
      subtotalMinorUnits: subtotal,
      usageRightsMinorUnits: usageRights,
      exclusivityMinorUnits: exclusivity,
      rushFeeMinorUnits: rushFee,
      revisionsFeeMinorUnits: revisionsFee,
      bundleDiscountMinorUnits: 0,
      grossTotalMinorUnits: grossTotal,
      platformFeeMinorUnits: platformFee,
      taxName: taxResult.taxName,
      taxAmountMinorUnits: taxResult.taxAmountMinorUnits,
      creatorNetPayoutMinorUnits: creatorNetPayout,
      currency,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate combo package / bundle quote
   */
  public static calculateBundleQuote(
    bundle: BundlePackageInput,
    currency = 'INR',
    config: PricingConfig = DEFAULT_PRICING_CONFIG,
    taxContext: TaxContext = { countryCode: 'IN', isExportService: false, isRegisteredBusiness: false }
  ): CalculatedQuote {
    let combinedSubtotal = 0;
    let combinedUsageRights = 0;
    let combinedExclusivity = 0;
    let combinedRush = 0;
    let combinedRevisions = 0;

    for (const item of bundle.items) {
      const q = this.calculateItemQuote(item, currency, config, taxContext);
      combinedSubtotal += q.subtotalMinorUnits;
      combinedUsageRights += q.usageRightsMinorUnits;
      combinedExclusivity += q.exclusivityMinorUnits;
      combinedRush += q.rushFeeMinorUnits;
      combinedRevisions += q.revisionsFeeMinorUnits;
    }

    const preDiscountTotal =
      combinedSubtotal + combinedUsageRights + combinedExclusivity + combinedRush + combinedRevisions;

    const discountAmount = this.round(
      (preDiscountTotal * (bundle.bundleDiscountPercent * 100)) / 10000,
      config.rounding
    );
    const grossTotal = preDiscountTotal - discountAmount;
    const platformFee = this.round((grossTotal * config.commissionBps) / 10000, config.rounding);
    const taxResult = config.taxPolicy.calculateTax(grossTotal, taxContext);
    const creatorNetPayout = grossTotal - platformFee;

    return {
      configVersion: config.configVersion,
      subtotalMinorUnits: combinedSubtotal,
      usageRightsMinorUnits: combinedUsageRights,
      exclusivityMinorUnits: combinedExclusivity,
      rushFeeMinorUnits: combinedRush,
      revisionsFeeMinorUnits: combinedRevisions,
      bundleDiscountMinorUnits: discountAmount,
      grossTotalMinorUnits: grossTotal,
      platformFeeMinorUnits: platformFee,
      taxName: taxResult.taxName,
      taxAmountMinorUnits: taxResult.taxAmountMinorUnits,
      creatorNetPayoutMinorUnits: creatorNetPayout,
      currency,
      calculatedAt: new Date().toISOString(),
    };
  }
}
