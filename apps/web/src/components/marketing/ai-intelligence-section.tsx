export function AiIntelligenceSection() {
  return (
    <section
      aria-labelledby="ai-heading"
      style={{
        background: 'var(--color-brand-950)',
        padding: 'clamp(5rem, 9vw, 8rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Background Decorative Lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '20%',
          width: '45rem',
          height: '45rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: '35rem',
          height: '35rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative' }}>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Intelligent Partnership Tools
          </div>
          <h2
            id="ai-heading"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '1rem',
            }}
          >
            Smarter creator discovery. Meaningful collaboration insights.
          </h2>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.125rem)',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.65,
            }}
          >
            Adzunova is building intelligent recommendation tools to help brands identify suitable creators, 
            understand fair pricing benchmarks, and forecast campaign reach — with humans always in full control.
          </p>
        </div>

        {/* Customer Guidance Banner */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.75rem',
          }}
          className="max-w-4xl mx-auto mb-14 flex flex-col sm:flex-row items-center gap-4 text-xs text-white/80"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-bold shrink-0 text-base">
            💡
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="font-bold tracking-wide uppercase text-white text-[0.6875rem]">
              Intelligent Assistance &bull; You Stay in Control
            </span>
            <span className="leading-relaxed">
              Our intelligent tools highlight matching creators and suggest fair rate benchmarks based on market data. 
              <strong> Creators and brands always make the final decisions, negotiate their own terms, and approve every agreement.</strong>
            </span>
          </div>
        </div>

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Creator & Brand Recommendations',
              desc: 'Identifies creators whose audience demographics, creative tone, and past collaborations align with your brand goals.',
              badge: 'Smart Matching',
            },
            {
              title: 'Audience Authenticity Insights',
              desc: 'Flags unusual follower spikes, suspicious comment patterns, and engagement anomalies to ensure authentic creator partnerships.',
              badge: 'Quality Check',
            },
            {
              title: 'Market Rate Guidance',
              desc: 'Suggests fair compensation ranges based on content format, creative scope, channel reach, and exclusivity timelines.',
              badge: 'Rate Guidance',
            },
            {
              title: 'Campaign Reach Estimates',
              desc: 'Provides estimated audience impressions and expected engagement bands before you finalize creator selections.',
              badge: 'Reach Forecasting',
            },
            {
              title: 'Campaign Brief Assistant',
              desc: 'Helps brands write concise, thorough creative briefs so creators clearly understand deliverables from day one.',
              badge: 'Brief Assistant',
            },
            {
              title: 'Partnership Performance Insights',
              desc: 'Analyzes click trends and promo engagement to surface which creative formats delivered the strongest audience resonance.',
              badge: 'Performance Insights',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem',
              }}
              className="flex flex-col justify-between gap-6 hover:bg-white/[0.05] hover:border-white/20 transition-all"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                  <span className="text-[0.625rem] text-white/50">Upcoming Feature</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[0.6875rem] text-white/40">
                <span>Advisory Insights</span>
                <span>User Authorized</span>
              </div>
            </div>
          ))}
        </div>

        {/* Product Roadmap Note */}
        <p className="text-center text-xs text-white/40 max-w-2xl mx-auto">
          Upcoming Capabilities Note: Advanced recommendation tools and automated rate guidance are in active product development 
          and will roll out across upcoming platform releases.
        </p>
      </div>
    </section>
  );
}
