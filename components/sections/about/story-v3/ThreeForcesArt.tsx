'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';

export interface ThreeForcesArtHandle {
  play: () => void;
  reset: () => void;
  setFinal: () => void;
}

interface ThreeForcesArtProps {
  reducedMotion?: boolean;
  className?: string;
}

export const ThreeForcesArt = forwardRef<ThreeForcesArtHandle, ThreeForcesArtProps>(function ThreeForcesArt(
  { reducedMotion = false, className = '' },
  ref
) {
  const rootRef = useRef<SVGSVGElement>(null);
  const circleTopRef = useRef<SVGGElement>(null);
  const circleLeftRef = useRef<SVGGElement>(null);
  const circleRightRef = useRef<SVGGElement>(null);
  const glowCoreRef = useRef<SVGCircleElement>(null);
  const arrowGroupRef = useRef<SVGGElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (reducedMotion) return;
      const timeline = gsap.timeline();

      const topCircle = circleTopRef.current;
      const leftCircle = circleLeftRef.current;
      const rightCircle = circleRightRef.current;
      const glow = glowCoreRef.current;
      const arrow = arrowGroupRef.current;
      const spark = sparkRef.current;

      // 1. Initial drift states
      if (topCircle) gsap.set(topCircle, { y: -100, opacity: 0, scale: 0.8 });
      if (leftCircle) gsap.set(leftCircle, { x: -110, y: 70, opacity: 0, scale: 0.8 });
      if (rightCircle) gsap.set(rightCircle, { x: 110, y: 70, opacity: 0, scale: 0.8 });
      if (glow) gsap.set(glow, { scale: 0, opacity: 0 });
      if (arrow) gsap.set(arrow, { scale: 0, opacity: 0, y: 30 });
      if (spark) gsap.set(spark, { scale: 0, opacity: 0 });

      // 2. Animate the 3 circles drifting into the Venn
      timeline.to(
        [topCircle, leftCircle, rightCircle],
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
        },
        0
      );

      // 3. Center intersection white glow
      if (glow) {
        timeline.to(
          glow,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(2)',
          },
          0.85
        );
      }

      // 4. Growth arrow rising from center intersection
      if (arrow) {
        timeline.to(
          arrow,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'expo.out',
          },
          1.05
        );
      }

      // 5. Spark burst at the tip of the arrow
      if (spark) {
        timeline.fromTo(
          spark,
          { scale: 0, opacity: 0, rotation: -45 },
          {
            scale: 1.25,
            opacity: 1,
            rotation: 0,
            duration: 0.45,
            ease: 'back.out(2.5)',
          },
          1.4
        );
      }
    },

    reset: () => {
      if (reducedMotion) return;
      if (circleTopRef.current) gsap.set(circleTopRef.current, { y: -100, opacity: 0, scale: 0.8 });
      if (circleLeftRef.current) gsap.set(circleLeftRef.current, { x: -110, y: 70, opacity: 0, scale: 0.8 });
      if (circleRightRef.current) gsap.set(circleRightRef.current, { x: 110, y: 70, opacity: 0, scale: 0.8 });
      if (glowCoreRef.current) gsap.set(glowCoreRef.current, { scale: 0, opacity: 0 });
      if (arrowGroupRef.current) gsap.set(arrowGroupRef.current, { scale: 0, opacity: 0, y: 30 });
      if (sparkRef.current) gsap.set(sparkRef.current, { scale: 0, opacity: 0 });
    },

    setFinal: () => {
      if (circleTopRef.current) gsap.set(circleTopRef.current, { x: 0, y: 0, opacity: 1, scale: 1 });
      if (circleLeftRef.current) gsap.set(circleLeftRef.current, { x: 0, y: 0, opacity: 1, scale: 1 });
      if (circleRightRef.current) gsap.set(circleRightRef.current, { x: 0, y: 0, opacity: 1, scale: 1 });
      if (glowCoreRef.current) gsap.set(glowCoreRef.current, { scale: 1, opacity: 1 });
      if (arrowGroupRef.current) gsap.set(arrowGroupRef.current, { scale: 1, opacity: 1, y: 0 });
      if (sparkRef.current) gsap.set(sparkRef.current, { scale: 1, opacity: 1, rotation: 0 });
    },
  }));

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
        {/* Soft shadow for circles and center core */}
        <filter id="three-forces-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#FFFFFF" floodOpacity="0.75" />
        </filter>
        <filter id="forces-depth" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0B0F0D" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Group with mix-blend-multiply for Venn diagram intersections */}
      <g filter="url(#forces-depth)">
        {/* Circle 1: Creativity (Top) - White outline with fine stroke */}
        <g ref={circleTopRef}>
          <circle
            cx="270"
            cy="155"
            r="105"
            stroke="#FFFFFF"
            strokeWidth="3"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />
          {/* Subtle concentric orbit ring */}
          <circle
            cx="270"
            cy="155"
            r="82"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            fill="none"
            opacity="0.35"
          />
        </g>

        {/* Circle 2: Technology (Bottom-Left) - Ink fill 85% with mix-blend multiply */}
        <g ref={circleLeftRef} style={{ mixBlendMode: 'multiply' }}>
          <circle
            cx="205"
            cy="265"
            r="105"
            fill="#0B0F0D"
            fillOpacity="0.85"
            stroke="#0B0F0D"
            strokeWidth="2.5"
          />
          {/* Subtle tech grid motif inside */}
          <circle
            cx="205"
            cy="265"
            r="75"
            stroke="#16A34A"
            strokeWidth="1"
            strokeDasharray="3 5"
            fill="none"
            opacity="0.3"
          />
        </g>

        {/* Circle 3: Strategy (Bottom-Right) - Green fill 85% with mix-blend multiply */}
        <g ref={circleRightRef} style={{ mixBlendMode: 'multiply' }}>
          <circle
            cx="335"
            cy="265"
            r="105"
            fill="#16A34A"
            fillOpacity="0.85"
            stroke="#16A34A"
            strokeWidth="2.5"
          />
          {/* Subtle target radar ring inside */}
          <circle
            cx="335"
            cy="265"
            r="75"
            stroke="#0B0F0D"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
            opacity="0.25"
          />
        </g>
      </g>

      {/* Centre Intersection Glow Core (White luminous focal point) */}
      <circle
        ref={glowCoreRef}
        cx="270"
        cy="228"
        r="24"
        fill="#FFFFFF"
        fillOpacity="0.95"
        filter="url(#three-forces-glow)"
      />
      <circle
        cx="270"
        cy="228"
        r="14"
        fill="#FFFFFF"
      />

      {/* Tapered Growth Arrow (polygon 100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5 at 50deg) */}
      <g
        ref={arrowGroupRef}
        transform="translate(270, 228) rotate(-50) scale(0.9)"
        style={{ transformOrigin: '0 0' }}
      >
        {/* Core Arrow Polygon */}
        <polygon
          points="100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5"
          fill="#0B0F0D"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Accent central spine line */}
        <line x1="12" y1="0" x2="82" y2="0" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />

        {/* Spark at the tip (Coordinates at tip x: 100, y: 0) */}
        <g transform="translate(104, 0)">
          <path
            ref={sparkRef}
            d="M 0 -11 Q 0 0 11 0 Q 0 0 0 11 Q 0 0 -11 0 Q 0 0 0 -11 Z"
            fill="#FFFFFF"
            filter="url(#three-forces-glow)"
          />
        </g>
      </g>
    </svg>
  );
});

