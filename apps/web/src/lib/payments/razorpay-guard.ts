import { AppProblemError } from '@adzunova/problem-details';
import { consumeDailyProbeQuota } from '@adzunova/payments-db';
import type { ValidatedPaymentsEnv } from './env';

export const LIVE_PROBE_MAX_ORDER_PAISE = BigInt(10_000); // ₹100 hard cap

export type GatewayOperation =
  | 'PROBE_CREATE_UNPAID_ORDER'
  | 'PROBE_FETCH_ORDER'
  | 'PROBE_VERIFY_SIGNATURE_LOCAL'
  | 'PROBE_READ_ONLY_FETCH'
  | 'CAPTURE_PAYMENT'
  | 'REFUND'
  | 'ROUTE_TRANSFER'
  | 'VIRTUAL_ACCOUNT'
  | 'RAZORPAYX_PAYOUT'
  | 'RAZORPAYX_CONTACT'
  | 'RAZORPAYX_FUND_ACCOUNT'
  | 'WEBHOOK_REGISTER_PROD';

const ALLOWED_IN_LIVE_PROBE = new Set<GatewayOperation>([
  'PROBE_CREATE_UNPAID_ORDER',
  'PROBE_FETCH_ORDER',
  'PROBE_VERIFY_SIGNATURE_LOCAL',
  'PROBE_READ_ONLY_FETCH',
]);

export async function assertGatewayOperationAllowed(params: {
  env: ValidatedPaymentsEnv;
  operation: GatewayOperation;
  amountPaise?: bigint;
  callerContext: 'ADMIN_OR_PROBE_SCRIPT' | 'USER_REQUEST';
  consumeQuota?: boolean;
}): Promise<void> {
  const { env, operation, amountPaise, callerContext, consumeQuota = false } = params;

  if (env.razorpayMode === 'off') {
    throw new AppProblemError({
      status: 503,
      code: 'RAZORPAY_NOT_CONFIGURED',
      title: 'Payment Gateway Not Configured',
      detail: 'Payment gateway is disabled (RAZORPAY_MODE=off)',
    });
  }

  if (env.razorpayMode === 'live_probe' || env.isLiveKey) {
    if (env.razorpayMode !== 'live') {
      if (callerContext === 'USER_REQUEST') {
        throw new AppProblemError({
          status: 403,
          code: 'LIVE_PROBE_USER_PATH_FORBIDDEN',
          title: 'Live Probe Forbidden On User Path',
          detail: 'Live Razorpay keys cannot be called from any user-facing request path',
        });
      }

      if (!ALLOWED_IN_LIVE_PROBE.has(operation)) {
        throw new AppProblemError({
          status: 403,
          code: 'LIVE_PROBE_OPERATION_FORBIDDEN',
          title: 'Operation Forbidden In Live-Probe Mode',
          detail: `Operation ${operation} is strictly forbidden with live keys in live_probe mode`,
        });
      }

      if (operation === 'PROBE_CREATE_UNPAID_ORDER') {
        if (amountPaise === undefined || amountPaise <= BigInt(0) || amountPaise > LIVE_PROBE_MAX_ORDER_PAISE) {
          throw new AppProblemError({
            status: 400,
            code: 'LIVE_PROBE_AMOUNT_CAP_EXCEEDED',
            title: 'Live-Probe Amount Cap Exceeded',
            detail: `live_probe order amount must be between 1 and ${LIVE_PROBE_MAX_ORDER_PAISE.toString()} paise`,
          });
        }
      }

      if (consumeQuota) {
        const quota = await consumeDailyProbeQuota('razorpay_live_probe', env.liveProbeDailyCap);
        if (!quota.allowed) {
          throw new AppProblemError({
            status: 429,
            code: 'LIVE_PROBE_DAILY_CAP_EXCEEDED',
            title: 'Live-Probe Daily Call Cap Exceeded',
            detail: `Daily live_probe call cap (${quota.maxCallsPerDay}) reached for ${quota.dayKey}`,
          });
        }
      }
    }
  }
}
