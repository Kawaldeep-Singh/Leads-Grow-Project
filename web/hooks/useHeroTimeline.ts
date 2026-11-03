'use client';

import { useEffect, useRef } from 'react';

interface HeroTimelineRefs {
  badgeRef: React.RefObject<HTMLElement | null>;
  line1Ref?: React.RefObject<HTMLElement | null>;
  line2Ref?: React.RefObject<HTMLElement | null>;
  headlineRef: React.RefObject<HTMLElement | null>;
  sublineRef: React.RefObject<HTMLElement | null>;
  subCopyRef?: React.RefObject<HTMLElement | null>;
  line4Ref?: React.RefObject<HTMLElement | null>;
  taglineRef: React.RefObject<HTMLElement | null>;
  buttonsRef: React.RefObject<HTMLElement | null>;
  countersRef: React.RefObject<HTMLElement | null>;
  chartRef: React.RefObject<HTMLElement | null>;
  sectionRef: React.RefObject<HTMLElement | null>;
  prefersReducedMotion: boolean;
}

export function useHeroTimeline(refs: HeroTimelineRefs) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | null = null;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { SplitText } = await import('gsap/SplitText');
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const {
        badgeRef,
        line1Ref,
        line2Ref,
        headlineRef,
        sublineRef,
        line4Ref,
        taglineRef,
        buttonsRef,
        countersRef,
        chartRef,
        sectionRef,
        prefersReducedMotion,
      } = refs;

      if (prefersReducedMotion) {
        // Show everything at final state immediately
        [badgeRef, line1Ref, line2Ref, headlineRef, sublineRef, line4Ref, taglineRef, buttonsRef, countersRef, chartRef]
          .forEach(r => {
            if (r?.current) gsap.set(r.current, { opacity: 1, y: 0, scale: 1 });
          });
        return;
      }

      /* ── Set initial hidden states ── */
      const els = [
        badgeRef.current,
        line1Ref?.current,
        line2Ref?.current,
        sublineRef.current,
        line4Ref?.current,
        taglineRef.current,
        buttonsRef.current,
        countersRef.current,
        chartRef.current,
      ].filter(Boolean);

      gsap.set(els, { opacity: 0, y: 20 });
      if (chartRef.current) gsap.set(chartRef.current, { opacity: 0, y: 60, scale: 0.94, rotateY: -8 });
      if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 0, clipPath: 'inset(0 100% 0 0)' });

      /* ── SplitText headline ── */
      let headlineSplit: InstanceType<typeof SplitText> | null = null;

      if (headlineRef.current) {
        headlineSplit = new SplitText(headlineRef.current, { type: 'words,chars' });
        gsap.set(headlineSplit.chars, {
          yPercent: 110,
          rotateX: -80,
          opacity: 0,
          transformOrigin: '0% 100%',
        });
      }

      /* ── Master intro timeline (paused: true so it waits for preloader) ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tlRef.current = tl;

      // 1. Badge wipe
      tl.to(
        badgeRef.current,
        { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power3.inOut' },
        0.1
      );

      // 2. Line 1: "Everything Under One Roof to Grow Your Brand."
      if (line1Ref?.current) {
        tl.to(line1Ref.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.25);
      }

      // 3. Line 2: "From Branding to Business Growth."
      if (line2Ref?.current) {
        tl.to(line2Ref.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.45);
      }

      // 4. Headline chars: "We Don't Just Generate"
      if (headlineSplit?.chars?.length) {
        tl.to(
          headlineSplit.chars,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            stagger: { each: 0.02, from: 'start' },
            duration: 0.9,
            ease: 'expo.out',
          },
          0.65
        );
      }

      // 5. Sub-headline: "We Generate Business."
      tl.to(sublineRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.95);

      // 6. Line 4: "From Leads to Sales, We Do It All."
      if (line4Ref?.current) {
        tl.to(line4Ref.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.2);
      }

      // 7. Tagline
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.4);

      // 6. Buttons pop in
      if (buttonsRef.current) {
        const btns = buttonsRef.current.querySelectorAll('button, a, [role="button"]');
        if (btns.length) {
          gsap.set(Array.from(btns), { opacity: 0, scale: 0.85, y: 12 });
          tl.to(
            Array.from(btns),
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.12,
              duration: 0.6,
              ease: 'back.out(1.7)',
            },
            1.5
          );
        } else {
          tl.to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, 1.5);
        }
      }

      // 7. Counters
      tl.to(countersRef.current, { opacity: 1, y: 0, duration: 0.5 }, 1.8);

      // 8. Chart panel
      tl.to(
        chartRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 1.1,
          ease: 'power3.out',
        },
        0.7
      );

      /* ── Scroll exit scrub ── */
      if (sectionRef.current) {
        const exitTargets = [line1Ref?.current, line2Ref?.current, headlineRef.current, sublineRef.current, line4Ref?.current].filter(Boolean);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            exitTargets.forEach(el => {
              if (el) gsap.set(el, { y: p * -80, opacity: Math.max(0.2, 1 - p * 1.5) });
            });
            if (chartRef.current) {
              gsap.set(chartRef.current, { scale: 1 - p * 0.08 });
            }
          },
        });
      }

      /* ── Start intro when preloader completes (or immediately if already preloaded) ── */
      let hasStarted = false;
      const startIntro = () => {
        if (hasStarted) return;
        hasStarted = true;
        tl.play();
      };

      const isPreloaded = sessionStorage.getItem('lg-preloaded') === 'true';
      const navEntry = (typeof performance !== 'undefined' && performance.getEntriesByType)
        ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
        : undefined;
      const isReload = navEntry?.type === 'reload';

      let safetyTimeout: ReturnType<typeof setTimeout> | null = null;

      if ((isPreloaded && !isReload) || prefersReducedMotion) {
        startIntro();
      } else {
        window.addEventListener('leadsgrow:preloaderComplete', startIntro, { once: true });
        // Failsafe timer (3.5s) so the hero is never left hidden
        safetyTimeout = setTimeout(startIntro, 3500);
      }

      cleanup = () => {
        if (safetyTimeout) clearTimeout(safetyTimeout);
        window.removeEventListener('leadsgrow:preloaderComplete', startIntro);
        tl.kill();
        headlineSplit?.revert();
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger === sectionRef.current) st.kill();
        });
      };
    })();

    return () => cleanup?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs.prefersReducedMotion]);

  return tlRef;
}
