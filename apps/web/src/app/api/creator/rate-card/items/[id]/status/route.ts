import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateRateCardItem } from '@/lib/rate-card/rate-card-repository';
import { updateRateCardStatusSchema } from '@/lib/rate-card/validation';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = updateRateCardStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, expectedVersion } = parsed.data;
    const updated = await updateRateCardItem(
      session.user.id,
      id,
      { status },
      expectedVersion
    );
    return NextResponse.json(updated);
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
