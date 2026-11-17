export function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
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
            Trust &amp; Transparency
          </span>
          <h2
            id="trust-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--color-fg-primary)',
              marginBottom: '1rem',
            }}
          >
            Built on verified profiles and transparent collaboration terms.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
            }}
          >
            Adzunova provides structured verification and clear agreements so brands protect their marketing investments 
            and creators have guaranteed clarity on deliverables and compensation.
          </p>
        </div>

        {/* 2-Column Split: Verification Progression vs Collaboration Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: The Verification Ladder (5 cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <span className="text-sm font-bold text-[var(--color-fg-primary)]">
                Profile Verification Tiers
              </span>
              <span className="text-xs text-[var(--color-fg-muted)]">Trust Progression</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { level: 'Tier 1', title: 'Business & Contact Verification', desc: 'Verified business email domains and contact credentials.', state: 'Active', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
                { level: 'Tier 2', title: 'Connected Social Channel Verification', desc: 'Direct channel links confirming creator identity and ownership.', state: 'Active', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
                { level: 'Tier 3', title: 'Audience Authenticity & Quality Review', desc: 'Ongoing checks for genuine engagement and follower quality.', state: 'In Review', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
                { level: 'Tier 4', title: 'Verified Payment Setup', desc: 'Secure payment setup for prompt disbursements and bank transfers.', state: 'Upcoming', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
                { level: 'Tier 5', title: 'Completed Campaign History', desc: 'On-time delivery track records and authentic partnership reviews.', state: 'Upcoming', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
                { level: 'Tier 6', title: 'Enterprise Brand Partnership Status', desc: 'Dedicated partnership agreements for high-volume marketing teams.', state: 'Enterprise', badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
              ].map((tier, idx) => (
                <div
                  key={tier.level}
                  style={{
                    background: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '0.875rem 1rem',
                  }}
                  className="flex items-start gap-3 border border-transparent hover:border-[var(--color-border)] transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-surface-1)] border border-[var(--color-border)] text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--color-fg-primary)] truncate">
                        {tier.title}
                      </span>
                      <span className={`text-[0.625rem] font-bold px-1.5 py-0.5 rounded ${tier.badge} shrink-0 ml-2`}>
                        {tier.state}
                      </span>
                    </div>
                    <span className="text-[0.6875rem] text-[var(--color-fg-muted)] leading-relaxed">
                      {tier.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Core Guarantees (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: '🔒',
                title: 'Protected Payment Terms',
                detail: 'Project funds are committed before production begins, ensuring creators are guaranteed compensation and brands only release payouts upon approved delivery.',
              },
              {
                icon: '📄',
                title: 'Documented Usage & Licensing Rights',
                detail: 'Agreements clearly specify where and how content can be used, including digital advertising rights, organic posting, and exclusivity timeframes.',
              },
              {
                icon: '🤝',
                title: 'Organized Milestone Approvals',
                detail: 'Every campaign milestone documents agreed briefs, submitted drafts, and revision feedback in one audit-friendly thread so expectations remain clear.',
              },
              {
                icon: '⭐',
                title: 'Authentic Two-Way Reviews',
                detail: 'Creators and brands review each other after completed collaborations, building trusted professional reputations across the marketplace.',
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: 'var(--color-surface-1)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-2xl)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-2xl">{card.icon}</div>
                  <h3 className="text-lg font-bold text-[var(--color-fg-primary)] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {card.detail}
                  </p>
                </div>
                <div className="text-[0.6875rem] text-[var(--color-fg-muted)] pt-2 border-t border-[var(--color-border)]">
                  Standardized Collaboration Safeguards
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-[var(--color-fg-muted)] mt-12 max-w-2xl mx-auto">
          Adzunova helps facilitate transparent creative agreements and payment workflows. Advanced financial escrow and formal 
          compliance features will be available as payment processing integrations launch.
        </p>
      </div>
    </section>
  );
}
