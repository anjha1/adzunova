'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge, Money } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { PricingEngine, IndiaGstTaxPolicy } from '../../../../../../libs/pricing-engine/src';

interface RateItem {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'x' | 'podcast';
  format: string;
  description: string;
  basePriceMinor: number;
  deliveryDays: number;
  freeRevisions: number;
  isEnabled: boolean;
}

const DEFAULT_RATES: RateItem[] = [
  {
    id: 'yt-ded',
    platform: 'youtube',
    format: 'Dedicated Video (8-12m)',
    description: 'Full product review, unboxing, with pinned comment and description link.',
    basePriceMinor: 8500000, // ₹85,000.00
    deliveryDays: 10,
    freeRevisions: 2,
    isEnabled: true,
  },
  {
    id: 'yt-int',
    platform: 'youtube',
    format: '60-90s Integration',
    description: 'Mid-roll sponsor integration with promo code link in description.',
    basePriceMinor: 4500000, // ₹45,000.00
    deliveryDays: 7,
    freeRevisions: 1,
    isEnabled: true,
  },
  {
    id: 'ig-reel',
    platform: 'instagram',
    format: '30-60s Reel / Short',
    description: 'High-energy vertical reel with trending audio, tagging brand partner.',
    basePriceMinor: 3500000, // ₹35,000.00
    deliveryDays: 5,
    freeRevisions: 1,
    isEnabled: true,
  },
  {
    id: 'ig-story',
    platform: 'instagram',
    format: 'Story Set (3 frames with link)',
    description: 'Sequence with interactive sticker, swipe-up/link sticker, 24hr archive.',
    basePriceMinor: 1500000, // ₹15,000.00
    deliveryDays: 3,
    freeRevisions: 1,
    isEnabled: true,
  },
];

export default function RateCardPage() {
  const [rates, setRates] = useState<RateItem[]>(DEFAULT_RATES);
  const [currency, setCurrency] = useState('INR');
  const [selectedRateId, setSelectedRateId] = useState<string>('yt-ded');
  const [includeUsageRights, setIncludeUsageRights] = useState(false);
  const [includeExclusivity, setIncludeExclusivity] = useState(false);
  const [isRush, setIsRush] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const selectedRate = rates.find((r) => r.id === selectedRateId) || rates[0];

  // Pricing calculation via PricingEngine
  const quote = PricingEngine.calculateItemQuote(
    {
      basePriceMinorUnits: selectedRate.basePriceMinor,
      includedRevisions: selectedRate.freeRevisions,
      requestedRevisions: selectedRate.freeRevisions,
      rushDeliveryDays: isRush ? 1 : 7,
      usageRights: includeUsageRights
        ? { type: 'PAID_ADS_30D', percentageMultiplier: 0.2 }
        : undefined,
      exclusivity: includeExclusivity
        ? { category: 'Standard', days: 90, fixedFeeMinorUnits: Math.round(selectedRate.basePriceMinor * 0.3) }
        : undefined,
    },
    currency
  );

  const handleUpdatePrice = (id: string, newAmount: number) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, basePriceMinor: Math.max(0, newAmount * 100) } : r))
    );
  };

  const handleToggleRate = (id: string) => {
    setRates((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Rate Card"
        description="Set your standard deliverables pricing. All quotes generated for brands are backed by guaranteed escrow before shoot kickoff."
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <ShellIcon name="Save" size={14} />
              {isSaved ? 'Saved to Profile!' : 'Publish Rate Card'}
            </button>
          </div>
        }
      />

      {/* Top Highlights */}
      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Active Deliverables"
          value={rates.filter((r) => r.isEnabled).length}
          subValue="Published for brands"
          icon={<ShellIcon name="Tag" size={16} />}
        />
        <StatCard
          label="Starting Rate"
          value={<Money minorUnits={Math.min(...rates.map((r) => r.basePriceMinor))} currency={currency} />}
          subValue="Minimum booking base"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Platform Commission"
          value="10%"
          subValue="Escrow & contract protection"
          icon={<ShellIcon name="ShieldCheck" size={16} />}
        />
        <StatCard
          label="Avg Turnaround"
          value="5-7 Days"
          subValue="Standard SLA"
          icon={<ShellIcon name="Calendar" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-6">
        {/* Left 2 Cols: Deliverables Editor */}
        <div className="desk:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">Configured Deliverables & Formats</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-xs rounded-lg border border-border bg-card px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {rates.map((rate) => {
              const isSelected = rate.id === selectedRateId;
              return (
                <div
                  key={rate.id}
                  onClick={() => setSelectedRateId(rate.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-border bg-card hover:border-border/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-muted text-foreground">
                        <ShellIcon
                          name={rate.platform === 'youtube' ? 'Video' : 'Share2'}
                          size={16}
                          className="text-indigo-600 dark:text-indigo-400"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">{rate.format}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {rate.platform}
                          </span>
                          {!rate.isEnabled && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{rate.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                          <span>⏱️ {rate.deliveryDays}d delivery</span>
                          <span>🔄 {rate.freeRevisions} free revisions</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {currency === 'INR' ? '₹' : '$'}
                        </span>
                        <input
                          type="number"
                          value={rate.basePriceMinor / 100}
                          onChange={(e) => handleUpdatePrice(rate.id, Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-28 text-right font-bold text-sm bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRate(rate.id);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 inline-block"
                      >
                        {rate.isEnabled ? 'Hide from Brands' : 'Show in Rate Card'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Live Quote Preview */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <ShellIcon name="Sparkles" size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-foreground">Interactive Brand Quote Simulator</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Preview how brands see this deliverable in their checkout drawer.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
              <span className="text-muted-foreground">Selected Item:</span>
              <p className="font-semibold text-foreground">{selectedRate.format}</p>
            </div>

            {/* Add-on toggles */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-foreground">Add-on Licences & Options</span>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-muted-foreground">Paid Ad Usage Rights (30d) (+20%)</span>
                <input
                  type="checkbox"
                  checked={includeUsageRights}
                  onChange={(e) => setIncludeUsageRights(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-muted-foreground">Category Exclusivity (90d) (+30%)</span>
                <input
                  type="checkbox"
                  checked={includeExclusivity}
                  onChange={(e) => setIncludeExclusivity(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <span className="text-muted-foreground">Rush Turnaround (&lt;48 hrs) (+25%)</span>
                <input
                  type="checkbox"
                  checked={isRush}
                  onChange={(e) => setIsRush(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="pt-3 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Deliverable Subtotal</span>
                <span>
                  <Money minorUnits={quote.subtotalMinorUnits} currency={currency} />
                </span>
              </div>

              {quote.rushFeeMinorUnits > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Rush Fee (+25%)</span>
                  <span>
                    <Money minorUnits={quote.rushFeeMinorUnits} currency={currency} />
                  </span>
                </div>
              )}

              {quote.usageRightsMinorUnits > 0 && (
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                  <span>Usage Rights Licensing (+20%)</span>
                  <span>
                    <Money minorUnits={quote.usageRightsMinorUnits} currency={currency} />
                  </span>
                </div>
              )}

              {quote.exclusivityMinorUnits > 0 && (
                <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                  <span>Category Exclusivity (+30%)</span>
                  <span>
                    <Money minorUnits={quote.exclusivityMinorUnits} currency={currency} />
                  </span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Brand Invoiced Subtotal</span>
                <span>
                  <Money minorUnits={quote.grossTotalMinorUnits} currency={currency} />
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Platform Service Fee (10%)</span>
                <span>
                  <Money minorUnits={quote.platformFeeMinorUnits} currency={currency} />
                </span>
              </div>

              {quote.taxAmountMinorUnits > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{quote.taxName || 'GST (18%)'}</span>
                  <span>
                    <Money minorUnits={quote.taxAmountMinorUnits} currency={currency} />
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-foreground">
                <span>Brand Pays (Escrow)</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  <Money
                    minorUnits={quote.grossTotalMinorUnits + quote.taxAmountMinorUnits}
                    currency={currency}
                  />
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Net Creator Payout:</span>
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  <Money minorUnits={quote.creatorNetPayoutMinorUnits} currency={currency} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
