import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPublicOrigin } from '@/lib/config';
import { decryptToken } from '@/lib/social/security/encryption';
import { revokeYouTubeToken } from '@/lib/social/youtube-client';
import { clearYouTubeAccessTokenCache } from '@/lib/social/youtube-token-service';
import {
  disconnectSocialAccount,
  getSocialAccountsByCreatorId,
  getSocialCredentialByAccountId,
} from '@/lib/social/social-repository';
import { scrubSensitiveData } from '@/lib/social/security/log-scrubber';

export async function POST(req: NextRequest) {
  // 1. CSRF same-origin verification for mutating endpoint
  const originHeader = req.headers.get('origin');
  const expectedOrigin = getPublicOrigin(req);
  if (originHeader && originHeader !== expectedOrigin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  // 2. Fail closed on creator session
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deleteMetrics = false;
  try {
    const body = await req.json().catch(() => ({}));
    deleteMetrics = Boolean(body?.deleteMetrics);
  } catch {
    deleteMetrics = false;
  }

  try {
    const accounts = await getSocialAccountsByCreatorId(session.user.id, session.user.email);
    const ytAccount = accounts.find((a) => a.provider === 'youtube');
    if (!ytAccount) {
      return NextResponse.json({ error: 'No active YouTube connection found' }, { status: 404 });
    }

    // 3. Revoke token at Google's revoke endpoint (best-effort; always proceed with local revocation)
    try {
      const cred = await getSocialCredentialByAccountId(ytAccount.id);
      if (cred) {
        const refreshToken = decryptToken(cred.token_ciphertext, cred.token_nonce);
        await revokeYouTubeToken(refreshToken);
      }
    } catch (revokeErr) {
      console.warn(
        '[YouTubeDisconnect] Google token revoke call failed (proceeding with local credential deletion):',
        revokeErr instanceof Error ? scrubSensitiveData(revokeErr.message) : 'Unknown error'
      );
    }

    clearYouTubeAccessTokenCache(ytAccount.id);

    // 4. Delete stored credentials, mark REVOKED, write audit log, and honor deleteMetrics preference
    const success = await disconnectSocialAccount(session.user.id, 'youtube', { deleteMetrics });
    if (!success) {
      return NextResponse.json({ error: 'No active YouTube connection found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deleteMetrics,
      message: deleteMetrics
        ? 'YouTube channel disconnected and stored metrics deleted.'
        : 'YouTube channel disconnected; historical snapshot metrics retained.',
    });
  } catch (err) {
    console.error(
      '[YouTubeDisconnect] Error disconnecting account:',
      err instanceof Error ? scrubSensitiveData(err.message) : 'Unknown error'
    );
    return NextResponse.json({ error: 'Failed to disconnect YouTube account' }, { status: 500 });
  }
}
