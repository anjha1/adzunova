'use client';

import React, { useEffect, useState } from 'react';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { MobileNavigation } from './mobile-navigation';
import { ThemeToggle } from './theme-toggle';
import { useAuthModal } from '@/components/auth/auth-modal-context';

export function Header() {
  const { openAuth } = useAuthModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/85 backdrop-blur-xl transition-all duration-200 ${
        scrolled ? 'h-14 shadow-sm' : 'h-16'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 desk:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="shrink-0 flex items-center">
          <Logo />
        </div>

        {/* Centre: Desktop & Tablet Navigation */}
        <div className="flex-1 hidden desk:flex items-center justify-center min-w-0">
          <Navigation />
        </div>

        {/* Right: Desktop Actions (641px and above) */}
        <div className="hidden desk:flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => openAuth({ mode: 'signin' })}
            className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg text-sm font-medium text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => openAuth({ role: 'creator', mode: 'signup' })}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            Get Started Free
          </button>
        </div>

        {/* Right: Mobile Compact Actions (640px and below) */}
        <div className="flex desk:hidden items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => openAuth({ mode: 'signin' })}
            className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-semibold text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <ThemeToggle />
          <MobileNavigation />
        </div>

      </div>
    </header>
  );
}
