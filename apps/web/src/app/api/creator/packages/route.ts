import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import {
  listCreatorPackages,
  createCreatorPackage,
} from '@/lib/creator/packages-repository';

export async function GET() {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized: Creator session required' },
      { status: 401 }
    );
  }

  try {
    const packages = await listCreatorPackages(session.user.id);
    return NextResponse.json({ packages });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json(
      { error: 'Unauthorized: Creator session required' },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const pkg = await createCreatorPackage(session.user.id, {
      name: String(body.name ?? ''),
      tagline: body.tagline !== undefined ? String(body.tagline) : undefined,
      deliverables: Array.isArray(body.deliverables)
        ? body.deliverables.map(String)
        : undefined,
      originalPricePaise:
        body.originalPricePaise !== undefined ? String(body.originalPricePaise) : undefined,
      discountedPricePaise: String(body.discountedPricePaise ?? '0'),
      turnaroundDays:
        body.turnaroundDays !== undefined ? Number(body.turnaroundDays) : undefined,
      revisions: body.revisions !== undefined ? Number(body.revisions) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });
    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
