/**
 * Client-safe pure formatters and sanitizers for Public Creator Profile.
 * Zero external database or backend dependencies.
 */

const STOCK_PHOTO_DOMAINS = [
  'images.unsplash.com',
  'unsplash.com',
  'images.pexels.com',
  'pexels.com',
  'pixabay.com',
  'stock.adobe.com',
  'shutterstock.com',
  'gettyimages.com',
  'istockphoto.com',
];

/**
 * Checks if a given URL is hosted on a known stock image service.
 */
export function isStockPhotoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return STOCK_PHOTO_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Formats a decimal ratio or raw percentage string/number into an honest percentage string:
 * e.g. 0.9942 -> "99.4%", 99.42 -> "99.4%"
 */
export function formatRatioToPercent(ratio: number | null | undefined): string {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return '—';
  const num = Number(ratio);
  if (num <= 0) return '0%';
  // Decimal ratio between 0 and 1.0 (e.g. 0.9942 -> 99.42%)
  if (num <= 1.0) {
    const pct = num * 100;
    return `${(Math.round(pct * 10) / 10).toFixed(1)}%`;
  }
  // Already a 0-100 percentage
  return `${(Math.round(num * 10) / 10).toFixed(1)}%`;
}

/**
 * Format numbers in the Indian numbering system:
 * e.g. 125000 -> "₹1,25,000"
 */
export function formatIndianRupees(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Formats large follower and view counts concisely using Indian/International locale:
 * e.g. 1580 -> "1.58K", 150000 -> "1.5L" (or 150K), 1200000 -> "1.2M"
 */
export function formatCompactCount(count: number, locale = 'en-IN'): string {
  if (!count || count <= 0) return '0';
  if (count >= 10_000_000) {
    return `${(count / 10_000_000).toFixed(1).replace(/\.0$/, '')}Cr`;
  }
  if (count >= 100_000) {
    return `${(count / 100_000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  if (count >= 1_000) {
    const val = (count / 1_000).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${val}K`;
  }
  return count.toLocaleString(locale);
}

/**
 * Sanitize untrusted user-supplied string against XSS & script injection.
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/[<>]/g, '') // strip any remaining angle brackets
    .trim();
}

/**
 * Safe external URL validation (HTTP/HTTPS only).
 */
export function sanitizeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolves full country name using Intl.DisplayNames, with fallback to code.
 */
export function getCountryDisplayName(countryCode: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
    return displayNames.of(countryCode.toUpperCase()) || countryCode;
  } catch {
    return countryCode;
  }
}

/**
 * Formats a verified-at label using creator locale
 */
export function formatVerifiedViaLabel(date: Date | string | null, locale?: string): string {
  if (!date) return 'Verified via Instagram API';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Verified via Instagram API';
    const formatted = d.toLocaleDateString(locale || 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `Verified via Instagram API on ${formatted}`;
  } catch {
    return 'Verified via Instagram API';
  }
}
