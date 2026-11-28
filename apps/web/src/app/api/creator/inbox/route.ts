import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { listBookingsForUser } from '@adzunova/payments-db';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized: Creator session required' },
      { status: 401 }
    );
  }

  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const result = await listBookingsForUser({
      userId: session.user.id,
      role: 'CREATOR',
      cursor,
      limit,
    });
    return NextResponse.json(result);
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
