'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOBILE_BRAND_PRIMARY_TABS } from './brand-nav-config';
import { BrandShellIcon } from './brand-shell-icons';

interface BrandMobileBottomNavProps {
  onOpenMore: () => void;
  financeBadge?: number;
  campaignsBadge?: number;
}

export function BrandMobileBottomNav({
  onOpenMore,
  financeBadge = 0,
  campaignsBadge = 0,
}: BrandMobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="desk:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {MOBILE_BRAND_PRIMARY_TABS.map((tab) => {
          const isMore = tab.href === '#more';
          const isActive =
            !isMore &&
            (pathname === tab.href ||
              (tab.href !== '/brand/dashboard' && pathname?.startsWith(tab.href)));

          const badgeCount =
            tab.href === '/brand/finance'
              ? financeBadge
              : tab.href === '/brand/campaigns'
              ? campaignsBadge
              : 0;

          if (isMore) {
            return (
              <button
                key={tab.title}
                type="button"
                onClick={onOpenMore}
                className="flex-1 flex flex-col items-center justify-center py-1 text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <div className="relative">
                  <BrandShellIcon name={tab.iconName} size={20} />
                </div>
                <span className="text-[10px] font-semibold mt-1">{tab.title}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.title}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <BrandShellIcon
                  name={tab.iconName}
                  size={20}
                  className={isActive ? 'stroke-[2.5]' : 'stroke-2'}
                />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-primary text-primary-foreground rounded-full min-w-3.5 text-center leading-3">
                    {badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
