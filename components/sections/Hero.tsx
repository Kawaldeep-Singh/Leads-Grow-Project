'use client';

import React, { useRef, useState, useEffect } from 'react';
import { HeroBackground } from './hero/HeroBackground';
import { HeroHeadline } from './hero/HeroHeadline';
import { GrowthChart } from './hero/GrowthChart';
import { useHeroTimeline } from '@/hooks/useHeroTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroProps {
  onOpenConsultation?: () => void;
}

export function Hero({ onOpenConsultation }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  /* ── Refs passed to timeline ── */
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLElement>(null);
  const line1Ref    = useRef<HTMLElement>(null);
  const line2Ref    = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const sublineRef  = useRef<HTMLElement>(null);
  const line4Ref    = useRef<HTMLElement>(null);
  const taglineRef  = useRef<HTMLElement>(null);
  const buttonsRef  = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLElement>(null);
  const chartRef    = useRef<HTMLDivElement>(null);

  /* ── Counter trigger (fires when intro timeline finishes) ── */
  const [countersTriggered, setCountersTriggered] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion) {
      setCountersTriggered(true);
      return;
    }

    const fireCounters = () => {
      setTimeout(() => setCountersTriggered(true), 1800);
    };

    const isPreloaded = typeof window !== 'undefined' && sessionStorage.getItem('lg-preloaded') === 'true';
    const navEntry = (typeof performance !== 'undefined' && performance.getEntriesByType)
      ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      : undefined;
    const isReload = navEntry?.type === 'reload';

    if (isPreloaded && !isReload) {
      fireCounters();
    } else {
      window.addEventListener('leadsgrow:preloaderComplete', fireCounters, { once: true });
      const fallback = setTimeout(fireCounters, 4500);
      return () => {
        clearTimeout(fallback);
        window.removeEventListener('leadsgrow:preloaderComplete', fireCounters);
      };
    }
  }, [prefersReducedMotion]);

  /* ── Master GSAP timeline ── */
  useHeroTimeline({
    badgeRef,
    line1Ref,
    line2Ref,
    headlineRef,
    sublineRef,
    line4Ref,
    taglineRef,
    buttonsRef,
    countersRef,
    chartRef: chartRef as React.RefObject<HTMLElement | null>,
    sectionRef,
    prefersReducedMotion,
  });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0B0F0D]"
      style={{ paddingTop: 'clamp(6.5rem, 13vh, 10rem)', paddingBottom: 'clamp(4rem, 8vh, 6rem)' }}
    >
      {/* Background: noise + grid + spotlight + particles */}
      <HeroBackground />

      {/* Content grid */}
      <div className="relative z-10 w-[85%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── Left: Text content (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col">
            <HeroHeadline
              badgeRef={badgeRef}
              line1Ref={line1Ref}
              line2Ref={line2Ref}
              headlineRef={headlineRef}
              sublineRef={sublineRef}
              line4Ref={line4Ref}
              taglineRef={taglineRef}
              buttonsRef={buttonsRef}
              countersRef={countersRef}
              onOpenConsultation={onOpenConsultation}
              countersTriggered={countersTriggered}
            />
          </div>

          {/* ── Right: Growth chart (5 cols, slightly overflows right on desktop) ── */}
          <div
            className="lg:col-span-5 w-full flex justify-center lg:justify-end"
            style={{ marginRight: 'clamp(0px, -2vw, -32px)' }}
          >
            <div className="w-full max-w-[500px]">
              <GrowthChart chartRef={chartRef} />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={async () => {
          const { default: gsap } = await import('gsap');
          const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
          gsap.registerPlugin(ScrollToPlugin);
          gsap.to(window, { duration: 1.2, scrollTo: '#stats', ease: 'power3.inOut' });
        }}
        role="button"
        aria-label="Scroll to next section"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#9FB0A7]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#22C55E]/60 to-transparent animate-bounce-slow" />
      </div>
    </section>
  );
}
