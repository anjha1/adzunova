'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { MobileNavigation } from './mobile-navigation';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  const signInRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (signInRef.current && !signInRef.current.contains(target)) {
        setSignInOpen(false);
      }
      if (getStartedRef.current && !getStartedRef.current.contains(target)) {
        setGetStartedOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

          {/* Sign In Dropdown */}
          <div className="relative" ref={signInRef}>
            <button
              type="button"
              onClick={() => {
                setSignInOpen((v) => !v);
                setGetStartedOpen(false);
              }}
              className="inline-flex items-center gap-1 justify-center h-9 px-3.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
            >
              <span>Sign In</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`transition-transform duration-150 ${signInOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {signInOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/auth/creator/sign-in"
                  onClick={() => setSignInOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors group"
                >
                  <span className="text-xl">🎨</span>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] group-hover:text-indigo-500 transition-colors">
                      Creator Sign In
                    </div>
                    <div className="text-xs text-[var(--color-fg-muted)]">
                      For YouTubers, influencers & talent
                    </div>
                  </div>
                </Link>

                <Link
                  href="/auth/brand/sign-in"
                  onClick={() => setSignInOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors group mt-1"
                >
                  <span className="text-xl">💼</span>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] group-hover:text-indigo-500 transition-colors">
                      Brand / Agency Sign In
                    </div>
                    <div className="text-xs text-[var(--color-fg-muted)]">
                      For corporate brands & media agencies
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Get Started Dropdown */}
          <div className="relative" ref={getStartedRef}>
            <button
              type="button"
              onClick={() => {
                setGetStartedOpen((v) => !v);
                setSignInOpen(false);
              }}
              className="inline-flex items-center gap-1.5 justify-center h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`transition-transform duration-150 ${getStartedOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {getStartedOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <Link
                  href="/auth/creator/sign-up"
                  onClick={() => setGetStartedOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors group"
                >
                  <span className="text-xl">🚀</span>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] group-hover:text-indigo-500 transition-colors">
                      Join as Creator
                    </div>
                    <div className="text-xs text-[var(--color-fg-muted)]">
                      Claim verified profile & receive brand deals
                    </div>
                  </div>
                </Link>

                <Link
                  href="/auth/brand/sign-up"
                  onClick={() => setGetStartedOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors group mt-1"
                >
                  <span className="text-xl">🏢</span>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-fg-primary)] group-hover:text-indigo-500 transition-colors">
                      Join as Brand
                    </div>
                    <div className="text-xs text-[var(--color-fg-muted)]">
                      Hire vetted creators with escrow safety
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Mobile Compact Actions (640px and below) */}
        <div className="flex desk:hidden items-center gap-1.5 shrink-0">
          <Link
            href="/auth/creator/sign-in"
            className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-semibold text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
          >
            Sign In
          </Link>
          <ThemeToggle />
          <MobileNavigation />
        </div>

      </div>
    </header>
  );
}
