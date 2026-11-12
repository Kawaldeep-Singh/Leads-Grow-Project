'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollWordsProps {
  text: string;
  className?: string;
  theme?: 'dark' | 'light';
  start?: string;
  end?: string;
  underlineLast?: boolean;
}

export const ScrollWords: React.FC<ScrollWordsProps> = ({
  text,
  className = '',
  theme = 'dark',
  start = 'top 80%',
  end = 'bottom 45%',
  underlineLast = false,
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  // Split into words while keeping whitespace intact
  const words = text.split(' ');

  useGSAP(
    () => {
      if (prefersReduced || !containerRef.current) return;
      registerGsapPlugins();

      const wordElements = containerRef.current.querySelectorAll('.scroll-word');
      if (!wordElements.length) return;

      const mutedOpacity = 0.3;
      const fullOpacity = 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        wordElements,
        { opacity: mutedOpacity },
        {
          opacity: fullOpacity,
          stagger: 0.05,
          ease: 'none',
        }
      );

      if (underlineLast && underlineRef.current) {
        tl.fromTo(
          underlineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.2, ease: 'power2.out' },
          '-=0.15'
        );
      }
    },
    { dependencies: [prefersReduced, text, start, end, underlineLast] }
  );

  if (prefersReduced) {
    return (
      <p className={className}>
        {text}
        {underlineLast && (
          <span className="block h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] mt-2 w-full" />
        )}
      </p>
    );
  }

  return (
    <p
      ref={containerRef}
      className={`relative select-text ${className}`}
    >
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span
            className={`scroll-word inline-block transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-[#0B0F0D]'
            }`}
            style={{ opacity: 0.3 }}
          >
            {word}
          </span>
          {idx < words.length - 1 && ' '}
        </React.Fragment>
      ))}
      {underlineLast && (
        <span
          ref={underlineRef}
          aria-hidden="true"
          className="block h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] mt-2 origin-left scale-x-0"
        />
      )}
    </p>
  );
};
