import { NextRequest, NextResponse } from 'next/server';
import { getPublicProfileBySlug, getCreatorPackages, getCreatorTopContent, seedDemoProfile } from '@/lib/public-profile/public-profile-repository';
import { serializePublicProfile } from '@/lib/public-profile/serializer';
import { getSocialAccountLatest } from '@/lib/social/latest-state';
import { getRateCardItems } from '@/lib/rate-card/rate-card-repository';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const normSlug = slug.toLowerCase().trim();
    let { profile, isRedirect, redirectSlug } = await getPublicProfileBySlug(normSlug);

    // Auto-seed demo profile for @a_n_jha1 / @anjha1 if testing demo
    if (!profile && (normSlug === 'a_n_jha1' || normSlug === 'anjha1')) {
      profile = await seedDemoProfile('creator_anjha1', normSlug);
    }

    // 301 Redirect for previous slugs
    if (isRedirect && redirectSlug) {
      return NextResponse.json(
        { isRedirect: true, redirectSlug },
        {
          status: 301,
          headers: {
            Location: `/c/${redirectSlug}`,
            'Cache-Control': 'public, max-age=86400',
          },
        }
      );
    }

    // 404 for unpublished or nonexistent profiles
    if (!profile || !profile.isPublished) {
      return NextResponse.json(
        { error: 'This creator profile is either private or unavailable.' },
        { status: 404 }
      );
    }

    // Single source of truth read model & active rate cards
    const [latestSocial, rateCardItems] = await Promise.all([
      getSocialAccountLatest(profile.creatorId).catch(() => null),
      getRateCardItems(profile.creatorId).catch(() => []),
    ]);

    const packages = getCreatorPackages(profile.creatorId);
    const topContent = getCreatorTopContent(profile.creatorId);

    const dto = serializePublicProfile({
      profile,
      latestSocial,
      rateCardItems,
      packages,
      topContent,
    });

    return NextResponse.json(dto, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  } catch (err: any) {
    console.error('[API Public Profile] Error:', err);
    return NextResponse.json({ error: 'Failed to load public profile.' }, { status: 500 });
  }
}
