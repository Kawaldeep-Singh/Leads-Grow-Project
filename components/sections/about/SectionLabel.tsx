'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type SectionLabelTone = 'dark' | 'light' | 'green' | 'ink';

const toneStyles: Record<SectionLabelTone, { pill: string; dot: string; line: string; ghostStroke: string }> = {
  dark: {
    pill: 'bg-[#22C55E] text-[#0B0F0D] shadow-[0_0_24px_rgba(34,197,94,0.45)]',
    dot: 'bg-[#0B0F0D]',
    line: 'bg-white/25',
    ghostStroke: 'rgba(255,255,255,0.08)',
  },
  light: {
    pill: 'bg-[#0B0F0D] text-[#B6F23D]',
    dot: 'bg-[#22C55E]',
    line: 'bg-[#0B0F0D]/25',
    ghostStroke: 'rgba(11,15,13,0.08)',
  },
  green: {
    pill: 'bg-[#0B0F0D] text-white',
    dot: 'bg-[#B6F23D]',
    line: 'bg-[#0B0F0D]/40',
    ghostStroke: 'rgba(11,15,13,0.08)',
  },
  ink: {
    pill: 'bg-[#B6F23D] text-[#0B0F0D] shadow-[0_0_24px_rgba(182,242,61,0.3)]',
    dot: 'bg-[#0B0F0D]',
    line: 'bg-[#B6F23D]/35',
    ghostStroke: 'rgba(255,255,255,0.08)',
  },
};

export function SectionLabel({ children, tone }: { children: string; tone: SectionLabelTone }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const ghostMotionRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const colors = toneStyles[tone];

  useGSAP(() => {
    registerGsapPlugins();
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = rootRef.current;
    const pill = pillRef.current;
    const label = textRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const line = lineRef.current;
    const sweep = sweepRef.current;
    const ghostMotion = ghostMotionRef.current;
    const ghost = ghostRef.current;
    if (!root || !pill || !label || !dot || !ring || !line || !sweep || !ghostMotion || !ghost) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 85%', once: true },
    });
    timeline.fromTo(pill, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'expo.out' }, 0);
    timeline.fromTo(label, { letterSpacing: '0.3em' }, { letterSpacing: '0.08em', duration: 0.7, ease: 'expo.out' }, 0);
    timeline.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.55, ease: 'back.out(3)' }, 0.05);
    timeline.fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 0.08);
    timeline.fromTo(ghost, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0);

    const ringLoop = gsap.fromTo(ring, { scale: 0.6, opacity: 0.55 }, { scale: 1.9, opacity: 0, duration: 2.4, ease: 'power1.out', repeat: -1, paused: true });
    const sweepLoop = gsap.fromTo(sweep, { xPercent: 0 }, {
      xPercent: 400,
      duration: 0.9,
      ease: 'power2.inOut',
      repeat: mobile ? 0 : -1,
      repeatDelay: 7,
      paused: true,
    });
    timeline.call(() => ringLoop.play(0), [], 0.6);
    timeline.call(() => sweepLoop.play(0), [], 0.7);

    if (!mobile) {
      gsap.fromTo(ghostMotion, { y: 30 }, {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }, { scope: rootRef, dependencies: [children, tone, reduced], revertOnUpdate: true });

  const ghostStroke = tone === 'dark' || tone === 'ink' ? '[&:before]:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.08)]' : '[&:before]:[-webkit-text-stroke:1.5px_rgba(11,15,13,0.08)]';

  return (
    <div ref={rootRef} className="relative isolate mb-4 flex min-h-[3.5rem] w-full items-center gap-4 overflow-hidden" data-section-label>
      <span ref={ghostMotionRef} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span
          ref={ghostRef}
          data-word={children}
          className={`absolute left-[28%] top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(5rem,16vw,14rem)] font-extrabold leading-none text-transparent opacity-[0.8] before:content-[attr(data-word)] ${ghostStroke}`}
        />
      </span>
      <span ref={pillRef} className={`relative z-10 inline-flex shrink-0 items-center gap-[0.7em] overflow-hidden rounded-full px-[1.3em] py-[0.6em] font-display text-[clamp(1.05rem,calc(0.9rem_+_0.8vw),1.6rem)] font-bold leading-none tracking-[0.08em] whitespace-nowrap ${colors.pill}`}>
        <span ref={dotRef} aria-hidden="true" className={`relative size-[0.5em] shrink-0 rounded-full ${colors.dot}`}>
          <span ref={ringRef} className={`absolute inset-[-0.35em] rounded-full border border-current opacity-50`} />
        </span>
        <span ref={textRef}>{children}</span>
        <span ref={sweepRef} aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </span>
      <span aria-hidden="true" className={`hidden h-px min-w-0 max-w-[160px] flex-1 min-[480px]:block ${colors.line}`} />
    </div>
  );
}
