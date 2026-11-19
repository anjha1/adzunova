'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader, StatCard, Money } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { PricingEngine } from '../../../../../../libs/pricing-engine/src';

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

export default function RateCardPage() {
  const [rates, setRates] = useState<RateItem[]>([
    {
      id: 'rate-1',
      platform: 'youtube',
      format: 'Dedicated Video',
      description: 'Dedicated brand integration or full video feature.',
      basePriceMinor: 0,
      deliveryDays: 7,
      freeRevisions: 1,
      isEnabled: true,
    },
    {
      id: 'rate-2',
      platform: 'instagram',
      format: 'Sponsored Reel',
      description: 'Vertical short-form video featuring product.',
      basePriceMinor: 0,
      deliveryDays: 5,
      freeRevisions: 1,
      isEnabled: true,
    },
  ]);

  const [currency, setCurrency] = useState('INR');
  const [selectedRateId, setSelectedRateId] = useState<string>('rate-1');
  const [includeUsageRights, setIncludeUsageRights] = useState(false);
  const [includeExclusivity, setIncludeExclusivity] = useState(false);
  const [isRush, setIsRush] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [platformConfigured, setPlatformConfigured] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/platform-config');
        if (res.ok) {
          const cfg = await res.json();
          setPlatformConfigured(cfg.configured);
        }
      } catch {
        setPlatformConfigured(false);
      }
    }
    loadConfig();
  }, []);

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

  const startingRateMinor = Math.min(...rates.map((r) => r.basePriceMinor));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Rate Card"
        description="Set your standard deliverables pricing. All quotes generated for brands use versioned platform fee configurations."
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <ShellIcon name="Save" size={14} />
              {isSaved ? 'Saved to Profile!' : 'Save Rate Card'}
            </button>
          </div>
        }
      />

      {/* Top Highlights */}
      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Active Deliverables"
          value={rates.filter((r) => r.isEnabled).length}
          subValue="Available to brands"
          icon={<ShellIcon name="Tag" size={16} />}
        />
        <StatCard
          label="Starting Rate"
          value={startingRateMinor > 0 ? <Money minorUnits={startingRateMinor} currency={currency} /> : '₹0'}
          subValue="Minimum deliverable price"
          icon={<ShellIcon name="CreditCard" size={16} />}
        />
        <StatCard
          label="Platform Commission"
          value={platformConfigured ? '10%' : 'Pricing not configured'}
          subValue="Standard platform fee"
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
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-500/5'
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
                          <span>🔄 {rate.freeRevisions} free revision</span>
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
                          placeholder="0"
                          value={rate.basePriceMinor > 0 ? rate.basePriceMinor / 100 : ''}
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

        {/* Right Col: Quote Calculator */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <ShellIcon name="Sparkles" size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-foreground">Brand Quote Simulator</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Preview how brands calculate this deliverable pricing.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/50 border border-border text-xs space-y-1">
              <span className="text-muted-foreground">Selected Item:</span>
              <p className="font-semibold text-foreground">{selectedRate.format}</p>
            </div>

            {/* Add-on toggles */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-foreground">Add-on Licensing & Options</span>

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

            {/* Fee Breakdown */}
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
                <span>Brand Subtotal</span>
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

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-xs">
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
