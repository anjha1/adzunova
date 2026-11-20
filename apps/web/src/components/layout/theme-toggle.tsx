'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import type { Theme } from '@/components/theme/theme-provider';

function subscribe() {
  return () => {};
}

// ---------------------------------------------------------------------------
// Inline SVG icons — no icon package required
// ---------------------------------------------------------------------------

function SunIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Cycle order: system → light → dark → system
// ---------------------------------------------------------------------------
const CYCLE: Theme[] = ['system', 'light', 'dark'];

function getNextTheme(current: Theme): Theme {
  const idx = CYCLE.indexOf(current);
  return CYCLE[(idx + 1) % CYCLE.length];
}

function getAriaLabel(current: Theme): string {
  const next = getNextTheme(current);
  const labels: Record<Theme, string> = {
    light: 'Switch to dark mode',
    dark: 'Switch to system theme',
    system: 'Switch to light mode',
  };
  return labels[next] ?? `Current theme: ${current}`;
}

// ---------------------------------------------------------------------------
// ThemeToggle
// ---------------------------------------------------------------------------
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  function handleToggle() {
    setTheme(getNextTheme(theme));
  }

  const iconClass = 'h-4 w-4';

  if (!mounted) {
    return (
      <div
        className={[
          'inline-flex items-center justify-center',
          'h-9 w-9 rounded-[var(--radius-md)]',
          'text-[var(--color-fg-secondary)] opacity-0',
          className,
        ].join(' ')}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={getAriaLabel(theme)}
      title={getAriaLabel(theme)}
      className={[
        'inline-flex items-center justify-center',
        'h-9 w-9 rounded-xl',
        'border border-border bg-card/60',
        'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
        'hover:bg-[var(--color-surface-2)]',
        'active:bg-[var(--color-surface-3)]',
        'transition-colors duration-[var(--duration-fast)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2',
        className,
      ].join(' ')}
    >
      {theme === 'light' && <SunIcon className={iconClass} />}
      {theme === 'dark' && <MoonIcon className={iconClass} />}
      {theme === 'system' && <SystemIcon className={iconClass} />}
    </button>
  );
}
