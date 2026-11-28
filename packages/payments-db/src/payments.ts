import crypto from 'node:crypto';
import { Long } from 'mongodb';
import { getPaymentsMongoClient, getPaymentsMongoDb } from './client';
import { appendPaymentAuditEvent } from './audit';
import { enqueueOutboxEvent } from './outbox';
import { postLedgerEntry } from './ledger';
import { assertValidBookingTransition, type BookingStatus } from './bookings';
import { AppProblemError } from '@adzunova/problem-details';

export const PAYMENT_ATTEMPT_STATUSES = [
  'CREATING_ORDER',
  'ORDER_CREATED',
  'VERIFICATION_PENDING',
  'CAPTURED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
  'RECONCILE_REQUIRED',
] as const;

export type PaymentAttemptStatus = (typeof PAYMENT_ATTEMPT_STATUSES)[number];

export interface PaymentAttemptRecord {
  attemptId: string;
  bookingId: string;
  agreementId: string;
  agreementVersion: number;
  brandId: string;
  creatorId: string;
  idempotencyKey: string;
  provider: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  amountPaise: string;
  currency: string;
  status: PaymentAttemptStatus;
  isActive: boolean;
  holdOrSettlementStatus: string;
  receiptNumber: string | null;
  lastError: string | null;
  capturedAt: string | null;
  expiresAt: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

function fromBsonInt64(val: unknown): bigint {
  if (typeof val === 'bigint') return val;
  if (typeof val === 'number') return BigInt(Math.trunc(val));
  if (val && typeof val === 'object' && 'toBigInt' in val && typeof (val as Long).toBigInt === 'function') {
    return (val as Long).toBigInt();
  }
  return BigInt(String(val ?? 0));
}

function docToAttempt(doc: Record<string, unknown>): PaymentAttemptRecord {
  return {
    attemptId: String(doc.attemptId),
    bookingId: String(doc.bookingId),
    agreementId: String(doc.agreementId),
    agreementVersion: Number(doc.agreementVersion ?? 1),
    brandId: String(doc.brandId),
    creatorId: String(doc.creatorId),
    idempotencyKey: String(doc.idempotencyKey),
    provider: String(doc.provider || 'RAZORPAY'),
    providerOrderId: doc.providerOrderId ? String(doc.providerOrderId) : null,
    providerPaymentId: doc.providerPaymentId ? String(doc.providerPaymentId) : null,
    amountPaise: fromBsonInt64(doc.amountPaise).toString(),
    currency: String(doc.currency || 'INR'),
    status: String(doc.status) as PaymentAttemptStatus,
    isActive: Boolean(doc.isActive),
    holdOrSettlementStatus: String(doc.holdOrSettlementStatus || 'NONE'),
    receiptNumber: doc.receiptNumber ? String(doc.receiptNumber) : null,
    lastError: doc.lastError ? String(doc.lastError) : null,
    capturedAt: doc.capturedAt ? new Date(doc.capturedAt as Date | string).toISOString() : null,
    expiresAt: new Date(doc.expiresAt as Date | string).toISOString(),
    version: Number(doc.version ?? 1),
    createdAt: new Date(doc.createdAt as Date | string).toISOString(),
    updatedAt: new Date(doc.updatedAt as Date | string).toISOString(),
  };
}

export function extractQuotePaise(quoteSnapshot: Record<string, unknown>): {
  totalBrandPayablePaise: bigint;
  brandFeePaise: bigint;
  gstPaise: bigint;
  escrowHeldPaise: bigint;
} {
  const paiseObj = quoteSnapshot.paise as Record<string, unknown> | undefined;
  const breakdown = (quoteSnapshot.breakdown as Record<string, unknown> | undefined) ?? quoteSnapshot;

  const toPaise = (paiseVal: unknown, inrVal: unknown): bigint => {
    if (paiseVal !== undefined && paiseVal !== null) {
      return BigInt(String(paiseVal));
    }
    const n = Number(inrVal ?? 0);
    return BigInt(Math.round(n * 100));
  };

  const totalBrandPayablePaise = toPaise(paiseObj?.totalBrandPayablePaise, breakdown.totalBrandPayable);
  const brandFeePaise = toPaise(paiseObj?.brandFeePaise, breakdown.brandFeeAmount);
  const gstPaise = toPaise(paiseObj?.gstPaise, breakdown.gstAmount);
  const escrowHeldPaise = totalBrandPayablePaise - brandFeePaise - gstPaise;

  if (totalBrandPayablePaise <= BigInt(0) || escrowHeldPaise < BigInt(0)) {
    throw new AppProblemError({
      status: 422,
      code: 'INVALID_QUOTE_SNAPSHOT',
      title: 'Invalid Quote Snapshot',
      detail: 'Booking quote snapshot has invalid or non-positive payable amount.',
    });
  }

  return {
    totalBrandPayablePaise,
    brandFeePaise,
    gstPaise,
    escrowHeldPaise,
  };
}

export async function beginOrReusePaymentAttempt(input: {
  bookingId: string;
  brandId: string;
  idempotencyKey?: string;
}): Promise<{ attempt: PaymentAttemptRecord; reused: boolean }> {
  const db = await getPaymentsMongoDb();
  const booking = await db.collection('pay_bookings').findOne({ bookingId: input.bookingId });
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${input.bookingId} does not exist`,
    });
  }

  if (String(booking.brandId) !== input.brandId) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'Only the authorized brand on this booking can initiate checkout.',
    });
  }

  const bookingStatus = String(booking.status) as BookingStatus;
  if (bookingStatus !== 'SIGNED' && bookingStatus !== 'PAYMENT_PENDING') {
    throw new AppProblemError({
      status: 409,
      code: 'BOOKING_NOT_PAYABLE',
      title: 'Booking Not Ready For Payment',
      detail: `Booking must be SIGNED before checkout (current status: ${bookingStatus}).`,
    });
  }

  const agreement = await db
    .collection('pay_agreements')
    .findOne({ bookingId: input.bookingId, isActive: true });

  if (
    !agreement ||
    agreement.status !== 'SIGNED' ||
    !agreement.brandSignedAt ||
    !agreement.creatorSignedAt
  ) {
    throw new AppProblemError({
      status: 409,
      code: 'AGREEMENT_NOT_SIGNED',
      title: 'Agreement Signatures Required',
      detail: 'Both brand and creator must have verified signatures on the active agreement before payment.',
    });
  }

  const existingActive = await db
    .collection('pay_payment_attempts')
    .findOne({ bookingId: input.bookingId, isActive: true });

  if (existingActive) {
    return { attempt: docToAttempt(existingActive as Record<string, unknown>), reused: true };
  }

  const quoteSnapshot = booking.quoteSnapshotJson
    ? (JSON.parse(String(booking.quoteSnapshotJson)) as Record<string, unknown>)
    : {};
  const { totalBrandPayablePaise } = extractQuotePaise(quoteSnapshot);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const attemptId = `att_${crypto.randomUUID()}`;
  const idempotencyKey =
    input.idempotencyKey?.trim() || `chk:${input.bookingId}:agr_v${agreement.version}:${crypto.randomUUID()}`;

  const doc = {
    attemptId,
    bookingId: input.bookingId,
    agreementId: String(agreement.agreementId),
    agreementVersion: Number(agreement.version ?? 1),
    brandId: String(booking.brandId),
    creatorId: String(booking.creatorId),
    idempotencyKey,
    provider: 'RAZORPAY',
    providerOrderId: null,
    providerPaymentId: null,
    amountPaise: Long.fromBigInt(totalBrandPayablePaise),
    currency: 'INR',
    status: 'CREATING_ORDER',
    isActive: true,
    holdOrSettlementStatus: 'NONE',
    receiptNumber: null,
    lastError: null,
    capturedAt: null,
    expiresAt,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.collection('pay_payment_attempts').insertOne(doc);
    return { attempt: docToAttempt(doc), reused: false };
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      const winner = await db
        .collection('pay_payment_attempts')
        .findOne({ bookingId: input.bookingId, isActive: true });
      if (winner) {
        return { attempt: docToAttempt(winner as Record<string, unknown>), reused: true };
      }
    }
    throw err;
  }
}

export async function attachProviderOrderToAttempt(input: {
  attemptId: string;
  bookingId: string;
  providerOrderId: string;
  actorId: string;
}): Promise<PaymentAttemptRecord> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();
  let updatedDoc: Record<string, unknown> | null = null;

  try {
    await session.withTransaction(async () => {
      const now = new Date();
      const res = await db.collection('pay_payment_attempts').findOneAndUpdate(
        { attemptId: input.attemptId, status: 'CREATING_ORDER' },
        {
          $set: {
            providerOrderId: input.providerOrderId,
            status: 'ORDER_CREATED',
            updatedAt: now,
          },
          $inc: { version: 1 },
        },
        { returnDocument: 'after', session }
      );

      if (!res) {
        const existing = await db
          .collection('pay_payment_attempts')
          .findOne({ attemptId: input.attemptId }, { session });
        updatedDoc = existing as Record<string, unknown>;
        return;
      }

      updatedDoc = res as Record<string, unknown>;

      const booking = await db
        .collection('pay_bookings')
        .findOne({ bookingId: input.bookingId }, { session });
      if (booking && booking.status === 'SIGNED') {
        assertValidBookingTransition('SIGNED', 'PAYMENT_PENDING');
        await db.collection('pay_bookings').updateOne(
          { bookingId: input.bookingId, version: Number(booking.version ?? 1) },
          { $set: { status: 'PAYMENT_PENDING', updatedAt: now }, $inc: { version: 1 } },
          { session }
        );
        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId: input.bookingId,
            eventType: 'PAYMENT_PENDING',
            actorId: input.actorId,
            actorRole: 'BRAND',
            fromStatus: 'SIGNED',
            toStatus: 'PAYMENT_PENDING',
            reason: `Razorpay order ${input.providerOrderId} created`,
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );
      }

      await appendPaymentAuditEvent(
        {
          actorId: input.actorId,
          actorRole: 'BRAND',
          action: 'PAYMENT_ORDER_CREATED',
          resourceType: 'PAYMENT_ATTEMPT',
          resourceId: input.attemptId,
          payload: {
            bookingId: input.bookingId,
            providerOrderId: input.providerOrderId,
          },
        },
        session
      );
    });
  } finally {
    await session.endSession();
  }

  return docToAttempt(updatedDoc!);
}

export async function markAttemptVerificationPending(input: {
  bookingId: string;
  brandId: string;
  providerOrderId: string;
  providerPaymentId: string;
}): Promise<PaymentAttemptRecord> {
  const db = await getPaymentsMongoDb();
  const attempt = await db.collection('pay_payment_attempts').findOne({
    bookingId: input.bookingId,
    brandId: input.brandId,
    providerOrderId: input.providerOrderId,
  });

  if (!attempt) {
    throw new AppProblemError({
      status: 404,
      code: 'PAYMENT_ATTEMPT_NOT_FOUND',
      title: 'Payment Attempt Not Found',
      detail: 'No matching payment order found for this booking.',
    });
  }

  if (attempt.status === 'CAPTURED') {
    return docToAttempt(attempt as Record<string, unknown>);
  }

  const res = await db.collection('pay_payment_attempts').findOneAndUpdate(
    {
      attemptId: attempt.attemptId,
      status: { $in: ['ORDER_CREATED', 'VERIFICATION_PENDING'] },
    },
    {
      $set: {
        status: 'VERIFICATION_PENDING',
        providerPaymentId: input.providerPaymentId,
        updatedAt: new Date(),
      },
      $inc: { version: 1 },
    },
    { returnDocument: 'after' }
  );

  return docToAttempt((res ?? attempt) as Record<string, unknown>);
}

export async function cancelOrFailPaymentAttempt(input: {
  bookingId: string;
  brandId: string;
  attemptId?: string;
  status: 'CANCELLED' | 'FAILED';
  reason: string;
}): Promise<PaymentAttemptRecord | null> {
  const db = await getPaymentsMongoDb();
  const filter: Record<string, unknown> = {
    bookingId: input.bookingId,
    brandId: input.brandId,
    isActive: true,
    status: { $in: ['CREATING_ORDER', 'ORDER_CREATED', 'VERIFICATION_PENDING'] },
  };
  if (input.attemptId) filter.attemptId = input.attemptId;

  const res = await db.collection('pay_payment_attempts').findOneAndUpdate(
    filter,
    {
      $set: {
        status: input.status,
        isActive: false,
        lastError: input.reason,
        updatedAt: new Date(),
      },
      $inc: { version: 1 },
    },
    { returnDocument: 'after' }
  );

  return res ? docToAttempt(res as Record<string, unknown>) : null;
}

export async function processVerifiedPaymentWebhook(input: {
  eventId: string;
  eventType: string;
  orderId: string;
  paymentId: string;
  amountPaise: bigint;
  currency: string;
  providerStatus: string;
  payloadHash: string;
  routeHoldVerified?: boolean;
  actorId?: string;
}): Promise<{
  outcome: 'FUNDS_SECURED' | 'CAPTURED_HOLD_PENDING' | 'DUPLICATE' | 'RECONCILIATION_REQUIRED' | 'IGNORED';
  bookingId?: string;
  receiptNumber?: string;
  detail: string;
}> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const businessOpId = `payment_capture:${input.orderId}:${input.paymentId}`;

  // 1. Deduplicate webhook event by eventId
  const existingEvent = await db.collection('pay_webhook_events').findOne({ eventId: input.eventId });
  if (existingEvent && existingEvent.status === 'PROCESSED') {
    return {
      outcome: 'DUPLICATE',
      detail: `Webhook event ${input.eventId} already processed.`,
    };
  }

  if (!existingEvent) {
    try {
      await db.collection('pay_webhook_events').insertOne({
        eventId: input.eventId,
        provider: 'RAZORPAY',
        eventType: input.eventType,
        orderId: input.orderId,
        paymentId: input.paymentId,
        amountPaise: Long.fromBigInt(input.amountPaise),
        currency: input.currency,
        payloadHash: input.payloadHash,
        status: 'RECEIVED',
        businessOpId,
        errorDetail: null,
        processedAt: null,
        createdAt: now,
      });
    } catch (err: unknown) {
      if ((err as { code?: number })?.code === 11000) {
        return { outcome: 'DUPLICATE', detail: `Webhook event ${input.eventId} already recorded.` };
      }
      throw err;
    }
  }

  const attempt = await db
    .collection('pay_payment_attempts')
    .findOne({ providerOrderId: input.orderId });

  if (!attempt) {
    await db.collection('pay_reconciliation_items').insertOne({
      reconId: `rec_${crypto.randomUUID()}`,
      bookingId: null,
      attemptId: null,
      orderId: input.orderId,
      paymentId: input.paymentId,
      kind: 'MISSING_ATTEMPT',
      severity: 'CRITICAL',
      status: 'OPEN',
      expectedAmountPaise: null,
      actualAmountPaise: Long.fromBigInt(input.amountPaise),
      detail: `Verified webhook for unknown order ${input.orderId}`,
      createdAt: now,
      resolvedAt: null,
    });
    await db.collection('pay_webhook_events').updateOne(
      { eventId: input.eventId },
      { $set: { status: 'RECONCILIATION_REQUIRED', errorDetail: 'Unknown orderId', processedAt: now } }
    );
    return { outcome: 'RECONCILIATION_REQUIRED', detail: 'Unknown providerOrderId' };
  }

  const bookingId = String(attempt.bookingId);
  const booking = await db.collection('pay_bookings').findOne({ bookingId });
  if (!booking) {
    return { outcome: 'RECONCILIATION_REQUIRED', bookingId, detail: 'Booking missing for attempt' };
  }

  const bookingStatus = String(booking.status) as BookingStatus;

  // 2. Late payment after expiry/cancellation/rejection -> reconciliation, NEVER reopen booking
  if (bookingStatus === 'EXPIRED' || bookingStatus === 'CANCELLED' || bookingStatus === 'REJECTED') {
    await db.collection('pay_reconciliation_items').insertOne({
      reconId: `rec_${crypto.randomUUID()}`,
      bookingId,
      attemptId: String(attempt.attemptId),
      orderId: input.orderId,
      paymentId: input.paymentId,
      kind: 'LATE_PAYMENT',
      severity: 'CRITICAL',
      status: 'OPEN',
      expectedAmountPaise: attempt.amountPaise,
      actualAmountPaise: Long.fromBigInt(input.amountPaise),
      detail: `Late payment captured for ${bookingStatus} booking ${bookingId}. Manual refund/resolution required.`,
      createdAt: now,
      resolvedAt: null,
    });
    await db.collection('pay_payment_attempts').updateOne(
      { attemptId: attempt.attemptId },
      {
        $set: {
          status: 'RECONCILE_REQUIRED',
          isActive: false,
          providerPaymentId: input.paymentId,
          lastError: `Late payment received after booking ${bookingStatus}`,
          updatedAt: now,
        },
      }
    );
    await db.collection('pay_webhook_events').updateOne(
      { eventId: input.eventId },
      { $set: { status: 'RECONCILIATION_REQUIRED', errorDetail: 'Late payment', processedAt: now } }
    );
    return {
      outcome: 'RECONCILIATION_REQUIRED',
      bookingId,
      detail: `Late payment recorded in reconciliation for ${bookingStatus} booking.`,
    };
  }

  // 3. Amount and currency reconciliation
  const expectedPaise = fromBsonInt64(attempt.amountPaise);
  const expectedCurrency = String(attempt.currency || 'INR');
  if (input.amountPaise !== expectedPaise || input.currency !== expectedCurrency) {
    const kind = input.amountPaise !== expectedPaise ? 'AMOUNT_MISMATCH' : 'CURRENCY_MISMATCH';
    await db.collection('pay_reconciliation_items').insertOne({
      reconId: `rec_${crypto.randomUUID()}`,
      bookingId,
      attemptId: String(attempt.attemptId),
      orderId: input.orderId,
      paymentId: input.paymentId,
      kind,
      severity: 'CRITICAL',
      status: 'OPEN',
      expectedAmountPaise: attempt.amountPaise,
      actualAmountPaise: Long.fromBigInt(input.amountPaise),
      detail: `${kind}: expected ${expectedPaise.toString()} ${expectedCurrency}, got ${input.amountPaise.toString()} ${input.currency}`,
      createdAt: now,
      resolvedAt: null,
    });
    await db.collection('pay_payment_attempts').updateOne(
      { attemptId: attempt.attemptId },
      { $set: { status: 'RECONCILE_REQUIRED', isActive: false, updatedAt: now } }
    );
    await db.collection('pay_webhook_events').updateOne(
      { eventId: input.eventId },
      { $set: { status: 'RECONCILIATION_REQUIRED', errorDetail: kind, processedAt: now } }
    );
    return { outcome: 'RECONCILIATION_REQUIRED', bookingId, detail: `${kind} flagged` };
  }

  // 4. Double-entry ledger posting using unique businessOpId so payment.captured + order.paid never double-post
  const quoteSnapshot = booking.quoteSnapshotJson
    ? (JSON.parse(String(booking.quoteSnapshotJson)) as Record<string, unknown>)
    : {};
  const { totalBrandPayablePaise, brandFeePaise, gstPaise, escrowHeldPaise } =
    extractQuotePaise(quoteSnapshot);

  const routeHoldVerified = input.routeHoldVerified === true;
  const holdStatus = routeHoldVerified ? 'ROUTE_HELD' : 'CAPTURED_NO_ROUTE';

  await postLedgerEntry({
    idempotencyKey: businessOpId,
    bookingId,
    eventType: routeHoldVerified ? 'PAYMENT_CAPTURED' : 'PAYMENT_CAPTURED_HOLD_PENDING',
    actorId: input.actorId ?? 'webhook:razorpay',
    actorRole: 'SYSTEM',
    reason: routeHoldVerified
      ? `Razorpay payment ${input.paymentId} captured & Route hold verified for order ${input.orderId}`
      : `Razorpay payment ${input.paymentId} captured (hold pending; Route unverified) for order ${input.orderId}`,
    lines: [
      {
        accountCode: 'BRAND_PAYMENT_CLEARING',
        ownerType: 'BRAND',
        ownerId: String(booking.brandId),
        currency: expectedCurrency,
        direction: 'DEBIT',
        amountPaise: totalBrandPayablePaise,
      },
      {
        accountCode: 'ESCROW_HELD',
        ownerType: 'PLATFORM',
        ownerId: 'adzunova',
        currency: expectedCurrency,
        direction: 'CREDIT',
        amountPaise: escrowHeldPaise,
      },
      ...(brandFeePaise > BigInt(0)
        ? [
            {
              accountCode: 'PLATFORM_REVENUE' as const,
              ownerType: 'PLATFORM' as const,
              ownerId: 'adzunova',
              currency: expectedCurrency,
              direction: 'CREDIT' as const,
              amountPaise: brandFeePaise,
            },
          ]
        : []),
      ...(gstPaise > BigInt(0)
        ? [
            {
              accountCode: 'GST_PAYABLE' as const,
              ownerType: 'PLATFORM' as const,
              ownerId: 'adzunova',
              currency: expectedCurrency,
              direction: 'CREDIT' as const,
              amountPaise: gstPaise,
            },
          ]
        : []),
    ],
  });

  // 5. Crash-recoverable state transition:
  //    Only advance to FUNDS_SECURED when Route hold is verified; otherwise persist capture, keep PAYMENT_PENDING, and block creator work.
  const receiptNumber = `RCPT-${bookingId.slice(-8).toUpperCase()}-V${attempt.agreementVersion ?? 1}`;
  const client = await getPaymentsMongoClient();
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await db.collection('pay_payment_attempts').updateOne(
        { attemptId: attempt.attemptId },
        {
          $set: {
            status: 'CAPTURED',
            isActive: false,
            providerPaymentId: input.paymentId,
            holdOrSettlementStatus: holdStatus,
            receiptNumber,
            capturedAt: attempt.capturedAt ?? now,
            updatedAt: now,
          },
        },
        { session }
      );

      const latestBooking = await db
        .collection('pay_bookings')
        .findOne({ bookingId }, { session });

      if (routeHoldVerified) {
        if (latestBooking && latestBooking.status !== 'FUNDS_SECURED') {
          const fromStatus = String(latestBooking.status) as BookingStatus;
          assertValidBookingTransition(fromStatus, 'FUNDS_SECURED');
          await db.collection('pay_bookings').updateOne(
            { bookingId, version: Number(latestBooking.version ?? 1) },
            { $set: { status: 'FUNDS_SECURED', isOpen: false, updatedAt: now }, $inc: { version: 1 } },
            { session }
          );

          await db.collection('pay_booking_events').insertOne(
            {
              eventId: `bev_${crypto.randomUUID()}`,
              bookingId,
              eventType: 'FUNDS_SECURED',
              actorId: input.actorId ?? 'webhook:razorpay',
              actorRole: 'SYSTEM',
              fromStatus,
              toStatus: 'FUNDS_SECURED',
              reason: `Payment ${input.paymentId} verified & Route hold confirmed (Receipt ${receiptNumber})`,
              counterDeltaJson: null,
              createdAt: now,
            },
            { session }
          );

          await db.collection('pay_notifications').updateOne(
            { notifId: `ntf_${businessOpId}_brand` },
            {
              $setOnInsert: {
                notifId: `ntf_${businessOpId}_brand`,
                userId: String(booking.brandId),
                role: 'BRAND',
                type: 'BOOKING_FUNDS_SECURED',
                title: 'Payment Verified',
                message: `Payment received for "${booking.itemTitle}" (Receipt ${receiptNumber}).`,
                bookingId,
                readAt: null,
                createdAt: now,
              },
            },
            { upsert: true, session }
          );
          await db.collection('pay_notifications').updateOne(
            { notifId: `ntf_${businessOpId}_creator` },
            {
              $setOnInsert: {
                notifId: `ntf_${businessOpId}_creator`,
                userId: String(booking.creatorId),
                role: 'CREATOR',
                type: 'BOOKING_FUNDS_SECURED',
                title: 'Payment Received — Work Can Start',
                message: `Payment received for "${booking.itemTitle}"; work can start.`,
                bookingId,
                readAt: null,
                createdAt: now,
              },
            },
            { upsert: true, session }
          );

          await enqueueOutboxEvent(
            {
              eventType: 'BOOKING_FUNDS_SECURED',
              aggregateType: 'BOOKING',
              aggregateId: bookingId,
              payload: {
                bookingId,
                orderId: input.orderId,
                paymentId: input.paymentId,
                receiptNumber,
                amountPaise: totalBrandPayablePaise.toString(),
              },
            },
            session
          );

          await appendPaymentAuditEvent(
            {
              actorId: input.actorId ?? 'webhook:razorpay',
              actorRole: 'SYSTEM',
              action: 'BOOKING_FUNDS_SECURED',
              resourceType: 'BOOKING',
              resourceId: bookingId,
              payload: {
                orderId: input.orderId,
                paymentId: input.paymentId,
                businessOpId,
                receiptNumber,
              },
            },
            session
          );
        }
      } else {
        // Hold unverified: ensure booking moves out of SIGNED into PAYMENT_PENDING (never FUNDS_SECURED)
        if (latestBooking && latestBooking.status === 'SIGNED') {
          assertValidBookingTransition('SIGNED', 'PAYMENT_PENDING');
          await db.collection('pay_bookings').updateOne(
            { bookingId, version: Number(latestBooking.version ?? 1) },
            { $set: { status: 'PAYMENT_PENDING', updatedAt: now }, $inc: { version: 1 } },
            { session }
          );
        }

        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId,
            eventType: 'PAYMENT_CAPTURED_HOLD_PENDING',
            actorId: input.actorId ?? 'webhook:razorpay',
            actorRole: 'SYSTEM',
            fromStatus: latestBooking ? String(latestBooking.status) : 'PAYMENT_PENDING',
            toStatus: 'PAYMENT_PENDING',
            reason: `Payment ${input.paymentId} captured; funds protection is pending (Route unverified).`,
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );

        await db.collection('pay_reconciliation_items').updateOne(
          { attemptId: String(attempt.attemptId), kind: 'ROUTE_HOLD_UNAVAILABLE' },
          {
            $setOnInsert: {
              reconId: `rec_${crypto.randomUUID()}`,
              bookingId,
              attemptId: String(attempt.attemptId),
              orderId: input.orderId,
              paymentId: input.paymentId,
              kind: 'ROUTE_HOLD_UNAVAILABLE',
              severity: 'WARN',
              status: 'OPEN',
              expectedAmountPaise: attempt.amountPaise,
              actualAmountPaise: Long.fromBigInt(input.amountPaise),
              detail: 'Payment captured without verified Route hold; booking remains in PAYMENT_PENDING.',
              createdAt: now,
              resolvedAt: null,
            },
          },
          { upsert: true, session }
        );

        await db.collection('pay_notifications').updateOne(
          { notifId: `ntf_${businessOpId}_brand` },
          {
            $setOnInsert: {
              notifId: `ntf_${businessOpId}_brand`,
              userId: String(booking.brandId),
              role: 'BRAND',
              type: 'BOOKING_PAYMENT_CAPTURED_HOLD_PENDING',
              title: 'Payment Received — Hold Pending',
              message: `Payment received for "${booking.itemTitle}" (Receipt ${receiptNumber}). Funds protection is pending.`,
              bookingId,
              readAt: null,
              createdAt: now,
            },
          },
          { upsert: true, session }
        );
        await db.collection('pay_notifications').updateOne(
          { notifId: `ntf_${businessOpId}_creator` },
          {
            $setOnInsert: {
              notifId: `ntf_${businessOpId}_creator`,
              userId: String(booking.creatorId),
              role: 'CREATOR',
              type: 'BOOKING_PAYMENT_CAPTURED_HOLD_PENDING',
              title: 'Payment Received — Funds Protection Pending',
              message: `Payment received for "${booking.itemTitle}". Funds protection is pending before work unlocks.`,
              bookingId,
              readAt: null,
              createdAt: now,
            },
          },
          { upsert: true, session }
        );

        await enqueueOutboxEvent(
          {
            eventType: 'PAYMENT_CAPTURED_HOLD_PENDING',
            aggregateType: 'BOOKING',
            aggregateId: bookingId,
            payload: {
              bookingId,
              orderId: input.orderId,
              paymentId: input.paymentId,
              receiptNumber,
              amountPaise: totalBrandPayablePaise.toString(),
            },
          },
          session
        );

        await appendPaymentAuditEvent(
          {
            actorId: input.actorId ?? 'webhook:razorpay',
            actorRole: 'SYSTEM',
            action: 'PAYMENT_CAPTURED_HOLD_PENDING',
            resourceType: 'BOOKING',
            resourceId: bookingId,
            payload: {
              orderId: input.orderId,
              paymentId: input.paymentId,
              businessOpId,
              receiptNumber,
              holdStatus,
            },
          },
          session
        );
      }

      await db.collection('pay_webhook_events').updateOne(
        { eventId: input.eventId },
        { $set: { status: 'PROCESSED', processedAt: now } },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  return routeHoldVerified
    ? {
        outcome: 'FUNDS_SECURED',
        bookingId,
        receiptNumber,
        detail: 'Payment verified, Route hold confirmed, ledger posted, and booking moved to FUNDS_SECURED.',
      }
    : {
        outcome: 'CAPTURED_HOLD_PENDING',
        bookingId,
        receiptNumber,
        detail: 'Payment received. Funds protection is pending (Route hold unverified; creator work remains blocked).',
      };
}

export async function getBookingPaymentSummary(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR';
}): Promise<{
  bookingStatus: BookingStatus;
  latestAttempt: PaymentAttemptRecord | null;
  receiptNumber: string | null;
  taxInvoiceStatus: 'NOT_CONFIGURED';
  holdNote: string;
}> {
  const db = await getPaymentsMongoDb();
  const booking = await db.collection('pay_bookings').findOne({ bookingId: params.bookingId });
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }
  if (
    (params.actorRole === 'BRAND' && String(booking.brandId) !== params.actorId) ||
    (params.actorRole === 'CREATOR' && String(booking.creatorId) !== params.actorId)
  ) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'You are not authorized to view payment status for this booking.',
    });
  }

  const latest = await db
    .collection('pay_payment_attempts')
    .find({ bookingId: params.bookingId })
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  const attempt = latest.length > 0 ? docToAttempt(latest[0] as Record<string, unknown>) : null;
  return {
    bookingStatus: String(booking.status) as BookingStatus,
    latestAttempt: attempt,
    receiptNumber: attempt?.receiptNumber ?? null,
    taxInvoiceStatus: 'NOT_CONFIGURED',
    holdNote:
      String(booking.status) === 'FUNDS_SECURED'
        ? 'Payment received; work can start.'
        : attempt?.holdOrSettlementStatus === 'CAPTURED_NO_ROUTE'
          ? 'Payment received. Funds protection is pending.'
          : 'Pending payment verification.',
  };
}

export async function runPaymentReconciliation(staleThresholdMinutes = 30): Promise<{
  missingLedgerCount: number;
  staleAttemptCount: number;
  routeUnavailableCount: number;
  openReconItemsCount: number;
}> {
  const db = await getPaymentsMongoDb();
  const now = new Date();
  const staleCutoff = new Date(now.getTime() - staleThresholdMinutes * 60 * 1000);

  const capturedAttempts = await db
    .collection('pay_payment_attempts')
    .find({ status: 'CAPTURED' })
    .toArray();

  let missingLedgerCount = 0;
  let routeUnavailableCount = 0;

  for (const att of capturedAttempts) {
    const opId = `payment_capture:${att.providerOrderId}:${att.providerPaymentId}`;
    const ledgerEntry = await db
      .collection('pay_ledger_entries')
      .findOne({ idempotencyKey: opId });
    if (!ledgerEntry) {
      missingLedgerCount++;
      await db.collection('pay_reconciliation_items').updateOne(
        { attemptId: String(att.attemptId), kind: 'MISSING_LEDGER' },
        {
          $setOnInsert: {
            reconId: `rec_${crypto.randomUUID()}`,
            bookingId: String(att.bookingId),
            attemptId: String(att.attemptId),
            orderId: att.providerOrderId ? String(att.providerOrderId) : null,
            paymentId: att.providerPaymentId ? String(att.providerPaymentId) : null,
            kind: 'MISSING_LEDGER',
            severity: 'CRITICAL',
            status: 'OPEN',
            expectedAmountPaise: att.amountPaise,
            actualAmountPaise: null,
            detail: `Captured attempt ${att.attemptId} has no ledger entry (${opId})`,
            createdAt: now,
            resolvedAt: null,
          },
        },
        { upsert: true }
      );
    }
    if (att.holdOrSettlementStatus === 'CAPTURED_NO_ROUTE') {
      routeUnavailableCount++;
    }
  }

  const staleAttempts = await db
    .collection('pay_payment_attempts')
    .find({
      isActive: true,
      status: { $in: ['CREATING_ORDER', 'ORDER_CREATED'] },
      createdAt: { $lte: staleCutoff },
    })
    .toArray();

  for (const att of staleAttempts) {
    await db.collection('pay_reconciliation_items').updateOne(
      { attemptId: String(att.attemptId), kind: 'STALE_ATTEMPT' },
      {
        $setOnInsert: {
          reconId: `rec_${crypto.randomUUID()}`,
          bookingId: String(att.bookingId),
          attemptId: String(att.attemptId),
          orderId: att.providerOrderId ? String(att.providerOrderId) : null,
          paymentId: null,
          kind: 'STALE_ATTEMPT',
          severity: 'WARN',
          status: 'OPEN',
          expectedAmountPaise: att.amountPaise,
          actualAmountPaise: null,
          detail: `Stale payment attempt ${att.attemptId} in status ${att.status}`,
          createdAt: now,
          resolvedAt: null,
        },
      },
      { upsert: true }
    );
  }

  const openReconItemsCount = await db
    .collection('pay_reconciliation_items')
    .countDocuments({ status: 'OPEN' });

  return {
    missingLedgerCount,
    staleAttemptCount: staleAttempts.length,
    routeUnavailableCount,
    openReconItemsCount,
  };
}
