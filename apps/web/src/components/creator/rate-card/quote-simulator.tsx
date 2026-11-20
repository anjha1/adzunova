'use client';

import React, { useState, useMemo } from 'react';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { RateCardItem, AddonType, PlatformFeeConfig } from '@/lib/rate-card/types';
import { calculateRateCardQuote, CURRENT_PLATFORM_FEE_CONFIG } from '@/lib/rate-card/quote-calculator';
import { ADDON_TYPE_METADATA } from '@/lib/rate-card/compatibility';

interface QuoteSimulatorProps {
  selectedItem: RateCardItem | null;
  platformFeeConfig?: PlatformFeeConfig;
}

export function QuoteSimulator({
  selectedItem,
  platformFeeConfig = CURRENT_PLATFORM_FEE_CONFIG,
}: QuoteSimulatorProps) {
  const [selectedAddonTypes, setSelectedAddonTypes] = useState<AddonType[]>([
    'USAGE_RIGHTS',
    'EXCLUSIVITY',
  ]);

  // Handle toggling add-on in simulation
  const handleToggleAddon = (type: AddonType) => {
    setSelectedAddonTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Live calculation
  const quote = useMemo(() => {
    if (!selectedItem) return null;
    return calculateRateCardQuote(selectedItem, selectedAddonTypes, platformFeeConfig);
  }, [selectedItem, selectedAddonTypes, platformFeeConfig]);

  if (!selectedItem) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs text-center space-y-3">
        <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <ShellIcon name="Sparkles" size={18} />
        </div>
        <h3 className="text-sm font-bold text-foreground">Brand Quote Simulator</h3>
        <p className="text-xs text-muted-foreground">
          Select any deliverable on the left to simulate brand quote calculations and net creator payouts.
        </p>
      </div>
    );
  }

  const configuredAddons = (selectedItem.addons || []).filter((a) => a.enabled);

  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShellIcon name="Sparkles" size={16} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-foreground">Brand Quote Simulator</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
            {platformFeeConfig.version}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Live simulation of how brands calculate pricing and contracts for this deliverable.
        </p>
      </div>

      {/* Selected Deliverable Summary */}
      <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Active Selection:</span>
          <span className="text-xs font-bold text-foreground">
            ₹{selectedItem.price.toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-xs font-semibold text-foreground truncate">
          {selectedItem.title}
        </p>
      </div>

      {/* Real Configured Add-on Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Configured Add-on Options
          </span>
          <span className="text-[10px] text-muted-foreground">
            {configuredAddons.length} available
          </span>
        </div>

        {configuredAddons.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">
            No add-ons enabled for this deliverable. Edit deliverable to add usage rights or rush tiers.
          </p>
        ) : (
          <div className="space-y-2">
            {configuredAddons.map((addon) => {
              const isChecked = selectedAddonTypes.includes(addon.type);
              const meta = ADDON_TYPE_METADATA[addon.type];
              const valueLabel =
                addon.pricingMode === 'PERCENT_OF_BASE'
                  ? `+${addon.value}%`
                  : `+₹${addon.value.toLocaleString('en-IN')}`;

              let durationSuffix = '';
              if (addon.durationDays) {
                durationSuffix = ` (${addon.durationDays}d)`;
              }

              return (
                <label
                  key={addon.type}
                  className="flex items-center justify-between text-xs cursor-pointer select-none p-2 rounded-lg hover:bg-muted/50 transition border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAddon(addon.type)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-muted-foreground">
                      {meta?.label || addon.type}
                      {durationSuffix}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">{valueLabel}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote Breakdown */}
      {quote && (
        <div className="pt-3 border-t border-border space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Base Deliverable</span>
            <span className="font-medium text-foreground">
              ₹{quote.basePrice.toLocaleString('en-IN')}
            </span>
          </div>

          {quote.selectedAddons.map((a) => (
            <div
              key={a.type}
              className="flex justify-between text-indigo-600 dark:text-indigo-400"
            >
              <span className="truncate pr-2">
                + {a.label} ({a.pricingMode === 'PERCENT_OF_BASE' ? `${a.value}%` : 'Fixed'})
              </span>
              <span className="font-semibold flex-shrink-0">
                ₹{a.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}

          <div className="flex justify-between text-foreground font-semibold pt-1 border-t border-dashed border-border">
            <span>Deliverables Subtotal</span>
            <span>₹{quote.subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>
              Platform Fee ({quote.commissionPercent}%)
            </span>
            <span className="text-foreground">
              - ₹{quote.commissionAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Net Creator Payout */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                Net Creator Payout
              </span>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 block">
                Direct to your wallet upon brand sign-off
              </span>
            </div>
            <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
              ₹{quote.creatorNetPayout.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Brand Invoicing & GST */}
          <div className="pt-2 border-t border-border space-y-1.5 text-muted-foreground text-[11px]">
            <div className="flex justify-between">
              <span>GST ({quote.gstRatePercent}%)</span>
              <span>₹{quote.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground text-xs pt-1">
              <span>Total Brand Payable</span>
              <span>₹{quote.totalBrandPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
