'use client';

import React, { useRef, useState, useEffect } from 'react';
import { HeroBackground } from './hero/HeroBackground';
import { HeroHeadline } from './hero/HeroHeadline';
import { ServicesClassic } from './services/ServicesClassic';
import { useHeroTimeline } from '@/hooks/useHeroTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroProps {
  onOpenConsultation?: () => void;
  onSelectService?: (serviceTitle: string) => void;
  theme?: 'dark' | 'light';
}

export function Hero({ onOpenConsultation, onSelectService, theme = 'dark' }: HeroProps) {
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
      className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-[#0B0F0D]"
      style={{
        paddingTop: 'clamp(10.5rem, 18vh, 13.5rem)',
        paddingBottom: 'clamp(4rem, 8vh, 6rem)',
      }}
    >
      {/* Background: noise + grid + spotlight + particles (Single unified continuous canvas) */}
      <HeroBackground />

      {/* Hero Headline content - Centered */}
      <div className="relative z-10 w-[95%] max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center text-center mb-14 sm:mb-16">
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

      {/* Services Grid - Unified inside same section with same continuous background */}
      <div id="services" className="relative z-10 w-full">
        <ServicesClassic
          onSelectService={onSelectService || (() => {})}
          theme={theme}
        />
      </div>
    </section>
  );
}
