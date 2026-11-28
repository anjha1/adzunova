import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { getActiveAgreementForBooking, getBookingById } from '@adzunova/payments-db';
import { loadPaymentsEnv } from '@/lib/payments/env';
import { generateOrGetBookingAgreement } from '@/lib/bookings/agreement-service';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (
      (session.user.role === 'BRAND' && booking.brandId !== session.user.id) ||
      (session.user.role === 'CREATOR' && booking.creatorId !== session.user.id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const agreement = await getActiveAgreementForBooking(id);
    const env = loadPaymentsEnv();
    return NextResponse.json({
      agreement,
      esignConfigured: env.esignConfigured,
      esignProvider: env.esignProvider,
      esignMessage: env.esignConfigured ? null : 'E-sign not configured',
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await generateOrGetBookingAgreement({
      bookingId: id,
      actorId: session.user.id,
      actorRole: session.user.role,
    });
    const booking = await getBookingById(id);
    const env = loadPaymentsEnv();
    return NextResponse.json(
      {
        agreement: result.agreement,
        booking,
        created: result.created,
        esignConfigured: env.esignConfigured,
        esignMessage: env.esignConfigured ? null : 'E-sign not configured',
      },
      { status: result.created ? 201 : 200 }
    );
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
