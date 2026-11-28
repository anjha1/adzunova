'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PageHeader, EmptyState, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

const REJECTION_REASONS = [
  'Budget too low',
  'Timeline unavailable',
  'Category mismatch',
  'Scope unclear',
  'Other',
];

interface InboxBooking {
  bookingId: string;
  brandName: string;
  itemTitle: string;
  pricingType: 'FIXED' | 'NEGOTIABLE';
  status: string;
  quantity: number;
  deliveryDate: string;
  brief: string;
  counterRound: number;
  expiresAt: string;
  quoteSnapshot: {
    creatorNetPayout?: number;
    totalBrandPayable?: number;
    basePrice?: number;
  };
  createdAt: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<InboxBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [counteringId, setCounteringId] = useState<string | null>(null);
  const [counterDate, setCounterDate] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/creator/inbox', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load inbox');
      } else {
        setOffers(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      setErrorMsg('Network error loading inbox');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const handleAccept = async (bookingId: string) => {
    setBusyId(bookingId);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to accept offer');
        return;
      }
      setOffers((prev) => prev.map((o) => (o.bookingId === bookingId ? data.booking : o)));
    } catch {
      setErrorMsg('Network error accepting offer');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    setBusyId(bookingId);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to reject offer');
        return;
      }
      setOffers((prev) => prev.map((o) => (o.bookingId === bookingId ? data.booking : o)));
      setRejectingId(null);
    } catch {
      setErrorMsg('Network error rejecting offer');
    } finally {
      setBusyId(null);
    }
  };

  const handleCounter = async (offer: InboxBooking) => {
    setBusyId(offer.bookingId);
    setErrorMsg(null);
    try {
      const payload: Record<string, unknown> = {
        deliveryDate: counterDate || offer.deliveryDate,
        note: counterNote.trim() || undefined,
      };
      if (offer.pricingType === 'NEGOTIABLE' && counterPrice.trim()) {
        payload.proposedPriceInr = Number(counterPrice);
      }

      const res = await fetch(`/api/bookings/${encodeURIComponent(offer.bookingId)}/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to submit counter offer');
        return;
      }
      setOffers((prev) => prev.map((o) => (o.bookingId === offer.bookingId ? data.booking : o)));
      setCounteringId(null);
      setCounterPrice('');
      setCounterNote('');
    } catch {
      setErrorMsg('Network error submitting counter');
    } finally {
      setBusyId(null);
    }
  };

  const newCount = offers.filter((o) => o.status === 'REQUESTED').length;
  const negotiatingCount = offers.filter((o) => o.status === 'COUNTERED').length;
  const acceptedCount = offers.filter((o) => o.status === 'ACCEPTED').length;
  const avgVal =
    offers.length > 0
      ? Math.round(
          offers.reduce((acc, o) => acc + Number(o.quoteSnapshot?.creatorNetPayout ?? 0), 0) /
            offers.length
        )
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Offers & Deal Inbox"
        description="Review inbound brand sponsorships, submit counter-proposals, and accept verified bookings."
      />

      {errorMsg && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 desk:grid-cols-4 gap-4">
        <StatCard
          label="New Offers"
          value={newCount}
          subValue="Awaiting your response"
          icon={<ShellIcon name="Inbox" size={16} />}
        />
        <StatCard
          label="Negotiating"
          value={negotiatingCount}
          subValue="Counter-offers sent"
          icon={<ShellIcon name="MessageSquare" size={16} />}
        />
        <StatCard
          label="Accepted Deals"
          value={acceptedCount}
          subValue="Confirmed bookings"
          icon={<ShellIcon name="CheckCircle" size={16} />}
        />
        <StatCard
          label="Avg Net Payout"
          value={`₹${avgVal.toLocaleString('en-IN')}`}
          subValue="Across all requests"
          icon={<ShellIcon name="Tag" size={16} />}
        />
      </div>

      {loading ? (
        <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
          Loading inbox...
        </div>
      ) : offers.length === 0 ? (
        <EmptyState
          icon={<ShellIcon name="Inbox" size={28} className="text-indigo-600 dark:text-indigo-400" />}
          title="No Sponsorship Offers Yet"
          description="Inbound deal proposals from brands will appear here with brief details, budget breakdowns, and accept/counter buttons."
          actionText="Publish Rate Card"
          actionHref="/creator/rate-card"
          secondaryActionText="Edit Public Profile"
          secondaryActionHref="/creator/profile"
        />
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const canRespond = offer.status === 'REQUESTED' || offer.status === 'COUNTERED';
            return (
              <div
                key={offer.bookingId}
                className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{offer.itemTitle}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-foreground">
                        {offer.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{offer.pricingType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {`Brand: ${offer.brandName} · Qty ${offer.quantity} · Delivery ${offer.deliveryDate}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {`₹${Number(offer.quoteSnapshot?.creatorNetPayout ?? 0).toLocaleString('en-IN')}`}
                    </div>
                    <div className="text-[11px] text-muted-foreground">Estimated Net Payout</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border">
                  {offer.brief}
                </p>

                {offer.status === 'ACCEPTED' && (
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Accepted. Agreement step is not enabled yet.
                  </div>
                )}

                {canRespond && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      disabled={busyId === offer.bookingId}
                      onClick={() => void handleAccept(offer.bookingId)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 !text-white text-xs font-bold"
                    >
                      Accept
                    </button>
                    {offer.counterRound < 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCounteringId(
                            counteringId === offer.bookingId ? null : offer.bookingId
                          );
                          setCounterDate(offer.deliveryDate);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        {`Counter (${offer.counterRound} used)`}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setRejectingId(rejectingId === offer.bookingId ? null : offer.bookingId)
                      }
                      className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {rejectingId === offer.bookingId && (
                  <div className="p-3 rounded-xl border border-border bg-muted/40 flex flex-wrap items-center gap-2">
                    <select
                      aria-label="Decline reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                    >
                      {REJECTION_REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={busyId === offer.bookingId}
                      onClick={() => void handleReject(offer.bookingId)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 !text-white text-xs font-bold"
                    >
                      Confirm Decline
                    </button>
                  </div>
                )}

                {counteringId === offer.bookingId && (
                  <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">
                          Proposed Delivery Date
                        </label>
                        <input
                          aria-label="Proposed Delivery Date"
                          type="date"
                          value={counterDate}
                          onChange={(e) => setCounterDate(e.target.value)}
                          className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                        />
                      </div>
                      {offer.pricingType === 'NEGOTIABLE' ? (
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Proposed Base Price (INR)
                          </label>
                          <input
                            aria-label="Proposed Base Price (INR)"
                            type="number"
                            min={1}
                            placeholder={String(offer.quoteSnapshot?.basePrice ?? '')}
                            value={counterPrice}
                            onChange={(e) => setCounterPrice(e.target.value)}
                            className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground flex items-end pb-1">
                          Fixed-price item: dates/add-ons only.
                        </div>
                      )}
                    </div>
                    <input
                      aria-label="Counter note (optional)"
                      type="text"
                      placeholder="Counter note (optional)"
                      value={counterNote}
                      onChange={(e) => setCounterNote(e.target.value)}
                      className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
                    />
                    <button
                      type="button"
                      disabled={busyId === offer.bookingId}
                      onClick={() => void handleCounter(offer)}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 !text-white text-xs font-bold"
                    >
                      Send Counter Offer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
