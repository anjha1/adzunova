'use client';

import React, { useState } from 'react';
import { ShellIcon } from '@/components/creator/shell/shell-icons';
import { RateCardItem, RateCardStatus } from '@/lib/rate-card/types';
import {
  PLATFORM_METADATA,
  FORMAT_METADATA,
  DELIVERABLE_TYPE_METADATA,
} from '@/lib/rate-card/compatibility';

interface RateCardItemCardProps {
  item: RateCardItem;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (item: RateCardItem) => void;
  onCheck: (id: string, checked: boolean) => void;
  onEdit: (item: RateCardItem) => void;
  onDuplicate: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: RateCardStatus) => void;
  onToggleVisibility: (id: string, currentVisibility: boolean) => void;
  onDelete: (id: string) => void;
}

export function RateCardItemCard({
  item,
  isSelected,
  isChecked,
  onSelect,
  onCheck,
  onEdit,
  onDuplicate,
  onToggleStatus,
  onToggleVisibility,
  onDelete,
}: RateCardItemCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const platformMeta = PLATFORM_METADATA[item.platform] || {
    label: item.platform,
    icon: 'Share2',
    badgeColor: 'bg-muted text-foreground',
  };
  const formatMeta = FORMAT_METADATA[item.contentFormat];
  const deliverableMeta = DELIVERABLE_TYPE_METADATA[item.deliverableType];

  const handleCardClick = () => {
    onSelect(item);
  };

  const getStatusBadge = (status: RateCardStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        );
      case 'PAUSED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Paused
          </span>
        );
      case 'DRAFT':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Draft
          </span>
        );
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative p-4 rounded-2xl border transition cursor-pointer select-none ${
        isSelected
          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-500/5 shadow-xs'
          : 'border-border bg-card hover:border-border/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox and Left Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-1"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onCheck(item.id, e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              aria-label={`Select ${item.title}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${platformMeta.badgeColor}`}
              >
                {platformMeta.label}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-foreground border border-border">
                {formatMeta?.label || item.contentFormat}
              </span>
              {getStatusBadge(item.status)}
              {!item.visibleToBrands && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border flex items-center gap-1">
                  <ShellIcon name="EyeOff" size={10} />
                  Hidden
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-sm font-bold text-foreground leading-snug truncate">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Specs row */}
            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
              <span>⏱️ {item.deliveryDays}d delivery</span>
              <span>•</span>
              <span>🔄 {item.freeRevisions} free revision{item.freeRevisions !== 1 ? 's' : ''}</span>
              {item.durationSeconds && (
                <>
                  <span>•</span>
                  <span>⌛ {item.durationSeconds >= 60 ? `${Math.round(item.durationSeconds / 60)}m` : `${item.durationSeconds}s`}</span>
                </>
              )}
              {deliverableMeta && (
                <>
                  <span>•</span>
                  <span className="truncate">{deliverableMeta.label}</span>
                </>
              )}
            </div>

            {/* Configured Add-ons preview */}
            {item.addons && item.addons.filter((a) => a.enabled).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.addons
                  .filter((a) => a.enabled)
                  .map((a) => (
                    <span
                      key={a.type}
                      className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                    >
                      {a.type.replace('_', ' ').toLowerCase()}: {a.pricingMode === 'PERCENT_OF_BASE' ? `+${a.value}%` : `+₹${a.value}`}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Info: Price, Visibility toggle & Actions Menu */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="text-right flex flex-col items-end gap-2 flex-shrink-0"
        >
          <div className="text-sm font-extrabold text-foreground">
            ₹{item.price.toLocaleString('en-IN')}
            {item.priceType === 'NEGOTIABLE' && (
              <span className="block text-[10px] font-normal text-muted-foreground">
                Negotiable
              </span>
            )}
          </div>

          {/* Visibility Toggle */}
          <button
            type="button"
            onClick={() => onToggleVisibility(item.id, item.visibleToBrands)}
            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
            title={item.visibleToBrands ? 'Click to hide from brands' : 'Click to show to brands'}
          >
            <ShellIcon name={item.visibleToBrands ? 'Eye' : 'EyeOff'} size={12} />
            <span>{item.visibleToBrands ? 'Visible' : 'Hidden'}</span>
          </button>

          {/* Actions Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition"
              aria-label="Actions"
            >
              <ShellIcon name="MoreVertical" size={14} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-border bg-card shadow-lg py-1 z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(item);
                    }}
                    className="w-full text-left px-3 py-1.5 text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <ShellIcon name="Edit" size={12} />
                    Edit Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(item.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <ShellIcon name="Copy" size={12} />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onToggleStatus(item.id, item.status);
                    }}
                    className="w-full text-left px-3 py-1.5 text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <ShellIcon name="ShieldCheck" size={12} />
                    {item.status === 'ACTIVE' ? 'Pause Item' : 'Activate'}
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
                        onDelete(item.id);
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 text-destructive hover:bg-destructive/10 flex items-center gap-2"
                  >
                    <ShellIcon name="Trash" size={12} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
