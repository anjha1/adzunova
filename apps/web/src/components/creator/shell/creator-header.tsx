'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ShellIcon } from './shell-icons';

interface CreatorHeaderProps {
  userEmail?: string;
  displayName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export function CreatorHeader({ userEmail, displayName, avatarUrl, isVerified }: CreatorHeaderProps) {
  const [imgError, setImgError] = React.useState(false);
  const initials = (displayName?.[0] || userEmail?.[0] || 'C').toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 desk:px-6 flex items-center justify-between">
      {/* Mobile brand & search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="desk:hidden flex items-center gap-2">
          <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
            ADZUNOVA
          </span>
        </div>

        {/* Global Search Bar (⌘K trigger) */}
        <div className="hidden desk:flex items-center gap-2 w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 text-xs">
          <ShellIcon name="Search" size={16} />
          <span className="flex-1">Search deals, rate cards, brands, contracts...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls: currency, notifications, theme, user */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ShellIcon name="Bell" size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Dark/Light Theme Toggle */}
        <ThemeToggle />

        {/* User preview */}
        <div className="hidden desk:flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
              {displayName || userEmail || 'Creator'}
            </div>
            <div className="text-[10px] flex items-center justify-end gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{isVerified ? 'Verified Creator' : 'Verification Active'}</span>
            </div>
          </div>
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={displayName || 'Creator'}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
