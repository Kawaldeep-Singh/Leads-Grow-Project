'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AboutMissionVision: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardMissionRef = useRef<HTMLDivElement>(null);
  const cardVisionRef = useRef<HTMLDivElement>(null);
  const ghostMissionRef = useRef<HTMLDivElement>(null);
  const ghostVisionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;
      registerGsapPlugins();

      // 1. Entrance in 3D
      const cards = [cardMissionRef.current, cardVisionRef.current].filter(Boolean);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            rotateY: (idx) => (idx === 0 ? -20 : 20),
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Ghost words drifting in opposite horizontal directions
      if (ghostMissionRef.current) {
        gsap.to(ghostMissionRef.current, {
          x: -60,
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
      if (ghostVisionRef.current) {
        gsap.to(ghostVisionRef.current, {
          x: 60,
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

  // Mouse tilt for desktop cards (max 7deg)
  const setupTilt = (card: HTMLDivElement | null) => {
    if (!card || prefersReduced || typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(x * 12);
      yTo(-y * 12);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-mission-title"
      className="relative bg-[#0B0F0D] py-16 sm:py-24 lg:py-32 overflow-x-clip"
      style={{ perspective: '1200px' }}
    >
      {/* Background Decorative Ghost Words (aria-hidden, hidden on reduced-motion) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#16A34A]/8 blur-[140px]" />

        {!prefersReduced && (
          <>
            <div
              ref={ghostMissionRef}
              className="decorative-ghost motion-reduce:hidden hidden lg:block absolute left-4 top-12 text-[12rem] font-display font-extrabold text-transparent select-none opacity-[0.035] leading-none"
              style={{ WebkitTextStroke: '2px #22C55E' }}
            >
              Mission
            </div>
            <div
              ref={ghostVisionRef}
              className="decorative-ghost motion-reduce:hidden hidden lg:block absolute right-4 bottom-12 text-[12rem] font-display font-extrabold text-transparent select-none opacity-[0.035] leading-none"
              style={{ WebkitTextStroke: '2px #22C55E' }}
            >
              Vision
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 w-[92%] sm:w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Mission */}
          <div
            ref={(el) => {
              cardMissionRef.current = el;
              setupTilt(el);
            }}
            className="group relative rounded-3xl p-8 sm:p-10 lg:p-12 bg-[#111815]/90 border border-[#1A2420] hover:border-[#22C55E]/40 backdrop-blur-xl shadow-2xl transition-colors duration-300 flex flex-col justify-between overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card inner glow */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#16A34A]/10 blur-3xl pointer-events-none group-hover:bg-[#22C55E]/15 transition-colors"
            />

            <div>
              {/* Decorative SVG Graphic: Rising Arrow line */}
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-2xl bg-[#16A34A]/10 border border-[#22C55E]/20 flex items-center justify-center mb-6 text-[#22C55E]"
              >
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <path
                    d="M 8 32 L 28 12 M 28 12 L 14 12 M 28 12 L 28 26"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="32" r="2.5" fill="#B6F23D" />
                </svg>
              </div>

              {/* Eyebrow */}
              <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#22C55E] mb-3">
                {aboutContent.mission.eyebrow}
              </div>

              {/* H2 Title */}
              <h2
                id="about-mission-title"
                className="font-display font-extrabold text-white text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] tracking-[-0.03em] mb-5"
              >
                <span>Making Business </span>
                <span className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
                  Growth Easier.
                </span>
              </h2>

              {/* Mission Text */}
              <p className="text-base sm:text-lg text-[#9FB0A7] leading-relaxed">
                {aboutContent.mission.text}
              </p>
            </div>
          </div>

          {/* Card 2: Vision */}
          <div
            ref={(el) => {
              cardVisionRef.current = el;
              setupTilt(el);
            }}
            className="group relative rounded-3xl p-8 sm:p-10 lg:p-12 bg-[#111815]/90 border border-[#1A2420] hover:border-[#22C55E]/40 backdrop-blur-xl shadow-2xl transition-colors duration-300 flex flex-col justify-between overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card inner glow */}
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none group-hover:bg-[#22C55E]/15 transition-colors"
            />

            <div>
              {/* Decorative SVG Graphic: Expanding Rings / Orbit */}
              <div
                aria-hidden="true"
                className="w-14 h-14 rounded-2xl bg-[#16A34A]/10 border border-[#22C55E]/20 flex items-center justify-center mb-6 text-[#22C55E]"
              >
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <circle cx="20" cy="20" r="14" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="20" cy="20" r="8" fill="none" stroke="#22C55E" strokeWidth="2" />
                  <circle cx="20" cy="20" r="3" fill="#B6F23D" />
                  <ellipse cx="20" cy="20" rx="16" ry="6" fill="none" stroke="#22C55E" strokeWidth="1" transform="rotate(-30 20 20)" opacity="0.6" />
                </svg>
              </div>

              {/* Eyebrow */}
              <div className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#22C55E] mb-3">
                {aboutContent.vision.eyebrow}
              </div>

              {/* H2 Title */}
              <h2
                id="about-vision-title"
                className="font-display font-extrabold text-white text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] tracking-[-0.03em] mb-5"
              >
                <span>Building Brands </span>
                <span className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
                  Without Boundaries.
                </span>
              </h2>

              {/* Vision Text */}
              <p className="text-base sm:text-lg text-[#9FB0A7] leading-relaxed">
                {aboutContent.vision.text}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@media (prefers-reduced-motion: reduce) { .decorative-ghost { display: none !important; } }' }} />
    </section>
  );
};
