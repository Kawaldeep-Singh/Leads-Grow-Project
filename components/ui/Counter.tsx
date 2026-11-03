'use client';

import React, { useEffect, useRef, useState } from 'react';
import { registerGsapPlugins, gsap, ScrollTrigger } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  suffix = '',
  duration = 2,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    registerGsapPlugins();

    const obj = { count: 0 };
    const el = elementRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          count: value,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplayValue(Math.floor(obj.count));
          },
          onComplete: () => {
            setDisplayValue(value);
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [value, duration, prefersReducedMotion]);

  return (
    <span ref={elementRef} className={`tabular-nums font-black ${className}`}>
      {displayValue}
      {suffix}
    </span>
  );
};

