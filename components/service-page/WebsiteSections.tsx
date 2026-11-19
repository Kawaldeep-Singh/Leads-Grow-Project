'use client';

import { useRef } from 'react';
import { ArrowDownRight, ArrowUpRight, Braces, Building2, Check, CircleGauge, Globe2, HeartPulse, Layers3, LayoutDashboard, LayoutGrid, LayoutTemplate, MonitorSmartphone, PanelsTopLeft, Plus, ShieldCheck, ShoppingCart, Sparkles, UsersRound, Wrench } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import type { WebsiteDevelopmentContent } from '@/data/servicePages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { BrowserFrame, CodePanel, UiSkeleton } from './mockups';
import { Eyebrow } from './ServiceUI';

function StorefrontScene({ reducedMotion }: { reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const customersRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    const customers = customersRef.current;
    const pulse = pulseRef.current;
    if (!scene || !customers || !pulse || reducedMotion) return;
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 1, paused: true });
    loop.fromTo(customers, { x: 48, opacity: 0 }, { x: -8, opacity: 1, duration: 2.4, ease: 'power2.inOut' })
      .to(customers, { opacity: 0, scale: 0.6, duration: 0.3 }, '-=0.25')
      .fromTo(pulse, { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, '-=0.05')
      .to(pulse, { scale: 1.25, opacity: 0, duration: 0.75, ease: 'power2.out' });
    let inView = false;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) loop.play(); else loop.pause();
    }, { threshold: 0.05 });
    const visibility = () => { if (document.hidden || !inView) loop.pause(); else loop.play(); };
    observer.observe(scene);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); loop.kill(); };
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={sceneRef} aria-hidden="true" className="relative mx-auto w-full max-w-[490px] py-6 lg:py-0">
      <div className="absolute inset-[12%] rounded-full bg-[#22C55E]/15 blur-[55px]" />
      <BrowserFrame className="relative z-10 aspect-[1.25] w-full border-[#0B0F0D]/15 bg-white shadow-[0_28px_70px_rgba(11,15,13,.18)]">
        <div className="relative h-full overflow-hidden bg-[#F6FAF7]">
          <div className="absolute inset-x-0 top-0 z-20 flex h-[18%] overflow-hidden border-b border-[#0B0F0D]/10 bg-white">
            {Array.from({ length: 10 }, (_, index) => <span key={index} className={`h-full flex-1 ${index % 2 === 0 ? 'bg-[#16A34A]' : 'bg-white'}`} />)}
          </div>
          <div className="absolute inset-x-[8%] top-[22%] h-[70%] overflow-hidden rounded-t-lg border border-[#0B0F0D]/10 bg-white shadow-sm">
            <div className="h-[13%] border-b border-[#0B0F0D]/10 bg-white px-[5%] py-[3%]"><span className="block h-2 w-[23%] rounded-full bg-[#16A34A]" /></div>
            <div className="grid h-[87%] grid-cols-[1.3fr_.7fr] gap-[4%] p-[5%]">
              <div className="flex flex-col justify-center gap-[6%] rounded-md bg-[#F6FAF7] p-[6%]">
                <i className="h-2 w-[80%] rounded-full bg-[#0B0F0D]/30" /><i className="h-2 w-[62%] rounded-full bg-[#0B0F0D]/15" /><i className="h-[13%] w-[35%] rounded-full bg-[#16A34A]" />
                <div className="mt-auto grid grid-cols-2 gap-2"><i className="h-8 rounded bg-[#22C55E]/15" /><i className="h-8 rounded bg-[#16A34A]/35" /></div>
              </div>
              <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#16A34A]/30 to-[#16A34A]/45">
                <div className="absolute bottom-0 left-0 h-[55%] w-full rounded-t-[50%] bg-[#16A34A]/60" />
                <div className="absolute bottom-0 left-[20%] h-[38%] w-[100%] rounded-t-[50%] bg-[#0B0F0D]/20" />
                <span className="absolute right-[16%] top-[17%] size-4 rounded-full bg-[#16A34A]" />
                <div className="absolute bottom-[14%] left-[12%] grid size-5 place-items-center rounded-full bg-[#16A34A] text-white"><Check className="size-3" /></div>
              </div>
            </div>
          </div>
        </div>
      </BrowserFrame>
      <div className="absolute -right-1 top-[38%] z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[#16A34A]/30 bg-[#16A34A] text-[#0B0F0D] shadow-lg sm:-right-3 sm:h-9 sm:w-9">
        <ArrowDownRight className="size-4 sm:size-5" />
      </div>
      <div ref={customersRef} className="absolute right-[-2%] top-[41%] z-30 flex gap-2 opacity-0 sm:right-[-4%]">
        {[0, 1, 2].map((item) => <span key={item} className="size-3 rounded-full border-2 border-[#16A34A] bg-[#F6FAF7] shadow-sm" />)}
      </div>
      <div ref={pulseRef} className="absolute bottom-[18%] right-[18%] z-30 grid size-8 place-items-center rounded-full bg-[#22C55E] text-[#0B0F0D] opacity-0"><Check className="size-5" /></div>
    </div>
  );
}

function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    const paragraph = ref.current;
    if (!paragraph || reducedMotion) return;
    const words = paragraph.querySelectorAll<HTMLElement>('[data-why-word]');
    const context = gsap.context(() => {
      gsap.fromTo(words, { opacity: 0.25 }, { opacity: 1, ease: 'none', stagger: 0.015, scrollTrigger: { trigger: paragraph, start: 'top 78%', end: 'bottom 42%', scrub: true, invalidateOnRefresh: true } });
    }, paragraph);
    return () => context.revert();
  }, { scope: ref, dependencies: [reducedMotion], revertOnUpdate: true });
  return <p ref={ref} className="text-sm leading-[1.6] text-[#45544C] sm:text-[15px] lg:text-[15.5px] max-w-[50ch]">{text.split(/(\s+)/).map((part, index) => /\s+/.test(part) ? part : <span data-why-word key={`${index}-${part}`}>{part}</span>)}</p>;
}

const benefitIcons = [ShieldCheck, Globe2, UsersRound, Sparkles];

export function WebsiteWhySection({ content }: { content: WebsiteDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (!sectionRef.current || reducedMotion) return;
    const cards = cardRefs.current.filter(Boolean);
    const context = gsap.context(() => {
      gsap.fromTo(cards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="website-why-title" className="relative overflow-hidden bg-[#F6FAF7] py-12 text-[#0B0F0D] sm:py-16 lg:py-20">
      <div className="mx-auto grid w-[85%] max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow tone="ink">{content.why.eyebrow}</Eyebrow>
          <h2 id="website-why-title" className="mt-3.5 max-w-[22em] font-display text-[clamp(1.5rem,2.2vw,2.15rem)] font-extrabold leading-[1.14] tracking-[-0.025em]">{content.why.title}</h2>
          <div className="mt-4 lg:hidden"><StorefrontScene reducedMotion={reducedMotion} /></div>
          <div className="mt-3.5"><ScrollText text={content.why.text} /></div>
          <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            {content.why.benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return <li key={benefit} ref={(node) => { if (node) cardRefs.current[index] = node; }} className="group relative flex min-h-[74px] items-center gap-3.5 overflow-hidden rounded-2xl border border-[#0B0F0D]/[0.08] bg-white p-3.5 shadow-[0_4px_16px_rgba(11,15,13,.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#16A34A]/40 hover:shadow-[0_12px_28px_rgba(22,163,74,.12)] after:absolute after:bottom-0 after:left-3.5 after:h-[2px] after:w-0 after:bg-[#16A34A] after:transition-all after:duration-500 hover:after:w-12 sm:min-h-[82px] sm:p-4">
                <span aria-hidden="true" className="absolute right-3 top-1 font-display text-3xl font-black leading-none text-[#0B0F0D]/[0.04] sm:text-4xl">{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#16A34A]/[0.08] text-[#16A34A] transition-transform duration-300 group-hover:scale-110 sm:size-10">
                  <Icon className="size-5 text-[#16A34A] sm:size-[22px]" strokeWidth={1.8} />
                </span>
                <span className="relative z-10 text-[14px] font-semibold leading-snug sm:text-[15px]">{benefit}</span>
              </li>;
            })}
          </ul>
        </div>
        <div className="hidden lg:col-span-6 lg:block"><StorefrontScene reducedMotion={reducedMotion} /></div>
      </div>
    </section>
  );
}

function ThumbnailArt({ index }: { index: number }) {
  const iconList = [PanelsTopLeft, Building2, ShoppingCart, Braces, LayoutTemplate, ArrowUpRight, LayoutGrid, Layers3, LayoutDashboard, Wrench];
  const Icon = iconList[index] ?? PanelsTopLeft;
  return (
    <div aria-hidden="true" className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#16A34A]/[0.12] via-[#0B0F0D]/20 to-[#16A34A]/[0.08] ${index === 2 || index === 3 ? 'sm:min-h-[160px]' : 'sm:min-h-[96px]'}`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
      {index === 2 ? (
        <div className="relative z-10 grid w-[74%] grid-cols-3 gap-2 transition-transform duration-500 group-hover:scale-105">
          {[0, 1, 2, 3, 4, 5].map((item) => <span key={item} className={`relative aspect-square rounded-lg border border-white/10 ${item % 2 === 0 ? 'bg-[#16A34A]/25' : 'bg-[#16A34A]/15'}`}><span className="absolute bottom-1 left-1 h-1 w-[55%] rounded-full bg-white/30" />{item === 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#16A34A] text-[#0B0F0D]"><Plus className="size-3" /></span>}</span>)}
        </div>
      ) : index === 3 ? (
        <div className="relative z-10 flex w-[82%] items-center gap-3 transition-transform duration-500 group-hover:translate-x-1">
          <CodePanel className="w-[58%]" /><div className="flex-1"><UiSkeleton compact live className="h-14 rounded-lg p-1.5" /></div>
        </div>
      ) : index === 7 ? (
        <div className="relative z-10 grid w-[72%] grid-cols-2 gap-2 transition-transform duration-500 group-hover:scale-105">
          <div className="h-12 rounded-lg bg-white/10" /><div className="h-12 rounded-lg bg-[#22C55E]/20" /><div className="absolute inset-y-0 left-1/2 w-px bg-[#16A34A]" /><div className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#16A34A] bg-[#0B0F0D]" />
        </div>
      ) : index === 8 ? (
        <div className="relative z-10 grid w-[78%] grid-cols-[.35fr_1fr] gap-2 transition-transform duration-500 group-hover:scale-105">
          <div className="rounded-md bg-[#22C55E]/20 p-1.5"><div className="space-y-1.5">{[0,1,2,3].map((item) => <i key={item} className="block h-1 rounded-full bg-white/30" />)}</div></div>
          <div className="grid grid-rows-[auto_1fr] gap-2"><div className="flex gap-2">{[0,1,2].map((item) => <i key={item} className="h-5 flex-1 rounded bg-white/10" />)}</div><div className="flex items-end gap-1 rounded bg-white/[0.04] p-2">{[30,60,43,78,52,90].map((height, item) => <i key={item} className="flex-1 rounded-t bg-[#22C55E]/60" style={{ height: `${height}%` }} />)}</div></div>
        </div>
      ) : index === 9 ? (
        <div className="relative z-10 flex w-[75%] items-center justify-center gap-4 text-[#22C55E]"><Wrench className="size-8 transition-transform duration-500 group-hover:-rotate-12" /><span className="h-px flex-1 bg-[#22C55E]/40" /><ShieldCheck className="size-8 text-[#16A34A]" /><HeartPulse className="absolute bottom-1 left-1/2 size-5 -translate-x-1/2 text-[#22C55E]" /></div>
      ) : (
        <div className="relative z-10 flex w-[66%] items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
          <Icon className="size-9 text-[#22C55E] sm:size-11" strokeWidth={1.5} />
          <div className="absolute -bottom-3 right-[12%] flex gap-1">{[0,1,2].map((item) => <i key={item} className={`h-2 rounded-full ${item === index % 3 ? 'w-7 bg-[#22C55E]/60' : 'w-3 bg-white/15'}`} />)}</div>
        </div>
      )}
      <span className="absolute bottom-2 right-2 size-1.5 rounded-full bg-[#16A34A]/75 transition-transform duration-300 group-hover:scale-150" />
    </div>
  );
}

export function WebsiteServices({ content }: { content: WebsiteDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (!sectionRef.current || reducedMotion) return;
    const cards = cardRefs.current.filter(Boolean);
    const context = gsap.context(() => {
      gsap.fromTo(cards, { y: 24, opacity: 0, clipPath: 'inset(0 0 14% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.65, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
    }, sectionRef);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="website-services-title" className="relative overflow-hidden bg-[#0B0F0D] py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute -right-28 top-1/4 size-[440px] rounded-full bg-[#16A34A]/[0.08] blur-[110px]" />
      <div className="relative z-10 mx-auto w-[85%] max-w-[1280px]">
        <Eyebrow>{content.services.eyebrow}</Eyebrow>
        <h2 id="website-services-title" className="mt-5 max-w-[18em] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">{content.services.title}</h2>
        <p className="mt-4 max-w-[44em] text-base leading-[1.65] text-white/[0.76] sm:text-[18px]">{content.services.text}</p>
        <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {content.services.items.map((service, index) => <li key={service} ref={(node) => { if (node) cardRefs.current[index] = node; }} onPointerMove={(event) => {
            if (event.pointerType === 'touch' || reducedMotion) return;
            const rect = event.currentTarget.getBoundingClientRect();
            event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
            event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
          }} className={`group relative isolate grid min-h-[100px] grid-cols-[64px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111815] p-3 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#22C55E]/40 hover:shadow-[0_18px_45px_rgba(0,0,0,.25)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(34,197,94,.12),transparent_72%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100 sm:block sm:min-h-[222px] sm:p-4 ${index === 2 || index === 3 ? 'lg:col-span-2' : ''}`}>
            <span aria-hidden="true" className="absolute right-3 top-2 z-20 font-mono text-xs text-white/30">{String(index + 1).padStart(2, '0')}</span>
            <div className={`relative z-10 col-start-1 row-start-1 h-14 w-14 overflow-hidden rounded-xl border border-white/10 sm:mb-4 sm:h-24 sm:w-full sm:rounded-2xl ${index === 2 || index === 3 ? 'lg:h-40' : ''}`}><ThumbnailArt index={index} /></div>
            <span className="relative z-10 col-start-2 row-start-1 block pr-5 text-[15px] font-semibold leading-snug text-white sm:pr-0 sm:text-[18px] lg:text-[20px]">{service}</span>
          </li>)}
        </ul>
      </div>
    </section>
  );
}
