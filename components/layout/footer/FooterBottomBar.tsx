'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiArrowUp } from 'react-icons/hi2';
import { BRAND } from '@/lib/constants';

interface FooterBottomBarProps {
  progressCircleRef: React.RefObject<SVGCircleElement | null>;
  onScrollToTop: () => void;
}

export const FooterBottomBar: React.FC<FooterBottomBarProps> = ({
  progressCircleRef,
  onScrollToTop,
}) => {
  // Avoid hydration mismatch by computing year after mount
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="footer-bottom-bar grid grid-cols-1 md:grid-cols-3 items-center gap-6 pt-8 text-xs text-[#5B6B63] border-t border-[#1A2420]">
      {/* ── Left: Copyright & Tagline ── */}
      <div className="text-center md:text-left">
        <span>
          © {currentYear} {BRAND.name}
          {BRAND.trademark}. All rights reserved. •{' '}
        </span>
        {/* <span className="text-[#9FB0A7] font-medium">{BRAND.tagline}</span> */}
      </div>

      {/* ── Center: Legal & Sitemap Links (Properly Centered) ── */}
      <div className="flex items-center justify-center gap-6 text-center">
        <Link
          href="#"
          className="hover:text-white transition-colors duration-200"
        >
          Privacy Policy
        </Link>
        <span className="text-[#1A2420]" aria-hidden="true">
          •
        </span>
        <Link
          href="#"
          className="hover:text-white transition-colors duration-200"
        >
          Terms of Service
        </Link>
        <span className="text-[#1A2420]" aria-hidden="true">
          •
        </span>
        <Link
          href="#"
          className="hover:text-white transition-colors duration-200"
        >
          Sitemap
        </Link>
      </div>

      {/* ── Right: Back to Top Button with Circular Progress Ring ── */}
      <div className="flex items-center justify-center md:justify-end">
        <button
          type="button"
          onClick={onScrollToTop}
          aria-label="Back to top"
          className="magnetic-target group relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111815] border border-[#1A2420] text-[#9FB0A7] hover:text-white hover:border-[#22C55E]/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer"
        >
          <span className="text-xs font-semibold hidden sm:inline-block">
            Back to top
          </span>

          {/* 36px round wrapper with progress ring */}
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            {/* SVG Progress Ring */}
            <svg
              className="absolute inset-0 w-8 h-8 -rotate-90 pointer-events-none"
              viewBox="0 0 36 36"
            >
              {/* Track */}
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#1A2420"
                strokeWidth="2"
              />
              {/* Dynamic progress circle */}
              <circle
                ref={progressCircleRef}
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-opacity duration-300"
                style={{
                  strokeDasharray: 94.25,
                  strokeDashoffset: 94.25,
                }}
              />
            </svg>

            {/* Arrow icon with subtle hover lift */}
            <HiArrowUp className="h-3.5 w-3.5 text-[#22C55E] group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5" />
          </div>
        </button>
      </div>
    </div>
  );
};
