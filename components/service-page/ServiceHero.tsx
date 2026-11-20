'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ChartNoAxesCombined, FileText, Search, Share2 } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { SiGoogleads, SiMeta } from 'react-icons/si';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ServiceBreadcrumb } from './ServiceBreadcrumb';
import { gsap, registerGsapPlugins, ScrollTrigger, SplitText } from '@/lib/gsap-register';
import type { DigitalMarketingContent } from '@/data/servicePages';

function FunnelScene({ reducedMotion }: { reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<SVGCircleElement>(null);
  const connectorRefs = useRef<SVGPathElement[]>([]);
  const channelRefs = useRef<HTMLDivElement[]>([]);

  const channels = [
    { name: 'Organic Search', Icon: Search, color: '#22C55E', position: 'left-[6%] top-[8%]' },
    { name: 'Brand & Social', Icon: Share2, color: '#22C55E', position: 'right-[6%] top-[8%]' },
    { name: 'Google Ads', Icon: SiGoogleads, color: '#4285F4', position: 'left-[3%] top-1/2 -translate-y-1/2' },
    { name: 'Meta Ads', Icon: SiMeta, color: '#0866FF', position: 'right-[3%] top-1/2 -translate-y-1/2' },
    { name: 'LinkedIn Ads', Icon: FaLinkedinIn, color: '#0A66C2', position: 'left-[6%] bottom-[8%]' },
    { name: 'Content Marketing', Icon: FileText, color: '#16A34A', position: 'right-[6%] bottom-[8%]' },
  ];

  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    const core = coreRef.current;
    const orbit = orbitRef.current;
    if (!scene || !core || !orbit || reducedMotion) return;

    const connectors = connectorRefs.current.filter(Boolean);
    const channelNodes = channelRefs.current.filter(Boolean);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay: 0.15 });
      intro.fromTo(connectors,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.7, stagger: 0.1, ease: 'power2.inOut' },
      );
      intro.fromTo(core, { scale: .65, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.5)' }, .2);
      intro.fromTo(channelNodes, { y: 16, scale: .72, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .65, stagger: .12, ease: 'back.out(1.5)' }, .28);

      const orbitMotion = gsap.to(orbit, { rotation: 360, duration: 36, repeat: -1, ease: 'none', svgOrigin: '250 250', paused: true });
      const floatMotion = gsap.to(channelNodes, { y: -5, duration: 2.5, repeat: -1, yoyo: true, stagger: { each: .25, from: 'start' }, ease: 'sine.inOut', paused: true });
      let inView = false;
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) { orbitMotion.play(); floatMotion.play(); }
        else { orbitMotion.pause(); floatMotion.pause(); }
      }, { threshold: 0.01 });
      const visibility = () => {
        if (document.hidden) { orbitMotion.pause(); floatMotion.pause(); }
        else if (inView) { orbitMotion.play(); floatMotion.play(); }
      };
      observer.observe(scene);
      document.addEventListener('visibilitychange', visibility);

      const onPointerMove = (event: PointerEvent) => {
        const element = tiltRef.current;
        if (!element || !window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return;
        const bounds = scene.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(element, { rotationX: -y * 10, rotationY: x * 10, duration: 0.8, ease: 'power2.out', overwrite: true });
      };
      const onPointerLeave = () => {
        if (tiltRef.current) gsap.to(tiltRef.current, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power2.out' });
      };
      scene.addEventListener('pointermove', onPointerMove);
      scene.addEventListener('pointerleave', onPointerLeave);

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        scene.removeEventListener('pointermove', onPointerMove);
        scene.removeEventListener('pointerleave', onPointerLeave);
        orbitMotion.kill();
        floatMotion.kill();
      };
    }, scene);
    return () => context.revert();
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={sceneRef} className="relative mx-auto h-[300px] w-full max-w-[420px] overflow-visible sm:h-[360px] lg:h-[min(68vh,560px)] lg:max-w-none" aria-hidden="true">
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,.2),rgba(22,163,74,.07)_48%,transparent_72%)] blur-2xl" />
        <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          <g ref={orbitRef}>
            <ellipse cx="250" cy="250" rx="170" ry="140" stroke="#22C55E" strokeOpacity=".2" strokeWidth="1.5" strokeDasharray="2 12" />
            <ellipse cx="250" cy="250" rx="140" ry="108" stroke="#22C55E" strokeOpacity=".08" strokeWidth="1" />
          </g>
          {[
            'M80 110 Q155 140 218 222',
            'M420 110 Q345 140 282 222',
            'M80 250 Q150 250 218 250',
            'M420 250 Q350 250 282 250',
            'M80 390 Q155 360 218 278',
            'M420 390 Q345 360 282 278',
          ].map((path, index) => <path key={path} ref={(element) => { if (element) connectorRefs.current[index] = element; }} d={path} pathLength="1" stroke="#22C55E" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} />)}
          <circle cx="250" cy="250" r="68" fill="#16A34A" fillOpacity=".08" />
        </svg>
        {channels.map(({ name, Icon, color }, index) => (
          <div
            key={name}
            ref={(element) => { if (element) channelRefs.current[index] = element; }}
            className={`absolute z-10 grid size-[64px] place-items-center rounded-[20px] border border-white/15 bg-[#111815]/95 shadow-[0_14px_34px_rgba(0,0,0,.35)] sm:size-[76px] lg:size-[84px] ${channels[index].position}`}
            style={{ boxShadow: '0 14px 34px rgba(0,0,0,.35), 0 0 24px rgba(34,197,94,.08)' }}
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-white/[.06] sm:size-12">
              <Icon aria-hidden="true" className="size-6 sm:size-7" style={{ color }} />
            </span>
          </div>
        ))}
        <div ref={coreRef} className="absolute left-1/2 top-1/2 z-20 grid size-[108px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#22C55E]/35 bg-[#0B0F0D]/95 shadow-[0_0_40px_rgba(34,197,94,.16)] sm:size-[124px]">
          <div className="grid size-[78px] place-items-center rounded-full border border-white/10 bg-[#111815] sm:size-[90px]">
            <ChartNoAxesCombined aria-hidden="true" className="size-10 text-[#22C55E] sm:size-12" strokeWidth={1.6} />
          </div>
          <span className="absolute -right-1 top-3 size-3 rounded-full border-2 border-[#0B0F0D] bg-[#16A34A]" />
        </div>
      </div>
    </div>
  );
}

export function ServiceHero({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleLineRefs = useRef<HTMLSpanElement[]>([]);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const flowRefs = useRef<HTMLLIElement[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [introReady, setIntroReady] = useState(false);
  const titleLines = content.hero.title.match(/[^.]+\./g)?.map((line) => line.trim()) ?? [content.hero.title];

  useEffect(() => {
    if (reducedMotion) { setIntroReady(true); return; }
    let timer: number | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener('leadsgrow:preloaderComplete', start);
      if (timer !== undefined) window.clearTimeout(timer);
      setIntroReady(true);
    };
    let preloaded = false;
    try { preloaded = sessionStorage.getItem('lg-preloaded') === 'true'; } catch { /* use the timed fallback */ }
    if (preloaded) start();
    else {
      window.addEventListener('leadsgrow:preloaderComplete', start, { once: true });
      timer = window.setTimeout(start, 600);
    }
    return () => {
      window.removeEventListener('leadsgrow:preloaderComplete', start);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !eyebrow || !title || !paragraph || !introReady || reducedMotion) return;

    const context = gsap.context(() => {
      const splits = titleLineRefs.current.filter(Boolean).map((line) => new SplitText(line, { type: 'words', mask: 'words' }));
      const intro = gsap.timeline();
      intro.fromTo(eyebrow, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 0);
      splits.forEach((split, index) => intro.fromTo(split.words, { yPercent: 100, rotationX: 40, transformOrigin: '50% 100%' }, { yPercent: 0, rotationX: 0, duration: 0.85, stagger: 0.09, ease: 'expo.out' }, 0.25 + index * 0.12));
      const lineTwo = titleLineRefs.current[1];
      if (lineTwo) {
        intro.to(lineTwo, { webkitTextFillColor: '#FFFFFF', duration: 0.2, ease: 'power1.out' }, 1.35);
        intro.to(lineTwo, { webkitTextFillColor: 'transparent', duration: 0.2, ease: 'power1.out' }, 1.55);
      }
      titleLineRefs.current[2]?.querySelectorAll<HTMLElement>('[aria-hidden="true"] > div').forEach((word) => {
        word.style.backgroundImage = 'linear-gradient(90deg, #22C55E 0%, #16A34A 100%)';
        word.style.backgroundSize = '200% 100%';
        word.style.backgroundPosition = '100% 0%';
        word.style.backgroundClip = 'text';
        word.style.webkitBackgroundClip = 'text';
        word.style.color = 'transparent';
      });
      const gradientWords = [...(titleLineRefs.current[2]?.querySelectorAll<HTMLElement>('[aria-hidden="true"] > div') ?? [])];
      if (gradientWords.length) intro.fromTo(gradientWords, { backgroundPosition: '100% 0%' }, { backgroundPosition: '0% 0%', duration: 0.55, ease: 'power2.out' }, 1.45);
      intro.fromTo(paragraph, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, 1.8);
      intro.fromTo(flowRefs.current.filter(Boolean), { opacity: 0.35, y: 10 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.2, ease: 'power2.out' }, 1.65);

      const scene = sceneRef.current;
      const out = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
      if (scene) out.to(scene, { scale: 1.08, opacity: 0, ease: 'none' }, 0);
      out.to(title, { yPercent: -4, ease: 'none' }, 0);
      return () => splits.forEach((split) => split.revert());
    }, section);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [introReady, reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="service-hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-[85%] max-w-7xl grid-cols-1 content-center gap-y-6 pb-12 pt-32 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-10 lg:pt-[120px]">
        <div ref={eyebrowRef} className="order-1 mb-1 flex min-w-0 items-center lg:col-span-7 lg:col-start-1">
          <ServiceBreadcrumb current="Digital Marketing" />
        </div>
        <h1 id="service-hero-title" ref={titleRef} className="hero-display-title order-2 m-0 max-[639px]:text-center lg:col-span-7 lg:col-start-1">
          {titleLines.map((line, index) => <span key={line} ref={(element) => { if (element) titleLineRefs.current[index] = element; }} className={`block ${index === 1 ? 'text-transparent' : ''} ${index === 2 ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent' : ''}`} style={index === 1 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.92)', WebkitTextFillColor: 'transparent' } : undefined}>{index === 0 ? line : ` ${line}`}</span>)}
        </h1>
        <p ref={paragraphRef} className="order-4 mt-1 max-w-[36em] text-base leading-[1.65] text-white/[0.76] sm:text-[17px] lg:col-span-7 lg:col-start-1 lg:mt-6 lg:text-[18px]">{content.hero.text}</p>
        <div ref={sceneRef} className="order-3 mx-auto w-full lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:w-full">
          <FunnelScene reducedMotion={reducedMotion} />
        </div>
        <ol className="order-5 mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-3 lg:col-span-7 lg:col-start-1 lg:mt-8 lg:flex-nowrap lg:gap-5">
          {content.hero.flow.map((word, index) => <li key={word} ref={(element) => { if (element) flowRefs.current[index] = element; }} className={`relative flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-base font-semibold transition-colors sm:min-h-10 sm:text-sm ${index === content.hero.flow.length - 1 ? 'border-[#16A34A] bg-[#16A34A] text-[#0B0F0D]' : 'border-white/20 bg-white/[0.06] text-white'}`}>
            {word}
            {index < content.hero.flow.length - 1 && <svg aria-hidden="true" className="absolute left-1/2 top-full h-3 w-4 -translate-x-1/2 rotate-90 sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:rotate-0" viewBox="0 0 28 12" fill="none"><path d="M1 6h24m-5-4 5 4-5 4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </li>)}
        </ol>
      </div>
    </section>
  );
}
