import { NextRequest, NextResponse } from 'next/server';
import { identityFetch } from '@/lib/identity-client';
import { generateRequestId } from '@/lib/request-id';
import { getPublicOrigin } from '@/lib/config';

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const searchParams = req.nextUrl.searchParams;
  const role = searchParams.get('role') || 'CREATOR';
  const redirect = searchParams.get('redirect') || '';
  const publicOrigin = getPublicOrigin(req);
  const callbackUrl = `${publicOrigin}/api/auth/callback/google`;

  const queryParams = new URLSearchParams({
    role,
    callbackUrl,
  });
  if (redirect) {
    queryParams.set('redirect', redirect);
  }

  const { data, err } = await identityFetch<{ url: string }>(
    `/api/v1/auth/oauth/google/init?${queryParams.toString()}`,
    { method: 'GET', requestId }
  );

  if (err) {
    // Log full internal detail server-side only
    console.error('[api/auth/google] identity-service error', {
      code: err.code,
      internal: err._internal,
      requestId,
    });

    // Return typed, structured error to the browser — no internal URLs or secrets
    if (err.code === 'IDENTITY_UNREACHABLE' || err.code === 'IDENTITY_TIMEOUT') {
      return NextResponse.json(
        {
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Authentication service is temporarily unavailable. Please try again.',
            requestId,
          },
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'BAD_GATEWAY',
          message: 'Failed to initiate Google sign-in. Please try again.',
          requestId,
        },
      },
      { status: 502 }
    );
  }

  if (!data?.url) {
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'No authorization URL returned. Check GOOGLE_CLIENT_ID configuration.',
          requestId,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.url);
}
