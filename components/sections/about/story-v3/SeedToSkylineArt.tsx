'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';

export interface SeedToSkylineArtHandle {
  play: () => void;
  reset: () => void;
  setFinal: () => void;
}

interface SeedToSkylineArtProps {
  reducedMotion?: boolean;
  className?: string;
}

const BARS = [
  { x: 195, y: 265, w: 38, h: 90 },
  { x: 245, y: 215, w: 38, h: 140 },
  { x: 295, y: 165, w: 38, h: 190 },
  { x: 345, y: 115, w: 38, h: 240 },
  { x: 395, y: 65, w: 48, h: 290 }, // Tallest bar
];

export const SeedToSkylineArt = forwardRef<SeedToSkylineArtHandle, SeedToSkylineArtProps>(function SeedToSkylineArt(
  { reducedMotion = false, className = '' },
  ref
) {
  const rootRef = useRef<SVGSVGElement>(null);
  const seedRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const barsRef = useRef<SVGRectElement[]>([]);
  const windowsRef = useRef<SVGRectElement[]>([]);
  const growthLineRef = useRef<SVGPathElement>(null);
  const arrowGroupRef = useRef<SVGGElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);
  const antennaRef = useRef<SVGLineElement>(null);
  const beaconRef = useRef<SVGCircleElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (reducedMotion) return;
      const timeline = gsap.timeline();

      const seed = seedRef.current;
      const path = pathRef.current;
      const bars = barsRef.current.filter(Boolean);
      const windows = windowsRef.current.filter(Boolean);
      const growthLine = growthLineRef.current;
      const arrow = arrowGroupRef.current;
      const spark = sparkRef.current;
      const antenna = antennaRef.current;
      const beacon = beaconRef.current;

      // 1. Reset / initialize states
      if (seed) gsap.set(seed, { scale: 0, opacity: 0, transformOrigin: 'center center' });
      if (path) {
        const len = path.getTotalLength() || 600;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (growthLine) {
        const lineLen = growthLine.getTotalLength() || 500;
        gsap.set(growthLine, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
      }
      bars.forEach((bar) => {
        gsap.set(bar, { scaleY: 0, transformOrigin: 'bottom center' });
      });
      windows.forEach((win) => {
        gsap.set(win, { opacity: 0, scale: 0.5, transformOrigin: 'center center' });
      });
      if (arrow) gsap.set(arrow, { scale: 0, opacity: 0, transformOrigin: '0 0' });
      if (spark) gsap.set(spark, { scale: 0, opacity: 0 });
      if (antenna) gsap.set(antenna, { scaleY: 0, transformOrigin: 'bottom center' });
      if (beacon) gsap.set(beacon, { scale: 0, opacity: 0, transformOrigin: 'center center' });

      // 2. Seed pops in
      if (seed) {
        timeline.to(seed, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 0);
      }

      // 3. Curved trajectory path grows from seed
      if (path) {
        timeline.to(path, { strokeDashoffset: 0, duration: 0.75, ease: 'power2.out' }, 0.2);
      }

      // 4. Skyline bars rise sequentially
      bars.forEach((bar, index) => {
        timeline.to(
          bar,
          {
            scaleY: 1,
            duration: 0.65,
            ease: 'expo.out',
          },
          0.45 + index * 0.1
        );
      });

      // 5. Growth trajectory line across bars
      if (growthLine) {
        timeline.to(growthLine, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.out' }, 0.65);
      }

      // 6. Antenna on tallest bar
      if (antenna) {
        timeline.to(antenna, { scaleY: 1, duration: 0.35, ease: 'back.out(1.5)' }, 0.95);
      }
      if (beacon) {
        timeline.to(beacon, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, 1.1);
      }

      // 7. Abstract windows light up on the tallest bar
      if (windows.length > 0) {
        timeline.to(
          windows,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: 'power2.out',
          },
          1.0
        );
      }

      // 8. Tapered Arrow on top
      if (arrow) {
        timeline.to(
          arrow,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.8)',
          },
          1.15
        );
      }

      // 9. Spark burst at top
      if (spark) {
        timeline.fromTo(
          spark,
          { scale: 0, opacity: 0, rotation: -30 },
          {
            scale: 1.25,
            opacity: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'back.out(2.5)',
          },
          1.4
        );
      }
    },

    reset: () => {
      if (reducedMotion) return;
      if (seedRef.current) gsap.set(seedRef.current, { scale: 0, opacity: 0 });
      if (pathRef.current) gsap.set(pathRef.current, { strokeDashoffset: pathRef.current.getTotalLength() || 600 });
      if (growthLineRef.current) gsap.set(growthLineRef.current, { strokeDashoffset: growthLineRef.current.getTotalLength() || 500 });
      barsRef.current.filter(Boolean).forEach((bar) => gsap.set(bar, { scaleY: 0 }));
      windowsRef.current.filter(Boolean).forEach((win) => gsap.set(win, { opacity: 0 }));
      if (arrowGroupRef.current) gsap.set(arrowGroupRef.current, { scale: 0, opacity: 0 });
      if (sparkRef.current) gsap.set(sparkRef.current, { scale: 0, opacity: 0 });
      if (antennaRef.current) gsap.set(antennaRef.current, { scaleY: 0 });
      if (beaconRef.current) gsap.set(beaconRef.current, { scale: 0, opacity: 0 });
    },

    setFinal: () => {
      if (seedRef.current) gsap.set(seedRef.current, { scale: 1, opacity: 1 });
      if (pathRef.current) gsap.set(pathRef.current, { strokeDashoffset: 0 });
      if (growthLineRef.current) gsap.set(growthLineRef.current, { strokeDashoffset: 0 });
      barsRef.current.filter(Boolean).forEach((bar) => gsap.set(bar, { scaleY: 1 }));
      windowsRef.current.filter(Boolean).forEach((win) => gsap.set(win, { opacity: 1, scale: 1 }));
      if (arrowGroupRef.current) gsap.set(arrowGroupRef.current, { scale: 1, opacity: 1 });
      if (sparkRef.current) gsap.set(sparkRef.current, { scale: 1, opacity: 1, rotation: 0 });
      if (antennaRef.current) gsap.set(antennaRef.current, { scaleY: 1 });
      if (beaconRef.current) gsap.set(beaconRef.current, { scale: 1, opacity: 1 });
    },
  }));

  // Window coordinates on the tallest bar (Bar 5: x=395, y=65, w=48, h=290)
  const windowGrid: { x: number; y: number; w: number; h: number; fill: string }[] = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 3; col++) {
      windowGrid.push({
        x: 403 + col * 12,
        y: 85 + row * 24,
        w: 7,
        h: 11,
        fill: (row + col) % 3 === 0 ? '#16A34A' : '#FFFFFF',
      });
    }
  }

  // Windows on Bar 4 (x=345, y=115, w=38, h=240)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 2; col++) {
      windowGrid.push({
        x: 353 + col * 13,
        y: 135 + row * 24,
        w: 6.5,
        h: 10,
        fill: (row + col) % 2 === 0 ? '#16A34A' : '#FFFFFF',
      });
    }
  }

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 540 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none block h-full w-full select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="skyline-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0B0F0D" floodOpacity="0.2" />
        </filter>
        <filter id="skyline-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#16A34A" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Ground Baseline */}
      <line
        x1="45"
        y1="355"
        x2="495"
        y2="355"
        stroke="#0B0F0D"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Curved growth path from seed toward skyline */}
      <path
        ref={pathRef}
        d="M 85 345 C 130 345, 155 315, 195 285 S 250 220, 295 175 S 350 120, 420 70"
        stroke="#16A34A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Startup Seed on Left */}
      <g ref={seedRef} transform="translate(85, 345)">
        {/* Seed pulse ring */}
        <circle r="15" stroke="#0B0F0D" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" fill="none" />
        {/* Solid ink dot seed */}
        <circle r="7.5" fill="#0B0F0D" />
        {/* Sprout micro-accent */}
        <path d="M 0 -7.5 C 0 -13, 5 -16, 7 -16 C 7 -12, 4 -8, 0 -7.5" fill="#16A34A" />
      </g>

      {/* 5 Rising Skyline Bars */}
      <g filter="url(#skyline-shadow)">
        {BARS.map((bar, index) => (
          <rect
            key={index}
            ref={(node) => {
              if (node) barsRef.current[index] = node;
            }}
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx="6"
            fill="#0B0F0D"
            stroke="#16A34A"
            strokeWidth="1.2"
          />
        ))}
      </g>

      {/* Antenna & Beacon on Tallest Bar (Bar 5) */}
      <line
        ref={antennaRef}
        x1="419"
        y1="65"
        x2="419"
        y2="32"
        stroke="#0B0F0D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        ref={beaconRef}
        cx="419"
        cy="28"
        r="4"
        fill="#16A34A"
        filter="url(#skyline-glow)"
      />

      {/* Tiny Abstract Windows on Tallest Bar & Bar 4 */}
      {windowGrid.map((win, idx) => (
        <rect
          key={idx}
          ref={(node) => {
            if (node) windowsRef.current[idx] = node;
          }}
          x={win.x}
          y={win.y}
          width={win.w}
          height={win.h}
          rx="1.5"
          fill={win.fill}
          fillOpacity="0.9"
        />
      ))}

      {/* Growth Line across top of bars */}
      <path
        ref={growthLineRef}
        d="M 195 265 L 245 215 L 295 165 L 345 115 L 395 65"
        stroke="#16A34A"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Growth Arrow on top of the tallest building */}
      <g
        ref={arrowGroupRef}
        transform="translate(425, 60) rotate(-45) scale(0.85)"
        style={{ transformOrigin: '0 0' }}
      >
        <polygon
          points="100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5"
          fill="#16A34A"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line x1="12" y1="0" x2="80" y2="0" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* Spark at Arrow Tip */}
        <g transform="translate(104, 0)">
          <path
            ref={sparkRef}
            d="M 0 -11 Q 0 0 11 0 Q 0 0 0 11 Q 0 0 -11 0 Q 0 0 0 -11 Z"
            fill="#16A34A"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            filter="url(#skyline-glow)"
          />
        </g>
      </g>
    </svg>
  );
});

