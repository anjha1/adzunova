'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Logo } from '@/components/brand/Logo';
import { BrandShellIcon } from './brand-shell-icons';
import { BrandWorkspaceSwitcher, BrandEntity } from './brand-workspace-switcher';
import { BrandUserRole } from './brand-nav-config';

interface BrandHeaderProps {
  userEmail?: string;
  companyName?: string;
  contactName?: string;
  role?: BrandUserRole;
  verificationLabel?: string;
  unreadCount?: number;
  approvalsCount?: number;
  entities?: BrandEntity[];
  isAgency?: boolean;
  onOpenSearch: () => void;
}

export function BrandHeader({
  userEmail,
  companyName,
  contactName,
  role = 'OWNER',
  verificationLabel,
  unreadCount = 0,
  approvalsCount = 0,
  entities = [],
  isAgency = false,
  onOpenSearch,
}: BrandHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const initials = (companyName?.[0] || contactName?.[0] || userEmail?.[0] || 'B').toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/90 backdrop-blur-md px-4 desk:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Logo & Workspace Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="desk:hidden shrink-0">
          <Logo variant="mark" size={26} href="/brand/dashboard" />
        </div>

        <BrandWorkspaceSwitcher
          currentBrandName={companyName || userEmail?.split('@')[0] || 'Workspace'}
          entities={entities}
          isAgency={isAgency}
        />
      </div>

      {/* Middle: Global Search Trigger (Ctrl/Cmd+K) */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BrandShellIcon name="Search" size={15} />
            <span className="truncate">Search brand tools, campaigns...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-md border border-border bg-card font-mono text-[10px]">
              Ctrl
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded-md border border-border bg-card font-mono text-[10px]">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open search"
          className="sm:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
        >
          <BrandShellIcon name="Search" size={18} />
        </button>

        {/* Approvals Inbox (Badge hidden if 0) */}
        <Link
          href="/brand/content-review"
          aria-label="Pending Approvals"
          title="Pending Approvals"
          className="relative p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center"
        >
          <BrandShellIcon name="CheckSquare" size={18} />
          {approvalsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center leading-none">
              {approvalsCount}
            </span>
          )}
        </Link>

        {/* Notification Bell (Badge hidden if 0) */}
        <Link
          href="/brand/dashboard"
          aria-label="Notifications"
          title="Notifications"
          className="relative p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center"
        >
          <BrandShellIcon name="Bell" size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 rounded-full bg-primary text-primary-foreground font-bold text-[9px] flex items-center justify-center leading-none">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full border border-border hover:bg-muted text-foreground transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="hidden desk:block text-left pr-1.5 min-w-0 max-w-[120px]">
              <div className="text-xs font-semibold truncate leading-tight">
                {companyName || contactName || userEmail?.split('@')[0]}
              </div>
              <div className="text-[10px] text-muted-foreground truncate leading-tight">
                {role}
              </div>
            </div>
            <BrandShellIcon
              name="ChevronDown"
              size={13}
              className={`hidden desk:block text-muted-foreground transition-transform duration-200 ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-border/60">
                <div className="text-xs font-bold text-foreground truncate">
                  {companyName || 'Brand Workspace'}
                </div>
                <div className="text-[11px] text-muted-foreground truncate font-mono">
                  {userEmail}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                    {role}
                  </span>
                  {verificationLabel && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                      {verificationLabel}
                    </span>
                  )}
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/brand/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted transition"
                >
                  <BrandShellIcon name="Settings" size={15} className="text-muted-foreground" />
                  <span>Workspace Settings</span>
                </Link>
                <Link
                  href="/brand/team"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted transition"
                >
                  <BrandShellIcon name="Users" size={15} className="text-muted-foreground" />
                  <span>Team & Permissions</span>
                </Link>
                <Link
                  href="/brand/safety"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted transition"
                >
                  <BrandShellIcon name="ShieldCheck" size={15} className="text-muted-foreground" />
                  <span>Brand Safety & Security</span>
                </Link>
                <Link
                  href="/brand/help"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted transition"
                >
                  <BrandShellIcon name="LifeBuoy" size={15} className="text-muted-foreground" />
                  <span>Help & Support</span>
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-border">
                <form action="/api/auth/logout?redirect=/auth/brand/sign-in" method="POST">
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 font-semibold transition cursor-pointer text-left"
                  >
                    <BrandShellIcon name="LogOut" size={15} />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
