'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap, ScrollTrigger } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const skyline = [
  { x: 34, y: 230, h: 52 }, { x: 92, y: 205, h: 77 }, { x: 150, y: 176, h: 106 },
  { x: 208, y: 150, h: 132 }, { x: 266, y: 118, h: 164 }, { x: 324, y: 83, h: 199 },
  { x: 382, y: 42, h: 240 },
];

export const GrowthBars: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<SVGRectElement[]>([]);
  const lineRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !rootRef.current) return;
    registerGsapPlugins();

    const bars = barsRef.current.filter(Boolean);
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 82%',
        once: true,
      },
    });
    timeline.fromTo(bars, { scaleY: 0, transformOrigin: '50% 100%' }, {
      scaleY: 1,
      duration: 0.72,
      stagger: 0.09,
      ease: 'elastic.out(1, 0.65)',
    });
    if (lineRef.current) {
      timeline.fromTo(lineRef.current, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.42');
    }
    if (arrowRef.current) {
      timeline.fromTo(arrowRef.current, { scale: 0, transformOrigin: '50% 50%' }, {
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)',
      }, '-=0.3');
    }

    const idleTweens = bars.map((bar, index) => gsap.to(bar, {
      scaleY: 1.025 + (index % 3) * 0.008,
      duration: 2.3 + index * 0.15,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true,
    }));
    const visibilityTrigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => idleTweens.forEach((tween) => tween.play()),
      onEnterBack: () => idleTweens.forEach((tween) => tween.play()),
      onLeave: () => idleTweens.forEach((tween) => tween.pause()),
      onLeaveBack: () => idleTweens.forEach((tween) => tween.pause()),
    });

    return () => {
      idleTweens.forEach((tween) => tween.kill());
      visibilityTrigger.kill();
    };
  }, { dependencies: [reduced], revertOnUpdate: true });

  return (
    <div ref={rootRef} className="w-full max-w-[36rem] lg:max-w-none lg:w-[min(100%,36rem)]" aria-hidden="true">
      <svg viewBox="0 0 460 330" className="w-full overflow-visible">
        <defs>
          <linearGradient id="about-growth-bar-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#16A34A" />
            <stop offset="1" stopColor="#22C55E" />
          </linearGradient>
        </defs>
        <path d="M18 286H444" fill="none" stroke="#0B0F0D" strokeOpacity=".28" strokeWidth="1" />
        {skyline.map((bar, index) => (
          <rect
            key={bar.x}
            ref={(node) => { if (node) barsRef.current[index] = node; }}
            x={bar.x}
            y={bar.y}
            width="34"
            height={bar.h}
            rx="9"
            fill={index === skyline.length - 1 ? 'url(#about-growth-bar-gradient)' : '#16A34A'}
            fillOpacity={index === skyline.length - 1 ? 1 : 0.72}
          />
        ))}
        <path
          ref={lineRef}
          d="M51 221L109 196L167 167L225 141L283 109L341 74L399 33"
          fill="none"
          stroke="#0B0F0D"
          strokeOpacity=".82"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
        />
        <path
          ref={arrowRef}
          d="M385 36L401 29L406 46"
          fill="none"
          stroke="#0B0F0D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="399" cy="33" r="5" fill="#B6F23D" />
      </svg>
    </div>
  );
};
