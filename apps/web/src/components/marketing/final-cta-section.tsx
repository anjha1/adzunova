import Link from 'next/link';

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      style={{
        background: 'var(--color-brand-950)',
        padding: 'clamp(5rem, 10vw, 8.5rem) 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '55rem',
          height: '55rem',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
        className="flex flex-col items-center gap-6"
      >
        {/* Eyebrow */}
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-brand-300)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          Early Access Program
        </span>

        {/* Main Headline */}
        <h2
          id="final-cta-heading"
          style={{
            fontSize: 'clamp(2.25rem, 5.2vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            color: '#ffffff',
            margin: 0,
          }}
        >
          Be part of the next generation of creator collaborations.
        </h2>

        {/* Narrative Description */}
        <p
          style={{
            fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.72)',
            lineHeight: 1.65,
            maxWidth: '42rem',
            margin: 0,
          }}
        >
          Whether you are a creator ready to build your business with verified brand partnerships or a brand looking 
          to scale high-performing creator campaigns, join our early access cohort.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/signup?role=creator"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '3.125rem',
              padding: '0 2rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: 'var(--color-brand-950)',
              textDecoration: 'none',
              background: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              letterSpacing: '-0.01em',
            }}
            className="hover:bg-white/90 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
          >
            Apply for Creator Access
            <ArrowRightIcon />
          </Link>

          <Link
            href="/solutions/brands"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '3.125rem',
              padding: '0 1.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#ffffff',
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              letterSpacing: '-0.01em',
            }}
            className="hover:bg-white/15 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
          >
            Partner as a Brand or Agency
          </Link>
        </div>

        {/* 3 Core Customer Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 w-full mt-6 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">One Connected Platform</span>
            <span className="text-xs text-white/60">Discover talent, manage communications, review deliverables, and track campaign outcomes in one central hub.</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Transparent Payment Workflows</span>
            <span className="text-xs text-white/60">Agreed project compensation committed upfront, guaranteeing reliable and prompt payouts upon approved content delivery.</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Smarter Creator Discovery</span>
            <span className="text-xs text-white/60">Helpful audience insights and market rate guidance to help brands find the right creative partners with complete confidence.</span>
          </div>
        </div>

        {/* Honest Disclosure */}
        <p className="text-xs text-white/40 pt-4">
          Adzunova &bull; Global Creator &amp; Brand Collaboration Marketplace &bull; Copyright &copy; 2026 Adzunova
        </p>
      </div>
    </section>
  );
}
