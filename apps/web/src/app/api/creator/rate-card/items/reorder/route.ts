import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { reorderRateCardItems } from '@/lib/rate-card/rate-card-repository';
import { reorderRateCardItemsSchema } from '@/lib/rate-card/validation';

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = reorderRateCardItemsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await reorderRateCardItems(session.user.id, parsed.data.orderedIds);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
