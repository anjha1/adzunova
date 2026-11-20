import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getRateCardItems,
  createRateCardItem,
} from '@/lib/rate-card/rate-card-repository';
import { createRateCardItemSchema } from '@/lib/rate-card/validation';
import { RateCardPlatform, ContentFormat, RateCardStatus } from '@/lib/rate-card/types';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const platform = (searchParams.get('platform') as RateCardPlatform) || undefined;
  const contentFormat = (searchParams.get('contentFormat') as ContentFormat) || undefined;
  const status = (searchParams.get('status') as RateCardStatus) || undefined;
  const search = searchParams.get('search') || undefined;
  const sortBy = (searchParams.get('sortBy') as any) || undefined;

  try {
    const items = await getRateCardItems(session.user.id, {
      platform,
      contentFormat,
      status,
      search,
      sortBy,
    });
    return NextResponse.json({ items });
  } catch (err: any) {
    console.error('[RateCardItemsAPI] Error fetching rate card items:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createRateCardItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const created = await createRateCardItem(session.user.id, parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('[RateCardItemsAPI] Error creating rate card item:', err);
    const status = err.status || 500;
    return NextResponse.json({ error: err.message || 'Failed to create rate card item' }, { status });
  }
}
