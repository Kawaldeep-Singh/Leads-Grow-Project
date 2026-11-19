'use client';

import { useRef, type PointerEvent } from 'react';
import type { ServiceChannel } from '@/data/servicePages/types';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { ChannelScenes } from './ChannelScenes';

type ChannelDialProps = {
  channels: readonly ServiceChannel[];
  activeIndex: number;
  inView: boolean;
  reducedMotion: boolean;
  onActivate: (index: number) => void;
};

export function ChannelDial({ channels, activeIndex, inView, reducedMotion, onActivate }: ChannelDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const tiltXRef = useRef<((value: number) => void) | null>(null);
  const tiltYRef = useRef<((value: number) => void) | null>(null);

  useGSAP(() => {
    registerGsapPlugins();
    const dial = dialRef.current;
    if (!dial || reducedMotion) return;
    tiltXRef.current = gsap.quickTo(dial, 'rotationX', { duration: 0.8, ease: 'power2.out' });
    tiltYRef.current = gsap.quickTo(dial, 'rotationY', { duration: 0.8, ease: 'power2.out' });
    return () => {
      tiltXRef.current = null;
      tiltYRef.current = null;
      gsap.killTweensOf(dial, 'rotationX,rotationY');
    };
  }, { scope: dialRef, dependencies: [reducedMotion], revertOnUpdate: true });

  useGSAP(() => {
    registerGsapPlugins();
    const dial = dialRef.current;
    const activeSpoke = dial?.querySelector<SVGPathElement>(`[data-active-spoke="${activeIndex}"]`);
    if (!activeSpoke) return;
    if (reducedMotion) {
      gsap.set(activeSpoke, { strokeDashoffset: 0 });
      return;
    }
    if (!inView) {
      gsap.set(activeSpoke, { strokeDashoffset: 1 });
      return;
    }
    gsap.fromTo(activeSpoke, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' });
  }, { scope: dialRef, dependencies: [activeIndex, inView, reducedMotion], revertOnUpdate: true });

  useGSAP(() => {
    registerGsapPlugins();
    const dots = dialRef.current?.querySelectorAll<SVGCircleElement>('[data-lead-index]');
    if (!dots?.length || reducedMotion || !inView) return;
    const tweens = Array.from(dots, (dot, index) => {
      const x = Number(dot.dataset.leadX) * 420;
      const y = Number(dot.dataset.leadY) * 420;
      return gsap.fromTo(dot, { x, y, opacity: 0.8 }, {
        x: x * 0.48,
        y: y * 0.48,
        opacity: 0,
        duration: 2.4,
        delay: index * 0.2,
        ease: 'none',
        repeat: -1,
      });
    });
    return () => tweens.forEach((tween) => tween.kill());
  }, { scope: dialRef, dependencies: [inView, reducedMotion], revertOnUpdate: true });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch' || !dialRef.current) return;
    const bounds = dialRef.current.getBoundingClientRect();
    const nx = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const ny = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
    tiltXRef.current?.(Math.max(-4, Math.min(4, -ny * 4)));
    tiltYRef.current?.(Math.max(-4, Math.min(4, nx * 4)));
  };

  const resetTilt = () => {
    tiltXRef.current?.(0);
    tiltYRef.current?.(0);
  };

  const nodes = channels.map((channel, index) => {
    const angle = (-90 + index * 40) * Math.PI / 180;
    const radius = 42;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { channel, index, x, y };
  });

  return (
    <div className="channel-dial-wrap">
      <div
        ref={dialRef}
        className="channel-dial"
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
      >
        <div className="channel-dial__orbit" aria-hidden="true" />
        <svg className="channel-dial__ring" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
          <circle cx="500" cy="500" r="420" pathLength="1" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} />
        </svg>
        <svg className="channel-dial__spokes" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="channel-spoke-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#B6F23D" />
            </linearGradient>
          </defs>
          {nodes.map(({ index }) => {
            const angle = (-90 + index * 40) * Math.PI / 180;
            const startX = 500 + Math.cos(angle) * 230;
            const startY = 500 + Math.sin(angle) * 230;
            const endX = 500 + Math.cos(angle) * 420;
            const endY = 500 + Math.sin(angle) * 420;
            return <g key={index}>
              <line x1={startX} y1={startY} x2={endX} y2={endY} className="channel-dial__spoke" />
              <line x1={startX} y1={startY} x2={endX} y2={endY} pathLength="1" strokeDasharray="1" strokeDashoffset="1" data-active-spoke={index} className="channel-dial__active-spoke" />
            </g>;
          })}
          {!reducedMotion && Array.from({ length: 12 }, (_, index) => {
            const spokeIndex = index % channels.length;
            const angle = (-90 + spokeIndex * 40) * Math.PI / 180;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const dotId = `lead-${index}`;
            return <circle key={dotId} className="channel-dial__lead" cx="500" cy="500" r="5" data-lead-index={index} data-lead-x={dx} data-lead-y={dy} />;
          })}
        </svg>
        <div className="channel-dial__hub" aria-hidden="true">
          <svg className="channel-dial__growth-arrow" viewBox="0 0 120 120" focusable="false">
            <path d="M22 84 84 22v15l16-22 0 33-9-9-56 56v-12Z" fill="#F6FAF7" fillOpacity=".1" />
          </svg>
          <ChannelScenes activeIndex={activeIndex} inView={inView} reducedMotion={reducedMotion} />
        </div>
        {nodes.map(({ channel, index, x, y }) => (
          <button
            key={channel.n}
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            data-n={channel.n}
            data-active={activeIndex === index ? 'true' : 'false'}
            className="channel-dial__node"
            style={{ left: `${x}%`, top: `${y}%` }}
            onPointerEnter={() => onActivate(index)}
            onFocus={() => onActivate(index)}
            onClick={() => onActivate(index)}
          />
        ))}
      </div>
    </div>
  );
}
