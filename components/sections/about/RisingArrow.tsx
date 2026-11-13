'use client';

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';

export function RisingArrow({ reducedMotion }: { reducedMotion: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPolygonElement>(null);
  const revealRef = useRef<SVGLinearGradientElement>(null);
  const fillRef = useRef<SVGLinearGradientElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);
  const startRef = useRef<() => void>(() => {});
  const startedRef = useRef(false);
  const idleRef = useRef<gsap.core.Tween | null>(null);
  const shimmerRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    registerGsapPlugins();
    const arrow = arrowRef.current;
    const reveal = revealRef.current;
    const wrap = wrapRef.current;
    if (!arrow || !reveal || !wrap || !fillRef.current) return;
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(arrow, { attr: { 'mask': 'url(#arrow-reveal-done)' } });
      return;
    }

    const stops = reveal.querySelectorAll('stop');
    const intro = gsap.timeline({ paused: true });
    intro.fromTo(stops[1], { attr: { offset: '7%' } }, { attr: { offset: '88%' }, duration: 1.8, ease: 'power3.inOut' }, 0)
        .fromTo(stops[2], { attr: { offset: '13%' } }, { attr: { offset: '100%' }, duration: 1.8, ease: 'power3.inOut' }, 0)
        .fromTo(arrow, { x: -8 }, { x: 0, duration: 1.8, ease: 'power3.inOut' }, 0)
        .fromTo(sparkRef.current, { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1.1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 1.8)
        .to(sparkRef.current, { scale: 0, opacity: 0, duration: 0.45, ease: 'power2.in' }, 2.25);
    idleRef.current = gsap.to(arrow, { x: -7, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.8, paused: true });
    shimmerRef.current = gsap.to(fillRef.current, { attr: { gradientTransform: 'translate(100 0)' }, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 8, delay: 2.7, paused: true });
    gsap.to(arrow, { opacity: 0.6, yPercent: -8, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: true } });
    startRef.current = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      intro.play(0);
      idleRef.current?.play();
      shimmerRef.current?.play();
    };
  }, { dependencies: [reducedMotion], scope: wrapRef, revertOnUpdate: true });

  useEffect(() => {
    const start = () => startRef.current();
    const timer = window.setTimeout(start, 600);
    if (window.sessionStorage.getItem('lg-preloaded')) start();
    else window.addEventListener('leadsgrow:preloaderComplete', start, { once: true });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (startedRef.current) { idleRef.current?.play(); shimmerRef.current?.play(); }
      } else {
        idleRef.current?.pause(); shimmerRef.current?.pause();
      }
    });
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('leadsgrow:preloaderComplete', start);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none relative flex h-[160px] w-full items-center justify-end overflow-visible sm:h-[280px] lg:h-[min(64vh,590px)]" aria-hidden="true">
      <svg className="h-[38%] w-[150%] max-w-none origin-center rotate-[-50deg] sm:h-[34%] lg:h-[30%]" viewBox="0 -12 100 24" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="rising-arrow-fill" ref={fillRef} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803D" /><stop offset="55%" stopColor="#22C55E" /><stop offset="100%" stopColor="#B6F23D" />
          </linearGradient>
          <linearGradient id="rising-arrow-reveal-gradient" ref={revealRef} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" /><stop offset="7%" stopColor="white" /><stop offset="13%" stopColor="black" /><stop offset="100%" stopColor="black" />
          </linearGradient>
          <filter id="rising-arrow-glow" x="-20%" y="-80%" width="140%" height="260%"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22C55E" floodOpacity="0.30" /></filter>
          <filter id="rising-arrow-spark-glow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#B6F23D" floodOpacity="0.55" /></filter>
          <mask id="arrow-reveal"><rect x="0" y="-12" width="100" height="24" fill="url(#rising-arrow-reveal-gradient)" /></mask>
          <mask id="arrow-reveal-done"><rect x="0" y="-12" width="100" height="24" fill="white" /></mask>
        </defs>
        <polygon ref={arrowRef} points="100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5" fill="url(#rising-arrow-fill)" filter="url(#rising-arrow-glow)" mask="url(#arrow-reveal)" />
        <path ref={sparkRef} d="M100,-5 L101.4,-1.4 L105,0 L101.4,1.4 L100,5 L98.6,1.4 L95,0 L98.6,-1.4 Z" fill="white" filter="url(#rising-arrow-spark-glow)" opacity="0" />
      </svg>
    </div>
  );
}
