import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getPublicProfileByCreatorId,
  upsertPublicProfile,
  calculateProfileCompleteness,
  isSlugAvailable,
} from '@/lib/public-profile/public-profile-repository';
import { updatePublicProfileSchema } from '@/lib/public-profile/validation';
import { getSocialAccountLatest } from '@/lib/social/latest-state';
import { getRateCardItems } from '@/lib/rate-card/rate-card-repository';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = session.user.id;
    let profile = await getPublicProfileByCreatorId(creatorId);

    const [latestSocial, rateCardItems] = await Promise.all([
      getSocialAccountLatest(creatorId).catch(() => null),
      getRateCardItems(creatorId).catch(() => []),
    ]);

    const fallbackAvatar = session.profile?.avatarUrl || session.user?.avatarUrl || latestSocial?.account?.profilePictureUrl || null;

    // Initial setup if not exists
    if (!profile) {
      const emailPrefix = session.user.email?.split('@')[0]?.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'creator';
      profile = await upsertPublicProfile(creatorId, {
        slug: emailPrefix,
        displayName: session.profile?.displayName || session.user.displayName || 'Creator',
        bio: session.profile?.bio || '',
        avatarUrl: fallbackAvatar,
      });
    } else if (!profile.avatarUrl && fallbackAvatar) {
      // Auto-backfill avatar from Google OAuth / Instagram if profile avatar was left empty
      profile = await upsertPublicProfile(creatorId, {
        avatarUrl: fallbackAvatar,
      });
    }

    const completeness = await calculateProfileCompleteness(profile, latestSocial, rateCardItems);

    return NextResponse.json({
      profile,
      completeness,
      latestSocial,
      activeRateCardCount: rateCardItems.filter((i) => i.status === 'ACTIVE').length,
    });
  } catch (err: any) {
    console.error('[API creator public-profile GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch public profile settings.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const parseRes = updatePublicProfileSchema.safeParse(body);

    if (!parseRes.success) {
      return NextResponse.json({ error: parseRes.error.issues?.[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const updates = parseRes.data;

    // Check slug uniqueness if changing
    if (updates.slug) {
      const availability = await isSlugAvailable(updates.slug, creatorId);
      if (!availability.available) {
        return NextResponse.json({ error: availability.reason || 'Slug not available' }, { status: 409 });
      }
    }

    const updated = await upsertPublicProfile(creatorId, updates);

    const [latestSocial, rateCardItems] = await Promise.all([
      getSocialAccountLatest(creatorId).catch(() => null),
      getRateCardItems(creatorId).catch(() => []),
    ]);

    const completeness = await calculateProfileCompleteness(updated, latestSocial, rateCardItems);

    return NextResponse.json({
      profile: updated,
      completeness,
      message: 'Profile settings saved successfully.',
    });
  } catch (err: any) {
    console.error('[API creator public-profile PATCH] Error:', err);
    return NextResponse.json({ error: 'Failed to update public profile.' }, { status: 500 });
  }
}
