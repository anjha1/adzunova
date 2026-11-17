'use client';

import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { useAuthModal } from '@/components/auth/auth-modal-context';

export function StickyCta() {
  const isMobile = useIsMobile();
  const { openAuth } = useAuthModal();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    function handleSheetToggle(e: Event) {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      setSheetOpen(Boolean(customEvent.detail?.open));
    }
    window.addEventListener('adzunova-mobile-sheet', handleSheetToggle);
    return () => window.removeEventListener('adzunova-mobile-sheet', handleSheetToggle);
  }, []);

  // Display exclusively on mobile viewports (<= 640px) and hide if mobile menu sheet is open
  if (!isMobile || sheetOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-sticky)',
        padding: '0.625rem 1rem',
        background: 'var(--color-surface-overlay)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
      }}
      className="flex items-center justify-between gap-3 shadow-2xl desk:hidden"
    >
      <button
        type="button"
        onClick={() => openAuth({ role: 'creator', mode: 'signup' })}
        className="flex-1 inline-flex items-center justify-center h-10 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs tracking-wide shadow-md active:opacity-90 cursor-pointer"
      >
        Creator? Join free
      </button>

      <button
        type="button"
        onClick={() => openAuth({ role: 'brand', mode: 'signup' })}
        className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-fg-primary)] font-semibold text-xs border border-[var(--color-border)] active:opacity-90"
      >
        Brand
      </button>
    </div>
  );
}
