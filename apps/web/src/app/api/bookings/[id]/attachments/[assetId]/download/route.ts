import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { getBookingById } from '@adzunova/payments-db';
import { StoragePortError } from '@/lib/storage/errors';
import { issueAuthorizedDownloadUrl } from '@/lib/storage/upload-service';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string; assetId: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, assetId } = await context.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (
      (session.user.role === 'BRAND' && booking.brandId !== session.user.id) ||
      (session.user.role === 'CREATOR' && booking.creatorId !== session.user.id)
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const actorRole = session.user.role;
    const result = await issueAuthorizedDownloadUrl({
      actor: {
        userId: session.user.id,
        tenantId: `${actorRole.toLowerCase()}:${session.user.id}`,
        ownerType: actorRole,
        ownerId: session.user.id,
      },
      assetId,
      bookingId: id,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof StoragePortError) {
      return NextResponse.json(err.problem, { status: err.problem.status });
    }
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
