'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap } from '@/lib/gsap-register';

export interface OneRoofArtHandle {
  play: () => void;
  reset: () => void;
  setFinal: () => void;
}

interface OneRoofArtProps {
  reducedMotion?: boolean;
  className?: string;
}

// Service touchpoints orbit a shared growth hub instead of sitting under a roof.
const SLOTS = [
  { id: 'marketing', x: 102, y: 220 },
  { id: 'branding', x: 190, y: 112 },
  { id: 'website', x: 270, y: 328 },
  { id: 'performance', x: 350, y: 112 },
  { id: 'offline', x: 438, y: 220 },
];

const SCATTERS = [
  { dx: -150, dy: -90, rot: -24 },
  { dx: -80, dy: -150, rot: 24 },
  { dx: 0, dy: 150, rot: -18 },
  { dx: 80, dy: -150, rot: -24 },
  { dx: 150, dy: -90, rot: 18 },
];

export const OneRoofArt = forwardRef<OneRoofArtHandle, OneRoofArtProps>(function OneRoofArt(
  { reducedMotion = false, className = '' },
  ref
) {
  const orbitRef = useRef<SVGGElement>(null);
  const iconsOrbitRef = useRef<SVGGElement>(null);
  const orbitPathRefs = useRef<SVGPathElement[]>([]);
  const coreRef = useRef<SVGGElement>(null);
  const iconsRef = useRef<SVGGElement[]>([]);
  const pulseRingsRef = useRef<SVGCircleElement[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (reducedMotion) return;
      animationRef.current?.kill();
      const timeline = gsap.timeline();
      animationRef.current = timeline;
      const orbit = orbitRef.current;
      const iconsOrbit = iconsOrbitRef.current;
      const core = coreRef.current;

      orbitPathRefs.current.filter(Boolean).forEach((path) => {
        const length = path.getTotalLength() || 600;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        timeline.to(path, { strokeDashoffset: 0, duration: .85, ease: 'power2.out' }, 0);
      });

      if (core) {
        gsap.set(core, { opacity: 0, scale: .72, transformOrigin: 'center center' });
        timeline.to(core, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(1.6)' }, .35);
      }

      iconsRef.current.filter(Boolean).forEach((iconGroup, index) => {
        const scatter = SCATTERS[index];
        const pulse = pulseRingsRef.current[index];
        gsap.set(iconGroup, { x: scatter.dx, y: scatter.dy, rotation: scatter.rot, opacity: 0, scale: .72 });
        timeline.to(iconGroup, {
          x: 0, y: 0, rotation: 0, opacity: 1, scale: 1,
          duration: .85, ease: 'expo.out',
          onComplete: () => {
            if (pulse) gsap.fromTo(pulse, { scale: .85, opacity: .85 }, { scale: 1.45, opacity: 0, duration: .5, ease: 'power2.out' });
          },
        }, .5 + index * .08);
      });

      if (orbit) {
        gsap.set(orbit, { rotation: 0, svgOrigin: '270 220' });
        timeline.to(orbit, { rotation: 360, duration: 48, ease: 'none', repeat: -1 }, 1.45);
      }
      if (iconsOrbit) {
        gsap.set(iconsOrbit, { rotation: 0, svgOrigin: '270 220' });
        timeline.to(iconsOrbit, { rotation: 360, duration: 48, ease: 'none', repeat: -1 }, 1.45);
        iconsRef.current.filter(Boolean).forEach((iconGroup) => {
          timeline.to(iconGroup, { rotation: -360, duration: 48, ease: 'none', repeat: -1, transformOrigin: 'center center' }, 1.85);
        });
      }
    },

    reset: () => {
      animationRef.current?.kill();
      animationRef.current = null;
      const orbit = orbitRef.current;
      if (orbit) gsap.set(orbit, { rotation: 0, svgOrigin: '270 220' });
      if (iconsOrbitRef.current) gsap.set(iconsOrbitRef.current, { rotation: 0, svgOrigin: '270 220' });
      if (coreRef.current) gsap.set(coreRef.current, { opacity: 0, scale: .72 });
      orbitPathRefs.current.filter(Boolean).forEach((path) => {
        const length = path.getTotalLength() || 600;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      iconsRef.current.filter(Boolean).forEach((iconGroup, index) => {
        const scatter = SCATTERS[index];
        gsap.set(iconGroup, { x: scatter.dx, y: scatter.dy, rotation: scatter.rot, opacity: 0, scale: .72 });
      });
    },

    setFinal: () => {
      animationRef.current?.kill();
      animationRef.current = null;
      if (orbitRef.current) gsap.set(orbitRef.current, { rotation: 0, svgOrigin: '270 220' });
      if (iconsOrbitRef.current) gsap.set(iconsOrbitRef.current, { rotation: 0, svgOrigin: '270 220' });
      if (coreRef.current) gsap.set(coreRef.current, { opacity: 1, scale: 1 });
      orbitPathRefs.current.filter(Boolean).forEach((path) => {
        const length = path.getTotalLength() || 600;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      });
      iconsRef.current.filter(Boolean).forEach((iconGroup) => gsap.set(iconGroup, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 }));
    },
  }));

  return (
    <svg
      viewBox="0 0 540 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none block h-full w-full select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="orbit-service-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
        </filter>
        <radialGradient id="growth-hub-fill" cx="0" cy="0" r="1" gradientTransform="translate(270 220) rotate(90) scale(46)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16A34A" stopOpacity="0.24" />
          <stop offset="1" stopColor="#16A34A" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* Orbit rings and subtle service connections */}
      <g ref={orbitRef}>
        <ellipse cx="270" cy="220" rx="185" ry="127" stroke="#16A34A" strokeOpacity=".16" strokeWidth="1.5" strokeDasharray="2 11" />
        <ellipse cx="270" cy="220" rx="126" ry="77" stroke="#16A34A" strokeOpacity=".11" strokeWidth="1" />
        <path ref={(node) => { if (node) orbitPathRefs.current[0] = node; }} d="M 102 220 C 146 207 182 215 229 220" stroke="#16A34A" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(node) => { if (node) orbitPathRefs.current[1] = node; }} d="M 190 112 C 216 141 233 165 248 188" stroke="#16A34A" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(node) => { if (node) orbitPathRefs.current[2] = node; }} d="M 270 328 L 270 260" stroke="#16A34A" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(node) => { if (node) orbitPathRefs.current[3] = node; }} d="M 350 112 C 324 141 307 165 292 188" stroke="#16A34A" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
        <path ref={(node) => { if (node) orbitPathRefs.current[4] = node; }} d="M 438 220 C 394 207 358 215 311 220" stroke="#16A34A" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Shared growth hub */}
      <g ref={coreRef}>
        <circle cx="270" cy="220" r="48" fill="url(#growth-hub-fill)" />
        <circle cx="270" cy="220" r="31" fill="#141E18" stroke="#16A34A" strokeOpacity=".75" strokeWidth="1.5" />
        <path d="M 255 234 L 255 224 L 265 224 L 265 216 L 275 216 L 275 207 L 285 207" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 278 207 H 285 V 214" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g ref={iconsOrbitRef}>
      {SLOTS.map((slot, index) => (
        <g key={slot.id} transform={`translate(${slot.x}, ${slot.y})`}>
          <circle r="28" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="2 6" fill="none" opacity=".25" />
          <circle ref={(node) => { if (node) pulseRingsRef.current[index] = node; }} r="28" stroke="#16A34A" strokeWidth="2" fill="none" opacity="0" />
          <g ref={(node) => { if (node) iconsRef.current[index] = node; }} filter="url(#orbit-service-shadow)">
            <circle r="24" fill="#141E18" stroke="#16A34A" strokeWidth="2" />
            {slot.id === 'marketing' && (
              <g transform="translate(-10,-10)" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h5l6-5v14l-6-5H3z" fill="#16A34A" fillOpacity=".18" />
                <path d="M6 12v4.5M17 7.5c1 1.2 1 3.8 0 5" stroke="#16A34A" strokeWidth="2" />
              </g>
            )}
            {slot.id === 'branding' && (
              <g transform="translate(-10,-10)" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2l6 6-7 9H3v-6z" fill="#16A34A" fillOpacity=".18" />
                <circle cx="10" cy="9" r="1.5" fill="#16A34A" />
                <path d="M3 17l5.5-7" />
              </g>
            )}
            {slot.id === 'website' && (
              <g transform="translate(-11,-9)" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="18" height="14" rx="2.5" fill="#16A34A" fillOpacity=".18" />
                <path d="M2 6.5h18M5.5 10.5h6" />
                <circle cx="5" cy="4.2" r=".8" fill="#16A34A" />
                <circle cx="8" cy="4.2" r=".8" fill="#16A34A" />
                <circle cx="11" cy="4.2" r=".8" fill="#16A34A" />
              </g>
            )}
            {slot.id === 'performance' && (
              <g transform="translate(-10,-10)" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="10" cy="10" r="7.5" fill="#16A34A" fillOpacity=".18" />
                <circle cx="10" cy="10" r="4.2" stroke="#16A34A" strokeWidth="1.6" />
                <circle cx="10" cy="10" r="1.5" fill="#16A34A" stroke="none" />
                <path d="M10 1v2.5m0 13V19M1 10h2.5m13 0H19" />
              </g>
            )}
            {slot.id === 'offline' && (
              <g transform="translate(-10,-10)" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="16" height="11" rx="1.5" fill="#16A34A" fillOpacity=".18" />
                <path d="M6 13l-2 5m10-5 2 5M5.5 7.5h9" />
              </g>
            )}
          </g>
        </g>
      ))}
      </g>
    </svg>
  );
});
