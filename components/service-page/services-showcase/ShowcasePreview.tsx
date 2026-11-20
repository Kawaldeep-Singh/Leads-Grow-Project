'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { websiteDevelopmentMedia, type WebsiteDevelopmentMedia } from '@/data/servicePages/website-development.media';

interface ShowcasePreviewProps {
  index: number;
  names: readonly string[];
  compact?: boolean;
}

export function ShowcasePreview({ index, names, compact = false }: ShowcasePreviewProps) {
  const [failed, setFailed] = useState<number[]>([]);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(index);
  const reducedMotion = useReducedMotion();
  const current = index + 1;
  const isAvailable = (item: WebsiteDevelopmentMedia | undefined, itemIndex: number) => Boolean(item?.available && !failed.includes(itemIndex));
  const nearby = new Set([current, current === 1 ? names.length : current - 1, current === names.length ? 1 : current + 1]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(stage);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useGSAP(() => {
    registerGsapPlugins();
    const card = frontRef.current;
    const changed = previousIndex.current !== index;
    previousIndex.current = index;
    if (!card || !changed || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.timeline().to(card, { y: -8, duration: 0.18, ease: 'power3.out' })
        .to(card, { y: 0, duration: 0.32, ease: 'power3.out' });
    }, card);
    return () => context.revert();
  }, { scope: stageRef, dependencies: [index, reducedMotion], revertOnUpdate: true });

  useEffect(() => {
    const card = frontRef.current;
    if (!card || reducedMotion || !window.matchMedia('(pointer:fine)').matches) return;
    const tiltX = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power2.out' });
    const tiltY = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power2.out' });
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      tiltX(Math.max(-3, Math.min(3, -y * 3)));
      tiltY(Math.max(-3, Math.min(3, x * 3)));
    };
    const reset = () => { tiltX(0); tiltY(0); };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', reset);
    return () => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', reset);
      gsap.killTweensOf(card, 'rotationX,rotationY');
    };
  }, [reducedMotion]);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`showcase-preview-stage ${compact ? 'showcase-preview-stage-compact' : ''}`}
      data-dots-running={inView && pageVisible && !reducedMotion ? 'true' : 'false'}
    >
      <span className="showcase-preview-ghost showcase-preview-ghost-one" />
      <span className="showcase-preview-ghost showcase-preview-ghost-two" />
      <div ref={frontRef} className="showcase-preview">
        <div className="showcase-browser-bar">
          <div className="showcase-browser-dots"><i /><i /><i /></div>
          <span className="showcase-browser-address" />
        </div>
        <div className="showcase-image-area">
          {names.map((_, itemIndex) => {
            const media = websiteDevelopmentMedia[itemIndex + 1];
            if (!nearby.has(itemIndex + 1) || !isAvailable(media, itemIndex + 1)) return null;
            return (
              <Image
                key={media.src}
                src={media.src}
                alt=""
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                priority={itemIndex === 0}
                className={`showcase-image object-cover ${current === itemIndex + 1 ? 'showcase-image-active' : ''}`}
                onError={() => setFailed((previous) => previous.includes(itemIndex + 1) ? previous : [...previous, itemIndex + 1])}
              />
            );
          })}
          <div className="showcase-fallback" />
          {names.map((_, itemIndex) => (
            <span key={itemIndex} data-preview-number={String(itemIndex + 1).padStart(2, '0')} className={`showcase-ghost-number ${current === itemIndex + 1 ? 'showcase-ghost-active' : ''}`} />
          ))}
          <div className="showcase-image-overlay" />
          <span data-active-number={String(current).padStart(2, '0')} className="showcase-number-chip" />
        </div>
      </div>
      <div className="showcase-preview-dashes">
        {names.map((_, itemIndex) => <span key={itemIndex} className={itemIndex === index ? 'showcase-preview-dash-active' : ''} />)}
      </div>
      <span className="showcase-float-dot showcase-float-dot-one" />
      <span className="showcase-float-dot showcase-float-dot-two" />
      <span className="showcase-float-dot showcase-float-dot-three" />
      <style jsx>{`
        .showcase-preview-stage { position:relative; isolation:isolate; width:100%; aspect-ratio:16/10; margin-bottom:18px; perspective:1000px; }
        .showcase-preview-ghost { position:absolute; z-index:-1; inset:0; border:1px solid rgba(11,15,13,.08); border-radius:24px; background:#fff; box-shadow:0 18px 35px -28px rgba(11,15,13,.25); pointer-events:none; }
        .showcase-preview-ghost-one { opacity:.5; transform:translateY(10px) scale(.96); }
        .showcase-preview-ghost-two { opacity:.25; transform:translateY(20px) scale(.92); }
        .showcase-preview { position:absolute; inset:0; z-index:1; overflow:hidden; border:1px solid rgba(11,15,13,.08); border-radius:24px; background:#fff; box-shadow:0 30px 60px -30px rgba(11,15,13,.35); transform-style:preserve-3d; will-change:transform; }
        .showcase-browser-bar { position:absolute; z-index:5; top:0; right:0; left:0; display:flex; height:36px; align-items:center; gap:14px; padding:0 13px; border-bottom:1px solid rgba(11,15,13,.08); background:#fff; }
        .showcase-browser-dots { display:flex; align-items:center; gap:5px; }
        .showcase-browser-dots i { display:block; width:8px; height:8px; border-radius:50%; background:rgba(11,15,13,.12); }
        .showcase-browser-address { display:block; width:min(42%,210px); height:15px; border-radius:999px; background:rgba(11,15,13,.06); }
        .showcase-image-area { position:absolute; inset:36px 0 0; overflow:hidden; background:radial-gradient(ellipse at 72% 28%,rgba(34,197,94,.22),transparent 42%),linear-gradient(135deg,#0B0F0D,#17251D 58%,#0B0F0D); }
        .showcase-image { opacity:0; clip-path:inset(100% 0 0 0); transform:scale(1.06); transition:opacity .7s ease,clip-path .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1); }
        .showcase-image-active { opacity:1; clip-path:inset(0); transform:scale(1); }
        .showcase-fallback { position:absolute; inset:0; z-index:0; background:radial-gradient(ellipse at 72% 28%,rgba(34,197,94,.22),transparent 42%),linear-gradient(135deg,#0B0F0D,#17251D 58%,#0B0F0D); }
        .showcase-ghost-number { position:absolute; inset:0; display:grid; place-items:center; color:rgba(22,163,74,.12); opacity:0; transition:opacity .5s ease; font:800 clamp(8rem,24vw,20rem)/1 var(--font-display); }
        .showcase-ghost-active { opacity:1; }
        .showcase-ghost-number::before { content:attr(data-preview-number); color:transparent; -webkit-text-stroke:1px rgba(22,163,74,.18); }
        .showcase-image-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(11,15,13,.45),transparent 65%); pointer-events:none; }
        .showcase-number-chip { position:absolute; z-index:6; bottom:16px; left:16px; }
        .showcase-number-chip::before { display:grid; min-width:3rem; height:2.25rem; place-items:center; border-radius:999px; background:#fff; color:#0B0F0D; content:attr(data-active-number); font:700 .85rem/1 ui-monospace,monospace; }
        .showcase-preview-dashes { position:absolute; z-index:5; right:0; bottom:-13px; left:0; display:flex; align-items:center; justify-content:center; gap:5px; }
        .showcase-preview-dashes span { display:block; width:12px; height:3px; border-radius:3px; background:rgba(11,15,13,.15); }
        .showcase-preview-dashes .showcase-preview-dash-active { width:28px; background:#16A34A; }
        .showcase-float-dot { position:absolute; z-index:3; width:6px; height:6px; border-radius:50%; background:#16A34A; opacity:.35; pointer-events:none; animation-play-state:paused; }
        .showcase-float-dot-one { top:-8px; right:18%; animation:showcase-drift-one 7s ease-in-out infinite; }
        .showcase-float-dot-two { top:44%; left:-9px; animation:showcase-drift-two 8.5s ease-in-out infinite; }
        .showcase-float-dot-three { right:3%; bottom:2px; animation:showcase-drift-three 10s ease-in-out infinite; }
        .showcase-preview-stage[data-dots-running='true'] .showcase-float-dot { animation-play-state:running; }
        @keyframes showcase-drift-one { 50% { transform:translateY(-8px); } }
        @keyframes showcase-drift-two { 50% { transform:translateY(8px); } }
        @keyframes showcase-drift-three { 50% { transform:translateY(-6px); } }
        @media(max-width:1023px) { .showcase-preview-ghost { display:none; } }
        @media(max-width:639px) {
          .showcase-preview-stage { aspect-ratio:16/8; margin-bottom:18px; }
          .showcase-preview-stage:not(.showcase-preview-stage-compact) { aspect-ratio:16/8; }
          .showcase-preview-ghost,.showcase-float-dot { display:none; }
          .showcase-preview { border-radius:18px; }
          .showcase-browser-bar { height:28px; gap:10px; padding:0 10px; }
          .showcase-browser-dots { gap:4px; }
          .showcase-browser-dots i { width:6px; height:6px; }
          .showcase-browser-address { height:12px; }
          .showcase-image-area { inset-block-start:28px; }
          .showcase-number-chip { bottom:10px; left:10px; }
          .showcase-number-chip::before { min-width:2.5rem; height:1.9rem; font-size:.75rem; }
        }
        @media(prefers-reduced-motion:reduce) {
          .showcase-image { transition:opacity .01ms; clip-path:inset(0); transform:none; }
          .showcase-ghost-number { transition:none; }
          .showcase-float-dot { animation:none !important; }
        }
      `}</style>
    </div>
  );
}
