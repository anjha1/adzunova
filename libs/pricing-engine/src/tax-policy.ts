/**
 * Pluggable Tax Policy Interface & Implementations
 */

export interface TaxContext {
  countryCode: string; // ISO 3166-1 alpha-2 e.g. "IN", "US", "GB", "AE"
  stateProvince?: string;
  isExportService: boolean;
  isRegisteredBusiness: boolean;
}

export interface TaxCalculationResult {
  taxName: string;
  taxRateBps: number; // Basis points (e.g. 1800 = 18.00%)
  taxAmountMinorUnits: number;
}

export interface TaxPolicyPort {
  calculateTax(grossAmountMinorUnits: number, context: TaxContext): TaxCalculationResult;
}

/**
 * India GST Tax Policy Adapter (18% standard IGST / CGST+SGST on digital & advertising services)
 */
export class IndiaGstTaxPolicy implements TaxPolicyPort {
  private static readonly GST_RATE_BPS = 1800; // 18.00%

  calculateTax(grossAmountMinorUnits: number, context: TaxContext): TaxCalculationResult {
    if (context.countryCode !== 'IN') {
      return { taxName: 'NONE', taxRateBps: 0, taxAmountMinorUnits: 0 };
    }

    if (context.isExportService) {
      return { taxName: 'GST (Zero-rated Export)', taxRateBps: 0, taxAmountMinorUnits: 0 };
    }

    const taxAmount = Math.round((grossAmountMinorUnits * IndiaGstTaxPolicy.GST_RATE_BPS) / 10000);
    return {
      taxName: 'GST (18%)',
      taxRateBps: IndiaGstTaxPolicy.GST_RATE_BPS,
      taxAmountMinorUnits: taxAmount,
    };
  }
}

/**
 * Zero Tax Policy Adapter (for tax-free regions / non-registered individuals)
 */
export class ZeroTaxPolicy implements TaxPolicyPort {
  calculateTax(): TaxCalculationResult {
    return { taxName: 'EXEMPT', taxRateBps: 0, taxAmountMinorUnits: 0 };
  }
}
