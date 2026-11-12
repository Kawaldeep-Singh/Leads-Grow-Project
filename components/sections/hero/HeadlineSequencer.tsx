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
  const currentEnterTlRef = useRef<gsap.core.Timeline | null>(null);
  const activeIndexRef = useRef<number>(0);

  // Speed streak refs
  const mainStreakRef = useRef<HTMLDivElement | null>(null);
  const topStreakRef = useRef<HTMLDivElement | null>(null);
  const bottomStreakRef = useRef<HTMLDivElement | null>(null);

  // Progress segment bar refs
  const progressBarsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Count-up ref for slide 3
  const count15ElRef = useRef<HTMLSpanElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  // ─────────────────────────────────────────────────────────────
  // 1. SPEED STREAKS (Crossing full screen width)
  // ─────────────────────────────────────────────────────────────

  const playStreaks = useCallback(
    (isMobile: boolean) => {
      if (prefersReducedMotion) return;

      const mainStreak = mainStreakRef.current;
      const topStreak = topStreakRef.current;
      const bottomStreak = bottomStreakRef.current;

      if (mainStreak) {
        gsap.fromTo(
          mainStreak,
          { x: '-40vw', opacity: 1 },
          {
            x: '140vw',
            opacity: 1,
            duration: isMobile ? 0.6 : 0.9,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(mainStreak, { opacity: 0 });
            },
          }
        );
      }

      if (!isMobile) {
        if (topStreak) {
          gsap.fromTo(
            topStreak,
            { x: '-40vw', opacity: 0.75 },
            {
              x: '140vw',
              opacity: 0.75,
              duration: 0.85,
              delay: 0.06,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(topStreak, { opacity: 0 });
              },
            }
          );
        }
        if (bottomStreak) {
          gsap.fromTo(
            bottomStreak,
            { x: '-40vw', opacity: 0.75 },
            {
              x: '140vw',
              opacity: 0.75,
              duration: 0.85,
              delay: 0.12,
              ease: 'power2.inOut',
              onComplete: () => {
                gsap.set(bottomStreak, { opacity: 0 });
              },
            }
          );
        }
      }
    },
    [prefersReducedMotion]
  );

  // ─────────────────────────────────────────────────────────────
  // 2. IDLE FLOATING DURING HOLD (Subtle Y-float & Shimmer, No X movement)
  // ─────────────────────────────────────────────────────────────

  const killIdle = useCallback(() => {
    idleTweensRef.current.forEach((t) => t.kill());
    idleTweensRef.current = [];
  }, []);

  const startIdle = useCallback(
    (slideEl: HTMLElement) => {
      if (prefersReducedMotion || typeof window === 'undefined') return;
      killIdle();

      const line1 = slideEl.querySelector<HTMLElement>('.line-1');
      const line2 = slideEl.querySelector<HTMLElement>('.line-2');

      // Subtle vertical idle float: y ±3px, sine yoyo
      if (line1) {
        const tween = gsap.to(line1, {
          y: -3,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        idleTweensRef.current.push(tween);
      }
      if (line2) {
        const tween = gsap.to(line2, {
          y: -2,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.2,
        });
        idleTweensRef.current.push(tween);
      }

      // Recurring subtle breathing shimmer on the marker pill
      const shimmers = slideEl.querySelectorAll<HTMLElement>('[data-shimmer]');
      shimmers.forEach((shim) => {
        const tween = gsap.fromTo(
          shim,
          { xPercent: -100 },
          {
            xPercent: 200,
            duration: 0.8,
            repeat: -1,
            repeatDelay: 2.4,
            ease: 'power2.inOut',
          }
        );
        idleTweensRef.current.push(tween);
      });
    },
    [killIdle, prefersReducedMotion]
  );

  // ─────────────────────────────────────────────────────────────
  // 3. WORD OFFSET MEASUREMENT (Dynamic startX & exitX computation)
  // ─────────────────────────────────────────────────────────────

  const getWordOffsets = (words: HTMLElement[]) => {
    const viewportWidth = document.documentElement.clientWidth;
    return words.map((w) => {
      // Temporarily clear inline transform to get resting bounding rect
      const prevTransform = w.style.transform;
      w.style.transform = 'none';
      const rect = w.getBoundingClientRect();
      w.style.transform = prevTransform;

      // startX = -(wordRect.right) - 60 (relative to word resting pos)
      const startX = -rect.right - 60;
      // exitX = (window.innerWidth - wordRect.left) + 60
      const exitX = viewportWidth - rect.left + 60;
      return { el: w, startX, exitX };
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 4. ENTER CHOREOGRAPHY: FAR-LEFT EDGE → REST
  // ─────────────────────────────────────────────────────────────

  const enterSlide = useCallback(
    (slideIndex: number, isInitial: boolean) => {
      killIdle();
      activeIndexRef.current = slideIndex;

      const slideEl = slideRefs.current[slideIndex];
      if (!slideEl) return;

      // Cancel any active enter timeline
      currentEnterTlRef.current?.kill();

      // Reset progress bars
      progressBarsRef.current.forEach((bar, idx) => {
        if (bar) {
          bar.style.transform = idx === slideIndex ? 'scaleX(0)' : 'scaleX(0)';
        }
      });

      // Toggle slide visibility
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

      const isMobile = window.innerWidth < 768;
      const duration = isMobile ? 1.0 : 1.25;
      const stagger = isMobile ? 0.05 : 0.07;
      const enterSkew = isMobile ? -10 : -22;

      // Launch full-screen speed streak leading words by ~0.1s
      playStreaks(isMobile);

      // Query elements
      const line1Words = Array.from(slideEl.querySelectorAll<HTMLElement>('.line-1 .word'));
      const line2Words = Array.from(slideEl.querySelectorAll<HTMLElement>('.line-2 .word'));
      const allWords = Array.from(slideEl.querySelectorAll<HTMLElement>('.word'));
      const markerBar = slideEl.querySelector<HTMLElement>('.slide-marker-bar');
      const shimmerEl = slideEl.querySelector<HTMLElement>('[data-shimmer]');
      const count15El = count15ElRef.current;

      // Measure exact resting positions & startX
      const wordOffsets = getWordOffsets(allWords);

      // Reset all words to startX off-screen left
      wordOffsets.forEach(({ el, startX }) => {
        gsap.set(el, {
          x: startX,
          skewX: enterSkew,
          opacity: 0,
          filter: isMobile ? 'none' : 'blur(10px)',
          willChange: 'transform, opacity',
        });
      });

      if (markerBar) {
        gsap.set(markerBar, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      }
      if (shimmerEl) {
        gsap.set(shimmerEl, { xPercent: -100 });
      }
      if (count15El && slideIndex === 2) {
        count15El.textContent = '0+';
      }

      const tl = gsap.timeline({
        onComplete: () => {
          allWords.forEach((w) => {
            w.style.willChange = 'auto';
          });
          startIdle(slideEl);
        },
      });
      currentEnterTlRef.current = tl;

      // Line 1 words sweep in at t = 0
      line1Words.forEach((w, i) => {
        const delay = i * stagger;
        tl.to(w, { x: 0, skewX: 0, duration, ease: 'expo.out' }, delay);
        tl.to(w, { opacity: 1, duration: duration * 0.2, ease: 'power2.in' }, delay);
        if (!isMobile) {
          tl.to(w, { filter: 'blur(0px)', duration: duration * 0.6, ease: 'power2.out' }, delay);
        }
      });

      // Line 2 words sweep in starting smoothly after Line 1 begins
      const line2Start = Math.max(0.18, (line1Words.length - 2) * stagger);
      line2Words.forEach((w, i) => {
        const delay = line2Start + i * stagger;
        tl.to(w, { x: 0, skewX: 0, duration, ease: 'expo.out' }, delay);
        tl.to(w, { opacity: 1, duration: duration * 0.2, ease: 'power2.in' }, delay);
        if (!isMobile) {
          tl.to(w, { filter: 'blur(0px)', duration: duration * 0.6, ease: 'power2.out' }, delay);
        }
      });

      // Micro "settle" on last word (skewX 0 → 3° → 0 over 0.2s)
      const lastWord = allWords[allWords.length - 1];
      if (lastWord) {
        tl.to(lastWord, { skewX: 3, duration: 0.1, ease: 'power1.out' }, '>-0.05');
        tl.to(lastWord, { skewX: 0, duration: 0.1, ease: 'power1.in' });
      }

      // Slide 3 count-up: "15+" lands and counts up 0 → 15
      if (slideIndex === 2 && count15El) {
        const countObj = { val: 0 };
        tl.to(
          countObj,
          {
            val: 15,
            duration: 0.7,
            ease: 'power2.out',
            onUpdate: () => {
              count15El.textContent = `${Math.round(countObj.val)}+`;
            },
          },
          0.45
        );
      }

      // Key words highlighter wipe on landing
      if (markerBar) {
        tl.to(
          markerBar,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.45,
            ease: 'power3.out',
          },
          0.65
        );
      }

      // Shine glide across marker bar
      if (shimmerEl) {
        tl.fromTo(
          shimmerEl,
          { xPercent: -100 },
          {
            xPercent: 200,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          0.85
        );
      }
    },
    [killIdle, playStreaks, prefersReducedMotion, startIdle]
  );

  // ─────────────────────────────────────────────────────────────
  // 5. EXIT CHOREOGRAPHY: REST → FAR-RIGHT EDGE (Continuous Conveyor)
  // ─────────────────────────────────────────────────────────────

  const exitSlide = useCallback(
    (slideIndex: number, nextIndex: number, onOverlap: () => void) => {
      killIdle();

      const slideEl = slideRefs.current[slideIndex];
      if (!slideEl) {
        onOverlap();
        return;
      }

      currentEnterTlRef.current?.kill();

      if (prefersReducedMotion) {
        gsap.to(slideEl, {
          opacity: 0,
          duration: TIMING.reducedFade,
          ease: 'power2.in',
          onComplete: onOverlap,
        });
        return;
      }

      const isMobile = window.innerWidth < 768;
      const viewportWidth = document.documentElement.clientWidth;
      const allWords = Array.from(slideEl.querySelectorAll<HTMLElement>('.word'));
      const duration = 0.8;
      const exitSkew = isMobile ? 10 : 22;
      const stagger = 0.04;

      const exitTl = gsap.timeline({
        onComplete: () => {
          slideEl.style.visibility = 'hidden';
          gsap.set(allWords, {
            x: 0,
            skewX: 0,
            opacity: 1,
            filter: 'none',
            willChange: 'auto',
          });
        },
      });

      allWords.forEach((w) => {
        w.style.willChange = 'transform, opacity';
      });

      // 1. Every word accelerates to the right: x: 0 → exitX, skewX: 0 → 22°
      exitTl.to(
        allWords,
        {
          x: (idx, el) => {
            const rect = el.getBoundingClientRect();
            return viewportWidth - rect.left + 60;
          },
          skewX: exitSkew,
          duration: duration,
          ease: 'power3.in',
          stagger: stagger,
        },
        0
      );

      // 2. Opacity fades out in last 25% of travel
      const fadeStart = duration * 0.75;
      const fadeDuration = duration * 0.25;
      exitTl.to(
        allWords,
        {
          opacity: 0,
          duration: fadeDuration,
          ease: 'power2.in',
          stagger: stagger,
        },
        fadeStart
      );

      // 3. Desktop blur out: 0 → 8px
      if (!isMobile) {
        exitTl.to(
          allWords,
          {
            filter: 'blur(8px)',
            duration: duration * 0.45,
            ease: 'power2.in',
            stagger: stagger,
          },
          duration * 0.45
        );
      }

      // 4. Overlap: start next slide enter when exit is ~60% done!
      // This produces the continuous conveyor motion: left → center → right
      const overlapTime = duration * 0.6;
      exitTl.add(() => {
        onOverlap();
      }, overlapTime);
    },
    [killIdle, prefersReducedMotion]
  );

  // ─────────────────────────────────────────────────────────────
  // 6. TIMELINE HOOK INTEGRATION & HOLD PROGRESS
  // ─────────────────────────────────────────────────────────────

  const handleHoldProgress = useCallback((progress: number) => {
    const curIdx = activeIndexRef.current;
    const bar = progressBarsRef.current[curIdx];
    if (bar) {
      bar.style.transform = `scaleX(${progress})`;
    }
  }, []);

  const {
    activeIndex,
    goTo,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useHeadlineTimeline({
    containerRef,
    totalSlides: headlineSlides.length,
    onEnterSlide: enterSlide,
    onExitSlide: exitSlide,
    onHoldProgress: handleHoldProgress,
    onKillIdle: killIdle,
  });

  // Re-sync active index
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Clean resize & font loading re-sync
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const curSlide = slideRefs.current[activeIndexRef.current];
        if (curSlide) {
          const words = Array.from(curSlide.querySelectorAll<HTMLElement>('.word'));
          gsap.set(words, { clearProps: 'transform' });
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
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
      className="relative w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center select-none overflow-visible"
    >
      {/* ── Accessible H1 for SEO ── */}
      <h1 className="sr-only">
        Everything Under One Roof to Grow Your Brand.
        We Don’t Just Generate Leads. We Generate Business.
        15+ Years of Marketing Expertise To Make Your Business Bigger.
      </h1>

      {/* ── Speed Streaks Layer (Full Viewport Width) ── */}
      <div
        className="speed-streaks-layer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-24 pointer-events-none overflow-visible z-20"
        aria-hidden="true"
      >
        <div
          ref={mainStreakRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-[38vw] rounded-full pointer-events-none opacity-0"
          style={{
            background: 'linear-gradient(90deg, transparent, #22C55E 40%, #B6F23D 60%, transparent)',
            boxShadow: '0 0 18px rgba(34,197,94,0.6)',
          }}
        />
        <div
          ref={topStreakRef}
          className="absolute left-0 top-1/2 -translate-y-[calc(50%+14px)] h-[1.5px] w-[28vw] rounded-full pointer-events-none opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(34,197,94,0.6) 40%, rgba(182,242,61,0.6) 60%, transparent)',
            boxShadow: '0 0 12px rgba(34,197,94,0.4)',
          }}
        />
        <div
          ref={bottomStreakRef}
          className="absolute left-0 top-1/2 -translate-y-[calc(50%-14px)] h-[1.5px] w-[32vw] rounded-full pointer-events-none opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(34,197,94,0.6) 40%, rgba(182,242,61,0.6) 60%, transparent)',
            boxShadow: '0 0 12px rgba(34,197,94,0.4)',
          }}
        />
      </div>

      {/* ── Slides Stack (No Layout Shift, Centered, Overflow Visible for Sweep) ── */}
      <div
        ref={slidesStackRef}
        className="grid grid-cols-1 [grid-template-areas:'stack'] relative z-10 w-full min-h-[96px] sm:min-h-[115px] lg:min-h-[142px] overflow-visible"
        aria-hidden="true"
      >
        {/* ══════════════════════════════════════════════════════
            SLIDE 1:
            Line 1: Everything Under One
            Line 2: Roof to Grow Your Brand.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center overflow-visible"
          style={{ visibility: 'visible' }}
        >
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.25] sm:leading-[1.2] tracking-[-0.03em] text-[clamp(1.35rem,4vw,3.1rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <div className="line-1 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">Everything</span>
              <span className="word inline-block">Under</span>
              <span className="word inline-block">One</span>
            </div>
            <div className="line-2 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">Roof</span>
              <span className="word inline-block">to</span>
              <span className="word inline-block">
                <span className="relative inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                  <span
                    className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                    style={{ clipPath: 'inset(0 100% 0 0)' }}
                  >
                    <span
                      data-shimmer
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.28] to-transparent -translate-x-full pointer-events-none"
                    />
                  </span>
                  <span className="relative z-10 text-[#0B0F0D] font-extrabold">
                    Grow Your Brand.
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SLIDE 2:
            Line 1: We Don’t Just Generate Leads.
            Line 2: We Generate Business.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center overflow-visible"
          style={{ visibility: 'hidden' }}
        >
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.25] sm:leading-[1.2] tracking-[-0.03em] text-[clamp(1.35rem,4vw,3.1rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <div className="line-1 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">We</span>
              <span className="word inline-block">Don’t</span>
              <span className="word inline-block">Just</span>
              <span className="word inline-block">Generate</span>
              <span className="word inline-block">Leads.</span>
            </div>
            <div className="line-2 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">We</span>
              <span className="word inline-block">Generate</span>
              <span className="word inline-block">
                <span className="relative inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                  <span
                    className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                    style={{ clipPath: 'inset(0 100% 0 0)' }}
                  >
                    <span
                      data-shimmer
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.28] to-transparent -translate-x-full pointer-events-none"
                    />
                  </span>
                  <span className="relative z-10 text-[#0B0F0D] font-extrabold">
                    Business.
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SLIDE 3:
            Line 1: 15+ Years of Marketing Expertise
            Line 2: To Make Your Business Bigger.
            ══════════════════════════════════════════════════════ */}
        <div
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className="[grid-area:stack] w-full flex flex-col items-center text-center justify-center overflow-visible"
          style={{ visibility: 'hidden' }}
        >
          <div className="slide-main-line font-display font-extrabold text-white leading-[1.25] sm:leading-[1.2] tracking-[-0.03em] text-[clamp(1.35rem,4vw,3.1rem)] flex flex-col items-center justify-center gap-1 sm:gap-2">
            <div className="line-1 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">
                <span
                  ref={count15ElRef}
                  className="count-15 text-[#22C55E] drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                  15+
                </span>
              </span>
              <span className="word inline-block">Years</span>
              <span className="word inline-block">of</span>
              <span className="word inline-block">Marketing</span>
              <span className="word inline-block">Expertise</span>
            </div>
            <div className="line-2 flex flex-wrap items-center justify-center gap-x-[0.28em]">
              <span className="word inline-block">To</span>
              <span className="word inline-block">Make</span>
              <span className="word inline-block">Your</span>
              <span className="word inline-block">Business</span>
              <span className="word inline-block">
                <span className="relative inline-flex items-center px-2.5 sm:px-3 py-0.5 rounded-md overflow-hidden shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                  <span
                    className="slide-marker-bar absolute inset-0 rounded-md bg-gradient-to-r from-[#22C55E] to-[#B6F23D] -skew-x-6"
                    style={{ clipPath: 'inset(0 100% 0 0)' }}
                  >
                    <span
                      data-shimmer
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.28] to-transparent -translate-x-full pointer-events-none"
                    />
                  </span>
                  <span className="relative z-10 text-[#0B0F0D] font-extrabold">
                    Bigger.
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Progress Segments 01 / 02 / 03 ── */}
      {/* <div
        className="flex items-center justify-center gap-2 sm:gap-3.5 mt-3 sm:mt-4 z-20"
        role="tablist"
        aria-label="Headline Slides"
      >
        {[0, 1, 2].map((idx) => {
          const isActive = activeIndex === idx;
          const num = `0${idx + 1}`;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Jump to slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#16A34A]/20 border border-[#22C55E]/40 text-[#22C55E]'
                  : 'bg-white/5 border border-transparent text-[#5B6B63] hover:text-[#9FB0A7] hover:bg-white/10'
              }`}
            >
              <span>{num}</span>
              <span className="w-5 sm:w-7 h-[2px] rounded-full bg-[#1A2420] overflow-hidden relative">
                <span
                  ref={(el) => {
                    progressBarsRef.current[idx] = el;
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-[#22C55E] to-[#B6F23D] origin-left"
                  style={{
                    transform: isActive ? undefined : 'scaleX(0)',
                  }}
                />
              </span>
            </button>
          );
        })}
      </div> */}

    </div>
  );
}

export default HeadlineSequencer;
