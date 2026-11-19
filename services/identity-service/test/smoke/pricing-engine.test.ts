import { describe, it, expect } from 'vitest';
import {
  PricingEngine,
  RateItemInput,
  BundlePackageInput,
  PricingConfig,
} from '../../../../libs/pricing-engine/src/pricing-engine';
import { ZeroTaxPolicy } from '../../../../libs/pricing-engine/src/tax-policy';

describe('Pricing Engine — Injected Config, Pluggable Tax & Properties', () => {
  it('calculates single reel rate with injected config & immutable version', () => {
    const customConfig: PricingConfig = {
      configVersion: 'cfg_enterprise_2026',
      commissionBps: 800, // 8.00% preferred tier
      rushBps: 2000,
      revisionSurchargeMinorUnits: 200000,
      rounding: 'half-even',
      taxPolicy: new ZeroTaxPolicy(),
    };

    const item: RateItemInput = {
      basePriceMinorUnits: 5000000,
      includedRevisions: 2,
      requestedRevisions: 2,
    };

    const quote = PricingEngine.calculateItemQuote(item, 'USD', customConfig);

    expect(quote.configVersion).toBe('cfg_enterprise_2026');
    expect(quote.subtotalMinorUnits).toBe(5000000);
    // Platform fee 8% = 400,000 minor units ($4,000.00)
    expect(quote.platformFeeMinorUnits).toBe(400000);
    // Net payout = $46,000.00 (4600000 minor units)
    expect(quote.creatorNetPayoutMinorUnits).toBe(4600000);
    expect(quote.taxAmountMinorUnits).toBe(0);
  });

  it('property: sum of parts always equals gross total and net payout is non-negative', () => {
    const testCases: number[] = [1000, 50000, 250000, 10000000, 99999999];

    for (const basePrice of testCases) {
      const item: RateItemInput = {
        basePriceMinorUnits: basePrice,
        usageRights: { type: 'PAID_ADS_30D', percentageMultiplier: 0.2 },
        rushDeliveryDays: 1,
        includedRevisions: 1,
        requestedRevisions: 3,
      };

      const quote = PricingEngine.calculateItemQuote(item);

      // Part sum reconciliation
      const sumOfParts =
        quote.subtotalMinorUnits +
        quote.usageRightsMinorUnits +
        quote.exclusivityMinorUnits +
        quote.rushFeeMinorUnits +
        quote.revisionsFeeMinorUnits;

      expect(sumOfParts).toBe(quote.grossTotalMinorUnits);
      expect(quote.creatorNetPayoutMinorUnits).toBeGreaterThanOrEqual(0);
      expect(quote.creatorNetPayoutMinorUnits).toBe(
        quote.grossTotalMinorUnits - quote.platformFeeMinorUnits
      );
    }
  });

  it('property: quote generation is idempotent for the same input', () => {
    const item: RateItemInput = {
      basePriceMinorUnits: 6500000,
      includedRevisions: 2,
      requestedRevisions: 2,
    };

    const q1 = PricingEngine.calculateItemQuote(item);
    const q2 = PricingEngine.calculateItemQuote(item);

    expect(q1.grossTotalMinorUnits).toBe(q2.grossTotalMinorUnits);
    expect(q1.platformFeeMinorUnits).toBe(q2.platformFeeMinorUnits);
    expect(q1.creatorNetPayoutMinorUnits).toBe(q2.creatorNetPayoutMinorUnits);
  });
});
