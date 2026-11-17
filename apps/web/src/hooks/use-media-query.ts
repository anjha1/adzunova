'use client';

import { useSyncExternalStore } from 'react';

function subscribeToMedia(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

/**
 * Modern React 19 / Next.js 16 SSR-safe useSyncExternalStore hook.
 * Completely eliminates setState-in-effect cascading renders and hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribeToMedia(query, callback),
    () => window.matchMedia(query).matches,
    () => false // Server-side initial snapshot
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)');
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
