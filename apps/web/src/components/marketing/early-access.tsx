'use client';

import React, { useState } from 'react';
import { LANDING_CONTENT } from '@/content/landing';
import { Reveal, TiltCard } from '@/components/motion';

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function EarlyAccess() {
  const { earlyAccess } = LANDING_CONTENT;
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'creator' | 'brand'>('creator');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 600);
  }

  return (
    <section
      aria-labelledby="early-access-heading"
      className="py-16 desk:py-28 px-6 bg-[var(--color-brand-950)] text-white relative overflow-hidden"
    >
      <div className="max-w-[80rem] mx-auto relative">
        <div className="grid grid-cols-1 desk:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Highlights */}
          <div className="desk:col-span-6 flex flex-col gap-6 text-left">
            <Reveal delay={50}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-300 bg-white/10 border border-white/15">
                {earlyAccess.badge}
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2
                id="early-access-heading"
                className="text-[clamp(2.25rem,4.8vw,3.75rem)] font-black tracking-tight leading-tight text-white"
              >
                {earlyAccess.headline}
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="text-sm desk:text-base text-white/70 leading-relaxed max-w-lg">
                {earlyAccess.subheadline}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-col gap-3 pt-2">
                {earlyAccess.benefits.map((b) => (
                  <div key={b.title} className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {b.title}
                    </span>
                    <span className="text-xs text-white/60">
                      {b.desc}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Tilt Waitlist Application Card */}
          <div className="desk:col-span-6 flex justify-center w-full">
            <TiltCard className="w-full max-w-md p-8 rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-md shadow-2xl text-left">
              {status === 'success' ? (
                <div className="py-8 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold text-white">Application Received!</h3>
                  <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                    Thank you for applying to the early access cohort. We are reviewing applications sequentially and will reach out with your invitation.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setEmail('');
                      setCompany('');
                    }}
                    className="text-xs font-bold text-brand-300 hover:text-white pt-2 underline"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Request Early Access
                    </h3>
                    <p className="text-xs text-white/60">
                      Join creators and brands participating in early platform testing.
                    </p>
                  </div>

                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRole('creator')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        role === 'creator'
                          ? 'bg-white text-brand-950 font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Creator / Talent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('brand')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        role === 'brand'
                          ? 'bg-white text-brand-950 font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Brand / Agency
                    </button>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="early-email" className="text-xs font-medium text-white/80">
                      Work or Primary Email *
                    </label>
                    <input
                      id="early-email"
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 px-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>

                  {/* Company / Channel Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="early-company" className="text-xs font-medium text-white/80">
                      {role === 'creator' ? 'Primary Channel / Social Handle' : 'Company or Agency Name'}
                    </label>
                    <input
                      id="early-company"
                      type="text"
                      placeholder={role === 'creator' ? '@yourhandle' : 'Acme Brand Co.'}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-11 px-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>

                  {status === 'error' && (
                    <span className="text-xs text-red-400">Please provide a valid email address.</span>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="mt-2 h-11 px-6 rounded-xl bg-white text-brand-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 active:scale-[0.99] transition-all"
                  >
                    <span>{status === 'loading' ? 'Submitting...' : 'Join Early Access Cohort'}</span>
                    <ArrowRightIcon />
                  </button>

                  <span className="text-[0.6875rem] text-center text-white/40">
                    No credit card required &bull; Free early access enrollment
                  </span>
                </form>
              )}
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
