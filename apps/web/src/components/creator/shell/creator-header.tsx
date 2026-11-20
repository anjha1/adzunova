'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ShellIcon } from './shell-icons';

interface CreatorHeaderProps {
  userEmail?: string;
  displayName?: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

export function CreatorHeader({
  userEmail: initialEmail,
  displayName: initialDisplayName,
  avatarUrl: initialAvatarUrl,
  isVerified: initialVerified,
}: CreatorHeaderProps) {
  const [userEmail, setUserEmail] = useState<string | undefined>(initialEmail);
  const [displayName, setDisplayName] = useState<string | undefined>(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialAvatarUrl);
  const [verificationLabel, setVerificationLabel] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [imgError, setImgError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load real Google/OAuth profile data client-side if not supplied via props
  useEffect(() => {
    let isMounted = true;
    async function loadUserSession() {
      try {
        const [authRes, socialRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/creator/social-account-latest').catch(() => null),
        ]);

        if (authRes.ok && isMounted) {
          const data = await authRes.json();
          if (data?.user) {
            const u = data.user;
            const p = data.profile;
            setUserEmail(u.email);
            setDisplayName(p?.displayName || u.displayName);
            setAvatarUrl(p?.avatarUrl || u.avatarUrl);
          }
        }

        if (socialRes && socialRes.ok && isMounted) {
          const sData = await socialRes.json();
          if (sData.hasConnectedAccount) {
            setVerificationLabel('Instagram verified');
          } else {
            setVerificationLabel(null);
          }
          setUnreadNotifications(sData.unreadNotificationsCount || 0);
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadUserSession();
    return () => {
      isMounted = false;
    };
  }, [initialEmail, initialDisplayName, initialAvatarUrl, initialVerified]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const initials = (displayName?.[0] || userEmail?.[0] || 'C').toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-card/90 backdrop-blur-md px-4 desk:px-6 flex items-center justify-between">
      {/* Mobile brand & search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="desk:hidden flex items-center gap-2">
          <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
            ADZUNOVA
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="hidden desk:flex items-center gap-2 w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground text-xs">
          <ShellIcon name="Search" size={16} />
          <span className="flex-1">Search deals, rate cards, brands, contracts...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-card text-[10px] font-mono border border-border text-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right controls: notifications, theme, user */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-xl border border-border bg-card/60 text-foreground hover:bg-muted transition"
        >
          <ShellIcon name="Bell" size={20} />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-card" />
          )}
        </button>

        {/* Dark/Light Theme Toggle */}
        <ThemeToggle />

        {/* User profile dropdown container */}
        <div className="relative hidden desk:block" ref={menuRef}>
          <button
            type="button"
            data-variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-label="User profile menu"
            className="flex items-center gap-3 pl-2 border-l border-border hover:bg-muted/50 p-1.5 rounded-xl transition cursor-pointer text-left"
          >
            <div className="text-right">
              <div className="text-xs font-bold text-foreground truncate max-w-[140px]">
                {displayName || userEmail || 'Creator'}
              </div>
              {verificationLabel && (
                <div className="text-[10px] flex items-center justify-end gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{verificationLabel}</span>
                </div>
              )}
            </div>

            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={displayName || 'Creator'}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-9 h-9 rounded-xl object-cover border border-border shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                {initials}
              </div>
            )}

            <ShellIcon
              name="ChevronDown"
              size={14}
              className={`text-muted-foreground transition-transform duration-150 ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Interactive Profile Popup Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Profile Card Header -> Links to /creator/profile */}
              <Link
                href="/creator/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted border border-border/50 transition group"
              >
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'Creator'}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-border shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-base shadow-xs shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {displayName || 'Creator Profile'}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {userEmail || 'Click to view profile'}
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    View Public Profile →
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="py-2 space-y-0.5">
                <Link
                  href="/creator/profile"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition"
                >
                  <ShellIcon name="User" size={16} className="text-muted-foreground" />
                  <span>Edit Profile & Media Kit</span>
                </Link>

                <Link
                  href="/creator/accounts"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition"
                >
                  <ShellIcon name="Link" size={16} className="text-muted-foreground" />
                  <span>Connected Social Accounts</span>
                </Link>

                <Link
                  href="/creator/settings"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition"
                >
                  <ShellIcon name="Settings" size={16} className="text-muted-foreground" />
                  <span>Account & Privacy Settings</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-1 border-t border-border" />

              {/* Explicit Sign Out / Logout Action */}
              <form action="/api/auth/logout?redirect=/auth/creator/sign-in" method="POST">
                <button
                  type="submit"
                  data-variant="ghost"
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-destructive bg-destructive/5 hover:bg-destructive/15 transition cursor-pointer text-left"
                >
                  <ShellIcon name="LogOut" size={16} className="text-destructive" />
                  <span>Sign Out / Log Out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
