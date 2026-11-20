import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { getPublicOrigin } from '@/lib/config';
import { validateAndConsumeOAuthState } from '@/lib/social/oauth-state';
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  resolveInstagramAccountsUnified,
  probeAccountCapabilities,
  createAccountSelectionToken,
} from '@/lib/social/meta-client';
import { syncInstagramAccount } from '@/lib/social/sync-worker';
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
      new URL('/creator/accounts?error=consent_denied', origin)
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
    return NextResponse.redirect(
      new URL('/creator/accounts?error=state_invalid_or_expired', origin)
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
    // System-user tokens may not return expires_in; handle nullable expiry
    const expiresAt = longTokenRes.data.expires_in
      ? new Date(Date.now() + longTokenRes.data.expires_in * 1000)
      : null; // null = token does not have a defined expiry (system-user tokens)

    console.log('[OAuthCallback] Step 4 Complete: Long-lived token exchange result', {
      status: longTokenRes.status,
      responseKeys: longTokenRes.keys,
      tokenType: longTokenRes.data.token_type,
      hasAccessToken: !!longTokenRes.data.access_token,
      expiresIn: longTokenRes.data.expires_in,
    });

    // 6. Resolve Instagram accounts using unified priority discovery:
    //    For SYSTEM_USER: (SU) /me/assigned_instagram_accounts first
    //    Then: (a) debug_token granular_scopes -> target_ids
    //    Then: (b) Business Portfolio assets (/me/businesses)
    //    Then: (c) Legacy fallback: Facebook Page -> instagram_business_account
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
      if (discovery.errorReason === 'account_not_professional') {
        return NextResponse.redirect(
          new URL('/creator/accounts?error=account_not_professional', origin)
        );
      }
      if (discovery.errorReason === 'meta_api_error') {
        const metaCodeParam = discovery.errorCode ? `&meta_code=${encodeURIComponent(discovery.errorCode)}` : '';
        return NextResponse.redirect(
          new URL(`/creator/accounts?error=meta_api_error${metaCodeParam}`, origin)
        );
      }
      return NextResponse.redirect(
        new URL('/creator/accounts?error=no_account_granted', origin)
      );
    }

    // 7. Envelope-encrypt the long-lived token (AES-256-GCM)
    const encrypted = encryptToken(longLivedToken);

    // 8. Probe capabilities, persist accounts, and trigger initial sync
    const appSecret = process.env.META_APP_SECRET || '';

    for (const targetAccount of discovery.accounts) {
      console.log(`[OAuthCallback] Step 6: Probing capabilities for @${targetAccount.username} (${targetAccount.id})...`);
      const capabilities = await probeAccountCapabilities(targetAccount.id, longLivedToken);

      let accountId: string;
      try {
        const saved = await saveSocialAccountAndCredentials(
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
            token_type: discovery.debugToken.tokenType === 'SYSTEM_USER' ? 'system_user' : 'long_lived_user',
            expires_at: expiresAt,
            created_at: new Date(),
            rotated_at: null,
          }
        );
        accountId = saved.accountId;
      } catch (saveErr: any) {
        if (
          saveErr?.status === 409 ||
          saveErr?.code === 'ACCOUNT_ALREADY_LINKED' ||
          (saveErr?.message && saveErr.message.includes('already claimed'))
        ) {
          console.warn('[OAuthCallback] Account already linked to another creator profile:', {
            igId: targetAccount.id,
          });
          return NextResponse.redirect(
            new URL('/creator/accounts?error=account_already_linked', origin)
          );
        }
        throw saveErr;
      }

      // Trigger initial sync cycle (profile counts, views, demographics)
      try {
        await syncInstagramAccount(accountId, { forceDemographics: true });
        console.log(`[OAuthCallback] Initial sync completed successfully for @${targetAccount.username}`);
      } catch (syncErr: any) {
        console.warn(`[OAuthCallback] Initial sync non-fatal warning for @${targetAccount.username}:`, syncErr.message);
      }
    }

    // 9. Redirect with success banner (signed account chooser token if multiple accounts)
    if (discovery.accounts.length > 1) {
      const selectionToken = createAccountSelectionToken(
        {
          creatorId: session.user.id,
          allowedIgIds: discovery.accounts.map((a) => a.id),
          accountsMeta: discovery.accounts.map((a) => ({ igId: a.id, username: a.username })),
          encryptedTokenPayload: {
            ciphertext: encrypted.ciphertext,
            nonce: encrypted.nonce,
            keyId: encrypted.keyId,
          },
        },
        appSecret
      );

      console.log(`[OAuthCallback] Step 7: Successfully connected ${discovery.accounts.length} accounts (signed chooser token issued).`);
      return NextResponse.redirect(
        new URL(
          `/creator/accounts?success=multiple_accounts_connected&count=${discovery.accounts.length}&username=${encodeURIComponent(
            discovery.accounts[0].username
          )}&selection_token=${encodeURIComponent(selectionToken)}`,
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
    const incidentId = `srv_${crypto.randomBytes(4).toString('hex')}`;
    console.error(`[OAuthCallback] Step Failed: Exception during OAuth exchange/discovery [${incidentId}]:`, {
      incidentId,
      message: err?.message ? scrubSensitiveData(err.message) : 'Unknown error',
      code: err?.code,
    });

    if (err?.code && (typeof err.code === 'number' || typeof err.code === 'string')) {
      return NextResponse.redirect(
        new URL(`/creator/accounts?error=meta_api_error&meta_code=${encodeURIComponent(err.code)}`, origin)
      );
    }

    return NextResponse.redirect(
      new URL(`/creator/accounts?error=discovery_failed_server&incident_id=${incidentId}`, origin)
    );
  }
}
