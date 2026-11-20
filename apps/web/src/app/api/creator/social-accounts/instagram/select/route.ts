import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { verifyAccountSelectionToken } from '@/lib/social/discovery-strategy';
import { getSocialAccountsByCreatorId } from '@/lib/social/social-repository';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) {
    return NextResponse.json({ error: 'META_APP_SECRET is not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { selectionToken, selectedIgId } = body;

    if (!selectionToken || !selectedIgId) {
      return NextResponse.json(
        { error: 'selectionToken and selectedIgId are required' },
        { status: 400 }
      );
    }

    // 1. Verify the cryptographic signature & session binding of the selection token
    const tokenCheck = verifyAccountSelectionToken(selectionToken, session.user.id, appSecret);
    if (!tokenCheck.valid || !tokenCheck.payload) {
      return NextResponse.json(
        { error: tokenCheck.error || 'Invalid or expired selection token' },
        { status: 403 }
      );
    }

    // 2. Enforce whitelist: client cannot submit arbitrary or ungranted Instagram account IDs
    if (!tokenCheck.payload.allowedIgIds.includes(selectedIgId)) {
      return NextResponse.json(
        { error: 'Selected account ID was not granted in this OAuth authorization session' },
        { status: 403 }
      );
    }

    // 3. Confirm the account exists in the creator's connected accounts
    const creatorAccounts = await getSocialAccountsByCreatorId(session.user.id);
    const targetAccount = creatorAccounts.find(
      (a) => a.provider === 'instagram' && a.provider_user_id === selectedIgId
    );

    if (!targetAccount) {
      return NextResponse.json(
        { error: 'Selected Instagram account is not connected to your profile' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      selectedAccountId: targetAccount.id,
      username: targetAccount.username,
      message: `Switched active profile to @${targetAccount.username}`,
    });
  } catch (err: any) {
    console.error('[AccountSelect] Error selecting account:', err);
    return NextResponse.json({ error: 'Failed to process account selection' }, { status: 500 });
  }
}
