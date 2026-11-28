import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { getBookingById } from '@adzunova/payments-db';
import { listBookingAttachmentsStatus } from '@/lib/storage/upload-service';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
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

    const items = await listBookingAttachmentsStatus({
      bookingId: id,
      assetIds: booking.assetIds,
    });

    return NextResponse.json({
      items: items.map((item) => ({
        assetId: item.assetId,
        fileName: item.fileName,
        contentType: item.contentType,
        scanStatus: item.scanStatus,
        releaseStatus: item.releaseStatus,
        canDownload: item.canDownload,
      })),
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
