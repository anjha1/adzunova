import crypto from 'node:crypto';
import { getPaymentsMongoClient, getPaymentsMongoDb } from './client';
import { appendPaymentAuditEvent } from './audit';
import { MongoQueueAdapter } from './queue-port';
import { AppProblemError } from '@adzunova/problem-details';

export const BOOKING_STATUSES = [
  'REQUESTED',
  'COUNTERED',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
  'CANCELLED',
  'AGREEMENT_PENDING',
  'SIGNED',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  REQUESTED: ['ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED', 'CANCELLED'],
  COUNTERED: ['ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED', 'CANCELLED'],
  ACCEPTED: ['AGREEMENT_PENDING'],
  REJECTED: [],
  EXPIRED: [],
  CANCELLED: [],
  AGREEMENT_PENDING: ['SIGNED', 'EXPIRED'],
  SIGNED: [],
};

export const OPEN_BOOKING_STATUSES: readonly BookingStatus[] = ['REQUESTED', 'COUNTERED'];
export const MAX_COUNTER_ROUNDS = 3;
export const OFFER_EXPIRY_HOURS = 72;

export const REJECTION_REASONS = [
  'Budget too low',
  'Timeline unavailable',
  'Category mismatch',
  'Scope unclear',
  'Other',
] as const;

export function isValidBookingTransition(from: BookingStatus, to: BookingStatus): boolean {
  return BOOKING_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertValidBookingTransition(from: BookingStatus, to: BookingStatus): void {
  if (!isValidBookingTransition(from, to)) {
    throw new AppProblemError({
      status: 409,
      code: 'ILLEGAL_BOOKING_TRANSITION',
      title: 'Illegal Booking State Transition',
      detail: `Cannot transition booking from ${from} to ${to}`,
    });
  }
}

export function maskContactInfo(input: string): { sanitized: string; maskedCount: number } {
  let maskedCount = 0;
  let sanitized = input;

  // Email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, () => {
    maskedCount++;
    return '[EMAIL_MASKED]';
  });

  // WhatsApp / Telegram links (must run before phone regex so digits in wa.me/91... don't double-match)
  sanitized = sanitized.replace(/https?:\/\/(?:wa\.me|t\.me|api\.whatsapp\.com)\/[^\s]+/gi, () => {
    maskedCount++;
    return '[CONTACT_LINK_MASKED]';
  });

  // Phone numbers (Indian 10-digit +91 or international)
  sanitized = sanitized.replace(
    /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}\b/g,
    (match) => {
      const digits = match.replace(/\D/g, '');
      if (digits.length >= 10 && digits.length <= 15) {
        maskedCount++;
        return '[PHONE_MASKED]';
      }
      return match;
    }
  );

  // @handles (social handles in brief text)
  sanitized = sanitized.replace(/(^|\s)@[A-Za-z0-9_.]{3,30}\b/g, (_m, prefix) => {
    maskedCount++;
    return `${prefix}[HANDLE_MASKED]`;
  });

  return { sanitized, maskedCount };
}

export interface BookingRecord {
  bookingId: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorSlug: string | null;
  status: BookingStatus;
  isOpen: boolean;
  itemKind: 'RATE_CARD_ITEM' | 'PACKAGE';
  itemKey: string;
  rateCardItemId: string | null;
  packageId: string | null;
  itemTitle: string;
  pricingType: 'FIXED' | 'NEGOTIABLE';
  selectedAddons: string[];
  quantity: number;
  deliveryDate: string;
  brief: string;
  referenceLinks: string[];
  assetIds: string[];
  budgetNote: string | null;
  quoteSnapshot: Record<string, unknown>;
  feeConfigVersion: string;
  rateCardItemVersion: number;
  counterRound: number;
  contactMaskedCount: number;
  rejectionReason: string | null;
  expiresAt: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEventRecord {
  eventId: string;
  bookingId: string;
  eventType: string;
  actorId: string;
  actorRole: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  counterDelta: Record<string, unknown> | null;
  createdAt: string;
}

function docToBooking(doc: Record<string, unknown>): BookingRecord {
  return {
    bookingId: String(doc.bookingId),
    brandId: String(doc.brandId),
    brandName: String(doc.brandName),
    creatorId: String(doc.creatorId),
    creatorName: String(doc.creatorName),
    creatorSlug: doc.creatorSlug ? String(doc.creatorSlug) : null,
    status: String(doc.status) as BookingStatus,
    isOpen: Boolean(doc.isOpen),
    itemKind: String(doc.itemKind) as 'RATE_CARD_ITEM' | 'PACKAGE',
    itemKey: String(doc.itemKey),
    rateCardItemId: doc.rateCardItemId ? String(doc.rateCardItemId) : null,
    packageId: doc.packageId ? String(doc.packageId) : null,
    itemTitle: String(doc.itemTitle),
    pricingType: String(doc.pricingType) as 'FIXED' | 'NEGOTIABLE',
    selectedAddons: JSON.parse(String(doc.selectedAddonsJson || '[]')),
    quantity: Number(doc.quantity ?? 1),
    deliveryDate: String(doc.deliveryDate),
    brief: String(doc.brief),
    referenceLinks: JSON.parse(String(doc.referenceLinksJson || '[]')),
    assetIds: JSON.parse(String(doc.assetIdsJson || '[]')),
    budgetNote: doc.budgetNote ? String(doc.budgetNote) : null,
    quoteSnapshot: JSON.parse(String(doc.quoteSnapshotJson || '{}')),
    feeConfigVersion: String(doc.feeConfigVersion),
    rateCardItemVersion: Number(doc.rateCardItemVersion ?? 1),
    counterRound: Number(doc.counterRound ?? 0),
    contactMaskedCount: Number(doc.contactMaskedCount ?? 0),
    rejectionReason: doc.rejectionReason ? String(doc.rejectionReason) : null,
    expiresAt:
      doc.expiresAt instanceof Date
        ? doc.expiresAt.toISOString()
        : String(doc.expiresAt),
    version: Number(doc.version ?? 1),
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

function docToEvent(doc: Record<string, unknown>): BookingEventRecord {
  return {
    eventId: String(doc.eventId),
    bookingId: String(doc.bookingId),
    eventType: String(doc.eventType),
    actorId: String(doc.actorId),
    actorRole: String(doc.actorRole),
    fromStatus: doc.fromStatus ? String(doc.fromStatus) : null,
    toStatus: String(doc.toStatus),
    reason: doc.reason ? String(doc.reason) : null,
    counterDelta: doc.counterDeltaJson ? JSON.parse(String(doc.counterDeltaJson)) : null,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

export async function createBookingRequest(input: {
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorSlug?: string | null;
  itemKind: 'RATE_CARD_ITEM' | 'PACKAGE';
  itemKey: string;
  rateCardItemId?: string | null;
  packageId?: string | null;
  itemTitle: string;
  pricingType: 'FIXED' | 'NEGOTIABLE';
  selectedAddons: string[];
  quantity: number;
  deliveryDate: string;
  brief: string;
  referenceLinks: string[];
  assetIds: string[];
  budgetNote?: string | null;
  quoteSnapshot: Record<string, unknown>;
  feeConfigVersion: string;
  rateCardItemVersion: number;
}): Promise<BookingRecord> {
  const maskedBrief = maskContactInfo(input.brief.trim());
  const maskedNote = input.budgetNote ? maskContactInfo(input.budgetNote.trim()) : null;
  const contactMaskedCount = maskedBrief.maskedCount + (maskedNote?.maskedCount ?? 0);

  const bookingId = `bkg_${crypto.randomUUID()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OFFER_EXPIRY_HOURS * 60 * 60 * 1000);

  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();

  const doc = {
    bookingId,
    brandId: input.brandId,
    brandName: input.brandName,
    creatorId: input.creatorId,
    creatorName: input.creatorName,
    creatorSlug: input.creatorSlug ?? null,
    status: 'REQUESTED' as BookingStatus,
    isOpen: true,
    itemKind: input.itemKind,
    itemKey: input.itemKey,
    rateCardItemId: input.rateCardItemId ?? null,
    packageId: input.packageId ?? null,
    itemTitle: input.itemTitle,
    pricingType: input.pricingType,
    selectedAddonsJson: JSON.stringify(input.selectedAddons),
    quantity: input.quantity,
    deliveryDate: input.deliveryDate,
    brief: maskedBrief.sanitized,
    referenceLinksJson: JSON.stringify(input.referenceLinks),
    assetIdsJson: JSON.stringify(input.assetIds),
    budgetNote: maskedNote ? maskedNote.sanitized : null,
    quoteSnapshotJson: JSON.stringify(input.quoteSnapshot),
    feeConfigVersion: input.feeConfigVersion,
    rateCardItemVersion: input.rateCardItemVersion,
    counterRound: 0,
    contactMaskedCount,
    rejectionReason: null,
    expiresAt,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await session.withTransaction(async () => {
      try {
        await db.collection('pay_bookings').insertOne(doc, { session });
      } catch (err: unknown) {
        const code = (err as { code?: number })?.code;
        if (code === 11000) {
          throw new AppProblemError({
            status: 409,
            code: 'DUPLICATE_BOOKING_REQUEST',
            title: 'Active Request Already Exists',
            detail: 'You already have an open collaboration request for this creator deliverable.',
          });
        }
        throw err;
      }

      await db.collection('pay_booking_events').insertOne(
        {
          eventId: `bev_${crypto.randomUUID()}`,
          bookingId,
          eventType: 'REQUESTED',
          actorId: input.brandId,
          actorRole: 'BRAND',
          fromStatus: null,
          toStatus: 'REQUESTED',
          reason: null,
          counterDeltaJson: null,
          createdAt: now,
        },
        { session }
      );

      await db.collection('pay_notifications').insertOne(
        {
          notifId: `ntf_${crypto.randomUUID()}`,
          userId: input.creatorId,
          role: 'CREATOR',
          type: 'BOOKING_REQUESTED',
          title: 'New Collaboration Request',
          message: `${input.brandName} requested "${input.itemTitle}" (expires in ${OFFER_EXPIRY_HOURS}h).`,
          bookingId,
          readAt: null,
          createdAt: now,
        },
        { session }
      );

      await appendPaymentAuditEvent(
        {
          actorId: input.brandId,
          actorRole: 'BRAND',
          action: 'BOOKING_REQUESTED',
          resourceType: 'BOOKING',
          resourceId: bookingId,
          payload: {
            creatorId: input.creatorId,
            itemKey: input.itemKey,
            feeConfigVersion: input.feeConfigVersion,
            contactMaskedCount,
          },
        },
        session
      );
    });
  } finally {
    await session.endSession();
  }

  // Schedule 72h expiry timer outside tx (idempotent via dedupKey)
  const queue = new MongoQueueAdapter();
  await queue.enqueue({
    queueName: 'booking-timers',
    jobType: 'EXPIRE_BOOKING_OFFER',
    dedupKey: `booking:${bookingId}:expire:r0`,
    payload: { bookingId, expectedRound: 0 },
    runAt: expiresAt,
  });

  return docToBooking(doc);
}

async function transitionBooking(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
  toStatus: BookingStatus;
  reason?: string | null;
  updates?: Record<string, unknown>;
  counterDelta?: Record<string, unknown> | null;
  notifyUserId: string;
  notifyRole: 'BRAND' | 'CREATOR';
  notifyTitle: string;
  notifyMessage: string;
}): Promise<BookingRecord> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();
  let updatedDoc: Record<string, unknown> | null = null;

  try {
    await session.withTransaction(async () => {
      const current = await db
        .collection('pay_bookings')
        .findOne({ bookingId: params.bookingId }, { session });

      if (!current) {
        throw new AppProblemError({
          status: 404,
          code: 'BOOKING_NOT_FOUND',
          title: 'Booking Not Found',
          detail: `Booking ${params.bookingId} does not exist`,
        });
      }

      if (params.actorRole === 'CREATOR' && String(current.creatorId) !== params.actorId) {
        throw new AppProblemError({
          status: 403,
          code: 'BOOKING_FORBIDDEN',
          title: 'Forbidden',
          detail: 'You are not the creator on this booking request.',
        });
      }
      if (params.actorRole === 'BRAND' && String(current.brandId) !== params.actorId) {
        throw new AppProblemError({
          status: 403,
          code: 'BOOKING_FORBIDDEN',
          title: 'Forbidden',
          detail: 'You are not the brand on this booking request.',
        });
      }

      const fromStatus = String(current.status) as BookingStatus;
      assertValidBookingTransition(fromStatus, params.toStatus);

      const expectedVersion = Number(current.version);
      const now = new Date();
      const isOpen = OPEN_BOOKING_STATUSES.includes(params.toStatus);

      const res = await db.collection('pay_bookings').findOneAndUpdate(
        { bookingId: params.bookingId, version: expectedVersion },
        {
          $set: {
            status: params.toStatus,
            isOpen,
            updatedAt: now,
            ...(params.updates ?? {}),
          },
          $inc: { version: 1 },
        },
        { returnDocument: 'after', session }
      );

      if (!res) {
        throw new AppProblemError({
          status: 409,
          code: 'BOOKING_CONCURRENCY_CONFLICT',
          title: 'Concurrent Modification',
          detail: 'Booking was modified concurrently. Please refresh and retry.',
        });
      }

      updatedDoc = res as Record<string, unknown>;

      await db.collection('pay_booking_events').insertOne(
        {
          eventId: `bev_${crypto.randomUUID()}`,
          bookingId: params.bookingId,
          eventType: params.toStatus,
          actorId: params.actorId,
          actorRole: params.actorRole,
          fromStatus,
          toStatus: params.toStatus,
          reason: params.reason ?? null,
          counterDeltaJson: params.counterDelta ? JSON.stringify(params.counterDelta) : null,
          createdAt: now,
        },
        { session }
      );

      await db.collection('pay_notifications').insertOne(
        {
          notifId: `ntf_${crypto.randomUUID()}`,
          userId: params.notifyUserId,
          role: params.notifyRole,
          type: `BOOKING_${params.toStatus}`,
          title: params.notifyTitle,
          message: params.notifyMessage,
          bookingId: params.bookingId,
          readAt: null,
          createdAt: now,
        },
        { session }
      );

      await appendPaymentAuditEvent(
        {
          actorId: params.actorId,
          actorRole: params.actorRole,
          action: `BOOKING_${params.toStatus}`,
          resourceType: 'BOOKING',
          resourceId: params.bookingId,
          reason: params.reason ?? undefined,
          payload: {
            fromStatus,
            toStatus: params.toStatus,
            version: expectedVersion + 1,
          },
        },
        session
      );
    });
  } finally {
    await session.endSession();
  }

  return docToBooking(updatedDoc!);
}

export async function acceptBooking(params: {
  bookingId: string;
  creatorId: string;
}): Promise<BookingRecord> {
  const existing = await getBookingById(params.bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }
  return transitionBooking({
    bookingId: params.bookingId,
    actorId: params.creatorId,
    actorRole: 'CREATOR',
    toStatus: 'ACCEPTED',
    notifyUserId: existing.brandId,
    notifyRole: 'BRAND',
    notifyTitle: 'Collaboration Accepted',
    notifyMessage: `${existing.creatorName} accepted your request for "${existing.itemTitle}".`,
  });
}

export async function acceptCounterOffer(params: {
  bookingId: string;
  brandId: string;
}): Promise<BookingRecord> {
  const existing = await getBookingById(params.bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }
  if (existing.status !== 'COUNTERED') {
    throw new AppProblemError({
      status: 409,
      code: 'ILLEGAL_BOOKING_TRANSITION',
      title: 'Illegal Booking State Transition',
      detail: `Brand can only accept a COUNTERED offer (current status: ${existing.status})`,
    });
  }
  return transitionBooking({
    bookingId: params.bookingId,
    actorId: params.brandId,
    actorRole: 'BRAND',
    toStatus: 'ACCEPTED',
    notifyUserId: existing.creatorId,
    notifyRole: 'CREATOR',
    notifyTitle: 'Counter Offer Accepted',
    notifyMessage: `${existing.brandName} accepted your counter offer for "${existing.itemTitle}".`,
  });
}

export async function rejectBooking(params: {
  bookingId: string;
  creatorId: string;
  reason: string;
}): Promise<BookingRecord> {
  const reason = params.reason.trim();
  if (!reason) {
    throw new AppProblemError({
      status: 400,
      code: 'REJECTION_REASON_REQUIRED',
      title: 'Reason Required',
      detail: 'A rejection reason is required.',
    });
  }
  const existing = await getBookingById(params.bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }
  return transitionBooking({
    bookingId: params.bookingId,
    actorId: params.creatorId,
    actorRole: 'CREATOR',
    toStatus: 'REJECTED',
    reason,
    updates: { rejectionReason: reason },
    notifyUserId: existing.brandId,
    notifyRole: 'BRAND',
    notifyTitle: 'Collaboration Declined',
    notifyMessage: `${existing.creatorName} declined "${existing.itemTitle}" (${reason}).`,
  });
}

export async function counterBooking(params: {
  bookingId: string;
  creatorId: string;
  newDeliveryDate?: string;
  newSelectedAddons?: string[];
  newQuoteSnapshot: Record<string, unknown>;
  proposedPriceInr?: number;
  note?: string;
}): Promise<BookingRecord> {
  const existing = await getBookingById(params.bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }

  if (existing.counterRound >= MAX_COUNTER_ROUNDS) {
    throw new AppProblemError({
      status: 409,
      code: 'MAX_COUNTER_ROUNDS_EXCEEDED',
      title: 'Counter Limit Reached',
      detail: `Maximum ${MAX_COUNTER_ROUNDS} counter-offer rounds reached.`,
    });
  }

  if (params.proposedPriceInr !== undefined && existing.pricingType !== 'NEGOTIABLE') {
    throw new AppProblemError({
      status: 409,
      code: 'FIXED_PRICE_CANNOT_BE_COUNTERED',
      title: 'Fixed Price Deliverable',
      detail: 'Fixed-price deliverables allow countering dates or add-ons only, not base price.',
    });
  }

  const nextRound = existing.counterRound + 1;
  const expiresAt = new Date(Date.now() + OFFER_EXPIRY_HOURS * 60 * 60 * 1000);
  const maskedNote = params.note ? maskContactInfo(params.note.trim()).sanitized : undefined;

  const updated = await transitionBooking({
    bookingId: params.bookingId,
    actorId: params.creatorId,
    actorRole: 'CREATOR',
    toStatus: 'COUNTERED',
    reason: maskedNote ?? 'Counter-offer submitted',
    updates: {
      counterRound: nextRound,
      expiresAt,
      ...(params.newDeliveryDate ? { deliveryDate: params.newDeliveryDate } : {}),
      ...(params.newSelectedAddons
        ? { selectedAddonsJson: JSON.stringify(params.newSelectedAddons) }
        : {}),
      quoteSnapshotJson: JSON.stringify(params.newQuoteSnapshot),
    },
    counterDelta: {
      round: nextRound,
      deliveryDate: params.newDeliveryDate ?? existing.deliveryDate,
      selectedAddons: params.newSelectedAddons ?? existing.selectedAddons,
      proposedPriceInr: params.proposedPriceInr ?? null,
      note: maskedNote ?? null,
    },
    notifyUserId: existing.brandId,
    notifyRole: 'BRAND',
    notifyTitle: `Counter Offer (Round ${nextRound}/${MAX_COUNTER_ROUNDS})`,
    notifyMessage: `${existing.creatorName} sent a counter proposal for "${existing.itemTitle}".`,
  });

  const queue = new MongoQueueAdapter();
  await queue.enqueue({
    queueName: 'booking-timers',
    jobType: 'EXPIRE_BOOKING_OFFER',
    dedupKey: `booking:${params.bookingId}:expire:r${nextRound}`,
    payload: { bookingId: params.bookingId, expectedRound: nextRound },
    runAt: expiresAt,
  });

  return updated;
}

export async function cancelBooking(params: {
  bookingId: string;
  brandId: string;
  reason?: string;
}): Promise<BookingRecord> {
  const existing = await getBookingById(params.bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }
  return transitionBooking({
    bookingId: params.bookingId,
    actorId: params.brandId,
    actorRole: 'BRAND',
    toStatus: 'CANCELLED',
    reason: params.reason || 'Cancelled by brand',
    notifyUserId: existing.creatorId,
    notifyRole: 'CREATOR',
    notifyTitle: 'Collaboration Cancelled',
    notifyMessage: `${existing.brandName} withdrew the request for "${existing.itemTitle}".`,
  });
}

export async function expireBooking(bookingId: string): Promise<BookingRecord> {
  const existing = await getBookingById(bookingId);
  if (!existing) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${bookingId} does not exist`,
    });
  }
  return transitionBooking({
    bookingId,
    actorId: 'system_timer',
    actorRole: 'SYSTEM',
    toStatus: 'EXPIRED',
    reason: `${OFFER_EXPIRY_HOURS}h offer window elapsed`,
    notifyUserId: existing.brandId,
    notifyRole: 'BRAND',
    notifyTitle: 'Request Expired',
    notifyMessage: `Your request for "${existing.itemTitle}" expired after ${OFFER_EXPIRY_HOURS} hours.`,
  });
}

export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const db = await getPaymentsMongoDb();
  const doc = await db.collection('pay_bookings').findOne({ bookingId });
  return doc ? docToBooking(doc as Record<string, unknown>) : null;
}

export async function getBookingWithEvents(bookingId: string): Promise<{
  booking: BookingRecord;
  events: BookingEventRecord[];
} | null> {
  const db = await getPaymentsMongoDb();
  const doc = await db.collection('pay_bookings').findOne({ bookingId });
  if (!doc) return null;
  const eventDocs = await db
    .collection('pay_booking_events')
    .find({ bookingId })
    .sort({ createdAt: 1 })
    .toArray();
  return {
    booking: docToBooking(doc as Record<string, unknown>),
    events: eventDocs.map((e) => docToEvent(e as Record<string, unknown>)),
  };
}

export async function listBookingsForUser(params: {
  userId: string;
  role: 'BRAND' | 'CREATOR';
  cursor?: string | null;
  limit?: number;
}): Promise<{ items: BookingRecord[]; nextCursor: string | null }> {
  const db = await getPaymentsMongoDb();
  const limit = Math.max(1, Math.min(50, params.limit ?? 20));
  const filter: Record<string, unknown> =
    params.role === 'BRAND' ? { brandId: params.userId } : { creatorId: params.userId };

  if (params.cursor) {
    filter.createdAt = { $lt: new Date(params.cursor) };
  }

  const docs = await db
    .collection('pay_bookings')
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .toArray();

  const hasMore = docs.length > limit;
  const slice = hasMore ? docs.slice(0, limit) : docs;
  const items = slice.map((d) => docToBooking(d as Record<string, unknown>));
  const nextCursor = hasMore ? items[items.length - 1].createdAt : null;

  return { items, nextCursor };
}

export async function listUserNotifications(userId: string, limit = 20) {
  const db = await getPaymentsMongoDb();
  const docs = await db
    .collection('pay_notifications')
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({
    notifId: String(d.notifId),
    type: String(d.type),
    title: String(d.title),
    message: String(d.message),
    bookingId: d.bookingId ? String(d.bookingId) : null,
    readAt: d.readAt ? new Date(d.readAt as Date).toISOString() : null,
    createdAt: new Date(d.createdAt as Date).toISOString(),
  }));
}
