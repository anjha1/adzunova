import { NextRequest, NextResponse } from 'next/server';
import { identityRequest } from '@/lib/auth';
import { getPublicOrigin } from '@/lib/config';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

async function handleLogout(req: NextRequest) {
  const sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (sessionToken) {
    try {
      await identityRequest('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
    } catch {
      // Invalidate local cookie regardless of upstream service state
    }
  }

  const searchParams = req.nextUrl.searchParams;
  const redirectTarget = searchParams.get('redirect') || '/auth/creator/sign-in';

  const acceptsHtml = req.headers.get('accept')?.includes('text/html');
  const isFormPost = req.headers.get('content-type')?.includes('application/x-www-form-urlencoded');

  let response: NextResponse;

  if (acceptsHtml || isFormPost || req.method === 'GET') {
    const origin = getPublicOrigin(req);
    response = NextResponse.redirect(new URL(redirectTarget, origin));
  } else {
    response = NextResponse.json({ success: true, message: 'Logged out' });
  }

  // Clear session cookie
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export async function POST(req: NextRequest) {
  return handleLogout(req);
}

export async function GET(req: NextRequest) {
  return handleLogout(req);
}
