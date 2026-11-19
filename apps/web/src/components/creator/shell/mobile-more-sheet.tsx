'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CREATOR_NAV_ITEMS } from './nav-config';
import { ShellIcon } from './shell-icons';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  displayName?: string;
}

export function MobileMoreSheet({ isOpen, onClose, userEmail, displayName }: MobileMoreSheetProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 desk:hidden flex flex-col justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-card rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-border">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-muted" />
        </div>

        {/* Profile preview header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <Link
            href="/creator/profile"
            onClick={onClose}
            className="flex-1 group"
          >
            <div className="font-bold text-foreground text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {displayName || 'Creator'}
            </div>
            <div className="text-xs text-muted-foreground">
              {userEmail || 'View profile →'}
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Grid of full navigation options */}
        <div className="overflow-y-auto px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {CREATOR_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                    isActive
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-muted/40 border-border text-foreground hover:bg-muted'
                  }`}
                >
                  <ShellIcon name={item.iconName} size={20} className="shrink-0" />
                  <span className="text-xs truncate flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <form action="/api/auth/logout?redirect=/auth/creator/sign-in" method="POST">
              <button
                type="submit"
                className="w-full py-3 rounded-xl border border-destructive/20 text-destructive bg-destructive/10 text-sm font-semibold hover:bg-destructive/20 transition"
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
