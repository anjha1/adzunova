export function CapabilitiesSection() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7rem) 1.5rem',
        background: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
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
            Platform Solutions
          </span>
          <h2
            id="capabilities-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--color-fg-primary)',
              marginBottom: '1rem',
            }}
          >
            Everything you need to run creator partnerships smoothly.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
            }}
          >
            From independent creator rate cards to full agency marketing workspaces, every tool works 
            together to keep collaborations organized and accountable.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Talent Discovery (8 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-8 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  Creator Marketplace
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Discovery &amp; Search</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                  Targeted Creator Search &amp; Audience Insights
                </h3>
                <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed max-w-xl">
                  Browse verified creator profiles across YouTube, TikTok, Instagram, and specialized creative fields. 
                  Filter with confidence by audience demographics, engagement consistency, price tier, and creative focus.
                </p>
              </div>

              {/* Contained Preview Box */}
              <div
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1rem 1.25rem',
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
              >
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Niche Focus</span>
                  <span className="font-semibold text-[var(--color-fg-primary)]">Tech &amp; Gaming</span>
                </div>
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Engagement</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">&gt; 4.8% Real Reach</span>
                </div>
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Audience Region</span>
                  <span className="font-semibold text-[var(--color-fg-primary)]">North America &amp; UK</span>
                </div>
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block mb-1">Channel Audit</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Verified Channels</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)]">
              <span>Supports 20+ creative disciplines</span>
              <span>Direct Profile Connections</span>
            </div>
          </div>

          {/* Bento Card 2: Campaign Operations (4 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-4 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Campaign Management
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Workflow Coordination</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                  Milestone-Gated Deliverables
                </h3>
                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  Manage multiple creator deliverables effortlessly with structured review stages, 
                  clear feedback notes, and organized sign-offs.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {['Campaign Brief Dispatched', 'Deliverables Submitted (2/3)', 'Creative Sign-Off'].map((status) => (
                  <div key={status} className="flex items-center justify-between text-xs p-2 rounded bg-[var(--color-surface-2)]">
                    <span className="text-[var(--color-fg-primary)] font-medium">{status}</span>
                    <span className="text-[0.625rem] font-semibold text-emerald-600 dark:text-emerald-400">✓ On Schedule</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)]">
              Organized revisions and milestone tracking
            </div>
          </div>

          {/* Bento Card 3: Protected Payments (4 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-4 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Payment Protection
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Protected Payouts</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                  Secure Project Funding
                </h3>
                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  Campaign compensation is deposited securely when agreements are finalized, 
                  giving creators complete confidence and releasing promptly once work is approved.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs">
                <div className="flex justify-between text-[var(--color-fg-muted)] mb-1">
                  <span>Secured Project Budget:</span>
                  <span className="text-emerald-600 font-bold">$12,500.00</span>
                </div>
                <div className="flex justify-between text-[var(--color-fg-muted)]">
                  <span>Payment Condition:</span>
                  <span className="text-indigo-600 font-bold">Release Upon Approval</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)]">
              Protects both creator compensation and brand investment
            </div>
          </div>

          {/* Bento Card 4: Clear Contracts & Usage Rights (4 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-4 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Agreements &amp; Rights
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Clear Terms</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                  Documented Content &amp; Usage Rights
                </h3>
                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  Simple, documented collaboration agreements outlining deliverable formats, content revision counts, 
                  advertising whitelisting rights, and duration timelines.
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-[var(--color-fg-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Clear Content Ownership &amp; Usage Licenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Agreed Review &amp; Revision Rounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Documented Brand Guidelines</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)]">
              Prevents ambiguity before work begins
            </div>
          </div>

          {/* Bento Card 5: Performance Analytics (4 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
            className="lg:col-span-4 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Performance Tracking
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Marketing Impact</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-2">
                  Campaign Insights &amp; Engagement
                </h3>
                <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                  Measure what matters across your creative partnerships — from views and engagement rates to 
                  trackable promotional links and campaign reach.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block">Tracked Engagement</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">4.8% Average</span>
                </div>
                <div className="text-right">
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] block">Audience Feedback</span>
                  <span className="text-sm font-semibold text-[var(--color-fg-primary)]">Highly Positive</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)]">
              Understand partnership performance clearly
            </div>
          </div>

          {/* Bento Card 6: Agency & Team Management (12 Cols) */}
          <div
            style={{
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem 2.5rem',
            }}
            className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex flex-col gap-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[0.6875rem] font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  Agencies &amp; Teams
                </span>
                <span className="text-xs text-[var(--color-fg-muted)]">Multi-Brand Coordination</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-fg-primary)] tracking-tight">
                Built for agencies and growing marketing organizations.
              </h3>
              <p className="text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                Coordinate multiple client brands, assign team members to specific campaigns, manage collective budgets, 
                and keep all creator communications organized in centralized company workspaces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg-muted)]">
                Multi-User Workspaces
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg-muted)]">
                Client Brand Management
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
