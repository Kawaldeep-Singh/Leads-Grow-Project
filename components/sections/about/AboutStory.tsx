'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ScrollWords } from './ScrollWords';

export const AboutStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stemRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLDivElement[]>([]);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !sectionRef.current) return;
    registerGsapPlugins();
    const words = headingRef.current?.querySelectorAll<HTMLElement>('[data-story-word]');
    if (words?.length) {
      gsap.fromTo(words, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.58,
        stagger: 0.05,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: headingRef.current, start: 'top 76%', once: true },
      });
    }
    if (stemRef.current) {
      gsap.fromTo(stemRef.current, { scaleY: 0 }, {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: paragraphRefs.current[0],
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }
    paragraphRefs.current.forEach((paragraph) => {
      const node = paragraph.querySelector<HTMLElement>('[data-story-node]');
      if (node) {
        gsap.fromTo(node, { scale: 0, opacity: 0 }, {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: paragraph, start: 'top 70%', once: true },
        });
      }
    });
  }, { dependencies: [reduced], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-labelledby="about-story-title" className="relative overflow-x-clip bg-[#0B0F0D] py-24 text-white sm:py-28 lg:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-52 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#16A34A]/10 blur-[130px]" />
        <svg className="absolute -right-10 top-0 h-full w-[55%] opacity-[0.045]" viewBox="0 0 700 900" preserveAspectRatio="none">
          <g fill="none" stroke="#9FB0A7" strokeWidth="1.2">
            <path d="M370-40c-170 130-170 250 0 360s170 230 0 360-170 250 0 360" />
            <path d="M420-40c-170 130-170 250 0 360s170 230 0 360-170 250 0 360" />
            <path d="M470-40c-170 130-170 250 0 360s170 230 0 360-170 250 0 360" />
            <path d="M520-40c-170 130-170 250 0 360s170 230 0 360-170 250 0 360" />
            <path d="M570-40c-170 130-170 250 0 360s170 230 0 360-170 250 0 360" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid w-[90%] max-w-[88rem] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <p className="mb-6 font-mono text-xs font-semibold tracking-[0.16em] text-[#22C55E]">{aboutContent.story.eyebrow}</p>
          <h2 ref={headingRef} id="about-story-title" className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
            <span data-story-word className="inline-block">Every</span>{' '}
            <span data-story-word className="inline-block">Brand</span>{' '}
            <span data-story-word className="inline-block">Has</span>{' '}
            <span data-story-word className="inline-block">a</span>{' '}
            <span data-story-word className="inline-block">Story.</span>{' '}
            <span data-story-word className="inline-block text-[#22C55E]">We</span>{' '}
            <span data-story-word className="inline-block text-[#22C55E]">Help</span>{' '}
            <span data-story-word className="inline-block text-[#22C55E]">It</span>{' '}
            <span data-story-word className="inline-block text-[#22C55E]">Grow.</span>
          </h2>
        </div>

        <div className="relative flex gap-6 sm:gap-8 lg:col-span-7">
          <div aria-hidden="true" className="absolute bottom-0 left-[11px] top-2 w-px bg-white/15 sm:left-[15px]">
            <div ref={stemRef} className="h-full w-full origin-top bg-gradient-to-b from-[#22C55E] to-[#16A34A]" />
          </div>
          <div className="relative flex w-full flex-col gap-10 pl-9 sm:gap-12 sm:pl-12">
            {aboutContent.story.paragraphs.map((paragraph, index) => (
              <div key={paragraph} ref={(node) => { if (node) paragraphRefs.current[index] = node; }} className="relative">
                <span data-story-node aria-hidden="true" className="absolute -left-[34px] top-[0.55em] h-3 w-3 rounded-full border-2 border-[#22C55E] bg-[#0B0F0D] shadow-[0_0_0_4px_rgba(34,197,94,0.12)] sm:-left-[44px]" />
                <ScrollWords
                  text={paragraph}
                  theme="dark"
                  start="top 75%"
                  end="bottom 45%"
                  className={index === 2
                    ? 'text-xl font-medium leading-relaxed text-white sm:text-2xl'
                    : 'text-base leading-relaxed text-[#9FB0A7] sm:text-lg'}
                  underlineLast={index === 2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
