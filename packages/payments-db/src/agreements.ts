import crypto from 'node:crypto';
import { getPaymentsMongoClient, getPaymentsMongoDb } from './client';
import { appendPaymentAuditEvent } from './audit';
import { enqueueOutboxEvent } from './outbox';
import { MongoQueueAdapter } from './queue-port';
import { assertValidBookingTransition, type BookingRecord, type BookingStatus } from './bookings';
import { AppProblemError } from '@adzunova/problem-details';

export const AGREEMENT_TEMPLATE_VERSION = 'tpl_v1_2026_11';
export const DEFAULT_SIGN_WINDOW_HOURS = 120; // 5 days per spec §10

export const AGREEMENT_STATUSES = [
  'GENERATING',
  'PENDING_SIGNATURES',
  'SIGNED',
  'EXPIRED',
  'SUPERSEDED',
] as const;

export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number];

export interface AgreementRecord {
  agreementId: string;
  bookingId: string;
  bookingVersion: number;
  version: number;
  isActive: boolean;
  idempotencyKey: string;
  templateVersion: string;
  status: AgreementStatus;
  termsSnapshot: Record<string, unknown>;
  pdfBucket: string | null;
  pdfObjectKey: string | null;
  pdfSha256: string | null;
  pdfSizeBytes: number | null;
  signedPdfBucket: string | null;
  signedPdfObjectKey: string | null;
  signedPdfSha256: string | null;
  provider: string;
  providerEnvelopeId: string | null;
  brandSignedAt: string | null;
  brandSignerId: string | null;
  creatorSignedAt: string | null;
  creatorSignerId: string | null;
  expiresAt: string;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function docToAgreement(doc: Record<string, unknown>): AgreementRecord {
  return {
    agreementId: String(doc.agreementId),
    bookingId: String(doc.bookingId),
    bookingVersion: Number(doc.bookingVersion ?? 1),
    version: Number(doc.version ?? 1),
    isActive: Boolean(doc.isActive),
    idempotencyKey: String(doc.idempotencyKey),
    templateVersion: String(doc.templateVersion),
    status: String(doc.status) as AgreementStatus,
    termsSnapshot: doc.termsSnapshotJson ? JSON.parse(String(doc.termsSnapshotJson)) : {},
    pdfBucket: doc.pdfBucket ? String(doc.pdfBucket) : null,
    pdfObjectKey: doc.pdfObjectKey ? String(doc.pdfObjectKey) : null,
    pdfSha256: doc.pdfSha256 ? String(doc.pdfSha256) : null,
    pdfSizeBytes: typeof doc.pdfSizeBytes === 'number' ? doc.pdfSizeBytes : null,
    signedPdfBucket: doc.signedPdfBucket ? String(doc.signedPdfBucket) : null,
    signedPdfObjectKey: doc.signedPdfObjectKey ? String(doc.signedPdfObjectKey) : null,
    signedPdfSha256: doc.signedPdfSha256 ? String(doc.signedPdfSha256) : null,
    provider: String(doc.provider || 'UNCONFIGURED'),
    providerEnvelopeId: doc.providerEnvelopeId ? String(doc.providerEnvelopeId) : null,
    brandSignedAt: doc.brandSignedAt ? new Date(doc.brandSignedAt as Date | string).toISOString() : null,
    brandSignerId: doc.brandSignerId ? String(doc.brandSignerId) : null,
    creatorSignedAt: doc.creatorSignedAt ? new Date(doc.creatorSignedAt as Date | string).toISOString() : null,
    creatorSignerId: doc.creatorSignerId ? String(doc.creatorSignerId) : null,
    expiresAt: new Date(doc.expiresAt as Date | string).toISOString(),
    signedAt: doc.signedAt ? new Date(doc.signedAt as Date | string).toISOString() : null,
    createdAt: new Date(doc.createdAt as Date | string).toISOString(),
    updatedAt: new Date(doc.updatedAt as Date | string).toISOString(),
  };
}

function assertParticipant(
  bookingDoc: Record<string, unknown>,
  actorId: string,
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM'
): void {
  if (actorRole === 'BRAND' && String(bookingDoc.brandId) !== actorId) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'You are not the brand on this booking.',
    });
  }
  if (actorRole === 'CREATOR' && String(bookingDoc.creatorId) !== actorId) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'You are not the creator on this booking.',
    });
  }
}

export async function getActiveAgreementForBooking(
  bookingId: string
): Promise<AgreementRecord | null> {
  const db = await getPaymentsMongoDb();
  const doc = await db.collection('pay_agreements').findOne({ bookingId, isActive: true });
  return doc ? docToAgreement(doc as Record<string, unknown>) : null;
}

export async function getAgreementById(
  agreementId: string
): Promise<AgreementRecord | null> {
  const db = await getPaymentsMongoDb();
  const doc = await db.collection('pay_agreements').findOne({ agreementId });
  return doc ? docToAgreement(doc as Record<string, unknown>) : null;
}

export async function beginAgreementGeneration(input: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
  templateVersion?: string;
  termsSnapshot: Record<string, unknown>;
  signWindowHours?: number;
}): Promise<{ agreement: AgreementRecord; created: boolean; needsPdfUpload: boolean }> {
  const db = await getPaymentsMongoDb();
  const bookingDoc = await db.collection('pay_bookings').findOne({ bookingId: input.bookingId });
  if (!bookingDoc) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${input.bookingId} does not exist`,
    });
  }

  assertParticipant(bookingDoc as Record<string, unknown>, input.actorId, input.actorRole);

  const existingActive = await db
    .collection('pay_agreements')
    .findOne({ bookingId: input.bookingId, isActive: true });

  if (existingActive) {
    const rec = docToAgreement(existingActive as Record<string, unknown>);
    return {
      agreement: rec,
      created: false,
      needsPdfUpload: rec.status === 'GENERATING' || !rec.pdfObjectKey,
    };
  }

  const bookingStatus = String(bookingDoc.status) as BookingStatus;
  assertValidBookingTransition(bookingStatus, 'AGREEMENT_PENDING');

  const latestDoc = await db
    .collection('pay_agreements')
    .find({ bookingId: input.bookingId })
    .sort({ version: -1 })
    .limit(1)
    .toArray();
  const nextVersion = latestDoc.length > 0 ? Number(latestDoc[0].version) + 1 : 1;
  const bookingVersion = Number(bookingDoc.version ?? 1);
  const templateVersion = input.templateVersion ?? AGREEMENT_TEMPLATE_VERSION;
  const signWindowHours = input.signWindowHours ?? DEFAULT_SIGN_WINDOW_HOURS;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + signWindowHours * 60 * 60 * 1000);
  const agreementId = `agr_${crypto.randomUUID()}`;
  const idempotencyKey = `agr:${input.bookingId}:bv${bookingVersion}:v${nextVersion}`;

  const doc = {
    agreementId,
    bookingId: input.bookingId,
    bookingVersion,
    version: nextVersion,
    isActive: true,
    idempotencyKey,
    templateVersion,
    status: 'GENERATING',
    termsSnapshotJson: JSON.stringify(input.termsSnapshot),
    pdfBucket: null,
    pdfObjectKey: null,
    pdfSha256: null,
    pdfSizeBytes: null,
    signedPdfBucket: null,
    signedPdfObjectKey: null,
    signedPdfSha256: null,
    provider: 'UNCONFIGURED',
    providerEnvelopeId: null,
    brandSignedAt: null,
    brandSignerId: null,
    brandSignatureEvidenceJson: null,
    creatorSignedAt: null,
    creatorSignerId: null,
    creatorSignatureEvidenceJson: null,
    expiresAt,
    signedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.collection('pay_agreements').insertOne(doc);
    return {
      agreement: docToAgreement(doc),
      created: true,
      needsPdfUpload: true,
    };
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 11000) {
      const winner = await db
        .collection('pay_agreements')
        .findOne({ bookingId: input.bookingId, isActive: true });
      if (winner) {
        const rec = docToAgreement(winner as Record<string, unknown>);
        return {
          agreement: rec,
          created: false,
          needsPdfUpload: rec.status === 'GENERATING' || !rec.pdfObjectKey,
        };
      }
    }
    throw err;
  }
}

export async function finalizeAgreementPdf(input: {
  agreementId: string;
  bookingId: string;
  pdfBucket: string;
  pdfObjectKey: string;
  pdfSha256: string;
  pdfSizeBytes: number;
  provider: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
}): Promise<AgreementRecord> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();
  let finalizedDoc: Record<string, unknown> | null = null;
  let expiresAtForJob: Date | null = null;

  try {
    await session.withTransaction(async () => {
      const agr = await db
        .collection('pay_agreements')
        .findOne({ agreementId: input.agreementId, bookingId: input.bookingId }, { session });

      if (!agr) {
        throw new AppProblemError({
          status: 404,
          code: 'AGREEMENT_NOT_FOUND',
          title: 'Agreement Not Found',
          detail: `Agreement ${input.agreementId} does not exist`,
        });
      }

      if (agr.status === 'PENDING_SIGNATURES' || agr.status === 'SIGNED') {
        finalizedDoc = agr as Record<string, unknown>;
        return;
      }

      if (agr.status !== 'GENERATING') {
        throw new AppProblemError({
          status: 409,
          code: 'ILLEGAL_AGREEMENT_TRANSITION',
          title: 'Illegal Agreement Transition',
          detail: `Cannot finalize PDF for agreement in status ${agr.status}`,
        });
      }

      const booking = await db
        .collection('pay_bookings')
        .findOne({ bookingId: input.bookingId }, { session });

      if (!booking) {
        throw new AppProblemError({
          status: 404,
          code: 'BOOKING_NOT_FOUND',
          title: 'Booking Not Found',
          detail: `Booking ${input.bookingId} does not exist`,
        });
      }

      const fromStatus = String(booking.status) as BookingStatus;
      if (fromStatus !== 'AGREEMENT_PENDING') {
        assertValidBookingTransition(fromStatus, 'AGREEMENT_PENDING');
      }

      const now = new Date();
      expiresAtForJob = new Date(agr.expiresAt as Date | string);

      const updatedAgr = await db.collection('pay_agreements').findOneAndUpdate(
        { agreementId: input.agreementId, status: 'GENERATING' },
        {
          $set: {
            status: 'PENDING_SIGNATURES',
            pdfBucket: input.pdfBucket,
            pdfObjectKey: input.pdfObjectKey,
            pdfSha256: input.pdfSha256,
            pdfSizeBytes: input.pdfSizeBytes,
            provider: input.provider,
            updatedAt: now,
          },
        },
        { returnDocument: 'after', session }
      );

      if (!updatedAgr) {
        const current = await db
          .collection('pay_agreements')
          .findOne({ agreementId: input.agreementId }, { session });
        finalizedDoc = current as Record<string, unknown>;
        return;
      }

      finalizedDoc = updatedAgr as Record<string, unknown>;

      if (fromStatus === 'ACCEPTED') {
        const expectedBookingVersion = Number(booking.version ?? 1);
        const updatedBooking = await db.collection('pay_bookings').findOneAndUpdate(
          { bookingId: input.bookingId, version: expectedBookingVersion },
          {
            $set: {
              status: 'AGREEMENT_PENDING',
              isOpen: false,
              expiresAt: expiresAtForJob,
              updatedAt: now,
            },
            $inc: { version: 1 },
          },
          { returnDocument: 'after', session }
        );

        if (!updatedBooking) {
          throw new AppProblemError({
            status: 409,
            code: 'BOOKING_CONCURRENCY_CONFLICT',
            title: 'Concurrent Modification',
            detail: 'Booking was modified concurrently while finalizing agreement.',
          });
        }

        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId: input.bookingId,
            eventType: 'AGREEMENT_PENDING',
            actorId: input.actorId,
            actorRole: input.actorRole,
            fromStatus,
            toStatus: 'AGREEMENT_PENDING',
            reason: `Agreement ${input.agreementId} v${agr.version} generated`,
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );

        const itemTitle = String(booking.itemTitle || 'Collaboration');
        await db.collection('pay_notifications').insertMany(
          [
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.brandId),
              role: 'BRAND',
              type: 'AGREEMENT_READY',
              title: 'Agreement Ready for Signature',
              message: `Agreement v${agr.version} for "${itemTitle}" is ready for review and signature.`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.creatorId),
              role: 'CREATOR',
              type: 'AGREEMENT_READY',
              title: 'Agreement Ready for Signature',
              message: `Agreement v${agr.version} for "${itemTitle}" is ready for review and signature.`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
          ],
          { session }
        );

        await enqueueOutboxEvent(
          {
            eventType: 'AGREEMENT_GENERATED',
            aggregateType: 'AGREEMENT',
            aggregateId: input.agreementId,
            payload: {
              bookingId: input.bookingId,
              agreementId: input.agreementId,
              version: Number(agr.version),
              pdfSha256: input.pdfSha256,
            },
          },
          session
        );

        await appendPaymentAuditEvent(
          {
            actorId: input.actorId,
            actorRole: input.actorRole,
            action: 'AGREEMENT_GENERATED',
            resourceType: 'AGREEMENT',
            resourceId: input.agreementId,
            payload: {
              bookingId: input.bookingId,
              version: Number(agr.version),
              templateVersion: String(agr.templateVersion),
              pdfSha256: input.pdfSha256,
            },
          },
          session
        );
      }
    });
  } finally {
    await session.endSession();
  }

  if (expiresAtForJob) {
    const queue = new MongoQueueAdapter();
    await queue.enqueue({
      queueName: 'booking-timers',
      jobType: 'EXPIRE_BOOKING_AGREEMENT',
      dedupKey: `agreement:${input.agreementId}:expire`,
      payload: { agreementId: input.agreementId, bookingId: input.bookingId },
      runAt: expiresAtForJob,
    });
  }

  return docToAgreement(finalizedDoc!);
}

export async function createReplacementAgreement(input: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
  templateVersion?: string;
  termsSnapshot: Record<string, unknown>;
  signWindowHours?: number;
  reason?: string;
}): Promise<AgreementRecord> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();
  let newDoc: Record<string, unknown> | null = null;

  try {
    await session.withTransaction(async () => {
      const booking = await db
        .collection('pay_bookings')
        .findOne({ bookingId: input.bookingId }, { session });
      if (!booking) {
        throw new AppProblemError({
          status: 404,
          code: 'BOOKING_NOT_FOUND',
          title: 'Booking Not Found',
          detail: `Booking ${input.bookingId} does not exist`,
        });
      }
      assertParticipant(booking as Record<string, unknown>, input.actorId, input.actorRole);

      if (booking.status === 'SIGNED') {
        throw new AppProblemError({
          status: 409,
          code: 'AGREEMENT_ALREADY_SIGNED',
          title: 'Agreement Already Signed',
          detail: 'Cannot replace an already signed agreement.',
        });
      }
      if (booking.status !== 'AGREEMENT_PENDING' && booking.status !== 'ACCEPTED') {
        throw new AppProblemError({
          status: 409,
          code: 'ILLEGAL_BOOKING_TRANSITION',
          title: 'Illegal State',
          detail: `Cannot create replacement agreement when booking is ${booking.status}`,
        });
      }

      const now = new Date();
      const prevActive = await db
        .collection('pay_agreements')
        .findOne({ bookingId: input.bookingId, isActive: true }, { session });

      if (prevActive) {
        await db.collection('pay_agreements').updateOne(
          { agreementId: prevActive.agreementId, isActive: true },
          { $set: { isActive: false, status: 'SUPERSEDED', updatedAt: now } },
          { session }
        );
      }

      const latest = await db
        .collection('pay_agreements')
        .find({ bookingId: input.bookingId }, { session })
        .sort({ version: -1 })
        .limit(1)
        .toArray();
      const nextVersion = latest.length > 0 ? Number(latest[0].version) + 1 : 1;
      const bookingVersion = Number(booking.version ?? 1);
      const signWindowHours = input.signWindowHours ?? DEFAULT_SIGN_WINDOW_HOURS;
      const expiresAt = new Date(now.getTime() + signWindowHours * 60 * 60 * 1000);
      const agreementId = `agr_${crypto.randomUUID()}`;

      const doc = {
        agreementId,
        bookingId: input.bookingId,
        bookingVersion,
        version: nextVersion,
        isActive: true,
        idempotencyKey: `agr:${input.bookingId}:bv${bookingVersion}:v${nextVersion}`,
        templateVersion: input.templateVersion ?? AGREEMENT_TEMPLATE_VERSION,
        status: 'GENERATING',
        termsSnapshotJson: JSON.stringify(input.termsSnapshot),
        pdfBucket: null,
        pdfObjectKey: null,
        pdfSha256: null,
        pdfSizeBytes: null,
        signedPdfBucket: null,
        signedPdfObjectKey: null,
        signedPdfSha256: null,
        provider: 'UNCONFIGURED',
        providerEnvelopeId: null,
        brandSignedAt: null,
        brandSignerId: null,
        brandSignatureEvidenceJson: null,
        creatorSignedAt: null,
        creatorSignerId: null,
        creatorSignatureEvidenceJson: null,
        expiresAt,
        signedAt: null,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection('pay_agreements').insertOne(doc, { session });
      newDoc = doc;

      await appendPaymentAuditEvent(
        {
          actorId: input.actorId,
          actorRole: input.actorRole,
          action: 'AGREEMENT_REPLACED',
          resourceType: 'AGREEMENT',
          resourceId: agreementId,
          reason: input.reason ?? 'Replacement agreement requested',
          payload: {
            bookingId: input.bookingId,
            previousAgreementId: prevActive ? String(prevActive.agreementId) : null,
            newVersion: nextVersion,
          },
        },
        session
      );
    });
  } finally {
    await session.endSession();
  }

  return docToAgreement(newDoc!);
}

export async function setAgreementEnvelopeId(input: {
  agreementId: string;
  provider: string;
  providerEnvelopeId: string;
}): Promise<void> {
  const db = await getPaymentsMongoDb();
  await db.collection('pay_agreements').updateOne(
    { agreementId: input.agreementId },
    {
      $set: {
        provider: input.provider,
        providerEnvelopeId: input.providerEnvelopeId,
        updatedAt: new Date(),
      },
    }
  );
}

export async function recordVerifiedAgreementSignature(input: {
  agreementId: string;
  bookingId: string;
  version: number;
  pdfSha256: string;
  signerRole: 'BRAND' | 'CREATOR';
  signerId: string;
  callbackId: string;
  provider: string;
  providerEnvelopeId?: string | null;
  evidence: Record<string, unknown>;
  signedPdf?: { bucket: string; objectKey: string; sha256: string } | null;
}): Promise<{ agreement: AgreementRecord; bookingStatus: BookingStatus; duplicate: boolean }> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();

  let resultAgreement: AgreementRecord | null = null;
  let resultBookingStatus: BookingStatus = 'AGREEMENT_PENDING';
  let duplicate = false;
  let expiredDuringCheck = false;

  try {
    await session.withTransaction(async () => {
      const existingCallback = await db
        .collection('pay_agreement_callbacks')
        .findOne({ callbackId: input.callbackId }, { session });

      if (existingCallback) {
        const currentAgr = await db
          .collection('pay_agreements')
          .findOne({ agreementId: input.agreementId }, { session });
        const currentBooking = await db
          .collection('pay_bookings')
          .findOne({ bookingId: input.bookingId }, { session });
        if (!currentAgr || !currentBooking) {
          throw new AppProblemError({
            status: 404,
            code: 'AGREEMENT_NOT_FOUND',
            title: 'Agreement Not Found',
            detail: `Agreement ${input.agreementId} not found`,
          });
        }
        duplicate = true;
        resultAgreement = docToAgreement(currentAgr as Record<string, unknown>);
        resultBookingStatus = String(currentBooking.status) as BookingStatus;
        return;
      }

      const agr = await db
        .collection('pay_agreements')
        .findOne({ agreementId: input.agreementId, bookingId: input.bookingId }, { session });

      if (!agr || !agr.isActive) {
        throw new AppProblemError({
          status: 404,
          code: 'AGREEMENT_NOT_ACTIVE',
          title: 'Active Agreement Not Found',
          detail: `No active agreement ${input.agreementId} for booking ${input.bookingId}`,
        });
      }

      if (Number(agr.version) !== input.version || String(agr.pdfSha256) !== input.pdfSha256) {
        throw new AppProblemError({
          status: 409,
          code: 'AGREEMENT_VERSION_MISMATCH',
          title: 'Agreement Version or Hash Mismatch',
          detail: 'Signature evidence does not match the active agreement version and PDF SHA-256.',
        });
      }

      const booking = await db
        .collection('pay_bookings')
        .findOne({ bookingId: input.bookingId }, { session });
      if (!booking) {
        throw new AppProblemError({
          status: 404,
          code: 'BOOKING_NOT_FOUND',
          title: 'Booking Not Found',
          detail: `Booking ${input.bookingId} does not exist`,
        });
      }

      assertParticipant(booking as Record<string, unknown>, input.signerId, input.signerRole);

      const now = new Date();
      const expiresAt = new Date(agr.expiresAt as Date | string);

      if (agr.status === 'EXPIRED' || booking.status === 'EXPIRED' || now > expiresAt) {
        if (agr.status !== 'EXPIRED') {
          await db.collection('pay_agreements').updateOne(
            { agreementId: input.agreementId },
            { $set: { status: 'EXPIRED', updatedAt: now } },
            { session }
          );
        }
        if (booking.status === 'AGREEMENT_PENDING') {
          await db.collection('pay_bookings').updateOne(
            { bookingId: input.bookingId, version: Number(booking.version) },
            { $set: { status: 'EXPIRED', isOpen: false, updatedAt: now }, $inc: { version: 1 } },
            { session }
          );
        }
        expiredDuringCheck = true;
        return;
      }

      if (agr.status === 'SIGNED') {
        duplicate = true;
        resultAgreement = docToAgreement(agr as Record<string, unknown>);
        resultBookingStatus = String(booking.status) as BookingStatus;
        return;
      }

      if (agr.status !== 'PENDING_SIGNATURES') {
        throw new AppProblemError({
          status: 409,
          code: 'ILLEGAL_AGREEMENT_TRANSITION',
          title: 'Agreement Not Ready',
          detail: `Cannot record signature when agreement is in status ${agr.status}`,
        });
      }

      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(input.evidence))
        .digest('hex');

      await db.collection('pay_agreement_callbacks').insertOne(
        {
          callbackId: input.callbackId,
          agreementId: input.agreementId,
          provider: input.provider,
          signerRole: input.signerRole,
          payloadHash,
          processedAt: now,
        },
        { session }
      );

      const alreadySignedByRole =
        input.signerRole === 'BRAND' ? Boolean(agr.brandSignedAt) : Boolean(agr.creatorSignedAt);

      if (alreadySignedByRole) {
        duplicate = true;
        resultAgreement = docToAgreement(agr as Record<string, unknown>);
        resultBookingStatus = String(booking.status) as BookingStatus;
        return;
      }

      const setFields: Record<string, unknown> = {
        provider: input.provider,
        updatedAt: now,
      };
      if (input.providerEnvelopeId) {
        setFields.providerEnvelopeId = input.providerEnvelopeId;
      }
      if (input.signerRole === 'BRAND') {
        setFields.brandSignedAt = now;
        setFields.brandSignerId = input.signerId;
        setFields.brandSignatureEvidenceJson = JSON.stringify(input.evidence);
      } else {
        setFields.creatorSignedAt = now;
        setFields.creatorSignerId = input.signerId;
        setFields.creatorSignatureEvidenceJson = JSON.stringify(input.evidence);
      }
      if (input.signedPdf) {
        setFields.signedPdfBucket = input.signedPdf.bucket;
        setFields.signedPdfObjectKey = input.signedPdf.objectKey;
        setFields.signedPdfSha256 = input.signedPdf.sha256;
      }

      const bothSigned =
        input.signerRole === 'BRAND' ? Boolean(agr.creatorSignedAt) : Boolean(agr.brandSignedAt);

      if (bothSigned) {
        setFields.status = 'SIGNED';
        setFields.signedAt = now;
      }

      const updatedAgr = await db.collection('pay_agreements').findOneAndUpdate(
        {
          agreementId: input.agreementId,
          status: 'PENDING_SIGNATURES',
          ...(input.signerRole === 'BRAND' ? { brandSignedAt: null } : { creatorSignedAt: null }),
        },
        { $set: setFields },
        { returnDocument: 'after', session }
      );

      if (!updatedAgr) {
        throw new AppProblemError({
          status: 409,
          code: 'AGREEMENT_CONCURRENCY_CONFLICT',
          title: 'Concurrent Signature Update',
          detail: 'Agreement signature state changed concurrently. Please retry.',
        });
      }

      resultAgreement = docToAgreement(updatedAgr as Record<string, unknown>);
      const itemTitle = String(booking.itemTitle || 'Collaboration');

      if (bothSigned) {
        const fromStatus = String(booking.status) as BookingStatus;
        assertValidBookingTransition(fromStatus, 'SIGNED');
        const expectedBookingVersion = Number(booking.version ?? 1);

        const updatedBooking = await db.collection('pay_bookings').findOneAndUpdate(
          { bookingId: input.bookingId, version: expectedBookingVersion },
          {
            $set: { status: 'SIGNED', isOpen: false, updatedAt: now },
            $inc: { version: 1 },
          },
          { returnDocument: 'after', session }
        );

        if (!updatedBooking) {
          throw new AppProblemError({
            status: 409,
            code: 'BOOKING_CONCURRENCY_CONFLICT',
            title: 'Concurrent Booking Modification',
            detail: 'Booking was modified concurrently during signature completion.',
          });
        }

        resultBookingStatus = 'SIGNED';

        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId: input.bookingId,
            eventType: 'SIGNED',
            actorId: input.signerId,
            actorRole: input.signerRole,
            fromStatus,
            toStatus: 'SIGNED',
            reason: `Both parties signed agreement ${input.agreementId} v${input.version}`,
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );

        await db.collection('pay_notifications').insertMany(
          [
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.brandId),
              role: 'BRAND',
              type: 'BOOKING_SIGNED',
              title: 'Agreement Signed',
              message: `Both parties signed "${itemTitle}". Payment is not enabled yet.`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.creatorId),
              role: 'CREATOR',
              type: 'BOOKING_SIGNED',
              title: 'Agreement Signed',
              message: `Both parties signed "${itemTitle}". Payment is not enabled yet.`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
          ],
          { session }
        );

        await enqueueOutboxEvent(
          {
            eventType: 'AGREEMENT_SIGNED',
            aggregateType: 'AGREEMENT',
            aggregateId: input.agreementId,
            payload: {
              bookingId: input.bookingId,
              agreementId: input.agreementId,
              version: input.version,
              pdfSha256: input.pdfSha256,
              signedAt: now.toISOString(),
            },
          },
          session
        );

        await appendPaymentAuditEvent(
          {
            actorId: input.signerId,
            actorRole: input.signerRole,
            action: 'AGREEMENT_SIGNED',
            resourceType: 'AGREEMENT',
            resourceId: input.agreementId,
            payload: {
              bookingId: input.bookingId,
              version: input.version,
              signerRole: input.signerRole,
              callbackId: input.callbackId,
            },
          },
          session
        );
      } else {
        resultBookingStatus = String(booking.status) as BookingStatus;
        const counterpartyId =
          input.signerRole === 'BRAND' ? String(booking.creatorId) : String(booking.brandId);
        const counterpartyRole = input.signerRole === 'BRAND' ? 'CREATOR' : 'BRAND';

        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId: input.bookingId,
            eventType: 'AGREEMENT_PARTIAL_SIGN',
            actorId: input.signerId,
            actorRole: input.signerRole,
            fromStatus: String(booking.status),
            toStatus: String(booking.status),
            reason: `${input.signerRole} signed agreement ${input.agreementId} v${input.version}`,
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );

        await db.collection('pay_notifications').insertOne(
          {
            notifId: `ntf_${crypto.randomUUID()}`,
            userId: counterpartyId,
            role: counterpartyRole,
            type: 'AGREEMENT_AWAITING_COUNTERPARTY',
            title: 'Counterparty Signed Agreement',
            message: `${input.signerRole === 'BRAND' ? booking.brandName : booking.creatorName} signed "${itemTitle}". Awaiting your signature.`,
            bookingId: input.bookingId,
            readAt: null,
            createdAt: now,
          },
          { session }
        );

        await appendPaymentAuditEvent(
          {
            actorId: input.signerId,
            actorRole: input.signerRole,
            action: 'AGREEMENT_SIGNATURE_RECORDED',
            resourceType: 'AGREEMENT',
            resourceId: input.agreementId,
            payload: {
              bookingId: input.bookingId,
              version: input.version,
              signerRole: input.signerRole,
              callbackId: input.callbackId,
            },
          },
          session
        );
      }
    });
  } finally {
    await session.endSession();
  }

  if (expiredDuringCheck) {
    throw new AppProblemError({
      status: 409,
      code: 'AGREEMENT_EXPIRED',
      title: 'Agreement Expired',
      detail: 'The signing deadline has passed. Late signatures are rejected.',
    });
  }

  return {
    agreement: resultAgreement!,
    bookingStatus: resultBookingStatus,
    duplicate,
  };
}

export async function expireAgreement(input: {
  agreementId: string;
  bookingId: string;
  actorId?: string;
}): Promise<{ agreement: AgreementRecord; bookingStatus: BookingStatus; alreadyExpired: boolean }> {
  const client = await getPaymentsMongoClient();
  const db = await getPaymentsMongoDb();
  const session = client.startSession();
  let resultAgr: AgreementRecord | null = null;
  let resultStatus: BookingStatus = 'EXPIRED';
  let alreadyExpired = false;

  try {
    await session.withTransaction(async () => {
      const agr = await db
        .collection('pay_agreements')
        .findOne({ agreementId: input.agreementId, bookingId: input.bookingId }, { session });
      if (!agr) {
        throw new AppProblemError({
          status: 404,
          code: 'AGREEMENT_NOT_FOUND',
          title: 'Agreement Not Found',
          detail: `Agreement ${input.agreementId} does not exist`,
        });
      }

      const booking = await db
        .collection('pay_bookings')
        .findOne({ bookingId: input.bookingId }, { session });
      if (!booking) {
        throw new AppProblemError({
          status: 404,
          code: 'BOOKING_NOT_FOUND',
          title: 'Booking Not Found',
          detail: `Booking ${input.bookingId} does not exist`,
        });
      }

      if (agr.status === 'EXPIRED' && booking.status === 'EXPIRED') {
        alreadyExpired = true;
        resultAgr = docToAgreement(agr as Record<string, unknown>);
        resultStatus = 'EXPIRED';
        return;
      }

      if (agr.status === 'SIGNED' || booking.status === 'SIGNED') {
        throw new AppProblemError({
          status: 409,
          code: 'ILLEGAL_BOOKING_TRANSITION',
          title: 'Already Signed',
          detail: 'Cannot expire a signed agreement.',
        });
      }

      const now = new Date();
      const updatedAgr = await db.collection('pay_agreements').findOneAndUpdate(
        { agreementId: input.agreementId, status: { $in: ['GENERATING', 'PENDING_SIGNATURES'] } },
        { $set: { status: 'EXPIRED', updatedAt: now } },
        { returnDocument: 'after', session }
      );
      resultAgr = docToAgreement((updatedAgr ?? agr) as Record<string, unknown>);

      if (booking.status === 'AGREEMENT_PENDING') {
        assertValidBookingTransition('AGREEMENT_PENDING', 'EXPIRED');
        await db.collection('pay_bookings').findOneAndUpdate(
          { bookingId: input.bookingId, version: Number(booking.version) },
          { $set: { status: 'EXPIRED', isOpen: false, updatedAt: now }, $inc: { version: 1 } },
          { session }
        );

        await db.collection('pay_booking_events').insertOne(
          {
            eventId: `bev_${crypto.randomUUID()}`,
            bookingId: input.bookingId,
            eventType: 'EXPIRED',
            actorId: input.actorId ?? 'system:timer',
            actorRole: 'SYSTEM',
            fromStatus: 'AGREEMENT_PENDING',
            toStatus: 'EXPIRED',
            reason: 'Agreement signing deadline expired (5 days)',
            counterDeltaJson: null,
            createdAt: now,
          },
          { session }
        );

        await db.collection('pay_notifications').insertMany(
          [
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.brandId),
              role: 'BRAND',
              type: 'AGREEMENT_EXPIRED',
              title: 'Agreement Expired',
              message: `Signing deadline expired for "${booking.itemTitle}".`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
            {
              notifId: `ntf_${crypto.randomUUID()}`,
              userId: String(booking.creatorId),
              role: 'CREATOR',
              type: 'AGREEMENT_EXPIRED',
              title: 'Agreement Expired',
              message: `Signing deadline expired for "${booking.itemTitle}".`,
              bookingId: input.bookingId,
              readAt: null,
              createdAt: now,
            },
          ],
          { session }
        );

        await enqueueOutboxEvent(
          {
            eventType: 'AGREEMENT_EXPIRED',
            aggregateType: 'AGREEMENT',
            aggregateId: input.agreementId,
            payload: { bookingId: input.bookingId, agreementId: input.agreementId },
          },
          session
        );

        await appendPaymentAuditEvent(
          {
            actorId: input.actorId ?? 'system:timer',
            actorRole: 'SYSTEM',
            action: 'AGREEMENT_EXPIRED',
            resourceType: 'AGREEMENT',
            resourceId: input.agreementId,
            payload: { bookingId: input.bookingId },
          },
          session
        );
      }

      resultStatus = 'EXPIRED';
    });
  } finally {
    await session.endSession();
  }

  return {
    agreement: resultAgr!,
    bookingStatus: resultStatus,
    alreadyExpired,
  };
}
