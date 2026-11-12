'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PreloaderProps {
  onComplete?: () => void;
}

/* ── Arrow bounce settings (tweak here) ──────────────────────────
   amplitude : how far the arrow moves up/down, in % of the logo height
   halfCycle : seconds for one move (up OR down). Full up+down = 2x this */
const ARROW_BOB = { amplitude: 16, halfCycle: 0.45 };

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoWipeRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Keep the latest onComplete without re-running the effects below
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 1. Session & Strict Mode safe check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isPreloaded = sessionStorage.getItem('lg-preloaded') === 'true';

    // On reload/refresh allow the preloader to run again
    const navEntry =
      typeof performance !== 'undefined' && performance.getEntriesByType
        ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
        : undefined;
    const isReload = navEntry?.type === 'reload';

    if (isPreloaded && !isReload && !prefersReducedMotion) {
      // Already seen in this session: skip immediately
      window.dispatchEvent(new CustomEvent('leadsgrow:preloaderComplete'));
      onCompleteRef.current?.();
      return;
    }

    // First visit or hard refresh: activate preloader
    setIsActive(true);
  }, [prefersReducedMotion]);

  // 2. Self-contained GSAP timeline (runs only after isActive is true)
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Lock scroll immediately
    const winWithLenis = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
    winWithLenis.__lenis?.stop();
    document.body.style.overflow = 'hidden';

    const handleFinish = () => {
      try {
        sessionStorage.setItem('lg-preloaded', 'true');
      } catch {
        // Ignore storage errors in restricted contexts
      }

      // Unlock scroll
      winWithLenis.__lenis?.start();
      document.body.style.overflow = '';

      // Notify Hero and remove preloader
      window.dispatchEvent(new CustomEvent('leadsgrow:preloaderComplete'));
      onCompleteRef.current?.();
      setIsActive(false);
    };

    // Reduced motion fallback: quick 0.4s fade (arrow stays still)
    if (prefersReducedMotion) {
      const fadeTween = gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power1.out',
        onComplete: handleFinish,
      });
      return () => {
        fadeTween.kill();
      };
    }

    // Master timeline inside gsap.context for Strict Mode resilience
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: handleFinish,
      });

      // Initial states.
      // NOTE: the clip-path uses NEGATIVE top/bottom insets (-30%) so the arrow
      // can move above/below the logo box without being cut off.
      gsap.set(glowRef.current, { opacity: 0, scale: 0.75 });
      gsap.set(logoWipeRef.current, {
        clipPath: 'inset(-30% 100% -30% 0)',
        scale: 0.92,
        filter: 'blur(12px)',
      });
      gsap.set(arrowRef.current, { yPercent: ARROW_BOB.amplitude });
      gsap.set(sweepRef.current, { xPercent: -200, opacity: 0 });
      gsap.set(pulseRingRef.current, { scale: 0.4, opacity: 0 });

      // 1. Glow fades in
      tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.4 }, 0);

      // 2. Logo reveals with a clip-path wipe from left to right, un-blur
      tl.to(
        logoWipeRef.current,
        {
          clipPath: 'inset(-30% 0% -30% 0)',
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'expo.out',
        },
        0.15
      );

      // 3. Light sweep across the logo
      tl.to(
        sweepRef.current,
        { xPercent: 350, opacity: 0.9, duration: 0.8, ease: 'power2.inOut' },
        0.65
      );
      tl.to(sweepRef.current, { opacity: 0, duration: 0.2 }, 1.25);

      // 4. GROWTH ARROW: bounces up and down regularly the whole time it loads.
      //    A soft green ring bursts every time the arrow reaches the top.
      const bob = gsap.timeline({ repeat: -1, delay: 0.15 });
      bob
        .to(arrowRef.current, {
          yPercent: -ARROW_BOB.amplitude,
          duration: ARROW_BOB.halfCycle,
          ease: 'sine.inOut',
        })
        .addLabel('top')
        .fromTo(
          pulseRingRef.current,
          { scale: 0.5, opacity: 0.55 },
          { scale: 2, opacity: 0, duration: 0.55, ease: 'power2.out' },
          'top'
        )
        .to(
          arrowRef.current,
          {
            yPercent: ARROW_BOB.amplitude,
            duration: ARROW_BOB.halfCycle,
            ease: 'sine.inOut',
          },
          'top'
        );

      // 5. Progress 0 -> 100% (plain object drive, no React state)
      const p = { v: 0 };
      tl.to(
        p,
        {
          v: 100,
          duration: 2.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            const val = Math.round(p.v);
            if (counterRef.current) counterRef.current.textContent = `${val}%`;
            if (progressBarRef.current) progressBarRef.current.style.width = `${p.v}%`;
          },
        },
        0.1
      );

      // 6. Exit at 100%: arrow settles back to its rest position, logo scales and fades
      tl.to(
        arrowRef.current,
        { yPercent: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' },
        2.3
      );
      tl.to(
        logoBoxRef.current,
        { scale: 1.08, opacity: 0, duration: 0.4, ease: 'power2.in' },
        2.3
      );
      tl.to(
        progressContainerRef.current,
        { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power2.in' },
        2.3
      );
      // Whole screen slides away
      tl.to(
        containerRef.current,
        { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'expo.inOut' },
        2.5
      );
      // Stop the arrow loop once the exit starts
      tl.call(() => bob.kill(), undefined, 2.3);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isActive, prefersReducedMotion]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0F0D] text-white px-6 select-none overflow-hidden"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      aria-label="Loading LeadsGrow"
    >
      {/* Film-grain SVG noise overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <filter id="preloader-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#preloader-grain)" />
      </svg>

      {/* Ambient soft green radial glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none w-[440px] h-[440px] rounded-full will-change-transform"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Logo container */}
        <div
          ref={logoBoxRef}
          className="relative w-64 sm:w-80 h-11 sm:h-14 flex items-center justify-center mb-6 will-change-transform"
        >
          {/* Wipe wrapper (no overflow-hidden, so the arrow can move above/below the logo) */}
          <div ref={logoWipeRef} className="relative w-full h-full will-change-transform">
            {/* Layer 1: logo WITHOUT the arrow */}
            <Image
              src="/logo/leadsgrow-logo-base.png"
              alt="LeadsGrow™ — You Believe. We Achieve."
              fill
              priority
              sizes="(min-width: 640px) 320px, 256px"
              className="object-contain object-center"
            />

            {/* Layer 2: ONLY the growth arrow (same canvas size, so it lines up exactly) */}
            <div
              ref={arrowRef}
              className="absolute inset-0 will-change-transform"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.55))' }}
              aria-hidden
            >
              <Image
                src="/logo/leadsgrow-logo-arrow.png"
                alt=""
                fill
                priority
                sizes="(min-width: 640px) 320px, 256px"
                className="object-contain object-center"
              />
            </div>

            {/* Skewed green/white light sweep */}
            <div
              ref={sweepRef}
              className="absolute inset-y-0 w-24 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 40%, rgba(34,197,94,0.6) 60%, transparent 100%)',
                transform: 'skewX(-25deg)',
                willChange: 'transform',
              }}
              aria-hidden
            />
          </div>

          {/* Ring burst at the arrow position (fires every time the arrow reaches the top) */}
          <div
            ref={pulseRingRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#22C55E] bg-[#22C55E]/20 pointer-events-none"
            style={{ left: '78%', top: '42%', width: 32, height: 32 }}
            aria-hidden
          />
        </div>

        {/* Thin progress line (240px wide) */}
        <div ref={progressContainerRef} className="w-[240px] flex flex-col gap-2.5 will-change-transform">
          <div className="w-full h-[2px] bg-[#1A2420] rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#B6F23D] will-change-transform"
              style={{ width: '0%', boxShadow: '0 0 10px rgba(34,197,94,0.85)' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#9FB0A7] uppercase">
            <span>LOADING YOUR GROWTH</span>
            <span ref={counterRef} className="text-white font-bold tabular-nums text-[11px]">
              0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
