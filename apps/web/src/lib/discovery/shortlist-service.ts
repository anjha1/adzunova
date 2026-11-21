import crypto from 'crypto';
import { ShortlistEntity, CreatorCardData } from './search-types';
import { formatRatioToPercent } from '../public-profile/formatters';

/**
 * Tenant-Isolated Workspace Shortlists & Side-by-Side Comparison Engine
 */

// In-Memory store for workspace shortlists (persisted across sessions)
const inMemoryShortlists = new Map<string, ShortlistEntity>(); // shortlistId -> ShortlistEntity

export async function getWorkspaceShortlists(workspaceId: string): Promise<ShortlistEntity[]> {
  const lists = Array.from(inMemoryShortlists.values()).filter(
    (s) => s.workspaceId === workspaceId
  );

  if (lists.length === 0) {
    // Create default "Primary Shortlist"
    const defaultList: ShortlistEntity = {
      id: crypto.randomBytes(12).toString('hex'),
      workspaceId,
      name: 'Primary Shortlist',
      creatorIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryShortlists.set(defaultList.id, defaultList);
    return [defaultList];
  }

  return lists;
}

export async function createShortlist(workspaceId: string, name: string): Promise<ShortlistEntity> {
  const now = new Date().toISOString();
  const shortlist: ShortlistEntity = {
    id: crypto.randomBytes(12).toString('hex'),
    workspaceId,
    name: name.trim() || 'Custom Shortlist',
    creatorIds: [],
    createdAt: now,
    updatedAt: now,
  };

  inMemoryShortlists.set(shortlist.id, shortlist);
  return shortlist;
}

export async function toggleCreatorInShortlist(
  workspaceId: string,
  shortlistId: string,
  creatorId: string
): Promise<{ inShortlist: boolean; totalInList: number }> {
  let list = inMemoryShortlists.get(shortlistId);
  if (!list || list.workspaceId !== workspaceId) {
    const userLists = await getWorkspaceShortlists(workspaceId);
    list = userLists[0];
  }

  const existingIdx = list.creatorIds.indexOf(creatorId);
  let inShortlist = false;

  if (existingIdx !== -1) {
    list.creatorIds.splice(existingIdx, 1);
    inShortlist = false;
  } else {
    list.creatorIds.push(creatorId);
    inShortlist = true;
  }

  list.updatedAt = new Date().toISOString();
  inMemoryShortlists.set(list.id, list);

  return { inShortlist, totalInList: list.creatorIds.length };
}

export interface ComparisonDimension {
  key: string;
  label: string;
  format: 'number' | 'currency' | 'percentage' | 'text';
  values: Record<string, any>;
}

export interface ComparisonMatrix {
  creators: CreatorCardData[];
  dimensions: ComparisonDimension[];
}

/**
 * Builds a side-by-side comparison matrix for up to 4 creators
 */
export function buildComparisonMatrix(creators: CreatorCardData[]): ComparisonMatrix {
  const capped = creators.slice(0, 4);

  const followersMap: Record<string, any> = {};
  const engagementMap: Record<string, any> = {};
  const startingPriceMap: Record<string, any> = {};
  const viewsMap: Record<string, any> = {};
  const adultAudienceMap: Record<string, any> = {};
  const topCountryMap: Record<string, any> = {};
  const platformMap: Record<string, any> = {};

  for (const c of capped) {
    followersMap[c.creatorId] = c.followersCount;
    engagementMap[c.creatorId] = c.engagementRate !== null ? `${c.engagementRate}%` : '—';
    startingPriceMap[c.creatorId] = c.startingPriceMinor
      ? `₹${(c.startingPriceMinor / 100).toLocaleString('en-IN')}`
      : 'Not published';
    viewsMap[c.creatorId] = c.views24h ?? '—';
    adultAudienceMap[c.creatorId] = c.audienceMetrics?.share18Plus !== undefined && c.audienceMetrics?.share18Plus !== null
      ? formatRatioToPercent(c.audienceMetrics.share18Plus)
      : 'Estimate Pending';
    topCountryMap[c.creatorId] = c.audienceMetrics?.topCountry || 'India';
    platformMap[c.creatorId] = c.primaryPlatform.toUpperCase();
  }

  const dimensions: ComparisonDimension[] = [
    { key: 'platform', label: 'Primary Channel', format: 'text', values: platformMap },
    { key: 'followers', label: 'Followers', format: 'number', values: followersMap },
    { key: 'engagement', label: 'Avg Engagement Rate', format: 'percentage', values: engagementMap },
    { key: 'startingPrice', label: 'Starting Rate', format: 'currency', values: startingPriceMap },
    { key: 'views24h', label: '24h Content Views', format: 'number', values: viewsMap },
    { key: 'share18Plus', label: '18+ Audience Ratio', format: 'percentage', values: adultAudienceMap },
    { key: 'topCountry', label: 'Core Audience Geography', format: 'text', values: topCountryMap },
  ];

  return { creators: capped, dimensions };
}
