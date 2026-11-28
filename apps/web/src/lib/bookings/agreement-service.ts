import {
  AGREEMENT_TEMPLATE_VERSION,
  beginAgreementGeneration,
  createReplacementAgreement,
  finalizeAgreementPdf,
  getActiveAgreementForBooking,
  getBookingById,
  setAgreementEnvelopeId,
  type AgreementRecord,
} from '@adzunova/payments-db';
import { AppProblemError } from '@adzunova/problem-details';
import { loadPaymentsEnv } from '../payments/env';
import { getStorageAdapterForRole } from '../storage/runtime';
import { buildPrivateKey, computeTenantShard } from '../storage/keys';
import { issueBoundedPresignedGet } from '../storage/delivery';
import type { ObjectStoragePort } from '../storage/port';
import {
  buildAgreementTermsSnapshot,
  generateAgreementPdfBuffer,
} from './agreement-pdf';
import { getESignAdapter, type ESignPort } from './esign-port';

export async function generateOrGetBookingAgreement(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
  storageOverride?: { port: Pick<ObjectStoragePort, 'put'>; privateBucket: string };
}): Promise<{ agreement: AgreementRecord; created: boolean }> {
  const booking = await getBookingById(params.bookingId);
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }

  const env = loadPaymentsEnv();
  const initialTerms = buildAgreementTermsSnapshot(booking, 1);

  const begun = await beginAgreementGeneration({
    bookingId: params.bookingId,
    actorId: params.actorId,
    actorRole: params.actorRole,
    templateVersion: AGREEMENT_TEMPLATE_VERSION,
    termsSnapshot: initialTerms as unknown as Record<string, unknown>,
    signWindowHours: env.agreementSignWindowHours,
  });

  if (!begun.needsPdfUpload) {
    return { agreement: begun.agreement, created: begun.created };
  }

  const terms = buildAgreementTermsSnapshot(booking, begun.agreement.version);
  const { pdfBuffer, sha256, sizeBytes } = generateAgreementPdfBuffer({
    agreementId: begun.agreement.agreementId,
    terms,
    generatedAtIso: begun.agreement.createdAt,
  });

  let putPort: Pick<ObjectStoragePort, 'put'>;
  let privateBucket: string;

  if (params.storageOverride) {
    putPort = params.storageOverride.port;
    privateBucket = params.storageOverride.privateBucket;
  } else {
    const adapter = getStorageAdapterForRole('processor');
    if (!adapter.ok) {
      throw new AppProblemError({
        status: 503,
        code: 'STORAGE_NOT_CONFIGURED',
        title: 'Storage Not Configured',
        detail: adapter.reason,
      });
    }
    putPort = adapter.port;
    privateBucket = adapter.runtime.buckets.private;
  }

  const objectKey = buildPrivateKey({
    domain: 'agreements',
    tenantShard: computeTenantShard(booking.brandId),
    entityId: booking.bookingId,
    assetId: begun.agreement.agreementId,
    version: begun.agreement.version,
    ext: 'pdf',
  });

  try {
    await putPort.put(privateBucket, objectKey, pdfBuffer, {
      contentType: 'application/pdf',
      contentLength: pdfBuffer.length,
      cacheControl: 'private, no-store',
    });
  } catch (err: unknown) {
    throw new AppProblemError({
      status: 503,
      code: 'AGREEMENT_STORAGE_FAILED',
      title: 'Agreement PDF Upload Failed',
      detail:
        err instanceof Error
          ? `Could not store agreement PDF (${err.message}). Retry is safe.`
          : 'Could not store agreement PDF. Retry is safe.',
    });
  }

  const esign = getESignAdapter();
  const finalized = await finalizeAgreementPdf({
    agreementId: begun.agreement.agreementId,
    bookingId: params.bookingId,
    pdfBucket: privateBucket,
    pdfObjectKey: objectKey,
    pdfSha256: sha256,
    pdfSizeBytes: sizeBytes,
    provider: esign.providerName,
    actorId: params.actorId,
    actorRole: params.actorRole,
  });

  return { agreement: finalized, created: begun.created };
}

export async function issueReplacementBookingAgreement(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR' | 'SYSTEM';
  reason?: string;
  storageOverride?: { port: Pick<ObjectStoragePort, 'put'>; privateBucket: string };
}): Promise<AgreementRecord> {
  const booking = await getBookingById(params.bookingId);
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }

  const env = loadPaymentsEnv();
  const existing = await getActiveAgreementForBooking(params.bookingId);
  const nextVer = existing ? existing.version + 1 : 1;
  const terms = buildAgreementTermsSnapshot(booking, nextVer);

  const agr = await createReplacementAgreement({
    bookingId: params.bookingId,
    actorId: params.actorId,
    actorRole: params.actorRole,
    templateVersion: AGREEMENT_TEMPLATE_VERSION,
    termsSnapshot: terms as unknown as Record<string, unknown>,
    signWindowHours: env.agreementSignWindowHours,
    reason: params.reason,
  });

  const { pdfBuffer, sha256, sizeBytes } = generateAgreementPdfBuffer({
    agreementId: agr.agreementId,
    terms,
    generatedAtIso: agr.createdAt,
  });

  let putPort: Pick<ObjectStoragePort, 'put'>;
  let privateBucket: string;

  if (params.storageOverride) {
    putPort = params.storageOverride.port;
    privateBucket = params.storageOverride.privateBucket;
  } else {
    const adapter = getStorageAdapterForRole('processor');
    if (!adapter.ok) {
      throw new AppProblemError({
        status: 503,
        code: 'STORAGE_NOT_CONFIGURED',
        title: 'Storage Not Configured',
        detail: adapter.reason,
      });
    }
    putPort = adapter.port;
    privateBucket = adapter.runtime.buckets.private;
  }

  const objectKey = buildPrivateKey({
    domain: 'agreements',
    tenantShard: computeTenantShard(booking.brandId),
    entityId: booking.bookingId,
    assetId: agr.agreementId,
    version: agr.version,
    ext: 'pdf',
  });

  await putPort.put(privateBucket, objectKey, pdfBuffer, {
    contentType: 'application/pdf',
    contentLength: pdfBuffer.length,
    cacheControl: 'private, no-store',
  });

  const esign = getESignAdapter();
  return finalizeAgreementPdf({
    agreementId: agr.agreementId,
    bookingId: params.bookingId,
    pdfBucket: privateBucket,
    pdfObjectKey: objectKey,
    pdfSha256: sha256,
    pdfSizeBytes: sizeBytes,
    provider: esign.providerName,
    actorId: params.actorId,
    actorRole: params.actorRole,
  });
}

export async function issueAuthorizedAgreementPdfUrl(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR';
  signed?: boolean;
  readerOverride?: Pick<ObjectStoragePort, 'presignGet'>;
}): Promise<{
  downloadUrl: string;
  expiresInSeconds: number;
  version: number;
  sha256: string;
}> {
  const booking = await getBookingById(params.bookingId);
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }

  if (
    (params.actorRole === 'BRAND' && booking.brandId !== params.actorId) ||
    (params.actorRole === 'CREATOR' && booking.creatorId !== params.actorId)
  ) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'You are not authorized to access this booking agreement.',
    });
  }

  const agr = await getActiveAgreementForBooking(params.bookingId);
  if (!agr || !agr.pdfObjectKey || !agr.pdfBucket || !agr.pdfSha256) {
    throw new AppProblemError({
      status: 404,
      code: 'AGREEMENT_PDF_NOT_READY',
      title: 'Agreement PDF Not Ready',
      detail: 'Agreement PDF has not been generated yet.',
    });
  }

  const useSigned = Boolean(params.signed && agr.signedPdfObjectKey && agr.signedPdfBucket);
  const bucket = useSigned ? agr.signedPdfBucket! : agr.pdfBucket;
  const objectKey = useSigned ? agr.signedPdfObjectKey! : agr.pdfObjectKey;
  const sha256 = useSigned ? agr.signedPdfSha256! : agr.pdfSha256;

  let presignPort: Pick<ObjectStoragePort, 'presignGet'>;
  if (params.readerOverride) {
    presignPort = params.readerOverride;
  } else {
    const adapter = getStorageAdapterForRole('reader');
    if (!adapter.ok) {
      throw new AppProblemError({
        status: 503,
        code: 'STORAGE_NOT_CONFIGURED',
        title: 'Storage Not Configured',
        detail: adapter.reason,
      });
    }
    presignPort = adapter.port;
  }

  const ttl = 300;
  const downloadUrl = await issueBoundedPresignedGet(presignPort, bucket, objectKey, ttl);

  return {
    downloadUrl,
    expiresInSeconds: ttl,
    version: agr.version,
    sha256,
  };
}

export async function initiateAgreementSigning(params: {
  bookingId: string;
  actorId: string;
  actorRole: 'BRAND' | 'CREATOR';
  esignOverride?: ESignPort;
}): Promise<{
  provider: string;
  envelopeId: string;
  signingUrl: string | null;
}> {
  const booking = await getBookingById(params.bookingId);
  if (!booking) {
    throw new AppProblemError({
      status: 404,
      code: 'BOOKING_NOT_FOUND',
      title: 'Booking Not Found',
      detail: `Booking ${params.bookingId} does not exist`,
    });
  }

  if (
    (params.actorRole === 'BRAND' && booking.brandId !== params.actorId) ||
    (params.actorRole === 'CREATOR' && booking.creatorId !== params.actorId)
  ) {
    throw new AppProblemError({
      status: 403,
      code: 'BOOKING_FORBIDDEN',
      title: 'Forbidden',
      detail: 'You are not authorized to sign this booking agreement.',
    });
  }

  const agr = await getActiveAgreementForBooking(params.bookingId);
  if (!agr || agr.status !== 'PENDING_SIGNATURES' || !agr.pdfSha256) {
    throw new AppProblemError({
      status: 409,
      code: 'AGREEMENT_NOT_SIGNABLE',
      title: 'Agreement Not Ready For Signing',
      detail: 'Agreement is not in PENDING_SIGNATURES state.',
    });
  }

  const esign = params.esignOverride ?? getESignAdapter();
  const session = await esign.createSigningSession({
    agreementId: agr.agreementId,
    bookingId: booking.bookingId,
    version: agr.version,
    pdfSha256: agr.pdfSha256,
    signerRole: params.actorRole,
    signerId: params.actorId,
    signerName: params.actorRole === 'BRAND' ? booking.brandName : booking.creatorName,
    expiresAt: agr.expiresAt,
  });

  if (session.envelopeId) {
    await setAgreementEnvelopeId({
      agreementId: agr.agreementId,
      provider: session.provider,
      providerEnvelopeId: session.envelopeId,
    });
  }

  return {
    provider: session.provider,
    envelopeId: session.envelopeId,
    signingUrl: session.signingUrl,
  };
}
