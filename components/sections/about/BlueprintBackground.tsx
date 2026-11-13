'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const BlueprintBackground: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !svgRef.current) return;
    registerGsapPlugins();
    const lines = svgRef.current.querySelectorAll('.blueprint-draw');
    gsap.fromTo(lines, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }, { dependencies: [reduced], revertOnUpdate: true });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,0.045)_1px,transparent_1px)] bg-[size:32px_32px] lg:bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,163,74,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,163,74,0.07)_1px,transparent_1px)] bg-[size:320px_320px] lg:bg-[size:320px_320px]" />
      <svg ref={svgRef} className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <g fill="none" stroke="#0B0F0D" strokeOpacity=".18" strokeWidth="1">
          <path className="blueprint-draw" pathLength="1" strokeDasharray="1" d="M96 180H360V260" />
          <path className="blueprint-draw" pathLength="1" strokeDasharray="1" d="M1020 160H1300V250" />
          <path className="blueprint-draw" pathLength="1" strokeDasharray="1" d="M160 750H440" />
          <path className="blueprint-draw" pathLength="1" strokeDasharray="1" d="M1050 740H1320" />
          <path className="blueprint-draw" pathLength="1" strokeDasharray="1" d="M110 172v16m-8-8h16M1300 152v16m-8-8h16M160 742v16m-8-8h16M1320 732v16m-8-8h16" />
        </g>
        <g fill="#16A34A" fillOpacity=".65">
          <path d="M72 68h12v2H72zm5-5h2v12h-2z" />
          <path d="M1356 68h12v2h-12zm5-5h2v12h-2z" />
          <path d="M72 828h12v2H72zm5-5h2v12h-2z" />
          <path d="M1356 828h12v2h-12zm5-5h2v12h-2z" />
        </g>
      </svg>
    </div>
  );
};
