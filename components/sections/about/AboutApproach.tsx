'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap, ScrollTrigger } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ScrollWords } from './ScrollWords';

const desktopHeights = [220, 255, 290, 325, 365];

export const AboutApproach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const desktopStageRef = useRef<HTMLDivElement>(null);
  const desktopCardsRef = useRef<HTMLElement[]>([]);
  const markerRef = useRef<HTMLDivElement>(null);
  const baselineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLElement[]>([]);
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(() => {
    if (reduced || !sectionRef.current) return;
    registerGsapPlugins();
    const media = gsap.matchMedia();

    media.add('(min-width: 1024px)', () => {
      const cards = desktopCardsRef.current.filter(Boolean);
      const track = desktopTrackRef.current;
      const stage = desktopStageRef.current;
      if (!track || !stage || !cards.length) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(4, Math.floor(self.progress * 5));
            setActiveStep((current) => current === step ? current : step);
            const width = stage.clientWidth - 110;
            const height = stage.clientHeight * 0.42;
            if (markerRef.current) gsap.set(markerRef.current, {
              x: width * self.progress,
              y: -height * self.progress,
            });
            if (baselineRef.current) gsap.set(baselineRef.current, { scaleX: self.progress });
          },
        },
      });
      gsap.fromTo(cards[0], { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.65,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: track, start: 'top 75%', once: true },
      });
      const firstCopy = cards[0].querySelectorAll<HTMLElement>('[data-step-copy]');
      gsap.fromTo(firstCopy, { y: 18, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: track, start: 'top 75%', once: true },
      });
      cards.slice(1).forEach((card, offset) => {
        const index = offset + 1;
        timeline.fromTo(card, { scaleY: 0, transformOrigin: '50% 100%' }, {
          scaleY: 1,
          duration: 0.18,
          ease: 'none',
        }, (index - 1) * 0.23);
        const words = card.querySelectorAll<HTMLElement>('[data-step-copy]');
        timeline.fromTo(words, { yPercent: 35, opacity: 0 }, {
          yPercent: 0,
          opacity: 1,
          duration: 0.12,
          stagger: 0.012,
          ease: 'power2.out',
        }, (index - 1) * 0.23 + 0.08);
      });
    });

    media.add('(max-width: 1023px)', () => {
      if (mobileLineRef.current) {
        gsap.fromTo(mobileLineRef.current, { scaleY: 0 }, {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: mobileLineRef.current.parentElement,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
      mobileCardsRef.current.filter(Boolean).forEach((card, index) => {
        gsap.fromTo(card, { scaleY: 0.82, y: 24, opacity: 0 }, {
          scaleY: 1,
          y: 0,
          opacity: 1,
          transformOrigin: '50% 100%',
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 83%', once: true },
          onStart: () => setActiveStep((current) => current === index ? current : index),
        });
      });
    });

    return () => media.revert();
  }, { dependencies: [reduced], revertOnUpdate: true });

  const emphasis = (title: string) => {
    const [first, last] = title.split(' to ');
    return <>{first} to <span className="text-[#16A34A]">{last}</span></>;
  };

  return (
    <section ref={sectionRef} aria-labelledby="about-approach-title" className="relative overflow-x-clip bg-[#F6FAF7] py-24 text-[#0B0F0D] sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[34rem] w-[34rem] rounded-full bg-[#16A34A]/[0.06] blur-[120px]" />
      <div className="relative z-10 mx-auto w-[90%] max-w-[88rem]">
        <div className="mb-12 max-w-3xl sm:mb-16 lg:sticky lg:top-24 lg:z-20 lg:mb-0 lg:bg-[#F6FAF7] lg:pb-5">
          <p className="mb-5 font-mono text-xs font-semibold tracking-[0.16em] text-[#15803D]">{aboutContent.approach.eyebrow}</p>
          <h2 id="about-approach-title" className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
            {emphasis(aboutContent.approach.title)}
          </h2>
          <p className="mt-5 text-base text-[#5B6B63] sm:text-lg">{aboutContent.approach.intro}</p>
        </div>

        <div ref={desktopTrackRef} className="approach-track hidden lg:block" style={{ minHeight: 'calc(100svh + 280svh)' }}>
          <div ref={desktopStageRef} className="sticky top-[280px] flex h-[calc(100svh-300px)] items-end overflow-hidden pb-[4svh]">
            <div className="absolute bottom-[4svh] left-0 right-0 h-px bg-[#0B0F0D]/20">
              <div ref={baselineRef} className="h-full w-full origin-left scale-x-0 bg-[#16A34A]" />
              {aboutContent.approach.steps.map((step, index) => (
                <span key={step.number} className="absolute -top-1 h-2 w-px bg-[#0B0F0D]/40" style={{ left: `${8 + index * 21}%` }} />
              ))}
            </div>
            <div className="absolute bottom-[calc(4svh-18px)] left-0 right-0 h-0">
              <div ref={markerRef} aria-hidden="true" className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-[#16A34A]">
                <svg viewBox="0 0 28 28" className="h-8 w-8 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20 20 5M9 5h11v11" /></svg>
              </div>
            </div>

            <div className="grid w-full grid-cols-5 items-end gap-3 xl:gap-5">
              {aboutContent.approach.steps.map((step, index) => (
                <article
                  key={step.number}
                  ref={(node) => { if (node) desktopCardsRef.current[index] = node; }}
                  aria-labelledby={`approach-desktop-${step.number}`}
                  className={`relative flex min-w-0 origin-bottom flex-col justify-end border-t-2 p-4 pb-5 xl:p-5 ${activeStep === index ? 'border-[#16A34A] bg-white shadow-[0_14px_42px_rgba(11,15,13,0.1)]' : 'border-[#0B0F0D]/15 bg-white/75'}`}
                  style={{ height: `${desktopHeights[index]}px` }}
                >
                  <span data-step-copy className="mb-auto font-display text-5xl font-extrabold leading-none tracking-[-0.06em] text-[#16A34A]/35 xl:text-6xl">{step.number}</span>
                  <h3 id={`approach-desktop-${step.number}`} data-step-copy className="mb-2 font-display text-lg font-extrabold leading-tight tracking-tight text-[#0B0F0D] xl:text-xl">{step.title}</h3>
                  <p data-step-copy className="text-xs leading-relaxed text-[#5B6B63] xl:text-sm">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="relative lg:hidden">
          <div aria-hidden="true" className="absolute bottom-0 left-[17px] top-0 w-px bg-[#0B0F0D]/15">
            <div ref={mobileLineRef} className="h-full w-full origin-top bg-[#16A34A]" />
          </div>
          <div className="flex flex-col gap-5 pl-12 sm:gap-7 sm:pl-16">
            {aboutContent.approach.steps.map((step, index) => (
              <article
                key={step.number}
                ref={(node) => { if (node) mobileCardsRef.current[index] = node; }}
                aria-labelledby={`approach-mobile-${step.number}`}
                className={`relative origin-bottom rounded-2xl border border-black/5 bg-white p-5 shadow-[0_8px_28px_rgba(11,15,13,0.07)] sm:p-7 ${activeStep === index ? 'border-[#16A34A]/40' : ''}`}
              >
                <span aria-hidden="true" className="absolute -left-[43px] top-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#16A34A] bg-[#F6FAF7] font-mono text-xs font-bold text-[#15803D] sm:-left-[57px]">{step.number}</span>
                <h3 id={`approach-mobile-${step.number}`} className="font-display text-xl font-extrabold text-[#0B0F0D]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5B6B63]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
