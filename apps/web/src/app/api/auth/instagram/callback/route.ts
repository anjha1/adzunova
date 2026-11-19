import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { validateAndConsumeOAuthState } from '@/lib/social/oauth-state';
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  fetchInstagramAccounts,
  probeAccountCapabilities,
} from '@/lib/social/meta-client';
import { encryptToken } from '@/lib/social/security/encryption';
import { saveSocialAccountAndCredentials } from '@/lib/social/social-repository';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');

  // 1. Verify user session
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.redirect(new URL('/auth/creator/sign-in?redirect=/creator/accounts', req.url));
  }

  // 2. Handle user denied / Meta OAuth errors
  if (error || !code) {
    const reason = encodeURIComponent(errorDescription || errorReason || error || 'Connection cancelled by user');
    return NextResponse.redirect(new URL(`/creator/accounts?error=oauth_denied&message=${reason}`, req.url));
  }

  // 3. Verify state token (single-use, unexpired, bound to creator)
  const stateCheck = validateAndConsumeOAuthState(state || '', session.user.id);
  if (!stateCheck.valid) {
    const reason = encodeURIComponent(stateCheck.reason || 'Invalid state');
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=invalid_state&message=${reason}`, req.url)
    );
  }

  try {
    // 4. Exchange code for short-lived access token
    const shortTokenRes = await exchangeCodeForShortLivedToken(code);

    // 5. Exchange short-lived token for 60-day long-lived token
    const longTokenRes = await exchangeForLongLivedToken(shortTokenRes.access_token);
    const longLivedToken = longTokenRes.access_token;
    const expiresAt = longTokenRes.expires_in
      ? new Date(Date.now() + longTokenRes.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days fallback

    // 6. Fetch user's connected Instagram professional/business accounts
    const igAccounts = await fetchInstagramAccounts(longLivedToken);

    if (igAccounts.length === 0) {
      return NextResponse.redirect(
        new URL(
          '/creator/accounts?error=no_instagram_business_account&message=' +
            encodeURIComponent(
              'No Instagram Professional or Business account linked to your Facebook page. Please convert your Instagram account to Professional and link it to a Facebook Page.'
            ),
          req.url
        )
      );
    }

    // Default to the first professional account (or primary granted)
    const targetAccount = igAccounts[0];

    // 7. Probe capabilities (profile, views, gender/age demographics, country)
    const capabilities = await probeAccountCapabilities(targetAccount.id, longLivedToken);

    // 8. Envelope-encrypt the long-lived token (AES-256-GCM)
    const encrypted = encryptToken(longLivedToken);

    // 9. Persist to database (tenant/creator scoped, 409 conflict detection)
    await saveSocialAccountAndCredentials(
      {
        creator_id: session.user.id,
        provider: 'instagram',
        provider_user_id: targetAccount.id,
        username: targetAccount.username,
        account_type: 'BUSINESS',
        profile_picture_url: targetAccount.profile_picture_url || null,
        followers_count: targetAccount.followers_count,
        media_count: targetAccount.media_count,
        status: 'ACTIVE',
        scopes: ['instagram_basic', 'instagram_manage_insights'],
        capabilities,
        connected_at: new Date(),
        last_synced_at: new Date(),
        next_sync_at: new Date(Date.now() + 6 * 60 * 60 * 1000), // HOT tier: sync in 6h
        sync_tier: 'HOT',
        failure_count: 0,
      },
      {
        token_ciphertext: encrypted.ciphertext,
        token_nonce: encrypted.nonce,
        key_id: encrypted.keyId,
        token_type: 'long_lived_user',
        expires_at: expiresAt,
        created_at: new Date(),
        rotated_at: null,
      }
    );

    // 10. Success redirect with banner
    return NextResponse.redirect(
      new URL(
        `/creator/accounts?success=instagram_connected&username=${encodeURIComponent(targetAccount.username)}`,
        req.url
      )
    );
  } catch (err) {
    const errorMsg = encodeURIComponent(
      err instanceof Error ? err.message : 'Failed to finalize Instagram connection'
    );
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=connection_failed&message=${errorMsg}`, req.url)
    );
  }
}
