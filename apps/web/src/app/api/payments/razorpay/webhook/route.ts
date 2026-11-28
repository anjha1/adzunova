import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { AppProblemError, toProblemDetails } from '@adzunova/problem-details';
import { processVerifiedPaymentWebhook } from '@adzunova/payments-db';
import { RazorpayGatewayAdapter } from '@/lib/payments/razorpay-adapter';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    if (!signature) {
      throw new AppProblemError({
        status: 400,
        code: 'MISSING_WEBHOOK_SIGNATURE',
        title: 'Missing Webhook Signature',
        detail: 'x-razorpay-signature header is required.',
      });
    }

    const gateway = new RazorpayGatewayAdapter();
    const valid = gateway.verifyWebhookSignature({ rawBody, signature });
    if (!valid) {
      throw new AppProblemError({
        status: 401,
        code: 'INVALID_WEBHOOK_SIGNATURE',
        title: 'Invalid Webhook Signature',
        detail: 'Razorpay webhook signature verification failed.',
      });
    }

    const payload = JSON.parse(rawBody) as Record<string, unknown>;
    const eventType = String(payload.event || '');
    const payloadObj = payload.payload as Record<string, unknown> | undefined;
    const paymentEntity = (payloadObj?.payment as Record<string, unknown> | undefined)?.entity as
      | Record<string, unknown>
      | undefined;
    const orderEntity = (payloadObj?.order as Record<string, unknown> | undefined)?.entity as
      | Record<string, unknown>
      | undefined;

    if (eventType !== 'payment.captured' && eventType !== 'order.paid') {
      return NextResponse.json({ ok: true, outcome: 'IGNORED', eventType });
    }

    const paymentId = String(paymentEntity?.id || '');
    const orderId = String(paymentEntity?.order_id || orderEntity?.id || '');
    const amountPaise = BigInt(String(paymentEntity?.amount ?? orderEntity?.amount_paid ?? 0));
    const currency = String(paymentEntity?.currency || orderEntity?.currency || 'INR');
    const providerStatus = String(paymentEntity?.status || orderEntity?.status || '');
    const eventId =
      req.headers.get('x-razorpay-event-id') ||
      `rzp_${eventType}_${orderId}_${paymentId}`;
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

    const result = await processVerifiedPaymentWebhook({
      eventId,
      eventType,
      orderId,
      paymentId,
      amountPaise,
      currency,
      providerStatus,
      payloadHash,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
