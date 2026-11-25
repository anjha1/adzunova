import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSocialAccountsByCreatorId } from '@/lib/social/social-repository';
import { syncInstagramAccount } from '@/lib/social/sync-worker';
import { YouTubeProviderAdapter } from '@/lib/social/youtube-sync';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const creatorId = session?.user?.id;

    if (!creatorId) {
      return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const provider = body.provider || 'instagram';

    const accounts = await getSocialAccountsByCreatorId(creatorId);
    const targetAccount = accounts.find((a) => a.provider === provider && a.status === 'ACTIVE');

    if (!targetAccount) {
      return NextResponse.json(
        { error: 'No active connected account found for this provider' },
        { status: 404 }
      );
    }

    // Rate limit check: disallow manual sync if synced less than 15 minutes ago
    if (targetAccount.last_synced_at) {
      const msSinceLastSync = Date.now() - new Date(targetAccount.last_synced_at).getTime();
      const minIntervalMs = 15 * 60 * 1000; // 15 mins
      if (msSinceLastSync < minIntervalMs) {
        const remainingMinutes = Math.ceil((minIntervalMs - msSinceLastSync) / 60000);
        return NextResponse.json(
          {
            error: `Rate limited: This account was synced recently. Please wait ${remainingMinutes} minute(s) before syncing again.`,
            retryAfterMinutes: remainingMinutes,
          },
          { status: 429 }
        );
      }
    }

    // Run synchronization via unified provider dispatch
    const result =
      targetAccount.provider === 'youtube'
        ? await YouTubeProviderAdapter.syncAccount(targetAccount.id)
        : await syncInstagramAccount(targetAccount.id);

    return NextResponse.json({
      success: result.success,
      accountId: targetAccount.id,
      metricsCollected: result.metricsCollected,
      newFollowersCount: result.newFollowersCount,
      newMediaCount: result.newMediaCount,
      nextSyncAt: result.nextSyncAt.toISOString(),
      error: result.error,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
