export interface FxRateResult {
  fromCurrency: string;
  toCurrency: string;
  rate: number; // e.g. 84.50
  timestamp: string; // ISO 8601
  provider: string;
}

export interface FxPort {
  getRate(fromCurrency: string, toCurrency: string): Promise<FxRateResult>;
  convert(amountMinorUnits: number, fromCurrency: string, toCurrency: string): Promise<{ convertedMinorUnits: number; fxRate: FxRateResult }>;
}

export class StaticFxAdapter implements FxPort {
  private static readonly RATES: Record<string, Record<string, number>> = {
    USD: { INR: 86.5, AED: 3.67, EUR: 0.95, JPY: 155.0 },
    INR: { USD: 1 / 86.5, AED: 3.67 / 86.5, EUR: 0.95 / 86.5, JPY: 155.0 / 86.5 },
  };

  async getRate(fromCurrency: string, toCurrency: string): Promise<FxRateResult> {
    if (fromCurrency === toCurrency) {
      return { fromCurrency, toCurrency, rate: 1.0, timestamp: new Date().toISOString(), provider: 'IDENTITY' };
    }

    const rate = StaticFxAdapter.RATES[fromCurrency]?.[toCurrency] ?? 1.0;
    return {
      fromCurrency,
      toCurrency,
      rate,
      timestamp: new Date().toISOString(),
      provider: 'ADZUNOVA_CENTRAL_FX_CACHE',
    };
  }

  async convert(amountMinorUnits: number, fromCurrency: string, toCurrency: string) {
    const fxRate = await this.getRate(fromCurrency, toCurrency);
    const converted = Math.round(amountMinorUnits * fxRate.rate);
    return { convertedMinorUnits: converted, fxRate };
  }
}
