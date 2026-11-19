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
    <div className="fixed inset-0 z-50 desk:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Content */}
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200 dark:border-slate-800">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Profile preview header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-base">
              {displayName || 'Verified Creator'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {userEmail}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                className="w-full py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 text-sm font-semibold hover:bg-red-100 transition"
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
