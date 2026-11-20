import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { upsertPublicProfile, getPublicProfileByCreatorId } from '@/lib/public-profile/public-profile-repository';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = session.user.id;
    const existing = await getPublicProfileByCreatorId(creatorId);

    if (!existing?.slug) {
      return NextResponse.json({ error: 'Please set your custom URL slug before publishing.' }, { status: 400 });
    }

    const updated = await upsertPublicProfile(creatorId, {
      isPublished: true,
      consentRecordedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      profile: updated,
      message: 'Your public profile is now live! Brands can discover and view your verified stats and rate card.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to publish profile.' }, { status: 500 });
  }
}
