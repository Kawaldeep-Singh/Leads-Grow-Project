'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, SplitText } from '@/lib/gsap-register';
import { OrbitScene } from './OrbitScene';

export function AboutHeroV3() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineOneRef = useRef<HTMLSpanElement>(null);
  const lineTwoRef = useRef<HTMLSpanElement>(null);
  const lineThreeRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [introReady, setIntroReady] = useState(false);
  const { title, eyebrow, paragraphs } = aboutContent.hero;
  const titleWords = title.split(' ');
  const lines = [titleWords.slice(0, 3).join(' '), titleWords.slice(3, 5).join(' '), titleWords.slice(5).join(' ')];

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroReady(true);
      return;
    }
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
    try { preloaded = sessionStorage.getItem('lg-preloaded') === 'true'; } catch { /* Fall back to the preloader event. */ }
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
    const root = rootRef.current;
    const eyebrow = eyebrowRef.current;
    const rule = ruleRef.current;
    const titleElement = titleRef.current;
    const lineOne = lineOneRef.current;
    const lineTwo = lineTwoRef.current;
    const lineThree = lineThreeRef.current;
    const underline = underlineRef.current;
    const paragraph = paragraphRef.current;
    const scene = sceneRef.current;
    if (!root || !eyebrow || !rule || !titleElement || !lineOne || !lineTwo || !lineThree || !underline || !paragraph || !scene || !introReady || reducedMotion) return;

    const context = gsap.context(() => {
      const splitOne = new SplitText(lineOne, { type: 'words', mask: 'words' });
      const splitTwo = new SplitText(lineTwo, { type: 'words', mask: 'words' });
      const splitThree = new SplitText(lineThree, { type: 'words', mask: 'words' });
      const gradientWords = splitThree.words.map((word) => word.firstElementChild).filter((word): word is HTMLElement => word instanceof HTMLElement);
      gradientWords.forEach((word) => {
        word.style.backgroundImage = 'linear-gradient(90deg, #22C55E 0%, #B6F23D 100%)';
        word.style.backgroundSize = '200% 100%';
        word.style.backgroundPosition = '100% 0%';
        word.style.backgroundClip = 'text';
        word.style.webkitBackgroundClip = 'text';
        word.style.color = 'transparent';
      });
      const intro = gsap.timeline();
      intro.fromTo(eyebrow, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
      intro.fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
      const revealWords = (words: Element[], at: number) => intro.fromTo(words,
        { yPercent: 100, rotationX: 40, transformOrigin: '50% 100%', transformPerspective: 600 },
        { yPercent: 0, rotationX: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, at,
      );
      revealWords(splitOne.words, 0.3);
      revealWords(splitTwo.words, 0.42);
      revealWords(splitThree.words, 0.54);
      intro.to(lineTwo, { webkitTextFillColor: '#FFFFFF', duration: 0.2, ease: 'power1.out' }, 1.42);
      intro.to(lineTwo, { webkitTextFillColor: 'transparent', duration: 0.2, ease: 'power1.out' }, 1.62);
      intro.fromTo(gradientWords, { backgroundPosition: '100% 0%' }, { backgroundPosition: '0% 0%', duration: 0.55, ease: 'power2.out' }, 1.55);
      intro.fromTo(underline, { strokeDashoffset: 500 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 1.6);
      intro.fromTo(paragraph, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 2.0);

      const scrollOut = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
      });
      scrollOut.to(scene, { scale: 1.15, opacity: 0, ease: 'none' }, 0);
      scrollOut.to(titleElement, { yPercent: -6, ease: 'none' }, 0);

      return () => {
        splitOne.revert();
        splitTwo.revert();
        splitThree.revert();
      };
    }, root);

    return () => context.revert();
  }, { scope: rootRef, dependencies: [introReady, reducedMotion], revertOnUpdate: true });

  return (
    <section ref={rootRef} aria-labelledby="about-hero-v3-title" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B0F0D] text-white">
      <div className="relative z-10 mx-auto grid min-h-[100svh] w-[90%] max-w-[1280px] grid-cols-1 content-center gap-x-4 gap-y-4 pb-12 pt-24 sm:w-[88%] lg:min-h-[100svh] lg:w-[85%] lg:grid-cols-12 lg:gap-x-4 xl:gap-x-8 lg:gap-y-0 lg:pb-10 lg:pt-[88px]">
        <div ref={eyebrowRef} className="order-1 mb-1 flex items-center gap-3 font-mono text-[12px] tracking-[0.2em] text-[#22C55E] lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <span ref={ruleRef} className="h-px w-6 origin-left bg-[#22C55E]" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
        <h1 id="about-hero-v3-title" ref={titleRef} className="hero-display-title order-2 m-0 lg:col-span-7 lg:col-start-1 lg:row-start-2">
          <span ref={lineOneRef} className="block lg:whitespace-nowrap">{lines[0]}</span>
          <span ref={lineTwoRef} className="block text-transparent lg:whitespace-nowrap" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,.92)', WebkitTextFillColor: 'transparent' }}>{lines[1]}</span>
          <span className="relative block pb-[0.12em] lg:whitespace-nowrap">
            <span ref={lineThreeRef} className={`inline-block ${reducedMotion ? 'bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-[length:200%_100%] bg-clip-text text-transparent' : 'text-[#22C55E]'}`} style={{ backgroundPosition: '0% 0%' }}>{lines[2]}</span>
            <svg className="pointer-events-none absolute -bottom-[0.02em] left-[1.15em] h-[0.13em] w-[calc(100%-1.15em)] overflow-visible" viewBox="0 0 500 18" preserveAspectRatio="none" aria-hidden="true">
              <path ref={underlineRef} d="M2 11 C 72 4, 125 15, 194 8 S 330 13, 498 5" fill="none" stroke="#B6F23D" strokeWidth="4" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={reducedMotion ? 0 : 500} />
            </svg>
          </span>
        </h1>
        <div ref={sceneRef} className="order-3 mx-auto w-[min(280px,82vw)] lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:w-[min(600px,42vw)] lg:max-w-none">
          <OrbitScene introReady={introReady} reducedMotion={reducedMotion} />
        </div>
        <p ref={paragraphRef} className="order-4 mt-1 max-w-[36em] text-[18px] leading-[1.65] text-white/[0.72] sm:text-[20px] lg:col-span-7 lg:col-start-1 lg:row-start-3 lg:mt-7 lg:text-[21px]">
          {paragraphs[0]}
        </p>
      </div>
    </section>
  );
}
