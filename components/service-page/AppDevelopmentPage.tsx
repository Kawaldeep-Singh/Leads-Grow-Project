'use client';

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowLeft, ArrowRight, Bell, Check, Heart, Layers3, LockKeyhole, Plug, Smartphone, Sparkles, Activity, Zap, Compass, Star, TrendingUp, ShieldCheck, RefreshCw, Palette } from 'lucide-react';
import type { AppDevelopmentContent } from '@/data/servicePages/app-development';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Industries } from '@/components/sections/Industries';
import { Stats } from '@/components/sections/Stats';
import { Eyebrow } from './ServiceUI';
import { ServiceBreadcrumb } from './ServiceBreadcrumb';
import { AppIcon, AppScreen, Notification, PhoneFrame, StoreGlyph } from './mockups/phone/PhoneKit';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';

const circuitIcons = [Layers3, LockKeyhole, Bell, Plug, Activity, Layers3, Zap, Compass];
const cardTones = [
  'from-[#16A34A]/35 via-[#0B0F0D] to-[#0B0F0D]', 'from-[#B6F23D]/25 via-[#102218] to-[#0B0F0D]',
  'from-[#22C55E]/30 via-[#102218] to-[#0B0F0D]', 'from-[#16A34A]/25 via-[#0B0F0D] to-[#101A14]',
  'from-[#B6F23D]/20 via-[#163321] to-[#0B0F0D]', 'from-[#16A34A]/35 via-[#102218] to-[#0B0F0D]',
  'from-[#22C55E]/25 via-[#13281B] to-[#0B0F0D]', 'from-[#16A34A]/30 via-[#0B0F0D] to-[#0B0F0D]',
];

function AppHero({ content }: { content: AppDevelopmentContent }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<HTMLDivElement>(null);
  const wireframeRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLDivElement>(null);
  const pingRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const titleLines = ['We Turn Your Ideas', 'into Powerful', 'Apps.'];
  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    const sketch = sketchRef.current;
    const wireframe = wireframeRef.current;
    const finished = finishedRef.current;
    const launch = launchRef.current;
    const ping = pingRef.current;
    const front = frontRef.current;
    if (!scene || !sketch || !wireframe || !finished || !launch || !ping || !front) return;
    gsap.set([sketch, wireframe, finished, launch], { autoAlpha: 0, y: 10 });
    if (reducedMotion) {
      gsap.set([finished, launch], { autoAlpha: 1, y: 0 });
      return;
    }
    const build = gsap.timeline({ paused: true });
    build.fromTo(sketch, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .42, ease: 'expo.out' })
      .to(sketch, { autoAlpha: 0, duration: .18 }, '+=.42')
      .fromTo(wireframe, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .42, ease: 'expo.out' })
      .to(wireframe, { autoAlpha: 0, duration: .18 }, '+=.42')
      .fromTo(finished, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'expo.out' })
      .fromTo(launch, { autoAlpha: 0, y: -24, scale: .8 }, { autoAlpha: 1, y: 0, scale: 1, duration: .55, ease: 'bounce.out' }, '+=.3');
    const float = gsap.to(front, { y: -6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
    const pingLoop = gsap.to(ping, { scale: 1.35, opacity: .25, duration: .7, repeat: -1, repeatDelay: 4.6, yoyo: true, ease: 'sine.inOut', paused: true });
    let inView = false;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) { if (build.progress() === 0) build.play(); float.play(); pingLoop.play(); }
      else { float.pause(); pingLoop.pause(); }
    }, { threshold: .08 });
    const visibility = () => { if (document.hidden || !inView) { float.pause(); pingLoop.pause(); } else { float.play(); pingLoop.play(); } };
    observer.observe(scene);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); build.kill(); float.kill(); pingLoop.kill(); };
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section aria-labelledby="app-hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
    <div className="mx-auto grid min-h-[100svh] w-[90%] max-w-[1280px] grid-cols-1 items-center gap-6 pb-12 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pb-10 lg:pt-24">
      <div className="relative z-10 order-1 flex min-w-0 flex-col lg:col-span-6 lg:row-start-1">
        <div className="mb-1 flex min-w-0 items-center">
          <ServiceBreadcrumb current={content.hero.eyebrow} />
        </div>
        <h1 id="app-hero-title" className="mt-4 font-display text-[clamp(2.1rem,9.5vw,3rem)] font-extrabold leading-[1.1] tracking-[-.035em] sm:text-[clamp(2.6rem,3.8vw,4.4rem)] sm:leading-[1.08]">
          <span className="block lg:whitespace-nowrap">{titleLines[0]}</span><span className="block text-transparent lg:whitespace-nowrap" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.92)', WebkitTextFillColor: 'transparent' }}>{titleLines[1]}</span><span className="block bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">{titleLines[2]}</span>
        </h1>
      </div>
      <div ref={sceneRef} aria-hidden="true" className="relative mx-auto order-2 flex h-[380px] sm:h-[460px] w-full max-w-[560px] items-center justify-center lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:h-[620px]">
        <div className="absolute size-[75%] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,.25),rgba(22,163,74,.08)_45%,transparent_72%)]" />

        {/* Android Phone (left, punch-hole camera, 9:16 aspect ratio, reduced by ~20% and shifted down) */}
        <div className="absolute left-[4%] sm:left-[8%] lg:left-[6%] top-[18%] sm:top-[16%] lg:top-[16%] h-[60%] sm:h-[64%] lg:h-[68%] aspect-[9/16] w-auto -rotate-[7deg] opacity-95 transition-transform duration-500">
          <PhoneFrame variant="punch" className="h-full w-full aspect-[9/16] shadow-[0_25px_60px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0C140F] p-2.5 sm:p-3 pt-5 text-white select-none">
              {/* Android Status Bar */}
              <div className="mb-2 flex items-center justify-between px-1 text-[9px] text-white/70">
                <span className="font-semibold text-white/90">9:41</span>
                <div className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                  <span className="text-[8px]">5G</span>
                  <span className="h-2 w-3 rounded-[2px] border border-white/60 p-[1px]"><i className="block h-full w-2/3 bg-[#22C55E]" /></span>
                </div>
              </div>

              {/* App Mini Header */}
              <div className="mb-2 flex items-center justify-between rounded-xl bg-white/[0.07] p-2">
                <div className="flex items-center gap-1.5">
                  <span className="grid size-5 place-items-center rounded-lg bg-[#16A34A] text-white"><Layers3 className="size-3" /></span>
                  <div className="leading-tight">
                    <p className="text-[9px] font-bold text-white">LeadsGrow App</p>
                    <p className="text-[7px] text-[#22C55E]">● Live Sync</p>
                  </div>
                </div>
                <span className="rounded bg-[#22C55E]/20 px-1 py-0.5 text-[8px] font-semibold text-[#22C55E]">v2.8</span>
              </div>

              {/* Live Metric / Analytics Bar Chart */}
              <div className="mb-2 rounded-xl border border-white/10 bg-gradient-to-br from-[#16A34A]/25 via-white/[0.04] to-transparent p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[8px] text-white/70">Active Users</span>
                  <span className="flex items-center gap-0.5 text-[8px] font-bold text-[#22C55E]"><TrendingUp className="size-2.5" /> +38%</span>
                </div>
                <p className="font-mono text-xs font-extrabold text-white leading-none">14,290</p>
                <div className="mt-1.5 flex h-7 items-end gap-1">
                  {[42, 68, 50, 85, 62, 98, 76].map((h, i) => (
                    <i key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#B6F23D' : '#16A34A' }} />
                  ))}
                </div>
              </div>

              {/* Interactive Features List */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.06] p-1.5">
                  <div className="flex items-center gap-1.5">
                    <Zap className="size-3 text-[#B6F23D]" />
                    <span className="text-[8px] font-semibold text-white/90">Instant Order Tracking</span>
                  </div>
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.06] p-1.5">
                  <div className="flex items-center gap-1.5">
                    <Bell className="size-3 text-[#22C55E]" />
                    <span className="text-[8px] font-semibold text-white/90">Smart Notifications</span>
                  </div>
                  <span className="h-2.5 w-4 rounded-full bg-[#16A34A] p-0.5 flex items-center justify-end"><i className="size-1.5 rounded-full bg-white block" /></span>
                </div>
              </div>

              {/* Android Bottom Dock */}
              <div className="mt-auto flex h-5 items-center justify-around border-t border-white/10 pt-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`size-1 rounded-full ${i === 0 ? 'bg-[#22C55E]' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
            <span className="absolute -left-2 sm:-left-3 bottom-[20%] z-30 flex items-center gap-1.5 rounded-full border border-[#22C55E]/30 bg-[#0B0F0D]/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-[#22C55E] backdrop-blur-md shadow-xl">
              <span className="size-1.5 rounded-full bg-[#22C55E]" />
              Android
            </span>
          </PhoneFrame>
        </div>

        {/* iOS Phone (front right, Dynamic Island notch, 9:16 aspect ratio, reduced by ~20% and shifted down) */}
        <div ref={frontRef} className="relative z-10 h-[68%] sm:h-[72%] lg:h-[76%] aspect-[9/16] w-auto translate-x-8 sm:translate-x-12 lg:translate-x-14 translate-y-8 sm:translate-y-10 lg:translate-y-12 rotate-[4deg] transition-transform duration-700">
          <PhoneFrame variant="round" className="h-full w-full aspect-[9/16] shadow-[0_32px_75px_rgba(0,0,0,.55)]">
            <AppScreen className="opacity-0" />
            <div ref={sketchRef} className="absolute inset-[10%] grid place-items-center rounded-[24px] border-2 border-dashed border-[#16A34A]/60 bg-white/70"><div className="grid w-[72%] gap-3"><i className="h-14 rounded-xl border border-dashed border-[#16A34A]/50"/><i className="h-3 w-3/4 rounded-full bg-[#16A34A]/20"/><i className="h-3 w-1/2 rounded-full bg-[#16A34A]/15"/><i className="h-10 rounded-xl border border-dashed border-[#16A34A]/50"/></div></div>
            <div ref={wireframeRef} className="absolute inset-[10%] grid content-center gap-3 rounded-[24px] border border-[#0B0F0D]/10 bg-[#E8EEEA] p-3"><i className="h-14 rounded-xl border border-[#0B0F0D]/15 bg-white"/><i className="h-3 w-[80%] rounded-full bg-[#0B0F0D]/20"/><i className="h-3 w-[58%] rounded-full bg-[#0B0F0D]/15"/><div className="grid grid-cols-2 gap-2"><i className="h-8 rounded-lg border border-[#0B0F0D]/15 bg-white"/><i className="h-8 rounded-lg border border-[#0B0F0D]/15 bg-white"/></div></div>

            {/* Finished Interactive iOS App */}
            <div ref={finishedRef} data-app-build-stage="final" className="absolute inset-[10%] flex flex-col rounded-[24px] border border-[#16A34A]/20 bg-[#F6FAF7] p-2.5 sm:p-3 text-[#0B0F0D] select-none shadow-inner">
              {/* App Nav Header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="grid size-6 place-items-center rounded-lg bg-[#0B0F0D] text-[#22C55E]"><Sparkles className="size-3.5" /></span>
                  <span className="text-[11px] font-extrabold text-[#0B0F0D]">Mobile CRM</span>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-[#16A34A]/10 px-2 py-0.5 text-[9px] font-bold text-[#16A34A]">
                  <Star className="size-2.5 fill-[#16A34A]" /> 4.9
                </span>
              </div>

              {/* Hero Metric Card */}
              <div className="relative mb-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#16A34A] via-[#15803D] to-[#0F2A1A] p-2.5 text-white shadow-md">
                <div className="flex items-center justify-between text-[8px] text-white/80">
                  <span>Total Leads Converted</span>
                  <span className="rounded bg-[#B6F23D] px-1 py-0.2 text-[8px] font-extrabold text-[#0B0F0D]">+24%</span>
                </div>
                <p className="mt-1 font-mono text-base font-black leading-tight text-white">$24,850<span className="text-[10px] font-normal text-white/70">.00</span></p>
                <div className="mt-1.5 flex items-center justify-between border-t border-white/15 pt-1 text-[8px] text-white/85">
                  <span>🟢 Real-Time Active</span>
                  <span className="flex items-center gap-0.5"><TrendingUp className="size-2.5" /> High</span>
                </div>
              </div>

              {/* 2 Interactive Feature Tiles */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between rounded-xl border border-[#0B0F0D]/10 bg-white p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-[#22C55E]/15 text-[#16A34A]"><Check className="size-3.5" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold text-[#0B0F0D]">Smart Lead Routing</p>
                      <p className="truncate text-[8px] text-[#5B6B63]">Active in 14 cities</p>
                    </div>
                  </div>
                  <span className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#0B0F0D]/10 bg-white p-2 shadow-sm">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-[#B6F23D]/50 text-[#0B0F0D]"><Activity className="size-3.5" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold text-[#0B0F0D]">Instant Analytics</p>
                      <p className="truncate text-[8px] text-[#5B6B63]">99.98% Uptime SLA</p>
                    </div>
                  </div>
                  <span className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                </div>
              </div>

              {/* Bottom Dock / Home Bar */}
              <div className="mt-auto flex h-5 items-center justify-around border-t border-[#0B0F0D]/10 pt-1">
                {[0, 1, 2, 3].map((dot) => (
                  <i key={dot} className={`size-1.5 rounded-full ${dot === 0 ? 'bg-[#16A34A]' : 'bg-[#0B0F0D]/20'}`} />
                ))}
              </div>
            </div>

            <span className="absolute -right-2 top-[48%] grid size-9 sm:size-10 place-items-center rounded-2xl border-2 border-white bg-[#B6F23D] text-[#0B0F0D] shadow-lg"><Heart className="size-4 sm:size-5 fill-current" /></span>
            <span ref={pingRef} className="absolute -left-4 sm:-left-5 top-[28%] flex items-center gap-2 rounded-full border border-white/50 bg-white/90 p-1.5 sm:p-2 shadow-xl"><AppIcon className="size-6 sm:size-7 rounded-lg"/><Bell className="size-3.5 sm:size-4 text-[#16A34A]" /></span>
            <span className="absolute -right-2 sm:-right-3 top-[16%] z-30 flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0B0F0D]/90 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-md shadow-xl">
              <span className="size-1.5 rounded-full bg-white" />
              iOS
            </span>
          </PhoneFrame>
        </div>

        <div ref={launchRef} className="absolute right-[3%] sm:right-[5%] top-[6%] sm:top-[8%] flex flex-col items-center gap-2 z-20"><StoreGlyph /><span className="text-[#B6F23D]"><ArrowDown className="size-5" /></span><AppIcon className="size-8 rounded-xl" /></div>
        <span className="absolute bottom-[14%] right-[19%] size-3 motion-safe:animate-ping rounded-full bg-[#B6F23D]/60" />
      </div>
      <div className="relative z-10 order-3 min-w-0 lg:col-span-6 lg:col-start-1 lg:row-start-2">
        <p className="max-w-[36em] text-[16px] leading-relaxed text-white/75 sm:text-[18px] lg:text-[20px]">{content.hero.text}</p>
        <div aria-hidden="true" className="mt-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[.06] text-[#22C55E]"><Smartphone className="size-5" /></span>
          <span className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/[.06] text-[#22C55E]"><Check className="size-5" /></span>
          <StoreGlyph />
        </div>
      </div>
    </div>
  </section>;
}

function AppWhy({ content }: { content: AppDevelopmentContent }) {
  return <section aria-labelledby="app-why-title" className="overflow-hidden bg-[#F6FAF7] pt-24 pb-14 text-[#0B0F0D] sm:py-20">
    <div className="mx-auto grid w-[90%] max-w-[1280px] items-center gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <h2 id="app-why-title" className="max-w-[18ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.why.title}</h2>
        <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-[#5B6B63] sm:text-[18px]">{content.why.text}</p>
      </div>
      <div className="relative mx-auto flex h-[480px] w-full max-w-[420px] items-center justify-center sm:h-[520px] lg:col-span-7 lg:h-[580px]">
        {content.showSubLabels && <div className="absolute left-1 top-0 z-10 lg:left-[-4%]"><Eyebrow tone="ink">{content.why.subLabel}</Eyebrow></div>}
        <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-gradient-to-br from-[#22C55E]/20 via-[#B6F23D]/10 to-transparent blur-3xl" />
        <PhoneFrame variant="punch" decorative={false} className="relative h-[95%] aspect-[9/18.5] w-auto max-w-[320px] rotate-[1.5deg] shadow-[0_30px_70px_rgba(0,0,0,.28)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F2618] via-[#0B150F] to-[#080B09]" />
          <div className="absolute inset-x-0 -top-10 h-36 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,.4),transparent_70%)]" />

          {/* Top In-App Status Header */}
          <div className="absolute inset-x-3.5 top-7 flex items-center justify-between rounded-2xl border border-white/15 bg-white/[0.08] px-3 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white shadow-sm">
                <Sparkles className="size-3.5" />
              </span>
              <div className="leading-tight">
                <p className="text-[12px] font-semibold text-white/95">Your Mobile App</p>
                <p className="text-[10px] text-white/60">Connected 24/7</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-[#22C55E]/20 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#22C55E]" />
              Active
            </span>
          </div>

          {/* Notification / Benefit Cards cleanly aligned inside phone */}
          <ul className="absolute inset-x-3.5 bottom-4 top-24 flex flex-col justify-center gap-2 sm:gap-2.5">
            {content.why.benefits.map((benefit, index) => (
              <li key={benefit}>
                <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/[0.95] p-2.5 sm:p-3 shadow-[0_8px_20px_rgba(0,0,0,.12)] backdrop-blur-xl transition hover:-translate-y-0.5">
                  <AppIcon className="size-8 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                      <span className="truncate text-[13px] font-bold text-[#0B0F0D] sm:text-[14px]">
                        {benefit}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span aria-hidden="true" className="block h-1 w-[60%] rounded-full bg-[#0B0F0D]/15" />
                      <span aria-hidden="true" className="block h-1 w-[32%] rounded-full bg-[#0B0F0D]/10" />
                    </div>
                  </div>
                  <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${index === 0 ? 'bg-[#16A34A]' : 'bg-[#16A34A]/30'}`} />
                </div>
              </li>
            ))}
          </ul>
        </PhoneFrame>
      </div>
    </div>
  </section>;
}

function ServiceCardGraphic({ index }: { index: number }) {
  switch (index) {
    case 0: // Android App Development
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="punch" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#09130D] p-2.5 pt-5 text-white select-none">
              <div className="mb-1.5 flex items-center justify-between text-[8px] text-white/60">
                <span>09:41</span>
                <span className="text-[#22C55E] font-bold">Android 14</span>
              </div>
              <div className="mb-2 rounded-xl bg-[#16A34A]/20 p-2 border border-[#22C55E]/30">
                <div className="flex items-center gap-1.5">
                  <span className="grid size-5 place-items-center rounded bg-[#22C55E] text-[#0B0F0D] font-extrabold text-[9px]">G</span>
                  <p className="text-[9px] font-bold text-white">Google Play Store</p>
                </div>
                <div className="mt-1 flex items-center justify-between text-[7px] text-[#B6F23D]">
                  <span>500k+ Downloads</span>
                  <span>4.8 ★</span>
                </div>
              </div>
              {/* App Grid */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg border border-white/10 bg-white/[0.05] flex items-center justify-center p-1">
                    <span className="size-2 rounded-full" style={{ backgroundColor: i % 2 ? '#B6F23D' : '#22C55E' }} />
                  </div>
                ))}
              </div>
              <div className="mt-auto rounded-lg bg-white/[0.07] p-1.5 flex items-center justify-between text-[8px]">
                <span className="text-white/80">Material UI 3.0</span>
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
              </div>
            </div>
            <span className="absolute -bottom-2 -left-2 z-20 flex items-center gap-1 rounded-full border border-[#22C55E]/40 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#22C55E] shadow-xl">
              <span className="size-1.5 rounded-full bg-[#22C55E]" />
              Android SDK
            </span>
          </PhoneFrame>
        </div>
      );

    case 1: // iOS App Development
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="round" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0F1411] p-2.5 pt-5 text-white select-none">
              <div className="mb-2 flex items-center justify-between text-[8px] text-white/60">
                <span>9:41</span>
                <span className="text-white font-semibold">iOS 18</span>
              </div>
              <div className="mb-2 rounded-xl bg-gradient-to-br from-[#16A34A]/30 to-white/[0.05] p-2 border border-white/15">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white">Apple App Store</span>
                  <Star className="size-2.5 fill-[#B6F23D] text-[#B6F23D]" />
                </div>
                <p className="mt-1 text-[8px] text-white/70">Featured on Today Tab</p>
              </div>
              {/* iOS Cupertino List */}
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.06] p-1.5 text-[8px]">
                  <span>Apple Pay Ready</span>
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.06] p-1.5 text-[8px]">
                  <span>FaceID / TouchID</span>
                  <LockKeyhole className="size-2.5 text-[#B6F23D]" />
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 p-1.5 text-[8px] text-[#22C55E] font-semibold">
                <span>Swift & SwiftUI</span>
                <span>Native</span>
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-white shadow-xl">
              <Sparkles className="size-2.5 text-[#22C55E]" />
              iOS / Apple
            </span>
          </PhoneFrame>
        </div>
      );

    case 2: // Cross-Platform App Development
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center -space-x-4">
            <PhoneFrame variant="punch" className="relative z-10 h-[72%] aspect-[9/16] w-auto -rotate-6 shadow-2xl transition-transform duration-300 group-hover:-rotate-3">
              <div className="relative flex h-full flex-col bg-[#09130D] p-2 pt-4 text-white text-[7px] select-none">
                <div className="flex items-center justify-between text-[7px] text-[#22C55E] font-bold">
                  <span>Android</span>
                  <span className="size-1 rounded-full bg-[#22C55E]" />
                </div>
                <div className="mt-1.5 rounded-lg bg-white/[0.08] p-1.5">
                  <div className="h-1 w-3/4 rounded bg-[#22C55E]" />
                  <div className="mt-1 h-1 w-1/2 rounded bg-white/40" />
                </div>
                <div className="mt-1 space-y-1">
                  <div className="h-3 rounded bg-white/[0.04] p-1 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-[#22C55E]" />
                    <span className="h-0.5 w-6 rounded bg-white/30" />
                  </div>
                </div>
                <div className="mt-auto rounded bg-[#16A34A]/20 p-1 text-center font-bold text-[#22C55E]">
                  Codebase 1
                </div>
              </div>
            </PhoneFrame>
            <PhoneFrame variant="round" className="relative z-20 h-[78%] aspect-[9/16] w-auto rotate-6 shadow-2xl transition-transform duration-300 group-hover:rotate-3">
              <div className="relative flex h-full flex-col bg-[#0F1713] p-2 pt-4 text-white text-[7px] select-none">
                <div className="flex items-center justify-between text-[7px] text-[#B6F23D] font-bold">
                  <span>iOS</span>
                  <span className="size-1 rounded-full bg-[#B6F23D]" />
                </div>
                <div className="mt-1.5 rounded-lg bg-white/[0.08] p-1.5">
                  <div className="h-1 w-3/4 rounded bg-[#B6F23D]" />
                  <div className="mt-1 h-1 w-1/2 rounded bg-white/40" />
                </div>
                <div className="mt-1 space-y-1">
                  <div className="h-3 rounded bg-white/[0.04] p-1 flex items-center gap-1">
                    <span className="size-1 rounded-full bg-[#B6F23D]" />
                    <span className="h-0.5 w-6 rounded bg-white/30" />
                  </div>
                </div>
                <div className="mt-auto rounded bg-[#B6F23D]/20 p-1 text-center font-bold text-[#B6F23D]">
                  Shared UI
                </div>
              </div>
            </PhoneFrame>
          </div>
          <span className="absolute bottom-3 z-30 flex items-center gap-1 rounded-full border border-[#B6F23D]/60 bg-[#0B0F0D]/95 px-2.5 py-1 text-[9px] font-extrabold text-[#B6F23D] shadow-2xl backdrop-blur-md">
            <RefreshCw className="size-2.5 animate-spin" /> Flutter / React Native
          </span>
        </div>
      );

    case 3: // Custom Mobile App Development
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="punch" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0A130E] p-2.5 pt-5 text-white select-none">
              <div className="mb-2 flex items-center justify-between text-[8px] text-white/70">
                <span className="font-bold text-[#B6F23D]">Custom Build</span>
                <span className="rounded bg-white/10 px-1 py-0.5 text-[7px]">Modular</span>
              </div>
              <div className="space-y-1.5 mb-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="font-bold text-white">Custom API Engine</span>
                    <Zap className="size-2.5 text-[#B6F23D]" />
                  </div>
                  <div className="mt-1.5 flex gap-1">
                    <span className="h-1.5 flex-1 rounded-full bg-[#16A34A]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#22C55E]" />
                    <span className="h-1.5 flex-1 rounded-full bg-[#B6F23D]" />
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
                  <p className="text-[8px] font-bold text-white">Bespoke Workflow</p>
                  <p className="text-[7px] text-white/60">Tailored business logic</p>
                </div>
              </div>
              <div className="mt-auto rounded-lg bg-[#16A34A]/20 border border-[#16A34A]/40 p-1.5 text-center text-[8px] text-[#22C55E] font-bold">
                100% Scalable Architecture
              </div>
            </div>
            <span className="absolute -top-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-[#B6F23D]/50 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#B6F23D] shadow-xl">
              <Zap className="size-2.5" /> Bespoke
            </span>
          </PhoneFrame>
        </div>
      );

    case 4: // Enterprise Mobility Solutions
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="punch" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#07110B] p-2.5 pt-5 text-white select-none">
              <div className="mb-2 flex items-center justify-between text-[8px] text-white/70">
                <span className="flex items-center gap-1 text-[#22C55E] font-bold"><ShieldCheck className="size-3 text-[#22C55E]" /> SOC-2</span>
                <span className="text-[7px] text-white/50">Encrypted</span>
              </div>
              <div className="mb-2 rounded-xl border border-white/10 bg-gradient-to-br from-[#16A34A]/25 to-transparent p-2">
                <div className="flex items-center justify-between text-[8px]">
                  <span>Biometric Security</span>
                  <LockKeyhole className="size-2.5 text-[#22C55E]" />
                </div>
                <p className="mt-1 font-mono text-[9px] font-bold text-[#B6F23D]">AES-256 Enabled</p>
              </div>
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>Enterprise SSO</span>
                  <Check className="size-2.5 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>Role-Based Access</span>
                  <Check className="size-2.5 text-[#22C55E]" />
                </div>
              </div>
              <div className="mt-auto rounded-lg bg-white/[0.08] p-1.5 text-center text-[8px] text-white/80">
                99.99% Enterprise SLA
              </div>
            </div>
            <span className="absolute -bottom-2 -left-2 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#22C55E] shadow-xl">
              <ShieldCheck className="size-2.5 text-[#22C55E]" /> Enterprise
            </span>
          </PhoneFrame>
        </div>
      );

    case 5: // UI/UX Design for Mobile
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="round" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0D1611] p-2.5 pt-5 text-white select-none">
              <div className="mb-1.5 flex items-center justify-between text-[8px]">
                <span className="text-[#B6F23D] font-bold">Figma Prototyped</span>
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
              </div>
              {/* Color Palette swatches */}
              <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-white/[0.06] p-1.5">
                {['#16A34A', '#22C55E', '#B6F23D', '#FFFFFF'].map((color) => (
                  <span key={color} className="size-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
              {/* Interactive Prototype UI Card */}
              <div className="mb-2 rounded-xl border border-dashed border-[#22C55E]/40 bg-white/[0.04] p-2">
                <div className="flex items-center justify-between text-[8px] text-white/90">
                  <span>Micro-Interactions</span>
                  <Sparkles className="size-2.5 text-[#B6F23D]" />
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="h-1.5 w-3/4 rounded bg-white/50" />
                  <div className="h-1.5 w-1/2 rounded bg-[#22C55E]" />
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between rounded-lg bg-[#B6F23D]/15 border border-[#B6F23D]/30 p-1.5 text-[8px] text-[#B6F23D] font-semibold">
                <span className="flex items-center gap-1"><Palette className="size-2.5" /> Intuitive UX</span>
                <span>Fluid</span>
              </div>
            </div>
            <span className="absolute -top-2 -left-2 z-20 flex items-center gap-1 rounded-full border border-[#22C55E]/40 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#B6F23D] shadow-xl">
              <Palette className="size-2.5" /> Pixel Perfect
            </span>
          </PhoneFrame>
        </div>
      );

    case 6: // App Maintenance & Support
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="punch" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0B150F] p-2.5 pt-5 text-white select-none">
              <div className="mb-2 flex items-center justify-between text-[8px]">
                <span className="text-[#22C55E] font-bold flex items-center gap-1"><Activity className="size-2.5" /> 24/7 Monitoring</span>
                <span className="rounded bg-[#22C55E]/20 px-1 py-0.2 text-[7px] text-[#22C55E]">Live</span>
              </div>
              <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.05] p-2">
                <p className="text-[8px] text-white/60">Server Uptime</p>
                <p className="font-mono text-sm font-extrabold text-[#22C55E] leading-tight">99.99%</p>
                <div className="mt-1 flex items-center justify-between text-[7px] text-white/70 border-t border-white/10 pt-1">
                  <span>Latency: 18ms</span>
                  <span>Zero Bugs</span>
                </div>
              </div>
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>Auto Crash Alerts</span>
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>OS Version Updates</span>
                  <Check className="size-2.5 text-[#22C55E]" />
                </div>
              </div>
              <div className="mt-auto rounded-lg bg-white/[0.07] p-1.5 text-center text-[8px] text-white/80">
                Continuous DevOps Care
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-[#22C55E]/40 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#22C55E] shadow-xl">
              <Activity className="size-2.5" /> 24/7 SLA
            </span>
          </PhoneFrame>
        </div>
      );

    case 7: // App Modernization & Migration
    default:
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <PhoneFrame variant="round" className="relative h-[86%] aspect-[9/16] w-auto transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,.5)]">
            <div className="relative flex h-full flex-col bg-[#0A140F] p-2.5 pt-5 text-white select-none">
              <div className="mb-2 flex items-center justify-between text-[8px]">
                <span className="text-[#B6F23D] font-bold flex items-center gap-1"><TrendingUp className="size-2.5" /> Modernization</span>
                <span className="text-[7px] text-white/50">Cloud Native</span>
              </div>
              <div className="mb-2 rounded-xl border border-white/10 bg-gradient-to-br from-[#16A34A]/25 to-transparent p-2">
                <p className="text-[8px] text-white/70">Performance Gain</p>
                <p className="font-mono text-sm font-extrabold text-[#B6F23D] leading-tight">+350% Speed</p>
                <div className="mt-1 flex gap-1">
                  <span className="h-1 flex-1 rounded bg-[#16A34A]" />
                  <span className="h-1 flex-1 rounded bg-[#22C55E]" />
                  <span className="h-1 flex-1 rounded bg-[#B6F23D]" />
                </div>
              </div>
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>Zero Downtime Migration</span>
                  <Check className="size-2.5 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/[0.05] p-1.5 text-[8px]">
                  <span>Microservices Architecture</span>
                  <span className="size-1.5 rounded-full bg-[#B6F23D]" />
                </div>
              </div>
              <div className="mt-auto rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 p-1.5 text-center text-[8px] text-[#22C55E] font-semibold">
                Future-Proof Cloud Stack
              </div>
            </div>
            <span className="absolute -top-2 -right-2 z-20 flex items-center gap-1 rounded-full border border-[#B6F23D]/50 bg-[#0B0F0D]/95 px-2 py-0.5 text-[9px] font-bold text-[#B6F23D] shadow-xl">
              <TrendingUp className="size-2.5" /> 15x Faster
            </span>
          </PhoneFrame>
        </div>
      );
  }
}

function ServiceCarousel({ content }: { content: AppDevelopmentContent }) {
  const railRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const targetScrollRef = useRef(0);
  const animIdRef = useRef<number | null>(null);

  const updateProgress = () => {
    if (!railRef.current || !progressRef.current) return;
    const maxScroll = railRef.current.scrollWidth - railRef.current.clientWidth;
    const progress = maxScroll > 0 ? railRef.current.scrollLeft / maxScroll : 0;
    progressRef.current.style.transform = `scaleX(${Math.max(0.06, Math.min(1, progress))})`;
  };

  const smoothScrollTo = (target: number) => {
    if (!railRef.current) return;
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);

    const start = railRef.current.scrollLeft;
    const change = target - start;
    const duration = 380;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => --t * t * t + 1;

    const animate = (currentTime: number) => {
      if (!railRef.current) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = easeOutCubic(progress);

      railRef.current.scrollLeft = start + change * easeVal;
      updateProgress();

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(animate);
      } else {
        animIdRef.current = null;
      }
    };
    animIdRef.current = requestAnimationFrame(animate);
  };

  const move = (direction: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const step = rail.clientWidth > 640 ? 340 : 280;
    const current = rail.scrollLeft;
    targetScrollRef.current = Math.max(0, Math.min(maxScroll, current + direction * step));
    smoothScrollTo(targetScrollRef.current);
  };

  useEffect(() => {
    updateProgress();
    const handleResize = () => updateProgress();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  const startDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !railRef.current) return;
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: railRef.current.scrollLeft };
    railRef.current.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active || !railRef.current) return;
    railRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
    targetScrollRef.current = railRef.current.scrollLeft;
    updateProgress();
  };
  const endDrag = () => {
    dragRef.current.active = false;
    if (railRef.current) targetScrollRef.current = railRef.current.scrollLeft;
  };

  return (
    <section aria-labelledby="app-services-title" className="overflow-hidden bg-[#0B0F0D] pt-24 pb-16 text-white sm:py-24">
      <div className="mx-auto w-[90%] max-w-[1280px]">
        <Eyebrow>{content.services.eyebrow}</Eyebrow>
        <h2 id="app-services-title" className="mt-5 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.services.title}</h2>
        <p className="mt-4 max-w-[48em] text-base leading-[1.7] text-white/75 sm:text-[18px]">{content.services.text}</p>
        {content.showSubLabels && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Eyebrow>{content.services.servicesSubLabel}</Eyebrow>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous service"
                className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[0.04] text-white transition hover:border-[#22C55E] hover:bg-[#16A34A]/20 hover:text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E] cursor-pointer active:scale-95"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next service"
                className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[0.04] text-white transition hover:border-[#22C55E] hover:bg-[#16A34A]/20 hover:text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E] cursor-pointer active:scale-95"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        )}
        <div className="relative mt-8">
          {/* Floating Left Button */}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous service"
            className="absolute -left-3 sm:-left-5 top-[38%] z-30 -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full border border-[#22C55E]/40 bg-[#0B0F0D]/90 text-[#22C55E] shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[#22C55E] hover:bg-[#22C55E] hover:text-[#0B0F0D] hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E] cursor-pointer"
          >
            <ArrowLeft className="size-5 sm:size-6" />
          </button>

          {/* Floating Right Button */}
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next service"
            className="absolute -right-3 sm:-right-5 top-[38%] z-30 -translate-y-1/2 grid size-10 sm:size-12 place-items-center rounded-full border border-[#22C55E]/40 bg-[#0B0F0D]/90 text-[#22C55E] shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-[#22C55E] hover:bg-[#22C55E] hover:text-[#0B0F0D] hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E] cursor-pointer"
          >
            <ArrowRight className="size-5 sm:size-6" />
          </button>

          <ul
            ref={railRef}
            tabIndex={0}
            onScroll={updateProgress}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="region"
            aria-roledescription="carousel"
            aria-label="App development services"
            className="flex gap-4 overflow-x-auto pb-5 [scrollbar-color:#16A34A_#111815] [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22C55E] sm:gap-5 cursor-grab active:cursor-grabbing"
          >
            {content.services.items.map((item, index) => (
              <li
                key={item}
                className="group relative flex w-[78vw] max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111815] shadow-[0_20px_55px_rgba(0,0,0,.32)] transition duration-500 hover:-translate-y-2 hover:border-[#22C55E]/50"
              >
                <div aria-hidden="true" className={`relative flex aspect-[.8] items-center justify-center overflow-hidden bg-gradient-to-br ${cardTones[index]}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,197,94,.22),transparent_60%)]" />
                  <ServiceCardGraphic index={index} />
                </div>
                <div className="relative min-h-[124px] flex-1 bg-[#111815] p-5 pt-8 sm:p-6 sm:pt-8">
                  <span aria-hidden="true" className="absolute left-5 top-3 font-mono text-xs font-bold tracking-[.2em] text-[#22C55E]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-[18px] font-semibold leading-snug sm:text-[20px]">{item}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="mx-auto mt-4 h-1 max-w-[240px] overflow-hidden rounded-full bg-white/10">
          <div ref={progressRef} className="h-full w-full origin-left scale-x-[.06] rounded-full bg-[#22C55E] transition-transform duration-150" />
        </div>
      </div>
    </section>
  );
}

function FeatureCircuit({ content }: { content: AppDevelopmentContent }) {
  return <div aria-labelledby="app-features-label" className="bg-[#0B0F0D] pt-24 pb-20 text-white sm:pb-24">
    <div className="mx-auto w-[90%] max-w-[1280px]">
      {content.showSubLabels && <div className="mb-8"><Eyebrow>{content.services.featuresSubLabel}</Eyebrow></div>}
      <section id="app-features-label" aria-label={content.services.featuresSubLabel} className="relative grid items-center gap-8 lg:grid-cols-[1fr_260px_1fr] lg:gap-8">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 1000 400" preserveAspectRatio="none"><path d="M0 44 C190 44 290 80 500 200 M0 145 C190 145 320 150 500 200 M0 255 C190 255 320 250 500 200 M0 356 C190 356 290 320 500 200 M1000 44 C810 44 710 80 500 200 M1000 145 C810 145 680 150 500 200 M1000 255 C810 255 680 250 500 200 M1000 356 C810 356 710 320 500 200" fill="none" stroke="rgba(34,197,94,.28)" strokeWidth="1.5"/><circle cx="500" cy="200" r="4" fill="#B6F23D" className="motion-safe:animate-pulse"/></svg>
        <ul className="relative z-10 order-2 grid gap-3 sm:grid-cols-2 max-[399px]:grid-cols-1 lg:order-none lg:grid-cols-1">
          {content.services.features.slice(0, 4).map((feature, index) => { const Icon = circuitIcons[index]; return <li key={feature} className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-white/[.12] bg-white/[.04] p-3.5 text-[14px] font-semibold leading-snug transition hover:border-[#22C55E]/60 hover:bg-[#16A34A]/10 sm:text-base"><Icon aria-hidden="true" className="size-6 shrink-0 text-[#22C55E]" />{feature}</li>; })}
        </ul>
        <div aria-hidden="true" className="relative order-1 mx-auto grid h-[300px] w-[190px] place-items-center lg:order-none lg:h-[400px] lg:w-[230px]"><span className="absolute inset-0 rounded-full bg-[#16A34A]/10 blur-3xl"/><PhoneFrame className="relative h-[285px] w-[154px] lg:h-[370px] lg:w-[198px]"><AppScreen dark /><span className="absolute left-8 right-8 top-[55%] h-9 rounded-xl border border-[#22C55E]/30 bg-[#16A34A]/10"><Activity className="mx-auto size-full w-4/5 text-[#22C55E]" /></span></PhoneFrame></div>
        <ul className="relative z-10 order-3 grid gap-3 sm:grid-cols-2 max-[399px]:grid-cols-1 lg:order-none lg:grid-cols-1">
          {content.services.features.slice(4).map((feature, index) => { const Icon = circuitIcons[index + 4]; return <li key={feature} className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-white/[.12] bg-white/[.04] p-3.5 text-[14px] font-semibold leading-snug transition hover:border-[#22C55E]/60 hover:bg-[#16A34A]/10 sm:text-base"><Icon aria-hidden="true" className="size-6 shrink-0 text-[#22C55E]" />{feature}</li>; })}
        </ul>
      </section>
    </div>
  </div>;
}

function AppServices({ content }: { content: AppDevelopmentContent }) { return <><ServiceCarousel content={content} /><FeatureCircuit content={content} /></>; }

function AndroidProcessFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-[92%] aspect-[9/16] max-h-full w-auto rounded-[22px] border-[3.5px] border-[#202B24] bg-[#080C09] p-[4px] shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.02] ${className}`}>
      <span className="absolute -right-[5px] top-[22%] z-10 h-7 w-[2px] rounded-r-full bg-[#3D4C42]" />
      <span className="absolute -left-[5px] top-[26%] z-10 h-5 w-[2px] rounded-l-full bg-[#3D4C42]" />
      <div className="relative h-full w-full overflow-hidden rounded-[17px] bg-[#09120D]">
        <span className="absolute left-1/2 top-1.5 z-20 size-2 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
        {children}
      </div>
    </div>
  );
}

function IPhoneProcessFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-[92%] aspect-[9/16] max-h-full w-auto rounded-[24px] border-[3.5px] border-[#26332B] bg-[#0A0F0D] p-[4px] shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.02] ${className}`}>
      <span className="absolute -right-[5px] top-[22%] z-10 h-8 w-[2px] rounded-r-full bg-[#46574C]" />
      <span className="absolute -left-[5px] top-[18%] z-10 h-4 w-[2px] rounded-l-full bg-[#46574C]" />
      <span className="absolute -left-[5px] top-[27%] z-10 h-6 w-[2px] rounded-l-full bg-[#46574C]" />
      <div className="relative h-full w-full overflow-hidden rounded-[19px] bg-[#0C1510]">
        <span className="absolute left-1/2 top-1.5 z-20 h-2 w-7 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
        {children}
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-full bg-white/40 z-20" />
      </div>
    </div>
  );
}

function FoldProcessFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-[92%] aspect-[4/3] max-h-full max-w-full rounded-[18px] border-[3.5px] border-[#222E26] bg-[#080D0A] p-[4px] shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.02] ${className}`}>
      <span className="absolute left-1/2 -top-[3px] -translate-x-1/2 h-[3px] w-8 rounded-full bg-[#3D4C42] z-20" />
      <span className="absolute left-1/2 -bottom-[3px] -translate-x-1/2 h-[3px] w-8 rounded-full bg-[#3D4C42] z-20" />
      <div className="relative h-full w-full overflow-hidden rounded-[13px] bg-[#0A130E]">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[1.5px] -translate-x-1/2 bg-gradient-to-b from-white/20 via-black/50 to-white/20 shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
        {children}
      </div>
    </div>
  );
}

function ProcessDeviceMockup({ index }: { index: number }) {
  switch (index) {
    case 0: // Step 01: Idea & Requirement Analysis (Android)
      return (
        <AndroidProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 pt-4 text-white text-[7px] select-none">
            <div>
              <div className="mb-1 flex items-center justify-between text-[6.5px] text-white/60">
                <span>09:41</span>
                <div className="flex items-center gap-1 text-[#22C55E]">
                  <span className="font-bold">5G</span>
                  <span className="size-1 rounded-full bg-[#22C55E]" />
                </div>
              </div>
              <div className="mb-1.5 rounded-lg border border-[#22C55E]/40 bg-[#16A34A]/25 p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-white">App Vision Scope</span>
                  <span className="rounded bg-[#22C55E] px-1 py-0.2 text-[6px] font-bold text-black">100%</span>
                </div>
                <p className="mt-0.5 text-[6.5px] text-[#B6F23D]">Goals &amp; Users Mapped</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span className="text-white/90">Market Research</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span className="text-white/90">Feature Feasibility</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span className="text-white/90">Tech Stack Choice</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
              </div>
            </div>
            <div className="rounded-md bg-white/[0.08] p-1 text-center text-[6.5px] font-bold text-[#22C55E]">
              Blueprint Approved
            </div>
          </div>
        </AndroidProcessFrame>
      );

    case 1: // Step 02: Planning & Strategy (iPhone)
      return (
        <IPhoneProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 pt-4 pb-2.5 text-white text-[7px] select-none">
            <div>
              <div className="mb-1 flex items-center justify-between text-[6.5px] text-white/60">
                <span>9:41</span>
                <span className="font-semibold text-white/70">Sprint Ready</span>
              </div>
              <div className="mb-1.5 rounded-lg border border-white/15 bg-gradient-to-br from-[#16A34A]/30 to-white/[0.04] p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-white">App Roadmap</span>
                  <span className="font-mono text-[6.5px] text-[#B6F23D]">6 Sprints</span>
                </div>
                <div className="mt-1 flex gap-1">
                  <span className="h-1 flex-1 rounded-full bg-[#22C55E]" />
                  <span className="h-1 flex-1 rounded-full bg-[#16A34A]" />
                  <span className="h-1 flex-1 rounded-full bg-white/20" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>React Native / Flutter</span>
                  <span className="size-1.5 rounded-full bg-[#B6F23D]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>Cloud Database</span>
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>Secure API Gateway</span>
                  <span className="size-1.5 rounded-full bg-[#22C55E]" />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-[#22C55E]/30 bg-[#22C55E]/15 p-1 text-center text-[6.5px] font-bold text-[#22C55E]">
              Ready for Sprint 1
            </div>
          </div>
        </IPhoneProcessFrame>
      );

    case 2: // Step 03: UI/UX Design (Fold Phone)
      return (
        <FoldProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 text-white text-[7px] select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[6.5px]">
              <span className="font-bold text-[#B6F23D]">Figma System</span>
              <span className="rounded bg-[#22C55E]/20 px-1 py-0.2 font-semibold text-[#22C55E]">Dual Screen</span>
              <span className="text-white/60">Live Preview</span>
            </div>
            <div className="my-auto grid grid-cols-2 gap-2">
              <div className="space-y-1 border-r border-white/5 pr-1">
                <p className="text-[7px] font-bold text-white">Design Tokens</p>
                <div className="flex gap-1">
                  {['#16A34A', '#22C55E', '#B6F23D', '#FFFFFF'].map((c) => (
                    <span key={c} className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <div className="h-1 w-full rounded bg-white/40" />
                  <div className="h-1 w-3/4 rounded bg-white/20" />
                </div>
                <span className="inline-block rounded bg-white/10 px-1 py-0.5 text-[6px] text-white/70">Typography scale</span>
              </div>
              <div className="space-y-1 pl-1">
                <div className="rounded-md border border-[#22C55E]/30 bg-white/[0.08] p-1">
                  <div className="flex items-center justify-between text-[6.5px]">
                    <span className="font-bold text-white">App UI Card</span>
                    <Sparkles className="size-2 text-[#B6F23D]" />
                  </div>
                  <div className="mt-1 flex h-3.5 items-center justify-center rounded bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-[6px] font-bold text-black">
                    Action CTA
                  </div>
                </div>
                <div className="flex items-center justify-between text-[6px] text-white/60">
                  <span>Micro-Interactions</span>
                  <span className="font-bold text-[#22C55E]">Fluid</span>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-1 text-center text-[6.5px] font-bold text-[#B6F23D]">
              Pixel-Perfect Prototype Verified
            </div>
          </div>
        </FoldProcessFrame>
      );

    case 3: // Step 04: App Development (Android)
      return (
        <AndroidProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 pt-4 text-white text-[7px] select-none">
            <div>
              <div className="mb-1 flex items-center justify-between text-[6.5px] text-white/60">
                <span className="font-mono text-[#22C55E]">BUILD_PASS</span>
                <span className="size-1.5 animate-pulse rounded-full bg-[#22C55E]" />
              </div>
              <div className="mb-1.5 rounded-lg border border-white/15 bg-black/60 p-1.5 font-mono text-[6px] text-white/80">
                <p className="font-bold text-[#22C55E]">$ git push origin</p>
                <p className="text-white/60">&gt; compiling tsx...</p>
                <p className="font-bold text-[#B6F23D]">&gt; build 0 errors (1.2s)</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>Native APIs Connected</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>State Management</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>Offline SQLite Storage</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
              </div>
            </div>
            <div className="rounded-md border border-[#16A34A]/50 bg-[#16A34A]/25 p-1 text-center text-[6.5px] font-bold text-[#22C55E]">
              Scalable Architecture
            </div>
          </div>
        </AndroidProcessFrame>
      );

    case 4: // Step 05: Testing & Quality Assurance (iPhone)
      return (
        <IPhoneProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 pt-4 pb-2.5 text-white text-[7px] select-none">
            <div>
              <div className="mb-1 flex items-center justify-between text-[6.5px] text-white/60">
                <span>9:41</span>
                <span className="font-bold text-[#22C55E]">QA Suite</span>
              </div>
              <div className="mb-1.5 rounded-lg border border-white/15 bg-gradient-to-br from-[#16A34A]/25 to-transparent p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-white">100% Pass Rate</span>
                  <ShieldCheck className="size-2.5 text-[#22C55E]" />
                </div>
                <p className="mt-0.5 font-mono text-[7px] text-[#B6F23D]">148 Test Cases Passed</p>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full bg-gradient-to-r from-[#16A34A] to-[#22C55E]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>0 Critical Bugs</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>Security Audit Clear</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
                <div className="flex items-center justify-between rounded-md bg-white/[0.06] p-1">
                  <span>99.9% Crash Free</span>
                  <Check className="size-2 text-[#22C55E]" />
                </div>
              </div>
            </div>
            <div className="rounded-md bg-white/[0.08] p-1 text-center text-[6.5px] font-bold text-white">
              Production Grade Certified
            </div>
          </div>
        </IPhoneProcessFrame>
      );

    case 5: // Step 06: Launch & Deployment (Fold Phone)
    default:
      return (
        <FoldProcessFrame>
          <div className="relative flex h-full flex-col justify-between p-2 text-white text-[7px] select-none">
            <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[6.5px]">
              <span className="flex items-center gap-0.5 font-bold text-[#22C55E]">
                <span className="size-1.5 animate-ping rounded-full bg-[#22C55E]" /> Live
              </span>
              <span className="rounded bg-[#B6F23D]/20 px-1 py-0.2 font-bold text-[#B6F23D]">App Store &amp; Play</span>
              <span className="text-white/60">Worldwide</span>
            </div>
            <div className="my-auto grid grid-cols-2 gap-2">
              <div className="space-y-1 rounded-md border border-white/10 bg-white/[0.05] p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-bold text-white">Apple Store</span>
                  <Star className="size-2 fill-[#B6F23D] text-[#B6F23D]" />
                </div>
                <p className="text-[6px] text-white/70">Featured App</p>
                <span className="inline-block rounded bg-[#22C55E]/20 px-1 py-0.5 text-[6px] font-bold text-[#22C55E]">Published</span>
              </div>
              <div className="space-y-1 rounded-md border border-white/10 bg-white/[0.05] p-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-bold text-white">Google Play</span>
                  <span className="text-[7px] font-bold text-[#22C55E]">4.9★</span>
                </div>
                <p className="text-[6px] text-white/70">10k+ Downloads</p>
                <span className="inline-block rounded bg-[#22C55E]/20 px-1 py-0.5 text-[6px] font-bold text-[#22C55E]">Active</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-1 text-center text-[6.5px] font-bold text-[#B6F23D]">
              Successfully Rolled Out Worldwide
            </div>
          </div>
        </FoldProcessFrame>
      );
  }
}

function AppProcess({ content }: { content: AppDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLOListElement>(null);
  const trainRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !trackRef.current || !viewportRef.current || !panelsRef.current || !trainRef.current) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const panels = panelsRef.current;
    const train = trainRef.current;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.to(panels, {
        x: () => Math.min(0, viewport.clientWidth - panels.scrollWidth),
        ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      });
      gsap.to(train, {
        x: () => Math.max(0, viewport.clientWidth - train.offsetWidth),
        ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      });
      return () => ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  const updateTrain = (event: React.UIEvent<HTMLOListElement>) => {
    const maxScroll = event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
    const progress = maxScroll > 0 ? event.currentTarget.scrollLeft / maxScroll : 0;
    const rail = event.currentTarget.parentElement?.querySelector<HTMLElement>('[data-process-rail]');
    const train = rail?.querySelector<HTMLElement>('[data-process-train]');
    if (rail && train) train.style.transform = `translateX(${progress * (rail.clientWidth - train.offsetWidth)}px)`;
  };
  return <section ref={sectionRef} aria-labelledby="app-process-title" className="relative bg-[#F6FAF7] pt-24 pb-16 text-[#0B0F0D] sm:py-24">
    <div className="mx-auto w-[90%] max-w-[1280px]"><Eyebrow tone="ink">{content.process.eyebrow}</Eyebrow><h2 id="app-process-title" className="mt-5 max-w-[23ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.process.title}</h2><p className="mt-4 max-w-[48em] text-base leading-[1.7] text-[#5B6B63] sm:text-[18px]">{content.process.text}</p>{content.showSubLabels && <div className="mt-8"><Eyebrow tone="ink">{content.process.subLabel}</Eyebrow></div>}</div>
    <div ref={trackRef} className={`mx-auto mt-10 w-[90%] max-w-[1280px] ${reducedMotion ? '' : 'lg:h-[520svh]'}`}>
      <div ref={viewportRef} className={`overflow-hidden ${reducedMotion ? '' : 'lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center'}`}>
        <ol ref={panelsRef} tabIndex={reducedMotion ? undefined : 0} onScroll={updateTrain} className={`flex gap-4 pb-5 [scrollbar-width:thin] [scrollbar-color:#16A34A_#E4ECE7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16A34A] lg:gap-6 ${reducedMotion ? 'flex-col overflow-visible' : 'snap-x snap-mandatory overflow-x-auto lg:overflow-visible lg:snap-none'} max-lg:flex-col max-lg:overflow-visible max-lg:pb-0`}>
          {content.process.steps.map((step, index) => <li key={step.title} className={`relative min-h-[360px] w-full max-w-none shrink-0 overflow-hidden rounded-[30px] border border-[#0B0F0D]/10 bg-white p-6 shadow-[0_25px_65px_rgba(11,15,13,.11)] sm:min-h-[390px] sm:p-9 lg:min-h-0 lg:h-[62svh] lg:w-[46vw] lg:max-w-[620px] ${reducedMotion ? 'w-full max-w-none' : ''}`}>
            <span aria-hidden="true" className="absolute -right-2 -top-12 font-display text-[clamp(9rem,24vw,18rem)] font-black leading-none text-transparent opacity-10" style={{ WebkitTextStroke: '2px #0B0F0D' }}>{String(index + 1).padStart(2, '0')}</span>
            <div className="relative z-10 max-w-[28rem]"><h3 className="font-display text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] font-bold leading-tight">{step.title}</h3><p className="mt-3 text-[16px] leading-relaxed text-[#5B6B63] sm:text-[18px]">{step.text}</p></div>
            <div aria-hidden="true" className="absolute bottom-4 right-4 flex h-[58%] w-[48%] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#22C55E]/12 via-[#16A34A]/8 to-[#B6F23D]/15 p-2 sm:bottom-7 sm:right-7 sm:h-[64%] sm:w-[45%] lg:h-[70%] lg:w-[42%]">
              <ProcessDeviceMockup index={index} />
              <span className="absolute -bottom-2 -left-2 sm:bottom-2 sm:left-2 z-30 grid size-9 sm:size-10 place-items-center rounded-2xl bg-[#B6F23D] text-[#0B0F0D] shadow-lg border border-black/10">{index === 5 ? <Sparkles className="size-4 sm:size-5" /> : <Check className="size-4 sm:size-5" />}</span>
            </div>
          </li>)}
        </ol>
        {!reducedMotion && <div data-process-rail aria-hidden="true" className="relative mx-auto mt-4 h-7 w-full"><span className="absolute left-3 right-3 top-1/2 h-[2px] -translate-y-1/2 bg-[#0B0F0D]/15" />{content.process.steps.map((step, index) => <i key={step.title} className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-[#16A34A]/65" style={{ left: `calc(${index / (content.process.steps.length - 1) * 100}% - 4px)` }} />)}<span data-process-train ref={trainRef} className="absolute left-0 top-0 grid size-7 place-items-center rounded-full bg-[#0B0F0D] text-[#22C55E] shadow-md"><Smartphone className="size-4" /></span></div>}
      </div>
    </div>
  </section>;
}

function AppWhyChoose({ content }: { content: AppDevelopmentContent }) {
  return <section aria-labelledby="app-why-choose-title" className="bg-[#F6FAF7] px-4 py-8 sm:px-6 sm:py-12">
    <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0B0F0D] to-[#0F2A1A] px-6 py-12 text-white sm:rounded-[40px] sm:px-10 sm:py-16 lg:px-14">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B6F23D] to-transparent" />
      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-5"><Eyebrow tone="green">{content.whyChoose.eyebrow}</Eyebrow><h2 id="app-why-choose-title" className="mt-6 max-w-[16ch] font-display text-[clamp(2rem,4vw,3.3rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.whyChoose.title}</h2><div aria-hidden="true" className="mt-8 flex flex-wrap gap-3">{[0, 1, 2, 3, 4].map((item) => <AppIcon key={item} className={`size-11 ${item % 2 ? 'bg-gradient-to-br from-[#B6F23D] to-[#16A34A]' : ''}`} />)}</div></div>
        <ul className="grid gap-x-8 lg:col-span-7 lg:grid-cols-2">{content.whyChoose.points.map((point) => <li key={point} className="flex min-h-[68px] items-center gap-3 border-b border-white/10 py-4 text-[16px] font-semibold leading-snug sm:text-[18px]"><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[#16A34A] text-[#0B0F0D]"><Check className="size-4" /></span><span>{point}</span></li>)}</ul>
      </div>
    </div>
  </section>;
}

export function AppDevelopmentPage({ content, onSelectIndustry }: { content: AppDevelopmentContent; onSelectIndustry: (name: string) => void }) {
  return <>{content.sections.map((section) => {
    switch (section) {
      case 'hero': return <AppHero key={section} content={content} />;
      case 'why': return <AppWhy key={section} content={content} />;
      case 'services': return <AppServices key={section} content={content} />;
      case 'process': return <AppProcess key={section} content={content} />;
      case 'whyChoose': return <AppWhyChoose key={section} content={content} />;
      case 'industries': return <div key={section} className="bg-white pt-8 sm:pt-12"><Industries onSelectIndustry={onSelectIndustry} /></div>;
      case 'counters': return <div key={section} className="bg-[#0B0F0D] pt-8 sm:pt-12"><Stats overlap={false} /></div>;
    }
  })}</>;
}
