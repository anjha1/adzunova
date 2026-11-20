import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { duplicateRateCardItem } from '@/lib/rate-card/rate-card-repository';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const duplicated = await duplicateRateCardItem(session.user.id, id);
    return NextResponse.json(duplicated, { status: 201 });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
