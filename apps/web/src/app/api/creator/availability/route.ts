import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import {
  getCreatorAvailability,
  upsertCreatorAvailability,
  type AvailabilityDayEntry,
} from '@/lib/creator/availability-repository';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const now = new Date();
    const year = Number(url.searchParams.get('year') ?? now.getFullYear());
    const month = Number(url.searchParams.get('month') ?? now.getMonth() + 1);
    const availability = await getCreatorAvailability(session.user.id, year, month);
    return NextResponse.json({ availability });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      year: number;
      month: number;
      timezone?: string;
      days: AvailabilityDayEntry[];
    };
    const availability = await upsertCreatorAvailability(session.user.id, {
      year: Number(body.year),
      month: Number(body.month),
      timezone: body.timezone,
      days: body.days,
    });
    return NextResponse.json({ availability });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
