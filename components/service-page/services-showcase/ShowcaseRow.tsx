'use client';

import { useEffect, useRef } from 'react';
import type { WebsiteDevelopmentMedia } from '@/data/servicePages/website-development.media';
import { gsap } from '@/lib/gsap-register';

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
      <span className="showcase-row-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="showcase-row-name-wrap"><span className="showcase-row-dot" aria-hidden="true" /><span className="showcase-row-name">{name}</span></span>
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
      <span className="showcase-progress" aria-hidden="true" />
      {mobile && <div className="showcase-mobile-media" aria-hidden={!active}>{active ? preview : null}</div>}
      <style jsx>{`
        .showcase-row { position:relative; min-width:0; border-top:1px solid rgba(11,15,13,.12); }
        .showcase-row:last-child { border-bottom:1px solid rgba(11,15,13,.12); }
        .showcase-row-trigger { display:flex; width:100%; min-height:96px; align-items:center; gap:clamp(12px,1.4vw,24px); padding:24px 0; color:#0B0F0D; text-align:left; background:transparent; cursor:pointer; }
        .showcase-row-trigger:focus-visible { outline:2px solid #16A34A; outline-offset:3px; border-radius:8px; }
        .showcase-row-number { flex:none; width:32px; color:#627068; font:500 14px/1 ui-monospace,monospace; transition:color .25s; }
        .showcase-row-name-wrap { position:relative; display:block; min-width:0; flex:1; transition:transform .4s cubic-bezier(.16,1,.3,1); }
        .showcase-row-name { display:block; color:#627068; font:700 clamp(1.4rem,1.1rem + 1.4vw,2.4rem)/1.15 var(--font-display); letter-spacing:-.02em; transition:color .25s; }
        .showcase-row-dot { position:absolute; top:50%; left:-18px; width:6px; height:6px; border-radius:999px; background:#16A34A; opacity:0; transform:translateY(-50%) scale(.6); transition:opacity .2s,transform .2s; }
        .showcase-arrow { flex:none; display:grid; width:44px; height:44px; place-items:center; border:1px solid rgba(11,15,13,.45); border-radius:999px; transition:transform .3s,color .3s,background .3s,border-color .3s; }
        .showcase-arrow-icon { display:block; transition:transform .3s; }
        .showcase-arrow-active { color:white; background:#16A34A; border-color:#16A34A; }
        .showcase-arrow-active svg { transform:rotate(-45deg); }
        .showcase-progress { position:absolute; bottom:-1px; left:0; height:2px; width:100%; transform:scaleX(0); transform-origin:left; background:#16A34A; }
        .showcase-row-active .showcase-progress { transform:scaleX(1); transition:transform .6s cubic-bezier(.215,.61,.355,1); }
        .showcase-row-active .showcase-row-name-wrap { transform:translateX(16px); }
        .showcase-row-active .showcase-row-name { color:#0B0F0D; }
        .showcase-row-active .showcase-row-number { color:#16A34A; }
        .showcase-row-active .showcase-row-dot { opacity:1; transform:translateY(-50%) scale(1); }
        .showcase-mobile-media { display:none; }
        @media(max-width:1023px) { .showcase-row-trigger { min-height:82px; } .showcase-row-name { font-size:clamp(1.25rem,1rem + 2vw,1.8rem); } }
        @media(max-width:639px) {
          .showcase-row-trigger { min-height:56px; gap:10px; padding:18px 0; }
          .showcase-row-number { width:25px; font-size:12px; }
          .showcase-row-name { font-size:clamp(1.15rem,1rem + 2vw,1.4rem); }
          .showcase-arrow { width:36px; height:36px; }
          .showcase-arrow-icon { width:16px !important; height:16px !important; }
          .showcase-row-active .showcase-row-name-wrap { transform:translateX(8px); }
          .showcase-mobile-media { display:grid; grid-template-rows:0fr; transition:grid-template-rows .45s cubic-bezier(.16,1,.3,1); }
          .showcase-mobile-media[aria-hidden="false"] { grid-template-rows:1fr; padding:0 0 18px; }
          .showcase-mobile-media :global(> *) { min-height:0; }
        }
        @media(prefers-reduced-motion:reduce) { *,*::before,*::after { transition-duration:.01ms !important; } }
      `}</style>
    </li>
  );
}
