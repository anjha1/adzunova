import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeAddonPaise,
  computeBookingQuote,
  serializeBookingQuote,
  roundHalfUpBps,
  parseMoney,
  serializeMoney,
  formatInrFromPaise,
} from '../../packages/money/src/index.ts';
import {
  AppProblemError,
  scrubSecrets,
  toProblemDetails,
} from '../../packages/problem-details/src/index.ts';
import { loadPaymentsEnv } from '../../apps/web/src/lib/payments/env.ts';
import {
  assertGatewayOperationAllowed,
  LIVE_PROBE_MAX_ORDER_PAISE,
} from '../../apps/web/src/lib/payments/razorpay-guard.ts';

test('Money: Spec §3.3 example calculates exact integer paise without floats', () => {
  const quote = computeBookingQuote({
    basePricePaise: 2_500_000n, // ₹25,000
    addonsPaise: [500_000n], // ₹5,000
    brandFeeBps: 500, // 5%
    creatorFeeBps: 500, // 5%
    gstBps: 1800, // 18%
    tdsBps: 0,
  });

  assert.equal(quote.deliverableTotalPaise, 3_000_000n);
  assert.equal(quote.brandFeePaise, 150_000n);
  assert.equal(quote.taxableValuePaise, 3_150_000n);
  assert.equal(quote.gstPaise, 567_000n);
  assert.equal(quote.brandTotalPayablePaise, 3_717_000n);
  assert.equal(quote.creatorFeePaise, 150_000n);
  assert.equal(quote.creatorNetPayoutPaise, 2_850_000n);
  assert.equal(quote.platformRevenuePaise, 300_000n);

  const dto = serializeBookingQuote(quote);
  assert.equal(dto.brandTotalPayablePaise, '3717000');
  assert.equal(JSON.parse(JSON.stringify(dto)).creatorNetPayoutPaise, '2850000');
});

test('Money: computeAddonPaise and quantity scaling work with zero float drift', () => {
  const base = 2_500_000n;
  assert.equal(computeAddonPaise(base, 'PERCENT_OF_BASE', 20), 500_000n);
  assert.equal(computeAddonPaise(base, 'FIXED', 1500), 150_000n);

  const q2 = computeBookingQuote({
    basePricePaise: base,
    addonsPaise: [computeAddonPaise(base, 'PERCENT_OF_BASE', 20)],
    quantity: 2,
    brandFeeBps: 500,
    creatorFeeBps: 500,
    gstBps: 1800,
    tdsBps: 0,
  });
  assert.equal(q2.basePricePaise, 5_000_000n);
  assert.equal(q2.addonsTotalPaise, 1_000_000n);
  assert.equal(q2.deliverableTotalPaise, 6_000_000n);
  assert.equal(q2.brandFeePaise, 300_000n);
  assert.equal(q2.taxableValuePaise, 6_300_000n);
  assert.equal(q2.gstPaise, 1_134_000n);
  assert.equal(q2.brandTotalPayablePaise, 7_434_000n);
  assert.equal(q2.creatorNetPayoutPaise, 5_700_000n);
});

test('Money: roundHalfUpBps rounds .5 up and rejects invalid bps/floats', () => {
  // 100 paise * 50 bps (0.5%) = 0.5 -> rounds half up to 1n
  assert.equal(roundHalfUpBps(100n, 50), 1n);
  // 100 paise * 49 bps = 0.49 -> rounds to 0n
  assert.equal(roundHalfUpBps(100n, 49), 0n);
  assert.equal(parseMoney('3717000'), 3717000n);
  assert.equal(serializeMoney(3717000n), '3717000');
  assert.equal(formatInrFromPaise(3717000n), '₹37170');
  assert.equal(formatInrFromPaise(105n), '₹1.05');
  assert.throws(() => parseMoney(12.34), RangeError);
});

test('ProblemDetails: scrubs Razorpay keys, Mongo URIs, and PANs', () => {
  const dirty =
    'Failed connecting to mongodb+srv://admin:pass@cluster.mongodb.net/db with rzp_live_AbCdEf123456 and PAN ABCDE1234F';
  const scrubbed = scrubSecrets(dirty);
  assert.equal(scrubbed.includes('rzp_live_AbCdEf123456'), false);
  assert.equal(scrubbed.includes('admin:pass'), false);
  assert.equal(scrubbed.includes('ABCDE1234F'), false);

  const err = new AppProblemError({
    status: 403,
    code: 'FORBIDDEN_ACTION',
    title: 'Forbidden',
    detail: dirty,
  });
  const problem = toProblemDetails(err, 'req_123');
  assert.equal(problem.status, 403);
  assert.equal(problem.requestId, 'req_123');
  assert.equal(problem.detail.includes('rzp_live_'), false);
});

test('Env & Live-Probe Guard: refuses rzp_live_ outside approved live_probe or audited live mode', () => {
  assert.throws(
    () =>
      loadPaymentsEnv({
        RAZORPAY_MODE: 'test',
        RAZORPAY_KEY_ID: 'rzp_live_1234567890',
        RAZORPAY_KEY_SECRET: 'secret_abc',
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'RAZORPAY_LIVE_KEY_REFUSED'
  );

  assert.throws(
    () =>
      loadPaymentsEnv({
        RAZORPAY_MODE: 'live_probe',
        RAZORPAY_LIVE_PROBE_APPROVED: 'false',
        RAZORPAY_KEY_ID: 'rzp_live_1234567890',
        RAZORPAY_KEY_SECRET: 'secret_abc',
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'RAZORPAY_LIVE_KEY_REFUSED'
  );

  assert.throws(
    () =>
      loadPaymentsEnv({
        RAZORPAY_MODE: 'live_probe',
        RAZORPAY_LIVE_PROBE_APPROVED: 'true',
        FEATURE_PAYMENTS: 'true',
        RAZORPAY_KEY_ID: 'rzp_live_1234567890',
        RAZORPAY_KEY_SECRET: 'secret_abc',
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'LIVE_PROBE_FEATURE_PAYMENTS_FORBIDDEN'
  );

  const validProbeEnv = loadPaymentsEnv({
    RAZORPAY_MODE: 'live_probe',
    RAZORPAY_LIVE_PROBE_APPROVED: 'true',
    FEATURE_PAYMENTS: 'false',
    RAZORPAY_KEY_ID: 'rzp_live_1234567890',
    RAZORPAY_KEY_SECRET: 'secret_abc',
  });
  assert.equal(validProbeEnv.razorpayMode, 'live_probe');
  assert.equal(validProbeEnv.featurePayments, false);
});

test('Live-Probe Guard: blocks capture, refund, route, payout, user paths, and >10000 paise orders', async () => {
  const probeEnv = loadPaymentsEnv({
    RAZORPAY_MODE: 'live_probe',
    RAZORPAY_LIVE_PROBE_APPROVED: 'true',
    FEATURE_PAYMENTS: 'false',
    RAZORPAY_KEY_ID: 'rzp_live_1234567890',
    RAZORPAY_KEY_SECRET: 'secret_abc',
  });

  // Allowed read/probe operations under cap
  await assertGatewayOperationAllowed({
    env: probeEnv,
    operation: 'PROBE_CREATE_UNPAID_ORDER',
    amountPaise: 100n,
    callerContext: 'ADMIN_OR_PROBE_SCRIPT',
  });

  // Exceeds 10000 paise cap
  await assert.rejects(
    () =>
      assertGatewayOperationAllowed({
        env: probeEnv,
        operation: 'PROBE_CREATE_UNPAID_ORDER',
        amountPaise: LIVE_PROBE_MAX_ORDER_PAISE + 1n,
        callerContext: 'ADMIN_OR_PROBE_SCRIPT',
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'LIVE_PROBE_AMOUNT_CAP_EXCEEDED'
  );

  // User-facing request path forbidden
  await assert.rejects(
    () =>
      assertGatewayOperationAllowed({
        env: probeEnv,
        operation: 'PROBE_CREATE_UNPAID_ORDER',
        amountPaise: 100n,
        callerContext: 'USER_REQUEST',
      }),
    (err) => err?.name === 'AppProblemError' && err?.code === 'LIVE_PROBE_USER_PATH_FORBIDDEN'
  );

  // All money-moving / forbidden operations throw
  for (const op of [
    'CAPTURE_PAYMENT',
    'REFUND',
    'ROUTE_TRANSFER',
    'VIRTUAL_ACCOUNT',
    'RAZORPAYX_PAYOUT',
    'RAZORPAYX_CONTACT',
    'RAZORPAYX_FUND_ACCOUNT',
    'WEBHOOK_REGISTER_PROD',
  ]) {
    await assert.rejects(
      () =>
        assertGatewayOperationAllowed({
          env: probeEnv,
          operation: op,
          callerContext: 'ADMIN_OR_PROBE_SCRIPT',
        }),
      (err) => err?.name === 'AppProblemError' && err?.code === 'LIVE_PROBE_OPERATION_FORBIDDEN'
    );
  }
});
