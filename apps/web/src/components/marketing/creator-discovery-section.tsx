import Link from 'next/link';

interface TalentCluster {
  category: string;
  badge: string;
  summary: string;
  types: { title: string; meta: string; icon: string }[];
  accentClass: string;
}

const TALENT_ECOSYSTEM: TalentCluster[] = [
  {
    category: 'Social Media & Video Creators',
    badge: 'Audience & Reach',
    summary: 'Content storytellers with engaged communities across major video, streaming, and social networks.',
    accentClass: 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300',
    types: [
      { title: 'YouTube Creators & Reviewers', meta: 'Dedicated video reviews, tutorials & integrations', icon: '📹' },
      { title: 'Instagram & TikTok Creators', meta: 'Short-form videos, Reels, Stories & viral trends', icon: '📱' },
      { title: 'Podcasters & Audio Hosts', meta: 'Host-read endorsements & interview sponsorships', icon: '🎙️' },
      { title: 'Gaming & Live Streamers', meta: 'Real-time live mentions & interactive gameplay sessions', icon: '🎮' },
      { title: 'Professional & Business Creators', meta: 'Industry analysis, career insights & B2B commentary', icon: '💼' },
      { title: 'Lifestyle & Visual Curators', meta: 'Aesthetic photo carousels & shopping lookbooks', icon: '📌' },
    ],
  },
  {
    category: 'Creative Specialists & Artists',
    badge: 'Production & Talent',
    summary: 'Talented specialists delivering professional media production, visual assets, and authentic storytelling.',
    accentClass: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    types: [
      { title: 'UGC Content Specialists', meta: 'Authentic product videos and customer testimonials for digital ads', icon: '🎬' },
      { title: 'Actors & Screen Performers', meta: 'Commercial acting, script reading & character presence', icon: '🎭' },
      { title: 'Commercial Photographers', meta: 'High-resolution product, lifestyle & fashion photography', icon: '📸' },
      { title: 'Musicians & Voice Artists', meta: 'Voice-over narration, custom sound design & original tracks', icon: '🎵' },
      { title: 'Fashion Models & Stylists', meta: 'Lookbook modeling, apparel styling & seasonal showcases', icon: '✨' },
      { title: 'Video Editors & Motion Designers', meta: 'Dynamic video editing, visual effects & creative polish', icon: '🎞️' },
    ],
  },
  {
    category: 'Industry Experts & Educators',
    badge: 'Knowledge & Authority',
    summary: 'Subject matter leaders whose verified expertise builds credibility and customer confidence.',
    accentClass: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    types: [
      { title: 'Technology & Software Experts', meta: 'Developer tools, software walk-throughs & tech evaluations', icon: '💻' },
      { title: 'Health & Wellness Specialists', meta: 'Certified fitness coaches, nutritionists & wellness guidance', icon: '🩺' },
      { title: 'Business & Finance Educators', meta: 'Personal finance tips, market insights & business tutorials', icon: '📊' },
      { title: 'Teachers & Course Creators', meta: 'Educational workshops, learning series & practical guides', icon: '🎓' },
      { title: 'E-commerce & Brand Consultants', meta: 'Product recommendations, store growth & shopping advice', icon: '🚀' },
      { title: 'Keynote & Event Speakers', meta: 'Live event hosting, conference talks & brand ambassadors', icon: '🎤' },
    ],
  },
];

export function CreatorDiscoverySection() {
  return (
    <section
      aria-labelledby="discovery-heading"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7rem) 1.5rem',
        background: 'var(--color-bg-subtle)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-600)',
              }}
            >
              Creative Diversity
            </span>
            <h2
              id="discovery-heading"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--color-fg-primary)',
              }}
            >
              Beyond social media influencers. Built for all creative talent.
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--color-fg-secondary)',
                lineHeight: 1.65,
              }}
            >
              Adzunova supports the full breadth of the creative economy — connecting businesses with YouTubers, 
              actors, models, UGC specialists, photographers, voice artists, and subject matter experts.
            </p>
          </div>

          <Link
            href="/creators"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'var(--color-brand-700)',
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-brand-200)',
              whiteSpace: 'nowrap',
            }}
            className="hover:bg-[var(--color-brand-50)] transition-colors dark:border-brand-800 dark:text-brand-300 dark:hover:bg-brand-950"
          >
            Explore Talent Directory
          </Link>
        </div>

        {/* 3 Major Clusters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {TALENT_ECOSYSTEM.map((cluster) => (
            <div
              key={cluster.category}
              style={{
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-2xl)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
              className="flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[0.6875rem] font-bold px-2.5 py-1 rounded-full border ${cluster.accentClass}`}>
                    {cluster.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[var(--color-fg-primary)] tracking-tight mb-1.5">
                    {cluster.category}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-secondary)] leading-relaxed">
                    {cluster.summary}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
                  {cluster.types.map((type) => (
                    <div
                      key={type.title}
                      style={{
                        background: 'var(--color-surface-2)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.625rem 0.875rem',
                      }}
                      className="flex items-start gap-2.5 border border-transparent hover:border-[var(--color-border)] transition-colors"
                    >
                      <span className="text-base shrink-0 mt-0.5">{type.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-[var(--color-fg-primary)] truncate">
                          {type.title}
                        </span>
                        <span className="text-[0.6875rem] text-[var(--color-fg-muted)] leading-tight">
                          {type.meta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[0.6875rem] text-[var(--color-fg-muted)] pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <span>Direct Profile Reviews</span>
                <span>Transparent Deliverable Pricing</span>
              </div>
            </div>
          ))}
        </div>

        {/* Discovery Filter Capability Strip */}
        <div
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
          }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-fg-secondary)]"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span className="font-semibold text-[var(--color-fg-primary)]">
              Smart Search &amp; Filters:
            </span>
            <span>Filter by platform, content niche, geographic reach, audience size, and clear fee ranges.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[0.6875rem]">
              Authentic Audiences
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[0.6875rem]">
              Global Opportunities
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
