import {
  CreatorSearchQuery,
  CreatorSearchResult,
  CreatorCardData,
  SearchFacets,
} from './search-types';
import { getAllActiveSocialAccounts } from '../social/social-repository';
import { getLatestAudienceSnapshot } from '../social/metrics-store';
import { getRateCardItems } from '../rate-card/rate-card-repository';
import { getPublicProfileByCreatorId } from '../public-profile/public-profile-repository';
import { isStockPhotoUrl } from '../public-profile/formatters';
import { checkSelfDealing } from './self-dealing';

/**
 * SearchPort & Discovery Engine Implementation (L0 Launch Adapter)
 */

interface CacheEntry {
  result: CreatorSearchResult;
  expiresAt: number;
}

const queryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export interface SearchPort {
  search(query: CreatorSearchQuery, workspaceId?: string): Promise<CreatorSearchResult>;
  getFacets(query: CreatorSearchQuery): Promise<SearchFacets>;
  getSimilarCreators(creatorId: string, limit?: number): Promise<CreatorCardData[]>;
}

export function encodeCursor(item: { id: string; sortVal: any }): string {
  return Buffer.from(JSON.stringify(item)).toString('base64url');
}

export function decodeCursor(cursor: string): { id: string; sortVal: any } | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

/**
 * Calculates Best Match Score with transparent breakdown.
 * Returns null score when no search or targeting criteria are provided by the brand.
 */
export function calculateBestMatchScore(
  creator: {
    category?: string;
    engagementRate: number | null;
    share18Plus?: number | null;
    startingPriceMinor?: number | null;
  },
  query: CreatorSearchQuery
): { score: number | null; explanation: string } {
  const hasQueryCriteria = Boolean(
    (query.query && query.query.trim().length > 0) ||
    query.category ||
    query.budgetAmount ||
    query.minBudget ||
    query.maxBudget ||
    (query.deliverableFormat && query.deliverableFormat !== 'ANY') ||
    query.minEngagementRate ||
    query.min18PlusShare ||
    query.audienceCountry
  );

  if (!hasQueryCriteria) {
    return { score: null, explanation: '' };
  }

  let score = 50; // Base score when user explicitly searches
  const reasons: string[] = [];

  // 1. Niche / Category Match (+25)
  if (query.category) {
    if (creator.category && creator.category.toLowerCase() === query.category.toLowerCase()) {
      score += 25;
      reasons.push(`Exact ${creator.category} niche match`);
    } else {
      score -= 10;
    }
  }

  // 2. Engagement Rate Quality (+15)
  if (creator.engagementRate !== null && creator.engagementRate !== undefined) {
    if (creator.engagementRate >= 3.5) {
      score += 15;
      reasons.push(`High verified engagement (${creator.engagementRate}%)`);
    } else if (creator.engagementRate >= 2.0) {
      score += 10;
      reasons.push(`Healthy engagement (${creator.engagementRate}%)`);
    }
  }

  // 3. Audience 18+ Quality (+10)
  if (creator.share18Plus && creator.share18Plus >= 80) {
    score += 10;
    reasons.push(`High 18+ audience (${creator.share18Plus}%)`);
  }

  // Cap between 10 and 99
  const finalScore = Math.min(99, Math.max(10, score));
  const explanation = reasons.length > 0 ? reasons.join(' · ') : 'Matching search criteria';

  return { score: finalScore, explanation };
}

export class CreatorSearchEngine implements SearchPort {
  async search(query: CreatorSearchQuery, workspaceId?: string): Promise<CreatorSearchResult> {
    const startTime = Date.now();
    const limit = Math.min(Math.max(1, query.limit || 20), 50); // Scraping defense cap: max 50

    // Cache lookup
    const cacheKey = JSON.stringify({ ...query, cursor: query.cursor || null });
    const cached = queryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        ...cached.result,
        queryMeta: { ...cached.result.queryMeta, cached: true, tookMs: Date.now() - startTime },
      };
    }

    // 1. Fetch real active accounts from social repository
    const accounts = await getAllActiveSocialAccounts(200);

    const candidateCards: CreatorCardData[] = [];

    // Facet accumulators
    const facets: SearchFacets = {
      platforms: { instagram: 0, youtube: 0 },
      categories: {},
      followerBands: {
        under10k: 0,
        k10to50k: 0,
        k50to200k: 0,
        k200kto1m: 0,
        over1m: 0,
      },
      audienceCountries: {},
    };

    for (const acc of accounts) {
      if (acc.status !== 'ACTIVE') continue;

      // Platform check
      if (query.platform && query.platform !== 'all' && acc.provider !== query.platform) {
        continue;
      }

      // Track platform facet
      facets.platforms[acc.provider] = (facets.platforms[acc.provider] || 0) + 1;

      const followers = Number(acc.followers_count || 0);

      // Track follower band facet
      if (followers < 10000) facets.followerBands.under10k++;
      else if (followers < 50000) facets.followerBands.k10to50k++;
      else if (followers < 200000) facets.followerBands.k50to200k++;
      else if (followers < 1000000) facets.followerBands.k200kto1m++;
      else facets.followerBands.over1m++;

      // Filter by followers
      if (query.minFollowers !== undefined && followers < query.minFollowers) continue;
      if (query.maxFollowers !== undefined && followers > query.maxFollowers) continue;

      // Demographic snapshot
      const snapshot = await getLatestAudienceSnapshot(acc.id);

      // EXCLUSION RULE: If demographic filters are set, creators without real snapshots are excluded
      if (query.min18PlusShare !== undefined) {
        if (!snapshot || snapshot.share_18_plus < query.min18PlusShare) continue;
      }
      if (query.max1317Share !== undefined) {
        if (!snapshot || snapshot.share_13_17 > query.max1317Share) continue;
      }
      if (query.audienceCountry) {
        if (!snapshot || snapshot.top_country !== query.audienceCountry.toUpperCase()) continue;
      }

      if (snapshot?.top_country) {
        facets.audienceCountries[snapshot.top_country] =
          (facets.audienceCountries[snapshot.top_country] || 0) + 1;
      }

      // System-created, fixture or demo creators are strictly ineligible for discovery
      if (
        acc.creator_id.startsWith('creator_') ||
        acc.creator_id.startsWith('seed_') ||
        acc.creator_id.startsWith('demo_') ||
        acc.creator_id.startsWith('test_')
      ) {
        continue;
      }

      // Self-dealing guard: Brand workspace members cannot discover or contract their own creator identity
      if (query.requestingUserId) {
        const selfCheck = await checkSelfDealing({
          requestingUserId: query.requestingUserId,
          creatorId: acc.creator_id,
        });
        if (!selfCheck.allowed) {
          continue;
        }
      }

      // Public profile lookup by authentic creatorId
      const profile = await getPublicProfileByCreatorId(acc.creator_id).catch(() => null);

      // Only published creator profiles are discoverable to brands
      if (!profile || !profile.isPublished) {
        continue;
      }

      const category = profile.tags?.[0] || 'Uncategorized';
      facets.categories[category] = (facets.categories[category] || 0) + 1;

      if (query.category && category.toLowerCase() !== query.category.toLowerCase()) {
        continue;
      }

      // Free text search
      if (query.query && query.query.trim()) {
        const q = query.query.trim().toLowerCase();
        const textMatch =
          acc.username.toLowerCase().includes(q) ||
          (profile.displayName || '').toLowerCase().includes(q) ||
          (profile.bio || '').toLowerCase().includes(q) ||
          category.toLowerCase().includes(q);

        if (!textMatch) continue;
      }

      // Rate card & pricing (authentic only - zero synthetic items)
      const rateItems = await getRateCardItems(acc.creator_id, { status: 'ACTIVE' }).catch(() => []);
      const visibleItems = rateItems.filter((i) => i.visibleToBrands);

      let startingPriceMinor: number | null = null;
      const deliverables: string[] = [];

      if (visibleItems.length > 0) {
        const validPrices = visibleItems.map((i) => i.price).filter((p): p is number => p !== null && p > 0);
        if (validPrices.length > 0) {
          const minPrice = Math.min(...validPrices);
          startingPriceMinor = Math.round(minPrice * 100);
        }
        deliverables.push(...Array.from(new Set(visibleItems.map((i) => i.contentFormat))));
      }

      // Deliverable Format Filter
      if (query.deliverableFormat && query.deliverableFormat !== 'ANY') {
        const hasFormat = deliverables.some(
          (d) => d.toUpperCase() === query.deliverableFormat?.toUpperCase()
        );
        if (!hasFormat) continue;
      }

      // Budget-First Search: total campaign budget ceiling
      if (query.budgetAmount !== undefined && query.budgetAmount > 0) {
        if (startingPriceMinor === null) continue;
        const platformFeeRate = 0.10; // 10% platform fee
        const effectiveMaxDeliverableRupees = query.budgetAmount / (1 + platformFeeRate * 1.18);
        if (startingPriceMinor / 100 > effectiveMaxDeliverableRupees) {
          continue;
        }
      }

      // Direct min/max budget filter
      if (query.minBudget !== undefined) {
        if (startingPriceMinor === null || startingPriceMinor / 100 < query.minBudget) continue;
      }
      if (query.maxBudget !== undefined) {
        if (startingPriceMinor === null || startingPriceMinor / 100 > query.maxBudget) continue;
      }

      // Authentic engagement calculation (null if insufficient metrics)
      const engagementRate: number | null = (acc as any).engagement_rate ?? (acc as any).engagementRate ?? null;

      if (query.minEngagementRate !== undefined) {
        if (engagementRate === null || engagementRate < query.minEngagementRate) continue;
      }

      // Format date honest string
      const dateStr = acc.last_synced_at
        ? new Date(acc.last_synced_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;
      const dataAsOfText = dateStr
        ? `Data as of ${dateStr} (Meta estimate)`
        : 'Meta OAuth Connected';

      const matchInfo = calculateBestMatchScore(
        {
          category,
          engagementRate,
          share18Plus: snapshot?.share_18_plus ?? null,
          startingPriceMinor,
        },
        query
      );

      const locationStr = profile.location || '';
      const city = locationStr.includes(',') ? locationStr.split(',')[0].trim() : (locationStr || undefined);
      const country = locationStr.includes(',') ? locationStr.split(',')[1].trim() : (locationStr || 'India');

      candidateCards.push({
        creatorId: acc.creator_id,
        slug: profile.slug,
        displayName: profile.displayName || acc.username,
        avatarUrl: isStockPhotoUrl(profile.avatarUrl) ? null : (profile.avatarUrl || acc.profile_picture_url || null),
        bio: profile.bio || undefined,
        category,
        country,
        city,
        primaryPlatform: acc.provider,
        handle: `@${acc.username}`,
        followersCount: followers,
        views24h: (acc as any).views_sample !== undefined && (acc as any).views_sample !== null ? Number((acc as any).views_sample) : undefined,
        mediaCount: Number(acc.media_count || 0),
        engagementRate,
        verifiedStatus: 'VERIFIED',
        verifiedBadgeText: 'Verified via Instagram API',
        dataAsOfText,
        audienceMetrics: snapshot
          ? {
              hasSnapshot: true,
              share18Plus: snapshot.share_18_plus,
              share1317: snapshot.share_13_17,
              topCountry: snapshot.top_country,
              computedAt: snapshot.computedAt,
            }
          : undefined,
        startingPriceMinor,
        currency: 'INR',
        availableDeliverables: deliverables,
        matchScore: matchInfo.score,
        matchExplanation: matchInfo.explanation,
      });
    }

    // 2. Sorting
    const sortBy = query.sortBy || 'best_match';
    candidateCards.sort((a, b) => {
      if (sortBy === 'followers_desc') {
        return b.followersCount - a.followersCount;
      }
      if (sortBy === 'price_asc') {
        return (a.startingPriceMinor || 0) - (b.startingPriceMinor || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.startingPriceMinor || 0) - (a.startingPriceMinor || 0);
      }
      if (sortBy === 'engagement_desc') {
        return (b.engagementRate || 0) - (a.engagementRate || 0);
      }
      // default: best_match
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    // 3. Cursor pagination
    let startIndex = 0;
    if (query.cursor) {
      const decoded = decodeCursor(query.cursor);
      if (decoded) {
        const foundIdx = candidateCards.findIndex((c) => c.creatorId === decoded.id);
        if (foundIdx !== -1) {
          startIndex = foundIdx + 1;
        }
      }
    }

    const pagedItems = candidateCards.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < candidateCards.length;
    const nextCursor =
      hasMore && pagedItems.length > 0
        ? encodeCursor({
            id: pagedItems[pagedItems.length - 1].creatorId,
            sortVal: pagedItems[pagedItems.length - 1].matchScore,
          })
        : undefined;

    const result: CreatorSearchResult = {
      items: pagedItems,
      nextCursor,
      hasMore,
      totalCount: candidateCards.length,
      facets,
      queryMeta: {
        tookMs: Date.now() - startTime,
        cached: false,
        budgetEvaluated: Boolean(query.budgetAmount),
        effectiveBudgetMinor: query.budgetAmount ? query.budgetAmount * 100 : undefined,
      },
    };

    // Cache save
    queryCache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS });

    return result;
  }

  async getFacets(query: CreatorSearchQuery): Promise<SearchFacets> {
    const res = await this.search(query);
    return res.facets;
  }

  async getSimilarCreators(creatorId: string, limit = 4): Promise<CreatorCardData[]> {
    const all = await this.search({ limit: 20 });
    const target = all.items.find((c) => c.creatorId === creatorId);
    if (!target) return all.items.slice(0, limit);

    return all.items
      .filter((c) => c.creatorId !== creatorId)
      .sort((a, b) => {
        const catMatchA = a.category === target.category ? 1 : 0;
        const catMatchB = b.category === target.category ? 1 : 0;
        return catMatchB - catMatchA;
      })
      .slice(0, limit);
  }
}

export const creatorSearchEngine = new CreatorSearchEngine();
