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
  { x: 200, y: 50 }, { x: 324, y: 140 }, { x: 276, y: 285 }, { x: 124, y: 285 }, { x: 76, y: 140 },
];

function HubScene({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const orbitRef = useRef<SVGGElement>(null);
  useGSAP(() => {
    registerGsapPlugins();
    const svg = ref.current;
    const orbit = orbitRef.current;
    if (!svg || !orbit || reducedMotion) return;
    const lines = svg.querySelectorAll<SVGLineElement>('[data-hub-line]');
    const context = gsap.context(() => {
      gsap.fromTo(lines, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: svg, start: 'top 80%', once: true },
      });
    }, svg);
    const orbitTween = gsap.to(orbit, {
      rotation: 360,
      duration: 48,
      ease: 'none',
      repeat: -1,
      paused: true,
      svgOrigin: '200 180',
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) orbitTween.play();
      else orbitTween.pause();
    }, { threshold: 0.08 });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      orbitTween.kill();
      context.revert();
    };
  }, { scope: ref, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <svg ref={ref} viewBox="0 0 400 360" className="mx-auto block h-[280px] w-full max-w-[400px] sm:h-[340px]" aria-hidden="true">
      <defs><radialGradient id="service-hub-glow"><stop stopColor="#22C55E" stopOpacity=".22" /><stop offset="1" stopColor="#22C55E" stopOpacity="0" /></radialGradient></defs>
      <circle cx="200" cy="180" r="120" fill="url(#service-hub-glow)" />
      <g aria-hidden="true" fill="none" stroke="#16A34A" strokeOpacity=".12">
        <circle cx="200" cy="180" r="72" />
        <circle cx="200" cy="180" r="104" strokeDasharray="3 7" />
      </g>
      <g ref={orbitRef}>
      <g stroke="#16A34A" strokeOpacity=".65" strokeWidth="1.5" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1}>
        {hubPoints.map((point, index) => <line key={index} data-hub-line x1="200" y1="180" x2={point.x} y2={point.y} pathLength="1" />)}
      </g>
      {hubPoints.map((point, index) => {
        const Icon = hubIcons[index];
        return <g key={index}><circle cx={point.x} cy={point.y} r="25" fill="#F6FAF7" stroke="#16A34A" strokeWidth="1.5" /><foreignObject x={point.x - 12} y={point.y - 12} width="24" height="24"><Icon className="h-6 w-6 text-[#16A34A]" aria-hidden="true" /></foreignObject></g>;
      })}
      </g>
      <circle cx="200" cy="180" r="28" fill="#0B0F0D" />
      <circle cx="200" cy="180" r="8" fill="#16A34A" />
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.24] [background-image:radial-gradient(rgba(22,163,74,0.2)_0.75px,transparent_0.75px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
      <div className="mx-auto w-[90%] lg:w-[85%] max-w-7xl">
        <h2 id="service-what-title" className="max-w-none font-display text-[clamp(1.5rem,2.3vw,2.4rem)] font-extrabold leading-[1.12] tracking-[-0.03em] lg:whitespace-nowrap">{content.what.title}</h2>
        <div className="mt-7 grid grid-cols-1 gap-8 lg:mt-9 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <HubScene reducedMotion={reducedMotion} />
          </div>
          <div className="flex flex-col justify-center gap-7 lg:col-span-6 lg:col-start-7">
            {content.what.paragraphs.map((paragraph) => <RevealWords key={paragraph} text={paragraph} className="text-base leading-[1.65] text-[#0B0F0D] sm:text-[17px] lg:text-[18px]" />)}
          </div>
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
      gsap.fromTo(cards, { y: 20, opacity: 0, clipPath: 'inset(0 0 14% 0)' }, {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.6,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-catalog-title" className="relative overflow-hidden bg-[#0B0F0D] py-14 sm:py-20 text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 h-64 w-[600px] rounded-full bg-[#22C55E]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-80 rounded-full bg-[#16A34A]/[0.04] blur-[100px]" />

      <div className="relative z-10 mx-auto w-[85%] max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Eyebrow>{content.services.eyebrow}</Eyebrow>
            <h2 id="service-catalog-title" className="mt-3.5 max-w-[20em] font-display text-[clamp(1.65rem,3.2vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
              {content.services.title}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-sm self-start md:self-end shrink-0">
            <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-mono font-medium text-white/70">9 Core Growth Channels</span>
          </div>
        </div>

        <ul className="mt-8 sm:mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3.5 lg:gap-4">
          {content.services.items.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <li
                key={service.n}
                ref={(element) => { if (element) cardRefs.current[index] = element; }}
                onPointerMove={(event) => {
                  if (event.pointerType === 'touch') return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
                  event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
                }}
                className="group relative isolate flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#131D18] via-[#101714] to-[#0D1210] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#22C55E]/45 hover:shadow-[0_14px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(34,197,94,0.1)] before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(220px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(34,197,94,0.16),transparent_70%)] group-hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-x-4 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#22C55E]/30 after:to-transparent"
              >
                {/* Left: Icon container */}
                <div className="relative z-10 flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl border border-[#22C55E]/20 bg-gradient-to-br from-[#22C55E]/15 to-[#16A34A]/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:border-[#22C55E]/50 group-hover:bg-[#22C55E]/25 group-hover:scale-105">
                  <Icon aria-hidden="true" className="size-5 sm:size-5.5 text-[#22C55E] transition-all duration-300 group-hover:scale-110 group-hover:text-white" strokeWidth={1.8} />
                </div>

                {/* Center: Micro-tag + Service Name */}
                <div className="relative z-10 flex-1 min-w-0 pr-1">
                  <span className="block font-mono text-[10px] sm:text-[11px] font-semibold text-[#22C55E]/80 uppercase tracking-wider transition-colors duration-200 group-hover:text-[#16A34A]">
                    {service.n} • {service.tag}
                  </span>
                  <h3 className="mt-0.5 text-[14px] sm:text-[15px] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#22C55E] line-clamp-2">
                  {service.name}
                  </h3>
                </div>

                {/* Right: Sleek Action Arrow */}
                <div className="relative z-10 flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/40 transition-all duration-300 group-hover:border-[#22C55E]/40 group-hover:bg-[#22C55E]/10 group-hover:text-[#22C55E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-3.5 sm:size-4 transition-transform duration-300" strokeWidth={2} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const proofIcons = [Compass, TrendingUp, TrendingDown, Users, Building2];
const proofTags = [
  'Full-Funnel Strategy',
  'Top Google SERP',
  'Lower Acquisition Cost',
  'High-Intent Leads',
  'Multi-Sector Growth',
];

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
    <section
      ref={sectionRef}
      aria-labelledby="service-proof-title"
      className="relative isolate overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-28 border-y border-[#E2EBE5]"
    >
      {/* Ambient background glow & subtle dot pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-[500px] h-[350px] bg-[#16A34A]/[0.06] rounded-full blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/4 w-[450px] h-[300px] bg-[#22C55E]/[0.05] rounded-full blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto w-[85%] max-w-7xl">
        <div className="max-w-3xl max-[639px]:mx-auto max-[639px]:text-center">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 text-xs font-mono uppercase tracking-wider mb-4 font-semibold shadow-xs max-[639px]:mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <span>{content.why.eyebrow}</span>
          </div>

          {/* Title with Gradient Text */}
          <h2
            id="service-proof-title"
            className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0B0F0D] max-[639px]:text-center"
          >
            More Than Marketing.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#22C55E]">
              A Partner in Your Growth.
            </span>
          </h2>

          <p className="mt-3.5 text-xs sm:text-sm md:text-base text-[#475569] max-w-2xl leading-relaxed">
            Data-backed digital marketing designed to dominate search engines, capture high-intent buyers, and scale predictable revenue.
          </p>
        </div>

        {/* 5 Distinct Boxes Responsive Grid */}
        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {content.why.stats.map((stat: { value: string; label: string }, index: number) => {
            const Icon = proofIcons[index] ?? Compass;
            const tag = proofTags[index] ?? 'Proven Results';
            const match = stat.value.match(/^(.*?)(\d[\d,]*)(.*)$/);
            const prefix = match ? match[1] : '';
            const num = match ? match[2] : stat.value;
            const suffix = match ? match[3] : '';

            return (
              <li
                key={stat.label}
                ref={(element) => {
                  if (element) tileRefs.current[index] = element;
                }}
                data-stat-value={stat.value}
                className="group relative isolate flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E2EBE5] bg-white p-5 sm:p-6 lg:p-5 xl:p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#16A34A]/50 hover:shadow-[0_20px_40px_rgba(22,163,74,0.14)] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              >
                {/* Radial spotlight on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-[#16A34A]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Top Bar: Icon badge + ArrowUpRight */}
                <div>
                  <div className="flex items-center justify-between mb-5 max-[639px]:justify-center">
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-2xl border border-[#16A34A]/25 bg-[#F0FDF4] text-[#16A34A] shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] sm:size-12"
                    >
                      <Icon className="size-5 sm:size-6" strokeWidth={1.8} />
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center rounded-full bg-[#F4F8F5] border border-[#E2EBE5] text-[#55675E] group-hover:text-[#16A34A] group-hover:border-[#16A34A]/40 group-hover:bg-[#EAF5EE] transition-all duration-300 group-hover:scale-110 max-[639px]:hidden"
                    >
                      <ArrowUpRight className="size-4" strokeWidth={2} />
                    </span>
                  </div>

                  {/* Prefix like "Up to" */}
                  {prefix && (
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-[#16A34A] font-bold mb-1">
                      {prefix.trim()}
                    </span>
                  )}

                  {/* Middle metric number */}
                  <div className="mb-2 max-[639px]:text-center">
                    {/* Default & Final Value Display */}
                    <span
                      data-final-value
                      className="inline-flex items-baseline font-display text-[clamp(2.1rem,2.8vw,2.75rem)] font-extrabold leading-none tracking-tight text-[#0B0F0D] group-hover:text-[#15803D] transition-colors"
                    >
                      <span>{num}</span>
                      <span className="text-[#16A34A] ml-0.5">{suffix}</span>
                    </span>

                    {/* Animated Counter Overlay */}
                    <span
                      aria-hidden="true"
                      data-counter-overlay
                      style={{ display: 'none' }}
                      className="pointer-events-none inline-flex items-baseline font-display text-[clamp(2.1rem,2.8vw,2.75rem)] font-extrabold leading-none tracking-tight text-[#0B0F0D]"
                    >
                      <span data-counter-number>0</span>
                      <span data-counter-suffix className="text-[#16A34A] ml-0.5">{suffix}</span>
                    </span>
                  </div>

                  {/* Stat Label */}
                  <h3 className="text-[14px] sm:text-[15px] font-bold text-[#1E2922] leading-snug group-hover:text-[#0B0F0D] transition-colors max-[639px]:text-center">
                    {stat.label}
                  </h3>
                </div>

                {/* Bottom Tag / Micro-feature */}
                <div className="mt-5 pt-3.5 border-t border-[#EEF4F0] flex items-center justify-between max-[639px]:justify-center">
                  <span className="text-[11px] font-semibold text-[#6B7E74] group-hover:text-[#16A34A] transition-colors font-mono">
                    {tag}
                  </span>
                  <span className="size-1.5 rounded-full bg-[#16A34A]/30 group-hover:bg-[#16A34A] group-hover:scale-125 transition-all max-[639px]:hidden" />
                </div>

                {/* Bottom Glowing Accent Line on Hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#16A34A] to-[#22C55E] opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_8px_rgba(22,163,74,0.4)]"
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
      <div className="mx-auto w-[85%] max-w-7xl">
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
      <div ref={contentRef} className="relative z-10 mx-auto w-[85%] max-w-7xl">
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
          {content.cta.button}<span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-[#16A34A] text-[#0B0F0D]"><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </a>
      </div>
    </section>
  );
}
