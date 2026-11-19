import { NextResponse } from 'next/server';
import { getDueAccountsForSync, getSocialAccountById } from '@/lib/social/social-repository';
import { getLatestAudienceSnapshot } from '@/lib/social/metrics-store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const platform = searchParams.get('platform') || 'all';
    const minFollowers = Number(searchParams.get('min_followers') || 0);
    const maxFollowers = searchParams.get('max_followers') ? Number(searchParams.get('max_followers')) : Infinity;
    const min18PlusShare = searchParams.get('min_18_plus_share') ? Number(searchParams.get('min_18_plus_share')) : null;
    const max1317Share = searchParams.get('max_13_17_share') ? Number(searchParams.get('max_13_17_share')) : null;
    const country = searchParams.get('country')?.toUpperCase();
    const limit = Math.min(Number(searchParams.get('limit') || 20), 50);

    // Query active accounts (in local development or DB)
    const allAccounts = await getDueAccountsForSync(100);

    const matchedCreators: any[] = [];

    for (const acc of allAccounts) {
      if (acc.status !== 'ACTIVE') continue;
      if (platform !== 'all' && acc.provider !== platform) continue;
      if (acc.followers_count < minFollowers || acc.followers_count > maxFollowers) continue;

      const snapshot = await getLatestAudienceSnapshot(acc.id);

      // Exclusion rules: creators without real snapshots are excluded if demographic filters are specified
      if (min18PlusShare !== null) {
        if (!snapshot || snapshot.share_18_plus < min18PlusShare) continue;
      }

      if (max1317Share !== null) {
        if (!snapshot || snapshot.share_13_17 > max1317Share) continue;
      }

      if (country) {
        if (!snapshot || snapshot.top_country !== country) continue;
      }

      matchedCreators.push({
        creatorId: acc.creator_id,
        primaryPlatform: acc.provider,
        verifiedStatus: 'SOCIAL_VERIFIED',
        socialProfile: {
          provider: acc.provider,
          username: acc.username,
          followersCount: Number(acc.followers_count),
          mediaCount: Number(acc.media_count),
          verifiedOn: acc.last_synced_at || acc.connected_at,
        },
        audienceMetrics: snapshot
          ? {
              hasSnapshot: true,
              share_18_plus: snapshot.share_18_plus,
              share_13_17: snapshot.share_13_17,
              share_18_34: snapshot.share_18_34,
              dominantAgeBucket: snapshot.dominant_age_bucket,
              genderKnownShare: snapshot.gender_known_share,
              topCountry: snapshot.top_country,
              computedAt: snapshot.computedAt,
            }
          : {
              hasSnapshot: false,
              share_18_plus: null,
              share_13_17: null,
              dominantAgeBucket: null,
              topCountry: null,
            },
      });

      if (matchedCreators.length >= limit) break;
    }

    return NextResponse.json({
      data: matchedCreators,
      pagination: {
        hasMore: false,
        nextCursor: null,
        totalCount: matchedCreators.length,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error executing creator discovery query' },
      { status: 500 }
    );
  }
}
