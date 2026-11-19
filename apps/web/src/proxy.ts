import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

function getValidSessionRole(sessionToken?: string): 'CREATOR' | 'BRAND' | null {
  if (!sessionToken) return null;
  const parts = sessionToken.split('.');
  // Compound format: rawToken.header.payload.signature
  // Standard format: header.payload.signature
  const payloadB64 = parts.length >= 4 ? parts[2] : parts.length === 3 ? parts[1] : null;
  if (!payloadB64) return null;

  try {
    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(b64);
    const payload = JSON.parse(jsonStr);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // Expired session
    }
    return payload.role === 'BRAND' ? 'BRAND' : payload.role === 'CREATOR' ? 'CREATOR' : null;
  } catch {
    return null;
  }
}

function getPublicOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, '');
  }
  return req.nextUrl.origin;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const activeRole = getValidSessionRole(sessionToken);
  const origin = getPublicOrigin(req);

  // 1. Homepage Redirect when already logged in
  if (pathname === '/') {
    if (activeRole === 'CREATOR') {
      return NextResponse.redirect(new URL('/creator/dashboard', origin));
    }
    if (activeRole === 'BRAND') {
      return NextResponse.redirect(new URL('/brand/dashboard', origin));
    }
  }

  // 2. Creator Route Protection
  if (pathname.startsWith('/creator/')) {
    if (!sessionToken) {
      const url = new URL('/auth/creator/sign-in', origin);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Brand Route Protection
  if (pathname.startsWith('/brand/')) {
    if (!sessionToken) {
      const url = new URL('/auth/brand/sign-in', origin);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 4. Auth Pages Redirect when already logged in
  if (
    pathname.startsWith('/auth/creator/sign-in') ||
    pathname.startsWith('/auth/creator/sign-up')
  ) {
    if (req.nextUrl.searchParams.has('redirect') || req.nextUrl.searchParams.has('error')) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
    if (activeRole === 'CREATOR') {
      return NextResponse.redirect(new URL('/creator/dashboard', origin));
    }
  }

  if (
    pathname.startsWith('/auth/brand/sign-in') ||
    pathname.startsWith('/auth/brand/sign-up')
  ) {
    if (req.nextUrl.searchParams.has('redirect') || req.nextUrl.searchParams.has('error')) {
      const response = NextResponse.next();
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
    if (activeRole === 'BRAND') {
      return NextResponse.redirect(new URL('/brand/dashboard', origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/creator/:path*',
    '/brand/:path*',
    '/auth/:path*',
  ],
};
