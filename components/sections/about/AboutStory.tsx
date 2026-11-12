'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { ScrollWords } from './ScrollWords';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AboutStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;
      registerGsapPlugins();

      // 1. Vertical progress line scaleY and traveling glowing dot
      if (lineRef.current && dotRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        gsap.fromTo(
          dotRef.current,
          { top: '0%' },
          {
            top: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. Parallax ghost word "Story"
      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    },
    { dependencies: [prefersReduced] }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-story-title"
      className="relative bg-[#F6FAF7] text-[#0B0F0D] py-8 sm:py-12 lg:py-16 overflow-x-clip"
    >
      {/* Light Theme Background Decorative Elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        {/* Soft green blurred orb */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-[#16A34A]/8 blur-[120px]" />
        <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] rounded-full bg-[#22C55E]/6 blur-[100px]" />

        {/* Faint dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#16A34A 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Huge outline ghost word "Story" (aria-hidden, hidden on reduced-motion) */}
        {!prefersReduced && (
          <div
            ref={ghostRef}
            className="decorative-ghost motion-reduce:hidden hidden lg:block absolute right-4 top-16 text-[15rem] font-display font-extrabold text-transparent select-none opacity-[0.04] leading-none"
            style={{
              WebkitTextStroke: '2px #16A34A',
            }}
          >
            Story
          </div>
        )}
      </div>

      <div className="relative z-10 w-[92%] sm:w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Eyebrow + Sticky H2 on desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#16A34A]">
                {aboutContent.story.eyebrow}
              </span>
            </div>

            {/* H2 Title */}
            <h2
              id="about-story-title"
              className="font-display font-extrabold text-[#0B0F0D] text-[clamp(1.75rem,4.2vw,3.2rem)] leading-[1.12] tracking-[-0.03em]"
            >
              <span>Every Brand Has a Story. </span>
              <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
                We Help It Grow.
              </span>
            </h2>
          </div>

          {/* Right Column: Paragraphs with Progress Line */}
          <div className="lg:col-span-7 relative flex items-stretch gap-6 sm:gap-8">
            {/* Vertical Progress Line */}
            <div
              className="relative w-1 shrink-0 bg-gray-200/80 rounded-full overflow-visible"
              aria-hidden="true"
            >
              <div
                ref={lineRef}
                className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] rounded-full origin-top"
                style={{
                  transform: prefersReduced ? 'none' : 'scaleY(0)',
                }}
              />
              {!prefersReduced && (
                <div
                  ref={dotRef}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.8)] border-2 border-white"
                />
              )}
            </div>

            {/* 3 Story Paragraphs */}
            <div className="flex flex-col gap-6 sm:gap-8 py-2">
              <ScrollWords
                text={aboutContent.story.paragraphs[0]}
                theme="light"
                className="text-base sm:text-lg text-[#0B0F0D] leading-relaxed font-normal"
                start="top 85%"
                end="bottom 55%"
              />

              <ScrollWords
                text={aboutContent.story.paragraphs[1]}
                theme="light"
                className="text-base sm:text-lg text-[#0B0F0D] leading-relaxed font-normal"
                start="top 85%"
                end="bottom 55%"
              />

              <ScrollWords
                text={aboutContent.story.paragraphs[2]}
                theme="light"
                className="text-lg sm:text-xl font-medium text-[#0B0F0D] leading-relaxed"
                start="top 85%"
                end="bottom 55%"
                underlineLast
              />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@media (prefers-reduced-motion: reduce) { .decorative-ghost { display: none !important; } }' }} />
    </section>
  );
};
