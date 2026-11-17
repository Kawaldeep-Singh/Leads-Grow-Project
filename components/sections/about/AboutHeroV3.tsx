'use client';

import { useId, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, SplitText } from '@/lib/gsap-register';

export function AboutHeroV3() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const eyebrowRuleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const secondLineRef = useRef<HTMLSpanElement>(null);
  const gradientWordRef = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const arrowContainerRef = useRef<HTMLDivElement>(null);
  const arrowMaskRef = useRef<SVGRectElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const reactId = useId();
  const arrowId = `about-growth-${reactId.replace(/:/g, '')}`;

  const { title, eyebrow, paragraphs } = aboutContent.hero;
  const growthPhraseStart = title.lastIndexOf('We Grow ');
  const firstLine = title.slice(0, growthPhraseStart).trimEnd();
  const secondLine = title.slice(growthPhraseStart);
  const growthWord = 'Businesses.';
  const secondLinePrefix = secondLine.slice(0, secondLine.length - growthWord.length);

  useGSAP(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    if (!root || reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let started = false;
    let startTimer: number | undefined;
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;

    const onPreloaderComplete = () => startAnimations();
    const startAnimations = () => {
      if (started) return;
      started = true;
      window.removeEventListener('leadsgrow:preloaderComplete', onPreloaderComplete);
      if (startTimer !== undefined) window.clearTimeout(startTimer);

      const eyebrow = eyebrowRef.current;
      const eyebrowRule = eyebrowRuleRef.current;
      const titleElement = titleRef.current;
      const firstLineElement = firstLineRef.current;
      const secondLineElement = secondLineRef.current;
      const gradientWord = gradientWordRef.current;
      const paragraph = paragraphRef.current;
      const arrow = arrowContainerRef.current;
      const maskRect = arrowMaskRef.current;
      const spark = sparkRef.current;
      const content = contentRef.current;
      if (!eyebrow || !eyebrowRule || !titleElement || !firstLineElement || !secondLineElement || !gradientWord || !paragraph || !arrow || !maskRect || !spark || !content) return;

      context = gsap.context(() => {
        const firstSplit = new SplitText(firstLineElement, { type: 'words', mask: 'words' });
        const secondSplit = new SplitText(secondLineElement, { type: 'words', mask: 'words' });
        const titleWords = [...firstSplit.words, ...secondSplit.words];
        maskRect.setAttribute('width', '0');

        gsap.fromTo(eyebrow, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(eyebrowRule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(titleWords, { yPercent: 100 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', delay: 0.1 });
        gsap.fromTo(gradientWord, { opacity: 0.82 }, { opacity: 1, duration: 0.5, ease: 'power1.out', delay: 0.95 });
        gsap.fromTo(paragraph, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.8 });

        const reveal = { width: 0 };
        gsap.to(reveal, {
          width: 106,
          duration: 1.8,
          ease: 'power3.inOut',
          onUpdate: () => maskRect.setAttribute('width', String(reveal.width)),
          onComplete: () => gsap.fromTo(spark, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(3)', onComplete: () => gsap.to(spark, { opacity: 0, duration: 0.5, delay: 0.55, ease: 'power1.out' }) }),
        });

        const drift = gsap.to(arrow, { y: '+=6', duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) drift.play();
          else drift.pause();
        }, { threshold: 0.01 });
        observer.observe(arrow);

        gsap.to(content, {
          yPercent: -6,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        });

        return () => {
          firstSplit.revert();
          secondSplit.revert();
        };
      }, root);
    };

    let alreadyPreloaded = false;
    try {
      alreadyPreloaded = sessionStorage.getItem('lg-preloaded') === 'true';
    } catch {
      // Restricted storage falls back to the preloader event or short timeout.
    }
    if (alreadyPreloaded) startAnimations();
    else {
      window.addEventListener('leadsgrow:preloaderComplete', onPreloaderComplete, { once: true });
      startTimer = window.setTimeout(startAnimations, 600);
    }

    return () => {
      window.removeEventListener('leadsgrow:preloaderComplete', onPreloaderComplete);
      if (startTimer !== undefined) window.clearTimeout(startTimer);
      observer?.disconnect();
      context?.revert();
    };
  }, { scope: rootRef, dependencies: [reduced], revertOnUpdate: true });

  return (
    <section ref={rootRef} aria-labelledby="about-hero-v3-title" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
      <div ref={contentRef} className="relative z-10 mx-auto flex min-h-[100svh] w-[90%] max-w-[1200px] flex-col justify-center pb-12 pt-[clamp(14rem,30vh,17rem)] sm:w-[88%] lg:w-[85%] lg:pt-[88px] lg:pb-10">
        <div className="relative z-10 max-w-[52rem] lg:w-full lg:max-w-none">
          <div ref={eyebrowRef} className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-[#22C55E] sm:text-[12px]">
            <span ref={eyebrowRuleRef} className="h-px w-6 origin-left bg-[#22C55E]" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
          <h1 id="about-hero-v3-title" ref={titleRef} className="font-display text-[clamp(2.1rem,9.5vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em] lg:text-[clamp(2.8rem,5.8vw,5.5rem)] lg:leading-none">
            <span ref={firstLineRef} className="block lg:whitespace-nowrap">{firstLine}</span>
            <span ref={secondLineRef} className="mt-[0.08em] block text-[#22C55E] lg:whitespace-nowrap">
              {secondLinePrefix}<span ref={gradientWordRef} className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">{growthWord}</span>
            </span>
          </h1>
          <p ref={paragraphRef} className="mt-7 max-w-[40em] text-[18px] leading-[1.65] text-white/[0.72] sm:text-[20px] lg:text-[22px]">
            {paragraphs[0]}
          </p>
        </div>
      </div>

      <div ref={arrowContainerRef} aria-hidden="true" className="pointer-events-none absolute right-10 top-28 z-0 w-[11rem] origin-center sm:right-12 sm:top-24 sm:w-[12rem] lg:right-[-1rem] lg:top-[-4rem] lg:w-[min(48vw,42rem)]">
        <svg viewBox="0 -12 106 24" className="h-auto w-full rotate-[-50deg] overflow-visible drop-shadow-[0_0_22px_rgba(34,197,94,0.18)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${arrowId}-fill`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="58%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#B6F23D" />
            </linearGradient>
            <filter id={`${arrowId}-soft`} x="-10%" y="-100%" width="120%" height="300%">
              <feGaussianBlur stdDeviation="1.3" />
            </filter>
            <mask id={`${arrowId}-mask`} maskUnits="userSpaceOnUse" x="0" y="-12" width="106" height="24">
              <rect ref={arrowMaskRef} x="0" y="-12" width="106" height="24" fill="white" filter={`url(#${arrowId}-soft)`} />
            </mask>
          </defs>
          <polygon
            points="0,0 80,-11.5 80,-5.4 100,0 80,5.4 80,11.5"
            fill={`url(#${arrowId}-fill)`}
            mask={`url(#${arrowId}-mask)`}
          />
          <path ref={sparkRef} d="M100,-4.5 101.7,-1.7 104.5,0 101.7,1.7 100,4.5 98.3,1.7 95.5,0 98.3,-1.7Z" fill="#F4FFD6" opacity="0" transform-box="fill-box" transform-origin="center" />
        </svg>
      </div>
    </section>
  );
}
