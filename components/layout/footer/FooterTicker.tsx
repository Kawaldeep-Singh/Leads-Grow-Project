'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TICKER_ITEMS = [
  'SEO',
  'Google Ads',
  'Meta Ads',
  'Web Development',
  'App Development',
  'Branding',
  'Lead Generation',
  'Marketing Automation',
  'Performance Marketing',
  'Offline Marketing',
];

export const FooterTicker: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const offsetRef = useRef(0);
  const velocityBoostRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') return;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      const dy = Math.abs(window.scrollY - lastScrollY);
      const velocity = dy / dt; // px per ms
      velocityBoostRef.current = Math.min(3, velocity * 1.5);
      lastScrollY = window.scrollY;
      lastTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrameId: number;

    const baseSpeed = 0.65; // px per frame at 60fps

    const loop = () => {
      // Decay velocity boost
      velocityBoostRef.current *= 0.94;
      if (velocityBoostRef.current < 0.01) velocityBoostRef.current = 0;

      if (!isPaused && trackRef.current) {
        const currentSpeed = baseSpeed + velocityBoostRef.current;
        offsetRef.current -= currentSpeed;

        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(offsetRef.current) >= halfWidth) {
          offsetRef.current += halfWidth;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion, isPaused]);

  // Triple items for infinite seamless scroll
  const renderList = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden border-b border-[#1A2420] bg-[#080D0A]/70 backdrop-blur-md select-none py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Core services ticker"
    >
      {/* Side gradient feathering */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0B0F0D] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0B0F0D] to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{
          width: 'max-content',
        }}
      >
        {renderList.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9FB0A7] hover:text-[#22C55E] transition-colors duration-200 cursor-default px-4">
              {item}
            </span>
            <span className="text-[#22C55E] text-[10px] opacity-70 px-1 select-none">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
