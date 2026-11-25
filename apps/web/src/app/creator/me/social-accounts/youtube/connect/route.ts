import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPublicOrigin, getYouTubeConfigStatus } from '@/lib/config';
import { generatePersistentOAuthState } from '@/lib/social/oauth-state';
import { generatePkcePair, getYouTubeOAuthUrl } from '@/lib/social/youtube-client';
import { getYouTubeFeatureFlags, recordYouTubeConnectAttempt } from '@/lib/social/youtube-observability';
import crypto from 'crypto';

// Per-creator & per-IP rate limit window (max 10 connect initiations per 5 minutes)
const connectAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = connectAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    connectAttempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);

  // 0. Kill switch check (FEATURE_YOUTUBE_CONNECT)
  const flags = getYouTubeFeatureFlags();
  if (!flags.youtubeConnectEnabled) {
    return NextResponse.redirect(
      new URL('/creator/accounts?error=youtube_not_configured&reason=YouTube+Connect+is+temporarily+disabled', origin)
    );
  }
  recordYouTubeConnectAttempt(crypto.randomUUID().slice(0, 8));

  // 1. Authenticate creator session (fail closed)
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.redirect(
      new URL('/auth/creator/sign-in?redirect=/creator/accounts', origin)
    );
  }

  // 2. Rate limit per creator and IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(`creator:${session.user.id}`) || isRateLimited(`ip:${ip}`)) {
    return NextResponse.redirect(
      new URL('/creator/accounts?error=google_api_error&reason=rate_limited_try_again_later', origin)
    );
  }

  // 3. Validate YouTube OAuth configuration without crashing
  const ytConfig = getYouTubeConfigStatus();
  if (!ytConfig.configured) {
    return NextResponse.redirect(
      new URL(
        `/creator/accounts?error=youtube_not_configured&reason=${encodeURIComponent(
          ytConfig.reason || 'YouTube Connect is not configured'
        )}`,
        origin
      )
    );
  }

  try {
    // 4. Generate PKCE (S256) pair and single-use persistent CSPRNG state bound to creator + session
    const { codeVerifier, codeChallenge } = generatePkcePair();
    const sessionId = session.user.id;
    const state = await generatePersistentOAuthState(session.user.id, sessionId, {
      provider: 'youtube',
      codeVerifier,
    });

    // 5. Redirect browser to Google OAuth 2.0 consent screen
    const authUrl = getYouTubeOAuthUrl({ state, codeChallenge });
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error('[YouTubeConnect] Failed to initiate OAuth flow:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.redirect(
      new URL('/creator/accounts?error=discovery_failed_server', origin)
    );
  }
}
