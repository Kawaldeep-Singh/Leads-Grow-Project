'use client';

import { useRef } from 'react';
import {
  FileText, Heart, Infinity as InfinityIcon, Mail, Megaphone, MessageCircle,
  MessagesSquare, Network, Search, Share2, Target, ArrowUpRight,
  Compass, TrendingUp, TrendingDown, Users, Building2,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { industriesData } from '@/data/industries';
import type { DigitalMarketingContent } from '@/data/servicePages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { Eyebrow } from './ServiceUI';

const serviceIcons = [Search, Share2, Target, InfinityIcon, Network, FileText, MessageCircle, Mail, MessagesSquare];
const hubIcons = [Search, Heart, Network, Mail, Megaphone];
const hubPoints = [
  { x: 180, y: 55 }, { x: 315, y: 138 }, { x: 270, y: 300 }, { x: 95, y: 265 }, { x: 70, y: 110 },
];

function HubScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    registerGsapPlugins();
    if (!ref.current || reducedMotion) return;
    const lines = ref.current.querySelectorAll<SVGLineElement>('[data-hub-line]');
    const context = gsap.context(() => {
      gsap.fromTo(lines, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    }, ref);
    return () => context.revert();
  }, { scope: ref, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <svg ref={ref} viewBox="0 0 400 360" className="mx-auto block h-[280px] w-full max-w-[400px] sm:h-[340px]" aria-hidden="true">
      <defs><radialGradient id="service-hub-glow"><stop stopColor="#22C55E" stopOpacity=".22" /><stop offset="1" stopColor="#22C55E" stopOpacity="0" /></radialGradient></defs>
      <circle cx="200" cy="180" r="120" fill="url(#service-hub-glow)" />
      <g stroke="#16A34A" strokeOpacity=".65" strokeWidth="1.5" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1}>
        {hubPoints.map((point, index) => <line key={index} data-hub-line x1="200" y1="180" x2={point.x} y2={point.y} pathLength="1" />)}
      </g>
      <circle cx="200" cy="180" r="28" fill="#0B0F0D" />
      <circle cx="200" cy="180" r="8" fill="#B6F23D" />
      {hubPoints.map((point, index) => {
        const Icon = hubIcons[index];
        return <g key={index}><circle cx={point.x} cy={point.y} r="25" fill="#F6FAF7" stroke="#16A34A" strokeWidth="1.5" /><foreignObject x={point.x - 12} y={point.y - 12} width="24" height="24"><Icon className="h-6 w-6 text-[#16A34A]" aria-hidden="true" /></foreignObject></g>;
      })}
    </svg>
  );
}

function RevealWords({ text, className = '' }: { text: string; className?: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    const paragraph = paragraphRef.current;
    if (!paragraph || reducedMotion) return;
    const words = paragraph.querySelectorAll<HTMLElement>('[data-copy-word]');
    const context = gsap.context(() => {
      gsap.fromTo(words, { opacity: 0.25 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.015,
        scrollTrigger: { trigger: paragraph, start: 'top 78%', end: 'bottom 42%', scrub: true, invalidateOnRefresh: true },
      });
    }, paragraph);
    return () => context.revert();
  }, { scope: paragraphRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return <p ref={paragraphRef} className={className}>{text.split(/(\s+)/).map((part, index) => /\s+/.test(part) ? part : <span data-copy-word key={`${index}-${part}`}>{part}</span>)}</p>;
}

export function ServiceOverview({ content }: { content: DigitalMarketingContent }) {
  const reducedMotion = useReducedMotion();
  return (
    <section aria-labelledby="service-what-title" className="relative overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-28">
      <div className="mx-auto grid w-[85%] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <h2 id="service-what-title" className="max-w-[18em] font-display text-[clamp(1.65rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{content.what.title}</h2>
          <HubScene reducedMotion={reducedMotion} />
        </div>
        <div className="flex flex-col justify-center gap-7 lg:col-span-6 lg:col-start-7">
          {content.what.paragraphs.map((paragraph) => <RevealWords key={paragraph} text={paragraph} className="text-base leading-[1.65] text-[#0B0F0D] sm:text-[17px] lg:text-[18px]" />)}
        </div>
      </div>
    </section>
  );
}

export function ServiceCatalog({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion) return;
    const cards = cardRefs.current.filter(Boolean);
    const context = gsap.context(() => {
      gsap.fromTo(cards, { y: 24, opacity: 0, clipPath: 'inset(0 0 14% 0)' }, {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.65,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-catalog-title" className="relative overflow-hidden bg-[#0B0F0D] py-20 text-white sm:py-28">
      <div className="mx-auto w-[85%]">
        <Eyebrow>{content.services.eyebrow}</Eyebrow>
        <h2 id="service-catalog-title" className="mt-5 max-w-[18em] font-display text-[clamp(1.65rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{content.services.title}</h2>
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {content.services.items.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <li key={service} ref={(element) => { if (element) cardRefs.current[index] = element; }} onPointerMove={(event) => {
                if (event.pointerType === 'touch') return;
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
                event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
              }} className="group relative isolate grid min-h-[96px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#142019] via-[#111815] to-[#0E1411] p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#22C55E]/45 hover:shadow-[0_16px_38px_rgba(0,0,0,.28)] before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(260px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(34,197,94,.14),transparent_70%)] group-hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-x-5 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#22C55E]/30 after:to-transparent sm:min-h-[176px] sm:grid-cols-[minmax(0,1fr)_auto] sm:grid-rows-[auto_1fr] sm:gap-4 sm:rounded-3xl sm:p-5 lg:p-6">
                <span className="relative z-10 col-start-1 row-start-1 flex size-11 items-center justify-center rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition-[transform,background-color,border-color] duration-300 group-hover:scale-105 group-hover:border-[#22C55E]/45 group-hover:bg-[#22C55E]/[0.15] sm:size-14 sm:rounded-2xl">
                  <Icon aria-hidden="true" className="size-5 text-[#22C55E] transition-transform duration-300 group-hover:scale-110 sm:size-6" strokeWidth={1.7} />
                </span>
                <span aria-hidden="true" className="relative z-10 col-start-3 row-start-1 flex size-7 items-center justify-center rounded-full border border-white/[0.08] text-[#22C55E]/70 transition-all duration-300 group-hover:border-[#22C55E]/35 group-hover:bg-[#22C55E]/10 group-hover:text-[#B6F23D] sm:col-start-2 sm:size-8">
                  <span className="size-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-125" />
                </span>
                <span className="relative z-10 col-start-2 row-start-1 text-[14px] font-semibold leading-snug text-white sm:col-span-2 sm:col-start-1 sm:row-start-2 sm:self-end sm:text-[16px] lg:text-[17px]">{service}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const proofIcons = [Compass, TrendingUp, TrendingDown, Users, Building2];

export function ServiceProof({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion) return;
    const context = gsap.context(() => {
      tileRefs.current.filter(Boolean).forEach((tile) => {
        const finalValue = tile.querySelector<HTMLElement>('[data-final-value]');
        const overlay = tile.querySelector<HTMLElement>('[aria-hidden="true"][data-counter-overlay]');
        const numeric = overlay?.querySelector<HTMLElement>('[data-counter-number]');
        const raw = tile.dataset.statValue ?? '';
        const match = raw.match(/^(.*?)(\d[\d,]*)(.*)$/);
        const target = match ? Number(match[2].replaceAll(',', '')) : 0;
        if (!finalValue || !overlay || !numeric || target <= 0) return;
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: tile,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            finalValue.style.display = 'none';
            overlay.style.display = 'inline-flex';
            overlay.style.opacity = '1';
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                numeric.textContent = Math.round(counter.value).toLocaleString('en-US');
              },
              onComplete: () => {
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
                finalValue.style.display = 'inline-flex';
                finalValue.style.opacity = '1';
              },
            });
          },
        });
      });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-proof-title" className="relative isolate overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-28">
      {/* Subtle ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#22C55E]/[0.08] blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#16A34A]/[0.06] blur-[120px]" />

      <div className="relative z-10 mx-auto w-[85%]">
        <Eyebrow tone="ink">{content.why.eyebrow}</Eyebrow>
        <h2 id="service-proof-title" className="mt-5 max-w-[20em] font-display text-[clamp(1.75rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0B0F0D]">
          {content.why.title}
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6 lg:gap-6">
          {content.why.stats.map((stat: { value: string; label: string }, index: number) => {
            const Icon = proofIcons[index] ?? Compass;
            const match = stat.value.match(/^(.*?)(\d[\d,]*)(.*)$/);
            const prefix = match ? match[1] : '';
            const num = match ? match[2] : stat.value;
            const suffix = match ? match[3] : '';

            // Balanced Bento Layout:
            // Mobile (1 col): full width
            // Tablet (2 cols): 1st item spans 2 cols, rest span 1 col
            // Desktop (6 cols): 1st & 2nd items span 3 cols (50% each), 3rd, 4th, 5th span 2 cols (33.3% each) -> 100% full, 0 empty holes!
            const spanClass = index === 0
              ? 'sm:col-span-2 lg:col-span-3'
              : index === 1
                ? 'sm:col-span-1 lg:col-span-3'
                : 'sm:col-span-1 lg:col-span-2';

            return (
              <li
                key={stat.label}
                ref={(element) => { if (element) tileRefs.current[index] = element; }}
                data-stat-value={stat.value}
                className={`group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-[#0B0F0D]/[0.08] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#16A34A]/40 hover:shadow-[0_20px_40px_-15px_rgba(22,163,74,0.18)] sm:p-7 lg:p-8 ${spanClass}`}
              >
                {/* Top card bar: Icon pill & growth spark indicator */}
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-2xl border border-[#16A34A]/20 bg-[#16A34A]/[0.08] text-[#16A34A] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#16A34A]/45 group-hover:bg-[#16A34A]/[0.15] sm:size-12"
                  >
                    <Icon className="size-5 sm:size-6" strokeWidth={1.8} />
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex size-7 items-center justify-center rounded-full bg-[#0B0F0D]/[0.04] text-[#16A34A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#16A34A]/10 group-hover:text-[#16A34A]"
                  >
                    <ArrowUpRight className="size-4" strokeWidth={2.2} />
                  </span>
                </div>

                {/* Middle metric number */}
                <div className="my-6">
                  {/* Default & Final Value Display */}
                  <span
                    data-final-value
                    className="inline-flex items-baseline font-display text-[clamp(2.35rem,4.2vw,3.75rem)] font-extrabold leading-none tracking-[-0.035em] text-[#0B0F0D]"
                  >
                    {prefix && <span className="mr-2.5 text-[clamp(1.1rem,1.8vw,1.5rem)] font-bold text-[#5B6B63]">{prefix.trim()}</span>}
                    <span>{num}</span>
                    <span className="text-[#16A34A]">{suffix}</span>
                  </span>

                  {/* Animated Counter Overlay (Hidden by default & on complete) */}
                  <span
                    aria-hidden="true"
                    data-counter-overlay
                    style={{ display: 'none' }}
                    className="pointer-events-none inline-flex items-baseline font-display text-[clamp(2.35rem,4.2vw,3.75rem)] font-extrabold leading-none tracking-[-0.035em] text-[#0B0F0D]"
                  >
                    {prefix && <span className="mr-2.5 text-[clamp(1.1rem,1.8vw,1.5rem)] font-bold text-[#5B6B63]">{prefix.trim()}</span>}
                    <span data-counter-number>0</span>
                    <span data-counter-suffix className="text-[#16A34A]">{suffix}</span>
                  </span>
                </div>

                {/* Bottom label */}
                <span className="text-[15px] font-semibold text-[#45544C] sm:text-[16px] lg:text-[17px] leading-snug">
                  {stat.label}
                </span>

                {/* Bottom subtle green accent on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#16A34A] to-[#22C55E] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ServiceIndustries({ content, onSelectIndustry }: { content: DigitalMarketingContent; onSelectIndustry: (name: string) => void }) {
  return (
    <section aria-labelledby="service-industries-title" className="overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-24">
      <div className="mx-auto w-[85%]">
        <h2 id="service-industries-title" className="font-display text-[clamp(1.65rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{content.industries.title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {industriesData.map((industry) => <button key={industry.id} type="button" onClick={() => onSelectIndustry(industry.name)} className="group flex min-h-14 items-center justify-between gap-2 rounded-full border border-[#0B0F0D]/10 bg-white px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-[#16A34A]/45 hover:bg-[#0B0F0D] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] sm:px-5 sm:text-base">
            <span>{industry.name}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#16A34A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>)}
        </div>
      </div>
    </section>
  );
}

export function ServiceCTA({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.fromTo(contentRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      const ring = ringRef.current;
      if (!ring) return;
      const tween = gsap.to(ring, { attr: { r: 360 }, opacity: 0, duration: 5, ease: 'sine.out', repeat: -1, paused: true });
      let inView = false;
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView && !document.hidden) tween.play(); else tween.pause(); }, { threshold: 0.01 });
      const visibility = () => { if (document.hidden) tween.pause(); else if (inView) tween.play(); };
      observer.observe(section);
      document.addEventListener('visibilitychange', visibility);
      return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
    }, section);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-cta-title" className="relative isolate overflow-hidden bg-[#16A34A] py-20 text-white sm:py-28">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" fill="none">
        <circle ref={ringRef} cx="1200" cy="420" r="180" stroke="white" strokeOpacity=".15" strokeWidth="1.5" />
        <circle cx="1200" cy="420" r="260" stroke="white" strokeOpacity=".08" strokeWidth="1.5" />
        <path d="M1100 660 1400 210M1230 660 1440 330" stroke="white" strokeOpacity=".1" strokeWidth="5" />
      </svg>
      <div ref={contentRef} className="relative z-10 mx-auto w-[85%]">
        <Eyebrow tone="ink">{content.cta.eyebrow}</Eyebrow>
        <h2 id="service-cta-title" className="mt-5 max-w-[16em] font-display text-[clamp(1.65rem,4vw,3.4rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">{content.cta.title}</h2>
        <p className="mt-5 max-w-[40em] text-base leading-[1.65] text-white/90 sm:text-[17px] lg:text-[18px]">{content.cta.text}</p>
        <a href="/contact" className="group mt-9 inline-flex min-h-12 items-center gap-4 rounded-full bg-[#0B0F0D] px-6 py-3 font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" onPointerMove={(event) => {
          if (event.pointerType === 'touch' || !window.matchMedia('(pointer: fine)').matches) return;
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty('--magnet-x', `${Math.max(-6, Math.min(6, (event.clientX - rect.left - rect.width / 2) * 0.08))}px`);
          event.currentTarget.style.setProperty('--magnet-y', `${Math.max(-6, Math.min(6, (event.clientY - rect.top - rect.height / 2) * 0.08))}px`);
          event.currentTarget.style.transform = 'translate(var(--magnet-x), var(--magnet-y))';
        }} onPointerLeave={(event) => { event.currentTarget.style.transform = ''; }}>
          {content.cta.button}<span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-[#B6F23D] text-[#0B0F0D]"><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </a>
      </div>
    </section>
  );
}
