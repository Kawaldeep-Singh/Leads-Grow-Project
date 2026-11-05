'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoWipeRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const arrowSvgRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  // 1. Session & Strict Mode safe check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check sessionStorage flag
    const isPreloaded = sessionStorage.getItem('lg-preloaded') === 'true';

    // On reload/refresh in dev/testing, allow preloader to run smoothly
    const navEntry = (typeof performance !== 'undefined' && performance.getEntriesByType)
      ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      : undefined;
    const isReload = navEntry?.type === 'reload';

    if (isPreloaded && !isReload && !prefersReducedMotion) {
      // Already seen in session — skip immediately
      window.dispatchEvent(new CustomEvent('leadsgrow:preloaderComplete'));
      onComplete?.();
      return;
    }

    // First visit or hard refresh -> Activate preloader
    setIsActive(true);
  }, [prefersReducedMotion, onComplete]);

  // 2. Self-contained GSAP Timeline (runs only after isActive is true)
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Lock scroll immediately
    if (typeof window !== 'undefined') {
      const winWithLenis = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
      winWithLenis.__lenis?.stop();
      document.body.style.overflow = 'hidden';
    }

    const handleFinish = () => {
      // Save session flag
      try {
        sessionStorage.setItem('lg-preloaded', 'true');
      } catch {
        // Ignore storage errors in restricted contexts
      }

      // Unlock scroll
      if (typeof window !== 'undefined') {
        const winWithLenis = window as unknown as { __lenis?: { stop: () => void; start: () => void } };
        winWithLenis.__lenis?.start();
        document.body.style.overflow = '';
      }

      // Notify Hero and remove preloader
      window.dispatchEvent(new CustomEvent('leadsgrow:preloaderComplete'));
      onComplete?.();
      setIsActive(false);
    };

    // Reduced motion fallback: quick 0.4s fade
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

    // Font readiness check without blocking (timeout race at 2.2s)
    if (typeof document !== 'undefined' && document.fonts) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 2200)),
      ]).catch(() => {});
    }

    // Master Timeline inside gsap.context for Strict Mode resilience
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: handleFinish,
      });

      // Initial states
      gsap.set(glowRef.current, { opacity: 0, scale: 0.75 });
      gsap.set(logoWipeRef.current, {
        clipPath: 'inset(0 100% 0 0)',
        scale: 0.92,
        filter: 'blur(12px)',
      });
      gsap.set(sweepRef.current, { xPercent: -200, opacity: 0 });
      gsap.set(pulseRingRef.current, { scale: 0.4, opacity: 0 });
      gsap.set(arrowSvgRef.current, { scale: 0.7, opacity: 0, y: 5 });
      gsap.set(taglineRef.current, { opacity: 0, y: 8 });

      // 1. Glow fades in (0.4s)
      tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.4 }, 0);

      // 2. Logo reveals with clip-path wipe from left to right (0.9s, expo.out), scale 0.92 -> 1, un-blur
      tl.to(
        logoWipeRef.current,
        {
          clipPath: 'inset(0 0% 0 0)',
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'expo.out',
        },
        0.15
      );

      // 3. Green light sweep across the logo (0.8s)
      tl.to(
        sweepRef.current,
        {
          xPercent: 350,
          opacity: 0.9,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0.65
      );
      tl.to(sweepRef.current, { opacity: 0, duration: 0.2 }, 1.25);

      // 4. Growth arrow pulse & green ring burst at 77.85%
      tl.fromTo(
        pulseRingRef.current,
        { scale: 0.4, opacity: 0.85 },
        { scale: 2.4, opacity: 0, duration: 0.6, ease: 'power2.out' },
        0.95
      );
      tl.to(
        arrowSvgRef.current,
        {
          opacity: 1,
          scale: 1.15,
          y: -4,
          duration: 0.35,
          ease: 'back.out(2)',
        },
        0.95
      );
      tl.to(arrowSvgRef.current, { opacity: 0, y: -12, scale: 1, duration: 0.25 }, 1.3);

      // 5. Plain object progress drive (0 -> 100% over 2.2s, power2.inOut)
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

      // 6. Tagline fades up under the line at ~60% progress (~1.3s)
      tl.to(
        taglineRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.3
      );

      // 7. Exit at 100%:
      // Logo scales to 1.08 and fades (0.4s)
      tl.to(
        logoBoxRef.current,
        { scale: 1.08, opacity: 0, duration: 0.4, ease: 'power2.in' },
        2.3
      );
      // Progress line collapses to the center (0.35s)
      tl.to(
        progressContainerRef.current,
        { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power2.in' },
        2.3
      );
      // Whole screen slides down with clip-path inset(100% 0 0 0) (0.9s, expo.inOut)
      tl.to(
        containerRef.current,
        {
          clipPath: 'inset(100% 0 0 0)',
          duration: 0.9,
          ease: 'expo.inOut',
        },
        2.5
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isActive, prefersReducedMotion, onComplete]);

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
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#preloader-grain)" />
      </svg>

      {/* Ambient soft green radial glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none w-[440px] h-[440px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Logo Container */}
        <div
          ref={logoBoxRef}
          className="relative w-64 sm:w-80 h-11 sm:h-14 flex items-center justify-center mb-6 will-change-transform"
        >
          {/* Logo with clip-path wipe from left to right */}
          <div
            ref={logoWipeRef}
            className="relative w-full h-full overflow-hidden will-change-transform"
          >
            <Image
              src="/logo/leadsgrow-logo.png"
              alt="LeadsGrow™ — You Believe. We Achieve."
              fill
              priority
              className="object-contain object-center"
            />

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

          {/* Growth arrow pulse ring at 77.85% */}
          <div
            ref={pulseRingRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#22C55E] bg-[#22C55E]/20 pointer-events-none"
            style={{
              left: '77.85%',
              top: '48%',
              width: 32,
              height: 32,
            }}
            aria-hidden
          />

          {/* Arrow SVG boost icon */}
            {/* <div
              ref={arrowSvgRef}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: '77.85%',
                top: '48%',
              }}
              aria-hidden
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B6F23D"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div> */}
        </div>

        {/* Thin progress line container (240px wide) */}
        <div
          ref={progressContainerRef}
          className="w-[240px] flex flex-col gap-2.5 will-change-transform"
        >
          {/* Progress track */}
          <div className="w-full h-[2px] bg-[#1A2420] rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full rounded-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#B6F23D] will-change-transform"
              style={{
                width: '0%',
                boxShadow: '0 0 10px rgba(34,197,94,0.85)',
              }}
            />
          </div>

          {/* Labels: LOADING YOUR GROWTH on left, % on right */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#9FB0A7] uppercase">
            <span>LOADING YOUR GROWTH</span>
            <span
              ref={counterRef}
              className="text-white font-bold tabular-nums text-[11px]"
            >
              0%
            </span>
          </div>
        </div>

        {/* Tagline fading up under the line at ~60% progress */}
        {/* <p
          ref={taglineRef}
          className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#9FB0A7] mt-5"
        >
          You Believe. <span className="text-[#22C55E]">We Achieve.</span>
        </p> */}
      </div>
    </div>
  );
};
