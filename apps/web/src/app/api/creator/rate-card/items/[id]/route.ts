import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getRateCardItemById,
  updateRateCardItem,
  softDeleteRateCardItem,
} from '@/lib/rate-card/rate-card-repository';
import { updateRateCardItemSchema } from '@/lib/rate-card/validation';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const item = await getRateCardItemById(session.user.id, id);
    if (!item) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const parsed = updateRateCardItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { version, ...updates } = parsed.data;
    const updated = await updateRateCardItem(session.user.id, id, updates, version);
    return NextResponse.json(updated);
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await softDeleteRateCardItem(session.user.id, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
