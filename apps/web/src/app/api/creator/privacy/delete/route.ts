import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import {
  getSocialAccountsByCreatorId,
  disconnectSocialAccount,
  logSocialAuditAction,
} from '@/lib/social/social-repository';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const creatorId = session?.user?.id;

    if (!creatorId) {
      return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const confirmation = body.confirm;

    if (confirmation !== 'DELETE_ALL_DATA') {
      return NextResponse.json(
        {
          error:
            'Confirmation string required: Pass { "confirm": "DELETE_ALL_DATA" } to execute permanent platform data purge.',
        },
        { status: 400 }
      );
    }

    // 1. Find all connected accounts
    const accounts = await getSocialAccountsByCreatorId(creatorId);

    // 2. Disconnect and purge credentials for each account
    for (const acc of accounts) {
      if (acc.provider === 'instagram') {
        await disconnectSocialAccount(creatorId, 'instagram');
      }
    }

    // 3. Log audit event
    const confirmationReceipt = `purge_${crypto.randomBytes(16).toString('hex')}`;
    await logSocialAuditAction(creatorId, 'DATA_DELETED', 'all', {
      confirmationReceipt,
      accountsPurged: accounts.map((a) => ({ id: a.id, provider: a.provider })),
      purgedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'All connected social accounts, tokens, and analytical metrics have been permanently deleted.',
      confirmationReceipt,
      accountsPurgedCount: accounts.length,
      purgedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete creator data' },
      { status: 500 }
    );
  }
}
