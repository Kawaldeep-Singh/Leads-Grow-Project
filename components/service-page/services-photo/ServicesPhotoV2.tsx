'use client';

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type FocusEvent as ReactFocusEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import type { CreativeDesigningContent } from '@/data/servicePages/creative-designing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { Eyebrow } from '../ServiceUI';
import { PhotoBadge, playServiceIconMotion } from './PhotoBadge';
import { ServicesViewToggle, type ServicesView } from './ServicesViewToggle';
import { serviceIcons } from './serviceIcons';

const unsplash = (photoId: string) => `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=82`;
const servicePhotos = [
  unsplash('photo-1565688006131-db1d8c6a82eb'), // Brand identity sketches
  unsplash('photo-1716471330475-f0669db8947a'), // Graphic design color swatches
  unsplash('photo-1744135994997-670bf75f1d0e'), // Social content shoot
  unsplash('photo-1551288049-bebda4e38f71'), // Campaign performance analytics
  unsplash('photo-1675098978602-8924eb1856aa'), // Content writing workspace
  unsplash('photo-1767449441925-737379bc2c4d'), // Mobile app interface design
  unsplash('photo-1498050108023-c5249f4df085'), // Website development workspace
  unsplash('photo-1708005568574-842c3ce998e0'), // Editorial print layout
  unsplash('photo-1758691736483-5f600b509962'), // Presentation with charts
  unsplash('photo-1749410342681-3510f9edb7ad'), // Video editing workstation
];
const tileSizes = [
  'min-h-[310px] sm:min-h-[370px] lg:min-h-[450px]',
  'min-h-[230px] sm:min-h-[280px] lg:min-h-[320px]',
  'min-h-[230px] sm:min-h-[280px] lg:min-h-[320px]',
  'min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]',
  'min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]',
  'min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]',
  'min-h-[250px] sm:min-h-[310px] lg:min-h-[370px]',
  'min-h-[250px] sm:min-h-[310px] lg:min-h-[370px]',
  'min-h-[250px] sm:min-h-[310px] lg:min-h-[370px]',
  'col-span-2 md:col-span-6 lg:col-span-12 min-h-[180px] sm:min-h-[210px] lg:min-h-[220px]',
];

export function ServicesPhotoV2({ content, onChangeView }: { content: CreativeDesigningContent; onChangeView: (view: ServicesView) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<HTMLElement[]>([]);
  const imageFrameRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const nameRefs = useRef<HTMLSpanElement[]>([]);
  const badgeRefs = useRef<HTMLSpanElement[]>([]);
  const [brokenPhotos, setBrokenPhotos] = useState<number[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    const tiles = tileRefs.current.filter(Boolean);
    const frames = imageFrameRefs.current.filter(Boolean);
    const names = nameRefs.current.filter(Boolean);
    const badges = badgeRefs.current.filter(Boolean);
    if (!tiles.length || reducedMotion) return;

    const entrance = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } });
    entrance.fromTo(tiles, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .62, stagger: .07, ease: 'expo.out' })
      .fromTo(names, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .38, stagger: .045, ease: 'expo.out' }, '-=.18')
      .fromTo(badges, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .5, stagger: .06, ease: 'back.out(2)' }, '+=.02');

    frames.forEach((frame, index) => {
      const image = imageRefs.current[index];
      if (image) gsap.fromTo(frame, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: tileRefs.current[index], start: 'top bottom', end: 'bottom top', scrub: .35, invalidateOnRefresh: true } });
    });
    return () => entrance.scrollTrigger?.kill();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  const markBroken = (index: number) => setBrokenPhotos((current) => current.includes(index) ? current : [...current, index]);
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - .5) * 3;
    const rotateX = (.5 - (event.clientY - rect.top) / rect.height) * 3;
    gsap.to(event.currentTarget, { rotateX, rotateY, duration: .35, ease: 'power2.out', overwrite: true });
  };
  const resetPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    gsap.to(event.currentTarget, { rotateX: 0, rotateY: 0, duration: .45, ease: 'power2.out', overwrite: true });
  };

  return <section ref={sectionRef} aria-labelledby="creative-services-title" className="relative overflow-hidden bg-[#0B0F0D] py-16 text-white sm:py-20 lg:py-24">
    <div className="mx-auto w-[90%] max-w-[1280px]">
      <div className="flex flex-wrap items-center justify-between gap-4"><Eyebrow>{content.services.eyebrow}</Eyebrow><ServicesViewToggle value="v2" onChange={onChangeView}/></div>
      <h2 id="creative-services-title" className="mt-5 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.services.title}</h2>
      <p className="mt-4 max-w-[44em] text-base leading-[1.7] text-white/[.74] sm:text-[18px]">{content.services.text}</p>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-6 lg:grid-cols-12 lg:gap-6">
        {content.services.items.map((name, index) => {
          const failed = brokenPhotos.includes(index);
          const wide = index === 9;
          return <li key={name} className={`${tileSizes[index]} ${wide ? '' : 'md:col-span-3 lg:col-span-4'} min-w-0 transition-opacity duration-300`} style={{ opacity: hovered !== null && hovered !== index ? .72 : 1 }}>
            <article ref={(node) => { if (node) tileRefs.current[index] = node; }} tabIndex={0} onPointerMove={handlePointerMove} onPointerLeave={(event) => { resetPointer(event); setHovered(null); }} onMouseEnter={() => { if (matchMedia('(hover: hover) and (pointer: fine)').matches) setHovered(index); }} onFocus={(event) => { setHovered(index); const info = serviceIcons[(index + 1) as keyof typeof serviceIcons]; const icon = event.currentTarget.querySelector<SVGSVGElement>('[data-service-photo-icon]'); if (info && icon) playServiceIconMotion(icon, info.motion, reducedMotion); }} onBlur={(event: ReactFocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null); }} className="group/tile relative isolate h-full min-h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#111815] shadow-[0_20px_48px_rgba(0,0,0,.24)] outline-none transition-[border-color,box-shadow,transform] duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-[#22C55E]/65 motion-safe:hover:shadow-[0_26px_60px_rgba(0,0,0,.38)] focus-visible:border-[#B6F23D] focus-visible:ring-2 focus-visible:ring-[#B6F23D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F0D]" style={{ perspective: 900 }}>
              {!failed && <div ref={(node) => { if (node) imageFrameRefs.current[index] = node; }} aria-hidden="true" className="absolute inset-0 overflow-hidden"><img ref={(node) => { if (node) imageRefs.current[index] = node; }} src={servicePhotos[index]} alt="" loading="lazy" onError={() => markBroken(index)} className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover/tile:scale-[1.07] motion-safe:group-focus-visible/tile:scale-[1.04]"/></div>}
              <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-500 ${failed ? 'bg-gradient-to-br from-[#0B0F0D] via-[#10331F] to-[#16A34A]' : 'bg-gradient-to-t from-[#0B0F0D]/95 via-[#0B0F0D]/20 to-[#0B0F0D]/5 group-hover/tile:from-[#0B0F0D]/95 group-hover/tile:via-[#0B0F0D]/42'}`}/>
              {failed && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[7%] flex justify-center"><PhotoBadge number={index + 1} large/></div>}
              <span aria-hidden="true" className="absolute left-4 top-4 z-10 rounded-full border border-white/25 bg-[#0B0F0D]/45 px-3 py-1 font-mono text-[10px] font-semibold tracking-[.16em] text-white/90 backdrop-blur-md">{String(index + 1).padStart(2, '0')}</span>
              <span aria-hidden="true" className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/30 bg-[#0B0F0D]/35 text-white backdrop-blur-md transition duration-300 group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:border-[#B6F23D] group-hover/tile:bg-[#B6F23D] group-hover/tile:text-[#0B0F0D]"><ArrowUpRight className="size-4"/></span>
              <div className={`absolute inset-x-0 bottom-0 z-10 flex ${wide ? 'flex-row items-end gap-4' : 'flex-col items-start'} p-6`}>
                <span ref={(node) => { if (node) badgeRefs.current[index] = node; }} className={wide ? '' : 'mb-3 sm:mb-4'}><PhotoBadge number={index + 1} wide={wide}/></span>
                <span ref={(node) => { if (node) nameRefs.current[index] = node; }} className={`max-w-[24ch] font-display font-bold leading-snug text-white ${wide ? 'text-[17px] sm:text-xl' : 'text-[14px] sm:text-[17px]'}`}>{name}</span>
              </div>
            </article>
          </li>;
        })}
      </ul>
    </div>
  </section>;
}
