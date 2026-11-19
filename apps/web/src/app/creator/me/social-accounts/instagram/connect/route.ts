import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateOAuthState } from '@/lib/social/oauth-state';
import { getMetaUnifiedLoginUrl } from '@/lib/social/meta-client';

export async function GET(req: NextRequest) {
  // 1. Authenticate creator session
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.redirect(new URL('/auth/creator/sign-in?redirect=/creator/accounts', req.url));
  }

  // 2. Validate configuration existence
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.redirect(
      new URL('/creator/accounts?error=instagram_not_configured&reason=Missing+Meta+credentials', req.url)
    );
  }

  try {
    // 3. Generate CSPRNG single-use state token bound to creator
    const sessionId = session.user.id;
    const state = generateOAuthState(session.user.id, sessionId);

    // 4. Build Meta Unified Login authorization URL
    const metaLoginUrl = getMetaUnifiedLoginUrl(state);

    // 5. Redirect browser to Meta dialog
    return NextResponse.redirect(metaLoginUrl);
  } catch (err) {
    console.error('[InstagramConnect] Failed to initiate OAuth flow:', err);
    return NextResponse.redirect(
      new URL('/creator/accounts?error=connect_init_failed&reason=Internal+error', req.url)
    );
  }
}
