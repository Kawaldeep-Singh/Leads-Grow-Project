'use client';

import { useEffect, useRef } from 'react';
import { Building2, Code2, FileText, Images, LayoutDashboard, LayoutGrid, RefreshCw, ShieldCheck, ShoppingCart, Store, Wrench } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import type { WebsiteDevelopmentMedia } from '@/data/servicePages/website-development.media';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const serviceIcons = [Store, Building2, ShoppingCart, Code2, LayoutGrid, FileText, Images, RefreshCw, LayoutDashboard, Wrench];

interface ShowcaseRowProps {
  index: number;
  name: string;
  active: boolean;
  mobile: boolean;
  media: WebsiteDevelopmentMedia;
  onActivate: () => void;
  onHover: (isHovering: boolean) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onPress: () => void;
  preview: React.ReactNode;
}

export function ShowcaseRow({ index, name, active, mobile, media, onActivate, onHover, onKeyDown, onPress, preview }: ShowcaseRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const ServiceIcon = serviceIcons[index] ?? Store;

  useGSAP(() => {
    registerGsapPlugins();
    const icon = iconRef.current;
    if (!icon) return;
    const marks = icon.querySelectorAll<SVGElement>('path,line,polyline,rect,circle');
    marks.forEach((mark) => {
      mark.setAttribute('pathLength', '1');
      mark.style.strokeDasharray = '1';
      mark.style.strokeDashoffset = '0';
    });
    if (active && !reducedMotion) {
      gsap.fromTo(marks, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.025, ease: 'power3.out' });
    }
  }, { scope: iconRef, dependencies: [active, reducedMotion], revertOnUpdate: true });

  useEffect(() => {
    const row = rowRef.current;
    const arrow = arrowRef.current;
    if (!row || !arrow || mobile || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const moveX = gsap.quickTo(arrow, 'x', { duration: .3, ease: 'power3.out' });
    const moveY = gsap.quickTo(arrow, 'y', { duration: .3, ease: 'power3.out' });
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      if (!active) { moveX(0); moveY(0); return; }
      const rect = row.getBoundingClientRect();
      moveX(Math.max(-6, Math.min(6, ((event.clientX - rect.left) / rect.width - .5) * 12)));
      moveY(Math.max(-6, Math.min(6, ((event.clientY - rect.top) / rect.height - .5) * 12)));
    };
    const reset = () => { moveX(0); moveY(0); };
    row.addEventListener('pointermove', onMove);
    row.addEventListener('pointerleave', reset);
    return () => { row.removeEventListener('pointermove', onMove); row.removeEventListener('pointerleave', reset); gsap.set(arrow, { x: 0, y: 0 }); gsap.killTweensOf(arrow); };
  }, [active, mobile]);
  const content = (
    <>
      <span className="showcase-row-index">
        <span className="showcase-row-index-line" aria-hidden="true" />
        <span className="showcase-row-number">{String(index + 1).padStart(2, '0')}</span>
      </span>
      <span ref={iconRef} className="showcase-icon-tile" aria-hidden="true">
        <ServiceIcon className="showcase-icon" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        {index === 9 && <ShieldCheck className="showcase-icon-shield" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />}
      </span>
      <span className="showcase-row-name-wrap"><span className="showcase-row-name">{name}</span></span>
      <span ref={arrowRef} className={`showcase-arrow ${active ? 'showcase-arrow-active' : ''}`} aria-hidden="true">
        <svg className="showcase-arrow-icon" style={{ width: 19, height: 19 }} viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </>
  );

  const Component = media.href ? 'a' : 'button';
  return (
    <li
      ref={rowRef}
      data-showcase-row
      data-index={index}
      className={`showcase-row ${active ? 'showcase-row-active' : ''} ${mobile && active ? 'showcase-row-open' : ''}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onActivate()}
      onClick={onPress}
    >
      <Component
        {...(media.href ? { href: media.href } : { type: 'button' as const })}
        className="showcase-row-trigger"
        aria-current={active ? 'true' : undefined}
        aria-expanded={mobile ? active : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => { if (!media.href) event.preventDefault(); onPress(); }}
        onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => onKeyDown(event as React.KeyboardEvent<HTMLButtonElement>)}
      >{content}</Component>
      {mobile && <div className="showcase-mobile-media" aria-hidden={!active}>{active ? preview : null}</div>}
      <style jsx>{`
        .showcase-row { position:relative; min-width:0; overflow:hidden; border-top:1px solid rgba(11,15,13,.12); border-radius:18px; transition:border-color .3s ease; }
        .showcase-row:last-child { border-bottom:1px solid rgba(11,15,13,.12); }
        .showcase-row::before { position:absolute; z-index:0; inset:1px 0 0; border-radius:18px; background:linear-gradient(90deg,rgba(34,197,94,.10),rgba(34,197,94,0)); content:''; opacity:0; transform:scaleX(0); transform-origin:left center; transition:transform .5s cubic-bezier(.215,.61,.355,1),opacity .2s ease; pointer-events:none; }
        .showcase-row-active { border-top-color:#16A34A; }
        .showcase-row:last-child.showcase-row-active { border-bottom-color:#16A34A; }
        .showcase-row-active::before { opacity:1; transform:scaleX(1); }
        .showcase-row-trigger { position:relative; z-index:1; display:flex; width:100%; min-height:96px; align-items:center; gap:clamp(10px,1.1vw,18px); padding:24px 12px; color:#0B0F0D; text-align:left; background:transparent; cursor:pointer; }
        .showcase-row-trigger:focus-visible { outline:2px solid #16A34A; outline-offset:3px; border-radius:8px; }
        .showcase-row-index { display:flex; flex:none; align-items:center; gap:8px; width:38px; }
        .showcase-row-index-line { display:block; flex:none; width:16px; height:2px; border-radius:2px; background:#16A34A; transition:width .35s cubic-bezier(.215,.61,.355,1); }
        .showcase-row-number { flex:none; width:14px; color:#627068; font:500 12px/1 ui-monospace,monospace; transition:color .25s; }
        .showcase-row-active .showcase-row-index-line { width:28px; }
        .showcase-icon-tile { position:relative; display:grid; width:44px; height:44px; flex:none; place-items:center; overflow:hidden; border:1px solid rgba(11,15,13,.08); border-radius:14px; color:rgba(11,15,13,.55); background:#fff; transition:background-color .25s,border-color .25s,color .25s; }
        .showcase-icon { width:22px; height:22px; }
        .showcase-icon-shield { position:absolute; right:2px; bottom:3px; width:12px; height:12px; padding:1px; border-radius:4px; color:#16A34A; background:#fff; }
        .showcase-row-active .showcase-icon-tile { border-color:#16A34A; color:#fff; background:#16A34A; }
        .showcase-row-active .showcase-icon-shield { color:#16A34A; background:#fff; }
        .showcase-row-name-wrap { position:relative; display:block; min-width:0; flex:1; transition:transform .4s cubic-bezier(.16,1,.3,1); }
        .showcase-row-name { position:relative; display:inline-block; max-width:100%; color:#627068; font:700 clamp(1.4rem,1.1rem + 1.4vw,2.4rem)/1.15 var(--font-display); letter-spacing:-.02em; transition:color .25s; }
        .showcase-row-name::after { position:absolute; right:0; bottom:-5px; left:0; height:2px; border-radius:2px; background:#16A34A; content:''; transform:scaleX(0); transform-origin:left center; transition:transform .45s cubic-bezier(.215,.61,.355,1); }
        .showcase-arrow { position:relative; z-index:0; isolation:isolate; flex:none; display:grid; width:44px; height:44px; place-items:center; overflow:hidden; border:1px solid rgba(11,15,13,.45); border-radius:999px; transition:transform .3s,color .3s,border-color .3s; }
        .showcase-arrow::before { position:absolute; z-index:-1; inset:0; border-radius:inherit; background:#16A34A; content:''; transform:scaleY(0); transform-origin:bottom center; transition:transform .3s cubic-bezier(.215,.61,.355,1); }
        .showcase-arrow-icon { display:block; transition:transform .3s; }
        .showcase-arrow-active { color:white; border-color:#16A34A; }
        .showcase-arrow-active::before { transform:scaleY(1); }
        .showcase-arrow-active svg { transform:rotate(-45deg); }
        .showcase-row-active .showcase-row-name-wrap { transform:translateX(12px); }
        .showcase-row-active .showcase-row-name { color:#0B0F0D; }
        .showcase-row-active .showcase-row-name::after { transform:scaleX(1); }
        .showcase-row-active .showcase-row-number { color:#16A34A; }
        .showcase-mobile-media { display:none; }
        @media(max-width:1023px) { .showcase-row-trigger { min-height:82px; } .showcase-row-name { font-size:clamp(1.25rem,1rem + 2vw,1.8rem); } }
        @media(max-width:639px) {
          .showcase-row-trigger { min-height:56px; gap:8px; padding:14px 10px; }
          .showcase-row-index { width:30px; gap:5px; }
          .showcase-row-index-line { width:12px; }
          .showcase-row-active .showcase-row-index-line { width:20px; }
          .showcase-row-number { width:13px; font-size:11px; }
          .showcase-icon-tile { width:40px; height:40px; border-radius:13px; }
          .showcase-icon { width:20px; height:20px; }
          .showcase-row-name { font-size:clamp(1.15rem,1rem + 2vw,1.4rem); }
          .showcase-arrow { width:36px; height:36px; }
          .showcase-arrow-icon { width:16px !important; height:16px !important; }
          .showcase-row-active .showcase-row-name-wrap { transform:translateX(6px); }
          .showcase-row-name::after { bottom:-3px; }
          .showcase-mobile-media { display:grid; grid-template-rows:0fr; transition:grid-template-rows .45s cubic-bezier(.16,1,.3,1); }
          .showcase-mobile-media[aria-hidden="false"] { grid-template-rows:1fr; padding:0 0 18px; }
          .showcase-mobile-media :global(> *) { min-height:0; }
        }
        @media(prefers-reduced-motion:reduce) { *,*::before,*::after { transition-duration:.01ms !important; animation-duration:.01ms !important; } }
      `}</style>
    </li>
  );
}
