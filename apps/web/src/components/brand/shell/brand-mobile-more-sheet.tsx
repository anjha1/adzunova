'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BRAND_NAV_SECTIONS,
  BrandUserRole,
  getFilteredBrandNavItems,
} from './brand-nav-config';
import { BrandShellIcon } from './brand-shell-icons';

interface BrandMobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  companyName?: string;
  role?: BrandUserRole;
  verificationLabel?: string;
  enabledFlags?: Record<string, boolean>;
}

export function BrandMobileMoreSheet({
  isOpen,
  onClose,
  userEmail,
  companyName,
  role = 'OWNER',
  verificationLabel,
  enabledFlags = {},
}: BrandMobileMoreSheetProps) {
  const pathname = usePathname();
  const accessibleItems = getFilteredBrandNavItems(role, enabledFlags);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 desk:hidden flex flex-col justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-card rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-border">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-muted" />
        </div>

        {/* Workspace preview header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <div className="font-bold text-foreground text-base truncate">
              {companyName || 'Brand Workspace'}
            </div>
            <div className="text-xs text-muted-foreground truncate font-mono">
              {userEmail}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                {role}
              </span>
              {verificationLabel && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                  {verificationLabel}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <BrandShellIcon name="X" size={16} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <div className="overflow-y-auto px-4 py-4 space-y-4">
          {BRAND_NAV_SECTIONS.map((sec) => {
            const sectionItems = accessibleItems.filter((i) => i.section === sec.id);
            if (sectionItems.length === 0) return null;

            return (
              <div key={sec.id} className="space-y-1.5">
                <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {sec.label}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sectionItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition ${
                          isActive
                            ? 'bg-primary/10 border-primary/30 text-primary font-bold'
                            : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        <BrandShellIcon
                          name={item.iconName}
                          size={18}
                          className="shrink-0"
                        />
                        <span className="text-xs truncate flex-1">{item.title}</span>
                        {item.badge && item.badge > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <form action="/api/auth/logout?redirect=/auth/brand/sign-in" method="POST">
              <button
                type="submit"
                className="w-full py-3 rounded-xl border border-destructive/20 text-destructive bg-destructive/10 text-sm font-semibold hover:bg-destructive/20 transition cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
