import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import type { BrandProfileData } from '@/lib/auth-types';
import { AppProblemError, toProblemDetails } from '@adzunova/problem-details';
import {
  createBookingRequest,
  isBookingFeatureEnabled,
  listBookingsForUser,
} from '@adzunova/payments-db';
import { resolveServerBookingQuote } from '@/lib/bookings/quote-service';
import { isCreatorDateBlackout } from '@/lib/creator/availability-repository';
import { validateAndLinkBookingAttachments } from '@/lib/storage/upload-service';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const result = await listBookingsForUser({
      userId: session.user.id,
      role: session.user.role,
      cursor,
      limit,
    });
    return NextResponse.json(result);
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'BRAND') {
    return NextResponse.json(
      { error: 'Unauthorized: Brand session required' },
      { status: 401 }
    );
  }

  try {
    const enabled = await isBookingFeatureEnabled();
    if (!enabled) {
      throw new AppProblemError({
        status: 503,
        code: 'FEATURE_BOOKINGS_DISABLED',
        title: 'Bookings Disabled',
        detail: 'Collaboration booking requests are not enabled yet.',
      });
    }

    const brandProfile = session.profile as BrandProfileData | undefined;
    if (brandProfile?.verificationStatus !== 'VERIFIED') {
      throw new AppProblemError({
        status: 403,
        code: 'BRAND_NOT_VERIFIED',
        title: 'Business Verification Required',
        detail: 'Only verified brands may send collaboration requests. Complete business verification first.',
      });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const creatorId = String(body.creatorId ?? '').trim();
    const creatorName = String(body.creatorName ?? 'Creator').trim();
    const creatorSlug = body.creatorSlug ? String(body.creatorSlug).trim() : null;
    const deliveryDate = String(body.deliveryDate ?? '').trim();
    const brief = String(body.brief ?? '').trim();

    if (!creatorId || !deliveryDate || brief.length < 10) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_BOOKING_REQUEST',
        title: 'Invalid Booking Request',
        detail: 'creatorId, deliveryDate, and a brief of at least 10 characters are required.',
      });
    }

    const isBlackout = await isCreatorDateBlackout(creatorId, deliveryDate);
    if (isBlackout) {
      throw new AppProblemError({
        status: 409,
        code: 'CREATOR_DATE_UNAVAILABLE',
        title: 'Date Unavailable',
        detail: 'The creator has marked this delivery date as blackout or busy.',
      });
    }

    const resolved = await resolveServerBookingQuote({
      creatorId,
      rateCardItemId: body.rateCardItemId ? String(body.rateCardItemId) : undefined,
      packageId: body.packageId ? String(body.packageId) : undefined,
      selectedAddons: Array.isArray(body.selectedAddons)
        ? body.selectedAddons.map(String)
        : [],
      quantity: body.quantity !== undefined ? Number(body.quantity) : 1,
    });

    const referenceLinks = Array.isArray(body.referenceLinks)
      ? body.referenceLinks.map(String).map((s) => s.trim()).filter(Boolean).slice(0, 10)
      : [];
    const assetIds = Array.isArray(body.assetIds)
      ? body.assetIds.map(String).map((s) => s.trim()).filter(Boolean).slice(0, 10)
      : [];

    if (assetIds.length > 0) {
      await validateAndLinkBookingAttachments({
        actor: {
          userId: session.user.id,
          tenantId: `brand:${session.user.id}`,
          ownerType: 'BRAND',
          ownerId: session.user.id,
        },
        bookingId: `pending:${session.user.id}`,
        assetIds,
      });
    }

    const brandName =
      brandProfile?.brandName ||
      brandProfile?.companyName ||
      session.user.displayName ||
      session.user.email;

    const booking = await createBookingRequest({
      brandId: session.user.id,
      brandName,
      creatorId,
      creatorName,
      creatorSlug,
      itemKind: resolved.itemKind,
      itemKey: resolved.itemKey,
      rateCardItemId: resolved.rateCardItemId,
      packageId: resolved.packageId,
      itemTitle: resolved.itemTitle,
      pricingType: resolved.pricingType,
      selectedAddons: resolved.selectedAddons,
      quantity: resolved.quantity,
      deliveryDate,
      brief,
      referenceLinks,
      assetIds,
      budgetNote: body.budgetNote ? String(body.budgetNote) : null,
      quoteSnapshot: resolved.breakdown,
      feeConfigVersion: resolved.feeConfigVersion,
      rateCardItemVersion: resolved.itemVersion,
    });

    if (assetIds.length > 0) {
      await validateAndLinkBookingAttachments({
        actor: {
          userId: session.user.id,
          tenantId: `brand:${session.user.id}`,
          ownerType: 'BRAND',
          ownerId: session.user.id,
        },
        bookingId: booking.bookingId,
        assetIds,
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
