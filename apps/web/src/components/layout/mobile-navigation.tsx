'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_ITEMS } from './nav-data';
import { ThemeToggle } from './theme-toggle';
import { useAuthModal } from '@/components/auth/auth-modal-context';

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="w-5 h-5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180 text-brand-600' : 'text-[var(--color-fg-muted)]'}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { openAuth } = useAuthModal();

  // Close the sheet whenever the user taps a link (handled by onClick on each Link)
  function closeSheet() {
    setIsOpen(false);
    setExpandedGroup(null);
  }

  // Lock body scroll while open + escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Broadcast a custom event so StickyCta can hide itself
    window.dispatchEvent(new CustomEvent('adzunova-mobile-sheet', { detail: { open: true } }));

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.dispatchEvent(new CustomEvent('adzunova-mobile-sheet', { detail: { open: false } }));
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function toggleGroup(label: string) {
    setExpandedGroup(expandedGroup === label ? null : label);
  }

  return (
    <>
      {/* Trigger Button: Hamburger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile navigation menu"
        aria-expanded={isOpen}
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] active:scale-95 transition-all cursor-pointer"
      >
        <MenuIcon />
      </button>

      {/* Full-screen animated mobile sheet */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="fixed inset-0 z-[var(--z-modal)] flex flex-col bg-[var(--color-bg-base)]"
          >
            {/* Sheet Top Bar: Logo + ThemeToggle + Close Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between h-16 px-5 border-b border-[var(--color-border)] shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                  A
                </div>
                <span className="font-bold text-lg text-[var(--color-fg-primary)] tracking-tight">
                  Adzunova
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] active:scale-95 transition-all cursor-pointer"
                >
                  <XIcon />
                </button>
              </div>
            </motion.div>

            {/* Scrollable nav items list */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto px-5 py-6 space-y-2"
            >
              {NAV_ITEMS.map((item) => {
                const isGroup = Boolean(item.children && item.children.length > 0);
                const isExpanded = expandedGroup === item.label;

                if (!isGroup && item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={closeSheet}
                      className="flex items-center min-h-[44px] px-3 py-2.5 rounded-xl text-base font-semibold text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className="border-b border-[var(--color-border)]/50 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.label)}
                      className="flex items-center justify-between w-full min-h-[44px] px-3 py-2.5 rounded-xl text-base font-semibold text-[var(--color-fg-primary)] hover:bg-[var(--color-surface-2)] transition-colors text-left cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <span>{item.label}</span>
                      <ChevronDownIcon open={isExpanded} />
                    </button>

                    <AnimatePresence>
                      {isExpanded && item.children && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-3 pr-2 py-1 space-y-1 overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeSheet}
                              className="block min-h-[44px] px-3 py-2 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors"
                            >
                              <div className="text-sm font-medium text-[var(--color-fg-primary)]">
                                {child.label}
                              </div>
                              {child.description && (
                                <div className="text-xs text-[var(--color-fg-muted)] mt-0.5">
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.nav>

            {/* Bottom Actions Container */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface-1)] space-y-2.5 shrink-0"
            >
              <Link
                href="/auth/creator/sign-in"
                onClick={closeSheet}
                className="w-full flex items-center justify-center min-h-[44px] h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
              >
                Creator Portal (Sign In)
              </Link>

              <Link
                href="/auth/brand/sign-in"
                onClick={closeSheet}
                className="w-full flex items-center justify-center min-h-[44px] h-11 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-fg-primary)] font-semibold text-sm border border-[var(--color-border)] active:scale-[0.98] transition-all"
              >
                Brand &amp; Agency Portal (Sign In)
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
