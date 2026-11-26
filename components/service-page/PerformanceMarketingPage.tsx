'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { ChartNoAxesCombined, Compass, Crosshair, FileChartColumnIncreasing, PanelsTopLeft, PenLine, Settings2, WalletCards, Megaphone, ChartSpline } from 'lucide-react';
import { AboutStory } from '@/components/sections/about/AboutStory';
import { Industries } from '@/components/sections/Industries';
import type { PerformanceMarketingContent } from '@/data/servicePages/performance-marketing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { Eyebrow } from './ServiceUI';
import { ServiceBreadcrumb } from './ServiceBreadcrumb';
import { DashWindow, Donut, FunnelMini, Gauge, KpiTile, LineChart, PlatformVisual, Target } from './mockups/dashboard/DashboardKit';

const ink = '#0B0F0D';
const green = '#22C55E';
const lime = '#B6F23D';

function PerformanceHero({ content }: { content: PerformanceMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const titleLineRefs = useRef<HTMLSpanElement[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const lines = titleLineRefs.current.filter(Boolean);
    const kpis = gsap.utils.toArray<HTMLElement>('[data-pm-kpi]', section);
    const chart = section.querySelector<SVGPathElement>('.pm-chart-line');
    const area = section.querySelector<SVGPathElement>('.pm-chart-area');
    const needle = section.querySelector<SVGPathElement>('.pm-gauge-needle');
    const donuts = gsap.utils.toArray<SVGCircleElement>('.pm-donut-segment', section);
    const dart = section.querySelector<SVGPathElement>('.pm-dart');
    const hit = section.querySelector<SVGCircleElement>('.pm-target-hit');
    const dashboard = dashboardRef.current;
    const timeline = gsap.timeline({ delay: .2, scrollTrigger: { trigger: section, start: 'top top', once: true } });
    if (lines.length) timeline.fromTo(lines, { yPercent: 110, rotateX: 38, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: .76, stagger: .15, ease: 'expo.out' }, 0);
    if (kpis.length) timeline.fromTo(kpis, { y: 22, scale: .92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .48, stagger: .11, ease: 'back.out(1.5)' }, .25);
    if (chart) {
      const length = chart.getTotalLength();
      gsap.set(chart, { strokeDasharray: length, strokeDashoffset: length });
      timeline.to(chart, { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut' }, .65);
    }
    if (area) timeline.fromTo(area, { opacity: 0 }, { opacity: 1, duration: .5 }, .85);
    if (needle) timeline.fromTo(needle, { rotation: -48, transformOrigin: '70px 68px' }, { rotation: 0, duration: .72, ease: 'elastic.out(1,.6)' }, 1.1);
    if (donuts.length) timeline.fromTo(donuts, { strokeDasharray: '0 214' }, { strokeDasharray: (index) => index === 0 ? '88 214' : '58 214', duration: .48, stagger: .15, ease: 'power2.inOut' }, 1.25);
    if (dart) timeline.fromTo(dart, { x: -80, y: -35, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .58, ease: 'power2.inOut' }, 1.65);
    if (hit) timeline.fromTo(hit, { scale: .4, transformOrigin: '50% 50%' }, { scale: 1.7, duration: .24, yoyo: true, repeat: 1, ease: 'power2.out' }, 2.12);
    const rider = section.querySelector<SVGCircleElement>('.pm-chart-rider');
    if (chart && rider) {
      const length = chart.getTotalLength();
      const point = { progress: 0 };
      timeline.call(() => {
        gsap.to(point, { progress: 1, duration: 8, repeat: -1, ease: 'none', onUpdate: () => {
          const p = chart.getPointAtLength(point.progress * length);
          gsap.set(rider, { attr: { cx: p.x, cy: p.y } });
        } });
      }, [], 2.45);
    }
    if (dashboard && matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) {
      const xTo = gsap.quickTo(dashboard, 'rotationY', { duration: .8, ease: 'power2.out' });
      const yTo = gsap.quickTo(dashboard, 'rotationX', { duration: .8, ease: 'power2.out' });
      const move = (event: globalThis.PointerEvent) => {
        const bounds = dashboard.getBoundingClientRect();
        xTo(((event.clientX - bounds.left) / bounds.width - .5) * 8 - 10);
        yTo((.5 - (event.clientY - bounds.top) / bounds.height) * 8 + 4);
      };
      const leave = () => { xTo(-10); yTo(4); };
      dashboard.addEventListener('pointermove', move);
      dashboard.addEventListener('pointerleave', leave);
      return () => { timeline.scrollTrigger?.kill(); dashboard.removeEventListener('pointermove', move); dashboard.removeEventListener('pointerleave', leave); };
    }
    return () => timeline.scrollTrigger?.kill();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return <section ref={sectionRef} aria-labelledby="performance-hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[20%] h-[460px] w-[460px] rounded-full bg-[#16A34A]/15 blur-[130px]"/>
    <div className="relative z-10 mx-auto grid min-h-[100svh] w-[85%] max-w-7xl grid-cols-1 content-center gap-y-6 pb-12 pt-32 sm:gap-y-7 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-10 lg:pt-[120px]">
      <div className="order-1 mb-1 flex min-w-0 items-center lg:col-span-6 lg:col-start-1 lg:row-start-1">
        <ServiceBreadcrumb current={content.hero.eyebrow}/>
      </div>
      <h1 id="performance-hero-title" className="hero-display-title order-2 m-0 max-[639px]:text-center lg:col-span-6 lg:col-start-1 lg:row-start-2">
          <span ref={(node) => { if (node) titleLineRefs.current[0] = node; }} className="block">We Drive Campaigns.</span>
          <span ref={(node) => { if (node) titleLineRefs.current[1] = node; }} className="relative block w-fit bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#B6F23D] bg-clip-text text-transparent max-[639px]:mx-auto">You See Results.<svg aria-hidden="true" className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 360 14" preserveAspectRatio="none"><path d="M3 10C88 2 230 3 355 8" fill="none" stroke={lime} strokeWidth="3" strokeLinecap="round"/></svg></span>
        </h1>
      <div className="relative order-3 mx-auto w-full max-w-[570px] lg:col-span-6 lg:col-start-7 lg:row-span-3 lg:row-start-1 lg:ml-auto lg:max-w-none">
        <div ref={dashboardRef} className="hidden lg:block" style={{ transform: 'perspective(1400px) rotateY(-10deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}>
          <DashWindow>
            <div className="grid grid-cols-3 gap-2.5"><KpiTile/><KpiTile/><KpiTile/></div>
            <div className="mt-3 grid grid-cols-[1.55fr_.8fr] gap-3">
              <div className="relative min-h-[190px] rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><LineChart className="absolute inset-0 h-full w-full p-3"/></div>
              <div className="flex flex-col gap-3"><div className="flex flex-1 items-center justify-center rounded-2xl border border-white/[.07] bg-white/[.025] p-2"><Gauge className="w-full"/></div><div className="flex flex-1 items-center justify-center rounded-2xl border border-white/[.07] bg-white/[.025] p-2"><Donut className="h-16 w-16"/></div></div>
            </div>
          </DashWindow>
          <div className="absolute -bottom-7 -right-7 grid size-24 place-items-center rounded-full border border-[#22C55E]/25 bg-[#0B0F0D]/90 shadow-[0_0_40px_rgba(34,197,94,.16)]"><Target className="size-[5.5rem]"/></div>
        </div>
          <div className="grid grid-cols-2 gap-3 lg:hidden">
          <DashWindow className="col-span-2"><div className="relative h-[170px] rounded-xl border border-white/[.07] bg-white/[.025]"><LineChart className="absolute inset-0 h-full w-full p-3"/></div></DashWindow>
            <div className="col-span-2 flex h-[84px] items-center justify-center rounded-2xl border border-white/[.08] bg-[#111815] p-2"><Gauge className="h-full w-full max-w-[190px]"/></div>
        </div>
      </div>
      <p className="order-4 max-w-[36em] text-base leading-[1.65] text-white/[0.76] sm:text-[17px] lg:col-span-6 lg:col-start-1 lg:row-start-3 lg:mt-6 lg:text-[18px]">{content.hero.text}</p>
    </div>
  </section>;
}

function MetricVisual({ index }: { index: number }) {
  const base = 'h-[60px] w-full';
  if (index === 0) return <svg aria-hidden="true" viewBox="0 0 120 60" className={base}><circle cx="60" cy="30" r="24" fill="none" stroke={green} strokeOpacity=".24" strokeWidth="2"/><circle cx="60" cy="30" r="14" fill="none" stroke={green} strokeOpacity=".55" strokeWidth="2"/><circle cx="60" cy="30" r="4" fill={lime}/><path d="M60 2v14M60 44v14M32 30h14m28 0h14" stroke={ink} strokeOpacity=".55" strokeWidth="2"/><circle className="pm-metric-ping" cx="16" cy="17" r="3" fill={green}/><circle cx="102" cy="46" r="3" fill={green}/></svg>;
  if (index === 1) return <FunnelMini className={base}/>;
  if (index === 2) return <svg aria-hidden="true" viewBox="0 0 120 60" className={base}><path d="M15 52h92" stroke={ink} strokeOpacity=".15" strokeWidth="2"/><rect x="24" y="34" width="13" height="18" rx="3" fill={green}/><rect x="48" y="25" width="13" height="27" rx="3" fill="#16A34A"/><rect x="72" y="13" width="13" height="39" rx="3" fill={lime}/><path d="m27 26 28-9 20 1 26-12m-10 0 10 0-1 10" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (index === 3) return <LineChart className={`${base} rounded-lg bg-[#F6FAF7] p-1`}/>;
  if (index === 4) return <Donut className={`${base} p-1`}/>;
  return <div className="flex h-[60px] items-center gap-3"><Gauge className="h-full w-24"/><ChartNoAxesCombined aria-hidden="true" className="size-8 text-[#16A34A]"/></div>;
}

function PerformanceWhy({ content }: { content: PerformanceMarketingContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    const cards = cardRefs.current.filter(Boolean);
    if (reducedMotion || !cards.length) return;
    gsap.fromTo(cards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true } });
  }, { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={rootRef} aria-labelledby="performance-why-title" className="relative overflow-hidden bg-[#F6FAF7] pb-16 pt-28 text-[#0B0F0D] sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
    <div className="mx-auto grid w-[90%] max-w-[1280px] gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5"><h2 id="performance-why-title" className="max-w-[17ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.04em]">We Don’t Just Generate Leads. <span className="bg-[linear-gradient(transparent_70%,rgba(182,242,61,0.55)_70%)] text-[#16A34A]">We Grow Businesses.</span></h2><p className="mt-6 max-w-[34em] text-base leading-[1.75] text-[#5B6B63] sm:text-lg">{content.why.text}</p></div>
      <div className="lg:col-span-7"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0B0F0D] px-4 py-2 text-sm font-bold text-[#B6F23D]"><span aria-hidden="true" className="size-2 rounded-full bg-[#22C55E]"/>{content.why.label}</div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{content.why.points.map((point, index) => <li key={point} data-n={`0${index + 1}`} ref={(node) => { if (node) cardRefs.current[index] = node; }} className="group relative min-h-[132px] overflow-hidden rounded-[22px] border border-[#0B0F0D]/[.08] bg-white p-4 pt-3 shadow-[0_12px_28px_rgba(11,15,13,.04)] transition duration-300 before:absolute before:right-4 before:top-3 before:font-mono before:text-[11px] before:tracking-[.16em] before:text-[#0B0F0D]/30 before:content-[attr(data-n)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-[#16A34A]/40 motion-safe:hover:shadow-[0_18px_34px_rgba(11,15,13,.1)] sm:min-h-[150px] sm:p-[22px]"><MetricVisual index={index}/><span className="mt-2 block pr-5 text-[15px] font-semibold leading-snug sm:text-[17px]">{point}</span></li>)}</ul>
      </div>
    </div>
  </section>;
}

const presets = [
  [34, 68, 46, 78, 52, 86, 61],
  [72, 42, 84, 54, 76, 48, 92],
  [48, 82, 58, 91, 43, 72, 56],
  [88, 56, 74, 38, 84, 62, 78],
];

function PerformanceApproach({ content }: { content: PerformanceMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<HTMLSpanElement[]>([]);
  const knobRefs = useRef<HTMLSpanElement[]>([]);
  const rootPanelRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || paused || !rootPanelRef.current) return;
    const fills = trackRefs.current.filter(Boolean);
    const knobs = knobRefs.current.filter(Boolean);
    if (!fills.length || !knobs.length) return;
    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.1, scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', end: 'bottom top', toggleActions: 'play pause resume pause' } });
    presets.slice(1).forEach((preset) => {
      timeline.to(fills, { width: (index) => `${preset[index]}%`, duration: .9, stagger: .06, ease: 'expo.inOut' }, '<');
      timeline.to(knobs, { left: (index) => `${preset[index]}%`, duration: .9, stagger: .06, ease: 'expo.inOut' }, '<');
    });
    return () => timeline.scrollTrigger?.kill();
  }, { scope: sectionRef, dependencies: [reducedMotion, paused], revertOnUpdate: true });
  return <section ref={sectionRef} aria-labelledby="performance-approach-title" className="relative overflow-hidden bg-[#0B0F0D] pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/45 to-transparent"/>
    <div className="mx-auto w-[90%] max-w-[1280px]">
      <Eyebrow>{content.approach.eyebrow}</Eyebrow>
      <h2 id="performance-approach-title" className="mt-5 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.04em]">{content.approach.title}</h2>
      <p className="mt-5 max-w-[44em] text-base leading-[1.75] text-white/75 sm:text-lg">{content.approach.text}</p>
      <div ref={rootPanelRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }} className="relative mt-9 overflow-hidden rounded-[26px] border border-white/[.08] bg-[#111815] p-5 shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:p-7 lg:p-10">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#16A34A]/0 via-[#B6F23D] to-[#16A34A]/0"/>
        <ul className="divide-y divide-white/[.07]">{content.approach.points.map((point, index) => <li key={point} data-n={`0${index + 1}`} tabIndex={0} onMouseEnter={(event) => { const fill = event.currentTarget.querySelector<HTMLElement>('[data-fader-fill]'); const knob = event.currentTarget.querySelector<HTMLElement>('[data-fader-knob]'); if (fill) gsap.to(fill, { width: '100%', duration: .25, ease: 'power2.out' }); if (knob) gsap.to(knob, { left: '100%', duration: .25, ease: 'power2.out' }); }} onMouseLeave={(event) => { const fill = event.currentTarget.querySelector<HTMLElement>('[data-fader-fill]'); const knob = event.currentTarget.querySelector<HTMLElement>('[data-fader-knob]'); if (fill && !reducedMotion) gsap.to(fill, { width: `${presets[0][index]}%`, duration: .35, ease: 'power2.out' }); if (knob && !reducedMotion) gsap.to(knob, { left: `${presets[0][index]}%`, duration: .35, ease: 'power2.out' }); }} onFocus={(event) => { const fill = event.currentTarget.querySelector<HTMLElement>('[data-fader-fill]'); const knob = event.currentTarget.querySelector<HTMLElement>('[data-fader-knob]'); if (fill) gsap.to(fill, { width: '100%', duration: .25, ease: 'power2.out' }); if (knob) gsap.to(knob, { left: '100%', duration: .25, ease: 'power2.out' }); }} onBlur={(event) => { if (event.currentTarget.contains(event.relatedTarget as Node | null)) return; const fill = event.currentTarget.querySelector<HTMLElement>('[data-fader-fill]'); const knob = event.currentTarget.querySelector<HTMLElement>('[data-fader-knob]'); if (fill && !reducedMotion) gsap.to(fill, { width: `${presets[0][index]}%`, duration: .35, ease: 'power2.out' }); if (knob && !reducedMotion) gsap.to(knob, { left: `${presets[0][index]}%`, duration: .35, ease: 'power2.out' }); }} className="group grid gap-3 py-4 first:pt-1 last:pb-1 outline-none focus-visible:bg-white/[.025] sm:py-5 md:grid-cols-[1fr_minmax(180px,.62fr)] md:items-center"><div className="flex items-center gap-4"><span aria-hidden="true" className="hidden font-mono text-xs tracking-[.16em] text-white/35 sm:block">{`0${index + 1}`}</span><span className="text-[clamp(1.05rem,.95rem + .6vw,1.5rem)] font-semibold leading-snug text-white transition-colors group-hover:text-[#B6F23D] group-focus-visible:text-[#B6F23D]">{point}</span></div><div aria-hidden="true" className="pl-0 sm:pl-12 md:pl-0"><div className="relative h-1 rounded-full bg-white/[.12]"><span data-fader-fill ref={(node) => { if (node) trackRefs.current[index] = node; }} className="absolute inset-y-0 left-0 w-[var(--fader-width)] rounded-full bg-gradient-to-r from-[#16A34A] to-[#B6F23D]" style={{ '--fader-width': `${presets[0][index]}%` } as CSSProperties}/><span data-fader-knob ref={(node) => { if (node) knobRefs.current[index] = node; }} className="absolute left-[var(--fader-width)] top-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#B6F23D] bg-[#0B0F0D] shadow-[0_0_18px_rgba(34,197,94,.45)] transition-[left,box-shadow] duration-300" style={{ '--fader-width': `${presets[0][index]}%` } as CSSProperties}/></div><div className="mt-2 flex justify-between px-0.5">{Array.from({ length: 12 }, (_, tick) => <i key={tick} className="h-1 w-px bg-white/15"/>)}</div></div></li>)}</ul>
      </div>
    </div>
  </section>;
}

const workIcons = [ChartSpline, Compass, Crosshair, WalletCards, PenLine, Megaphone, PanelsTopLeft, FileChartColumnIncreasing, Settings2];
function CampaignLoop({ content }: { content: PerformanceMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => { if (visible && hovered === null && !document.hidden && !timer) timer = setInterval(() => setActiveCard((index) => (index + 1) % 9), 1100); };
    const stop = () => { if (timer) clearInterval(timer); timer = undefined; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop(); }, { threshold: .1 });
    observer.observe(section);
    const visibility = () => document.hidden ? stop() : start();
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); stop(); };
  }, [reducedMotion, hovered]);
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion) return;
    gsap.fromTo(cardRefs.current.filter(Boolean), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={sectionRef} aria-labelledby="performance-work-title" className="relative overflow-hidden bg-[#F6FAF7] pb-16 pt-28 text-[#0B0F0D] sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
    <div className="mx-auto w-[90%] max-w-[1280px]"><Eyebrow tone="ink">{content.whatWeDo.eyebrow}</Eyebrow><h2 id="performance-work-title" className="mt-5 max-w-[23ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.04em]">{content.whatWeDo.title}</h2><p className="mt-5 max-w-[44em] text-base leading-[1.75] text-[#5B6B63] sm:text-lg">{content.whatWeDo.text}</p>
      <ul className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{content.whatWeDo.items.map((item, index) => { const Icon = workIcons[index]; return <li key={item.title} data-n={`0${index + 1}`} ref={(node) => { if (node) cardRefs.current[index] = node; }} onMouseEnter={() => { setHovered(index); setActiveCard(index); }} onMouseLeave={() => setHovered(null)} className={`group relative min-h-[205px] rounded-[24px] border bg-white p-5 shadow-[0_14px_36px_rgba(11,15,13,.055)] transition duration-300 before:absolute before:right-5 before:top-5 before:font-mono before:text-xs before:tracking-[.15em] before:text-[#0B0F0D]/35 before:content-[attr(data-n)] ${hovered === index || hovered === null && activeCard === index ? 'border-[#16A34A]/50 shadow-[0_18px_45px_rgba(11,15,13,.11)]' : 'border-[#0B0F0D]/[.08]'} motion-safe:hover:-translate-y-1.5 sm:p-[26px]`}>
          <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#16A34A] text-[#0B0F0D] transition-transform duration-300 group-hover:scale-105"><Icon aria-hidden="true" className="size-5"/></div><h3 className="mt-5 pr-9 text-[18px] font-bold leading-snug sm:text-xl">{item.title}</h3><p className="mt-2 text-[15px] leading-[1.65] text-[#5B6B63] sm:text-base">{item.text}</p><span aria-hidden="true" className={`absolute bottom-0 left-6 h-[2px] rounded-full bg-[#16A34A] transition-all duration-500 ${hovered === index || hovered === null && activeCard === index ? 'right-6 opacity-100' : 'right-[80%] opacity-40'}`}/>
        </li>; })}</ul>
      <div aria-hidden="true" className="mt-4 hidden items-center justify-center gap-3 lg:flex"><span className="h-px w-24 bg-[#16A34A]/25"/><span className="size-2 rounded-full bg-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,.8)]"/><span className="h-px w-24 bg-[#16A34A]/25"/></div>
    </div>
  </section>;
}

function PerformancePlatforms({ content }: { content: PerformanceMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 40 });
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion) return;
    gsap.fromTo(cardRefs.current.filter(Boolean), { y: 20, clipPath: 'inset(12% 0 0 0)', opacity: 0 }, { y: 0, clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: .62, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  const moveSpotlight = (event: PointerEvent<HTMLUListElement>) => {
    if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  };
  return <section ref={sectionRef} aria-labelledby="performance-platforms-title" className="relative overflow-hidden bg-[#0B0F0D] pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
    <div className="mx-auto w-[90%] max-w-[1280px]"><Eyebrow>{content.platforms.eyebrow}</Eyebrow><h2 id="performance-platforms-title" className="mt-5 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.04em]">Your Audience Is Everywhere. <span className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">So Are We.</span></h2><p className="mt-5 max-w-[44em] text-base leading-[1.75] text-white/75 sm:text-lg">{content.platforms.text}</p>
      <ul onPointerMove={moveSpotlight} className="relative mt-10 grid grid-cols-2 gap-3 rounded-[28px] sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5" style={{ '--spot-x': `${spotlight.x}%`, '--spot-y': `${spotlight.y}%`, background: 'radial-gradient(320px circle at var(--spot-x) var(--spot-y), rgba(34,197,94,.14), transparent 72%)' } as CSSProperties}>
        {content.platforms.items.map((item, index) => <li key={item} data-n={`0${index + 1}`} ref={(node) => { if (node) cardRefs.current[index] = node; }} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} className={`group/platform relative z-10 flex aspect-[4/5] min-w-0 flex-col overflow-hidden rounded-[22px] border bg-[#111815] transition duration-300 before:absolute before:right-4 before:top-4 before:z-20 before:font-mono before:text-[11px] before:tracking-[.16em] before:text-white/50 before:content-[attr(data-n)] ${hovered !== null && hovered !== index ? 'opacity-75' : 'opacity-100'} ${hovered === index ? 'border-[#22C55E]/65 shadow-[0_24px_55px_rgba(0,0,0,.3)]' : 'border-white/[.08]'} motion-safe:hover:-translate-y-2 lg:aspect-[4/3]`}>
          <div className="relative h-[62%] overflow-hidden bg-gradient-to-br from-[#12331F] via-[#14532D] to-[#0B0F0D]"><PlatformVisual index={index}/><span aria-hidden="true" className="pointer-events-none absolute -left-1/2 top-0 z-10 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover/platform:left-[150%] group-hover/platform:opacity-100"/></div>
          <div className="relative flex flex-1 items-center px-4 py-3 pr-8 sm:px-5"><p className="text-[14px] font-semibold leading-snug text-white sm:text-base lg:text-[17px]">{item}</p></div>
        </li>)}
      </ul>
    </div>
  </section>;
}

export function PerformanceMarketingPage({ content, onSelectIndustry }: { content: PerformanceMarketingContent; onSelectIndustry: (name: string) => void }) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, []);
  const sectionRegistry = {
    hero: () => <PerformanceHero key="hero" content={content}/> ,
    why: () => <PerformanceWhy key="why" content={content}/> ,
    approach: () => <PerformanceApproach key="approach" content={content}/> ,
    whatWeDo: () => <CampaignLoop key="whatWeDo" content={content}/> ,
    platforms: () => <PerformancePlatforms key="platforms" content={content}/> ,
    whyLeadsGrow: () => <AboutStory key="whyLeadsGrow"/> ,
    industries: () => <Industries key="industries" onSelectIndustry={onSelectIndustry}/> ,
  };
  return <>{content.sections.map((section) => sectionRegistry[section]())}</>;
}
