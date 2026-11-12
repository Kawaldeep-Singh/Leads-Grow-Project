'use client';

import { useEffect, useRef } from 'react';
import { registerGsapPlugins, gsap, ScrollTrigger } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface FooterAnimationRefs {
  footerRef: React.RefObject<HTMLElement | null>;
  closerRef: React.RefObject<HTMLDivElement | null>;
  statsRef: React.RefObject<HTMLDivElement | null>;
  linksRef: React.RefObject<HTMLDivElement | null>;
  wordmarkRef: React.RefObject<HTMLDivElement | null>;
  growthLineRef: React.RefObject<SVGPolylineElement | SVGPathElement | null>;
  bottomBarRef: React.RefObject<HTMLDivElement | null>;
  spotlightRef: React.RefObject<HTMLDivElement | null>;
  progressCircleRef: React.RefObject<SVGCircleElement | null>;
}

export function useFooterAnimations({
  footerRef,
  closerRef,
  statsRef,
  linksRef,
  wordmarkRef,
  growthLineRef,
  bottomBarRef,
  spotlightRef,
  progressCircleRef,
}: FooterAnimationRefs) {
  const prefersReducedMotion = useReducedMotion();
  const magneticCleanupsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    registerGsapPlugins();

    const footerEl = footerRef.current;
    if (!footerEl) return;

    // Clean up any prior magnetic listeners
    magneticCleanupsRef.current.forEach((fn) => fn());
    magneticCleanupsRef.current = [];

    const ctx = gsap.context(() => {
      // 1. Reduced Motion fallback: set final state immediately
      if (prefersReducedMotion) {
        if (wordmarkRef.current) {
          wordmarkRef.current.style.setProperty('--p', '100%');
        }
        if (growthLineRef.current) {
          growthLineRef.current.style.strokeDashoffset = '0';
        }
        return;
      }

      // 2. Entrance Sequence (Starts when footer enters top 85%)
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Closer row elements
      if (closerRef.current) {
        const badge = closerRef.current.querySelector('.footer-closer-badge');
        const title = closerRef.current.querySelector('.footer-closer-title');
        const sub = closerRef.current.querySelector('.footer-closer-sub');
        const buttons = closerRef.current.querySelectorAll('.footer-closer-btn');
        const card = closerRef.current.querySelector('.footer-newsletter-card');

        if (badge) {
          entranceTl.fromTo(
            badge,
            { opacity: 0, y: 15, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
            0
          );
        }

        if (title) {
          entranceTl.fromTo(
            title,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            0.1
          );
        }

        if (sub) {
          entranceTl.fromTo(
            sub,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            0.2
          );
        }

        if (buttons.length > 0) {
          entranceTl.fromTo(
            buttons,
            { opacity: 0, scale: 0.85, y: 10 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: 'back.out(1.6)',
            },
            0.25
          );
        }

        if (card) {
          entranceTl.fromTo(
            card,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            0.15
          );
        }
      }

      // Stats row
      if (statsRef.current) {
        entranceTl.fromTo(
          statsRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.35
        );
      }

      // Links columns stagger
      if (linksRef.current) {
        const columns = linksRef.current.querySelectorAll('.footer-link-col');
        if (columns.length > 0) {
          entranceTl.fromTo(
            columns,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
            },
            0.45
          );
        }
      }

      // Bottom bar
      if (bottomBarRef.current) {
        entranceTl.fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.7
        );
      }

      // 3. Ambient Background Floating & Pulsing Orbs
      const orb1 = footerEl.querySelector('.footer-orb-1');
      const orb2 = footerEl.querySelector('.footer-orb-2');
      const orb3 = footerEl.querySelector('.footer-orb-3');

      if (orb1) {
        gsap.to(orb1, {
          x: 36,
          y: -30,
          scale: 1.12,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (orb2) {
        gsap.to(orb2, {
          x: -42,
          y: 34,
          scale: 1.15,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (orb3) {
        gsap.to(orb3, {
          scaleX: 1.2,
          scaleY: 1.14,
          opacity: 0.22,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // 4. Wordmark Rising Fill & Growth Line (Scrubbed with scroll)
      const wordmarkEl = wordmarkRef.current;
      const growthLineEl = growthLineRef.current;

      if (wordmarkEl) {
        // Prepare initial state
        wordmarkEl.style.setProperty('--p', '0%');

        let totalLength = 800;
        if (growthLineEl && 'getTotalLength' in growthLineEl) {
          try {
            totalLength = (growthLineEl as SVGPathElement).getTotalLength() || 800;
          } catch {
            totalLength = 800;
          }
          growthLineEl.style.strokeDasharray = `${totalLength}`;
          growthLineEl.style.strokeDashoffset = `${totalLength}`;
        }

        ScrollTrigger.create({
          trigger: wordmarkEl,
          start: 'top 92%',
          end: 'bottom 88%',
          scrub: 0.2,
          onEnter: () => {
            if (growthLineEl) {
              gsap.to(growthLineEl, {
                strokeDashoffset: 0,
                duration: 0.45,
                ease: 'power3.out',
                overwrite: true,
                onComplete: () => {
                  const arrowHead = wordmarkEl.querySelector('.footer-growth-arrow-head');
                  const arrowParts = arrowHead ? [growthLineEl, arrowHead] : [growthLineEl];
                  gsap.to(arrowParts, {
                    y: -5,
                    duration: 0.65,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    overwrite: true,
                  });
                },
              });
            }
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));
            wordmarkEl.style.setProperty('--p', `${percentage}%`);
          },
        });
      }

      // 5. Back to Top Progress Ring
      const circleEl = progressCircleRef.current;
      if (circleEl) {
        const radius = circleEl.r.baseVal.value || 15;
        const circumference = 2 * Math.PI * radius;
        circleEl.style.strokeDasharray = `${circumference}`;
        circleEl.style.strokeDashoffset = `${circumference}`;

        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const offset = circumference * (1 - self.progress);
            circleEl.style.strokeDashoffset = `${offset}`;
          },
        });
      }

      // 6. Mouse Spotlight (fine pointer only)
      const spotlightEl = spotlightRef.current;
      if (spotlightEl && window.matchMedia('(pointer: fine)').matches) {
        const setX = gsap.quickTo(spotlightEl, 'x', { duration: 0.5, ease: 'power2.out' });
        const setY = gsap.quickTo(spotlightEl, 'y', { duration: 0.5, ease: 'power2.out' });

        const onMouseMove = (e: MouseEvent) => {
          const rect = footerEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setX(x);
          setY(y);
          if (spotlightEl.style.opacity !== '1') {
            gsap.to(spotlightEl, { opacity: 1, duration: 0.3 });
          }
        };

        const onMouseLeave = () => {
          gsap.to(spotlightEl, { opacity: 0, duration: 0.4 });
        };

        footerEl.addEventListener('mousemove', onMouseMove);
        footerEl.addEventListener('mouseleave', onMouseLeave);

        magneticCleanupsRef.current.push(() => {
          footerEl.removeEventListener('mousemove', onMouseMove);
          footerEl.removeEventListener('mouseleave', onMouseLeave);
        });
      }

      // 7. Magnetic Buttons Hover Effect
      if (window.matchMedia('(pointer: fine)').matches) {
        const magneticElements = footerEl.querySelectorAll<HTMLElement>('.magnetic-target');

        magneticElements.forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power2.out' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power2.out' });

          const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.38;
            const deltaY = (e.clientY - centerY) * 0.38;
            xTo(deltaX);
            yTo(deltaY);
          };

          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener('mousemove', onMove);
          el.addEventListener('mouseleave', onLeave);

          magneticCleanupsRef.current.push(() => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
          });
        });
      }
    }, footerEl);

    return () => {
      magneticCleanupsRef.current.forEach((fn) => fn());
      magneticCleanupsRef.current = [];
      ctx.revert();
    };
  }, [
    footerRef,
    closerRef,
    statsRef,
    linksRef,
    wordmarkRef,
    growthLineRef,
    bottomBarRef,
    spotlightRef,
    progressCircleRef,
    prefersReducedMotion,
  ]);
}
