'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BRAND_NAV_SECTIONS,
  BrandUserRole,
  getActiveBrandRoute,
  getFilteredBrandNavItems,
} from './brand-nav-config';
import { BrandShellIcon } from './brand-shell-icons';
import { Logo } from '@/components/brand/Logo';

interface BrandSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole?: BrandUserRole;
  planBadge?: string;
  enabledFlags?: Record<string, boolean>;
}

export function BrandSidebar({
  collapsed,
  onToggleCollapse,
  userRole = 'OWNER',
  planBadge,
  enabledFlags = {},
}: BrandSidebarProps) {
  const pathname = usePathname();
  const activeHref = getActiveBrandRoute(pathname);
  const accessibleItems = getFilteredBrandNavItems(userRole, enabledFlags);

  return (
    <aside
      className={`hidden desk:flex flex-col border-r border-border bg-card transition-all duration-300 z-30 sticky top-0 h-screen shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Logo Header */}
      <div
        className={`h-16 flex items-center border-b border-border ${
          collapsed ? 'justify-between px-2 gap-1' : 'justify-between px-4'
        }`}
      >
        {!collapsed ? (
          <Logo variant="full" size="sm" href="/brand/dashboard" badgeText={planBadge || 'BRAND'} />
        ) : (
          <Logo variant="mark" size={26} href="/brand/dashboard" ariaLabel="Adzunova Brand Dashboard" />
        )}
        <button
          type="button"
          data-variant="ghost"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
        >
          <BrandShellIcon
            name={collapsed ? 'ChevronRight' : 'ChevronLeft'}
            size={16}
          />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {BRAND_NAV_SECTIONS.map((sec) => {
          const sectionItems = accessibleItems.filter((i) => i.section === sec.id);
          if (sectionItems.length === 0) return null;

          return (
            <div key={sec.id} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {sec.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {sectionItems.map((item) => {
                  const isActive = activeHref === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.title : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <BrandShellIcon
                          name={item.iconName}
                          size={18}
                          className={`shrink-0 ${
                            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`}
                        />
                        {!collapsed && (
                          <span className="truncate flex-1">{item.title}</span>
                        )}
                        {!collapsed && item.badge && item.badge > 0 && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
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
        })}
      </nav>

      {/* Footer Info / Support */}
      {!collapsed && (
        <div className="p-3 border-t border-border/80 bg-muted/20">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Enterprise Workspace</span>
            <span className="font-mono text-[10px]">v2.6</span>
          </div>
        </div>
      )}
    </aside>
  );
}
