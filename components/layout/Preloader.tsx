'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PreloaderProps {
  onComplete?: () => void;
}

/* ── GROWTH ARROW (same animation style as the footer wordmark) ───
   The logo is split into 2 images that share one canvas size:
     /logo/leadsgrow-logo-base.png        -> everything except the arrow
     /logo/leadsgrow-logo-arrow-crop.png  -> only the arrow, cropped to its box
   The arrow box position/size below are percentages of the logo canvas. */
const ARROW_BOX = { left: 73.623, top: 3.378, width: 9.064, height: 93.243 }; // % of the logo
const ARROW_TIP = { left: 82.483, top: 3.378 };                               // % of the logo
const SOFT = 14; // softness (%) of the reveal / shimmer edges

const REVEAL_MASK = `linear-gradient(to top right, #000 var(--p), transparent calc(var(--p) + ${SOFT}%))`;
const SHIMMER_MASK = `linear-gradient(to top right, transparent calc(var(--s) - ${SOFT + 4}%), #000 var(--s), transparent calc(var(--s) + ${SOFT + 4}%))`;

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const logoWipeRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);       // moves up while it is revealed
  const arrowMaskRef = useRef<HTMLDivElement>(null);   // reveal mask (bottom -> top)
  const shimmerRef = useRef<HTMLDivElement>(null);     // light band that travels up the arrow
  const starRef = useRef<HTMLDivElement>(null);        // spark at the tip
  const haloRef = useRef<HTMLDivElement>(null);        // soft glow at the tip
  const sweepRef = useRef<HTMLDivElement>(null);
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

    // Reduced motion fallback: quick 0.4s fade (arrow is shown in its final position)
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

    const maskEl = arrowMaskRef.current;
    const shimmerEl = shimmerRef.current;
    if (!maskEl || !shimmerEl) return;

    // Helpers that move the two gradient masks (CSS variables)
    const setReveal = (p: number) => maskEl.style.setProperty('--p', `${p}%`);
    const setShimmer = (s: number) => shimmerEl.style.setProperty('--s', `${s}%`);

    // Master timeline inside gsap.context for Strict Mode resilience
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: handleFinish,
      });

      // Initial states. NOTE: negative top/bottom clip insets (-30%) let the
      // arrow tip and the spark sit slightly above the logo box without being cut.
      gsap.set(glowRef.current, { opacity: 0, scale: 0.75 });
      gsap.set(logoWipeRef.current, {
        clipPath: 'inset(-30% 100% -30% 0)',
        scale: 0.92,
        filter: 'blur(12px)',
      });
      gsap.set(arrowRef.current, { xPercent: -14, yPercent: 14 }); // waits low, below its final place
      gsap.set(sweepRef.current, { xPercent: -200, opacity: 0 });
      gsap.set(starRef.current, { scale: 0, opacity: 1 });
      gsap.set(haloRef.current, { opacity: 0 });
      setReveal(-SOFT);
      setShimmer(-(SOFT + 4));

      // 1. Glow fades in
      tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.4 }, 0);

      // 2. Logo (without the arrow) reveals with a clip-path wipe, left to right
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

      // 4. GROWTH ARROW: rises from the bottom (tail) to the top (tip), soft-edged and smooth
      const rev = { p: -SOFT, s: -(SOFT + 4) };
      tl.to(
        rev,
        {
          p: 100,
          duration: 1.4,
          ease: 'power3.inOut',
          onUpdate: () => setReveal(rev.p),
        },
        0.5
      );
      tl.to(arrowRef.current, { xPercent: 0, yPercent: 0, duration: 1.4, ease: 'power3.inOut' }, 0.5);

      // 5. When the arrow reaches the top: halo + spark at the tip
      tl.fromTo(haloRef.current, { opacity: 0 }, { opacity: 0.85, duration: 0.4, ease: 'power2.out' }, 1.65);
      tl.fromTo(
        starRef.current,
        { scale: 0, rotation: -45 },
        { scale: 1.1, rotation: 0, duration: 0.4, ease: 'back.out(2.2)' },
        1.75
      );
      tl.to(starRef.current, { scale: 0, duration: 0.55, ease: 'power2.in' }, 2.2);
      tl.to(haloRef.current, { opacity: 0.2, duration: 0.8, ease: 'power2.out' }, 2.2);

      // 6. A bright light band travels up the arrow, bottom to top
      tl.to(
        rev,
        {
          s: 100 + SOFT + 4,
          duration: 1.0,
          ease: 'power2.inOut',
          onUpdate: () => setShimmer(rev.s),
        },
        1.95
      );

      // 7. Progress 0 -> 100% (plain object drive, no React state)
      const p = { v: 0 };
      tl.to(
        p,
        {
          v: 100,
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            const val = Math.round(p.v);
            if (counterRef.current) counterRef.current.textContent = `${val}%`;
            if (progressBarRef.current) progressBarRef.current.style.width = `${p.v}%`;
          },
        },
        0.1
      );

      // 8. Exit at 100%: logo scales and fades, progress collapses, the screen slides away
      tl.to(
        logoBoxRef.current,
        { scale: 1.08, opacity: 0, duration: 0.4, ease: 'power2.in' },
        2.6
      );
      tl.to(
        progressContainerRef.current,
        { scaleX: 0, opacity: 0, duration: 0.35, ease: 'power2.in' },
        2.6
      );
      tl.to(
        containerRef.current,
        { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'expo.inOut' },
        2.8
      );
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
          {/* Wipe wrapper (no overflow-hidden, so the arrow can reach above the logo) */}
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

            {/* Layer 2: ONLY the growth arrow, placed exactly where it sits in the logo */}
            <div
              ref={arrowRef}
              className="absolute will-change-transform"
              style={{
                left: `${ARROW_BOX.left}%`,
                top: `${ARROW_BOX.top}%`,
                width: `${ARROW_BOX.width}%`,
                height: `${ARROW_BOX.height}%`,
                filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.45))',
              }}
              aria-hidden
            >
              {/* reveal mask: shows the arrow from the tail (bottom-left) up to the tip (top-right) */}
              <div
                ref={arrowMaskRef}
                className="absolute inset-0"
                style={{
                  ['--p' as string]: '100%',
                  WebkitMaskImage: REVEAL_MASK,
                  maskImage: REVEAL_MASK,
                }}
              >
                <Image
                  src="/logo/leadsgrow-logo-arrow-crop.png"
                  alt=""
                  fill
                  priority
                  sizes="40px"
                  className="object-fill"
                />
                {/* bright copy of the arrow, visible only inside a moving band = shimmer */}
                <div
                  ref={shimmerRef}
                  className="absolute inset-0"
                  style={{
                    ['--s' as string]: '-20%',
                    WebkitMaskImage: SHIMMER_MASK,
                    maskImage: SHIMMER_MASK,
                  }}
                >
                  <Image
                    src="/logo/leadsgrow-logo-arrow-crop.png"
                    alt=""
                    fill
                    sizes="40px"
                    className="object-fill"
                    style={{ filter: 'brightness(2.6) saturate(0.35)' }}
                  />
                </div>
              </div>
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

          {/* Halo + spark at the arrow tip (outside the wipe wrapper so it is never clipped) */}
          <div
            ref={haloRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              left: `${ARROW_TIP.left}%`,
              top: `${ARROW_TIP.top}%`,
              width: 34,
              height: 34,
              opacity: 0,
              background: 'radial-gradient(circle, rgba(182,242,61,0.9) 0%, rgba(182,242,61,0) 70%)',
            }}
            aria-hidden
          />
          <div
            ref={starRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${ARROW_TIP.left}%`, top: `${ARROW_TIP.top}%`, width: 22, height: 22, opacity: 0 }}
            aria-hidden
          >
            <svg viewBox="-10 -10 20 20" width="22" height="22">
              <path
                d="M0,-10 L1.7,-1.7 L10,0 L1.7,1.7 L0,10 L-1.7,1.7 L-10,0 L-1.7,-1.7 Z"
                fill="#F4FFD6"
              />
            </svg>
          </div>
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
