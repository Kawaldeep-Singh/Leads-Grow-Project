'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const KEYWORDS = ['Leads.', 'Sales.', 'Revenue.', 'Growth.'];
const INTERVAL_MS = 2600;
const FONT_SIZE = 'clamp(2.1rem, 4.3vw, 3.85rem)';

/* SVG underline path — hand-drawn feel */
const UNDERLINE_PATH =
  'M 0 4 Q 30 0 60 4 Q 90 8 120 4 Q 150 0 180 4';

export function KeywordRoller() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const tlRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Measure each keyword width */
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Animate underline redraw */
  function animateUnderline() {
    const path = underlineRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.style.transition = 'none';

    // Force reflow
    void path.getBoundingClientRect();

    path.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    path.style.strokeDashoffset = '0';
  }

  /* Animate slot (GSAP-less fallback using CSS transitions) */
  useEffect(() => {
    if (prefersReducedMotion) return;

    let gsapLoaded = false;
    let gsapInstance: typeof import('gsap').default | null = null;
    let hidden = false;

    document.addEventListener('visibilitychange', () => {
      hidden = document.hidden;
    });

    async function tick(nextIdx: number) {
      if (hidden) {
        // Re-schedule when not visible
        tlRef.current = setTimeout(() => tick(nextIdx), 300);
        return;
      }

      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const currentIdx = nextIdx === 0 ? KEYWORDS.length - 1 : nextIdx - 1;

      if (gsapLoaded && gsapInstance) {
        const gsap = gsapInstance;

        // Blur outgoing
        const currentWord = wordRefs.current[currentIdx];
        if (currentWord) {
          gsap.to(currentWord, { filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' });
        }

        // Slide wrapper up
        gsap.to(wrapper, {
          yPercent: -nextIdx * 100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            // Deblur incoming
            const incoming = wordRefs.current[nextIdx];
            if (incoming) {
              gsap.fromTo(
                incoming,
                { filter: 'blur(6px)' },
                { filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
              );
            }
          },
        });

        // Tween container width to match new word
        const measurer = measureRefs.current[nextIdx];
        if (measurer && container) {
          const newWidth = Math.ceil(measurer.getBoundingClientRect().width || measurer.offsetWidth) + 4;
          gsap.to(container, { width: newWidth, duration: 0.6, ease: 'power3.inOut' });
        }
      } else {
        // CSS fallback
        if (wrapper) {
          wrapper.style.transform = `translateY(-${nextIdx * 100}%)`;
        }
        const measurer = measureRefs.current[nextIdx];
        if (measurer && container) {
          const newWidth = Math.ceil(measurer.getBoundingClientRect().width || measurer.offsetWidth) + 4;
          container.style.width = `${newWidth}px`;
        }
      }

      // Redraw underline
      animateUnderline();

      // Update state (React render)
      setActiveIdx(nextIdx);

      // Schedule next
      const next = (nextIdx + 1) % KEYWORDS.length;
      tlRef.current = setTimeout(() => tick(next), INTERVAL_MS);
    }

    (async () => {
      try {
        const mod = await import('gsap');
        gsapInstance = mod.default;
        gsapLoaded = true;
      } catch {
        // fallback — no gsap
      }
      // Init container width
      const updateWidth = () => {
        const measurer = measureRefs.current[0];
        const container = containerRef.current;
        if (measurer && container) {
          const width = Math.ceil(measurer.getBoundingClientRect().width || measurer.offsetWidth) + 4;
          if (width > 4) {
            container.style.width = `${width}px`;
          }
        }
      };

      updateWidth();
      if (typeof document !== 'undefined' && 'fonts' in document) {
        document.fonts.ready.then(updateWidth);
      }

      // First underline draw
      animateUnderline();
      // Start loop
      tlRef.current = setTimeout(() => tick(1), INTERVAL_MS);
    })();

    return () => {
      if (tlRef.current !== null) clearTimeout(tlRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span className="text-[#22C55E] inline-block">
        {KEYWORDS[activeIdx]}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start relative align-baseline">
      {/* Hidden measurement spans */}
      <span className="absolute opacity-0 pointer-events-none top-0 left-0 flex flex-col" aria-hidden>
        {KEYWORDS.map((w, i) => (
          <span
            key={`m-${w}`}
            ref={(el) => { measureRefs.current[i] = el; }}
            className="font-display font-extrabold whitespace-nowrap leading-none"
            style={{ fontSize: FONT_SIZE, letterSpacing: '-0.03em' }}
          >
            {w}
          </span>
        ))}
      </span>

      {/* Visible roller */}
      <span
        ref={containerRef}
        className="overflow-hidden inline-block relative align-baseline"
        style={{
          transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
          height: '1.2em',
          verticalAlign: 'bottom',
        }}
      >
        <span
          ref={wrapperRef}
          className="flex flex-col will-change-transform"
          style={{
            transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
            height: '1.2em',
          }}
        >
          {KEYWORDS.map((w, i) => (
            <span
              key={w}
              ref={(el) => { wordRefs.current[i] = el; }}
              className="flex-shrink-0 text-[#22C55E] font-display font-extrabold whitespace-nowrap leading-none"
              style={{
                fontSize: FONT_SIZE,
                letterSpacing: '-0.03em',
                height: '1.2em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {w}
            </span>
          ))}
        </span>
      </span>

      {/* SVG hand-drawn underline */}
      <svg
        className="absolute -bottom-1.5 left-0 overflow-visible w-full pointer-events-none"
        height="10"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          ref={underlineRef}
          d={UNDERLINE_PATH}
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
