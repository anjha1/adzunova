import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSocialAccountLatest } from '@/lib/social/latest-state';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const acceptLanguage = req.headers.get('accept-language');
    const locale = acceptLanguage ? acceptLanguage.split(',')[0].split(';')[0].trim() : undefined;

    const latest = await getSocialAccountLatest(session.user.id, {
      locale,
      email: session.user.email,
    });
    return NextResponse.json(latest);
  } catch (err: any) {
    console.error('[SocialAccountLatest] Error resolving latest read model:', err);
    return NextResponse.json({ error: 'Failed to load social account latest state' }, { status: 500 });
  }
}
