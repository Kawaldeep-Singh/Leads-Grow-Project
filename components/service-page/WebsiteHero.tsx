'use client';

import { useRef } from 'react';
import { Gauge, Laptop, ShieldCheck, Smartphone } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import type { WebsiteDevelopmentContent } from '@/data/servicePages';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { BrowserFrame, CodePanel, LaptopFrame, PhoneFrame, ShieldBadge, UiSkeleton } from './mockups';

function WebsiteBuildScene({ reducedMotion }: { reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const wireframeRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    registerGsapPlugins();
    const scene = sceneRef.current;
    const laptop = laptopRef.current;
    const wireframe = wireframeRef.current;
    const live = liveRef.current;
    const code = codeRef.current;
    const phone = phoneRef.current;
    const shield = shieldRef.current;
    if (!scene || !laptop || !wireframe || !live || !code || !phone || !shield) return;

    if (reducedMotion) {
      gsap.set([wireframe, code], { opacity: 0 });
      gsap.set([live, phone], { opacity: 1 });
      gsap.set(shield, { opacity: 1, scale: 1 });
      return;
    }

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: scene, start: 'top 82%', once: true },
      onComplete: () => {
        if (!document.hidden && observerVisible) float.play();
      },
    });
    let observerVisible = false;
    const float = gsap.to(laptop, { y: -6, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
    timeline
      .set(phone, { opacity: 0, y: 18, scale: 0.96 })
      .set(shield, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' })
      .fromTo(code, { opacity: 0, x: 22 }, { opacity: 0.95, x: 0, duration: 0.45, ease: 'expo.out' })
      .fromTo(laptop, { opacity: 0, y: 24, rotateY: -5 }, { opacity: 1, y: 0, rotateY: 0, duration: 0.65, ease: 'expo.out' }, '<')
      .to(wireframe, { opacity: 1, duration: 0.15 }, 0.45)
      .to(wireframe, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 1.15)
      .to(live, { opacity: 1, duration: 0.55, ease: 'power2.inOut' }, 1.15)
      .fromTo(phone, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' }, 1.45)
      .fromTo(shield, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 2.15);

    const observer = new IntersectionObserver(([entry]) => {
      observerVisible = entry.isIntersecting;
      if (!observerVisible || document.hidden) float.pause();
      else if (timeline.progress() === 1) float.play();
    }, { threshold: 0.05 });
    const visibility = () => {
      if (document.hidden || !observerVisible) float.pause();
      else if (timeline.progress() === 1) float.play();
    };
    observer.observe(scene);
    document.addEventListener('visibilitychange', visibility);

    const tilt = gsap.quickTo(scene, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const tiltX = gsap.quickTo(scene, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const move = (event: PointerEvent) => {
      if (!window.matchMedia('(pointer: fine)').matches) return;
      const rect = scene.getBoundingClientRect();
      tilt(((event.clientX - rect.left) / rect.width - 0.5) * 10);
      tiltX((0.5 - (event.clientY - rect.top) / rect.height) * 7);
    };
    const resetTilt = () => { tilt(0); tiltX(0); };
    scene.addEventListener('pointermove', move);
    scene.addEventListener('pointerleave', resetTilt);

    const out = gsap.to(scene, {
      scale: 1.08,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: scene, start: 'bottom 70%', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
    return () => {
      float.kill();
      out.scrollTrigger?.kill();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerleave', resetTilt);
    };
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={sceneRef} aria-hidden="true" className="relative mx-auto flex min-h-[270px] w-full max-w-[620px] items-center justify-center [perspective:1000px] sm:min-h-[360px] lg:min-h-[500px]">
      <div className="pointer-events-none absolute inset-[10%] rounded-full bg-[#16A34A]/20 blur-[65px]" />
      <div ref={codeRef} className="absolute left-0 top-[17%] z-0 hidden w-[33%] rotate-[-3deg] opacity-80 sm:block"><CodePanel cursorBlink={!reducedMotion} className="w-full" /></div>
      <div ref={laptopRef} className="relative z-10 w-[88%] max-w-[570px] aspect-[1.38] will-change-transform">
        <LaptopFrame className="h-full w-full">
          <div className="relative h-full w-full">
            <div ref={wireframeRef} className="absolute inset-0 opacity-100"><UiSkeleton /></div>
            <div ref={liveRef} className="absolute inset-0 opacity-0"><UiSkeleton live /></div>
          </div>
        </LaptopFrame>
      </div>
      <div ref={phoneRef} className="absolute bottom-[8%] right-[1%] z-20 h-[34%] min-h-[108px] w-[25%] min-w-[72px] max-w-[128px] opacity-0 sm:bottom-[3%] sm:right-[1%] sm:h-[34%] sm:w-[24%] sm:max-w-[132px]">
        <PhoneFrame className="h-full w-full"><CodePanel cursorBlink={!reducedMotion} className="h-full w-full border-0 p-1.5 sm:p-2" /></PhoneFrame>
      </div>
      <div ref={shieldRef} className="absolute right-[4%] top-[12%] z-30 h-11 w-10 drop-shadow-[0_8px_16px_rgba(34,197,94,.3)] opacity-0 sm:right-[10%] sm:top-[9%] sm:h-14 sm:w-12"><ShieldBadge className="h-full w-full" /></div>
    </div>
  );
}

export function WebsiteHero({ content }: { content: WebsiteDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const lines = lineRefs.current.filter(Boolean);
    if (!section || !lines.length || reducedMotion) return;
    const eyebrow = eyebrowRef.current;
    const paragraph = paragraphRef.current;
    const trust = trustRef.current;
    const entranceTargets = [eyebrow, paragraph, trust].filter((target): target is HTMLElement => target !== null);
    const context = gsap.context(() => {
      gsap.set(entranceTargets, { opacity: 0, y: 14 });
      gsap.set(lines, { opacity: 0, y: 32, rotateX: 40, transformPerspective: 600, transformOrigin: '50% 100%' });
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top+=90', once: true } });
      if (eyebrow) timeline.to(eyebrow, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' });
      timeline
        .to(lines, { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.12, ease: 'expo.out' }, eyebrow ? '-=0.08' : 0)
        .to(lines[1], { color: '#F6FAF7', WebkitTextStrokeColor: '#16A34A', duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }, '-=0.12');
      if (paragraph) timeline.to(paragraph, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out' }, '-=0.05');
      if (trust) timeline.to(trust, { opacity: 1, y: 0, duration: 0.45, ease: 'expo.out' }, '-=0.25');
    }, section);
    return () => context.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="website-hero-title" className="website-development-hero relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-[85%] max-w-[1280px] grid-cols-1 content-center gap-y-5 pb-10 pt-28 sm:gap-y-7 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0 lg:pb-8 lg:pt-[112px]">
        <div className="order-1 flex items-center lg:col-span-7 lg:col-start-1 lg:row-start-1">
          {/* <span ref={eyebrowRef} className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#16A34A] px-4 py-2 text-sm font-semibold text-[#0B0F0D] shadow-[0_0_22px_rgba(34,197,94,.16)]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[#0B0F0D]" />{content.hero.eyebrow}
          </span> */}
        </div>
        <h1 id="website-hero-title" className="hero-display-title order-2 m-0 lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <span ref={(node) => { if (node) lineRefs.current[0] = node; }} className="block">We Turn Your Ideas</span>{' '}
          <span ref={(node) => { if (node) lineRefs.current[1] = node; }} data-outline-line className="block text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.9)', WebkitTextFillColor: 'transparent' }}>into Powerful</span>{' '}
          <span ref={(node) => { if (node) lineRefs.current[2] = node; }} className="block bg-gradient-to-r from-[#22C55E] to-[#16A34A] bg-clip-text text-transparent">Websites.</span>
        </h1>
        <div className="order-3 mx-auto w-full lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 lg:row-end-5 lg:self-center">
          <WebsiteBuildScene reducedMotion={reducedMotion} />
        </div>
        <p ref={paragraphRef} className="order-4 mt-1 max-w-[36em] text-base leading-[1.65] text-white/[0.76] sm:text-[18px] lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:mt-4 lg:text-[20px]">{content.hero.text}</p>
        <div ref={trustRef} aria-hidden="true" className="order-5 mt-1 flex items-center gap-3 sm:gap-4 lg:col-span-7 lg:col-start-1 lg:row-start-4 lg:mt-3">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#22C55E] sm:size-12"><ShieldCheck className="size-5 sm:size-6" /></span>
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#22C55E] sm:size-12"><span className="relative"><Laptop className="size-5 sm:size-6" /><Smartphone className="absolute -bottom-1 -right-2 size-3 bg-[#0B0F0D] sm:size-3.5" /></span></span>
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#22C55E] sm:size-12"><Gauge className="size-5 sm:size-6" /></span>
        </div>
      </div>
      <style jsx>{`@media (orientation: landscape) and (max-height: 500px) { .website-development-hero, .website-development-hero > div { min-height: auto; } }`}</style>
      
    </section>
  );
}
