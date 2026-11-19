import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { disconnectSocialAccount } from '@/lib/social/social-repository';

export async function POST(_req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const success = await disconnectSocialAccount(session.user.id, 'instagram');
    if (!success) {
      return NextResponse.json({ error: 'No active Instagram connection found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Instagram account disconnected' });
  } catch (err) {
    console.error('[InstagramDisconnect] Error disconnecting account:', err);
    return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 });
  }
}
