import Link from 'next/link';

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const FRAGMENTATION_PAIN_POINTS = [
  {
    step: 'Scattered Search',
    problem: 'Browsing multiple social apps manually with no easy way to verify real engagement.',
  },
  {
    step: 'Lost Conversations',
    problem: 'Important partnership terms and briefs getting buried across DMs, personal inboxes, and chat apps.',
  },
  {
    step: 'Unclear Agreements',
    problem: 'Relying on loose email confirmations without documented deliverable deadlines or usage terms.',
  },
  {
    step: 'Payment Uncertainty',
    problem: 'Creators waiting months for invoices while brands worry about paying before content is delivered.',
  },
  {
    step: 'Disorganized Feedback',
    problem: 'Exchanging video drafts through random drive links with conflicting and untracked revision notes.',
  },
  {
    step: 'Unmeasured Results',
    problem: 'Struggling to know whether a partnership actually drove website visitors, engagement, or sales.',
  },
];

export function AudienceSection() {
  return (
    <section
      aria-labelledby="audience-heading"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7rem) 1.5rem',
        background: 'var(--color-bg-base)',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Top Half: Problem Visualization */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-error-600)',
              marginBottom: '0.75rem',
            }}
          >
            The Current Problem
          </span>
          <h2
            id="audience-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--color-fg-primary)',
              marginBottom: '1rem',
            }}
          >
            Creator collaborations are currently scattered across too many disconnected tools.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
            }}
          >
            Both creators and businesses spend valuable hours jumping between direct messages, spreadsheets, 
            and manual bank transfers. Adzunova brings the entire collaboration into one organized platform.
          </p>
        </div>

        {/* The 6 Realities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {FRAGMENTATION_PAIN_POINTS.map((item, idx) => (
            <div
              key={item.step}
              style={{
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem 1.5rem',
              }}
              className="flex items-start gap-3.5 transition-all hover:border-red-300 dark:hover:border-red-900/50"
            >
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-error-50)',
                  color: 'var(--color-error-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '0.125rem',
                }}
                className="dark:bg-red-950/40 dark:text-red-400"
              >
                <CloseIcon />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-bold text-[var(--color-fg-primary)]">
                  {idx + 1}. {item.step}
                </div>
                <div className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  {item.problem}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Half: The Unified Solution for Creators vs Brands */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-600)',
            }}
          >
            One Connected Workspace
          </span>
          <h3
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-fg-primary)',
              marginTop: '0.5rem',
            }}
          >
            Built for both creators and businesses.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: For Creators & Talent */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-brand-200)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(1.75rem, 4vw, 2.75rem)',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="flex flex-col justify-between gap-6 dark:border-brand-900/60"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-brand-600)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-brand-50)',
                  }}
                  className="dark:bg-brand-950/70 dark:text-brand-300"
                >
                  For Creators &amp; Talent
                </span>
                <span className="text-2xl">✨</span>
              </div>

              <h4 className="text-2xl font-bold text-[var(--color-fg-primary)] tracking-tight">
                Grow your creative business with clarity and confidence.
              </h4>
              <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                Connect with quality brands, showcase your authentic audience reach, agree on clear deliverables, 
                and receive timely payments without having to chase outstanding invoices.
              </p>

              <ul className="flex flex-col gap-3 pt-2">
                {[
                  'Professional creator profile and media kit showcasing verified channels',
                  'Clear service rate cards and transparent deliverable timelines',
                  'Protected payment terms agreed before content creation begins',
                  'Documented agreements covering deliverable scopes and content usage rights',
                  'Centralized feedback threads so you always know what revisions are needed',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-[var(--color-fg-primary)]">
                    <span className="text-brand-600 dark:text-brand-400 mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/signup?role=creator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2.75rem',
                  padding: '0 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-700)',
                  background: 'var(--color-brand-50)',
                  border: '1px solid var(--color-brand-200)',
                  width: '100%',
                }}
                className="hover:bg-[var(--color-brand-100)] transition-colors dark:bg-brand-950 dark:border-brand-800 dark:text-brand-300"
              >
                Join as a Creator
              </Link>
            </div>
          </div>

          {/* Card 2: For Brands & Agencies */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-accent-200)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(1.75rem, 4vw, 2.75rem)',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="flex flex-col justify-between gap-6 dark:border-amber-900/60"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-accent-700)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-accent-50)',
                  }}
                  className="dark:bg-amber-950/70 dark:text-amber-300"
                >
                  For Brands, SMBs &amp; Agencies
                </span>
                <span className="text-2xl">🏢</span>
              </div>

              <h4 className="text-2xl font-bold text-[var(--color-fg-primary)] tracking-tight">
                Scale impactful creator partnerships with complete visibility.
              </h4>
              <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                Plan, launch, and manage collaborations with multiple creators simultaneously. 
                Evaluate audience fit, coordinate creative reviews, and measure real campaign impact.
              </p>

              <ul className="flex flex-col gap-3 pt-2">
                {[
                  'Audience discovery filters by platform, niche, geography, and engagement',
                  'Structured campaign briefs outlining deliverables, deadlines, and guidelines',
                  'Team workspaces to coordinate creator outreach and review drafts together',
                  'Organized payment workflows releasing compensation upon approved delivery',
                  'Performance tracking to understand reach, engagement, and campaign outcomes',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-[var(--color-fg-primary)]">
                    <span className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                      <CheckIcon />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)]">
              <Link
                href="/solutions/brands"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2.75rem',
                  padding: '0 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-800)',
                  background: 'var(--color-accent-50)',
                  border: '1px solid var(--color-accent-200)',
                  width: '100%',
                }}
                className="hover:bg-[var(--color-accent-100)] transition-colors dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
              >
                Launch Brand Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
