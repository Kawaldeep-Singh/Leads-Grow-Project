'use client';

import { useRef } from 'react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { useGSAP } from '@gsap/react';
import { RisingArrow } from './RisingArrow';

const titleLines = [['We', 'Don’t', 'Just'], ['Build', 'Brands.', 'We'], ['Grow', 'Businesses.']];

export function AboutHeroV2() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const eyebrowRuleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greenWordsRef = useRef<HTMLSpanElement>(null);
  const titleRuleRef = useRef<HTMLSpanElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = titleRef.current?.querySelectorAll<HTMLElement>('[data-hero-word]');
    const paragraphs = supportingRef.current?.querySelectorAll<HTMLElement>('[data-support-copy]');
    const rules = supportingRef.current?.querySelectorAll<HTMLElement>('[data-support-rule]');
    const timeline = gsap.timeline();
    if (eyebrowRef.current) timeline.fromTo(eyebrowRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
    if (eyebrowRuleRef.current) timeline.fromTo(eyebrowRuleRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 0);
    if (words?.length) timeline.fromTo(words, { yPercent: 100 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.1);
    if (greenWordsRef.current) timeline.fromTo(greenWordsRef.current, { color: '#0B0F0D' }, { color: '#16A34A', duration: 0.4 }, 0.95);
    if (titleRuleRef.current) timeline.fromTo(titleRuleRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 1.05);
    if (leadRef.current) timeline.fromTo(leadRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.7);
    if (rules?.length) timeline.fromTo(rules, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 1.2);
    if (paragraphs?.length) timeline.fromTo(paragraphs, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 1.55);
  }, { scope: rootRef, dependencies: [reduced], revertOnUpdate: true });

  const paragraphs = aboutContent.hero.paragraphs;

  return (
    <section ref={rootRef} aria-labelledby="about-hero-v2-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF_72%,#F6FAF7_100%)] text-[#0B0F0D]">
      <div className="mx-auto w-[90%] max-w-[1200px] pt-28 pb-14 sm:w-[88%] lg:min-h-[100svh] lg:pt-20 lg:pb-12">
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12 sm:gap-5 lg:min-h-[calc(100svh-250px)] lg:gap-0">
          <div className="sm:col-span-8 lg:col-span-7">
            <div ref={eyebrowRef} className="mb-5 flex items-center gap-3 font-mono text-[12px] tracking-[0.18em] text-[#15803D]">
              <span ref={eyebrowRuleRef} className="h-px w-6 bg-[#16A34A]" aria-hidden="true" />
              <span>{aboutContent.hero.eyebrow}</span>
            </div>
            <h1 id="about-hero-v2-title" ref={titleRef} className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
              {titleLines.map((line, lineIndex) => <span key={`line-${lineIndex}`} ref={lineIndex === 2 ? greenWordsRef : undefined} className={`lg:block ${lineIndex === 2 ? 'text-[#16A34A]' : ''}`}>{line.map((word, wordIndex) => <span key={`${word}-${wordIndex}`}><span className="inline-block overflow-hidden align-bottom"><span data-hero-word className="inline-block">{word}</span></span>{wordIndex < line.length - 1 ? ' ' : ''}</span>)}{lineIndex < titleLines.length - 1 ? ' ' : ''}</span>)}
            </h1>
            <span ref={titleRuleRef} className="mt-6 block h-[3px] w-[72px] bg-[#16A34A]" aria-hidden="true" />
          </div>
          <div className="order-2 -mt-1 sm:order-none sm:col-span-4 sm:col-start-9 sm:row-start-1 sm:row-span-2 sm:mt-0 lg:col-span-5 lg:col-start-8">
            <RisingArrow reducedMotion={reduced} />
          </div>
          <p ref={leadRef} className="order-3 max-w-[34em] text-[20px] leading-[1.6] text-[#5B6B63] sm:col-span-8 sm:col-start-1 lg:col-span-7 lg:row-start-2 lg:mt-6 lg:text-[22px]">{paragraphs[0]}</p>
        </div>
        <div ref={supportingRef} className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-8">
          {paragraphs.slice(1).map((paragraph) => (
            <div key={paragraph}>
              <span data-support-rule className="mb-4 block h-px w-full origin-left bg-[#0B0F0D]/[0.12]" aria-hidden="true" />
              <p data-support-copy className="text-[15px] leading-[1.7] text-[#5B6B63]">{paragraph}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
