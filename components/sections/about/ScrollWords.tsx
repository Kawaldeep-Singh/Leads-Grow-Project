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
  start = 'top 75%',
  end = 'bottom 40%',
  underlineLast = false,
}) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const tokens = text.split(/(\s+)/);

  useGSAP(() => {
    if (reduced || !paragraphRef.current) return;
    registerGsapPlugins();
    const words = paragraphRef.current.querySelectorAll<HTMLElement>('[data-scroll-word]');
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: paragraphRef.current,
        start,
        end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    timeline.fromTo(words, { opacity: 0.3 }, {
      opacity: 1,
      stagger: 0.035,
      ease: 'none',
    });
    if (underlineLast && underlineRef.current) {
      timeline.fromTo(underlineRef.current, { scaleX: 0 }, {
        scaleX: 1,
        duration: 0.2,
        ease: 'none',
      }, '-=0.1');
    }
  }, { dependencies: [reduced, text, start, end, underlineLast], revertOnUpdate: true });

  return (
    <p ref={paragraphRef} className={`select-text ${className}`}>
      {tokens.map((token, index) => /^\s+$/.test(token) ? token : (
        <span
          key={`${index}-${token}`}
          data-scroll-word
          className={theme === 'dark' ? 'text-white' : 'text-[#5B6B63]'}
          style={{ opacity: 1 }}
        >
          {token}
        </span>
      ))}
      {underlineLast && (
        <span
          ref={underlineRef}
          aria-hidden="true"
          className="block h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] mt-3 origin-left"
        />
      )}
    </p>
  );
};
