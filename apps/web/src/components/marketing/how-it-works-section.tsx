interface LifecycleGroup {
  groupNumber: string;
  groupTitle: string;
  badge: string;
  summary: string;
  steps: { code: string; title: string; desc: string }[];
  borderClass: string;
  accentBg: string;
  tagColor: string;
}

const LIFECYCLE_GROUPS: LifecycleGroup[] = [
  {
    groupNumber: 'STAGE 01',
    groupTitle: 'Discover & Evaluate',
    badge: 'Connect',
    summary: 'Find relevant talent, review portfolios, and align on initial collaboration goals.',
    borderClass: 'border-indigo-200 dark:border-indigo-900/60',
    accentBg: 'bg-indigo-50/40 dark:bg-indigo-950/20',
    tagColor: 'text-indigo-600 dark:text-indigo-400',
    steps: [
      { code: '01. SEARCH', title: 'Targeted Talent Search', desc: 'Find creators by niche, audience location, creative style, and rates.' },
      { code: '02. VERIFY', title: 'Audience Authenticity', desc: 'Review real engagement metrics and verified past collaboration history.' },
      { code: '03. COMPARE', title: 'Service & Fee Parity', desc: 'Assess rate cards and past creative work side by side.' },
      { code: '04. REACH OUT', title: 'Direct Collaboration Pitch', desc: 'Send campaign invitations with clear creative briefs and requirements.' },
    ],
  },
  {
    groupNumber: 'STAGE 02',
    groupTitle: 'Agree & Create',
    badge: 'Production',
    summary: 'Finalize terms, protect payments, and produce high-quality campaign deliverables.',
    borderClass: 'border-amber-200 dark:border-amber-900/60',
    accentBg: 'bg-amber-50/40 dark:bg-amber-950/20',
    tagColor: 'text-amber-600 dark:text-amber-400',
    steps: [
      { code: '05. NEGOTIATE', title: 'Fair Term Alignment', desc: 'Agree on deliverables, deadlines, and revisions in a single message thread.' },
      { code: '06. AGREE', title: 'Documented Agreements', desc: 'Clear guidelines covering content usage rights and exclusivity timelines.' },
      { code: '07. SECURE', title: 'Protected Project Funding', desc: 'Funds are securely deposited before creators begin filming or designing.' },
      { code: '08. PRODUCE', title: 'Content Draft Staging', desc: 'Submit draft videos and photos with organized, timestamped feedback.' },
    ],
  },
  {
    groupNumber: 'STAGE 03',
    groupTitle: 'Approve & Settle',
    badge: 'Results',
    summary: 'Sign off on finished content, release creator compensation, and track performance.',
    borderClass: 'border-emerald-200 dark:border-emerald-900/60',
    accentBg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    steps: [
      { code: '09. APPROVE', title: 'Formal Creative Sign-Off', desc: 'Review finished deliverables against the agreed campaign brief.' },
      { code: '10. PUBLISH', title: 'Campaign Content Goes Live', desc: 'Distribute content across channels with trackable links and codes.' },
      { code: '11. PAYOUT', title: 'Prompt Payment Release', desc: 'Compensation is released promptly to the creator upon content sign-off.' },
      { code: '12. MEASURE', title: 'Campaign Impact & Insights', desc: 'Evaluate audience reach, clicks, conversions, and partnership success.' },
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7rem) 1.5rem',
        background: 'var(--color-bg-base)',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-brand-600)',
              marginBottom: '0.75rem',
            }}
          >
            How Collaboration Works
          </span>
          <h2
            id="how-it-works-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--color-fg-primary)',
              marginBottom: '1rem',
            }}
          >
            A clear, organized process from first outreach to final results.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
            }}
          >
            Eliminate miscommunication and payment uncertainty. Adzunova guides creators and brands through a 
            structured partnership workflow designed for mutual success.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {LIFECYCLE_GROUPS.map((phase) => (
            <div
              key={phase.groupTitle}
              style={{
                background: 'var(--color-surface-1)',
                borderRadius: 'var(--radius-2xl)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
              className={`flex flex-col justify-between border ${phase.borderClass}`}
            >
              <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className={`text-[0.6875rem] font-bold tracking-wider ${phase.tagColor}`}>
                    {phase.groupNumber}
                  </span>
                  <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-fg-muted)]">
                    {phase.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-1">
                    {phase.groupTitle}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {phase.summary}
                  </p>
                </div>

                {/* Steps List */}
                <div className="flex flex-col gap-3 pt-2">
                  {phase.steps.map((s) => (
                    <div
                      key={s.code}
                      style={{
                        background: 'var(--color-surface-2)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '0.875rem 1rem',
                      }}
                      className="flex flex-col gap-1 border border-transparent hover:border-[var(--color-border)] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[0.6875rem] font-bold text-[var(--color-fg-muted)]">
                          {s.code}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[var(--color-fg-primary)]">
                        {s.title}
                      </div>
                      <div className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step count indicator */}
              <div className="pt-4 mt-6 border-t border-[var(--color-border)] flex items-center justify-between text-[0.6875rem] text-[var(--color-fg-muted)]">
                <span>Structured Milestones</span>
                <span>Transparent Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
