'use client';

import { useEffect, useRef } from 'react';
import { ServiceIcon, type ServiceIconName } from './OrbitScene';

const serviceIcons: ServiceIconName[] = ['megaphone', 'branding', 'website', 'performance', 'offline'];
const roofStarts = [[72, 78], [420, 82], [82, 340], [418, 342], [250, 54]];
const roofSlots = [158, 205, 250, 295, 342];
const barHeights = [75, 116, 158, 204, 255];

function SceneOneRoof() {
  return (
    <svg viewBox="0 0 500 420" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="roof-stroke" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#16A34A" /><stop offset="100%" stopColor="#B6F23D" /></linearGradient>
      </defs>
      <g data-roof-final opacity="0">
        <path data-roof-outline d="M100 190 250 70 400 190M132 170v190h236V170" fill="none" stroke="url(#roof-stroke)" strokeWidth="3" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
        {roofSlots.map((x) => <rect key={x} data-roof-slot x={x - 15} y="224" width="30" height="52" rx="5" fill="#0B0F0D" stroke="#16A34A" strokeWidth="1.5" />)}
      </g>
      <g data-roof-flying>
        {serviceIcons.map((icon, index) => (
          <g key={icon} data-roof-icon transform={`translate(${roofStarts[index][0]} ${roofStarts[index][1]})`}>
            <circle r="23" fill="#F6FAF7" stroke="#16A34A" strokeWidth="1.5" />
            <ServiceIcon name={icon} x={-13} y={-13} size={26} className="text-[#0B0F0D]" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function SceneThreeForces() {
  return (
    <svg viewBox="0 0 500 420" className="h-full w-full overflow-visible" aria-hidden="true">
      <circle data-force="creativity" cx="115" cy="140" r="108" fill="#22C55E" fillOpacity="0.3" stroke="#16A34A" strokeWidth="2" style={{ mixBlendMode: 'multiply' }} />
      <circle data-force="technology" cx="385" cy="140" r="108" fill="#0B0F0D" fillOpacity="0.19" stroke="#0B0F0D" strokeWidth="2" style={{ mixBlendMode: 'multiply' }} />
      <circle data-force="strategy" cx="250" cy="355" r="108" fill="#B6F23D" fillOpacity="0.34" stroke="#93C91F" strokeWidth="2" style={{ mixBlendMode: 'multiply' }} />
      <circle data-force-glow cx="250" cy="236" r="22" fill="#B6F23D" opacity="0" filter="drop-shadow(0 0 18px rgba(34,197,94,.7))" />
      <g data-force-arrow opacity="0" transform="translate(250 236) scale(0)">
        <path d="M-25 10 25-18M7-18h18v18" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function SceneSeedToSkyline() {
  return (
    <svg viewBox="0 0 500 420" className="h-full w-full overflow-visible" aria-hidden="true">
      <path d="M54 342H452" stroke="#0B0F0D" strokeOpacity="0.2" strokeWidth="2" />
      {barHeights.map((height, index) => <rect key={height} data-growth-bar={index} x={80 + index * 68} y={342 - height} width="38" height={height} rx="4" fill={index > 2 ? '#22C55E' : '#16A34A'} opacity="0.82" />)}
      <path data-growth-chart d="M65 310 145 276 213 240 281 184 349 140 430 76" fill="none" stroke="#B6F23D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      <g data-growth-arrow opacity="0" transform="translate(430 76) scale(0)">
        <path d="m-20 14 20-28M-7-14H0v8" fill="none" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path data-growth-spark d="M430 55 434 68 447 72 434 76 430 89 426 76 413 72 426 68Z" fill="#B6F23D" opacity="0" />
      <circle data-growth-seed cx="65" cy="310" r="7" fill="#22C55E" />
    </svg>
  );
}

const renderers = [SceneOneRoof, SceneThreeForces, SceneSeedToSkyline];

export function StoryScenes({ chapter, final = false, className = '' }: { chapter: number; final?: boolean; className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const Scene = renderers[chapter];
  useEffect(() => {
    if (final && sceneRef.current) renderStoryScene(sceneRef.current, chapter, 1);
  }, [chapter, final]);
  return (
    <div ref={sceneRef} data-story-scene={chapter} data-final={final ? 'true' : 'false'} className={`relative ${className}`} aria-hidden="true">
      <Scene />
    </div>
  );
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function renderStoryScene(scene: HTMLElement, chapter: number, progress: number) {
  const local = clamp(progress);
  if (chapter === 0) {
    const flying = scene.querySelector<SVGGElement>('[data-roof-flying]');
    const finalGroup = scene.querySelector<SVGGElement>('[data-roof-final]');
    const outline = scene.querySelector<SVGPathElement>('[data-roof-outline]');
    const icons = [...scene.querySelectorAll<SVGGElement>('[data-roof-icon]')];
    flying?.setAttribute('opacity', String(1 - clamp((local - 0.58) / 0.28)));
    finalGroup?.setAttribute('opacity', String(clamp((local - 0.42) / 0.4)));
    outline?.setAttribute('stroke-dashoffset', String(1 - clamp((local - 0.42) / 0.48)));
    scene.querySelectorAll<SVGRectElement>('[data-roof-slot]').forEach((slot, index) => slot.setAttribute('opacity', String(clamp((local - 0.55 - index * 0.025) / 0.25))));
    icons.forEach((icon, index) => {
      const [sx, sy] = roofStarts[index];
      const tx = roofSlots[index];
      const ty = 250;
      const t = clamp(local / 0.72);
      const x = sx + (tx - sx) * t;
      const y = sy + (ty - sy) * t;
      icon.setAttribute('transform', `translate(${x} ${y})`);
    });
    return;
  }
  if (chapter === 1) {
    const centers = [[188, 202], [312, 202], [250, 278]];
    const starts = [[108, 116], [392, 116], [250, 368]];
    (['creativity', 'technology', 'strategy'] as const).forEach((name, index) => {
      const circle = scene.querySelector<SVGCircleElement>(`[data-force="${name}"]`);
      if (!circle) return;
      const t = clamp(local / 0.82);
      circle.setAttribute('cx', String(starts[index][0] + (centers[index][0] - starts[index][0]) * t));
      circle.setAttribute('cy', String(starts[index][1] + (centers[index][1] - starts[index][1]) * t));
    });
    const arrow = scene.querySelector<SVGGElement>('[data-force-arrow]');
    const glow = scene.querySelector<SVGCircleElement>('[data-force-glow]');
    const arrowProgress = clamp((local - 0.55) / 0.35);
    arrow?.setAttribute('opacity', String(arrowProgress));
    arrow?.setAttribute('transform', `translate(250 226) scale(${arrowProgress})`);
    if (glow) glow.setAttribute('opacity', String(arrowProgress * 0.85));
    return;
  }

  scene.querySelectorAll<SVGRectElement>('[data-growth-bar]').forEach((bar, index) => {
    const height = barHeights[index] * local;
    bar.setAttribute('y', String(342 - height));
    bar.setAttribute('height', String(height));
  });
  const chart = scene.querySelector<SVGPathElement>('[data-growth-chart]');
  chart?.setAttribute('stroke-dashoffset', String(1 - local));
  chart?.setAttribute('opacity', String(clamp(local * 1.5)));
  const seed = scene.querySelector<SVGCircleElement>('[data-growth-seed]');
  seed?.setAttribute('r', String(7 + local * 3));
  const arrow = scene.querySelector<SVGGElement>('[data-growth-arrow]');
  const arrowProgress = clamp((local - 0.65) / 0.35);
  arrow?.setAttribute('opacity', String(arrowProgress));
  arrow?.setAttribute('transform', `translate(430 76) scale(${arrowProgress})`);
  scene.querySelector<SVGPathElement>('[data-growth-spark]')?.setAttribute('opacity', String(clamp((local - 0.92) / 0.08)));
}
