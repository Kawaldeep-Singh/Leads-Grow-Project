'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { HiArrowRight } from 'react-icons/hi2';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger, SplitText } from '@/lib/gsap-register';
import type { ServicePageContent } from '@/data/servicePages';

const prospectDots = [
  [110, 68], [185, 44], [270, 60], [355, 48], [430, 72], [145, 112],
  [235, 104], [325, 115], [395, 112], [185, 156], [270, 164], [350, 158],
];

function FunnelScene({ reducedMotion }: { reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<SVGPathElement[]>([]);
  const dotRefs = useRef<SVGCircleElement[]>([]);
  const barRefs = useRef<SVGRectElement[]>([]);
  const arrowRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    const arrow = arrowRef.current;
    if (!scene || !arrow || reducedMotion) return;

    const layers = layerRefs.current.filter(Boolean);
    const dots = dotRefs.current.filter(Boolean);
    const bars = barRefs.current.filter(Boolean);
    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay: 0.25 });
      intro.fromTo(layers,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'power2.inOut' },
      );
      intro.fromTo(bars,
        { scaleY: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.55, stagger: 0.08, ease: 'expo.out' },
        0.5,
      );
      intro.fromTo(arrow,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' },
        0.85,
      );
      intro.fromTo(dots,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 0.9, duration: 0.65, stagger: 0.08, ease: 'power2.out' },
        0.55,
      );

      const fall = gsap.to(dots, {
        y: 28,
        opacity: 0.25,
        duration: 2.7,
        stagger: { each: 0.16, repeat: -1 },
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        paused: true,
      });
      const drift = gsap.to(arrow, { y: -6, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
      let inView = false;
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden) { fall.play(); drift.play(); }
        else { fall.pause(); drift.pause(); }
      }, { threshold: 0.01 });
      const visibility = () => {
        if (document.hidden) { fall.pause(); drift.pause(); }
        else if (inView) { fall.play(); drift.play(); }
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
      };
    }, scene);
    return () => context.revert();
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={sceneRef} className="relative mx-auto h-[260px] w-full max-w-[420px] overflow-visible sm:h-[300px] lg:h-[min(68vh,560px)] lg:max-w-none" aria-hidden="true">
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,.17),rgba(22,163,74,.06)_48%,transparent_72%)] blur-2xl" />
        <svg viewBox="0 0 500 560" className="relative h-full w-full overflow-visible">
          <defs>
            <linearGradient id="service-funnel-stroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B6F23D" /><stop offset="1" stopColor="#16A34A" /></linearGradient>
            <linearGradient id="service-funnel-arrow" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#15803D" /><stop offset="1" stopColor="#B6F23D" /></linearGradient>
            <mask id="service-arrow-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="180"><rect x="0" y="0" width={reducedMotion ? 400 : 0} height="180" fill="white" /></mask>
          </defs>
          <g fill="none" stroke="url(#service-funnel-stroke)" strokeWidth="2.5" strokeLinecap="round">
            {[
              'M70 80 Q250 145 430 80',
              'M96 125 Q250 182 404 125',
              'M122 170 Q250 218 378 170',
              'M150 216 Q250 252 350 216',
            ].map((path, index) => <path key={path} ref={(element) => { if (element) layerRefs.current[index] = element; }} d={path} pathLength="1" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} opacity={0.9 - index * 0.12} />)}
          </g>
          <g fill="#B6F23D">
            {prospectDots.map(([cx, cy], index) => <circle key={`${cx}-${cy}`} ref={(element) => { if (element) dotRefs.current[index] = element; }} cx={cx} cy={cy} r={index % 3 === 0 ? 4 : 3} opacity={reducedMotion ? 0.85 : 0} />)}
          </g>
          <g fill="#22C55E" opacity=".13"><circle cx="250" cy="279" r="13" /><circle cx="250" cy="279" r="28" fill="none" stroke="#22C55E" strokeWidth="1" /></g>
          {[86, 116, 148, 184, 228].map((height, index) => <rect key={height} ref={(element) => { if (element) barRefs.current[index] = element; }} x={170 + index * 34} y={472 - height} width="20" height={height} rx="4" fill={index === 4 ? '#B6F23D' : '#16A34A'} opacity={reducedMotion ? 0.8 : 0.72} />)}
          <path d="M144 474H360" stroke="#22C55E" strokeOpacity=".38" strokeWidth="2" />
          <g ref={arrowRef} transform="translate(286 305) rotate(-50) scale(1.65)" mask="url(#service-arrow-mask)">
            <polygon points="100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5" fill="url(#service-funnel-arrow)" />
            <path d="M100-5 103-2 107 0 103 2 100 5 97 2 93 0 97-2Z" fill="#F4FFD6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function ServiceHero({ content }: { content: ServicePageContent }) {
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
        word.style.backgroundImage = 'linear-gradient(90deg, #22C55E 0%, #B6F23D 100%)';
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
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-[85%] grid-cols-1 content-center gap-y-6 pb-12 pt-32 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-10 lg:pt-[120px]">
        {/* <div ref={eyebrowRef} className="order-1 flex items-center gap-3 lg:col-span-7 lg:col-start-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/35 bg-[#16A34A] px-4 py-2 text-sm font-semibold text-[#0B0F0D] shadow-[0_0_24px_rgba(34,197,94,.22)]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#0B0F0D]" />{content.hero.eyebrow}
          </span>
        </div> */}
        <h1 id="service-hero-title" ref={titleRef} className="order-2 m-0 font-display text-[clamp(2rem,7vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] lg:col-span-7 lg:col-start-1 lg:text-[clamp(2.5rem,5vw,4.75rem)]">
          {titleLines.map((line, index) => <span key={line} ref={(element) => { if (element) titleLineRefs.current[index] = element; }} className={`block ${index === 1 ? 'text-transparent' : ''} ${index === 2 ? 'bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent' : ''}`} style={index === 1 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.92)', WebkitTextFillColor: 'transparent' } : undefined}>{index === 0 ? line : ` ${line}`}</span>)}
        </h1>
        <p ref={paragraphRef} className="order-4 mt-1 max-w-[36em] text-base leading-[1.65] text-white/[0.76] sm:text-[17px] lg:col-span-7 lg:col-start-1 lg:mt-6 lg:text-[18px]">{content.hero.text}</p>
        <div ref={sceneRef} className="order-3 mx-auto w-full lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:w-full">
          <FunnelScene reducedMotion={reducedMotion} />
        </div>
        <ol className="order-5 mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-3 lg:col-span-7 lg:col-start-1 lg:mt-8 lg:flex-nowrap lg:gap-5">
          {content.hero.flow.map((word, index) => <li key={word} ref={(element) => { if (element) flowRefs.current[index] = element; }} className={`relative flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors sm:min-h-10 ${index === content.hero.flow.length - 1 ? 'border-[#B6F23D] bg-[#B6F23D] text-[#0B0F0D]' : 'border-white/20 bg-white/[0.06] text-white'}`}>
            {word}
            {index < content.hero.flow.length - 1 && <svg aria-hidden="true" className="absolute left-1/2 top-full h-3 w-4 -translate-x-1/2 rotate-90 sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:rotate-0" viewBox="0 0 28 12" fill="none"><path d="M1 6h24m-5-4 5 4-5 4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </li>)}
        </ol>
      </div>
    </section>
  );
}
