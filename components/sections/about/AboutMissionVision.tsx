'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionLabel } from './SectionLabel';

type Panel = 'mission' | 'vision' | null;

export const AboutMissionVision: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const missionBarsRef = useRef<SVGRectElement[]>([]);
  const reduced = useReducedMotion();
  const [activePanel, setActivePanel] = useState<Panel>(null);

  useGSAP(() => {
    if (reduced || !sectionRef.current) return;
    registerGsapPlugins();
    const panels = [missionRef.current, visionRef.current].filter((panel): panel is HTMLElement => Boolean(panel));
    gsap.fromTo(panels, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.9,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
    });
    panels.forEach((panel) => {
      const words = panel.querySelectorAll<HTMLElement>('[data-panel-word]');
      gsap.fromTo(words, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.045,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: panel, start: 'top 78%', once: true },
      });
    });
    gsap.fromTo(missionBarsRef.current.filter(Boolean), { scaleY: 0, transformOrigin: '50% 100%' }, {
      scaleY: 1,
      duration: 0.55,
      stagger: 0.12,
      ease: 'back.out(1.5)',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
    });
  }, { dependencies: [reduced], revertOnUpdate: true });

  const canExpand = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  const panelGrow = (panel: Panel) => activePanel === null ? 1 : activePanel === panel ? 1.35 : 1;

  return (
    <section ref={sectionRef} className="overflow-x-clip bg-[#0B0F0D]">
      <div className="flex flex-col lg:flex-row min-h-0 lg:min-h-[34rem]">
        <article
          ref={missionRef}
          aria-labelledby="about-mission-title"
          tabIndex={0}
          onMouseEnter={() => { if (canExpand()) setActivePanel('mission'); }}
          onMouseLeave={() => setActivePanel(null)}
          onFocus={() => { if (canExpand()) setActivePanel('mission'); }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActivePanel(null); }}
          style={{ flexGrow: panelGrow('mission') }}
          className="about-split-panel relative isolate flex min-h-[27rem] flex-col justify-center overflow-hidden bg-[#16A34A] px-[7%] py-16 text-[#0B0F0D] outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#0B0F0D] lg:min-h-[34rem] lg:basis-0 lg:flex-1"
        >
          <MissionArt barsRef={missionBarsRef} />
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            <SectionLabel tone="green">{aboutContent.mission.eyebrow}</SectionLabel>
            <h2 id="about-mission-title" className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
              <span data-panel-word className="inline-block">Making</span>{' '}
              <span data-panel-word className="inline-block">Business</span>{' '}
              <span data-panel-word className="inline-block px-[0.08em] underline decoration-[#0B0F0D] decoration-[0.12em] underline-offset-[0.16em]">Growth</span>{' '}
              <span data-panel-word className="inline-block px-[0.08em] underline decoration-[#0B0F0D] decoration-[0.12em] underline-offset-[0.16em]">Easier.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#0B0F0D]/85 sm:text-lg">{aboutContent.mission.text}</p>
          </div>
        </article>

        <article
          ref={visionRef}
          aria-labelledby="about-vision-title"
          tabIndex={0}
          onMouseEnter={() => { if (canExpand()) setActivePanel('vision'); }}
          onMouseLeave={() => setActivePanel(null)}
          onFocus={() => { if (canExpand()) setActivePanel('vision'); }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActivePanel(null); }}
          style={{ flexGrow: panelGrow('vision') }}
          className="about-split-panel relative isolate flex min-h-[27rem] flex-col justify-center overflow-hidden bg-[#0B0F0D] px-[7%] py-16 text-white outline-none transition-[flex-grow] duration-500 ease-out focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#22C55E] lg:min-h-[34rem] lg:basis-0 lg:flex-1"
        >
          <VisionArt />
          <div className="relative z-10 mx-auto w-full max-w-2xl">
            <SectionLabel tone="ink">{aboutContent.vision.eyebrow}</SectionLabel>
            <h2 id="about-vision-title" className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
              <span data-panel-word className="inline-block">Building</span>{' '}
              <span data-panel-word className="inline-block">Brands</span>{' '}
              <span data-panel-word className="inline-block px-[0.08em] bg-[#16A34A] text-[#0B0F0D]">Without</span>{' '}
              <span data-panel-word className="inline-block px-[0.08em] bg-[#16A34A] text-[#0B0F0D]">Boundaries.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{aboutContent.vision.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
};

const MissionArt: React.FC<{ barsRef: React.MutableRefObject<SVGRectElement[]> }> = ({ barsRef }) => (
  <svg aria-hidden="true" viewBox="0 0 220 150" className="pointer-events-none absolute bottom-8 right-[8%] hidden h-36 w-52 opacity-35 sm:block">
    <path d="M10 130H205" stroke="#0B0F0D" strokeOpacity=".55" />
    {[{ x: 30, y: 100, h: 30 }, { x: 70, y: 78, h: 52 }, { x: 110, y: 55, h: 75 }, { x: 150, y: 31, h: 99 }].map((bar, index) => (
      <rect key={bar.x} ref={(node) => { if (node) barsRef.current[index] = node; }} x={bar.x} y={bar.y} width="24" height={bar.h} rx="4" fill="#0B0F0D" />
    ))}
    <path d="M170 37l18-13m-18 0 18 0v13" fill="none" stroke="#0B0F0D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VisionArt: React.FC = () => (
  <svg aria-hidden="true" viewBox="0 0 260 170" className="pointer-events-none absolute bottom-4 right-[7%] hidden h-44 w-64 overflow-visible opacity-35 sm:block">
    <g fill="none" stroke="#22C55E" strokeWidth="1.5">
      <path d="M20 150a110 110 0 0 1 220 0" />
      <path d="M48 150a82 82 0 0 1 164 0" />
      <path d="M76 150a54 54 0 0 1 108 0" />
    </g>
    <g className="about-orbit" style={{ transformOrigin: '130px 150px' }}>
      <circle cx="20" cy="150" r="4" fill="#B6F23D" />
      <circle cx="240" cy="150" r="3" fill="#22C55E" />
    </g>
    <style>{'@keyframes about-orbit{to{transform:rotate(360deg)}} .about-orbit{animation:about-orbit 24s linear infinite} @media(prefers-reduced-motion:reduce){.about-orbit{animation:none!important}}'}</style>
  </svg>
);
