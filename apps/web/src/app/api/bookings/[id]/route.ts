import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { getBookingWithEvents } from '@adzunova/payments-db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await getBookingWithEvents(id);
    if (!result) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    const isParty =
      result.booking.brandId === session.user.id ||
      result.booking.creatorId === session.user.id;
    if (!isParty) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json(result);
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
