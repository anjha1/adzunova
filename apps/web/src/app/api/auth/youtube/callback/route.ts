import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { getPublicOrigin, getYouTubeConfigStatus } from '@/lib/config';
import { validateAndConsumePersistentOAuthState } from '@/lib/social/oauth-state';
import {
  exchangeYouTubeCode,
  verifyGrantedYouTubeScopes,
  fetchYouTubeChannelMine,
  runYouTubeProbeMatrix,
} from '@/lib/social/youtube-client';
import { encryptToken } from '@/lib/social/security/encryption';
import { maskId, scrubSensitiveData } from '@/lib/social/security/log-scrubber';
import { saveSocialAccountAndCredentials } from '@/lib/social/social-repository';
import { syncYouTubeAccount } from '@/lib/social/youtube-sync';

function debugLog(step: string, payload: Record<string, unknown>) {
  if (process.env.DEBUG_OAUTH !== 'true') return;
  const serialized = scrubSensitiveData(JSON.stringify(payload));
  console.log(`[YouTubeOAuthDebug] ${step} ${serialized}`);
}

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);
  const correlationId = crypto.randomUUID().slice(0, 8);
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // 1. Fail closed on creator session
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.redirect(
      new URL('/auth/creator/sign-in?redirect=/creator/accounts', origin)
    );
  }

  // 2. Ensure YouTube Connect is configured
  const ytConfig = getYouTubeConfigStatus();
  if (!ytConfig.configured) {
    return NextResponse.redirect(
      new URL('/creator/accounts?error=youtube_not_configured', origin)
    );
  }

  // 3. Handle consent denial / OAuth error param
  if (error || !code) {
    debugLog('step1_consent_error', {
      correlationId,
      error: error || 'missing_code',
      creatorId: maskId(session.user.id),
    });
    const codeParam = error === 'access_denied' ? 'consent_denied' : 'google_api_error';
    const reasonParam = error ? `&reason=${encodeURIComponent(error)}` : '';
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=${codeParam}${reasonParam}`, origin)
    );
  }

  // 4. Validate single-use CSPRNG state + PKCE verifier bound to creator & session
  const stateCheck = await validateAndConsumePersistentOAuthState(
    state || '',
    session.user.id,
    session.user.id
  );
  debugLog('step2_state_validation', {
    correlationId,
    valid: stateCheck.valid,
    reason: stateCheck.reason,
    hasCodeVerifier: Boolean(stateCheck.data?.codeVerifier),
    provider: stateCheck.data?.provider,
    creatorId: maskId(session.user.id),
  });

  if (!stateCheck.valid || stateCheck.data?.provider !== 'youtube' || !stateCheck.data.codeVerifier) {
    return NextResponse.redirect(
      new URL('/creator/accounts?error=state_invalid_or_expired', origin)
    );
  }

  try {
    // 5. Exchange code for access_token + refresh_token with PKCE code_verifier
    const tokenRes = await exchangeYouTubeCode({
      code,
      codeVerifier: stateCheck.data.codeVerifier,
    });

    debugLog('step3_token_exchange', {
      correlationId,
      httpStatus: tokenRes.status,
      responseKeys: tokenRes.keys,
      tokenType: tokenRes.data.token_type || null,
      expiresIn: tokenRes.data.expires_in || null,
      hasAccessToken: Boolean(tokenRes.data.access_token),
      hasRefreshToken: Boolean(tokenRes.data.refresh_token),
      grantedScopeString: tokenRes.data.scope || '',
      error: tokenRes.data.error || null,
    });

    if (tokenRes.status !== 200 || !tokenRes.data.access_token) {
      const errCode = tokenRes.data.error || 'token_exchange_failed';
      return NextResponse.redirect(
        new URL(`/creator/accounts?error=google_api_error&reason=${encodeURIComponent(errCode)}`, origin)
      );
    }

    // 6. Verify BOTH required read-only scopes were actually granted
    const scopeCheck = verifyGrantedYouTubeScopes(tokenRes.data.scope);
    debugLog('step4_scope_verification', {
      correlationId,
      valid: scopeCheck.valid,
      grantedScopes: scopeCheck.grantedScopes,
      missingScopes: scopeCheck.missingScopes,
    });

    if (!scopeCheck.valid) {
      return NextResponse.redirect(
        new URL(
          `/creator/accounts?error=missing_scope&missing=${encodeURIComponent(scopeCheck.missingScopes.join(','))}`,
          origin
        )
      );
    }

    // 7. Ensure refresh token is present (required for offline background sync)
    if (!tokenRes.data.refresh_token) {
      return NextResponse.redirect(
        new URL('/creator/accounts?error=no_refresh_token', origin)
      );
    }

    // 8. Discover channel via channels.list?mine=true
    const channelRes = await fetchYouTubeChannelMine(tokenRes.data.access_token);
    debugLog('step5_channel_discovery', {
      correlationId,
      httpStatus: channelRes.status,
      rawKeys: channelRes.rawKeys,
      channelCount: channelRes.items.length,
      errorReason: channelRes.error?.errors?.[0]?.reason || null,
      firstChannel: channelRes.items[0]
        ? {
            id: maskId(channelRes.items[0].id),
            hasCustomUrl: Boolean(channelRes.items[0].snippet?.customUrl),
            hiddenSubscriberCount: channelRes.items[0].statistics?.hiddenSubscriberCount ?? false,
            hasUploadsPlaylist: Boolean(channelRes.items[0].contentDetails?.relatedPlaylists?.uploads),
          }
        : null,
    });

    if (channelRes.status !== 200) {
      const reason = channelRes.error?.errors?.[0]?.reason || `http_${channelRes.status}`;
      return NextResponse.redirect(
        new URL(`/creator/accounts?error=google_api_error&reason=${encodeURIComponent(reason)}`, origin)
      );
    }

    if (channelRes.items.length === 0) {
      return NextResponse.redirect(
        new URL('/creator/accounts?error=no_channel', origin)
      );
    }

    const ch = channelRes.items[0];
    const hiddenSubs = Boolean(ch.statistics?.hiddenSubscriberCount);
    const subscriberCount = hiddenSubs ? 0 : Number(ch.statistics?.subscriberCount || 0);
    const videoCount = Number(ch.statistics?.videoCount || 0);
    const viewCount = Number(ch.statistics?.viewCount || 0);
    const handle = ch.snippet?.customUrl || ch.snippet?.title || ch.id;
    const avatarUrl =
      ch.snippet?.thumbnails?.high?.url ||
      ch.snippet?.thumbnails?.medium?.url ||
      ch.snippet?.thumbnails?.default?.url ||
      null;

    // 9. When DEBUG_OAUTH=true, run Phase 1 probe matrix and emit scrubbed summary
    if (process.env.DEBUG_OAUTH === 'true') {
      const probeSummary = await runYouTubeProbeMatrix(tokenRes.data.access_token);
      debugLog('step6_probe_matrix', {
        correlationId,
        probedAt: probeSummary.probedAt,
        probes: probeSummary.probes,
      });
    }

    // 10. Encrypt refresh token and persist account + credential in one transaction
    const encryptedRefresh = encryptToken(tokenRes.data.refresh_token);

    let savedAccountId: string;
    try {
      const saved = await saveSocialAccountAndCredentials(
        {
          creator_id: session.user.id,
          creator_email: session.user.email,
          provider: 'youtube',
          provider_user_id: ch.id,
          username: handle,
          account_type: ch.snippet?.title || 'YOUTUBE_CHANNEL',
          profile_picture_url: avatarUrl,
          followers_count: subscriberCount,
          media_count: videoCount,
          status: 'ACTIVE',
          scopes: scopeCheck.grantedScopes,
          capabilities: {
            youtubeDataApi: true,
            youtubeAnalyticsApi: true,
            hiddenSubscriberCount: hiddenSubs,
            totalChannelViews: viewCount,
            uploadsPlaylistId: ch.contentDetails?.relatedPlaylists?.uploads || null,
          },
          connected_at: new Date(),
          last_synced_at: new Date(),
          next_sync_at: new Date(Date.now() + 6 * 60 * 60 * 1000),
          sync_tier: 'WARM',
          failure_count: 0,
        },
        {
          token_ciphertext: encryptedRefresh.ciphertext,
          token_nonce: encryptedRefresh.nonce,
          key_id: encryptedRefresh.keyId,
          token_type: 'refresh_token',
          expires_at: null, // Refresh tokens do not have a fixed expiry (except Testing 7-day policy)
          created_at: new Date(),
          rotated_at: null,
        }
      );
      savedAccountId = saved.accountId;
    } catch (saveErr: any) {
      if (saveErr?.message?.includes('already linked to another creator')) {
        return NextResponse.redirect(
          new URL('/creator/accounts?error=account_already_linked', origin)
        );
      }
      throw saveErr;
    }

    // 11. Run initial YouTube Analytics + Top Videos backfill immediately (non-fatal if Analytics lags)
    try {
      await syncYouTubeAccount(savedAccountId, { isInitialBackfill: true });
    } catch (syncErr) {
      console.warn(
        `[YouTubeCallback] Initial sync deferred (correlationId=${correlationId}):`,
        syncErr instanceof Error ? scrubSensitiveData(syncErr.message) : 'Unknown error'
      );
    }

    return NextResponse.redirect(
      new URL('/creator/accounts?connected=youtube', origin)
    );
  } catch (err) {
    console.error(
      `[YouTubeCallback] Unexpected failure (correlationId=${correlationId}):`,
      err instanceof Error ? scrubSensitiveData(err.message) : 'Unknown error'
    );
    return NextResponse.redirect(
      new URL(`/creator/accounts?error=discovery_failed_server&support_id=${correlationId}`, origin)
    );
  }
}
