'use client';

import React, { useRef, useState, useEffect } from 'react';
import { HeroBackground } from './hero/HeroBackground';
import { HeroHeadline } from './hero/HeroHeadline';
import { ServicesClassic, ServiceCategory } from './services/ServicesClassic';
import { useHeroTimeline } from '@/hooks/useHeroTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroProps {
  onOpenConsultation?: () => void;
  onSelectService?: (serviceTitle: string) => void;
  theme?: 'dark' | 'light';
  showServicesHeading?: boolean;
}

export function Hero({
  onOpenConsultation,
  onSelectService,
  theme = 'dark',
  showServicesHeading = false,
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  /* ── Refs passed to timeline ── */
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLElement>(null);
  const line2Ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLElement>(null);
  const sublineRef = useRef<HTMLElement>(null);
  const line4Ref = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-screen flex flex-col justify-start overflow-hidden bg-[#0B0F0D] pt-24 sm:pt-32 lg:pt-[clamp(10.5rem,18vh,13.5rem)] pb-16 sm:pb-20 lg:pb-[clamp(4rem,8vh,6rem)]"
    >
      {/* Background: noise + grid + spotlight + particles (Single unified continuous canvas) */}
      <HeroBackground />

      {/* Hero Headline content - Centered */}
      <div className="relative z-10 w-[95%] max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center text-center mb-6 sm:mb-8 lg:mb-14">
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

      {/* Services Section Transition / Intro Header (Between Hero and Services) */}
      {showServicesHeading && (
        <div className="relative z-10 w-[92%] sm:w-[85%] mx-auto flex flex-col items-center text-center mb-6 sm:mb-8 lg:mb-14">
          {/* Pulsing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#16A34A]/10 border border-[#22C55E]/25 text-[#22C55E] text-xs font-mono uppercase tracking-wider mb-2.5 sm:mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span>Explore What We Offer</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4 sm:mb-6 max-w-4xl">
            Everything Under One Roof to{' '}
            <span className="text-gradient">Scale Your Business.</span>
          </h2>

          {/* Category Filter Tabs */}
          <div className="w-full max-w-sm sm:max-w-none grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#111815]/90 border border-[#1A2420] backdrop-blur-md shadow-lg shadow-black/40">
            {[
              { id: 'all' as ServiceCategory, label: 'All Services', count: 8 },
              { id: 'leads' as ServiceCategory, label: 'Leads & Marketing', count: 5 },
              { id: 'development' as ServiceCategory, label: 'Development', count: 2 },
              { id: 'design' as ServiceCategory, label: 'Creative & Design', count: 1 },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative w-full sm:w-auto justify-center px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2 ${isActive
                      ? 'bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] border border-[#22C55E]/40'
                      : 'text-[#9FB0A7] hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <span className="truncate">{cat.label}</span>
                  <span
                    className={`shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md transition-colors ${isActive
                        ? 'bg-black/25 text-[#B6F23D]'
                        : 'bg-[#1A2420] text-[#5B6B63] group-hover:text-[#9FB0A7]'
                      }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Services Grid - Unified inside same section with same continuous background */}
      <div id="services" className="relative z-10 w-full">
        <ServicesClassic
          onSelectService={onSelectService || (() => { })}
          theme={theme}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
}
