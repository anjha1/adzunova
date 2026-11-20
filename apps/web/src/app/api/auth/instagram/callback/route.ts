import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPublicOrigin } from '@/lib/config';
import { validateAndConsumeOAuthState } from '@/lib/social/oauth-state';
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  resolveInstagramAccountsUnified,
  probeAccountCapabilities,
} from '@/lib/social/meta-client';
import { encryptToken } from '@/lib/social/security/encryption';
import { scrubSensitiveData } from '@/lib/social/security/log-scrubber';
import { saveSocialAccountAndCredentials } from '@/lib/social/social-repository';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');
  const origin = getPublicOrigin(req);

  // 1. Verify user session
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.redirect(new URL('/auth/creator/sign-in?redirect=/creator/accounts', origin));
  }

  // 2. Handle user denied / Meta OAuth errors
  if (error || !code) {
    console.log('[OAuthCallback] Step 1: User cancelled or Meta consent denied', {
      error,
      errorReason,
      errorDescription: errorDescription ? scrubSensitiveData(errorDescription) : undefined,
    });
    return NextResponse.redirect(
      new URL(
        `/creator/accounts?error=user_denied&message=${encodeURIComponent(
          'Meta connection was cancelled or permission was denied.'
        )}`,
        origin
      )
    );
  }

  // 3. Verify state token (single-use, unexpired, bound to creator)
  const stateCheck = validateAndConsumeOAuthState(state || '', session.user.id);
  console.log('[OAuthCallback] Step 2: State validation result', {
    valid: stateCheck.valid,
    reason: stateCheck.reason,
    userId: session.user.id,
  });

  if (!stateCheck.valid) {
    const reason = encodeURIComponent(stateCheck.reason || 'Invalid or expired state parameter');
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=invalid_state&message=${reason}`, origin)
    );
  }

  try {
    // 4. Exchange authorization code for short-lived user access token
    console.log('[OAuthCallback] Step 3: Exchanging OAuth code for short-lived token...');
    const shortTokenRes = await exchangeCodeForShortLivedToken(code);
    console.log('[OAuthCallback] Step 3 Complete: Short-lived token exchange result', {
      status: shortTokenRes.status,
      responseKeys: shortTokenRes.keys,
      tokenType: shortTokenRes.data.token_type,
      hasAccessToken: !!shortTokenRes.data.access_token,
      expiresIn: shortTokenRes.data.expires_in,
    });

    // 5. Exchange short-lived token for 60-day long-lived token
    console.log('[OAuthCallback] Step 4: Exchanging for long-lived access token...');
    const longTokenRes = await exchangeForLongLivedToken(shortTokenRes.data.access_token);
    const longLivedToken = longTokenRes.data.access_token;
    const expiresAt = longTokenRes.data.expires_in
      ? new Date(Date.now() + longTokenRes.data.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    console.log('[OAuthCallback] Step 4 Complete: Long-lived token exchange result', {
      status: longTokenRes.status,
      responseKeys: longTokenRes.keys,
      tokenType: longTokenRes.data.token_type,
      hasAccessToken: !!longTokenRes.data.access_token,
      expiresIn: longTokenRes.data.expires_in,
    });

    // 6. Resolve Instagram accounts using unified priority discovery:
    //    (a) debug_token granular_scopes -> target_ids
    //    (b) Business Portfolio assets (/me/businesses)
    //    (c) Legacy fallback: Facebook Page -> instagram_business_account
    console.log('[OAuthCallback] Step 5: Resolving Instagram accounts across discovery methods...');
    const discovery = await resolveInstagramAccountsUnified(longLivedToken);

    console.log('[OAuthCallback] Step 5 Complete: Account discovery summary', {
      discoveryMethod: discovery.discoveryMethod,
      accountsFound: discovery.accounts.length,
      errorReason: discovery.errorReason,
      errorCode: discovery.errorCode,
      debugTokenSummary: discovery.debugToken,
    });

    if (discovery.accounts.length === 0) {
      // Map distinct, honest error messages without mentioning Facebook Pages unless that was the attempted path
      let redirectError = 'no_instagram_account_granted';
      let message = 'No Instagram account was granted during Meta connection. Please ensure you select your Instagram account.';

      if (discovery.errorReason === 'account_not_professional') {
        redirectError = 'account_not_professional';
        message = 'The connected Instagram account is not a Professional (Creator or Business) account. Please convert your account to Professional in the Instagram app Settings > Account type.';
      } else if (discovery.errorReason === 'meta_api_error') {
        redirectError = 'meta_api_error';
        message = `Meta Graph API returned an error (code: ${discovery.errorCode || 'unknown'}). Please try connecting again.`;
      } else if (discovery.discoveryMethod === 'legacy_pages') {
        redirectError = 'no_instagram_business_account';
        message = 'No Instagram Professional account found linked to your Facebook page.';
      }

      return NextResponse.redirect(
        new URL(
          `/creator/accounts?error=${redirectError}&message=${encodeURIComponent(message)}`,
          origin
        )
      );
    }

    // 7. Envelope-encrypt the long-lived token (AES-256-GCM)
    const encrypted = encryptToken(longLivedToken);

    // 8. Probe capabilities and persist all resolved accounts
    for (const targetAccount of discovery.accounts) {
      console.log(`[OAuthCallback] Step 6: Probing capabilities for @${targetAccount.username} (${targetAccount.id})...`);
      const capabilities = await probeAccountCapabilities(targetAccount.id, longLivedToken);

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
          scopes: discovery.debugToken.scopes.length > 0 ? discovery.debugToken.scopes : ['instagram_basic', 'instagram_manage_insights'],
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
    }

    // 9. Redirect with success banner
    if (discovery.accounts.length > 1) {
      console.log(`[OAuthCallback] Step 7: Successfully connected ${discovery.accounts.length} accounts.`);
      return NextResponse.redirect(
        new URL(
          `/creator/accounts?success=multiple_accounts_connected&count=${discovery.accounts.length}&username=${encodeURIComponent(
            discovery.accounts[0].username
          )}`,
          origin
        )
      );
    }

    const primaryAccount = discovery.accounts[0];
    console.log(`[OAuthCallback] Step 7: Successfully connected single account @${primaryAccount.username}.`);
    return NextResponse.redirect(
      new URL(
        `/creator/accounts?success=instagram_connected&username=${encodeURIComponent(primaryAccount.username)}`,
        origin
      )
    );
  } catch (err: any) {
    console.error('[OAuthCallback] Step Failed: Exception during OAuth exchange/discovery:', {
      message: err?.message ? scrubSensitiveData(err.message) : 'Unknown error',
      code: err?.code,
    });
    const errorMsg = encodeURIComponent(
      err?.code ? `Meta API error (${err.code})` : 'An internal server error occurred while connecting your account.'
    );
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=server_error&message=${errorMsg}`, origin)
    );
  }
}
