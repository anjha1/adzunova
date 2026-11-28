'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BrandPageContainer, BrandEmptyState } from '@/components/brand/shell/brand-page-container';

interface BookingItem {
  bookingId: string;
  creatorName: string;
  creatorSlug: string | null;
  itemTitle: string;
  itemKind: string;
  pricingType: string;
  status: string;
  quantity: number;
  deliveryDate: string;
  brief: string;
  counterRound: number;
  rejectionReason: string | null;
  expiresAt: string;
  quoteSnapshot: {
    basePrice?: number;
    addonsTotal?: number;
    brandFeeAmount?: number;
    gstAmount?: number;
    totalBrandPayable?: number;
  };
  createdAt: string;
}

interface BookingEventItem {
  eventId: string;
  eventType: string;
  actorRole: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  createdAt: string;
}

export default function BrandOffersPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Record<string, BookingEventItem[]>>({});

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/bookings', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load offers');
      } else {
        setBookings(Array.isArray(data.items) ? data.items : []);
      }
    } catch {
      setErrorMsg('Network error loading offers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const loadTimeline = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.events)) {
        setSelectedEvents((prev) => ({ ...prev, [bookingId]: data.events }));
      }
    } catch {
      // ignore
    }
  };

  const handleCancel = async (bookingId: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Withdrawn by brand' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to cancel request');
        return;
      }
      setBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? data.booking : b)));
    } catch {
      setErrorMsg('Network error cancelling request');
    }
  };

  return (
    <BrandPageContainer
      title="Offers & Bookings"
      category="WORK"
      description="Track sent collaboration requests, counter-offers, and acceptance status"
      iconName="Inbox"
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
          Loading booking requests...
        </div>
      ) : bookings.length === 0 ? (
        <BrandEmptyState
          title="No Pending Offers"
          description="Direct booking requests and formal creator proposals with deliverable terms will appear here."
          iconName="Inbox"
          actionLabel="Discover Talent"
          actionHref="/brand/discover"
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const events = selectedEvents[b.bookingId];
            return (
              <div
                key={b.bookingId}
                className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{b.itemTitle}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted text-foreground">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {`Creator: ${b.creatorName} · Qty ${b.quantity} · Target Delivery ${b.deliveryDate}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">
                      {`₹${Number(b.quoteSnapshot?.totalBrandPayable ?? 0).toLocaleString('en-IN')}`}
                    </div>
                    <div className="text-[11px] text-muted-foreground">Total Payable (incl. GST)</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border">
                  {b.brief}
                </p>

                {b.status === 'ACCEPTED' && (
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Accepted. Agreement step is not enabled yet.
                  </div>
                )}

                {b.status === 'REJECTED' && b.rejectionReason && (
                  <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300">
                    {`Declined: ${b.rejectionReason}`}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{`Round ${b.counterRound}`}</span>
                    {b.creatorSlug && (
                      <Link
                        href={`/c/${b.creatorSlug}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View Creator
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => void loadTimeline(b.bookingId)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {events ? 'Refresh History' : 'View History'}
                    </button>
                  </div>

                  {(b.status === 'REQUESTED' || b.status === 'COUNTERED') && (
                    <button
                      type="button"
                      onClick={() => void handleCancel(b.bookingId)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs text-rose-600 dark:text-rose-400 hover:bg-muted"
                    >
                      Withdraw Request
                    </button>
                  )}
                </div>

                {events && (
                  <div className="pt-2 space-y-1 text-[11px] text-muted-foreground border-t border-border">
                    {events.map((ev) => (
                      <div key={ev.eventId} className="flex justify-between">
                        <span>
                          {`${ev.eventType} by ${ev.actorRole}${ev.reason ? ` — ${ev.reason}` : ''}`}
                        </span>
                        <span>{new Date(ev.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </BrandPageContainer>
  );
}
