'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import { usePrefersReducedMotion, useIsMobile } from '@/hooks/use-media-query';

interface CreatorCardData {
  id: string;
  name: string;
  niche: string;
  reach: string;
  engagement: string;
  rate: string;
}

const SAMPLE_CREATORS: CreatorCardData[] = [
  {
    id: '1',
    name: 'Maya Chen',
    niche: 'Tech & Lifestyle',
    reach: '840K Subs',
    engagement: '5.8% Eng.',
    rate: '₹80K Base',
  },
  {
    id: '2',
    name: 'Jordan Fields',
    niche: 'Software & Dev',
    reach: '420K Subs',
    engagement: '6.4% Eng.',
    rate: '₹1.1L Base',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    niche: 'AI & Creative',
    reach: '620K Follows',
    engagement: '7.1% Eng.',
    rate: '₹65K Base',
  },
  {
    id: '4',
    name: 'Marcus Vance',
    niche: 'Longform Reviews',
    reach: '1.2M Subs',
    engagement: '5.1% Eng.',
    rate: '₹1.4L Base',
  },
];

export function HeroNetworkScene() {
  const [activeFlipped, setActiveFlipped] = useState<string | null>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // Drag interaction handlers to rotate orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startAngleRef.current = orbitAngle;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // 1px delta = 0.008 radians
    setOrbitAngle(startAngleRef.current + deltaX * 0.008);
  }, []);

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Continuous auto rotation unless user is dragging or prefers reduced motion
  useEffect(() => {
    if (reducedMotion) return;
    let animId: number;
    function autoRotate() {
      if (!isDraggingRef.current) {
        setOrbitAngle((prev) => prev + 0.003);
      }
      animId = requestAnimationFrame(autoRotate);
    }
    animId = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion]);

  // Background WebGL-style Canvas orbit geometry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isDestroyed = false;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      if (isDestroyed || !ctx || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Draw Elliptical Orbit Rings
      ctx.save();
      ctx.translate(cx, cy);

      // Outer orbit guide
      ctx.beginPath();
      ctx.ellipse(0, 0, isMobile ? 130 : 155, isMobile ? 80 : 95, 0, 0, Math.PI * 2);
      ctx.strokeStyle = resolvedTheme === 'dark' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(79, 70, 229, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.stroke();

      // Inner faint ring
      ctx.beginPath();
      ctx.ellipse(0, 0, isMobile ? 85 : 100, isMobile ? 50 : 60, 0, 0, Math.PI * 2);
      ctx.strokeStyle = resolvedTheme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)';
      ctx.stroke();
      ctx.restore();

      // Central Adzunova Nexus Orb
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 28);
      grad.addColorStop(0, '#a5b4fc');
      grad.addColorStop(0.4, '#6366f1');
      grad.addColorStop(1, '#312e81');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = resolvedTheme === 'dark' ? 24 : 12;
      ctx.fill();
      ctx.restore();

      // Core typography
      ctx.font = '800 8px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('ADZUNOVA', cx, cy + 3);

      ctx.restore();
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [resolvedTheme, reducedMotion, isMobile]);

  const displayedCards = isMobile ? SAMPLE_CREATORS.slice(0, 3) : SAMPLE_CREATORS;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full min-h-[290px] max-h-[350px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none"
      aria-label="Interactive 3D Creator Orbit. Drag to rotate, tap cards to flip."
    >
      {/* Background Orbit Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Orbiting Interactive 3D Flip Cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {displayedCards.map((card, idx) => {
          const isFlipped = activeFlipped === card.id;
          const total = displayedCards.length;
          const theta = orbitAngle + (idx / total) * Math.PI * 2;
          
          const rx = isMobile ? 125 : 155;
          const ry = isMobile ? 75 : 95;
          const x = Math.cos(theta) * rx;
          const y = Math.sin(theta) * ry;

          // Depth sorting and scale for true 3D orbital feel
          // sin(theta) represents depth: front is > 0, back is < 0
          const depth = Math.sin(theta);
          const scale = 0.85 + 0.25 * ((depth + 1) / 2);
          const zIndex = Math.round((depth + 1) * 20) + 1;
          const opacity = 0.75 + 0.25 * ((depth + 1) / 2);

          return (
            <div
              key={card.id}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className="absolute pointer-events-auto transition-transform duration-75 ease-out"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFlipped(isFlipped ? null : card.id);
                }}
                className={`w-32 desk:w-36 h-20 rounded-xl border p-2 flex flex-col justify-between shadow-md transition-all duration-300 cursor-pointer ${
                  isFlipped
                    ? 'bg-brand-600 text-white border-brand-400 rotate-y-180'
                    : 'bg-[var(--color-surface-1)] border-[var(--color-border)] text-[var(--color-fg-primary)] hover:border-brand-500'
                }`}
              >
                {!isFlipped ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-[10px] flex items-center justify-center">
                        {card.name.charAt(0)}
                      </div>
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold truncate leading-tight">
                        {card.name}
                      </div>
                      <div className="text-[9px] text-[var(--color-fg-muted)] truncate">
                        {card.niche}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] pt-1 border-t border-[var(--color-border)]/50">
                      <span className="font-semibold text-[var(--color-fg-secondary)]">{card.reach}</span>
                      <span className="text-brand-600 dark:text-brand-300 font-bold">Tap &rarr;</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full text-white">
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <span>AUDITED</span>
                      <span className="text-emerald-300 font-bold">LIVE</span>
                    </div>
                    <div className="text-[11px] font-bold">{card.engagement}</div>
                    <div className="text-[9px] opacity-90">{card.rate}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
