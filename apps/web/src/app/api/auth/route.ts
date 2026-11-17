import { NextRequest, NextResponse } from 'next/server';
import { identityRequest } from '@/lib/auth';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    let endpoint = '';
    const payload = body;

    if (action === 'register-creator') {
      endpoint = '/api/v1/auth/register/creator';
    } else if (action === 'register-brand') {
      endpoint = '/api/v1/auth/register/brand';
    } else if (action === 'login') {
      endpoint = '/api/v1/auth/login';
    } else if (action === 'forgot-password') {
      endpoint = '/api/v1/auth/forgot-password';
    } else if (action === 'reset-password') {
      endpoint = '/api/v1/auth/reset-password';
    } else if (action === 'onboarding') {
      endpoint = '/api/v1/auth/onboarding';
    } else if (action === 'send-otp') {
      endpoint = '/api/v1/auth/otp/send';
    } else if (action === 'verify-otp') {
      endpoint = '/api/v1/auth/otp/verify';
    } else {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const headers: Record<string, string> = {};
    if (sessionCookie) {
      headers['Authorization'] = `Bearer ${sessionCookie}`;
    }

    const { data, error } = await identityRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const response = NextResponse.json(data);

    // If response contains sessionToken, establish HttpOnly cookie
    if (data && typeof data.sessionToken === 'string') {
      response.cookies.set(AUTH_COOKIE_NAME, data.sessionToken, {
        httpOnly: true,
        secure: false, // allow localhost
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
