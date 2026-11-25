'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Eye, ShieldCheck, UsersRound, Trophy, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import type { CreativeDesigningContent, CreativeDesigningSection } from '@/data/servicePages/creative-designing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { AboutStory } from '@/components/sections/about/AboutStory';
import { Industries } from '@/components/sections/Industries';
import { Eyebrow } from './ServiceUI';
import { ServiceBreadcrumb } from './ServiceBreadcrumb';
import { Artboard, CursorArrow, PenHandles, Ruler, StickyNote, SwatchRow, Tape, StudioDoodle, artifactIllustrations } from './mockups/studio/StudioKit';
import { ServicesPhotoV2 } from './services-photo/ServicesPhotoV2';
import { ServicesViewToggle, type ServicesView } from './services-photo/ServicesViewToggle';

const ink = '#0B0F0D';

function HeroStudio({ reducedMotion }: { reducedMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const swatchesRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    registerGsapPlugins();
    const board = boardRef.current;
    if (!board) return;
    if (reducedMotion) {
      const elements = [board, barsRef.current, shapesRef.current, arrowRef.current, swatchesRef.current, burstRef.current, cursorRef.current].filter((element): element is Exclude<typeof element, null> => element !== null);
      gsap.set(elements, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
      return;
    }
    const entranceElements = [shapesRef.current, arrowRef.current, swatchesRef.current, burstRef.current].filter((element): element is Exclude<typeof element, null> => element !== null);
    gsap.set(entranceElements, { opacity: 0, scale: .7, y: 8, transformOrigin: '50% 50%' });
    let observerVisible = false;
    let introComplete = false;
    const float = gsap.to(board, { y: -6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
    const cursorFloat = gsap.to(cursorRef.current, { x: 4, y: -3, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true });
    const playIdle = () => { if (observerVisible && !document.hidden && introComplete) { float.play(); cursorFloat.play(); } else { float.pause(); cursorFloat.pause(); } };
    const intro = gsap.timeline({ delay: .15, onComplete: () => { introComplete = true; playIdle(); } });
    intro.fromTo(board, { y: 22, rotate: -7, opacity: 0, scale: .96 }, { y: 0, rotate: -4, opacity: 1, scale: 1, duration: .8, ease: 'expo.out' })
      .fromTo(cursorRef.current, { x: 28, y: 20, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .45, ease: 'power2.out' }, '-=.35')
      .fromTo(barsRef.current?.querySelectorAll('i') ?? [], { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: .3, stagger: .08, ease: 'power2.out' }, '+=.12')
      .fromTo(shapesRef.current, { opacity: 0, scale: .72, y: 8 }, { opacity: 1, scale: 1, y: 0, duration: .48, ease: 'back.out(1.5)' }, '+=.08')
      .fromTo(arrowRef.current, { opacity: 0, scale: .65, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: .5, ease: 'power2.inOut' }, '+=.08')
      .fromTo(swatchesRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4, ease: 'expo.out' }, '+=.05')
      .fromTo(burstRef.current, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)' }, '+=.04')
      .to(burstRef.current, { opacity: 0, scale: 1.12, duration: .35, ease: 'power2.out' });
    const observer = new IntersectionObserver(([entry]) => { observerVisible = entry.isIntersecting; playIdle(); }, { threshold: .05 });
    observer.observe(board);
    const visibility = () => { playIdle(); };
    document.addEventListener('visibilitychange', visibility);
    const onMove = (event: PointerEvent) => {
      if (!matchMedia('(min-width: 768px) and (pointer:fine)').matches || !boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      gsap.to(board, { rotateY: ((event.clientX - rect.left) / rect.width - .5) * 7, rotateX: (.5 - (event.clientY - rect.top) / rect.height) * 6, duration: .8, ease: 'power2.out', overwrite: true });
    };
    const onLeave = () => gsap.to(board, { rotateY: 0, rotateX: 0, duration: .8 });
    board.addEventListener('pointermove', onMove);
    board.addEventListener('pointerleave', onLeave);
    const out = gsap.to(rootRef.current, { scale: 1.04, opacity: .25, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'bottom 72%', end: 'bottom top', scrub: true } });
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); board.removeEventListener('pointermove', onMove); board.removeEventListener('pointerleave', onLeave); out.scrollTrigger?.kill(); float.kill(); cursorFloat.kill(); };
  }, { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return <div ref={rootRef} className="relative mx-auto flex h-[300px] w-full max-w-[590px] items-center justify-center sm:h-[380px] lg:h-[470px]">
    <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-[#16A34A]/20 blur-[70px]" />
    <div ref={boardRef} className="relative z-10 h-[76%] w-[66%] rotate-[-4deg] sm:h-[84%] sm:w-[74%]" style={{ transformStyle: 'preserve-3d' }}>
      <Artboard className="h-full w-full overflow-hidden p-5 sm:p-8">
        <div className="relative flex h-full flex-col justify-between">
          <div className="absolute right-3 top-3 flex size-24 items-center justify-center sm:right-6 sm:top-6 sm:size-32">
            <span className="absolute inset-0 rounded-full border-[3px] border-[#16A34A]/15"/><span className="absolute inset-3 rounded-full border-[3px] border-[#22C55E]/30"/><span className="absolute inset-6 rounded-full border-[3px] border-[#B6F23D]"/>
          </div>
          <div ref={barsRef} className="relative z-10 mt-2 space-y-2 sm:mt-5 sm:space-y-3"><i className="block h-2 w-1/3 rounded-full bg-[#0B0F0D]/25 sm:h-3"/><i className="block h-2 w-2/5 rounded-full bg-[#0B0F0D]/10 sm:h-3"/><i className="block h-2 w-1/4 rounded-full bg-[#0B0F0D]/10 sm:h-3"/></div>
          <div className="relative h-[45%]"><div ref={shapesRef} className="absolute inset-0"><span className="absolute bottom-1 left-[7%] size-[44%] rounded-full bg-[#B6F23D]"/><span className="absolute bottom-1 left-[37%] h-[58%] w-[35%] rounded-[36%_64%_58%_42%] bg-[#16A34A]"/><span className="absolute bottom-1 right-[5%] size-0 border-b-[80px] border-l-[42px] border-r-[42px] border-b-[#0B0F0D] border-l-transparent border-r-transparent sm:border-b-[104px] sm:border-l-[54px] sm:border-r-[54px]"/></div>
            <svg aria-hidden="true" viewBox="0 0 180 72" className="absolute -bottom-2 left-[5%] w-[95%] rotate-[-8deg]"><path ref={arrowRef} d="M4 52C46 21 76 21 102 30c23 8 37-4 65-22l-6 2 2 9 15-15-20-2 3 6C128 29 117 37 99 29 66 15 42 22 4 52Z" fill="#22C55E"/></svg>
            <svg ref={burstRef} aria-hidden="true" viewBox="0 0 80 80" className="absolute -right-4 -top-4 size-20"><circle cx="40" cy="40" r="13" fill="none" stroke="#16A34A" strokeWidth="2"/><circle cx="40" cy="40" r="25" fill="none" stroke="#22C55E" strokeWidth="2"/><circle cx="40" cy="40" r="37" fill="none" stroke="#B6F23D" strokeWidth="2"/></svg>
          </div>
          <div ref={swatchesRef} className="relative z-10 flex items-end justify-between"><SwatchRow/><Ruler className="w-1/3"/></div>
          <PenHandles className="absolute bottom-[24%] left-0 h-12 w-36 opacity-60"/>
        </div>
      </Artboard>
    </div>
    <div className="absolute left-[1%] top-[14%] hidden md:block"><StickyNote tone="lime" className="scale-75"/></div>
    <div className="absolute bottom-[12%] right-[3%] hidden md:block"><StickyNote tone="white" className="scale-75 rotate-[7deg]"/></div>
    <div ref={cursorRef} aria-hidden="true" className="absolute bottom-[16%] right-[12%] z-20 opacity-0"><CursorArrow className="h-12 w-10 drop-shadow-lg"/></div>
  </div>;
}

function CreativeHero({ content }: { content: CreativeDesigningContent }) {
  const headingLines = ['We Think.', 'We Write.', 'We Design.'];
  const reducedMotion=useReducedMotion();
  const titleRef=useRef<HTMLHeadingElement>(null);
  const lineRefs=useRef<HTMLSpanElement[]>([]);
  const thoughtRef=useRef<SVGSVGElement>(null);
  const scribbleRef=useRef<SVGPathElement>(null);
  const anchorsRef=useRef<SVGSVGElement>(null);
  useGSAP(()=>{
    registerGsapPlugins();
    const lines=lineRefs.current.filter(Boolean);
    const thought=thoughtRef.current;
    const scribble=scribbleRef.current;
    const anchors=anchorsRef.current;
    if(lines.length!==3||!thought||!scribble||!anchors)return;
    if(reducedMotion){gsap.set(lines,{opacity:1,y:0,rotateX:0});return;}
    const intro=gsap.timeline({delay:.1});
    intro.fromTo(lines,{y:38,rotateX:32,opacity:0,transformOrigin:'50% 100%'},{y:0,rotateX:0,opacity:1,duration:.72,stagger:.15,ease:'expo.out'})
      .fromTo(thought.querySelectorAll('circle'),{scale:0,transformOrigin:'center'},{scale:1,duration:.3,stagger:.09,ease:'back.out(1.7)'},'-.08')
      .fromTo(scribble,{strokeDashoffset:140},{strokeDashoffset:0,duration:.45,ease:'power2.inOut'},'-.18')
      .fromTo(anchors.querySelectorAll('rect, path'),{opacity:0,y:5},{opacity:1,y:0,duration:.35,stagger:.04,ease:'back.out(1.7)'},'-.16')
      .to(lines[2],{color:'#F6FAF7',duration:.2,repeat:1,yoyo:true,ease:'power2.inOut'},'+=.08');
  },{scope:titleRef,dependencies:[reducedMotion],revertOnUpdate:true});
  return <section aria-labelledby="creative-hero-title" className="relative isolate overflow-hidden bg-[#0B0F0D] text-white">
    <div className="mx-auto grid min-h-[100svh] w-[90%] max-w-[1280px] content-center gap-y-5 pb-12 pt-28 sm:gap-y-7 lg:grid-cols-12 lg:items-center lg:gap-x-7 lg:pb-8 lg:pt-28">
      <div className="lg:col-span-7 lg:row-start-1">
        <ServiceBreadcrumb current={content.hero.eyebrow}/>
        <h1 ref={titleRef} id="creative-hero-title" className="hero-display-title mt-7 max-[639px]:text-center">
          {headingLines.map((line, index) => <span key={line} ref={(node)=>{if(node)lineRefs.current[index]=node;}} className={`relative block transition-transform duration-300 motion-safe:hover:translate-x-1 ${index === 1 ? 'w-fit text-transparent' : ''} ${index === 2 ? 'w-fit bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent' : ''}`} style={index === 1 ? { WebkitTextStroke: '1.5px rgba(246,250,247,.9)' } : undefined}>
            {line}
            {index === 0 && <svg ref={thoughtRef} aria-hidden="true" viewBox="0 0 55 42" className="absolute -right-14 top-0 hidden h-10 w-12 sm:block"><circle cx="12" cy="12" r="3" fill="#22C55E"/><circle cx="24" cy="12" r="5" fill="#22C55E"/><circle cx="39" cy="12" r="8" fill="#22C55E"/><path d="M8 22h38v9a6 6 0 0 1-6 6H16a8 8 0 0 1-8-8v-7Z" stroke="#22C55E" fill="none"/></svg>}
            {index === 1 && <svg aria-hidden="true" viewBox="0 0 260 14" className="absolute -bottom-2 left-0 w-full"><path ref={scribbleRef} d="M3 8c66 0 138-5 253 0" fill="none" stroke="#B6F23D" strokeWidth="4" strokeLinecap="round"/></svg>}
            {index === 2 && <svg ref={anchorsRef} aria-hidden="true" viewBox="0 0 260 20" className="absolute -bottom-1 left-0 h-5 w-full"><rect x="8" y="6" width="7" height="7" fill="#F6FAF7" stroke="#0B0F0D"/><rect x="75" y="6" width="7" height="7" fill="#F6FAF7" stroke="#0B0F0D"/><rect x="150" y="6" width="7" height="7" fill="#F6FAF7" stroke="#0B0F0D"/><rect x="225" y="6" width="7" height="7" fill="#F6FAF7" stroke="#0B0F0D"/><path d="M12 9h217M78 9V1m78 8 14 8" stroke="#B6F23D" strokeDasharray="3 4"/></svg>}
            {index < 2 && ' '}
          </span>)}
        </h1>
        <p className="mt-7 font-display text-[clamp(1.4rem,1rem+1.6vw,2.2rem)] font-bold leading-tight">{content.hero.subtitle.replace('Louder.', '')}<span className="text-[#B6F23D]">Louder.</span></p>
      </div>
      <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"><HeroStudio reducedMotion={reducedMotion}/></div>
      <p className="mt-1 max-w-[36em] text-base leading-[1.65] text-white/[.76] sm:text-[17px] lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-4 lg:text-[18px]">{content.hero.text}</p>
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/40 to-transparent"/>
  </section>;
}

const whyIcons = [Eye, ShieldCheck, UsersRound, Trophy];
const stickerRotations = ['-rotate-[3deg]', 'rotate-[2deg]', '-rotate-[2deg]', 'rotate-[3deg]'];
function ProductBoxes({ reducedMotion }: { reducedMotion: boolean }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !sceneRef.current || !boxRef.current) return;
    const box = boxRef.current;
    gsap.fromTo(box.querySelector('[data-box-brand]'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: .8, ease: 'power2.inOut', scrollTrigger: { trigger: sceneRef.current, start: 'top 78%', once: true } });
    gsap.fromTo(box, { y: 0 }, { y: -14, duration: .55, delay: .45, ease: 'back.out(1.5)', scrollTrigger: { trigger: sceneRef.current, start: 'top 78%', once: true } });
    gsap.to(sceneRef.current.querySelectorAll('[data-side-box]'), { opacity: .58, duration: .6, stagger: .08, scrollTrigger: { trigger: sceneRef.current, start: 'top 78%', once: true } });
  }, { scope: sceneRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <div ref={sceneRef} aria-hidden="true" className="relative mx-auto flex h-[240px] max-w-[460px] items-end justify-center pb-10 sm:h-[280px] lg:h-[400px]">
    <div className="absolute bottom-9 left-0 right-0 h-3 rounded-full bg-[#0B0F0D]/15 shadow-[0_12px_16px_rgba(11,15,13,.12)]"/>
    {[0,1,2,3].map((item) => <div key={item} data-side-box className={`relative mb-3 h-28 w-[19%] rounded-md border border-[#0B0F0D]/10 bg-[#AEB5B1] shadow-md sm:h-36 ${item === 0 ? 'mr-2' : ''}`}><span className="absolute inset-x-2 top-3 h-px bg-white/40"/><span className="absolute bottom-3 left-2 right-2 h-px bg-[#0B0F0D]/10"/></div>)}
    <div ref={boxRef} className="absolute bottom-12 left-1/2 z-10 h-40 w-36 -translate-x-1/2 rounded-md border border-[#0B0F0D]/10 bg-[#D4D8D6] shadow-[0_18px_32px_rgba(11,15,13,.2)] sm:h-48 sm:w-44">
      <div data-box-brand className="absolute inset-0 overflow-hidden rounded-md bg-gradient-to-br from-[#16A34A] to-[#22C55E]"><div className="absolute inset-x-0 top-[22%] h-6 bg-[#B6F23D] sm:h-8"/><svg viewBox="0 0 120 100" className="absolute bottom-[12%] left-[18%] w-[65%]"><path d="M4 73c29-46 50 20 98-49l-8 4 3 9 18-20-27-2 4 7C57 84 40 16 4 73Z" fill="#0B0F0D"/><circle cx="80" cy="34" r="5" fill="#F6FAF7"/></svg><Sparkles className="absolute right-3 top-3 size-5 text-[#B6F23D]"/></div>
    </div>
  </div>;
}

function CreativeWhy({ content }: { content: CreativeDesigningContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickersRef = useRef<HTMLLIElement[]>([]);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !sectionRef.current) return;
    const items = stickersRef.current.filter(Boolean);
    gsap.fromTo(items, { opacity: 0, y: 24, scale: .85, rotate: (index) => index % 2 ? 8 : -8 }, { opacity: 1, y: 0, scale: 1, rotate: (index) => [-3,2,-2,3][index], duration: .65, stagger: .1, ease: 'back.out(1.6)', scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } });
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={sectionRef} aria-labelledby="creative-why-title" className="relative overflow-hidden bg-[#F6FAF7] py-16 text-[#0B0F0D] sm:py-20 lg:py-24">
    <div className="mx-auto grid w-[90%] max-w-[1280px] items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7"><h2 id="creative-why-title" className="max-w-[22ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.035em]">{content.why.title.replace('Good Product.', '')}<span className="relative inline-block">Good Product.<span aria-hidden="true" className="absolute -bottom-1 left-0 -z-0 h-[35%] w-full origin-left rounded-sm bg-[#B6F23D]/75"/></span></h2><p className="mt-5 max-w-[34em] text-[17px] leading-[1.75] text-[#5B6B63] sm:text-[19px]">{content.why.text}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">{content.why.points.map((point,index) => { const Icon=whyIcons[index]; return <li key={point} ref={(node)=>{if(node) stickersRef.current[index]=node;}} className={`group relative flex min-h-[116px] items-center gap-4 rounded-[18px] border border-[#0B0F0D]/[.08] bg-white p-5 shadow-[0_12px_28px_rgba(11,15,13,.07)] transition duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:rotate-0 motion-safe:hover:shadow-[0_18px_35px_rgba(11,15,13,.14)] ${stickerRotations[index]} max-[767px]:rotate-[1deg]`}><Tape/><span aria-hidden="true" className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 motion-safe:group-hover:scale-110 ${index%2?'bg-[#CFE8FF] text-[#0B0F0D]':'bg-[#B6F23D] text-[#0B0F0D]'}`}><Icon className="size-5"/></span><span className="text-[17px] font-semibold leading-snug sm:text-[19px]">{point}</span></li>;})}</ul>
      </div>
      <div className="lg:col-span-5"><ProductBoxes reducedMotion={reducedMotion}/></div>
    </div>
  </section>;
}

function Pinboard({ content, onChangeView }: { content: CreativeDesigningContent; onChangeView: (view: ServicesView) => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !rootRef.current) return;
    const cards = cardRefs.current.filter(Boolean);
    gsap.fromTo(cards, { opacity: 0, y: -40, rotate: (index) => index % 2 ? 8 : -8 }, { opacity: 1, y: 0, rotate: (index) => [-2,2,-1,3,-3,1,-2,2,-1,0][index], duration: .65, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: rootRef.current, start: 'top 82%', once: true } });
  }, { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={rootRef} aria-labelledby="creative-services-title" className="overflow-hidden bg-[#0B0F0D] py-16 text-white sm:py-20 lg:py-24">
    <div className="mx-auto w-[90%] max-w-[1280px]"><div className="flex flex-wrap items-center justify-between gap-4"><Eyebrow>{content.services.eyebrow}</Eyebrow><ServicesViewToggle value="v1" onChange={onChangeView}/></div><h2 id="creative-services-title" className="mt-5 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.services.title}</h2><p className="mt-4 max-w-[44em] text-base leading-[1.7] text-white/[.74] sm:text-[18px]">{content.services.text}</p>
      <ul className="mt-10 grid grid-cols-2 gap-3 rounded-[26px] border border-white/[.08] bg-[#111815] p-3 sm:grid-cols-2 sm:gap-5 sm:p-6 lg:grid-cols-12 lg:gap-6 lg:p-8">
        {content.services.items.map((item,index)=>{const Artifact=artifactIllustrations[index];const wide=index===9;const spans=['lg:col-span-5','lg:col-span-3','lg:col-span-4','lg:col-span-4','lg:col-span-3','lg:col-span-5','lg:col-span-4','lg:col-span-4','lg:col-span-4','lg:col-span-12'];return <li key={item} ref={(node)=>{if(node)cardRefs.current[index]=node;}} onMouseEnter={()=>{if(matchMedia('(hover: hover) and (pointer: fine)').matches)setHoveredCard(index);}} onMouseLeave={()=>setHoveredCard(null)} style={{opacity:(hoveredCard!==null&&hoveredCard!==index)?0.72:1}} className={`group relative min-w-0 transition-opacity duration-300 ${spans[index]} ${wide?'col-span-2':''}`}>
          <div className={`relative h-full min-h-[190px] overflow-visible transition duration-300 motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:rotate-0 ${wide?'min-h-[156px]':''}`}>
            <span aria-hidden="true" className="absolute left-1/2 top-0 z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0B0F0D]/40 bg-[#22C55E] shadow-[0_2px_6px_rgba(0,0,0,.3)] transition duration-300 motion-safe:group-hover:scale-150 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:bg-[#B6F23D]"/>
            <div aria-hidden="true" className={`relative h-[145px] overflow-hidden rounded-t-[16px] bg-white shadow-[0_10px_24px_rgba(0,0,0,.22)] transition duration-500 motion-safe:group-hover:scale-[1.035] motion-safe:group-hover:rotate-[.5deg] sm:h-[190px] ${wide?'sm:h-[135px]':''}`}><Artifact/></div>
            <div className="relative flex min-h-[60px] items-start gap-2 rounded-b-[12px] bg-white px-3 py-3 text-[#0B0F0D] shadow-md transition-colors duration-300 group-hover:bg-[#B6F23D] sm:px-4"><span aria-hidden="true" className="shrink-0 font-mono text-[10px] font-bold tracking-wide text-[#16A34A] transition-colors duration-300 group-hover:text-[#0B0F0D] sm:text-xs">{String(index+1).padStart(2,'0')}</span><span className="text-[13px] font-semibold leading-snug sm:text-[15px]">{item}</span></div>
          </div>
        </li>;})}
      </ul>
    </div>
  </section>;
}

function BeforeArtwork({ after = false }: { after?: boolean }) {
  return <div aria-hidden="true" className={`absolute inset-0 overflow-hidden p-5 sm:p-8 ${after?'bg-[#F6FAF7]':'bg-[#D5D9D7]'}`}>
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#0B0F0D]/10 bg-white/70 p-4 sm:p-6">
      <div className="absolute right-[8%] top-[12%] size-[42%] rounded-full" style={{background:after?'#16A34A':'#AAB1AD'}}/>
      <div className={`absolute left-[13%] top-[18%] h-[48%] w-[32%] ${after?'rotate-[-5deg] rounded-[35%] bg-[#B6F23D]':'rotate-[16deg] rounded-none bg-[#B8BEBA]'}`} />
      <div className="absolute bottom-[18%] left-[12%] space-y-2"><i className={`block h-3 rounded-full ${after?'w-40 bg-[#0B0F0D]':'w-24 bg-[#969E99]'}`}/><i className={`block h-2 rounded-full ${after?'w-28 bg-[#0B0F0D]/35':'w-36 bg-[#AAB1AD]'}`}/><i className={`block h-2 rounded-full ${after?'w-32 bg-[#0B0F0D]/20':'w-20 bg-[#B6BCB9]'}`}/></div>
      <span className={`absolute bottom-[13%] right-[12%] h-8 w-24 rounded-full ${after?'bg-[#B6F23D]':'bg-[#A8AEAB]'}`}/>{after&&<Sparkles className="absolute right-[14%] top-[16%] size-7 text-[#16A34A]"/>}
      {after&&<div className="absolute inset-0 grid grid-cols-4 gap-3 opacity-20">{[0,1,2,3].map((item)=><i key={item} className="border-x border-[#16A34A]"/>)}</div>}
    </div>
  </div>;
}

function ComparisonSlider({ reducedMotion, onValueChange }: { reducedMotion: boolean; onValueChange: (value:number)=>void }) {
  const [value,setValue]=useState(50);
  const cardRef=useRef<HTMLDivElement>(null);
  const dragging=useRef(false);
  useGSAP(()=>{
    registerGsapPlugins();
    if(reducedMotion||!cardRef.current)return;
    const driver={value:0};
    gsap.fromTo(driver,{value:0},{value:100,duration:2.4,ease:'power2.inOut',onUpdate:()=>{setValue(driver.value);onValueChange(driver.value);},onComplete:()=>gsap.to(driver,{value:50,duration:.65,ease:'power2.inOut',onUpdate:()=>{setValue(driver.value);onValueChange(driver.value);}}),scrollTrigger:{trigger:cardRef.current,start:'top 76%',once:true}});
  },{scope:cardRef,dependencies:[reducedMotion],revertOnUpdate:true});
  const update=(clientX:number)=>{const rect=cardRef.current?.getBoundingClientRect();if(rect){const next=Math.max(0,Math.min(100,(clientX-rect.left)/rect.width*100));setValue(next);onValueChange(next);}};
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{dragging.current=true;event.currentTarget.setPointerCapture(event.pointerId);update(event.clientX);};
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{if(dragging.current)update(event.clientX);};
  const onKey=(event:KeyboardEvent<HTMLDivElement>)=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();const next=Math.max(0,Math.min(100,value+(event.key==='ArrowRight'?3:-3)));setValue(next);onValueChange(next);}};
  return <div ref={cardRef} className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-[26px] border border-[#0B0F0D]/10 bg-white shadow-[0_30px_60px_-30px_rgba(11,15,13,.35)]" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}}>
    <BeforeArtwork/><div className="absolute inset-0 overflow-hidden" style={{clipPath:`inset(0 ${100-value}% 0 0)`}}><BeforeArtwork after/></div>
    <div role="slider" tabIndex={0} aria-label="Compare before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} onKeyDown={onKey} className="absolute inset-y-0 z-10 w-11 -translate-x-1/2 cursor-ew-resize touch-pan-y outline-none focus-visible:ring-4 focus-visible:ring-[#22C55E]" style={{left:`${value}%`}}>
      <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(11,15,13,.25)]"/><span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#16A34A] text-white shadow-lg"><span className="flex"><ChevronLeft className="size-4"/><ChevronRight className="-ml-1 size-4"/></span></span>
    </div>
  </div>;
}

function CreativeDifference({ content }: { content: CreativeDesigningContent }) {
  const reducedMotion=useReducedMotion();
  const rowsRef=useRef<HTMLLIElement[]>([]);
  const [value,setValue]=useState(50);
  return <section aria-labelledby="creative-different-title" className="relative overflow-hidden bg-gradient-to-b from-[#F3FAD9] to-[#F6FAF7] py-16 text-[#0B0F0D] sm:py-20 lg:py-24">
    <div className="mx-auto w-[90%] max-w-[1280px]"><Eyebrow tone="ink">{content.different.eyebrow}</Eyebrow><div className="mt-5 grid items-center gap-8 lg:grid-cols-12 lg:gap-12"><div className="lg:col-span-7"><h2 id="creative-different-title" className="mb-7 max-w-[19ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.different.title}</h2><ComparisonSlider reducedMotion={reducedMotion} onValueChange={setValue}/></div>
      <ul className="divide-y divide-[#0B0F0D]/15 lg:col-span-5">{content.different.points.map((point,index)=><li key={point} ref={(node)=>{if(node)rowsRef.current[index]=node;}} className="group flex min-h-[70px] items-center gap-4 py-4 text-[17px] font-semibold leading-snug transition-colors duration-300 motion-safe:hover:translate-x-1 sm:text-[19px]" style={{color:reducedMotion||value>=(index+1)/content.different.points.length*100?ink:'rgba(11,15,13,.45)'}}><span aria-hidden="true" className={`grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-300 group-hover:scale-110 ${reducedMotion||value>=(index+1)/content.different.points.length*100?'border-[#16A34A] bg-[#16A34A] text-white':'border-[#0B0F0D]/25 text-transparent group-hover:border-[#16A34A] group-hover:bg-[#16A34A]/10'}`}><Check className="size-4"/></span>{point}</li>)}</ul>
    </div></div>
  </section>;
}

function CreativeProcess({ content }: { content: CreativeDesigningContent }) {
  const sectionRef=useRef<HTMLElement>(null);
  const trailRef=useRef<SVGPathElement>(null);
  const mobileTrailRef=useRef<SVGPathElement>(null);
  const trailPointerRef=useRef<SVGCircleElement>(null);
  const mobilePointerRef=useRef<SVGCircleElement>(null);
  const cardRefs=useRef<HTMLLIElement[]>([]);
  const reducedMotion=useReducedMotion();
  useGSAP(()=>{
    registerGsapPlugins();
    const section=sectionRef.current;
    const desktopPath=trailRef.current;
    const mobilePath=mobileTrailRef.current;
    if(reducedMotion||!section||!desktopPath||!mobilePath)return;
    const paths=[{path:desktopPath,pointer:trailPointerRef.current},{path:mobilePath,pointer:mobilePointerRef.current}];
    paths.forEach(({path,pointer})=>{
      const length=path.getTotalLength();
      gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
      gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:section,start:'top 65%',end:'bottom 60%',scrub:.6,invalidateOnRefresh:true,onUpdate:(self)=>{if(!pointer)return;const point=path.getPointAtLength(length*self.progress);pointer.setAttribute('cx',String(point.x));pointer.setAttribute('cy',String(point.y));}}});
    });
    gsap.fromTo(cardRefs.current.filter(Boolean),{opacity:0,y:20,scale:.94},{opacity:1,y:0,scale:1,duration:.55,stagger:.1,ease:'back.out(1.4)',scrollTrigger:{trigger:sectionRef.current,start:'top 80%',once:true}});
  },{scope:sectionRef,dependencies:[reducedMotion],revertOnUpdate:true});
  return <section ref={sectionRef} aria-labelledby="creative-process-title" className="relative overflow-hidden bg-[#0B0F0D] py-16 text-white sm:py-20 lg:py-24">
    <div className="relative z-10 mx-auto w-[90%] max-w-[1280px]"><Eyebrow>{content.process.eyebrow}</Eyebrow><h2 id="creative-process-title" className="mt-5 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-.03em]">{content.process.title}</h2>
      <div className="relative mt-12 lg:mt-16">
        <svg aria-hidden="true" viewBox="0 0 1200 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"><defs><linearGradient id="idea-trail-gradient"><stop stopColor="#16A34A"/><stop offset="1" stopColor="#B6F23D"/></linearGradient></defs><path d="M40 95 C210 95 220 225 400 225 S560 370 710 390 S875 555 1020 570 S1110 740 1160 800" fill="none" stroke="url(#idea-trail-gradient)" strokeWidth="3" strokeDasharray="8 11" strokeLinecap="round" opacity=".3"/><path ref={trailRef} d="M40 95 C210 95 220 225 400 225 S560 370 710 390 S875 555 1020 570 S1110 740 1160 800" fill="none" stroke="url(#idea-trail-gradient)" strokeWidth="3" strokeLinecap="round"/>{!reducedMotion&&<circle ref={trailPointerRef} cx="40" cy="95" r="7" fill="#B6F23D" stroke="#0B0F0D" strokeWidth="2"/>}</svg>
        <svg aria-hidden="true" viewBox="0 0 24 700" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 left-3 top-0 h-full w-6 lg:hidden"><path d="M12 0 C3 100 21 120 12 200 S21 320 12 360 S3 480 12 520 S21 620 12 700" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 8" opacity=".3"/><path ref={mobileTrailRef} d="M12 0 C3 100 21 120 12 200 S21 320 12 360 S3 480 12 520 S21 620 12 700" fill="none" stroke="#22C55E" strokeWidth="2"/>{!reducedMotion&&<circle ref={mobilePointerRef} cx="12" cy="0" r="3" fill="#B6F23D"/>}</svg>
        <ol className="relative grid gap-5 pl-9 lg:h-[900px] lg:grid-cols-2 lg:gap-x-20 lg:gap-y-0 lg:pl-0">
          {content.process.steps.map((step,index)=><li key={step.title} ref={(node)=>{if(node)cardRefs.current[index]=node;}} className={`group relative rounded-[24px] border border-white/[.08] bg-[#111815] p-5 shadow-[0_20px_48px_rgba(0,0,0,.25)] transition duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:border-[#22C55E]/40 motion-safe:hover:bg-[#132019] motion-safe:hover:shadow-[0_24px_54px_rgba(22,197,94,.12)] sm:p-7 lg:absolute lg:w-[42%] ${index%2===0?'lg:left-[2%]':'lg:right-[2%]'} ${['lg:top-[3%]','lg:top-[19%]','lg:top-[39%]','lg:top-[60%]','lg:top-[78%]'][index]}`}>
            <span aria-hidden="true" className={`absolute -left-[33px] top-8 grid size-4 place-items-center rounded-full border-2 border-[#B6F23D] bg-[#0B0F0D] ${index%2===0?'lg:left-auto lg:-right-[35px]':'lg:right-auto lg:-left-[35px]'}`}><i className="size-1.5 rounded-full bg-[#22C55E]"/></span>
            <div className="flex items-center gap-4"><div className="transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-3"><StudioDoodle index={index}/></div><span aria-hidden="true" className="font-mono text-xl font-bold tracking-wider text-[#22C55E] transition-colors duration-300 group-hover:text-[#B6F23D]">{String(index+1).padStart(2,'0')}</span></div><h3 className="mt-4 font-display text-[20px] font-bold leading-tight transition-colors duration-300 group-hover:text-[#B6F23D] sm:text-[23px]">{step.title}</h3><p className="mt-2 text-[16px] leading-relaxed text-white/[.74] sm:text-[17px]">{step.text}</p>
          </li>)}
          {!reducedMotion&&<span aria-hidden="true" className="absolute -bottom-8 right-2 hidden size-9 rounded-full bg-[#B6F23D] shadow-[0_0_25px_rgba(182,242,61,.3)] lg:block"><Sparkles className="m-2 size-5 text-[#0B0F0D]"/></span>}
        </ol>
      </div>
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[120px] bg-gradient-to-b from-transparent to-[#0C130F]"/>
  </section>;
}

export function CreativeDesigningPage({ content, onSelectIndustry, initialServicesView = 'v1' }: { content: CreativeDesigningContent; onSelectIndustry: (name:string)=>void; initialServicesView?: ServicesView }) {
  const [servicesView, setServicesView] = useState<ServicesView>(initialServicesView);
  useEffect(() => {
    setServicesView(initialServicesView);
  }, [initialServicesView]);
  useEffect(() => {
    const syncView = () => setServicesView(new URLSearchParams(window.location.search).get('services') === 'v2' ? 'v2' : 'v1');
    window.addEventListener('popstate', syncView);
    return () => window.removeEventListener('popstate', syncView);
  }, []);
  const changeServicesView = (view: ServicesView) => {
    setServicesView(view);
    const url = new URL(window.location.href);
    if (view === 'v2') url.searchParams.set('services', 'v2');
    else url.searchParams.delete('services');
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };
  const registry: Record<CreativeDesigningSection, () => ReactNode> = {
    hero: () => <CreativeHero key="hero" content={content}/> ,
    why: () => <CreativeWhy key="why" content={content}/> ,
    services: () => servicesView === 'v2'
      ? <ServicesPhotoV2 key="services-v2" content={content} onChangeView={changeServicesView}/>
      : <Pinboard key="services-v1" content={content} onChangeView={changeServicesView}/> ,
    different: () => <CreativeDifference key="different" content={content}/> ,
    process: () => <CreativeProcess key="process" content={content}/> ,
    whyLeadsGrow: () => <AboutStory key="whyLeadsGrow"/> ,
    industries: () => <Industries key="industries" onSelectIndustry={onSelectIndustry}/> ,
  };
  return <>{content.sections.map((section)=>registry[section]())}</>;
}
