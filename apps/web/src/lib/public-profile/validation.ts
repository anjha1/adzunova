import { z } from 'zod';

export const RESERVED_SLUGS = new Set([
  'admin',
  'api',
  'app',
  'auth',
  'brand',
  'c',
  'checkout',
  'contracts',
  'creator',
  'creators',
  'dashboard',
  'deals',
  'docs',
  'escrow',
  'explore',
  'faq',
  'for-brands',
  'for-creators',
  'help',
  'home',
  'identity',
  'inbox',
  'legal',
  'login',
  'logout',
  'media-kit',
  'messages',
  'notifications',
  'onboarding',
  'packages',
  'payouts',
  'pricing',
  'privacy',
  'profile',
  'public',
  'rate-card',
  'register',
  'report',
  'resources',
  'root',
  'security',
  'settings',
  'signin',
  'signup',
  'solutions',
  'support',
  'terms',
  'trust',
  'verify',
  'wallet',
  'webhook',
  'webhooks',
]);

export const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;

export function isValidSlugFormat(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const lower = slug.toLowerCase().trim();
  if (lower.length < 3 || lower.length > 30) return false;
  if (lower.includes('--')) return false; // reject consecutive hyphens
  return SLUG_REGEX.test(lower);
}

export function isReservedSlug(slug: string): boolean {
  if (!slug) return true;
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
}

export function validateSlug(slug: string): { isValid: boolean; error?: string } {
  const normalized = String(slug || '').toLowerCase().trim();

  if (!normalized) {
    return { isValid: false, error: 'Slug is required.' };
  }
  if (normalized.length < 3) {
    return { isValid: false, error: 'Slug must be at least 3 characters long.' };
  }
  if (normalized.length > 30) {
    return { isValid: false, error: 'Slug cannot exceed 30 characters.' };
  }
  if (normalized.startsWith('-') || normalized.endsWith('-')) {
    return { isValid: false, error: 'Slug cannot begin or end with a hyphen.' };
  }
  if (normalized.includes('--')) {
    return { isValid: false, error: 'Slug cannot contain consecutive hyphens.' };
  }
  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return { isValid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens.' };
  }
  if (isReservedSlug(normalized)) {
    return { isValid: false, error: `"${normalized}" is a reserved system keyword. Please choose another.` };
  }

  return { isValid: true };
}

// Validation schemas
export const updatePublicProfileSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .refine((s) => !s.startsWith('-') && !s.endsWith('-'), 'Slug cannot begin or end with a hyphen')
    .refine((s) => !s.includes('--'), 'Slug cannot contain consecutive hyphens')
    .refine((s) => !RESERVED_SLUGS.has(s.toLowerCase().trim()), 'Slug is reserved by the system')
    .optional(),
  displayName: z.string().min(1).max(80).optional(),
  bio: z.string().max(280).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  languages: z.array(z.string().max(30)).max(10).optional(),
  location: z.string().max(100).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  coverUrl: z.string().url().nullable().optional(),
  allowIndexing: z.boolean().optional(),
  sectionVisibility: z
    .object({
      platforms: z.boolean().optional(),
      stats: z.boolean().optional(),
      audience: z.boolean().optional(),
      topContent: z.boolean().optional(),
      rateCard: z.boolean().optional(),
      packages: z.boolean().optional(),
    })
    .optional(),
  hiddenPlatformIds: z.array(z.string()).optional(),
  pinnedContentIds: z.array(z.string()).max(6).optional(),
  hidePricesPerItem: z.record(z.string(), z.boolean()).optional(),
});

export const profileReportSchema = z.object({
  reason: z.enum(['IMPERSONATION', 'MISLEADING_STATS', 'HARASSMENT', 'SCAM', 'OTHER']),
  details: z.string().min(5, 'Please provide at least 5 characters of detail').max(1000),
  honeypot: z.string().max(0, 'Bot detected').optional(), // Anti-bot honeypot
});

export const profileEventSchema = z.object({
  eventType: z.enum(['VIEW', 'SHARE_CLICK', 'RATECARD_VIEW', 'PLATFORM_LINK_CLICK', 'MESSAGE_CTA_CLICK', 'REPORT']),
  metadata: z.record(z.string(), z.any()).optional(),
});
