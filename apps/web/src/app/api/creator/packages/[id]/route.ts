import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import {
  getCreatorPackageById,
  updateCreatorPackage,
  deleteCreatorPackage,
} from '@/lib/creator/packages-repository';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const pkg = await getCreatorPackageById(session.user.id, id);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ package: pkg });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await req.json()) as Record<string, unknown>;
    const updated = await updateCreatorPackage(session.user.id, id, {
      name: body.name !== undefined ? String(body.name) : undefined,
      tagline: body.tagline !== undefined ? String(body.tagline) : undefined,
      deliverables: Array.isArray(body.deliverables)
        ? body.deliverables.map(String)
        : undefined,
      originalPricePaise:
        body.originalPricePaise !== undefined ? String(body.originalPricePaise) : undefined,
      discountedPricePaise:
        body.discountedPricePaise !== undefined ? String(body.discountedPricePaise) : undefined,
      turnaroundDays:
        body.turnaroundDays !== undefined ? Number(body.turnaroundDays) : undefined,
      revisions: body.revisions !== undefined ? Number(body.revisions) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ package: updated });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Unauthorized: Creator session required' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteCreatorPackage(session.user.id, id);
    if (!deleted) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
