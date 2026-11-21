import { NextRequest, NextResponse } from 'next/server';
import { identityRequest } from '@/lib/auth';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const format = req.nextUrl.searchParams.get('format');
    const verify = req.nextUrl.searchParams.get('verify');
    let url = '/api/v1/auth/workspace/audit-log';
    if (format) url += `?format=${format}`;
    else if (verify) url += `?verify=${verify}`;

    const { data, error } = await identityRequest(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${sessionCookie}` },
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve audit log' },
      { status: 500 }
    );
  }
}
