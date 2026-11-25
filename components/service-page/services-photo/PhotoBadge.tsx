'use client';

import { useRef } from 'react';
import type { TweenVars } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap } from '@/lib/gsap-register';
import { serviceIcons, type ServiceIconMotion } from './serviceIcons';

export function playServiceIconMotion(node: SVGSVGElement | null, motion: ServiceIconMotion, reducedMotion: boolean) {
  if (!node || reducedMotion) return;
  const fromTo = (from: TweenVars, to: TweenVars) => gsap.fromTo(node, from, { ...to, duration: .68, ease: 'power2.out', overwrite: true });
  switch (motion) {
    case 'draw': fromTo({ rotate: -8, scale: .92 }, { rotate: 0, scale: 1.08 }); break;
    case 'spin': fromTo({ rotate: 0 }, { keyframes: [{ rotate: 20, duration: .28 }, { rotate: 0, duration: .36 }] }); break;
    case 'pulse': fromTo({ scale: 1 }, { keyframes: [{ scale: 1.2, duration: .16 }, { scale: 1, duration: .16 }, { scale: 1.2, duration: .16 }, { scale: 1, duration: .2 }] }); break;
    case 'shake': fromTo({ rotate: 0 }, { keyframes: [{ rotate: -10, duration: .11 }, { rotate: 6, duration: .11 }, { rotate: -10, duration: .11 }, { rotate: 6, duration: .11 }, { rotate: -10, duration: .11 }, { rotate: 0, duration: .13 }] }); break;
    case 'write': fromTo({ x: 0, rotate: 0 }, { keyframes: [{ x: 4, rotate: 4, duration: .3 }, { x: 0, rotate: 0, duration: .35 }] }); break;
    case 'click': fromTo({ x: -3, y: -3, scale: .92 }, { x: 0, y: 0, scale: 1.08 }); break;
    case 'slide': fromTo({ y: -4, scale: .95 }, { y: 0, scale: 1.08 }); break;
    case 'flip': fromTo({ rotateY: 0, transformPerspective: 400 }, { keyframes: [{ rotateY: 180, duration: .32 }, { rotateY: 0, duration: .36 }] }); break;
    case 'grow': fromTo({ scaleY: 1, transformOrigin: '50% 100%' }, { keyframes: [{ scaleY: 1.12, duration: .32 }, { scaleY: 1, duration: .36 }] }); break;
    case 'clap': fromTo({ rotate: -12, transformOrigin: '0% 0%' }, { rotate: 0, scale: 1.08 }); break;
  }
}

export function PhotoBadge({ number, large = false, wide = false }: { number: number; large?: boolean; wide?: boolean }) {
  const iconRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  const item = serviceIcons[number as keyof typeof serviceIcons];
  if (!item) return null;
  const { Icon, motion } = item;

  if (large) return <span aria-hidden="true" className="pointer-events-none grid size-24 place-items-center text-[#B6F23D]/[.9]"><Icon ref={iconRef} className="size-24" strokeWidth={1.5}/></span>;

  return <span aria-hidden="true" onMouseEnter={() => playServiceIconMotion(iconRef.current, motion, reducedMotion)} className={`grid shrink-0 place-items-center border border-white/[.28] bg-white/[.14] text-white shadow-[0_8px_20px_rgba(0,0,0,.12)] backdrop-blur-[10px] transition-[background,color,border,transform] duration-300 motion-safe:group-hover/tile:-translate-y-1 motion-safe:group-focus-visible/tile:-translate-y-1 group-hover/tile:border-transparent group-hover/tile:bg-[#B6F23D] group-hover/tile:text-[#0B0F0D] group-focus-visible/tile:border-transparent group-focus-visible/tile:bg-[#B6F23D] group-focus-visible/tile:text-[#0B0F0D] ${wide ? 'size-14 rounded-[18px]' : 'size-10 rounded-[14px] sm:size-12 sm:rounded-[18px]'}`}>
    <Icon ref={iconRef} data-service-photo-icon="true" aria-hidden="true" focusable="false" className={`${wide ? 'size-7' : 'size-5 sm:size-6'}`} strokeWidth={1.8}/>
  </span>;
}
