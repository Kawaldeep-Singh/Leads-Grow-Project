'use client';

import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import { Eyebrow } from './ServiceUI';
import type { DigitalMarketingContent } from '@/data/servicePages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';

const stepPoints = [
  { x: 7.5, y: 90, left: '0%', top: '52%' },
  { x: 29, y: 70, left: '20%', top: '30%' },
  { x: 55, y: 58, left: '41%', top: '78%' },
  { x: 78, y: 40, left: '62%', top: '14%' },
  { x: 93, y: 10, left: '82%', top: '43%' },
];

export function ServiceProcess({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<SVGCircleElement[]>([]);
  const stepRefs = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const staticPath = pathRef.current;
    if (staticPath) {
      const staticLength = staticPath.getTotalLength();
      nodeRefs.current.forEach((node, index) => {
        if (!node) return;
        const point = staticPath.getPointAtLength(staticLength * (index / (content.process.steps.length - 1)));
        node.setAttribute('cx', String(point.x));
        node.setAttribute('cy', String(point.y));
      });
    }
    if (reducedMotion || !sectionRef.current) return;
    const section = sectionRef.current;
    const media = gsap.matchMedia();

    media.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      const path = pathRef.current;
      const progressPath = progressPathRef.current;
      const traveler = travelerRef.current;
      if (!track || !stage || !path || !progressPath || !traveler) return;
      const length = path.getTotalLength();
      progressPath.style.strokeDasharray = '1';
      progressPath.style.strokeDashoffset = '1';
      const driver = { target: 0, current: 0 };
      let inView = false;
      const applyFrame = (progress: number) => {
        progressPath.style.strokeDashoffset = String(1 - progress);
        const point = path.getPointAtLength(length * progress);
        traveler.setAttribute('transform', `translate(${point.x} ${point.y})`);
        stepPoints.forEach((_, index) => {
          const threshold = index / (content.process.steps.length - 1);
          const visible = index === 0 ? 1 : Math.min(1, Math.max(0, (progress - threshold + 0.12) / 0.12));
          const node = nodeRefs.current[index];
          const step = stepRefs.current[index];
          if (node) {
            const nodePoint = path.getPointAtLength(length * threshold);
            node.setAttribute('cx', String(nodePoint.x));
            node.setAttribute('cy', String(nodePoint.y));
            node.style.opacity = visible > 0.35 ? '1' : '0.45';
            node.setAttribute('r', visible > 0.35 ? '10' : '8');
          }
          if (step) { step.style.opacity = String(visible); step.style.transform = `translateY(${(1 - visible) * 10}px)`; }
        });
      };
      applyFrame(0);
      const trigger = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => { driver.target = self.progress; },
        onRefresh: (self) => { driver.target = self.progress; },
      });
      const ticker = (_time: number, delta: number) => {
        if (!inView) return;
        const dt = Math.max(0, delta) / 1000;
        driver.current += (driver.target - driver.current) * (1 - Math.exp(-dt * 10));
        applyFrame(driver.current);
      };
      gsap.ticker.add(ticker);
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.01 });
      observer.observe(stage);
      return () => { gsap.ticker.remove(ticker); observer.disconnect(); trigger.kill(); };
    });

    media.add('(max-width: 1023px)', () => {
      if (!mobileProgressRef.current) return;
      const draw = gsap.fromTo(mobileProgressRef.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 75%', end: 'bottom 80%', scrub: true, invalidateOnRefresh: true } });
      const reveals = stepRefs.current.filter(Boolean).map((step, index) => gsap.fromTo(step, { opacity: 0.35, y: 12 }, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'expo.out',
        scrollTrigger: { trigger: step, start: 'top 85%', once: true, onEnter: () => { const node = nodeRefs.current[index]; if (node) gsap.fromTo(node, { scale: 0.75 }, { scale: 1.25, duration: 0.35, yoyo: true, repeat: 1, ease: 'back.out(2)' }); } },
      }));
      return () => { draw.scrollTrigger?.kill(); reveals.forEach((reveal) => reveal.scrollTrigger?.kill()); };
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion, content.process.steps.length], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-process-title" className="relative bg-[#0B0F0D] py-[15px] text-white">
      <div ref={trackRef} className={`relative ${reducedMotion ? '' : 'lg:h-[260svh]'}`}>
        <div ref={stageRef} className={`relative ${reducedMotion ? '' : 'lg:sticky lg:top-[76px] lg:h-[calc(100svh-76px)]'}`}>
          <div className="mx-auto flex w-[85%] max-w-7xl flex-col py-16 sm:py-20 lg:h-full lg:py-8">
            <div className="relative z-10">
              <Eyebrow>{content.process.eyebrow}</Eyebrow>
              <h2 id="service-process-title" className="mt-5 max-w-[18em] font-display text-[clamp(1.65rem,3.5vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{content.process.title}</h2>
            </div>

            <div className="relative mt-12 lg:mt-0 lg:min-h-0 lg:flex-1">
              <div aria-hidden="true" className="pointer-events-none absolute bottom-2 left-[13px] top-2 w-px bg-white/15 lg:hidden">
                <div ref={mobileProgressRef} className={`h-full origin-top bg-[#22C55E] ${reducedMotion ? 'scale-y-100' : 'scale-y-0'}`} />
              </div>
              <ol className="relative z-10 flex flex-col gap-7 lg:absolute lg:inset-0 lg:block lg:gap-0">
                {content.process.steps.map((step, index) => {
                  const point = stepPoints[index];
                  return <li key={step.title} ref={(element) => { if (element) stepRefs.current[index] = element; }} className="relative flex gap-5 pl-1 lg:absolute lg:left-[var(--step-left)] lg:top-[var(--step-top)] lg:w-[18%] lg:pl-0" style={point ? { '--step-left': point.left, '--step-top': point.top } as CSSProperties : undefined}>
                    <span aria-hidden="true" className="relative z-10 mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-[#22C55E] bg-[#0B0F0D] text-[10px] text-[#16A34A] lg:hidden">{String(index + 1).padStart(2, '0')}</span>
                    <div className="lg:min-h-[92px]">
                      <span aria-hidden="true" className="hidden font-mono text-xs text-[#22C55E] lg:block">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="font-display text-[16px] font-bold leading-tight text-white sm:text-[18px]">{step.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-white/75 sm:text-sm">{step.text}</p>
                    </div>
                  </li>;
                })}
              </ol>

              <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-0 hidden h-full w-full overflow-visible lg:block" viewBox="0 0 1200 540" preserveAspectRatio="none" fill="none">
                <defs><linearGradient id="service-process-path" x1="0" y1="540" x2="1200" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#16A34A" /><stop offset="1" stopColor="#16A34A" /></linearGradient></defs>
                <path ref={pathRef} d="M90 486 C250 474 262 381 430 378S642 321 728 269 923 193 1116 54" stroke="white" strokeOpacity=".16" strokeWidth="3" />
                <path ref={progressPathRef} d="M90 486 C250 474 262 381 430 378S642 321 728 269 923 193 1116 54" pathLength="1" stroke="url(#service-process-path)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} />
                {stepPoints.map((point, index) => <circle key={index} ref={(element) => { if (element) nodeRefs.current[index] = element; }} cx={point.x * 12} cy={point.y * 5.4} r="8" fill="#0B0F0D" stroke="#22C55E" strokeWidth="2" opacity={reducedMotion ? 1 : 0.45} />)}
                <g ref={travelerRef} transform={reducedMotion ? 'translate(1116 54)' : 'translate(90 486)'}><circle r="12" fill="#22C55E" fillOpacity=".3" /><circle r="6" fill="#0B0F0D" stroke="#16A34A" strokeWidth="2" /></g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
