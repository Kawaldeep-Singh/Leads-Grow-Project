'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { headlineSlides } from './headlineSlides';
import { useHeadlineTimeline, TIMING } from '@/hooks/useHeadlineTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeadlineSequencer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slidesStackRef = useRef<HTMLDivElement | null>(null);

  // Slide DOM refs
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);

  const prefersReducedMotion = useReducedMotion();

  // ─────────────────────────────────────────────────────────────
  // 1. IDLE SHIMMER & PULSE
  // ─────────────────────────────────────────────────────────────

  const killIdle = useCallback(() => {
    idleTweensRef.current.forEach((t) => t.kill());
    idleTweensRef.current = [];
  }, []);

  const startIdle = useCallback(
    (slideEl: HTMLElement) => {
      if (prefersReducedMotion || typeof window === 'undefined') return;
      killIdle();

      // Subtle recurring breathing shimmer on the highlighter badge
      const shimmers = slideEl.querySelectorAll<HTMLElement>('[data-shimmer]');
      shimmers.forEach((shim) => {
        const tween = gsap.fromTo(
          shim,
          { xPercent: -100 },
          {
            xPercent: 200,
            duration: 1.4,
            repeat: -1,
            repeatDelay: 2.2,
            ease: 'power2.inOut',
          }
        );
        idleTweensRef.current.push(tween);
      });
    },
    [killIdle, prefersReducedMotion]
  );

  // ─────────────────────────────────────────────────────────────
  // 2. HIGH-ENERGY SLIDE ENTRANCE (Text Flash, Marker Reveal & Subline Rise)
  // ─────────────────────────────────────────────────────────────

  const enterSlide = useCallback(
    (slideIndex: number, isInitial: boolean) => {
      killIdle();

      const slideEl = slideRefs.current[slideIndex];
      if (!slideEl) return;

      // Ensure slide is reset and ready to animate cleanly
      gsap.killTweensOf(slideEl);
      gsap.set(slideEl, { opacity: 1, y: 0 });

      // Toggle visibility
      slideRefs.current.forEach((s, idx) => {
        if (s) {
          if (idx === slideIndex) {
            s.style.visibility = 'visible';
            s.style.zIndex = '10';
            gsap.set(s, { opacity: 1, y: 0 });
          } else {
            s.style.zIndex = '1';
          }
        }
      });

      if (prefersReducedMotion) {
        gsap.fromTo(
          slideEl,
          { opacity: 0 },
          { opacity: 1, duration: TIMING.reducedFade, ease: 'power2.out' }
        );
        return;
      }

      const mainLine = slideEl.querySelector<HTMLElement>('.slide-main-line');
      const subLine = slideEl.querySelector<HTMLElement>('.slide-sub-line');
      const markerBar = slideEl.querySelector<HTMLElement>('.slide-marker-bar');
      const shimmerEl = slideEl.querySelector<HTMLElement>('[data-shimmer]');

      // Reset with high-energy radiant text flash state
      gsap.set(mainLine, {
        opacity: 0,
        y: 18,
        filter: 'brightness(1.75) drop-shadow(0 0 24px rgba(34,197,94,0.45))',
      });
      if (subLine) {
        gsap.set(subLine, {
          opacity: 0,
          y: 12,
          filter: 'brightness(1.35)',
        });
      }
      if (markerBar) {
        gsap.set(markerBar, { clipPath: 'inset(0 100% 0 0)' });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          startIdle(slideEl);
        },
      });

      // 1. High-energy text flash & smooth upward reveal for main heading
      tl.to(
        mainLine,
        {
          opacity: 1,
          y: 0,
          filter: 'brightness(1) drop-shadow(0 0 0px rgba(34,197,94,0))',
          duration: 0.65,
          ease: 'power3.out',
        },
        0
      );

      // 2. Elegant marker reveal with luminous swipe
      if (markerBar) {
        tl.to(
          markerBar,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5,
            ease: 'power2.out',
          },
          0.18
        );
      }

      // 3. Shimmer burst across the marker bar right after reveal
      if (shimmerEl) {
        tl.fromTo(
          shimmerEl,
          { xPercent: -100 },
          {
            xPercent: 200,
            duration: 0.85,
            ease: 'power2.inOut',
          },
          0.3
        );
      }

      // 4. Supporting sub-line gentle rise with smooth text flash settling
      if (subLine) {
        tl.to(
          subLine,
          {
            opacity: 1,
            y: 0,
            filter: 'brightness(1)',
            duration: 0.55,
            ease: 'power2.out',
          },
          0.28
        );
      }
    },
    [killIdle, prefersReducedMotion, startIdle]
  );

  // ─────────────────────────────────────────────────────────────
  // 3. CLEAN SLIDE EXIT (Smooth Fade-out)
  // ─────────────────────────────────────────────────────────────

  const exitSlide = useCallback(
    (slideIndex: number, nextIndex: number, onOverlap: () => void) => {
      killIdle();

      const slideEl = slideRefs.current[slideIndex];
      if (!slideEl) {
        onOverlap();
        return;
      }

      if (prefersReducedMotion) {
        gsap.to(slideEl, {
          opacity: 0,
          duration: TIMING.reducedFade,
          ease: 'power2.in',
          onComplete: onOverlap,
        });
        return;
      }

      // Smooth professional exit: gentle fade & subtle upward glide
      gsap.to(slideEl, {
        opacity: 0,
        y: -10,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          slideEl.style.visibility = 'hidden';
          gsap.set(slideEl, { y: 0, opacity: 1 }); // Reset for next cycle
        },
      });

      // Overlap: start next slide slightly before exit finishes
      gsap.delayedCall(0.3, () => {
        onOverlap();
      });
    },
    [killIdle, prefersReducedMotion]
  );

  // ─────────────────────────────────────────────────────────────
  // 4. TIMELINE HOOK INTEGRATION
  // ─────────────────────────────────────────────────────────────

  const {
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useHeadlineTimeline({
    containerRef,
    totalSlides: headlineSlides.length,
    onEnterSlide: enterSlide,
    onExitSlide: exitSlide,
    onKillIdle: killIdle,
  });

  useEffect(() => {
    return () => {
      killIdle();
    };
  }, [killIdle]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="relative w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center select-none"
    >
      {/* ── Accessible H1 for SEO ── */}
      <h1 className="sr-only">
        Everything Under One Roof to Grow Your Brand. From Branding to Business Growth.
        We Don’t Just Generate Leads. We Generate Business. From Leads to Sales, We Do It All.
        15+ Years of Marketing Expertise To Make Your Business Bigger.
      </h1>

      {/* ── Slides Stack (No Layout Shift, Centered) ── */}
      <div
        ref={slidesStackRef}
        className="grid grid-cols-1 [grid-template-areas:'stack'] relative z-10 w-full min-h-[96px] sm:min-h-[115px] lg:min-h-[142px]"
        aria-hidden="true"
      >
        {/* ══════════════════════════════════════════════════════
            SLIDE 1:
            Main: Everything Under One Roof to Grow Your Brand.
            Sub: From Branding to Business Growth.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center"
          style={{ visibility: 'visible' }}
        >
          {/* Main Headline */}
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.2] sm:leading-[1.18] tracking-[-0.03em] text-[clamp(1.35rem,3.8vw,2.9rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="block whitespace-nowrap">Everything Under One Roof</span>
            <span className="inline-flex items-center justify-center gap-x-2 whitespace-nowrap">
              <span>to</span>
              <span className="relative inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                <span
                  className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                  style={{ clipPath: 'inset(0 100% 0 0)' }}
                >
                  <span
                    data-shimmer
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full"
                  />
                </span>
                <span className="relative z-10 text-[#0B0F0D] font-extrabold">
                  Grow Your Brand.
                </span>
              </span>
            </span>
          </div>

          {/* Subheading underneath */}
          <div className="slide-sub-line mt-2 sm:mt-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#9FB0A7] tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            <span className="slide-sub-text">From Branding to Business Growth.</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SLIDE 2:
            Main: We Don’t Just Generate Leads. We Generate Business.
            Sub: From Leads to Sales, We Do It All.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center"
          style={{ visibility: 'hidden' }}
        >
          {/* Main Headline */}
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.2] sm:leading-[1.18] tracking-[-0.03em] text-[clamp(1.35rem,3.8vw,2.9rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="block whitespace-nowrap">We Don’t Just Generate Leads.</span>
            <span className="inline-flex items-center justify-center gap-x-2 whitespace-nowrap">
              <span>We Generate</span>
              <span className="relative inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                <span
                  className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                  style={{ clipPath: 'inset(0 100% 0 0)' }}
                >
                  <span
                    data-shimmer
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full"
                  />
                </span>
                <span className="relative z-10 text-[#0B0F0D] font-extrabold">
                  Business.
                </span>
              </span>
            </span>
          </div>

          {/* Subheading underneath */}
          <div className="slide-sub-line mt-2 sm:mt-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#9FB0A7] tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            <span className="slide-sub-text">From Leads to Sales, We Do It All.</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SLIDE 3:
            Main: 15+ Years of Marketing Expertise
            Sub: To Make Your Business Bigger.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center"
          style={{ visibility: 'hidden' }}
        >
          {/* Main Headline */}
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.2] sm:leading-[1.18] tracking-[-0.03em] text-[clamp(1.35rem,3.8vw,2.9rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="block whitespace-nowrap">
              <span className="text-[#22C55E] drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">15+</span> Years of Marketing Expertise
            </span>
          </div>

          {/* Subheading underneath */}
          <div className="slide-sub-line mt-2 sm:mt-2.5 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold text-[#9FB0A7] tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            <span className="slide-sub-text">To Make Your Business</span>
            <span className="relative inline-flex items-center px-2 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.25)]">
              <span
                className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
              >
                <span
                  data-shimmer
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full"
                />
              </span>
              <span className="relative z-10 text-[#0B0F0D] font-bold text-xs sm:text-sm md:text-base">
                Bigger.
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeadlineSequencer;
