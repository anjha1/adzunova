import crypto from 'crypto';
import type { Db, MongoClient } from 'mongodb';
import {
  PublicProfile,
  SectionVisibility,
  DEFAULT_SECTION_VISIBILITY,
  ProfileViewEvent,
  ProfileReport,
  PublicTopContentItem,
  PublicPackageItem,
} from './types';
import { validateSlug, isReservedSlug } from './validation';
import { getRateCardItems } from '../rate-card/rate-card-repository';
import { getSocialAccountLatest } from '../social/latest-state';

// In-Memory Storage Adapters (for isolated unit tests & offline mode)
const inMemoryProfiles = new Map<string, PublicProfile>(); // creatorId -> PublicProfile
const inMemoryEvents: ProfileViewEvent[] = [];
const inMemoryReports: ProfileReport[] = [];
const inMemoryPackages = new Map<string, PublicPackageItem[]>(); // creatorId -> packages
const inMemoryTopContent = new Map<string, PublicTopContentItem[]>(); // creatorId -> topContent

let mongoClient: MongoClient | null = null;
let mongoDbPromise: Promise<Db | null> | null = null;
let mongoIndexesEnsured = false;

async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USER:PASSWORD')) return null;
  if (mongoDbPromise) return mongoDbPromise;

  mongoDbPromise = (async () => {
    try {
      if (!mongoClient) {
        const { MongoClient } = await import('mongodb');
        mongoClient = new MongoClient(uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
          socketTimeoutMS: 10000,
        });
        await mongoClient.connect();
      }
      const db = mongoClient.db(process.env.MONGODB_DB_NAME || 'adzunova');
      if (!mongoIndexesEnsured) {
        await Promise.allSettled([
          db.collection('public_profiles').createIndex({ slug: 1 }, { unique: true, background: true }),
          db.collection('public_profiles').createIndex({ creatorId: 1 }, { unique: true, background: true }),
          db.collection('public_profiles').createIndex({ previousSlugs: 1 }, { background: true }),
          db.collection('profile_view_events').createIndex({ profileId: 1, timestamp: -1 }, { background: true }),
          db.collection('profile_view_events').createIndex({ profileId: 1, eventType: 1 }, { background: true }),
          db.collection('profile_reports').createIndex({ profileId: 1, createdAt: -1 }, { background: true }),
        ]);
        mongoIndexesEnsured = true;
      }
      return db;
    } catch (err: any) {
      console.warn('[PublicProfileRepo] MongoDB connection skipped/failed, using in-memory store:', err.message);
      if (mongoClient) {
        try {
          await mongoClient.close();
        } catch {}
        mongoClient = null;
      }
      mongoDbPromise = null;
      return null;
    }
  })();
  return mongoDbPromise;
}

/**
 * Discovers and sets the creator's official Adzunova login avatar (from Google OAuth / creator_profiles / users).
 * Strictly avoids using Instagram or social media pictures for the Adzunova creator identity.
 */
async function resolveAvatarIfEmpty(profile: PublicProfile, db: Db | null): Promise<PublicProfile> {
  if (!db) return profile;

  try {
    const { ObjectId } = await import('mongodb');
    const creatorId = profile.creatorId;
    let query: any = { userId: creatorId };
    let userQuery: any = { _id: creatorId };
    try {
      if (ObjectId.isValid(creatorId)) {
        query = { $or: [{ userId: creatorId }, { userId: new ObjectId(creatorId) }] };
        userQuery = { $or: [{ _id: creatorId }, { _id: new ObjectId(creatorId) }] };
      }
    } catch {}

    const [cp, userDoc] = await Promise.all([
      db.collection('creator_profiles').findOne(query).catch(() => null),
      db.collection('users').findOne(userQuery).catch(() => null),
    ]);

    let adzunovaAvatar = cp?.avatarUrl || userDoc?.avatarUrl || (userDoc as any)?.image || (userDoc as any)?.picture || null;

    // If not found by direct ID, match creator by connected social account or email
    if (!adzunovaAvatar) {
      const socialAccount = await db.collection('social_accounts').findOne({
        creator_id: creatorId,
      }).catch(() => null);

      const creatorEmail = socialAccount?.creator_email;

      if (creatorEmail) {
        const slugUser = await db.collection('users').findOne({
          $or: [{ email: creatorEmail }, { normalizedEmail: creatorEmail.toLowerCase() }],
        }).catch(() => null);

        if (slugUser?.avatarUrl) {
          adzunovaAvatar = slugUser.avatarUrl;
        } else if (slugUser?._id) {
          const userCp = await db.collection('creator_profiles').findOne({
            $or: [{ userId: slugUser._id }, { userId: String(slugUser._id) }],
          }).catch(() => null);
          if (userCp?.avatarUrl) adzunovaAvatar = userCp.avatarUrl;
        }
      }
    }

    if (adzunovaAvatar && adzunovaAvatar !== profile.avatarUrl) {
      profile.avatarUrl = adzunovaAvatar;
      await db.collection('public_profiles').updateMany(
        { $or: [{ creatorId: profile.creatorId }, { slug: profile.slug }] },
        { $set: { avatarUrl: adzunovaAvatar } }
      ).catch(() => null);
    }
  } catch {
    // Non-blocking fallback
  }

  return profile;
}

/**
 * Get profile by slug.
 * Checks current slug first, then looks in previousSlugs.
 * If found via previousSlugs, returns isRedirect: true with redirectSlug.
 */
export async function getPublicProfileBySlug(
  slug: string
): Promise<{ profile: PublicProfile | null; isRedirect?: boolean; redirectSlug?: string }> {
  const normSlug = slug.toLowerCase().trim();
  const db = await getMongoDb();

  if (db) {
    try {
      // Direct slug match
      const doc = await db.collection('public_profiles').findOne<PublicProfile>({ slug: normSlug });
      if (doc) {
        const enriched = await resolveAvatarIfEmpty(doc, db);
        return { profile: enriched };
      }

      // Previous slug match for 301 redirect
      const prevDoc = await db.collection('public_profiles').findOne<PublicProfile>({ previousSlugs: normSlug });
      if (prevDoc) {
        const enriched = await resolveAvatarIfEmpty(prevDoc, db);
        return {
          profile: enriched,
          isRedirect: true,
          redirectSlug: enriched.slug,
        };
      }
      return { profile: null };
    } catch (err: any) {
      console.warn('[PublicProfileRepo] MongoDB fetch failed, using memory:', err.message);
    }
  }

  // Memory fallback
  for (const prof of inMemoryProfiles.values()) {
    if (prof.slug === normSlug) return { profile: prof };
    if (prof.previousSlugs && prof.previousSlugs.includes(normSlug)) {
      return {
        profile: prof,
        isRedirect: true,
        redirectSlug: prof.slug,
      };
    }
  }

  return { profile: null };
}

/**
 * Fetch profile by Creator ID
 */
export async function getPublicProfileByCreatorId(creatorId: string): Promise<PublicProfile | null> {
  const db = await getMongoDb();
  if (db) {
    try {
      const doc = await db.collection('public_profiles').findOne<PublicProfile>({ creatorId });
      if (doc) return await resolveAvatarIfEmpty(doc, db);
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Mongo query failed:', err.message);
    }
  }
  return inMemoryProfiles.get(creatorId) || null;
}

/**
 * Check if a slug is available for a given creator
 */
export async function isSlugAvailable(slug: string, currentCreatorId?: string): Promise<{ available: boolean; reason?: string }> {
  const normSlug = slug.toLowerCase().trim();
  const validation = validateSlug(normSlug);
  if (!validation.isValid) {
    return { available: false, reason: validation.error };
  }

  const db = await getMongoDb();
  if (db) {
    try {
      const conflict = await db.collection('public_profiles').findOne({
        $or: [{ slug: normSlug }, { previousSlugs: normSlug }],
      });

      if (conflict) {
        if (currentCreatorId && conflict.creatorId === currentCreatorId && conflict.slug === normSlug) {
          return { available: true };
        }
        return { available: false, reason: 'This custom URL is already in use by another creator.' };
      }
      return { available: true };
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Mongo slug check error, fallback to memory:', err.message);
    }
  }

  // Memory check
  for (const prof of inMemoryProfiles.values()) {
    if (prof.slug === normSlug || prof.previousSlugs.includes(normSlug)) {
      if (currentCreatorId && prof.creatorId === currentCreatorId && prof.slug === normSlug) {
        return { available: true };
      }
      return { available: false, reason: 'This custom URL is already in use by another creator.' };
    }
  }

  return { available: true };
}

/**
 * Upsert Public Profile for a creator
 */
export async function upsertPublicProfile(
  creatorId: string,
  data: Partial<Omit<PublicProfile, 'sectionVisibility'>> & {
    sectionVisibility?: Partial<SectionVisibility>;
  }
): Promise<PublicProfile> {
  const now = new Date().toISOString();
  const existing = await getPublicProfileByCreatorId(creatorId);

  let newSlug = (data.slug || existing?.slug || `creator-${creatorId.slice(-6)}`).toLowerCase().trim();
  const previousSlugs = [...(existing?.previousSlugs || [])];

  // If slug is changing, record previous slug for 301 redirects
  if (existing && existing.slug && existing.slug !== newSlug) {
    if (!previousSlugs.includes(existing.slug)) {
      previousSlugs.push(existing.slug);
    }
  }

  const updated: PublicProfile = {
    id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `pp-${Date.now()}`),
    creatorId,
    slug: newSlug,
    previousSlugs,
    isPublished: data.isPublished ?? existing?.isPublished ?? false,
    allowIndexing: data.allowIndexing ?? existing?.allowIndexing ?? true,
    displayName: data.displayName ?? existing?.displayName ?? 'Adzunova Creator',
    bio: data.bio ?? existing?.bio ?? '',
    tags: data.tags ?? existing?.tags ?? [],
    languages: data.languages ?? existing?.languages ?? ['English'],
    location: data.location ?? existing?.location ?? 'India',
    avatarUrl: data.avatarUrl ?? existing?.avatarUrl ?? null,
    coverUrl: data.coverUrl ?? existing?.coverUrl ?? null,
    sectionVisibility: {
      ...DEFAULT_SECTION_VISIBILITY,
      ...(existing?.sectionVisibility || {}),
      ...(data.sectionVisibility || {}),
    },
    hiddenPlatformIds: data.hiddenPlatformIds ?? existing?.hiddenPlatformIds ?? [],
    pinnedContentIds: data.pinnedContentIds ?? existing?.pinnedContentIds ?? [],
    hidePricesPerItem: data.hidePricesPerItem ?? existing?.hidePricesPerItem ?? {},
    consentRecordedAt: data.consentRecordedAt ?? existing?.consentRecordedAt ?? null,
    publishedAt: data.isPublished
      ? existing?.publishedAt || now
      : (data.isPublished === false ? null : existing?.publishedAt || null),
    updatedAt: now,
    version: (existing?.version || 0) + 1,
  };

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('public_profiles').updateOne(
        { creatorId },
        { $set: updated },
        { upsert: true }
      );
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Mongo upsert failed, updating memory:', err.message);
    }
  }

  inMemoryProfiles.set(creatorId, updated);
  return updated;
}

/**
 * Calculate Profile Completeness (0 to 100%)
 */
export async function calculateProfileCompleteness(
  profile: PublicProfile,
  latestSocial: any,
  rateCardItems: any[]
): Promise<{ score: number; checklist: Array<{ id: string; label: string; completed: boolean; impact: number }> }> {
  const checklist = [
    {
      id: 'avatar',
      label: 'Upload a clear profile picture / avatar',
      completed: Boolean(profile.avatarUrl),
      impact: 20,
    },
    {
      id: 'bio',
      label: 'Write a compelling creator bio (min 30 characters)',
      completed: Boolean(profile.bio && profile.bio.trim().length >= 30),
      impact: 20,
    },
    {
      id: 'social',
      label: 'Connect & verify at least 1 social platform (Instagram / YouTube)',
      completed: Boolean(latestSocial?.hasConnectedAccount),
      impact: 30,
    },
    {
      id: 'rate_card',
      label: 'Publish at least 1 active rate card deliverable',
      completed: Boolean(rateCardItems.some((i) => i.status === 'ACTIVE' && i.visibleToBrands)),
      impact: 30,
    },
  ];

  const score = checklist.reduce((sum, item) => sum + (item.completed ? item.impact : 0), 0);

  return { score, checklist };
}

/**
 * Record a privacy-safe Profile Event
 */
export async function recordProfileEvent(event: Omit<ProfileViewEvent, 'id' | 'timestamp'>): Promise<void> {
  const fullEvent: ProfileViewEvent = {
    ...event,
    id: crypto.randomUUID ? crypto.randomUUID() : `evt-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('profile_view_events').insertOne(fullEvent);
      return;
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Failed to save event to Mongo:', err.message);
    }
  }

  inMemoryEvents.push(fullEvent);
}

/**
 * Record an Abuse Report
 */
export async function recordProfileReport(report: Omit<ProfileReport, 'id' | 'createdAt' | 'status'>): Promise<void> {
  const fullReport: ProfileReport = {
    ...report,
    id: crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  const db = await getMongoDb();
  if (db) {
    try {
      await db.collection('profile_reports').insertOne(fullReport);
      return;
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Failed to save report to Mongo:', err.message);
    }
  }

  inMemoryReports.push(fullReport);
}

/**
 * Get Creator Profile Analytics
 */
export async function getProfileAnalytics(
  profileId: string,
  days = 30
): Promise<{
  pageViews: number;
  uniqueVisitors: number;
  shareEvents: number;
  rateCardViews: number;
  platformLinkClicks: number;
  dailySeries: Array<{ date: string; views: number; uniqueVisitors: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}> {
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const db = await getMongoDb();

  let events: ProfileViewEvent[] = [];

  if (db) {
    try {
      events = (await db
        .collection('profile_view_events')
        .find<ProfileViewEvent>({
          profileId,
          timestamp: { $gte: sinceDate.toISOString() },
        })
        .toArray()) as ProfileViewEvent[];
    } catch (err: any) {
      console.warn('[PublicProfileRepo] Mongo analytics fetch failed:', err.message);
    }
  }

  if (events.length === 0) {
    events = inMemoryEvents.filter((e) => e.profileId === profileId && new Date(e.timestamp) >= sinceDate);
  }

  const pageViews = events.filter((e) => e.eventType === 'VIEW').length;
  const uniqueSessions = new Set(events.map((e) => e.sessionHash));
  const uniqueVisitors = uniqueSessions.size;
  const shareEvents = events.filter((e) => e.eventType === 'SHARE_CLICK').length;
  const rateCardViews = events.filter((e) => e.eventType === 'RATECARD_VIEW').length;
  const platformLinkClicks = events.filter((e) => e.eventType === 'PLATFORM_LINK_CLICK').length;

  // Group by Day
  const dailyMap = new Map<string, { views: number; sessions: Set<string> }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, { views: 0, sessions: new Set() });
  }

  for (const ev of events) {
    const key = ev.timestamp.slice(0, 10);
    if (dailyMap.has(key)) {
      const entry = dailyMap.get(key)!;
      if (ev.eventType === 'VIEW') entry.views++;
      entry.sessions.add(ev.sessionHash);
    }
  }

  const dailySeries = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    views: data.views,
    uniqueVisitors: data.sessions.size,
  }));

  // Referrers
  const refMap = new Map<string, number>();
  for (const ev of events) {
    if (ev.referrer) {
      const host = ev.referrer.replace(/^https?:\/\//, '').split('/')[0] || 'Direct';
      refMap.set(host, (refMap.get(host) || 0) + 1);
    } else {
      refMap.set('Direct / Link', (refMap.get('Direct / Link') || 0) + 1);
    }
  }

  const topReferrers = Array.from(refMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    pageViews,
    uniqueVisitors,
    shareEvents,
    rateCardViews,
    platformLinkClicks,
    dailySeries,
    topReferrers,
  };
}

export function getCreatorPackages(creatorId: string): PublicPackageItem[] {
  return inMemoryPackages.get(creatorId) || [];
}

export function getCreatorTopContent(creatorId: string): PublicTopContentItem[] {
  return inMemoryTopContent.get(creatorId) || [];
}
