import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRateCardItemById } from '@/lib/rate-card/rate-card-repository';
import { calculateRateCardQuote } from '@/lib/rate-card/quote-calculator';
import { quoteSimulationRequestSchema } from '@/lib/rate-card/validation';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = quoteSimulationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const item = await getRateCardItemById(session.user.id, parsed.data.itemId);
    if (!item) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 });
    }

    const quote = calculateRateCardQuote(item, parsed.data.selectedAddonTypes);
    return NextResponse.json(quote);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
