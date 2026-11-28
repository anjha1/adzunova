import { buildPublicCdnUrl } from './delivery';

/**
 * Compatibility Shim for live creator/brand URLs (avatarUrl, coverUrl, logoUrl).
 * Preserves all existing external URLs (Google OAuth, Meta CDN, etc.) while seamlessly
 * resolving new `public/...` R2 keys through NEXT_PUBLIC_CDN_BASE.
 */
export function resolveDisplayAssetUrl(
  rawUrlOrKey: string | null | undefined,
  cdnBase = process.env.NEXT_PUBLIC_CDN_BASE || ''
): string | null {
  if (!rawUrlOrKey) return null;
  const trimmed = rawUrlOrKey.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('public/')) {
    if (!cdnBase) return null;
    return buildPublicCdnUrl(trimmed, cdnBase);
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return null;
}
