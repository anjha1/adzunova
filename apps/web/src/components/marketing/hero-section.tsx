import Link from 'next/link';

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.22) 0%, var(--color-bg-base) 100%)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: 'clamp(4.5rem, 8vw, 7.5rem) 1.5rem clamp(3.5rem, 6vw, 5.5rem)',
          position: 'relative',
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Left Column: Value Proposition & Call to Action (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          {/* Eyebrow badge */}
          <div className="flex items-center gap-2">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'var(--color-brand-50)',
                color: 'var(--color-brand-700)',
                border: '1px solid var(--color-brand-200)',
              }}
              className="dark:bg-brand-950/60 dark:border-brand-800/60 dark:text-brand-300"
            >
              <ShieldCheckIcon />
              Global Creator &amp; Brand Partnership Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: 'var(--color-fg-primary)',
              margin: 0,
            }}
          >
            The complete collaboration platform for{' '}
            <span
              style={{
                background: 'var(--gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              creators &amp; brands.
            </span>
          </h1>

          {/* Customer-Centric Subheading */}
          <p
            style={{
              fontSize: 'clamp(1.0625rem, 1.8vw, 1.25rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
              maxWidth: '38rem',
              margin: 0,
            }}
          >
            Discover verified creative talent, organize campaigns, secure agreements, 
            and track measurable marketing outcomes — all in one connected workspace.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/signup?role=creator"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                height: '3rem',
                padding: '0 1.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                background: 'var(--gradient-brand)',
                boxShadow: 'var(--shadow-brand)',
                letterSpacing: '-0.01em',
              }}
              className="hover:opacity-95 active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2"
            >
              Join Early Access
              <ArrowRightIcon />
            </Link>

            <Link
              href="/solutions/brands"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '3rem',
                padding: '0 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-fg-primary)',
                textDecoration: 'none',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-strong)',
                letterSpacing: '-0.01em',
              }}
              className="hover:bg-[var(--color-surface-2)] active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2"
            >
              Explore Brand Solutions
            </Link>
          </div>

          {/* Trust Micro-Copy */}
          <div className="flex items-center gap-3 pt-1 text-xs text-[var(--color-fg-muted)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Currently welcoming creators, agencies, and brand partners in early access</span>
          </div>
        </div>

        {/* Right Column: Customer Workflow Highlights Card (5 cols) */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
            }}
            className="flex flex-col gap-4 relative"
            aria-label="How Adzunova Works Preview"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-1 text-xs font-semibold text-[var(--color-fg-primary)]">
                  Partnership Workflow
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-brand-50)',
                  color: 'var(--color-brand-700)',
                  border: '1px solid var(--color-brand-200)',
                }}
                className="dark:bg-brand-950 dark:border-brand-800 dark:text-brand-300"
              >
                At a Glance
              </span>
            </div>

            {/* Customer Stages */}
            <div className="flex flex-col gap-2.5">
              {[
                {
                  phase: 'STAGE 01',
                  title: 'Talent Discovery & Verification',
                  detail: 'Find verified creators across YouTube, Instagram, TikTok, and specialized creative disciplines.',
                  status: 'Verified Reach',
                  color: 'text-indigo-600 dark:text-indigo-400',
                  badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
                },
                {
                  phase: 'STAGE 02',
                  title: 'Clear Agreements & Protected Terms',
                  detail: 'Document clear creative deliverables, timelines, and payment terms before production starts.',
                  status: 'Protected Terms',
                  color: 'text-amber-600 dark:text-amber-400',
                  badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
                },
                {
                  phase: 'STAGE 03',
                  title: 'Collaborative Review & Approvals',
                  detail: 'Review draft content, share feedback, and approve finished media in one structured thread.',
                  status: 'Review Queue',
                  color: 'text-blue-600 dark:text-blue-400',
                  badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
                },
                {
                  phase: 'STAGE 04',
                  title: 'On-Time Payments & Results',
                  detail: 'Release creator earnings upon approved delivery and track real campaign performance.',
                  status: 'Reliable Settlement',
                  color: 'text-emerald-600 dark:text-emerald-400',
                  badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
                },
              ].map((step) => (
                <div
                  key={step.phase}
                  style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '0.875rem 1rem',
                  }}
                  className="flex flex-col gap-1.5 transition-colors hover:border-[var(--color-border-strong)]"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.6875rem] font-bold tracking-wider ${step.color}`}>
                      {step.phase}
                    </span>
                    <span className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full ${step.badge}`}>
                      {step.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[var(--color-fg-primary)]">
                    {step.title}
                  </div>
                  <div className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {step.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-1 flex items-center justify-between text-[0.6875rem] text-[var(--color-fg-muted)]">
              <span>Designed for Creators &amp; Brands</span>
              <span>Transparent &amp; Secure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
