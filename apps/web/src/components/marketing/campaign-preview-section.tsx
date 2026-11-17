export function CampaignPreviewSection() {
  return (
    <section
      aria-labelledby="campaign-preview-heading"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7rem) 1.5rem',
        background: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
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
            Campaign Management Preview
          </span>
          <h2
            id="campaign-preview-heading"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--color-fg-primary)',
              marginBottom: '1rem',
            }}
          >
            A central dashboard for all your creator partnerships.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'var(--color-fg-secondary)',
              lineHeight: 1.65,
            }}
          >
            Coordinate multiple creators, track deliverable milestones, review submitted content, 
            and manage partnership payouts from a clean, unified workspace.
          </p>
        </div>

        {/* Detailed High-Fidelity Cockpit Mockup */}
        <div
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden',
          }}
          className="max-w-5xl mx-auto"
          aria-label="Illustrative Campaign Management Dashboard"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-semibold text-[var(--color-fg-muted)]">
                adzunova.com/dashboard/campaigns/summer-collection-2026
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                SAMPLE PREVIEW
              </span>
              <span className="text-xs text-[var(--color-fg-muted)]">Live Workflow View</span>
            </div>
          </div>

          {/* Cockpit Interior */}
          <div className="p-6 md:p-8 flex flex-col gap-8">
            {/* Campaign Summary Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-xl font-bold text-[var(--color-fg-primary)]">
                    Summer Global Product Showcase 2026
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active Campaign
                  </span>
                </div>
                <p className="text-xs text-[var(--color-fg-secondary)]">
                  Multi-channel creator campaign across YouTube, Instagram &amp; TikTok &bull; Target Audience: 1.2M+ Reach
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] uppercase tracking-wider block">Campaign Budget</span>
                  <span className="text-lg font-bold text-[var(--color-fg-primary)]">$48,500.00</span>
                </div>
                <div>
                  <span className="text-[0.6875rem] text-[var(--color-fg-muted)] uppercase tracking-wider block">Deliverables</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">4 / 6 Approved</span>
                </div>
              </div>
            </div>

            {/* Campaign Workflow Progress Visualizer */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-[var(--color-fg-secondary)] font-medium">
                <span>Campaign Progress: Content Review &amp; Staging</span>
                <span>Stage 8 of 12</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--color-surface-2)] overflow-hidden flex">
                <div className="h-full bg-emerald-500 w-1/4" title="Brief & Terms Complete" />
                <div className="h-full bg-emerald-500 w-1/4" title="Agreements Signed" />
                <div className="h-full bg-indigo-500 w-1/6" title="Draft Reviews In Progress" />
                <div className="h-full bg-transparent flex-1" />
              </div>
            </div>

            {/* Creator Roster Management Table */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-[var(--color-fg-muted)] uppercase tracking-wider">
                Partnered Creators (3 of 6 shown)
              </span>

              <div className="flex flex-col gap-2.5">
                {[
                  {
                    name: 'Maya Chen',
                    handle: '@mayachen_lifestyle',
                    platform: 'Instagram Video & Stories',
                    deliverable: '2x Carousel Posts + 3x Stories',
                    status: 'Content Approved',
                    statusClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    budget: '$8,500.00',
                    action: 'Payout Scheduled',
                  },
                  {
                    name: 'Jordan Fields',
                    handle: '@jordanfields_tech',
                    platform: 'YouTube Tech Review',
                    deliverable: '1x Dedicated Review Video (12 min)',
                    status: 'Revision 2 Submitted',
                    statusClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                    budget: '$16,000.00',
                    action: 'Review Pending',
                  },
                  {
                    name: 'Priya Kapoor',
                    handle: '@priyakap_fitness',
                    platform: 'TikTok Short-Form Video',
                    deliverable: '3x High-Energy Workout Reels',
                    status: 'Content in Production',
                    statusClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    budget: '$6,000.00',
                    action: 'Due in 3 Days',
                  },
                ].map((row) => (
                  <div
                    key={row.handle}
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1rem 1.25rem',
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--color-fg-primary)] text-sm">{row.name}</span>
                        <span className="text-[var(--color-fg-muted)]">{row.platform} &bull; {row.handle}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:text-right">
                      <span className="font-medium text-[var(--color-fg-secondary)]">{row.deliverable}</span>
                      <div className="flex items-center gap-2 sm:justify-end mt-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${row.statusClass}`}>
                          {row.status}
                        </span>
                        <span className="font-semibold text-[var(--color-fg-primary)]">{row.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Dashboard Status Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[var(--color-border)] text-xs text-[var(--color-fg-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Protected Payment Terms</span>
                <span>&bull;</span>
                <span>Documented Creative Guidelines</span>
              </div>
              <span className="text-[0.6875rem]">Illustrative Interface Demonstration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
