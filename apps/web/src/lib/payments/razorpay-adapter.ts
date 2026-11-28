import crypto from 'node:crypto';
import { AppProblemError, scrubSecrets } from '@adzunova/problem-details';
import { loadPaymentsEnv, type ValidatedPaymentsEnv } from './env';
import { assertGatewayOperationAllowed } from './razorpay-guard';

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentGatewayPort {
  createOrder(input: {
    amountPaise: bigint;
    currency: string;
    receipt: string;
    notes: Record<string, string>;
  }): Promise<RazorpayOrderResult>;
  fetchOrder(orderId: string): Promise<RazorpayOrderResult>;
  verifyCheckoutSignature(input: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean;
  verifyWebhookSignature(input: { rawBody: string; signature: string }): boolean;
}

export class RazorpayGatewayAdapter implements PaymentGatewayPort {
  private readonly env: ValidatedPaymentsEnv;

  constructor(rawEnv: Record<string, string | undefined> = process.env) {
    this.env = loadPaymentsEnv(rawEnv);
  }

  private getTestCredentials(): { keyId: string; keySecret: string; webhookSecret?: string } {
    if (this.env.razorpayMode !== 'test') {
      throw new AppProblemError({
        status: 503,
        code: 'RAZORPAY_TEST_MODE_REQUIRED',
        title: 'Payment Gateway Disabled',
        detail: `Checkout requires RAZORPAY_MODE=test (current: ${this.env.razorpayMode}).`,
      });
    }
    if (this.env.isLiveKey) {
      throw new AppProblemError({
        status: 403,
        code: 'RAZORPAY_LIVE_KEY_REFUSED',
        title: 'Live Key Refused',
        detail: 'Live Razorpay keys are strictly forbidden on checkout paths.',
      });
    }
    const creds = this.env.getRazorpayCredentials();
    if (!creds || !creds.keyId.startsWith('rzp_test_')) {
      throw new AppProblemError({
        status: 503,
        code: 'RAZORPAY_NOT_CONFIGURED',
        title: 'Razorpay Test Keys Missing',
        detail: 'Valid rzp_test_* credentials are required for test-mode checkout.',
      });
    }
    return creds;
  }

  async createOrder(input: {
    amountPaise: bigint;
    currency: string;
    receipt: string;
    notes: Record<string, string>;
  }): Promise<RazorpayOrderResult> {
    await assertGatewayOperationAllowed({
      env: this.env,
      operation: 'PROBE_CREATE_UNPAID_ORDER',
      amountPaise: input.amountPaise,
      callerContext: 'USER_REQUEST',
    });

    const creds = this.getTestCredentials();
    const auth = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(input.amountPaise),
          currency: input.currency,
          receipt: input.receipt.slice(0, 40),
          notes: input.notes,
        }),
        signal: controller.signal,
      });

      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        const errObj = data.error as Record<string, unknown> | undefined;
        throw new AppProblemError({
          status: res.status >= 500 ? 502 : 400,
          code: 'RAZORPAY_ORDER_FAILED',
          title: 'Razorpay Order Creation Failed',
          detail: scrubSecrets(String(errObj?.description || 'Failed to create Razorpay order')),
        });
      }

      return {
        id: String(data.id),
        amount: Number(data.amount),
        currency: String(data.currency),
        receipt: String(data.receipt || input.receipt),
        status: String(data.status || 'created'),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  async fetchOrder(orderId: string): Promise<RazorpayOrderResult> {
    const creds = this.getTestCredentials();
    const auth = `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')}`;
    const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: { Authorization: auth },
    });
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      throw new AppProblemError({
        status: 502,
        code: 'RAZORPAY_FETCH_ORDER_FAILED',
        title: 'Razorpay Order Fetch Failed',
        detail: 'Unable to fetch order status from Razorpay.',
      });
    }
    return {
      id: String(data.id),
      amount: Number(data.amount),
      currency: String(data.currency),
      receipt: String(data.receipt || ''),
      status: String(data.status || ''),
    };
  }

  verifyCheckoutSignature(input: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const creds = this.getTestCredentials();
    const expected = crypto
      .createHmac('sha256', creds.keySecret)
      .update(`${input.orderId}|${input.paymentId}`)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(input.signature.trim(), 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  verifyWebhookSignature(input: { rawBody: string; signature: string }): boolean {
    const creds = this.getTestCredentials();
    if (!creds.webhookSecret) {
      throw new AppProblemError({
        status: 503,
        code: 'RAZORPAY_WEBHOOK_NOT_CONFIGURED',
        title: 'Webhook Secret Not Configured',
        detail: 'RAZORPAY_WEBHOOK_SECRET is not configured.',
      });
    }
    const expected = crypto
      .createHmac('sha256', creds.webhookSecret)
      .update(input.rawBody)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(input.signature.trim(), 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
}
