'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Check, Code2, Rocket, ShieldCheck, Smartphone, Target } from 'lucide-react';
import type { WebsiteDevelopmentContent } from '@/data/servicePages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { Eyebrow } from './ServiceUI';

function ProcessStage({ index }: { index: number }) {
  const marks = Array.from({ length: index + 3 }, (_, item) => item);
  return <div aria-hidden="true" className="relative mx-auto grid aspect-[1.2] w-full max-w-[500px] place-items-center overflow-hidden rounded-[28px] border border-[#0B0F0D]/[0.08] bg-white shadow-[0_24px_60px_rgba(11,15,13,.08)]">
    <div className="absolute inset-5 rounded-[20px] border border-dashed border-[#16A34A]/25" />
    <div className="relative grid h-[65%] w-[70%] place-items-center rounded-2xl border border-[#0B0F0D]/10 bg-[#F6FAF7] p-5">
      {index === 0 && <div className="grid w-full grid-cols-3 gap-3">{marks.map((mark) => <span key={mark} className="aspect-square rounded-lg border border-[#16A34A]/25 bg-[#22C55E]/10" />)}<Target className="absolute right-5 top-5 size-9 text-[#16A34A]" />
      </div>}
      {index === 1 && <div className="flex w-full flex-col items-center gap-5"><span className="h-8 w-12 rounded-lg border-2 border-[#16A34A] bg-[#22C55E]/10"/><span className="h-8 w-[80%] border-x-2 border-t-2 border-[#16A34A]/40"/><div className="flex w-full justify-between">{marks.slice(0,3).map((mark)=><span key={mark} className="size-8 rounded-lg border-2 border-[#16A34A]/60 bg-white"/>)}</div></div>}
      {index === 2 && <div className="grid w-full grid-cols-[1.2fr_.8fr] gap-3"><div className="space-y-3 rounded-lg bg-white p-4">{marks.slice(0,3).map((mark)=><span key={mark} className="block h-3 rounded-full bg-[#0B0F0D]/10"/>)}<span className="block h-7 w-1/2 rounded-full bg-[#16A34A]"/></div><div className="rounded-lg bg-gradient-to-br from-[#22C55E]/30 to-[#B6F23D]/50"/></div>}
      {index === 3 && <div className="flex w-full items-center gap-4"><Code2 className="size-12 shrink-0 text-[#16A34A]"/><div className="flex-1 space-y-3">{marks.map((mark)=><span key={mark} className="block h-2 rounded-full bg-[#16A34A]/30" style={{width:`${62+(mark%3)*12}%`}}/>)}</div></div>}
      {index === 4 && <div className="flex items-center gap-4"><div className="grid grid-cols-2 gap-2">{marks.slice(0,4).map((mark)=><span key={mark} className="h-14 w-20 rounded-lg border border-[#0B0F0D]/10 bg-white"/>)}</div><Smartphone className="size-12 text-[#16A34A]"/><ShieldCheck className="absolute bottom-4 right-4 size-9 text-[#16A34A]"/><Check className="absolute bottom-[22px] right-[22px] size-4 text-white"/></div>}
      {index === 5 && <div className="relative flex h-full w-full items-center justify-center"><div className="h-28 w-[70%] rounded-xl border-2 border-[#0B0F0D]/15 bg-white p-3"><div className="h-full rounded-lg bg-gradient-to-br from-[#22C55E]/30 to-[#B6F23D]/50"/></div><Rocket className="absolute right-[18%] top-[8%] size-12 -rotate-45 text-[#16A34A]"/></div>}
    </div>
    <div className="absolute bottom-5 left-6 flex gap-2">{marks.slice(0,4).map((mark)=><span key={mark} className="size-2 rounded-full bg-[#16A34A]/25"/>)}<span className="size-2 rounded-full bg-[#16A34A]"/></div>
  </div>;
}

export function WebsiteDevelopmentProcess({ content }: { content: WebsiteDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLLIElement[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const sceneLayers = useRef<HTMLDivElement[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    const steps = stepRefs.current.filter(Boolean);
    if (!track || !stage || steps.length !== content.process.steps.length) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const driver = { current: 0, target: 0 };
      let displayedActive = -1;
      let visible = false;
      const render = (progress: number) => {
        const active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        if (active !== displayedActive) {
          displayedActive = active;
          steps.forEach((step, index) => {
            const distance = Math.abs(index - active);
            gsap.to(step, {
              opacity: index <= active ? 1 : 0.38,
              y: index === active ? 0 : 5,
              scale: index === active ? 1 : Math.max(0.96, 1 - distance * 0.01),
              duration: 0.5,
              ease: 'power3.out',
              overwrite: true,
            });
            step.dataset.active = String(index === active);
          });
        }
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;
        sceneLayers.current.filter(Boolean).forEach((layer, index) => {
          layer.style.opacity = String(Math.max(0, 1 - Math.abs(progress * (steps.length - 1) - index)));
          layer.style.transform = `translate3d(0,${(index - progress * (steps.length - 1)) * 10}px,0)`;
        });
      };
      render(0);
      const trigger = ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', onUpdate: (self) => { driver.target = self.progress; }, onRefresh: (self) => { driver.target = self.progress; } });
      const ticker = (_time: number, delta: number) => {
        if (!visible) return;
        driver.current += (driver.target - driver.current) * (1 - Math.exp(-Math.max(0, delta) / 1000 * 10));
        render(driver.current);
      };
      gsap.ticker.add(ticker);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .01 });
      observer.observe(stage);
      return () => { trigger.kill(); gsap.ticker.remove(ticker); observer.disconnect(); };
    });
    mm.add('(max-width: 1023px)', () => {
      steps.forEach((step, index) => gsap.fromTo(step, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, delay: Math.min(index * 0.035, 0.16), ease: 'power3.out', scrollTrigger: { trigger: step, start: 'top 88%', once: true } }));
    });
    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion, content], revertOnUpdate: true });

  return <section ref={sectionRef} aria-labelledby="website-process-title" className="relative bg-[#F6FAF7] text-[#0B0F0D]">
    <div className="mx-auto w-[90%] max-w-[1280px] py-16 sm:py-24">
      <Eyebrow tone="ink">{content.process.eyebrow}</Eyebrow>
      <h2 id="website-process-title" className="mt-5 max-w-[18em] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">{content.process.title}</h2>
      <p className="mt-4 max-w-[44em] text-base leading-[1.65] text-[#5B6B63] sm:text-[18px]">{content.process.text}</p>
    </div>
    <div ref={trackRef} className={`relative mx-auto w-[90%] max-w-[1280px] pb-16 sm:pb-24 ${reducedMotion ? '' : 'lg:h-[300svh] lg:pb-0'}`}>
      <div ref={stageRef} className={`lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-8 xl:gap-12 ${reducedMotion ? '' : 'lg:sticky lg:top-[76px] lg:h-[calc(100svh-112px)]'}`}>
        <div className="relative hidden min-w-0 aspect-[1.2] lg:block">
          {content.process.steps.map((step,index)=><div key={step.title} ref={(node)=>{if(node) sceneLayers.current[index]=node;}} className={`absolute inset-0 ${index === (reducedMotion ? 5 : 0) ? 'opacity-100' : 'opacity-0'}`}><ProcessStage index={index}/></div>)}
        </div>
        <div className="relative min-w-0 lg:pl-9">
          <div aria-hidden="true" className="absolute bottom-3 left-1 top-1 hidden w-[3px] rounded-full bg-[#0B0F0D]/10 lg:block"><div ref={fillRef} className="h-full origin-top scale-y-0 rounded-full bg-gradient-to-b from-[#16A34A] to-[#B6F23D]"/></div>
          <ol className="space-y-8 lg:space-y-2">{content.process.steps.map((step,index)=><li key={step.title} ref={(node)=>{if(node) stepRefs.current[index]=node;}} className="relative min-w-0 border-b border-[#0B0F0D]/10 pb-7 lg:border-0 lg:pb-0" data-active={reducedMotion ? 'true' : undefined}>
            <span aria-hidden="true" className="absolute -left-[36px] top-1 hidden size-3 rounded-full border-[3px] border-[#16A34A] bg-[#F6FAF7] lg:block"/>
            <div className="mb-5 lg:hidden"><ProcessStage index={index}/></div>
            <span aria-hidden="true" className="font-mono text-sm font-bold tracking-widest text-[#16A34A] lg:text-xs">{String(index+1).padStart(2,'0')}</span>
            <h3 className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl lg:mt-1 lg:text-lg">{step.title}</h3>
            <p className="mt-2 max-w-[38em] text-base leading-relaxed text-[#5B6B63] lg:mt-1 lg:text-sm lg:leading-snug">{step.text}</p>
          </li>)}</ol>
        </div>
      </div>
    </div>
  </section>;
}
