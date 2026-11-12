'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { AboutBackground } from './AboutBackground';
import { ScrollWords } from './ScrollWords';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AboutHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const markerBarRef = useRef<HTMLSpanElement>(null);
  const ringsRef = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;
      registerGsapPlugins();

      const runIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Eyebrow wipe
        if (eyebrowRef.current) {
          tl.fromTo(
            eyebrowRef.current,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0, x: -20 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, x: 0, duration: 0.6 }
          );
        }

        // 2. H1 words reveal
        const words = h1Ref.current?.querySelectorAll('.hero-word');
        if (words && words.length > 0) {
          tl.fromTo(
            words,
            { opacity: 0, y: 35, rotateX: -70 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.06,
              duration: 0.8,
              ease: 'expo.out',
            },
            '-=0.3'
          );
        }

        // 3. Highlighter wipe & shine
        if (markerBarRef.current) {
          tl.to(
            markerBarRef.current,
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.5,
              ease: 'power3.out',
            },
            '-=0.2'
          );
        }

        // 4. Background concentric rings scale & slow rotate
        if (ringsRef.current) {
          const ringCircles = ringsRef.current.querySelectorAll('circle');
          tl.fromTo(
            ringCircles,
            { scale: 0.3, opacity: 0, transformOrigin: 'center center' },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.1,
              duration: 1.2,
              ease: 'back.out(1.4)',
            },
            '-=0.6'
          );

          // Continuous slow rotation
          gsap.to(ringsRef.current, {
            rotation: 360,
            duration: 60,
            ease: 'none',
            repeat: -1,
            transformOrigin: 'center center',
          });
        }
      };

      // Check preloader flag or event
      const isPreloaded =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('lg-preloaded') === 'true';

      if (isPreloaded) {
        runIntro();
      } else {
        const handler = () => runIntro();
        window.addEventListener('leadsgrow:preloaderComplete', handler, { once: true });
        const fallback = setTimeout(runIntro, 800);
        return () => {
          window.removeEventListener('leadsgrow:preloaderComplete', handler);
          clearTimeout(fallback);
        };
      }
    },
    { dependencies: [prefersReduced] }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-hero-title"
      className="relative min-h-[92svh] flex items-center bg-[#0B0F0D] overflow-x-clip pt-28 pb-16 sm:py-24 lg:py-32"
    >
      {/* Background with grain, grid, mouse spotlight, growth line, particles */}
      <AboutBackground withGrowthLine />

      <div className="relative z-10 w-[92%] sm:w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Eyebrow + H1 + Paragraphs */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {/* Eyebrow */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#22C55E]/30 w-fit mb-5 sm:mb-6"
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-[#22C55E]">
                {aboutContent.hero.eyebrow}
              </span>
            </div>

            {/* Exactly One H1 */}
            <h1
              id="about-hero-title"
              ref={h1Ref}
              className="font-display font-extrabold text-white text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[1.08] tracking-[-0.03em] mb-8"
              style={{ perspective: '1000px' }}
            >
              <span className="hero-word inline-block mr-[0.25em]">We</span>{' '}
              <span className="hero-word inline-block mr-[0.25em]">Don’t</span>{' '}
              <span className="hero-word inline-block mr-[0.25em]">Just</span>{' '}
              <span className="hero-word inline-block mr-[0.25em]">Build</span>{' '}
              <span className="hero-word inline-block mr-[0.25em]">Brands.</span>{' '}
              <span className="hero-word inline-block mr-[0.25em]">We</span>{' '}
              <span className="relative inline-block">
                <span
                  ref={markerBarRef}
                  aria-hidden="true"
                  className="absolute inset-0 -skew-x-6 bg-gradient-to-r from-[#16A34A]/30 to-[#22C55E]/30 rounded-lg -z-0"
                  style={{ clipPath: prefersReduced ? 'none' : 'inset(0 100% 0 0)' }}
                />
                <span className="hero-word inline-block mr-[0.25em] bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
                  Grow
                </span>{' '}
                <span className="hero-word inline-block bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
                  Businesses.
                </span>
              </span>
            </h1>

            {/* 4 Paragraphs with ScrollWords scrubbed reveal */}
            <div className="flex flex-col gap-5 sm:gap-6 max-w-3xl">
              {aboutContent.hero.paragraphs.map((p, idx) => (
                <ScrollWords
                  key={idx}
                  text={p}
                  theme="dark"
                  className={
                    idx === 0
                      ? 'text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-normal'
                      : 'text-base sm:text-lg text-white/70 leading-relaxed font-normal'
                  }
                  start="top 85%"
                  end="bottom 50%"
                />
              ))}
            </div>
          </div>

          {/* Right Column (Desktop Visual / Mobile Ambient Visual) */}
          <div
            className="lg:col-span-4 flex items-center justify-center relative select-none pointer-events-none opacity-25 lg:opacity-100"
            aria-hidden="true"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
              {/* Concentric Growth Rings SVG */}
              <svg
                ref={ringsRef}
                viewBox="0 0 400 400"
                className="w-full h-full text-[#22C55E]"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                  opacity="0.5"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="185"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.25"
                />

                {/* Rising arrow path inside rings */}
                <path
                  d="M 120 280 Q 180 200, 280 120"
                  fill="none"
                  stroke="url(#heroArrowGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <polygon
                  points="285,115 260,122 278,140"
                  fill="#B6F23D"
                />
                <defs>
                  <linearGradient id="heroArrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.2" />
                    <stop offset="70%" stopColor="#22C55E" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#B6F23D" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Glowing center orb */}
              <div className="absolute w-28 h-28 rounded-full bg-radial from-[#22C55E]/30 to-transparent blur-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
