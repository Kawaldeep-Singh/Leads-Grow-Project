'use client';

import React, { useRef } from 'react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { useFooterAnimations } from '@/hooks/useFooterAnimations';
import { FooterTicker } from './footer/FooterTicker';
import { FooterBackground } from './footer/FooterBackground';
import { FooterCloser } from './footer/FooterCloser';
import { FooterStats } from './footer/FooterStats';
import { FooterLinks } from './footer/FooterLinks';
import { FooterWordmark } from './footer/FooterWordmark';
import { FooterBottomBar } from './footer/FooterBottomBar';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const closerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const growthLineRef = useRef<SVGPathElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);

  // Initialize master animations, scrubbed wordmark, spotlight, and magnetic buttons
  useFooterAnimations({
    footerRef,
    closerRef,
    statsRef,
    linksRef,
    wordmarkRef,
    growthLineRef,
    bottomBarRef,
    spotlightRef,
    progressCircleRef,
  });

  // Smooth scroll handler for anchor links using Lenis instance or GSAP ScrollTo fallback
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      const targetId = href.replace('/#', '').replace('#', '');
      if (!targetId) return;

      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        if (typeof window !== 'undefined') {
          const lenis = (window as unknown as {
            __lenis?: {
              scrollTo: (
                target: HTMLElement | number,
                opts?: { duration?: number }
              ) => void;
            };
          }).__lenis;

          if (lenis) {
            lenis.scrollTo(elem, { duration: 1.2 });
          } else {
            elem.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  };

  // Scroll to top handler with Lenis or GSAP ScrollToPlugin
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      const lenis = (window as unknown as {
        __lenis?: {
          scrollTo: (
            target: HTMLElement | number,
            opts?: { duration?: number }
          ) => void;
        };
      }).__lenis;

      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        registerGsapPlugins();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: 0, autoKill: true },
          ease: 'power3.inOut',
        });
      }
    }
  };

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="relative w-full bg-[#0B0F0D] text-white border-t border-[#1A2420] overflow-hidden"
    >
      {/* ── Ambient Animated Background Layer ── */}
      <FooterBackground spotlightRef={spotlightRef} />

      {/* ── 2.1 Growth Ticker Strip (Top Edge) ── */}
      <FooterTicker />

      {/* ── Main Container (Aligned with Navbar w-[85%]) ── */}
      <div className="w-[85%] mx-auto relative z-10 pt-8 sm:pt-10 pb-4 sm:pb-5">
        {/* ── 2.2 Hero Row ("The Closer") ── */}
        {/* <div ref={closerRef}>
          <FooterCloser onAnchorClick={handleAnchorClick} />
        </div> */}

        {/* ── 2.3 Proof / Stats Row ── */}
        {/* <div ref={statsRef}>
          <FooterStats />
        </div> */}

        {/* ── 2.4 Link Area (12-Column Grid) ── */}
        <div ref={linksRef}>
          <FooterLinks onAnchorClick={handleAnchorClick} />
        </div>

        {/* ── 2.5 Giant Wordmark with Rising Fill & Growth Line ── */}
        <FooterWordmark
          wordmarkRef={wordmarkRef}
          growthLineRef={growthLineRef}
        />

        {/* ── 2.6 Bottom Bar ── */}
        <div ref={bottomBarRef}>
          <FooterBottomBar
            progressCircleRef={progressCircleRef}
            onScrollToTop={scrollToTop}
          />
        </div>
      </div>
    </footer>
  );
};
