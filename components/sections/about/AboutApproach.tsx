'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap, ScrollTrigger } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AboutApproach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;
      registerGsapPlugins();

      // 1. Center / Left Timeline draw
      if (lineRef.current && dotRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'bottom 80%',
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
              start: 'top 65%',
              end: 'bottom 80%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 2. Parallax ghost word "Approach"
      if (ghostRef.current) {
        gsap.to(ghostRef.current, {
          y: 70,
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

      // 3. Step cards reveal and active step calculation via single ScrollTrigger
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length > 0) {
        validCards.forEach((card, idx) => {
          const isEven = idx % 2 === 0;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: isEven ? -40 : 40,
              rotateY: isEven ? -10 : 10,
            },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // Single ScrollTrigger to compute active step nearest to viewport center
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          onUpdate: () => {
            const viewportCenter = window.innerHeight / 2;
            let closestIdx = 0;
            let minDistance = Infinity;

            validCards.forEach((card, i) => {
              const rect = card.getBoundingClientRect();
              const cardCenter = rect.top + rect.height / 2;
              const distance = Math.abs(viewportCenter - cardCenter);
              if (distance < minDistance) {
                minDistance = distance;
                closestIdx = i;
              }
            });

            validCards.forEach((card, i) => {
              if (i === closestIdx) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1.02)';
                card.style.boxShadow = '0 10px 30px rgba(34,197,94,0.15)';
              } else {
                card.style.opacity = '0.55';
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
              }
            });
          },
        });
      }
    },
    { dependencies: [prefersReduced] }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-approach-title"
      className="relative bg-[#FFFFFF] text-[#0B0F0D] py-8 sm:py-12 lg:py-16 overflow-x-clip"
    >
      {/* Decorative Light Theme Background (aria-hidden, hidden on reduced-motion) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#16A34A]/8 blur-[130px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-[#22C55E]/6 blur-[110px]" />

        {/* Faint Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #16A34A 1px, transparent 1px), linear-gradient(to bottom, #16A34A 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ghost Outline Word "Approach" */}
        {!prefersReduced && (
          <div
            ref={ghostRef}
            className="decorative-ghost motion-reduce:hidden hidden lg:block absolute left-8 top-20 text-[13rem] font-display font-extrabold text-transparent select-none opacity-[0.035] leading-none"
            style={{ WebkitTextStroke: '2px #16A34A' }}
          >
            Approach
          </div>
        )}
      </div>

      <div className="relative z-10 w-[92%] sm:w-[85%] max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 w-fit mb-4">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#16A34A]">
              {aboutContent.approach.eyebrow}
            </span>
          </div>

          <h2
            id="about-approach-title"
            className="font-display font-extrabold text-[#0B0F0D] text-[clamp(1.75rem,4.2vw,3.2rem)] leading-[1.12] tracking-[-0.03em] mb-4"
          >
            <span>From Strategy to </span>
            <span className="bg-gradient-to-r from-[#16A34A] to-[#22C55E] bg-clip-text text-transparent">
              Success.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B63] leading-relaxed">
            {aboutContent.approach.intro}
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Vertical Track Line (Centered on desktop, left on mobile) */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-8 w-1 bg-gray-200/80 rounded-full left-[18px] lg:left-1/2 lg:-translate-x-1/2"
          >
            <div
              ref={lineRef}
              className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-[#16A34A] to-[#22C55E] rounded-full origin-top"
              style={{ transform: prefersReduced ? 'none' : 'scaleY(0)' }}
            />
            {!prefersReduced && (
              <div
                ref={dotRef}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.9)] border-2 border-white"
              />
            )}
            {/* Arrowhead at Step 05 */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[#16A34A]">
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
                <path d="M8 14L2 6h12L8 14z" />
              </svg>
            </div>
          </div>

          {/* 5 Step Cards */}
          <div className="flex flex-col gap-10 sm:gap-14 lg:gap-20">
            {aboutContent.approach.steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={step.number}
                  className={`relative flex items-center ${
                    isEven
                      ? 'lg:flex-row'
                      : 'lg:flex-row-reverse'
                  } pl-12 lg:pl-0`}
                >
                  {/* Step Node Icon on Line */}
                  <div
                    className="absolute left-[18px] lg:left-1/2 -translate-x-1/2 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-white border-2 border-[#16A34A] shadow-[0_0_12px_rgba(22,163,74,0.3)] flex items-center justify-center font-mono font-bold text-xs lg:text-sm text-[#16A34A] z-20"
                  >
                    {step.number}
                  </div>

                  {/* Step Card Content */}
                  <div
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    className={`w-full lg:w-[45%] transition-all duration-400 p-6 sm:p-8 rounded-3xl bg-white/90 border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-[#16A34A]/40 ${
                      isEven ? 'lg:mr-auto lg:text-right' : 'lg:ml-auto lg:text-left'
                    }`}
                  >
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#0B0F0D] tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5B6B63] leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@media (prefers-reduced-motion: reduce) { .decorative-ghost { display: none !important; } }' }} />
    </section>
  );
};
