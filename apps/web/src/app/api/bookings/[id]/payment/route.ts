import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toProblemDetails } from '@adzunova/problem-details';
import { getBookingPaymentSummary, isPaymentFeatureEnabled } from '@adzunova/payments-db';
import { loadPaymentsEnv } from '@/lib/payments/env';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user || (session.user.role !== 'BRAND' && session.user.role !== 'CREATOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const [summary, featureEnabled] = await Promise.all([
      getBookingPaymentSummary({
        bookingId: id,
        actorId: session.user.id,
        actorRole: session.user.role,
      }),
      isPaymentFeatureEnabled('FEATURE_PAYMENTS'),
    ]);
    const env = loadPaymentsEnv();

    return NextResponse.json({
      ...summary,
      featurePaymentsEnabled: featureEnabled,
      razorpayMode: env.razorpayMode,
      razorpayWebhookConfigured: env.razorpayWebhookConfigured,
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
