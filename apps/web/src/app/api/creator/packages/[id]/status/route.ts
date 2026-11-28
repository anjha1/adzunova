import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { toggleCreatorPackageStatus } from '@/lib/creator/packages-repository';

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
    const body = (await req.json()) as { isActive?: boolean };
    const updated = await toggleCreatorPackageStatus(
      session.user.id,
      id,
      Boolean(body.isActive)
    );
    if (!updated) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json({ package: updated });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
