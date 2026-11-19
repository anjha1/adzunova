'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

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
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
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
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
  }
}

// ---------------------------------------------------------------------------
// Provider (SSR-Safe & Hydration-Safe)
// ---------------------------------------------------------------------------
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Deterministic server/prerender initial state (matches data-theme="light" on <html>)
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Synchronize on mount from the pre-paint DOM attribute or localStorage
  useEffect(() => {
    const domTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const stored = getStoredPreference();
    const resolved = domTheme === 'dark' || domTheme === 'light' ? domTheme : resolveTheme(stored);

    setThemeState(stored);
    setResolvedTheme(resolved);
  }, []);

  // Subscribe to OS preference changes when theme preference is 'system'
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function onSystemChange(e: MediaQueryListEvent) {
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
