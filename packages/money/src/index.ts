/**
 * Integer-paise money arithmetic and rounding (round half up).
 * Zero floating-point math; all amounts are bigint minor units (paise),
 * and all rates are integer basis points (bps, 100 bps = 1.00%).
 */

export interface BookingQuoteInput {
  basePricePaise: bigint;
  addonsPaise: readonly bigint[];
  quantity?: number;
  brandFeeBps: number;
  creatorFeeBps: number;
  gstBps: number;
  tdsBps?: number;
}

export const DEFAULT_FEE_CONFIG = {
  version: 'cfg_2026_q4',
  brandFeeBps: 500, // 5.00%
  creatorFeeBps: 500, // 5.00%
  gstBps: 1800, // 18.00%
  tdsBps: 0,
} as const;

export interface BookingQuote {
  basePricePaise: bigint;
  addonsTotalPaise: bigint;
  deliverableTotalPaise: bigint;
  brandFeePaise: bigint;
  taxableValuePaise: bigint;
  gstPaise: bigint;
  brandTotalPayablePaise: bigint;
  creatorFeePaise: bigint;
  tdsPaise: bigint;
  creatorNetPayoutPaise: bigint;
  platformRevenuePaise: bigint;
}

export type SerializedBookingQuote = {
  [K in keyof BookingQuote]: string;
};

export function assertIntegerBps(bps: number, label = 'bps'): void {
  if (!Number.isInteger(bps) || bps < 0 || bps > 10000) {
    throw new RangeError(`Invalid ${label}: expected integer in [0, 10000], got ${bps}`);
  }
}

export function assertNonNegativePaise(amount: bigint, label = 'amountPaise'): void {
  if (typeof amount !== 'bigint') {
    throw new TypeError(`Invalid ${label}: expected bigint`);
  }
  if (amount < BigInt(0)) {
    throw new RangeError(`Invalid ${label}: must be >= 0n`);
  }
}

export function parseMoney(value: string | bigint | number, label = 'amountPaise'): bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) {
      throw new RangeError(`Invalid ${label}: non-integer or unsafe number`);
    }
    return BigInt(value);
  }
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    return BigInt(value.trim());
  }
  throw new TypeError(`Invalid ${label}: expected integer string or bigint`);
}

export function serializeMoney(amountPaise: bigint): string {
  if (typeof amountPaise !== 'bigint') {
    throw new TypeError('serializeMoney expects bigint');
  }
  return amountPaise.toString(10);
}

/**
 * Round half up for basis-point multiplication:
 * roundHalfUp(amount * bps / 10_000)
 */
export function roundHalfUpBps(amountPaise: bigint, bps: number): bigint {
  assertIntegerBps(bps);
  if (amountPaise === BigInt(0) || bps === 0) return BigInt(0);
  if (amountPaise < BigInt(0)) {
    return -roundHalfUpBps(-amountPaise, bps);
  }
  return (amountPaise * BigInt(bps) + BigInt(5000)) / BigInt(10000);
}

/**
 * Compute add-on amount in paise from either PERCENT_OF_BASE (bps = percent * 100) or FIXED paise.
 */
export function computeAddonPaise(
  basePricePaise: bigint,
  mode: 'PERCENT_OF_BASE' | 'FIXED' | 'FIXED_AMOUNT',
  value: number
): bigint {
  assertNonNegativePaise(basePricePaise, 'basePricePaise');
  if (mode === 'PERCENT_OF_BASE') {
    const bps = Math.trunc(value * 100);
    return roundHalfUpBps(basePricePaise, bps);
  }
  return BigInt(Math.trunc(value * 100));
}

/**
 * Server-side canonical quote calculation matching Payment System Spec §3.2.
 */
export function computeBookingQuote(input: BookingQuoteInput): BookingQuote {
  assertNonNegativePaise(input.basePricePaise, 'basePricePaise');
  const quantity = input.quantity ?? 1;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
    throw new RangeError(`Invalid quantity: expected integer in [1, 1000], got ${quantity}`);
  }
  assertIntegerBps(input.brandFeeBps, 'brandFeeBps');
  assertIntegerBps(input.creatorFeeBps, 'creatorFeeBps');
  assertIntegerBps(input.gstBps, 'gstBps');
  const tdsBps = input.tdsBps ?? 0;
  assertIntegerBps(tdsBps, 'tdsBps');

  const unitAddonsTotalPaise = (() => {
    let sum = BigInt(0);
    for (let i = 0; i < input.addonsPaise.length; i++) {
      const addon = input.addonsPaise[i];
      assertNonNegativePaise(addon, `addonsPaise[${i}]`);
      sum += addon;
    }
    return sum;
  })();

  const qty = BigInt(quantity);
  const scaledBasePricePaise = input.basePricePaise * qty;
  const addonsTotalPaise = unitAddonsTotalPaise * qty;
  const deliverableTotalPaise = scaledBasePricePaise + addonsTotalPaise;
  const brandFeePaise = roundHalfUpBps(deliverableTotalPaise, input.brandFeeBps);
  const taxableValuePaise = deliverableTotalPaise + brandFeePaise;
  const gstPaise = roundHalfUpBps(taxableValuePaise, input.gstBps);
  const brandTotalPayablePaise = taxableValuePaise + gstPaise;

  const creatorFeePaise = roundHalfUpBps(deliverableTotalPaise, input.creatorFeeBps);
  const tdsPaise = roundHalfUpBps(deliverableTotalPaise, tdsBps);
  const creatorNetPayoutPaise = deliverableTotalPaise - creatorFeePaise - tdsPaise;
  if (creatorNetPayoutPaise < BigInt(0)) {
    throw new RangeError('creatorNetPayoutPaise cannot be negative');
  }

  const platformRevenuePaise = brandFeePaise + creatorFeePaise;

  return {
    basePricePaise: scaledBasePricePaise,
    addonsTotalPaise,
    deliverableTotalPaise,
    brandFeePaise,
    taxableValuePaise,
    gstPaise,
    brandTotalPayablePaise,
    creatorFeePaise,
    tdsPaise,
    creatorNetPayoutPaise,
    platformRevenuePaise,
  };
}

export function serializeBookingQuote(quote: BookingQuote): SerializedBookingQuote {
  return {
    basePricePaise: serializeMoney(quote.basePricePaise),
    addonsTotalPaise: serializeMoney(quote.addonsTotalPaise),
    deliverableTotalPaise: serializeMoney(quote.deliverableTotalPaise),
    brandFeePaise: serializeMoney(quote.brandFeePaise),
    taxableValuePaise: serializeMoney(quote.taxableValuePaise),
    gstPaise: serializeMoney(quote.gstPaise),
    brandTotalPayablePaise: serializeMoney(quote.brandTotalPayablePaise),
    creatorFeePaise: serializeMoney(quote.creatorFeePaise),
    tdsPaise: serializeMoney(quote.tdsPaise),
    creatorNetPayoutPaise: serializeMoney(quote.creatorNetPayoutPaise),
    platformRevenuePaise: serializeMoney(quote.platformRevenuePaise),
  };
}

export function formatInrFromPaise(amountPaise: bigint): string {
  const negative = amountPaise < BigInt(0);
  const abs = negative ? -amountPaise : amountPaise;
  const rupees = abs / BigInt(100);
  const paise = abs % BigInt(100);
  const rupeesStr = rupees.toString(10);
  const paiseStr = paise === BigInt(0) ? '' : `.${paise.toString(10).padStart(2, '0')}`;
  return `${negative ? '-' : ''}₹${rupeesStr}${paiseStr}`;
}
