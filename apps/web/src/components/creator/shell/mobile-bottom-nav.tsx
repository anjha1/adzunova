'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOBILE_PRIMARY_TABS } from './nav-config';
import { ShellIcon } from './shell-icons';

interface MobileBottomNavProps {
  onOpenMore: () => void;
}

export function MobileBottomNav({ onOpenMore }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="desk:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-1">
        {MOBILE_PRIMARY_TABS.map((tab) => {
          const isMore = tab.href === '#more';
          const isActive = !isMore && (pathname === tab.href || (tab.href !== '/creator/dashboard' && pathname?.startsWith(tab.href)));

          if (isMore) {
            return (
              <button
                key={tab.title}
                onClick={onOpenMore}
                className="flex-1 flex flex-col items-center justify-center py-1 text-muted-foreground hover:text-foreground transition"
              >
                <div className="relative">
                  <ShellIcon name={tab.iconName} size={20} />
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
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <ShellIcon name={tab.iconName} size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-indigo-600 text-white rounded-full min-w-3.5 text-center leading-3">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
