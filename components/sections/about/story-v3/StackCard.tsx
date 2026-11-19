'use client';

import React, { forwardRef } from 'react';

export interface CardTheme {
  bg: string;
  text: string;
  accent: string;
  dotColor: string;
}

interface StackCardProps {
  index: number;
  paragraph: string;
  theme: CardTheme;
  isLast: boolean;
  accentLineRef: (node: HTMLDivElement | null) => void;
  paragraphRef: (node: HTMLParagraphElement | null) => void;
  graphicWrapperRef: (node: HTMLDivElement | null) => void;
  dimOverlayRef: (node: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

export const StackCard = forwardRef<HTMLDivElement, StackCardProps>(function StackCard(
  {
    index,
    paragraph,
    theme,
    isLast,
    accentLineRef,
    paragraphRef,
    graphicWrapperRef,
    dimOverlayRef,
    children,
  },
  ref
) {
  // Alternate column layout on desktop (>= 1024px):
  // Cards 0 and 2 (Cards 1 and 3): text on cols 1-6, graphic on cols 7-12
  // Card 1 (Card 2): graphic on cols 1-6, text on cols 7-12
  // On tablet and mobile (< 1024px): Graphic is on top, text is below
  const isAltLayout = index === 1;

  return (
    <div
      ref={ref}
      data-stack-card={index}
      style={
        {
          backgroundColor: theme.bg,
          '--i': index,
        } as React.CSSProperties
      }
      className={`group relative isolate w-full overflow-hidden rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-[clamp(32px,5vw,72px)] transition-shadow duration-300 shadow-[0_16px_40px_rgba(11,15,13,0.08)] ${
        isLast ? 'mb-0' : 'mb-4 sm:mb-[18vh]'
      } sm:sticky sm:top-[calc(76px+var(--i)*20px)] lg:top-[calc(88px+var(--i)*28px)] sm:min-h-[60svh] lg:min-h-[72svh] flex flex-col justify-center`}
    >
      {/* Stack Dim Overlay for scrubbed depth effect */}
      <div
        ref={dimOverlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-[24px] sm:rounded-[32px] bg-black opacity-0 transition-opacity duration-150"
      />

      {/* Card Corner: 3-dot cluster showing active card position 1/2/3 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 z-20 flex items-center gap-2 sm:right-8 sm:top-8"
      >
        {[0, 1, 2].map((dotIndex) => {
          const isActive = dotIndex === index;
          return (
            <span
              key={dotIndex}
              className={`block size-2 rounded-full transition-all duration-300 sm:size-2.5 ${
                isActive ? 'scale-110 opacity-100' : 'opacity-25'
              }`}
              style={{ backgroundColor: theme.dotColor }}
            />
          );
        })}
      </div>

      {/* Main 12-Column Grid */}
      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Text Content Column */}
        <div
          className={`w-full ${
            isAltLayout
              ? 'order-2 lg:order-2 lg:col-span-6 lg:col-start-7'
              : 'order-2 lg:order-1 lg:col-span-6 lg:col-start-1'
          }`}
        >
          {/* 4px Accent Line (72px wide) */}
          <div
            ref={accentLineRef}
            aria-hidden="true"
            className="mb-6 h-1 w-[72px] origin-left rounded-full"
            style={{ backgroundColor: theme.accent }}
          />

          {/* Fixed Word-for-Word Paragraph */}
          <p
            ref={paragraphRef}
            className="m-0 max-w-[22em] font-semibold leading-[1.38] tracking-[-0.015em] text-[clamp(1.1rem,1rem+2vw,1.3rem)] sm:text-[clamp(1.35rem,1rem+1.4vw,2.3rem)]"
            style={{ color: theme.text }}
          >
            {paragraph}
          </p>
        </div>

        {/* Graphic Art Column */}
        <div
          ref={graphicWrapperRef}
          className={`flex w-full items-center justify-center ${
            isAltLayout
              ? 'order-1 lg:order-1 lg:col-span-6 lg:col-start-1'
              : 'order-1 lg:order-2 lg:col-span-6 lg:col-start-7'
          } h-[200px] sm:h-[260px] lg:h-[min(52vh,420px)]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

