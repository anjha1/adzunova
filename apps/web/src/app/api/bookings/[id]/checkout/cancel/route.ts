import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { cancelOrFailPaymentAttempt } from '@adzunova/payments-db';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'BRAND') {
    return NextResponse.json({ error: 'Unauthorized: Brand session required' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const status = body.status === 'FAILED' ? 'FAILED' : 'CANCELLED';
    const reason = String(body.reason ?? 'Checkout cancelled by brand').slice(0, 200);

    const attempt = await cancelOrFailPaymentAttempt({
      bookingId: id,
      brandId: session.user.id,
      attemptId: body.attemptId ? String(body.attemptId) : undefined,
      status,
      reason,
    });

    return NextResponse.json({ attempt });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
