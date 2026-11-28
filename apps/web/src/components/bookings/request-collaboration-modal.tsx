'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileUploader, type UploadedAssetResult } from '@/components/storage/file-uploader';

interface RateCardAddonOption {
  type: string;
  pricingMode: string;
  value: number;
  enabled: boolean;
}

interface RateCardItemOption {
  id: string;
  title: string;
  platform: string;
  format: string;
  price: number;
  pricingType?: string;
  addons?: RateCardAddonOption[];
}

interface PackageOption {
  id: string;
  name: string;
  discountedPricePaise?: string;
  discountedPriceMinor?: number;
}

interface RequestCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  creatorSlug: string;
  rateCardItems: RateCardItemOption[];
  packages: PackageOption[];
  initialItemId?: string | null;
  initialPackageId?: string | null;
}

interface QuoteBreakdown {
  basePrice: number;
  addonsTotal: number;
  subtotal: number;
  brandFeeAmount: number;
  gstAmount: number;
  totalBrandPayable: number;
}

export function RequestCollaborationModal({
  isOpen,
  onClose,
  creatorId,
  creatorName,
  creatorSlug,
  rateCardItems,
  packages,
  initialItemId,
  initialPackageId,
}: RequestCollaborationModalProps) {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isBrand, setIsBrand] = useState(false);
  const [isVerifiedBrand, setIsVerifiedBrand] = useState(false);

  const [itemKind, setItemKind] = useState<'RATE_CARD_ITEM' | 'PACKAGE'>(
    initialPackageId ? 'PACKAGE' : 'RATE_CARD_ITEM'
  );
  const [selectedItemId, setSelectedItemId] = useState<string>(
    initialItemId || rateCardItems[0]?.id || ''
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || packages[0]?.id || ''
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [brief, setBrief] = useState('');
  const [referenceLinksText, setReferenceLinksText] = useState('');
  const [budgetNote, setBudgetNote] = useState('');
  const [uploadedAssetIds, setUploadedAssetIds] = useState<string[]>([]);

  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialPackageId) {
      setItemKind('PACKAGE');
      setSelectedPackageId(initialPackageId);
    } else if (initialItemId) {
      setItemKind('RATE_CARD_ITEM');
      setSelectedItemId(initialItemId);
    }
  }, [isOpen, initialItemId, initialPackageId]);

  useEffect(() => {
    if (!isOpen) return;
    setAuthLoading(true);
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user?.role === 'BRAND') {
          setIsBrand(true);
          setIsVerifiedBrand(data?.profile?.verificationStatus === 'VERIFIED');
        } else {
          setIsBrand(false);
          setIsVerifiedBrand(false);
        }
      })
      .catch(() => {
        setIsBrand(false);
      })
      .finally(() => setAuthLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const targetId = itemKind === 'PACKAGE' ? selectedPackageId : selectedItemId;
    if (!targetId) {
      setQuote(null);
      return;
    }

    setQuoteLoading(true);
    fetch('/api/bookings/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorId,
        ...(itemKind === 'PACKAGE'
          ? { packageId: selectedPackageId }
          : { rateCardItemId: selectedItemId, selectedAddons }),
        quantity,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.quote?.breakdown) {
          setQuote(data.quote.breakdown);
        } else {
          setQuote(null);
        }
      })
      .catch(() => setQuote(null))
      .finally(() => setQuoteLoading(false));
  }, [isOpen, creatorId, itemKind, selectedItemId, selectedPackageId, selectedAddons, quantity]);

  if (!isOpen) return null;

  const activeRateCardItem = rateCardItems.find((i) => i.id === selectedItemId);
  const enabledAddons = (activeRateCardItem?.addons || []).filter((a) => a.enabled);

  const toggleAddon = (type: string) => {
    setSelectedAddons((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const referenceLinks = referenceLinksText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId,
          creatorName,
          creatorSlug,
          ...(itemKind === 'PACKAGE'
            ? { packageId: selectedPackageId }
            : { rateCardItemId: selectedItemId, selectedAddons }),
          quantity,
          deliveryDate,
          brief,
          referenceLinks,
          assetIds: uploadedAssetIds,
          budgetNote: budgetNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to submit collaboration request');
        return;
      }
      setCreatedBookingId(data.booking?.bookingId || 'submitted');
    } catch {
      setErrorMsg('Network error submitting collaboration request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Request Collaboration"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Request Collaboration</h2>
            <p className="text-xs text-muted-foreground">{`Send a structured booking request to ${creatorName}`}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>

        {authLoading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Checking brand session...</div>
        ) : !isBrand ? (
          <div className="p-5 rounded-xl border border-border bg-muted/40 space-y-3 text-center">
            <p className="text-sm font-semibold text-foreground">Sign in as a Brand to request collaboration</p>
            <p className="text-xs text-muted-foreground">
              You will be returned directly to this creator profile after signing in.
            </p>
            <button
              type="button"
              onClick={() =>
                router.push(`/auth/brand/sign-in?returnUrl=${encodeURIComponent(`/c/${creatorSlug}?request=1`)}`)
              }
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 !text-white text-xs font-bold"
            >
              Brand Sign In
            </button>
          </div>
        ) : !isVerifiedBrand ? (
          <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-3">
            <p className="text-sm font-semibold text-foreground">Business Verification Required</p>
            <p className="text-xs text-muted-foreground">
              Only verified brand accounts can send booking requests. Complete business verification in onboarding first.
            </p>
            <Link
              href="/brand/onboarding"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              Complete Verification
            </Link>
          </div>
        ) : createdBookingId ? (
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
            <p className="text-sm font-bold text-foreground">Collaboration Request Sent</p>
            <p className="text-xs text-muted-foreground">
              {`Request ${createdBookingId} has been sent to ${creatorName}. The quote is locked and expires in 72 hours if unanswered.`}
            </p>
            <div className="flex gap-2">
              <Link
                href="/brand/offers"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 !text-white text-xs font-bold"
              >
                View Sent Offers
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs text-foreground"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setItemKind('RATE_CARD_ITEM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  itemKind === 'RATE_CARD_ITEM'
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-border text-muted-foreground'
                }`}
              >
                Rate Card Deliverable
              </button>
              {packages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setItemKind('PACKAGE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    itemKind === 'PACKAGE'
                      ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  Bundle Package
                </button>
              )}
            </div>

            {itemKind === 'RATE_CARD_ITEM' ? (
              <div>
                <label htmlFor="booking-deliverable-select" className="text-xs font-semibold text-foreground block mb-1">Deliverable</label>
                <select
                  id="booking-deliverable-select"
                  value={selectedItemId}
                  onChange={(e) => {
                    setSelectedItemId(e.target.value);
                    setSelectedAddons([]);
                  }}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                >
                  {rateCardItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {`${item.title} (${item.platform} · ₹${item.price.toLocaleString('en-IN')})`}
                    </option>
                  ))}
                </select>

                {enabledAddons.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-xs font-semibold text-foreground block">Add-ons</span>
                    <div className="flex flex-wrap gap-2">
                      {enabledAddons.map((addon) => (
                        <button
                          key={addon.type}
                          type="button"
                          onClick={() => toggleAddon(addon.type)}
                          className={`px-2.5 py-1 rounded-lg border text-xs ${
                            selectedAddons.includes(addon.type)
                              ? 'border-indigo-600 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {addon.type.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="booking-package-select" className="text-xs font-semibold text-foreground block mb-1">Package</label>
                <select
                  id="booking-package-select"
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-quantity-input" className="text-xs font-semibold text-foreground block mb-1">Quantity</label>
                <input
                  id="booking-quantity-input"
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
              <div>
                <label htmlFor="booking-delivery-date" className="text-xs font-semibold text-foreground block mb-1">Target Delivery Date</label>
                <input
                  id="booking-delivery-date"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-campaign-brief" className="text-xs font-semibold text-foreground block mb-1">Campaign Brief</label>
              <textarea
                id="booking-campaign-brief"
                rows={3}
                required
                minLength={10}
                placeholder="Describe campaign goals, key talking points, and deliverable expectations. Direct phone/email/social handles are automatically masked."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-reference-links" className="text-xs font-semibold text-foreground block mb-1">Reference Links (one per line)</label>
                <textarea
                  id="booking-reference-links"
                  rows={2}
                  placeholder="https://example.com/brief"
                  value={referenceLinksText}
                  onChange={(e) => setReferenceLinksText(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
              <div>
                <label htmlFor="booking-budget-note" className="text-xs font-semibold text-foreground block mb-1">Budget Note (Optional)</label>
                <input
                  id="booking-budget-note"
                  type="text"
                  placeholder="Optional budget or timeline context"
                  value={budgetNote}
                  onChange={(e) => setBudgetNote(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>
            </div>

            <div>
              <FileUploader
                purpose="campaign_deliverable_draft"
                label="Brief Assets (Optional PDF/Image)"
                accept="application/pdf,image/*"
                onUploaded={(res: UploadedAssetResult) => {
                  setUploadedAssetIds((prev) => [...prev, res.assetId]);
                }}
              />
              {uploadedAssetIds.length > 0 && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  {`${uploadedAssetIds.length} asset(s) attached`}
                </p>
              )}
            </div>

            {quote && (
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-1.5 text-xs">
                <div className="font-bold text-foreground mb-1">
                  {quoteLoading ? 'Recalculating server quote...' : 'Server-Calculated Quote Breakdown'}
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Deliverable</span>
                  <span>{`₹${quote.basePrice.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Add-ons</span>
                  <span>{`₹${quote.addonsTotal.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>{`₹${quote.brandFeeAmount.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>{`₹${quote.gstAmount.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-1.5 border-t border-border">
                  <span>Total Brand Payable</span>
                  <span>{`₹${quote.totalBrandPayable.toLocaleString('en-IN')}`}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !quote}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 !text-white text-xs font-bold"
              >
                {submitting ? 'Submitting...' : 'Submit Collaboration Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
