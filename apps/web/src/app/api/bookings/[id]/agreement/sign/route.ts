import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { initiateAgreementSigning } from '@/lib/bookings/agreement-service';

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const result = await initiateAgreementSigning({
      bookingId: id,
      actorId: session.user.id,
      actorRole: session.user.role,
    });
    return NextResponse.json(result);
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
