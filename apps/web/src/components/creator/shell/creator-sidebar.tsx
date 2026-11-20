'use client';

import React from 'react';
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
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <ShellIcon name={item.iconName} className={`shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                {!collapsed && (
                  <span className="truncate flex-1">{item.title}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeVariant === 'success'
                        ? 'bg-emerald-500/10 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-500/10 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300'
                        : 'bg-indigo-500/10 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-300'
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
      className={`hidden desk:flex flex-col border-r border-border bg-card transition-all duration-300 z-30 sticky top-0 h-screen ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/creator/dashboard" className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-indigo-600 dark:text-indigo-400">
              ADZUNOVA
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              CREATOR
            </span>
          </Link>
        )}
        <button
          data-variant="ghost"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition ${
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

      {/* Workspace Status & Sign Out Footer */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-muted/40 border border-border text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShellIcon name="Briefcase" className="text-indigo-600 dark:text-indigo-400" size={16} />
            <span>Creator Workspace</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            ADZUNOVA Creator Workspace
          </p>
          <div className="pt-2 border-t border-border">
            <form action="/api/auth/logout?redirect=/auth/creator/sign-in" method="POST">
              <button
                type="submit"
                data-variant="ghost"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <ShellIcon name="LogOut" size={15} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center gap-2 text-muted-foreground">
          <ShellIcon name="Briefcase" size={20} />
          <form action="/api/auth/logout?redirect=/auth/creator/sign-in" method="POST">
            <button
              type="submit"
              data-variant="ghost"
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground text-muted-foreground transition cursor-pointer"
            >
              <ShellIcon name="LogOut" size={18} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
