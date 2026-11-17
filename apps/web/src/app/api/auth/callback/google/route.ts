import { NextRequest, NextResponse } from 'next/server';
import { identityFetch } from '@/lib/identity-client';
import { generateRequestId } from '@/lib/request-id';
import { getPublicOrigin } from '@/lib/config';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const origin = getPublicOrigin(req);

  let errorRole = 'creator';
  if (state) {
    try {
      const parts = state.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.role?.toUpperCase() === 'BRAND') {
          errorRole = 'brand';
        }
      }
    } catch {
      // Fallback to default creator role if state cannot be inspected
    }
  }

  if (error || !code || !state) {
    const errorMsg = error || 'OAuth cancellation or missing authorization code.';
    return NextResponse.redirect(
      `${origin}/auth/${errorRole}/sign-in?error=${encodeURIComponent(errorMsg)}`
    );
  }

  const { data, err } = await identityFetch<{
    user: { id: string; email: string; role: string };
    profile: Record<string, unknown>;
    sessionToken: string;
    isNewUser: boolean;
    targetRedirect?: string;
  }>('/api/v1/auth/oauth/google/callback', {
    method: 'POST',
    body: JSON.stringify({ code, state }),
    requestId,
  });

  if (err) {
    console.error('[api/auth/callback/google] identity-service error', {
      code: err.code,
      internal: err._internal,
      requestId,
    });
    const msg =
      err.code === 'IDENTITY_UNREACHABLE' || err.code === 'IDENTITY_TIMEOUT'
        ? 'Authentication service is temporarily unavailable.'
        : err.message;
    return NextResponse.redirect(
      `${origin}/auth/${errorRole}/sign-in?error=${encodeURIComponent(msg)}&requestId=${requestId}`
    );
  }

  if (!data?.sessionToken) {
    return NextResponse.redirect(
      `${origin}/auth/${errorRole}/sign-in?error=${encodeURIComponent('OAuth verification failed')}&requestId=${requestId}`
    );
  }

  // Determine redirect based on role and onboarding state
  let targetPath = '/creator/onboarding';
  if (data.user?.role === 'CREATOR') {
    targetPath = data.profile?.onboardingCompleted ? '/creator/dashboard' : '/creator/onboarding';
  } else if (data.user?.role === 'BRAND') {
    targetPath = data.profile?.onboardingCompleted ? '/brand/dashboard' : '/brand/onboarding';
  }
  if (data.targetRedirect && data.targetRedirect !== '/') {
    targetPath = data.targetRedirect;
  }

  const redirectUrl = new URL(targetPath, origin);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(AUTH_COOKIE_NAME, data.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
