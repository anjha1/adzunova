'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CREATOR_NAV_ITEMS } from './nav-config';
import { ShellIcon } from './shell-icons';

interface CreatorSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function CreatorSidebar({ collapsed, onToggleCollapse }: CreatorSidebarProps) {
  const pathname = usePathname();

  // Single active item logic via longest prefix match
  const activeHref = (() => {
    if (!pathname) return '/creator/dashboard';
    // Exact match first
    const exact = CREATOR_NAV_ITEMS.find((i) => i.href === pathname);
    if (exact) return exact.href;
    // Longest prefix match
    const matches = CREATOR_NAV_ITEMS
      .filter((i) => i.href !== '/creator/dashboard' && pathname.startsWith(i.href))
      .sort((a, b) => b.href.length - a.href.length);
    return matches[0]?.href ?? (pathname === '/creator/dashboard' ? '/creator/dashboard' : '');
  })();

  // Group nav items by section
  const mainItems = CREATOR_NAV_ITEMS.filter((i) => i.section === 'main');
  const businessItems = CREATOR_NAV_ITEMS.filter((i) => i.section === 'business');
  const insightItems = CREATOR_NAV_ITEMS.filter((i) => i.section === 'insights');
  const accountItems = CREATOR_NAV_ITEMS.filter((i) => i.section === 'account');

  const renderSection = (title: string, items: typeof CREATOR_NAV_ITEMS) => (
    <div className="py-2">
      {!collapsed && (
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.title : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <ShellIcon name={item.iconName} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {!collapsed && (
                  <span className="truncate flex-1">{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeVariant === 'success'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside
      className={`hidden desk:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 sticky top-0 h-screen ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        {!collapsed && (
          <Link href="/creator/dashboard" className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
              ADZUNOVA
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              CREATOR
            </span>
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          <ShellIcon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
        </button>
      </div>

      {/* Nav body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {renderSection('Main', mainItems)}
        {renderSection('Business', businessItems)}
        {renderSection('Intelligence', insightItems)}
        {renderSection('Preferences', accountItems)}
      </div>

      {/* Trust & Verification Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-indigo-100 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <ShellIcon name="ShieldCheck" className="text-emerald-600 dark:text-emerald-400" size={16} />
            <span>Verified Escrow Guard</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
            100% of brand payments are pre-funded in escrow before content production.
          </p>
        </div>
      ) : (
        <div className="p-3 flex justify-center text-emerald-500">
          <ShellIcon name="ShieldCheck" size={20} />
        </div>
      )}
    </aside>
  );
}
