import { NextRequest, NextResponse } from 'next/server';
import { toProblemDetails } from '@adzunova/problem-details';
import { resolveServerBookingQuote } from '@/lib/bookings/quote-service';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const creatorId = String(body.creatorId ?? '').trim();
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId is required' }, { status: 400 });
    }

    const resolved = await resolveServerBookingQuote({
      creatorId,
      rateCardItemId: body.rateCardItemId ? String(body.rateCardItemId) : undefined,
      packageId: body.packageId ? String(body.packageId) : undefined,
      selectedAddons: Array.isArray(body.selectedAddons)
        ? body.selectedAddons.map(String)
        : [],
      quantity: body.quantity !== undefined ? Number(body.quantity) : 1,
    });

    return NextResponse.json({ quote: resolved });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
