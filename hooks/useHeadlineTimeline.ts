'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface UseHeadlineTimelineOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalSlides: number;
  onEnterSlide: (slideIndex: number, isInitial: boolean) => void;
  onExitSlide: (slideIndex: number, nextIndex: number, onOverlap: () => void) => void;
  onHoldProgress?: (progress: number, duration: number) => void;
  onKillIdle?: () => void;
}

export const TIMING = {
  enter: 1.5,
  hold: 2.8,
  exit: 0.6,
  overlap: 0.2, // Overlap next ENTER with last 0.2s of EXIT
  reducedHold: 4.0,
  reducedFade: 0.4,
} as const;

export function useHeadlineTimeline({
  containerRef,
  totalSlides,
  onEnterSlide,
  onExitSlide,
  onHoldProgress,
  onKillIdle,
}: UseHeadlineTimelineOptions) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeIndexRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const queuedIndexRef = useRef<number | null>(null);
  const holdDelayedCallRef = useRef<gsap.core.Tween | null>(null);
  const holdProgressTweenRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const isPausedRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const isDocumentHiddenRef = useRef<boolean>(false);
  const isOutOfViewRef = useRef<boolean>(false);

  // Keep active index ref in sync
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Pause / Resume management
  const updatePauseState = useCallback(() => {
    const shouldPause =
      isHoveredRef.current || isDocumentHiddenRef.current || isOutOfViewRef.current;

    if (shouldPause && !isPausedRef.current) {
      isPausedRef.current = true;
      holdDelayedCallRef.current?.pause();
      holdProgressTweenRef.current?.pause();
    } else if (!shouldPause && isPausedRef.current) {
      isPausedRef.current = false;
      holdDelayedCallRef.current?.resume();
      holdProgressTweenRef.current?.resume();
    }
  }, []);

  const scheduleNext = useCallback(
    (currentIndex: number) => {
      const holdDuration = prefersReducedMotion ? TIMING.reducedHold : TIMING.hold;

      // Progress tracker for indicators
      const progressObj = { value: 0 };
      holdProgressTweenRef.current?.kill();
      holdProgressTweenRef.current = gsap.to(progressObj, {
        value: 1,
        duration: holdDuration,
        ease: 'none',
        onUpdate: () => {
          onHoldProgress?.(progressObj.value, holdDuration);
        },
      });

      holdDelayedCallRef.current?.kill();
      holdDelayedCallRef.current = gsap.delayedCall(holdDuration, () => {
        const next = (currentIndex + 1) % totalSlides;
        goTo(next);
      });

      if (isPausedRef.current) {
        holdDelayedCallRef.current?.pause();
        holdProgressTweenRef.current?.pause();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalSlides, prefersReducedMotion, onHoldProgress]
  );

  const goTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndexRef.current && !isTransitioningRef.current) {
        return;
      }

      if (isTransitioningRef.current) {
        // Queue latest requested index (last wins)
        queuedIndexRef.current = targetIndex;
        return;
      }

      // Stop hold timers
      holdDelayedCallRef.current?.kill();
      holdProgressTweenRef.current?.kill();
      onHoldProgress?.(0, 0);

      const fromIndex = activeIndexRef.current;
      isTransitioningRef.current = true;

      // Kill idle floating & shimmers
      onKillIdle?.();

      let enterTriggered = false;
      const triggerEnter = () => {
        if (enterTriggered) return;
        enterTriggered = true;
        setActiveIndex(targetIndex);
        activeIndexRef.current = targetIndex;
        onEnterSlide(targetIndex, false);

        // Schedule next transition after ENTER completes
        const enterDuration = prefersReducedMotion ? TIMING.reducedFade : TIMING.enter;
        gsap.delayedCall(enterDuration, () => {
          isTransitioningRef.current = false;

          // If a jump was queued while transitioning, process it
          if (queuedIndexRef.current !== null) {
            const nextInQueue = queuedIndexRef.current;
            queuedIndexRef.current = null;
            goTo(nextInQueue);
          } else {
            scheduleNext(targetIndex);
          }
        });
      };

      // Play EXIT
      onExitSlide(fromIndex, targetIndex, () => {
        // Overlap hook: triggers 0.2s before exit finishes
        triggerEnter();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEnterSlide, onExitSlide, onHoldProgress, onKillIdle, prefersReducedMotion, scheduleNext]
  );

  // Mouse reaction: 3D tilt towards pointer on desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    let xTo: ((v: number) => void) | null = null;
    let yTo: ((v: number) => void) | null = null;

    const ctx = gsap.context(() => {
      xTo = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power2.out' });
      yTo = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power2.out' });
    }, containerRef);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // Clamp tilt to ±4° Y and ∓2.5° X
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));

      xTo?.(clampedX * 4);
      yTo?.(-clampedY * 2.5);
    };

    const handleMouseLeave = () => {
      xTo?.(0);
      yTo?.(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert();
    };
  }, [containerRef, prefersReducedMotion]);

  // Tab visibility and scroll pause listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      isDocumentHiddenRef.current = document.hidden;
      updatePauseState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const el = containerRef.current;
    let st: ScrollTrigger | null = null;

    if (el) {
      st = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          isOutOfViewRef.current = !self.isActive;
          updatePauseState();
        },
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      st?.kill();
    };
  }, [containerRef, updatePauseState]);

  // Start initial sequence
  const startSequence = useCallback(() => {
    onEnterSlide(0, true);
    const enterDuration = prefersReducedMotion ? TIMING.reducedFade : TIMING.enter;
    gsap.delayedCall(enterDuration, () => {
      scheduleNext(0);
    });
  }, [onEnterSlide, prefersReducedMotion, scheduleNext]);

  // Trigger on preloader complete or immediately
  useEffect(() => {
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      startSequence();
    };

    const isPreloaded =
      typeof window !== 'undefined' && sessionStorage.getItem('lg-preloaded') === 'true';

    if (isPreloaded || prefersReducedMotion) {
      start();
    } else {
      window.addEventListener('leadsgrow:preloaderComplete', start, { once: true });
      const fallback = setTimeout(start, 2500);
      return () => {
        clearTimeout(fallback);
        window.removeEventListener('leadsgrow:preloaderComplete', start);
      };
    }
  }, [startSequence, prefersReducedMotion]);

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    updatePauseState();
  }, [updatePauseState]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    updatePauseState();
  }, [updatePauseState]);

  const handleFocus = useCallback(() => {
    isHoveredRef.current = true;
    updatePauseState();
  }, [updatePauseState]);

  const handleBlur = useCallback(() => {
    isHoveredRef.current = false;
    updatePauseState();
  }, [updatePauseState]);

  return {
    activeIndex,
    goTo,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  };
}

