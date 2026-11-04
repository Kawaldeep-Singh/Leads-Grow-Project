'use client';

import React, { useEffect, useRef, useState } from 'react';
import { KeywordRoller } from './KeywordRoller';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─── Animated counter ─────────────────────────────────────── */
interface CounterProps {
  to: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  trigger: boolean;
}

function HeroCounter({ to, label, prefix = '', suffix = '', duration = 2, trigger }: CounterProps) {
  const [val, setVal] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const ran = useRef(false);

  useEffect(() => {
    if (!trigger || ran.current) return;
    ran.current = true;

    if (prefersReducedMotion) {
      setVal(to);
      return;
    }

    (async () => {
      const { default: gsap } = await import('gsap');
      const obj = { val: 0 };
      gsap.to(obj, {
        val: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => setVal(Math.round(obj.val)),
      });
    })();
  }, [trigger, to, duration, prefersReducedMotion]);

  return (
    <div className="flex flex-col items-center sm:items-start gap-0.5">
      <span className="text-2xl font-display font-extrabold text-white tabular-nums leading-none">
        {prefix}{val.toLocaleString()}{suffix}
      </span>
      <span className="text-xs font-mono text-[#9FB0A7] uppercase tracking-widest">{label}</span>
    </div>
  );
}

/* ─── Tagline with glitch effect ───────────────────────────── */
function Tagline({ visible }: { visible: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <p className="text-xs sm:text-sm font-mono tracking-[0.22em] uppercase text-[#9FB0A7]">
        <span>You Believe. </span>
        <span className="text-[#22C55E]">We Achieve.</span>
      </p>
    );
  }

  return (
    <p
      className="text-xs sm:text-sm font-mono tracking-[0.22em] uppercase text-[#9FB0A7] transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span>You Believe. </span>
      <span className="text-[#22C55E] font-bold">We Achieve.</span>
    </p>
  );
}

/* ─── MAIN ─────────────────────────────────────────────────── */
interface HeroHeadlineProps {
  badgeRef: React.RefObject<HTMLElement | null>;
  line1Ref?: React.RefObject<HTMLElement | null>;
  line2Ref?: React.RefObject<HTMLElement | null>;
  headlineRef: React.RefObject<HTMLElement | null>;
  sublineRef: React.RefObject<HTMLElement | null>;
  line4Ref?: React.RefObject<HTMLElement | null>;
  taglineRef: React.RefObject<HTMLElement | null>;
  buttonsRef: React.RefObject<HTMLElement | null>;
  countersRef: React.RefObject<HTMLElement | null>;
  onOpenConsultation?: () => void;
  countersTriggered: boolean;
}

export function HeroHeadline({
  badgeRef,
  line1Ref,
  line2Ref,
  headlineRef,
  sublineRef,
  line4Ref,
  taglineRef,
  buttonsRef,
  countersRef,
  onOpenConsultation,
  countersTriggered,
}: HeroHeadlineProps) {
  const scrollToServices = async () => {
    const { default: gsap } = await import('gsap');
    const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
    gsap.registerPlugin(ScrollToPlugin);
    gsap.to(window, { duration: 1.2, scrollTo: '#services', ease: 'power3.inOut' });
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-6 relative z-10 pt-2 sm:pt-4">
      {/* Badge */}
      <div
        ref={badgeRef as React.RefObject<HTMLDivElement>}
        className="inline-flex items-center gap-2 self-start"
      >
        <span
          className="inline-flex items-center gap-2 border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E] text-[11px] font-mono uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        >
          {/* Pulsing dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
          </span>
          15+ Years of Marketing Expertise
        </span>
      </div>

      {/* Top Editorial Statements: Lines 1 & 2 */}
      <div className="flex flex-col gap-1">
        <h2
          ref={line1Ref as React.RefObject<HTMLHeadingElement>}
          className="font-display font-bold text-white text-lg sm:text-xl lg:text-2xl tracking-tight leading-snug"
        >
          Everything Under One Roof to Grow Your Brand.
        </h2>
        <p
          ref={line2Ref as React.RefObject<HTMLParagraphElement>}
          className="font-display font-semibold text-sm sm:text-base lg:text-lg text-[#9FB0A7] tracking-tight flex items-center gap-2"
        >
          From Branding to{' '}
          <span className="text-[#22C55E] font-bold">Business Growth.</span>
        </p>
      </div>

      {/* Core H1 Anchor: Line 3 */}
      <div className="flex flex-col gap-1.5 sm:gap-2 pt-0.5">
        <h1
          className="font-display font-extrabold text-white leading-[1.05] tracking-tight flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3"
          style={{
            fontSize: 'clamp(2.1rem, 4.3vw, 3.85rem)',
            letterSpacing: '-0.03em',
          }}
        >
          <span ref={headlineRef as React.RefObject<HTMLSpanElement>} className="inline-block">
            We Don&apos;t Just Generate
          </span>
          <KeywordRoller />
        </h1>

        {/* Sub-headline */}
        <p
          ref={sublineRef as React.RefObject<HTMLParagraphElement>}
          className="font-display font-extrabold leading-[1.08] tracking-tight text-[#9FB0A7]"
          style={{
            fontSize: 'clamp(1.35rem, 2.4vw, 2.2rem)',
            letterSpacing: '-0.03em',
          }}
        >
          We Generate{' '}
          <span
            className="font-extrabold"
            style={{
              background: 'linear-gradient(90deg, #22C55E 0%, #B6F23D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Business.
          </span>
        </p>
      </div>

      {/* Line 4: Resolution */}
      <div
        ref={line4Ref as React.RefObject<HTMLDivElement>}
        className="flex items-center gap-2.5 py-0.5"
      >
        <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
        <p className="font-display font-semibold text-base sm:text-lg text-[#D1DCD6] tracking-tight">
          From Leads to Sales, <span className="text-white font-bold">We Do It All.</span>
        </p>
      </div>

      {/* Tagline */}
      <div ref={taglineRef as React.RefObject<HTMLDivElement>}>
        <Tagline visible />
      </div>

      {/* CTA Buttons */}
      <div ref={buttonsRef as React.RefObject<HTMLDivElement>} className="flex flex-wrap gap-4 items-center">
        <MagneticHeroButton
          onClick={onOpenConsultation}
          className="relative overflow-hidden px-7 py-3.5 rounded-xl font-semibold text-sm bg-[#16A34A] text-white group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Free Strategy Call
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </MagneticHeroButton>

        <button
          onClick={scrollToServices}
          className="relative flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/20 text-white text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300 group"
        >
          Explore Services
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Proof-point counters */}
      {/* <div
        ref={countersRef as React.RefObject<HTMLDivElement>}
        className="flex flex-wrap gap-6 sm:gap-10 pt-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-px h-8 bg-[#22C55E]/40 hidden sm:block" />
          <HeroCounter to={7} suffix="+" label="Years" trigger={countersTriggered} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-px h-8 bg-[#22C55E]/40 hidden sm:block" />
          <HeroCounter to={50} prefix="" suffix="L+" label="Leads" trigger={countersTriggered} />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-px h-8 bg-[#22C55E]/40 hidden sm:block" />
          <HeroCounter to={5000} suffix="+" label="Campaigns" trigger={countersTriggered} />
        </div>
      </div> */}
    </div>
  );
}

/* ─── Magnetic CTA Button ──────────────────────────────────── */
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

    // Hover tone
    btnRef.current.style.backgroundColor = '#15803D';
  }

  function onMouseLeave() {
    if (!btnRef.current || !rippleRef.current) return;
    // Reset magnetic
    xToBtn.current?.(0);
    yToBtn.current?.(0);
    xToInner.current?.(0);
    yToInner.current?.(0);

    // Fade ripple
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
      {/* Fill-from-cursor ripple */}
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
