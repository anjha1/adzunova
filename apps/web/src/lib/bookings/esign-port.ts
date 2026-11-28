import { AppProblemError } from '@adzunova/problem-details';
import { loadPaymentsEnv } from '../payments/env';

export interface ESignSessionInput {
  agreementId: string;
  bookingId: string;
  version: number;
  pdfSha256: string;
  signerRole: 'BRAND' | 'CREATOR';
  signerId: string;
  signerName: string;
  expiresAt: string;
}

export interface ESignSessionResult {
  provider: string;
  envelopeId: string;
  signingUrl: string | null;
  status: 'CREATED' | 'NOT_CONFIGURED';
}

export interface VerifiedESignCallback {
  callbackId: string;
  provider: string;
  providerEnvelopeId: string | null;
  agreementId: string;
  bookingId: string;
  version: number;
  pdfSha256: string;
  signerRole: 'BRAND' | 'CREATOR';
  signerId: string;
  evidence: Record<string, unknown>;
  signedPdfBytes?: Buffer | null;
}

export interface ESignPort {
  readonly providerName: string;
  isConfigured(): boolean;
  createSigningSession(input: ESignSessionInput): Promise<ESignSessionResult>;
  verifyCallback(input: {
    rawBody: string;
    headers: Record<string, string | undefined>;
  }): Promise<VerifiedESignCallback>;
}

export class UnconfiguredESignAdapter implements ESignPort {
  public readonly providerName = 'UNCONFIGURED';

  isConfigured(): boolean {
    return false;
  }

  async createSigningSession(): Promise<ESignSessionResult> {
    throw new AppProblemError({
      status: 503,
      code: 'ESIGN_NOT_CONFIGURED',
      title: 'E-sign not configured',
      detail: 'E-sign not configured: no approved e-sign provider credentials are set.',
    });
  }

  async verifyCallback(): Promise<VerifiedESignCallback> {
    throw new AppProblemError({
      status: 503,
      code: 'ESIGN_NOT_CONFIGURED',
      title: 'E-sign not configured',
      detail: 'E-sign not configured: cannot verify provider callback.',
    });
  }
}

export function getESignAdapter(
  rawEnv: Record<string, string | undefined> = process.env
): ESignPort {
  const env = loadPaymentsEnv(rawEnv);
  if (!env.esignConfigured) {
    return new UnconfiguredESignAdapter();
  }
  // No external e-sign provider has been approved/onboarded yet; fail closed.
  return new UnconfiguredESignAdapter();
}
