import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AppProblemError, toProblemDetails } from '@adzunova/problem-details';
import { counterBooking, getBookingById } from '@adzunova/payments-db';
import { resolveServerBookingQuote } from '@/lib/bookings/quote-service';

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
    const existing = await getBookingById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (existing.creatorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const proposedPriceInr =
      body.proposedPriceInr !== undefined && body.proposedPriceInr !== ''
        ? Number(body.proposedPriceInr)
        : undefined;

    if (proposedPriceInr !== undefined && (!Number.isFinite(proposedPriceInr) || proposedPriceInr <= 0)) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_COUNTER_PRICE',
        title: 'Invalid Counter Price',
        detail: 'Proposed price must be a positive number.',
      });
    }

    if (proposedPriceInr !== undefined && existing.pricingType !== 'NEGOTIABLE') {
      throw new AppProblemError({
        status: 409,
        code: 'FIXED_PRICE_CANNOT_BE_COUNTERED',
        title: 'Fixed Price Deliverable',
        detail: 'Fixed-price items allow countering delivery dates or add-ons only.',
      });
    }

    const newSelectedAddons = Array.isArray(body.selectedAddons)
      ? body.selectedAddons.map(String)
      : existing.selectedAddons;
    const newDeliveryDate = body.deliveryDate ? String(body.deliveryDate).trim() : existing.deliveryDate;

    const reQuoted = await resolveServerBookingQuote({
      creatorId: existing.creatorId,
      rateCardItemId: existing.rateCardItemId ?? undefined,
      packageId: existing.packageId ?? undefined,
      selectedAddons: newSelectedAddons,
      quantity: existing.quantity,
      overrideBasePriceInr: proposedPriceInr,
    });

    const booking = await counterBooking({
      bookingId: id,
      creatorId: session.user.id,
      newDeliveryDate,
      newSelectedAddons: reQuoted.selectedAddons,
      newQuoteSnapshot: reQuoted.breakdown,
      proposedPriceInr,
      note: body.note ? String(body.note) : undefined,
    });

    return NextResponse.json({ booking });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
