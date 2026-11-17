'use client';

import { useRef } from 'react';
import {
  FileText, Heart, Infinity as InfinityIcon, Mail, Megaphone, MessageCircle,
  MessagesSquare, Network, Search, Share2, Target, ArrowUpRight,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { industriesData } from '@/data/industries';
import type { ServicePageContent } from '@/data/servicePages';
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

export function ServiceOverview({ content }: { content: ServicePageContent }) {
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

export function ServiceCatalog({ content }: { content: ServicePageContent }) {
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
              }} className="group relative flex min-h-[90px] items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111815] p-4 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#22C55E]/40 hover:shadow-[0_18px_45px_rgba(0,0,0,.2)] before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(220px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(34,197,94,.12),transparent_70%)] group-hover:before:opacity-100 sm:min-h-[160px] sm:flex-col sm:items-start sm:justify-between sm:p-6">
                <Icon aria-hidden="true" className="relative z-10 h-9 w-9 shrink-0 text-[#22C55E] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.6} />
                <span className="relative z-10 text-[15px] font-semibold leading-snug text-white sm:text-[17px]">{service}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ServiceProof({ content }: { content: ServicePageContent }) {
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
            finalValue.style.opacity = '0';
            overlay.style.opacity = '1';
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => { numeric.textContent = Math.round(counter.value).toLocaleString('en-US'); },
              onComplete: () => { finalValue.style.opacity = '1'; overlay.style.opacity = '0'; },
            });
          },
        });
      });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-proof-title" className="relative overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-28">
      <div className="mx-auto w-[85%]">
        <Eyebrow tone="ink">{content.why.eyebrow}</Eyebrow>
        <h2 id="service-proof-title" className="mt-5 max-w-[20em] font-display text-[clamp(1.65rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{content.why.title}</h2>
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.why.stats.map((stat, index) => <li key={stat.label} ref={(element) => { if (element) tileRefs.current[index] = element; }} data-stat-value={stat.value} className={`group relative isolate flex min-h-[190px] flex-col justify-between overflow-hidden rounded-3xl border border-[#0B0F0D]/10 bg-white p-6 transition-transform duration-300 hover:-translate-y-1 ${index === 0 ? 'sm:col-span-2 lg:min-h-[260px]' : ''}`}>
            <svg aria-hidden="true" className="absolute right-4 top-4 h-14 w-20 opacity-15 transition-opacity group-hover:opacity-50" viewBox="0 0 80 56" fill="none"><path d="M2 48 23 34 38 39 58 17 77 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="m66 7 11 0 0 11" stroke="#16A34A" strokeWidth="2" /></svg>
            <span data-final-value className="font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em] transition-opacity">{stat.value.replace(/(°|L\+|\+|%)$/, '')}<span className="text-[#16A34A]">{stat.value.match(/(°|L\+|\+|%)$/)?.[0]}</span></span>
            <span aria-hidden="true" data-counter-overlay className="pointer-events-none absolute left-6 top-6 font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-extrabold leading-none tracking-[-0.04em] opacity-0">
              {stat.value.match(/^(.*?)(\d[\d,]*)(.*)$/)?.[1]}<span data-counter-number>0</span><span data-counter-suffix className="text-[#16A34A]">{stat.value.match(/^(.*?)(\d[\d,]*)(.*)$/)?.[3]}</span>
            </span>
            <span className="text-[14px] font-medium text-[#5B6B63] sm:text-[16px]">{stat.label}</span>
            <span aria-hidden="true" className="absolute bottom-0 left-6 h-1 w-0 bg-[#16A34A] transition-all duration-500 group-hover:w-16" />
          </li>)}
        </ul>
      </div>
    </section>
  );
}

export function ServiceIndustries({ content, onSelectIndustry }: { content: ServicePageContent; onSelectIndustry: (name: string) => void }) {
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

export function ServiceCTA({ content }: { content: ServicePageContent }) {
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
