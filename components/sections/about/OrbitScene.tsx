'use client';

import { useRef, type Ref } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';

export type ServiceIconName = 'megaphone' | 'branding' | 'website' | 'performance' | 'offline';

export function ServiceIcon({ name, className = 'h-6 w-6', svgRef, x, y, size }: { name: ServiceIconName; className?: string; svgRef?: Ref<SVGSVGElement>; x?: number; y?: number; size?: number }) {
  const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg ref={svgRef} x={x} y={y} width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true" {...shared}>
      {name === 'megaphone' && <><path d="M4 14h5l14-7v18L9 18H4z" /><path d="m10 19 3 8h5l-4-10M27 12c2 2 2 6 0 8" /></>}
      {name === 'branding' && <><path d="m6 25 3-8L22 4l6 6-13 13z" /><path d="m18 8 6 6M6 25l7-2-5-5z" /></>}
      {name === 'website' && <><rect x="4" y="5" width="24" height="22" rx="3" /><path d="M4 11h24M9 8h.1M13 8h.1M17 8h.1" /></>}
      {name === 'performance' && <><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="7" /><circle cx="16" cy="16" r="2" /><path d="m16 16 9-9M20 7h5v5" /></>}
      {name === 'offline' && <><path d="M5 7h22v15H5zM9 22v5m14-5v5M7 27h18M9 11h14M9 15h10" /><path d="M6 4h20" /></>}
    </svg>
  );
}

const serviceNodes: { icon: ServiceIconName; left: number; top: number }[] = [
  { icon: 'megaphone', left: 50, top: 0 },
  { icon: 'branding', left: 97.6, top: 34.5 },
  { icon: 'website', left: 79.4, top: 90.5 },
  { icon: 'performance', left: 20.6, top: 90.5 },
  { icon: 'offline', left: 2.4, top: 34.5 },
];

const RING_LENGTH = 1696.5;

export function OrbitScene({ introReady, reducedMotion }: { introReady: boolean; reducedMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const tickRefs = useRef<SVGLineElement[]>([]);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<HTMLDivElement[]>([]);
  const iconRefs = useRef<SVGSVGElement[]>([]);
  const rippleRefs = useRef<SVGCircleElement[]>([]);
  const arrowGroupRef = useRef<SVGGElement>(null);
  const arrowMaskRef = useRef<SVGRectElement>(null);
  const sparkRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    registerGsapPlugins();
    const root = rootRef.current;
    const ring = ringRef.current;
    const arrowGroup = arrowGroupRef.current;
    const arrowMask = arrowMaskRef.current;
    if (!root || !ring || !arrowGroup || !arrowMask || reducedMotion || !introReady) return;

    let inView = false;
    let introComplete = false;
    const context = gsap.context(() => {
      const ticks = tickRefs.current.filter(Boolean);
      const nodes = nodeRefs.current.filter(Boolean);
      const icons = iconRefs.current.filter(Boolean);
      const ripples = rippleRefs.current.filter(Boolean);
      const sceneRect = root.getBoundingClientRect();

      arrowMask.setAttribute('width', '0');
      const nodeStarts = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: sceneRect.left + sceneRect.width / 2 - rect.left - rect.width / 2, y: sceneRect.top + sceneRect.height / 2 - rect.top - rect.height / 2 };
      });
      let startIdle = () => {};
      const timeline = gsap.timeline({ onComplete: () => { introComplete = true; if (inView) startIdle(); } });
      timeline.fromTo(ring,
        { strokeDasharray: RING_LENGTH, strokeDashoffset: RING_LENGTH },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
        0,
      );
      timeline.fromTo(ticks,
        { scale: 0, opacity: 0, transformOrigin: '50% 50%' },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.02, ease: 'back.out(1.5)' },
        1.2,
      );
      timeline.fromTo(nodes,
        { opacity: 0, scale: 0, x: (_index, target) => nodeStarts[nodes.indexOf(target as HTMLDivElement)]?.x ?? 0, y: (_index, target) => nodeStarts[nodes.indexOf(target as HTMLDivElement)]?.y ?? 0 },
        { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.55, stagger: 0.1, ease: 'back.out(1.6)' },
        1.2,
      );
      timeline.fromTo(arrowMask,
        { attr: { width: 0 } },
        { attr: { width: 106 }, duration: 1.6, ease: 'power3.inOut', onComplete: () => gsap.fromTo(sparkRef.current, { opacity: 0, scale: 0.25, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(3)', onComplete: () => gsap.to(sparkRef.current, { opacity: 0, duration: 0.4, delay: 0.5, ease: 'power1.out' }) }) },
        0.9,
      );
      timeline.fromTo(arrowGroup, { y: 42 }, { y: 0, duration: 1.6, ease: 'power3.out' }, 0.9);

      const orbitTween = gsap.to(orbitRef.current, { rotation: 360, duration: 60, ease: 'none', repeat: -1, paused: true, transformOrigin: '50% 50%' });
      icons.forEach((icon) => gsap.to(icon, { rotation: -360, duration: 60, ease: 'none', repeat: -1, paused: true, transformOrigin: '50% 50%' }));
      ripples.forEach((ripple, index) => gsap.to(ripple, { scale: 1.12, opacity: 0.08, duration: 5 + index, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: index * 1.2, transformOrigin: '50% 50%', paused: true }));
      const rippleTweens = ripples.flatMap((ripple) => gsap.getTweensOf(ripple));
      startIdle = () => {
        orbitTween.play();
        rippleTweens.forEach((tween) => tween.play());
        icons.forEach((icon) => gsap.getTweensOf(icon).forEach((tween) => tween.play()));
      };

      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!introComplete) return;
        if (inView) startIdle();
        else {
          orbitTween.pause();
          rippleTweens.forEach((tween) => tween.pause());
          icons.forEach((icon) => gsap.getTweensOf(icon).forEach((tween) => tween.pause()));
        }
      }, { threshold: 0.01 });
      observer.observe(root);

      const finePointer = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
      let quickX: ((value: number) => gsap.core.Tween) | undefined;
      let quickY: ((value: number) => gsap.core.Tween) | undefined;
      const handleMove = (event: PointerEvent) => {
        if (!quickX || !quickY || !tiltRef.current) return;
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        quickY(x * 10);
        quickX(-y * 10);
      };
      const handleLeave = () => { quickX?.(0); quickY?.(0); };
      if (finePointer && tiltRef.current) {
        quickX = gsap.quickTo(tiltRef.current, 'rotationX', { duration: 0.8, ease: 'power2.out' });
        quickY = gsap.quickTo(tiltRef.current, 'rotationY', { duration: 0.8, ease: 'power2.out' });
        root.addEventListener('pointermove', handleMove);
        root.addEventListener('pointerleave', handleLeave);
      }

      return () => {
        observer.disconnect();
        root.removeEventListener('pointermove', handleMove);
        root.removeEventListener('pointerleave', handleLeave);
      };
    }, root);

    return () => context.revert();
  }, { scope: rootRef, dependencies: [introReady, reducedMotion], revertOnUpdate: true });

  return (
    <div ref={rootRef} className="relative aspect-square w-full overflow-visible" aria-hidden="true">
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.12)_0%,rgba(22,163,74,0.045)_42%,transparent_72%)] blur-2xl" />
      <div ref={tiltRef} className="relative h-full w-full [transform-style:preserve-3d]">
        <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="orbit-arrow-gradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#15803D" /><stop offset="58%" stopColor="#22C55E" /><stop offset="100%" stopColor="#B6F23D" /></linearGradient>
            <filter id="orbit-arrow-glow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <mask id="orbit-arrow-mask" maskUnits="userSpaceOnUse" x="0" y="-30" width="340" height="60"><rect ref={arrowMaskRef} x="0" y="-30" width={reducedMotion ? 106 : 0} height="60" fill="white" /></mask>
          </defs>
          <circle ref={ringRef} cx="300" cy="300" r="270" fill="none" stroke="#22C55E" strokeWidth="1.5" opacity={reducedMotion ? 0.7 : 0.65} strokeDasharray={RING_LENGTH} strokeDashoffset={reducedMotion ? 0 : RING_LENGTH} />
          <g stroke="#22C55E" strokeWidth="1.5" opacity={reducedMotion ? 0.65 : 0.5}>
            {Array.from({ length: 12 }, (_, index) => <line key={index} ref={(node) => { if (node) tickRefs.current[index] = node; }} x1="300" y1="30" x2="300" y2={index % 3 === 0 ? '10' : '18'} transform={`rotate(${index * 30} 300 300)`} style={{ opacity: reducedMotion ? 1 : 0 }} />)}
          </g>
          <circle ref={(node) => { if (node) rippleRefs.current[0] = node; }} cx="300" cy="300" r="82" fill="none" stroke="#22C55E" strokeWidth="1" opacity={reducedMotion ? 0.16 : 0.18} />
          <circle ref={(node) => { if (node) rippleRefs.current[1] = node; }} cx="300" cy="300" r="128" fill="none" stroke="#16A34A" strokeWidth="1" opacity={reducedMotion ? 0.12 : 0.14} />
          <g ref={arrowGroupRef} transform="translate(300 300)">
            <g transform="rotate(-50) scale(3.15)" filter="url(#orbit-arrow-glow)" mask="url(#orbit-arrow-mask)">
              <polygon points="100,0 80,-11.5 80,-5.4 0,0 80,5.4 80,11.5" fill="url(#orbit-arrow-gradient)" />
              <path ref={sparkRef} d="M100,-5 102,-2 105,0 102,2 100,5 98,2 95,0 98,-2Z" fill="#F4FFD6" opacity={reducedMotion ? 1 : 0} />
            </g>
          </g>
        </svg>

        <div ref={orbitRef} className="absolute inset-[5%]" style={{ transformOrigin: '50% 50%' }}>
          {serviceNodes.map((node, index) => (
            <div
              key={node.icon}
              ref={(element) => { if (element) nodeRefs.current[index] = element; }}
              className="absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#111815]/95 text-[#B6F23D] shadow-[0_0_24px_rgba(34,197,94,0.12)] sm:size-12 lg:size-14"
              style={{ left: `${node.left}%`, top: `${node.top}%`, opacity: reducedMotion ? 1 : 0 }}
            >
              <span className="flex items-center justify-center">
                <ServiceIcon name={node.icon} svgRef={(element) => { if (element) iconRefs.current[index] = element; }} className="size-[18px] sm:size-5 lg:size-6" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
