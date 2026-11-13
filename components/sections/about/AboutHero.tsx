'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BlueprintBackground } from './BlueprintBackground';
import { GrowthBars } from './GrowthBars';
import { ScrollWords } from './ScrollWords';

const introWords = ['We', 'Don’t', 'Just', 'Build', 'Brands.', 'We'];

export const AboutHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !sectionRef.current) return;
    registerGsapPlugins();
    const words = headingRef.current?.querySelectorAll<HTMLElement>('[data-grow-word]');
    if (words?.length) {
      gsap.fromTo(words, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.72,
        stagger: 0.07,
        ease: 'back.out(1.6)',
        delay: 0.08,
      });
    }
    if (eyebrowRef.current) {
      gsap.fromTo(eyebrowRef.current, { y: 12, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
    if (highlightRef.current) {
      gsap.fromTo(highlightRef.current, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.72,
      });
    }
  }, { dependencies: [reduced], revertOnUpdate: true });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-hero-title"
      className="relative min-h-[88svh] flex items-center bg-[#F6FAF7] text-[#0B0F0D] overflow-x-clip pt-28 pb-16 sm:py-24 lg:py-28"
    >
      <BlueprintBackground />
      <div className="relative z-10 w-[90%] sm:w-[85%] max-w-[88rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <div ref={eyebrowRef} className="flex items-center gap-3 mb-6 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#15803D]">
              <span className="h-2.5 w-2.5 bg-[#16A34A]" aria-hidden="true" />
              <span>{aboutContent.hero.eyebrow}</span>
            </div>

            <h1
              id="about-hero-title"
              ref={headingRef}
              className="font-display font-extrabold text-[clamp(1.35rem,4vw,3.1rem)] leading-[1.25] sm:leading-[1.2] tracking-[-0.03em] mb-8"
            >
              {introWords.map((word, index) => (
                <React.Fragment key={word + index}>
                  <span data-grow-word className="inline-block origin-bottom">{word}</span>{' '}
                </React.Fragment>
              ))}
              <span className="relative inline-block align-baseline px-[0.08em] py-[0.015em]">
                <span ref={highlightRef} aria-hidden="true" className="absolute inset-0 -z-0 origin-bottom bg-[#16A34A]" />
                <span data-grow-word className="relative text-[#0B0F0D]">Grow</span>{' '}
                <span data-grow-word className="relative text-[#0B0F0D]">Businesses.</span>
              </span>
            </h1>

            <div className="max-w-3xl">
              <ScrollWords
                text={aboutContent.hero.paragraphs[0]}
                theme="light"
                className="text-xl sm:text-2xl leading-relaxed text-[#5B6B63] mb-7"
                start="top 75%"
                end="bottom 40%"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {aboutContent.hero.paragraphs.slice(1).map((paragraph) => (
                  <ScrollWords
                    key={paragraph}
                    text={paragraph}
                    theme="light"
                    className="text-base sm:text-lg leading-relaxed text-[#5B6B63]"
                    start="top 75%"
                    end="bottom 40%"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end" aria-hidden="true">
            <GrowthBars />
          </div>
        </div>
      </div>
    </section>
  );
};
