import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AppProblemError, toProblemDetails } from '@adzunova/problem-details';
import { markAttemptVerificationPending } from '@adzunova/payments-db';
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
    const { id } = await context.params;
    const body = (await req.json()) as Record<string, unknown>;
    const orderId = String(body.razorpay_order_id ?? '').trim();
    const paymentId = String(body.razorpay_payment_id ?? '').trim();
    const signature = String(body.razorpay_signature ?? '').trim();

    if (!orderId || !paymentId || !signature) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_CHECKOUT_CALLBACK',
        title: 'Invalid Checkout Response',
        detail: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
      });
    }

    const gateway = new RazorpayGatewayAdapter();
    const valid = gateway.verifyCheckoutSignature({ orderId, paymentId, signature });
    if (!valid) {
      throw new AppProblemError({
        status: 400,
        code: 'INVALID_CHECKOUT_SIGNATURE',
        title: 'Invalid Payment Signature',
        detail: 'Checkout signature verification failed.',
      });
    }

    // Never unlock creator work or post to ledger from browser callback; mark verification pending only
    const attempt = await markAttemptVerificationPending({
      bookingId: id,
      brandId: session.user.id,
      providerOrderId: orderId,
      providerPaymentId: paymentId,
    });

    return NextResponse.json({
      attempt,
      message: 'Payment verification pending. Awaiting verified provider webhook.',
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
