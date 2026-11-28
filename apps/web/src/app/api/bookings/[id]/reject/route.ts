import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { rejectBooking } from '@adzunova/payments-db';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized: Creator session required' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = (await req.json()) as { reason?: string };
    const booking = await rejectBooking({
      bookingId: id,
      creatorId: session.user.id,
      reason: String(body.reason ?? ''),
    });
    return NextResponse.json({ booking });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
