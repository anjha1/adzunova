import { NextResponse } from 'next/server';
import { checkPaymentsHealth, getActiveFeeConfig, isPaymentFeatureEnabled } from '@adzunova/payments-db';
import { loadPaymentsEnv } from '@/lib/payments/env';
import { toProblemDetails } from '@adzunova/problem-details';

export async function GET() {
  try {
    const env = loadPaymentsEnv();
    const dbHealth = await checkPaymentsHealth();

    if (!dbHealth.configured || !dbHealth.reachable) {
      return NextResponse.json(
        {
          ok: false,
          status: dbHealth.configured ? 'DEGRADED' : 'NOT_CONFIGURED',
          reason: dbHealth.reason ?? 'Payments database unavailable',
          featurePayments: env.featurePayments,
          razorpayMode: env.razorpayMode,
        },
        { status: dbHealth.configured ? 503 : 200 }
      );
    }

    const [activeConfig, dbFeatureFlag] = await Promise.all([
      getActiveFeeConfig(),
      isPaymentFeatureEnabled('FEATURE_PAYMENTS'),
    ]);

    return NextResponse.json({
      ok: true,
      status: 'READY',
      dbName: dbHealth.dbName,
      queueBackend: env.redisConfigured ? 'redis' : 'mongodb',
      featurePayments: env.featurePayments && dbFeatureFlag,
      razorpayMode: env.razorpayMode,
      activeFeeConfigVersion: activeConfig?.version ?? null,
    });
  } catch (err) {
    const problem = toProblemDetails(err);
    return NextResponse.json(problem, { status: problem.status });
  }
}
