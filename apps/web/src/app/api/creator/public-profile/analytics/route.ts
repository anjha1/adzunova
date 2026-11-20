import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPublicProfileByCreatorId, getProfileAnalytics } from '@/lib/public-profile/public-profile-repository';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = session.user.id;
    const profile = await getPublicProfileByCreatorId(creatorId);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const rangeParam = url.searchParams.get('range') || '30';
    const days = Math.min(Math.max(parseInt(rangeParam, 10) || 30, 7), 90);

    const analytics = await getProfileAnalytics(profile.id, days);
    return NextResponse.json(analytics);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load profile analytics.' }, { status: 500 });
  }
}
