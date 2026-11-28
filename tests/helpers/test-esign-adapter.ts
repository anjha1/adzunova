import crypto from 'node:crypto';
import type {
  ESignPort,
  ESignSessionInput,
  ESignSessionResult,
  VerifiedESignCallback,
} from '../../apps/web/src/lib/bookings/esign-port';

/**
 * Test-only simulated E-Sign adapter. Never imported by production code.
 */
export class TestESignAdapter implements ESignPort {
  public readonly providerName = 'TEST_ESIGN_SANDBOX';
  private readonly secret: string;

  constructor(secret = 'test_esign_hmac_secret_do_not_use_in_prod') {
    this.secret = secret;
  }

  isConfigured(): boolean {
    return true;
  }

  async createSigningSession(input: ESignSessionInput): Promise<ESignSessionResult> {
    const envelopeId = `env_test_${input.agreementId}_v${input.version}`;
    return {
      provider: this.providerName,
      envelopeId,
      signingUrl: `https://sandbox.esign.test/sign/${envelopeId}?role=${input.signerRole}`,
      status: 'CREATED',
    };
  }

  buildSignedCallback(payload: {
    callbackId: string;
    agreementId: string;
    bookingId: string;
    version: number;
    pdfSha256: string;
    signerRole: 'BRAND' | 'CREATOR';
    signerId: string;
  }): { rawBody: string; headers: Record<string, string> } {
    const rawBody = JSON.stringify({
      ...payload,
      providerEnvelopeId: `env_test_${payload.agreementId}_v${payload.version}`,
      signedAt: new Date().toISOString(),
    });
    const sig = crypto.createHmac('sha256', this.secret).update(rawBody).digest('hex');
    return {
      rawBody,
      headers: { 'x-test-esign-signature': sig },
    };
  }

  async verifyCallback(input: {
    rawBody: string;
    headers: Record<string, string | undefined>;
  }): Promise<VerifiedESignCallback> {
    const sig = input.headers['x-test-esign-signature'] || '';
    const expected = crypto.createHmac('sha256', this.secret).update(input.rawBody).digest('hex');
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new Error('Invalid test e-sign webhook signature');
    }
    const parsed = JSON.parse(input.rawBody) as {
      callbackId: string;
      providerEnvelopeId?: string;
      agreementId: string;
      bookingId: string;
      version: number;
      pdfSha256: string;
      signerRole: 'BRAND' | 'CREATOR';
      signerId: string;
      signedAt: string;
    };
    return {
      callbackId: parsed.callbackId,
      provider: this.providerName,
      providerEnvelopeId: parsed.providerEnvelopeId ?? null,
      agreementId: parsed.agreementId,
      bookingId: parsed.bookingId,
      version: parsed.version,
      pdfSha256: parsed.pdfSha256,
      signerRole: parsed.signerRole,
      signerId: parsed.signerId,
      evidence: {
        method: 'TEST_HMAC_CALLBACK',
        signedAt: parsed.signedAt,
        signatureVerified: true,
      },
    };
  }
}
