'use client';

import React, { useRef, useEffect } from 'react';
import { HeadlineSequencer } from './HeadlineSequencer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─── MAIN PROPS ────────────────────────────────────────────── */
interface HeroHeadlineProps {
  badgeRef?: React.RefObject<HTMLElement | null>;
  line1Ref?: React.RefObject<HTMLElement | null>;
  line2Ref?: React.RefObject<HTMLElement | null>;
  headlineRef?: React.RefObject<HTMLElement | null>;
  sublineRef?: React.RefObject<HTMLElement | null>;
  line4Ref?: React.RefObject<HTMLElement | null>;
  taglineRef?: React.RefObject<HTMLElement | null>;
  buttonsRef: React.RefObject<HTMLElement | null>;
  countersRef?: React.RefObject<HTMLElement | null>;
  onOpenConsultation?: () => void;
  countersTriggered?: boolean;
}

export function HeroHeadline({
  line1Ref,
  line2Ref,
  headlineRef,
  sublineRef,
  line4Ref,
  buttonsRef,
  onOpenConsultation,
}: HeroHeadlineProps) {
  const scrollToServices = async () => {
    const { default: gsap } = await import('gsap');
    const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
    gsap.registerPlugin(ScrollToPlugin);
    gsap.to(window, { duration: 1.2, scrollTo: '#services', ease: 'power3.inOut' });
  };

  return (
    <div className="flex flex-col items-center text-center gap-1 lg:gap-5 relative z-10 pt-1">
      {/* ── Headline Sequencer: Professional & Centered ── */}
      <div className="w-full relative flex justify-center">
        <HeadlineSequencer />
      </div>

      {/* Hidden legacy refs to preserve useHeroTimeline without conflicts */}
      <span ref={headlineRef as React.RefObject<HTMLSpanElement>} className="hidden" aria-hidden="true" />
      <span ref={line1Ref as React.RefObject<HTMLSpanElement>} className="hidden" aria-hidden="true" />
      <span ref={line2Ref as React.RefObject<HTMLSpanElement>} className="hidden" aria-hidden="true" />
      <span ref={sublineRef as React.RefObject<HTMLSpanElement>} className="hidden" aria-hidden="true" />
      <span ref={line4Ref as React.RefObject<HTMLSpanElement>} className="hidden" aria-hidden="true" />

      {/* ── CTA Buttons (Centered) ── */}
      <div
        ref={buttonsRef as React.RefObject<HTMLDivElement>}
        className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-center pt-0 sm:pt-1"
      >
        <MagneticHeroButton
          onClick={onOpenConsultation}
          className="relative overflow-hidden px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#16A34A] text-white group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Free Strategy Call
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </MagneticHeroButton>

        <button
          onClick={scrollToServices}
          className="relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl border border-white/20 text-white text-xs sm:text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
        >
          Explore Services
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Magnetic CTA Button Component (Preserved) ─────────────── */
interface MagneticHeroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function MagneticHeroButton({ children, onClick, className = '' }: MagneticHeroButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const xToBtn = useRef<((v: number) => void) | null>(null);
  const yToBtn = useRef<((v: number) => void) | null>(null);
  const xToInner = useRef<((v: number) => void) | null>(null);
  const yToInner = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || !btnRef.current || !innerRef.current) return;

    (async () => {
      const { default: gsap } = await import('gsap');
      if (!btnRef.current || !innerRef.current) return;
      xToBtn.current = gsap.quickTo(btnRef.current, 'x', { duration: 0.4, ease: 'power2.out' });
      yToBtn.current = gsap.quickTo(btnRef.current, 'y', { duration: 0.4, ease: 'power2.out' });
      xToInner.current = gsap.quickTo(innerRef.current, 'x', { duration: 0.4, ease: 'power2.out' });
      yToInner.current = gsap.quickTo(innerRef.current, 'y', { duration: 0.4, ease: 'power2.out' });
    })();
  }, [prefersReducedMotion]);

  const RADIUS = 80;

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion || !btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < RADIUS) {
      const strength = 0.35;
      xToBtn.current?.(dx * strength);
      yToBtn.current?.(dy * strength);
      xToInner.current?.(dx * 0.14);
      yToInner.current?.(dy * 0.14);
    }
  }

  function onMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
    if (!btnRef.current || !rippleRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const ripple = rippleRef.current;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.opacity = '1';

    requestAnimationFrame(() => {
      ripple.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.3s';
      ripple.style.transform = `translate(-50%, -50%) scale(${Math.max(width, height) * 0.035})`;
    });

    btnRef.current.style.backgroundColor = '#15803D';
  }

  function onMouseLeave() {
    if (!btnRef.current || !rippleRef.current) return;
    xToBtn.current?.(0);
    yToBtn.current?.(0);
    xToInner.current?.(0);
    yToInner.current?.(0);

    const ripple = rippleRef.current;
    ripple.style.opacity = '0';
    ripple.style.transition = 'opacity 0.4s';
    btnRef.current.style.backgroundColor = '';
  }

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${className} cursor-pointer`}
      style={{ willChange: 'transform', transition: 'background-color 0.2s' }}
    >
      <span
        ref={rippleRef}
        className="absolute rounded-full bg-[#15803D] pointer-events-none"
        style={{ width: 40, height: 40, opacity: 0 }}
        aria-hidden
      />
      <span ref={innerRef} className="relative z-10 flex items-center gap-2 will-change-transform">
        {children}
      </span>
    </button>
  );
}

export default HeroHeadline;
