import { z } from 'zod';
import { AppProblemError } from '@adzunova/problem-details';

export const RazorpayModeSchema = z.enum(['off', 'test', 'live_probe', 'live']);
export type RazorpayMode = z.infer<typeof RazorpayModeSchema>;

const PaymentsEnvSchema = z.object({
  MONGODB_URI: z.string().min(1).optional(),
  PAYMENTS_MONGODB_DB_NAME: z.string().min(1).default('adzunova_payments'),
  REDIS_URL: z.string().min(1).optional(),
  FEATURE_BOOKINGS: z.enum(['true', 'false']).default('false'),
  FEATURE_PAYMENTS: z.enum(['true', 'false']).default('false'),
  RAZORPAY_MODE: RazorpayModeSchema.default('off'),
  RAZORPAY_LIVE_PROBE_APPROVED: z.enum(['true', 'false']).default('false'),
  RAZORPAY_LIVE_PROBE_DAILY_CAP: z.coerce.number().int().min(1).max(100).default(20),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export interface ValidatedPaymentsEnv {
  dbConfigured: boolean;
  paymentsDbName: string;
  redisConfigured: boolean;
  featureBookings: boolean;
  featurePayments: boolean;
  razorpayMode: RazorpayMode;
  liveProbeApproved: boolean;
  liveProbeDailyCap: number;
  razorpayConfigured: boolean;
  isLiveKey: boolean;
  // Never expose raw key/secret in public status objects
  getRazorpayCredentials(): { keyId: string; keySecret: string; webhookSecret?: string } | null;
}

export function loadPaymentsEnv(
  rawEnv: Record<string, string | undefined> = process.env,
  opts: { hasLiveMoneyApprovalRecord?: boolean } = {}
): ValidatedPaymentsEnv {
  const parsed = PaymentsEnvSchema.safeParse({
    MONGODB_URI: rawEnv.MONGODB_URI || undefined,
    PAYMENTS_MONGODB_DB_NAME: rawEnv.PAYMENTS_MONGODB_DB_NAME || undefined,
    REDIS_URL: rawEnv.REDIS_URL || undefined,
    FEATURE_BOOKINGS: rawEnv.FEATURE_BOOKINGS || undefined,
    FEATURE_PAYMENTS: rawEnv.FEATURE_PAYMENTS || undefined,
    RAZORPAY_MODE: rawEnv.RAZORPAY_MODE || undefined,
    RAZORPAY_LIVE_PROBE_APPROVED: rawEnv.RAZORPAY_LIVE_PROBE_APPROVED || undefined,
    RAZORPAY_LIVE_PROBE_DAILY_CAP: rawEnv.RAZORPAY_LIVE_PROBE_DAILY_CAP || undefined,
    RAZORPAY_KEY_ID: rawEnv.RAZORPAY_KEY_ID || undefined,
    RAZORPAY_KEY_SECRET: rawEnv.RAZORPAY_KEY_SECRET || undefined,
    RAZORPAY_WEBHOOK_SECRET: rawEnv.RAZORPAY_WEBHOOK_SECRET || undefined,
  });

  if (!parsed.success) {
    throw new AppProblemError({
      status: 500,
      code: 'PAYMENTS_ENV_INVALID',
      title: 'Payments Configuration Invalid',
      detail: 'Payments environment configuration failed validation',
    });
  }

  const data = parsed.data;
  const keyId = data.RAZORPAY_KEY_ID;
  const isLiveKey = Boolean(keyId && keyId.startsWith('rzp_live_'));
  const featurePayments = data.FEATURE_PAYMENTS === 'true';
  const liveProbeApproved = data.RAZORPAY_LIVE_PROBE_APPROVED === 'true';

  if (isLiveKey) {
    if (data.RAZORPAY_MODE === 'live_probe') {
      if (!liveProbeApproved) {
        throw new AppProblemError({
          status: 403,
          code: 'RAZORPAY_LIVE_KEY_REFUSED',
          title: 'Live Razorpay Key Refused',
          detail: 'rzp_live_ key requires RAZORPAY_LIVE_PROBE_APPROVED=true in live_probe mode',
        });
      }
      if (featurePayments) {
        throw new AppProblemError({
          status: 403,
          code: 'LIVE_PROBE_FEATURE_PAYMENTS_FORBIDDEN',
          title: 'FEATURE_PAYMENTS Forbidden in live_probe',
          detail: 'FEATURE_PAYMENTS must remain false while RAZORPAY_MODE=live_probe',
        });
      }
    } else if (data.RAZORPAY_MODE === 'live') {
      if (!opts.hasLiveMoneyApprovalRecord) {
        throw new AppProblemError({
          status: 403,
          code: 'RAZORPAY_LIVE_KEY_REFUSED',
          title: 'Live Razorpay Key Refused',
          detail: 'rzp_live_ key in live mode requires an audited owner-approval record',
        });
      }
    } else {
      throw new AppProblemError({
        status: 403,
        code: 'RAZORPAY_LIVE_KEY_REFUSED',
        title: 'Live Razorpay Key Refused',
        detail: `rzp_live_ key is refused when RAZORPAY_MODE=${data.RAZORPAY_MODE}`,
      });
    }
  }

  const razorpayConfigured = Boolean(data.RAZORPAY_KEY_ID && data.RAZORPAY_KEY_SECRET);

  return {
    dbConfigured: Boolean(data.MONGODB_URI),
    paymentsDbName: data.PAYMENTS_MONGODB_DB_NAME,
    redisConfigured: Boolean(data.REDIS_URL),
    featureBookings: data.FEATURE_BOOKINGS === 'true',
    featurePayments,
    razorpayMode: data.RAZORPAY_MODE,
    liveProbeApproved,
    liveProbeDailyCap: data.RAZORPAY_LIVE_PROBE_DAILY_CAP,
    razorpayConfigured,
    isLiveKey,
    getRazorpayCredentials() {
      if (!data.RAZORPAY_KEY_ID || !data.RAZORPAY_KEY_SECRET) return null;
      return {
        keyId: data.RAZORPAY_KEY_ID,
        keySecret: data.RAZORPAY_KEY_SECRET,
        webhookSecret: data.RAZORPAY_WEBHOOK_SECRET,
      };
    },
  };
}
