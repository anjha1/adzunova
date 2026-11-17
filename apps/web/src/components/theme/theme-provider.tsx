'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** The resolved theme actually applied to the DOM ('light' | 'dark') */
  resolvedTheme: 'light' | 'dark';
  /** The user's stored preference, including 'system' */
  theme: Theme;
  /** Update the theme and persist to localStorage */
  setTheme: (theme: Theme) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'adzunova-theme';

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredPreference(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return 'system';
}

function resolveTheme(preference: Theme): 'light' | 'dark' {
  return preference === 'system' ? getSystemPreference() : preference;
}

function applyThemeToDOM(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /**
   * Lazy state initializers run on first render (client-side only since
   * this is a 'use client' component). They read localStorage directly,
   * so React's initial state matches what the DOM already has from the
   * inline script. No setState call in effects needed.
   */
  const [theme, setThemeState] = useState<Theme>(getStoredPreference);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(
    () => resolveTheme(getStoredPreference()),
  );

  /**
   * useLayoutEffect: runs after hydration, before paint.
   *
   * Purpose:
   *   1. Re-apply data-theme attribute — necessary because React Strict Mode
   *      (dev only) remounts components and resets <html> attributes that
   *      React doesn't own (the inline script set them). This is a no-op
   *      in production.
   *   2. Subscribe to OS preference changes when theme is 'system'.
   *
   * We do NOT call setState here — state was already initialized correctly
   * by the lazy initializers above.
   *
   * Pattern from Next.js 16 docs:
   *   node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
   */
  useLayoutEffect(() => {
    // Re-apply in case React's dev remount cleared the attribute
    applyThemeToDOM(resolvedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function onSystemChange(e: MediaQueryListEvent) {
      // Only react to OS changes when user preference is 'system'
      if (getStoredPreference() === 'system') {
        const next: 'light' | 'dark' = e.matches ? 'dark' : 'light';
        setResolvedTheme(next);
        applyThemeToDOM(next);
      }
    }

    mediaQuery.addEventListener('change', onSystemChange);
    return () => mediaQuery.removeEventListener('change', onSystemChange);
  }, [resolvedTheme]);

  function setTheme(next: Theme) {
    const resolved = resolveTheme(next);
    setThemeState(next);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <ThemeContext value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
