'use client';

import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowLeft, ArrowRight, Bell, Check, Heart, Layers3, LockKeyhole, Plug, Smartphone, Sparkles, Activity, Zap, Compass } from 'lucide-react';
import type { AppDevelopmentContent } from '@/data/servicePages/app-development';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Industries } from '@/components/sections/Industries';
import { Stats } from '@/components/sections/Stats';
import { Eyebrow } from './ServiceUI';
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
        <Eyebrow>{content.hero.eyebrow}</Eyebrow>
        <h1 id="app-hero-title" className="mt-6 font-display text-[clamp(2.1rem,9.5vw,3rem)] font-extrabold leading-[1.1] tracking-[-.035em] sm:text-[clamp(2.6rem,3.8vw,4.4rem)] sm:leading-[1.08]">
          <span className="block lg:whitespace-nowrap">{titleLines[0]}</span><span className="block text-transparent lg:whitespace-nowrap" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.92)', WebkitTextFillColor: 'transparent' }}>{titleLines[1]}</span><span className="block bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">{titleLines[2]}</span>
        </h1>
      </div>
      <div ref={sceneRef} aria-hidden="true" className="relative mx-auto order-2 flex h-[320px] w-full max-w-[520px] items-center justify-center lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:h-[600px]">
        <div className="absolute size-[72%] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,.23),rgba(22,163,74,.08)_45%,transparent_72%)]" />
        <PhoneFrame variant="punch" className="absolute left-[12%] top-[15%] hidden h-[68%] w-[42%] -rotate-[8deg] opacity-70 min-[768px]:block">
          <AppScreen dark />
        </PhoneFrame>
        <div ref={frontRef} className="relative z-10 h-[88%] w-[54%] translate-y-2 transition-transform duration-700">
          <PhoneFrame variant="round" className="h-full w-full">
            <AppScreen className="opacity-0" />
            <div ref={sketchRef} className="absolute inset-[15%] grid place-items-center rounded-[24px] border-2 border-dashed border-[#16A34A]/60 bg-white/70"><div className="grid w-[72%] gap-3"><i className="h-14 rounded-xl border border-dashed border-[#16A34A]/50"/><i className="h-3 w-3/4 rounded-full bg-[#16A34A]/20"/><i className="h-3 w-1/2 rounded-full bg-[#16A34A]/15"/><i className="h-10 rounded-xl border border-dashed border-[#16A34A]/50"/></div></div>
            <div ref={wireframeRef} className="absolute inset-[15%] grid content-center gap-3 rounded-[24px] border border-[#0B0F0D]/10 bg-[#E8EEEA] p-4"><i className="h-16 rounded-xl border border-[#0B0F0D]/15 bg-white"/><i className="h-3 w-[80%] rounded-full bg-[#0B0F0D]/20"/><i className="h-3 w-[58%] rounded-full bg-[#0B0F0D]/15"/><div className="grid grid-cols-2 gap-2"><i className="h-10 rounded-lg border border-[#0B0F0D]/15 bg-white"/><i className="h-10 rounded-lg border border-[#0B0F0D]/15 bg-white"/></div></div>
            <div ref={finishedRef} data-app-build-stage="final" className="absolute inset-[13%] flex flex-col rounded-[24px] border border-[#16A34A]/15 bg-[#F6FAF7] p-3"><div className="mb-3 h-2 w-10 rounded-full bg-[#16A34A]"/><div className="relative h-[34%] rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#0F5132]"><i className="absolute bottom-3 left-3 h-2 w-1/2 rounded-full bg-white/80"/></div><div className="mt-3 flex-1 space-y-2">{[0,1,2].map((row)=><i key={row} className="flex h-8 items-center gap-2 rounded-lg bg-white px-2"><b className="size-4 rounded bg-[#16A34A]/25"/><b className="h-1.5 w-1/2 rounded-full bg-[#0B0F0D]/20"/></i>)}</div><div className="flex h-7 items-center justify-around border-t border-[#0B0F0D]/10">{[0,1,2,3].map((dot)=><i key={dot} className={`size-2 rounded-full ${dot===0?'bg-[#16A34A]':'bg-[#0B0F0D]/15'}`}/>)}</div></div>
            <span className="absolute -right-1 top-[45%] grid size-10 place-items-center rounded-2xl border-2 border-white bg-[#B6F23D] text-[#0B0F0D] shadow-lg"><Heart className="size-5 fill-current" /></span>
            <span ref={pingRef} className="absolute -left-5 top-[30%] flex items-center gap-2 rounded-full border border-white/50 bg-white/90 p-2 shadow-xl"><AppIcon className="size-7 rounded-lg"/><Bell className="size-4 text-[#16A34A]" /></span>
          </PhoneFrame>
        </div>
        <div ref={launchRef} className="absolute right-[5%] top-[8%] flex flex-col items-center gap-2"><StoreGlyph /><span className="text-[#B6F23D]"><ArrowDown className="size-5" /></span><AppIcon className="size-8 rounded-xl" /></div>
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
      <div className="relative mx-auto flex h-[460px] w-full max-w-[450px] items-center justify-center lg:col-span-7 lg:h-[560px]">
        {content.showSubLabels && <div className="absolute left-1 top-0 z-10 lg:left-[-8%]"><Eyebrow tone="ink">{content.why.subLabel}</Eyebrow></div>}
        <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-gradient-to-br from-[#22C55E]/20 via-[#B6F23D]/10 to-transparent blur-3xl" />
        <PhoneFrame variant="punch" decorative={false} className="relative h-[95%] w-[min(78%,330px)] rotate-[2deg]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(182,242,61,.9),transparent_45%),linear-gradient(145deg,#16A34A,#0B0F0D_68%)]" />
          <div className="absolute inset-x-4 top-16 h-24 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"><span className="absolute left-4 top-4 h-1.5 w-14 rounded-full bg-white/80"/><span className="absolute left-4 top-8 h-1 w-20 rounded-full bg-white/40"/></div>
          <ul className="absolute inset-x-2 bottom-3 flex flex-col gap-2 lg:-left-[10%] lg:w-[116%]">{content.why.benefits.map((benefit, index) => <li key={benefit}><Notification index={index}>{benefit}</Notification></li>)}</ul>
        </PhoneFrame>
      </div>
    </div>
  </section>;
}

function ServiceCarousel({ content }: { content: AppDevelopmentContent }) {
  const railRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const move = (direction: number) => railRef.current?.scrollBy({ left: direction * (railRef.current.clientWidth * .72), behavior: 'smooth' });
  const updateProgress = () => {
    if (!railRef.current || !progressRef.current) return;
    const maxScroll = railRef.current.scrollWidth - railRef.current.clientWidth;
    const progress = maxScroll > 0 ? railRef.current.scrollLeft / maxScroll : 1;
    progressRef.current.style.transform = `scaleX(${Math.max(.06, progress)})`;
  };
  const startDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !railRef.current) return;
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: railRef.current.scrollLeft };
    railRef.current.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (!dragRef.current.active || !railRef.current) return;
    railRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
  };
  const endDrag = () => { dragRef.current.active = false; };
  return <section aria-labelledby="app-services-title" className="overflow-hidden bg-[#0B0F0D] pt-24 pb-16 text-white sm:py-24">
    <div className="mx-auto w-[90%] max-w-[1280px]">
      <Eyebrow>{content.services.eyebrow}</Eyebrow>
      <h2 id="app-services-title" className="mt-5 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.services.title}</h2>
      <p className="mt-4 max-w-[48em] text-base leading-[1.7] text-white/75 sm:text-[18px]">{content.services.text}</p>
      {content.showSubLabels && <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><Eyebrow>{content.services.servicesSubLabel}</Eyebrow><div className="hidden gap-2 min-[768px]:flex"><button onClick={() => move(-1)} aria-label="Previous" className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#22C55E] hover:text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E]"><ArrowLeft className="size-5" /></button><button onClick={() => move(1)} aria-label="Next" className="grid size-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#22C55E] hover:text-[#22C55E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#22C55E]"><ArrowRight className="size-5" /></button></div></div>}
      <ul ref={railRef} tabIndex={0} onScroll={updateProgress} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} role="region" aria-roledescription="carousel" aria-label="App development services" className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 [scrollbar-color:#16A34A_#111815] [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22C55E] sm:gap-5">
        {content.services.items.map((item, index) => <li key={item} className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#111815] shadow-[0_20px_55px_rgba(0,0,0,.32)] transition duration-500 hover:-translate-y-2 hover:border-[#22C55E]/50">
          <div aria-hidden="true" className={`relative flex aspect-[.8] items-center justify-center overflow-hidden bg-gradient-to-br ${cardTones[index]}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,197,94,.22),transparent_60%)]" />
            {index === 2 ? <div className="relative flex items-center gap-1"><PhoneFrame variant="punch" className="h-48 w-24 -rotate-6"><AppScreen /></PhoneFrame><PhoneFrame variant="round" className="h-52 w-28 rotate-6"><AppScreen dark /></PhoneFrame></div> : <PhoneFrame variant={index % 2 ? 'round' : 'punch'} className="relative h-[78%] w-[48%] transition-transform duration-500 group-hover:-translate-y-2">
              <AppScreen dark={index % 3 === 1} />
              {index === 0 && <div className="absolute inset-x-[18%] top-[35%] grid grid-cols-3 gap-1.5">{Array.from({ length: 9 }, (_, tile) => <i key={tile} className={`aspect-square rounded-md border border-white/30 ${tile % 2 ? 'bg-[#B6F23D]/75' : 'bg-[#16A34A]/75'}`} />)}</div>}
              {index === 1 && <div className="absolute inset-x-[14%] top-[26%] space-y-2"><i className="block h-10 rounded-xl border border-[#16A34A]/20 bg-white/90"/><i className="block h-8 rounded-xl bg-[#16A34A]/15"/><i className="block h-8 rounded-xl bg-[#B6F23D]/50"/></div>}
              {index === 3 && <div className="absolute -left-3 top-[40%] grid grid-cols-2 gap-1"><i className="size-7 rounded-lg border border-[#16A34A]/35 bg-[#B6F23D]"/><i className="size-7 rounded-lg border border-[#16A34A]/35 bg-white"/><i className="col-span-2 h-5 rounded-lg bg-[#16A34A]/60"/></div>}
              {index === 4 && <span className="absolute bottom-12 right-2 grid size-8 place-items-center rounded-xl bg-[#B6F23D] text-[#0B0F0D] before:content-['+'] after:absolute after:inset-[-4px] after:scale-0 after:rounded-[14px] after:border after:border-[#B6F23D]/70 after:transition-transform group-hover:after:scale-100" />}
              {index === 5 && <div className="absolute inset-x-[17%] bottom-[29%] flex h-[27%] items-end gap-1 rounded-xl bg-white/90 p-2">{[35, 68, 46, 88, 58].map((height, bar) => <i key={bar} className="flex-1 rounded-t-sm bg-[#16A34A]" style={{ height: `${height}%` }} />)}</div>}
              {index === 6 && <div className="absolute inset-x-[14%] bottom-[22%] flex gap-1.5 rounded-full border border-[#0B0F0D]/10 bg-white p-1.5">{['#16A34A', '#22C55E', '#B6F23D', '#0B0F0D'].map((color) => <i key={color} className="size-3 rounded-full" style={{ backgroundColor: color }} />)}</div>}
              {index === 7 && <div className="absolute inset-x-[20%] top-[42%] flex h-12 items-center rounded-xl border border-[#16A34A]/25 bg-white/90 px-2"><Activity className="size-full text-[#16A34A]"/><LockKeyhole className="absolute -right-3 -top-3 size-6 rounded-full bg-[#B6F23D] p-1 text-[#0B0F0D]"/></div>}
            </PhoneFrame>}
            {index === 2 && <span className="absolute grid size-8 place-items-center rounded-full border border-[#B6F23D]/50 bg-[#0B0F0D]/80 text-[#B6F23D]"><Plug className="size-4" /></span>}
            {index === 6 && <Sparkles className="absolute bottom-[20%] right-[22%] size-7 text-[#B6F23D]" />}
          </div>
          <div className="relative min-h-[124px] flex-1 bg-[#111815] p-5 pt-8 sm:p-6 sm:pt-8"><span aria-hidden="true" className="absolute left-5 top-3 font-mono text-xs font-bold tracking-[.2em] text-[#22C55E]">{String(index + 1).padStart(2, '0')}</span><h3 className="font-display text-[18px] font-semibold leading-snug sm:text-[20px]">{item}</h3></div>
        </li>)}
      </ul>
      <div aria-hidden="true" className="mx-auto mt-2 h-1 max-w-[240px] overflow-hidden rounded-full bg-white/10 sm:hidden"><div ref={progressRef} className="h-full w-full origin-left scale-x-[.06] rounded-full bg-[#22C55E] transition-transform duration-150" /></div>
    </div>
  </section>;
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
        <ol ref={panelsRef} tabIndex={reducedMotion ? undefined : 0} onScroll={updateTrain} className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:thin] [scrollbar-color:#16A34A_#E4ECE7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16A34A] lg:gap-6 ${reducedMotion ? 'flex-col overflow-visible' : ''}`}>
          {content.process.steps.map((step, index) => <li key={step.title} className={`relative min-h-[440px] w-[82vw] max-w-[620px] shrink-0 snap-center overflow-hidden rounded-[30px] border border-[#0B0F0D]/10 bg-white p-6 shadow-[0_25px_65px_rgba(11,15,13,.11)] sm:min-h-[480px] sm:p-9 lg:h-[62svh] lg:w-[46vw] ${reducedMotion ? 'w-full max-w-none' : ''}`}>
            <span aria-hidden="true" className="absolute -right-2 -top-12 font-display text-[clamp(9rem,24vw,18rem)] font-black leading-none text-transparent opacity-10" style={{ WebkitTextStroke: '2px #0B0F0D' }}>{String(index + 1).padStart(2, '0')}</span>
            <div className="relative z-10 max-w-[28rem]"><h3 className="font-display text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] font-bold leading-tight">{step.title}</h3><p className="mt-3 text-[16px] leading-relaxed text-[#5B6B63] sm:text-[18px]">{step.text}</p></div>
            <div aria-hidden="true" className="absolute bottom-5 right-4 flex h-[48%] w-[56%] items-center justify-center rounded-[26px] bg-gradient-to-br from-[#22C55E]/10 to-[#B6F23D]/10 sm:bottom-7 sm:right-7 sm:w-[50%]">
              <PhoneFrame variant={index % 2 ? 'punch' : 'round'} className="h-[88%] w-[48%] rotate-[-4deg]"><AppScreen dark={index === 3} /></PhoneFrame>
              <span className="absolute bottom-[18%] right-[18%] grid size-10 place-items-center rounded-2xl bg-[#B6F23D] text-[#0B0F0D] shadow-lg">{index === 5 ? <Sparkles className="size-5" /> : <Check className="size-5" />}</span>
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
