import { NextRequest, NextResponse } from 'next/server';
import { identityRequest } from '@/lib/auth';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'adzunova_session';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await identityRequest('/api/v1/auth/workspace/approvals', {
      method: 'GET',
      headers: { Authorization: `Bearer ${sessionCookie}` },
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to retrieve approvals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Route to creation or decision
    const endpoint = body.decision
      ? '/api/v1/auth/workspace/approvals/decide'
      : '/api/v1/auth/workspace/approvals';

    const { data, error } = await identityRequest(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie}`,
      },
      body: JSON.stringify(body),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Approval operation failed' },
      { status: 500 }
    );
  }
}
