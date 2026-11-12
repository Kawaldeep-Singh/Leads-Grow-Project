'use client';

import React from 'react';

interface FooterWordmarkProps {
  wordmarkRef: React.RefObject<HTMLDivElement | null>;
  growthLineRef: React.RefObject<SVGPathElement | null>;
}

const LETTERS = ['L', 'E', 'A', 'D', 'S', 'G', 'R', 'O', 'W'];

export const FooterWordmark: React.FC<FooterWordmarkProps> = ({
  wordmarkRef,
  growthLineRef,
}) => {
  return (
    <div
      ref={wordmarkRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none py-8 sm:py-12 text-center group cursor-default px-2 sm:px-4"
      style={{
        // Default CSS variable, scrubbed by useFooterAnimations
        ['--p' as string]: '0%',
      }}
    >
      {/* Background growth line overlay */}
      <div className="absolute inset-x-0 bottom-3 sm:bottom-6 pointer-events-none z-0 max-w-5xl mx-auto px-4">
        <svg
          viewBox="0 0 900 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-28 opacity-100 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Diagonal growth arrow crossing behind the O in Grow */}
          <path
            ref={growthLineRef}
            d="M 620 96 L 690 12"
            stroke="#86EFAC"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          />

          {/* Upward diagonal arrowhead */}
          <g transform="translate(690, 12) rotate(-50)">
            <polygon
              points="-4,-6 12,0 -4,6"
              fill="#86EFAC"
              className="footer-growth-arrow-head filter drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
            />
          </g>
        </svg>
      </div>

      {/* Wordmark sized comfortably so it never clips on any screen */}
      <div className="relative z-10 flex justify-center items-center w-full overflow-hidden">
        <span
          className="text-[clamp(2.1rem,8.2vw,7.8rem)] font-black tracking-tight leading-none inline-flex justify-center flex-nowrap"
          style={{
            WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.22)',
            background: 'linear-gradient(to top, #22C55E 0%, #16A34A var(--p), transparent var(--p))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          {LETTERS.map((letter, idx) => (
            <span
              key={idx}
              className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-2"
              style={{
                transitionDelay: `${idx * 25}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};
