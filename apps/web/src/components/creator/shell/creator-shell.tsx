'use client';

import React, { useState } from 'react';
import { CreatorSidebar } from './creator-sidebar';
import { CreatorHeader } from './creator-header';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MobileMoreSheet } from './mobile-more-sheet';

interface CreatorShellProps {
  children: React.ReactNode;
  userEmail?: string;
  displayName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export function CreatorShell({ children, userEmail, displayName, avatarUrl, isVerified }: CreatorShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col desk:flex-row text-foreground">
      {/* Desktop/Tablet Collapsible Sidebar */}
      <CreatorSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 desk:pb-8">
        <CreatorHeader
          userEmail={userEmail}
          displayName={displayName}
          avatarUrl={avatarUrl}
          isVerified={isVerified}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 desk:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <MobileBottomNav onOpenMore={() => setIsMoreOpen(true)} />

      {/* Mobile Extended Drawer ("More") */}
      <MobileMoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        userEmail={userEmail}
        displayName={displayName}
      />
    </div>
  );
}
