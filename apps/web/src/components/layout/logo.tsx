import Link from 'next/link';

// ---------------------------------------------------------------------------
// Logo — Server Component
// Renders the Adzunova wordmark with a brand gradient accent on the first
// character cluster. No external images required.
// ---------------------------------------------------------------------------

interface LogoProps {
  /** Class applied to the outer <Link> wrapper */
  className?: string;
  /** Whether to show the full wordmark or an abbreviated mark */
  variant?: 'full' | 'mark';
}

export function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'mark') {
    return (
      <Link
        href="/"
        aria-label="Adzunova home"
        className={`inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)] ${className}`}
      >
        {/* Abbreviated "A" mark */}
        <span
          aria-hidden="true"
          style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          className="text-2xl font-bold tracking-tight leading-none select-none"
        >
          A
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Adzunova home"
      className={`inline-flex items-center gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)] ${className}`}
    >
      <span className="sr-only">Adzunova</span>

      {/* Wordmark rendered as SVG-like text spans for precision control */}
      <span
        aria-hidden="true"
        className="flex items-baseline leading-none select-none"
      >
        {/* "Adz" — gradient brand */}
        <span
          style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          className="text-xl font-bold tracking-tight"
        >
          Adz
        </span>
        {/* "unova" — standard foreground */}
        <span className="text-xl font-bold tracking-tight text-[var(--color-fg-primary)]">
          unova
        </span>
      </span>
    </Link>
  );
}
