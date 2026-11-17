import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateRequestId } from '@/lib/request-id';

export async function GET(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') ?? generateRequestId();
  try {
    const session = await getSession(requestId);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, ...session });
  } catch (err: unknown) {
    console.error('[api/auth/me] Unexpected error', {
      error: err instanceof Error ? err.message : 'Unknown',
      requestId,
    });
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch session', requestId } },
      { status: 500 }
    );
  }
}
