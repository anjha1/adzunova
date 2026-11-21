'use client';

import React, { useState, useEffect } from 'react';
import { BrandSidebar } from './brand-sidebar';
import { BrandHeader } from './brand-header';
import { BrandMobileBottomNav } from './brand-mobile-bottom-nav';
import { BrandMobileMoreSheet } from './brand-mobile-more-sheet';
import { BrandGlobalSearch } from './brand-global-search';
import { BrandUserRole } from './brand-nav-config';
import { BrandEntity } from './brand-workspace-switcher';

export interface BrandShellProps {
  children: React.ReactNode;
  userEmail?: string;
  companyName?: string;
  contactName?: string;
  role?: BrandUserRole;
  verificationLabel?: string;
  planBadge?: string;
  unreadCount?: number;
  approvalsCount?: number;
  entities?: BrandEntity[];
  isAgency?: boolean;
  enabledFlags?: Record<string, boolean>;
}

export function BrandShell({
  children,
  userEmail,
  companyName,
  contactName,
  role = 'OWNER',
  verificationLabel,
  planBadge,
  unreadCount = 0,
  approvalsCount = 0,
  entities = [],
  isAgency = false,
  enabledFlags = {},
}: BrandShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl/Cmd + K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col desk:flex-row text-foreground">
      {/* Desktop/Tablet Collapsible Sidebar */}
      <BrandSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        userRole={role}
        planBadge={planBadge}
        enabledFlags={enabledFlags}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 desk:pb-8">
        <BrandHeader
          userEmail={userEmail}
          companyName={companyName}
          contactName={contactName}
          role={role}
          verificationLabel={verificationLabel}
          unreadCount={unreadCount}
          approvalsCount={approvalsCount}
          entities={entities}
          isAgency={isAgency}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 desk:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <BrandMobileBottomNav
        onOpenMore={() => setIsMoreOpen(true)}
        financeBadge={0}
        campaignsBadge={0}
      />

      {/* Mobile Extended Drawer ("More") */}
      <BrandMobileMoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        userEmail={userEmail}
        companyName={companyName}
        role={role}
        verificationLabel={verificationLabel}
        enabledFlags={enabledFlags}
      />

      {/* Global Search Palette */}
      <BrandGlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
