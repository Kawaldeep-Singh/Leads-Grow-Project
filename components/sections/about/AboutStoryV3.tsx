'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { StackCard, type CardTheme } from './story-v3/StackCard';
import { OneRoofArt, type OneRoofArtHandle } from './story-v3/OneRoofArt';
import { ThreeForcesArt, type ThreeForcesArtHandle } from './story-v3/ThreeForcesArt';
import { SeedToSkylineArt, type SeedToSkylineArtHandle } from './story-v3/SeedToSkylineArt';

// 3 Color-blocked Themes
const CARD_THEMES: CardTheme[] = [
  {
    bg: '#0B0F0D', // Ink
    text: '#FFFFFF', // White
    accent: '#16A34A', // Brand green
    dotColor: '#16A34A',
  },
  {
    bg: '#16A34A', // Brand Green
    text: '#FFFFFF', // White
    accent: '#16A34A', // Brand green
    dotColor: '#FFFFFF',
  },
  {
    bg: '#0B0F0D', // Ink
    text: '#FFFFFF', // White
    accent: '#16A34A', // Brand green
    dotColor: '#16A34A',
  },
];

export function AboutStoryV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accentLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const graphicWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dimOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Art Handles
  const oneRoofRef = useRef<OneRoofArtHandle>(null);
  const threeForcesRef = useRef<ThreeForcesArtHandle>(null);
  const seedToSkylineRef = useRef<SeedToSkylineArtHandle>(null);

  const reducedMotion = useReducedMotion();
  // Fixed word-for-word paragraphs [1..3]
  const paragraphs = aboutContent.hero.paragraphs.slice(1);

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section) return;

    // In reduced motion, display final static states without animation
    if (reducedMotion) {
      oneRoofRef.current?.setFinal();
      threeForcesRef.current?.setFinal();
      seedToSkylineRef.current?.setFinal();
      return;
    }

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const paragraphsList = paragraphRefs.current.filter(Boolean) as HTMLParagraphElement[];
    const accentLines = accentLineRefs.current.filter(Boolean) as HTMLDivElement[];
    const graphicWrappers = graphicWrapperRefs.current.filter(Boolean) as HTMLDivElement[];
    const dimOverlays = dimOverlayRefs.current.filter(Boolean) as HTMLDivElement[];

    const artHandles = [oneRoofRef.current, threeForcesRef.current, seedToSkylineRef.current];

    // 1. Entrance Animation per Card (ScrollTrigger start: "top 60%", once: true)
    cards.forEach((card, index) => {
      const art = artHandles[index];
      const para = paragraphsList[index];
      const line = accentLines[index];
      const wrapper = graphicWrappers[index];

      // Initial states
      if (line) gsap.set(line, { scaleX: 0 });
      if (para) gsap.set(para, { y: 24, opacity: 0 });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          // Play graphic
          art?.play();

          // Accent line draws
          if (line) {
            gsap.to(line, {
              scaleX: 1,
              duration: 0.6,
              delay: 0.15,
              ease: 'power2.out',
            });
          }

          // Paragraph fades + rises 24px (0.8s) 0.2s after graphic starts
          if (para) {
            gsap.to(para, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              delay: 0.2,
              ease: 'power2.out',
            });
          }

          // Gentle breathing float after entrance completes (6px float, 6s sine yoyo)
          if (wrapper) {
            const floatTween = gsap.to(wrapper, {
              y: -6,
              duration: 6,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: 1.8,
            });

            // Pause off-screen via IntersectionObserver
            let inView = false;
            const observer = new IntersectionObserver(
              ([entry]) => {
                inView = entry.isIntersecting;
                if (inView && !document.hidden) floatTween.play();
                else floatTween.pause();
              },
              { threshold: 0.05 }
            );
            observer.observe(card);

            const handleVisibility = () => {
              if (document.hidden) floatTween.pause();
              else if (inView) floatTween.play();
            };
            document.addEventListener('visibilitychange', handleVisibility);

            return () => {
              observer.disconnect();
              document.removeEventListener('visibilitychange', handleVisibility);
              floatTween.kill();
            };
          }
        },
      });
    });

    // 2. STACK DEPTH: Scrubbed ScrollTrigger on desktop/tablet (min-width: 640px)
    // As card (i + 1) slides over card (i), card (i) scales down to 0.94 and dims via overlay opacity
    const media = gsap.matchMedia();

    media.add('(min-width: 640px)', () => {
      cards.forEach((card, index) => {
        if (index >= cards.length - 1) return; // Last card doesn't get covered
        const nextCard = cards[index + 1];
        const overlay = dimOverlays[index];

        if (!nextCard || !overlay) return;

        gsap.fromTo(
          card,
          { scale: 1, transformOrigin: 'top center' },
          {
            scale: 0.94,
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 85%',
              end: 'top top+=116',
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 0.18, // Brightness .88
            ease: 'none',
            scrollTrigger: {
              trigger: nextCard,
              start: 'top 85%',
              end: 'top top+=116',
              scrub: true,
            },
          }
        );
      });
    });

    // 3. Fine Pointer Cursor Parallax (desktop with mouse: up to 10px parallax)
    if (window.matchMedia('(pointer: fine)').matches) {
      cards.forEach((card, index) => {
        const wrapper = graphicWrapperRefs.current[index];
        if (!wrapper) return;

        const xTo = gsap.quickTo(wrapper, 'x', { duration: 0.6, ease: 'power2.out' });
        const yTo = gsap.quickTo(wrapper, 'y', { duration: 0.6, ease: 'power2.out' });

        const handlePointerMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          xTo(relX * 16);
          yTo(relY * 16);
        };

        const handlePointerLeave = () => {
          xTo(0);
          yTo(0);
        };

        card.addEventListener('mousemove', handlePointerMove);
        card.addEventListener('mouseleave', handlePointerLeave);

        return () => {
          card.removeEventListener('mousemove', handlePointerMove);
          card.removeEventListener('mouseleave', handlePointerLeave);
        };
      });
    }

    return () => {
      media.revert();
    };
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-hero-v3-title"
      className="relative bg-[#F6FAF7] pt-[clamp(72px,9vw,140px)] pb-[clamp(96px,12vw,180px)]"
    >
      <div className="mx-auto w-[90%] sm:w-[88%] lg:w-[85%] max-w-[1280px]">
        {/* Card 1: INK #0B0F0D */}
        <StackCard
          key={paragraphs[0]}
          index={0}
          paragraph={paragraphs[0]}
          theme={CARD_THEMES[0]}
          isLast={false}
          ref={(node) => { cardRefs.current[0] = node; }}
          accentLineRef={(node) => { accentLineRefs.current[0] = node; }}
          paragraphRef={(node) => { paragraphRefs.current[0] = node; }}
          graphicWrapperRef={(node) => { graphicWrapperRefs.current[0] = node; }}
          dimOverlayRef={(node) => { dimOverlayRefs.current[0] = node; }}
        >
          <OneRoofArt ref={oneRoofRef} reducedMotion={reducedMotion} />
        </StackCard>

        {/* Card 2: BRAND GREEN #16A34A */}
        <StackCard
          key={paragraphs[1]}
          index={1}
          paragraph={paragraphs[1]}
          theme={CARD_THEMES[1]}
          isLast={false}
          ref={(node) => { cardRefs.current[1] = node; }}
          accentLineRef={(node) => { accentLineRefs.current[1] = node; }}
          paragraphRef={(node) => { paragraphRefs.current[1] = node; }}
          graphicWrapperRef={(node) => { graphicWrapperRefs.current[1] = node; }}
          dimOverlayRef={(node) => { dimOverlayRefs.current[1] = node; }}
        >
          <ThreeForcesArt ref={threeForcesRef} reducedMotion={reducedMotion} />
        </StackCard>

        {/* Card 3: BRAND GREEN #16A34A */}
        <StackCard
          key={paragraphs[2]}
          index={2}
          paragraph={paragraphs[2]}
          theme={CARD_THEMES[2]}
          isLast={true}
          ref={(node) => { cardRefs.current[2] = node; }}
          accentLineRef={(node) => { accentLineRefs.current[2] = node; }}
          paragraphRef={(node) => { paragraphRefs.current[2] = node; }}
          graphicWrapperRef={(node) => { graphicWrapperRefs.current[2] = node; }}
          dimOverlayRef={(node) => { dimOverlayRefs.current[2] = node; }}
        >
          <SeedToSkylineArt ref={seedToSkylineRef} reducedMotion={reducedMotion} />
        </StackCard>
      </div>
    </section>
  );
}
