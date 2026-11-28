import { NextRequest, NextResponse } from 'next/server';
import { toProblemDetails } from '@adzunova/problem-details';
import { recordVerifiedAgreementSignature } from '@adzunova/payments-db';
import { getESignAdapter } from '@/lib/bookings/esign-port';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers: Record<string, string | undefined> = {};
    req.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const adapter = getESignAdapter();
    const verified = await adapter.verifyCallback({ rawBody, headers });

    const result = await recordVerifiedAgreementSignature({
      agreementId: verified.agreementId,
      bookingId: verified.bookingId,
      version: verified.version,
      pdfSha256: verified.pdfSha256,
      signerRole: verified.signerRole,
      signerId: verified.signerId,
      callbackId: verified.callbackId,
      provider: verified.provider,
      providerEnvelopeId: verified.providerEnvelopeId,
      evidence: verified.evidence,
    });

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      agreementStatus: result.agreement.status,
      bookingStatus: result.bookingStatus,
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
