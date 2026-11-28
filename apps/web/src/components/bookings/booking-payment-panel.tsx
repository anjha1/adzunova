'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface PaymentSummary {
  bookingStatus: string;
  latestAttempt: {
    attemptId: string;
    providerOrderId: string | null;
    providerPaymentId: string | null;
    amountPaise: string;
    currency: string;
    status: string;
    receiptNumber: string | null;
    lastError: string | null;
  } | null;
  receiptNumber: string | null;
  taxInvoiceStatus: string;
  holdNote: string;
  featurePaymentsEnabled: boolean;
  razorpayMode: string;
}

interface BookingPaymentPanelProps {
  bookingId: string;
  bookingStatus: string;
  viewerRole: 'BRAND' | 'CREATOR';
  onStatusUpdated?: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (resp: Record<string, unknown>) => void) => void;
    };
  }
}

function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BookingPaymentPanel({
  bookingId,
  bookingStatus,
  viewerRole,
  onStatusUpdated,
}: BookingPaymentPanelProps) {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const shouldRender =
    bookingStatus === 'SIGNED' ||
    bookingStatus === 'PAYMENT_PENDING' ||
    bookingStatus === 'FUNDS_SECURED';

  const loadSummary = useCallback(async () => {
    if (!shouldRender) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/payment`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load payment status');
      } else {
        setSummary(data as PaymentSummary);
      }
    } catch {
      setErrorMsg('Network error loading payment status');
    } finally {
      setLoading(false);
    }
  }, [bookingId, shouldRender]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary, bookingStatus]);

  if (!shouldRender) return null;

  const handlePayNow = async () => {
    setBusy(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Could not start checkout');
        return;
      }

      const loaded = await loadRazorpayCheckoutScript();
      if (!loaded || !window.Razorpay || !data.publicKeyId) {
        setErrorMsg('Razorpay Checkout script or public key unavailable.');
        await loadSummary();
        return;
      }

      const rzp = new window.Razorpay({
        key: data.publicKeyId,
        amount: data.order.amountPaise,
        currency: data.order.currency,
        name: 'Adzunova (Test Mode)',
        description: `Booking ${bookingId}`,
        order_id: data.order.id,
        handler: async (response: Record<string, unknown>) => {
          await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/checkout/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          await loadSummary();
          onStatusUpdated?.();
        },
        modal: {
          ondismiss: async () => {
            await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/checkout/cancel`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                attemptId: data.attempt?.attemptId,
                status: 'CANCELLED',
                reason: 'Checkout dismissed by user',
              }),
            });
            await loadSummary();
          },
        },
      });
      rzp.on('payment.failed', async () => {
        await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/checkout/cancel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId: data.attempt?.attemptId,
            status: 'FAILED',
            reason: 'Razorpay checkout reported failure',
          }),
        });
        await loadSummary();
      });
      rzp.open();
    } catch {
      setErrorMsg('Network error starting payment checkout');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="text-xs text-muted-foreground">Loading payment status...</div>;
  }

  if (!summary) return null;

  if (!summary.featurePaymentsEnabled && bookingStatus === 'SIGNED') {
    return (
      <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
        Agreement signed. Payment is not enabled yet.
      </div>
    );
  }

  const attemptStatus = summary.latestAttempt?.status;
  const isCapturedHoldPending =
    attemptStatus === 'CAPTURED' && bookingStatus !== 'FUNDS_SECURED';

  return (
    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2.5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-foreground">Payment &amp; Funds Status</span>
        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-card text-foreground">
          {bookingStatus === 'FUNDS_SECURED'
            ? 'FUNDS_SECURED'
            : isCapturedHoldPending
              ? 'CAPTURED_NO_ROUTE'
              : attemptStatus === 'VERIFICATION_PENDING'
                ? 'Payment verification pending.'
                : bookingStatus}
        </span>
      </div>

      {errorMsg && (
        <div className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {bookingStatus === 'FUNDS_SECURED' ? (
        <div className="space-y-1.5">
          <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
            {summary.holdNote}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {`Payment Receipt: ${summary.receiptNumber ?? 'Issued'} · Tax Invoice: ${summary.taxInvoiceStatus} (pending approved tax config)`}
          </div>
        </div>
      ) : isCapturedHoldPending ? (
        <div className="space-y-1.5">
          <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
            Payment received. Funds protection is pending.
          </div>
          <div className="text-[11px] text-muted-foreground">
            {`Payment Receipt: ${summary.receiptNumber ?? 'Issued'} · Tax Invoice: ${summary.taxInvoiceStatus} (pending approved tax config) · Creator work blocked until funds protection is verified.`}
          </div>
        </div>
      ) : attemptStatus === 'VERIFICATION_PENDING' ? (
        <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
          Payment verification pending. Creator work unlocks only after verified webhook confirmation.
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-muted-foreground">
            {viewerRole === 'BRAND'
              ? 'Agreement signed. Proceed to Razorpay test-mode checkout to fund this booking.'
              : 'Agreement signed. Awaiting brand payment verification.'}
          </span>
          {viewerRole === 'BRAND' && summary.featurePaymentsEnabled && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handlePayNow()}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 !text-white text-xs font-bold"
            >
              {busy ? 'Opening Checkout...' : attemptStatus === 'FAILED' || attemptStatus === 'CANCELLED' ? 'Retry Payment' : 'Pay Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
