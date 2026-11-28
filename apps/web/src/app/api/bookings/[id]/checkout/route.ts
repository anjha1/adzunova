import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AppProblemError, toProblemDetails } from '@adzunova/problem-details';
import {
  attachProviderOrderToAttempt,
  beginOrReusePaymentAttempt,
  isPaymentFeatureEnabled,
} from '@adzunova/payments-db';
import { loadPaymentsEnv } from '@/lib/payments/env';
import { RazorpayGatewayAdapter } from '@/lib/payments/razorpay-adapter';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== 'BRAND') {
    return NextResponse.json({ error: 'Unauthorized: Brand session required' }, { status: 401 });
  }

  try {
    const enabled = await isPaymentFeatureEnabled('FEATURE_PAYMENTS');
    if (!enabled) {
      throw new AppProblemError({
        status: 503,
        code: 'FEATURE_PAYMENTS_DISABLED',
        title: 'Payments Disabled',
        detail: 'Payment checkout is not enabled yet (FEATURE_PAYMENTS=false).',
      });
    }

    const { id } = await context.params;
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const idempotencyKey =
      req.headers.get('idempotency-key') ||
      (typeof body.idempotencyKey === 'string' ? body.idempotencyKey : undefined);

    // Server computes amountPaise & currency strictly from immutable accepted quote; client inputs ignored
    const { attempt, reused } = await beginOrReusePaymentAttempt({
      bookingId: id,
      brandId: session.user.id,
      idempotencyKey,
    });

    const env = loadPaymentsEnv();
    let finalAttempt = attempt;

    if (!finalAttempt.providerOrderId) {
      const gateway = new RazorpayGatewayAdapter();
      const order = await gateway.createOrder({
        amountPaise: BigInt(finalAttempt.amountPaise),
        currency: finalAttempt.currency,
        receipt: finalAttempt.attemptId,
        notes: {
          bookingId: id,
          attemptId: finalAttempt.attemptId,
          agreementId: finalAttempt.agreementId,
        },
      });
      finalAttempt = await attachProviderOrderToAttempt({
        attemptId: finalAttempt.attemptId,
        bookingId: id,
        providerOrderId: order.id,
        actorId: session.user.id,
      });
    }

    return NextResponse.json(
      {
        attempt: finalAttempt,
        reused,
        publicKeyId: env.razorpayPublicKeyId,
        order: {
          id: finalAttempt.providerOrderId,
          amountPaise: finalAttempt.amountPaise,
          currency: finalAttempt.currency,
        },
      },
      { status: reused ? 200 : 201 }
    );
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
