import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSocialAccountsByCreatorId } from '@/lib/social/social-repository';

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const accounts = await getSocialAccountsByCreatorId(session.user.id);
    return NextResponse.json({
      accounts: accounts.map((acc) => ({
        id: acc.id,
        provider: acc.provider,
        username: acc.username,
        account_type: acc.account_type,
        profile_picture_url: acc.profile_picture_url,
        followers_count: Number(acc.followers_count),
        media_count: Number(acc.media_count),
        status: acc.status,
        scopes: acc.scopes,
        capabilities: acc.capabilities,
        connected_at: acc.connected_at,
        last_synced_at: acc.last_synced_at,
        next_sync_at: acc.next_sync_at,
        sync_tier: acc.sync_tier,
      })),
    });
  } catch (err) {
    console.error('[GetSocialAccounts] Error listing social accounts:', err);
    return NextResponse.json({ error: 'Failed to fetch social accounts' }, { status: 500 });
  }
}
