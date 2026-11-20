import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { upsertPublicProfile } from '@/lib/public-profile/public-profile-repository';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creatorId = session.user.id;
    const updated = await upsertPublicProfile(creatorId, {
      isPublished: false,
    });

    return NextResponse.json({
      ok: true,
      profile: updated,
      message: 'Profile unpublished. Your public page now returns 404 to non-authenticated visitors.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to unpublish profile.' }, { status: 500 });
  }
}
