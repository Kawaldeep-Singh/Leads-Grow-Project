'use client';

import Image from 'next/image';
import { useState } from 'react';
import { websiteDevelopmentMedia, type WebsiteDevelopmentMedia } from '@/data/servicePages/website-development.media';

interface ShowcasePreviewProps {
  index: number;
  names: readonly string[];
  compact?: boolean;
}

export function ShowcasePreview({ index, names, compact = false }: ShowcasePreviewProps) {
  const [failed, setFailed] = useState<number[]>([]);
  const current = index + 1;
  const isAvailable = (item: WebsiteDevelopmentMedia | undefined, itemIndex: number) => Boolean(item?.available && !failed.includes(itemIndex));
  const nearby = new Set([current, current === 1 ? names.length : current - 1, current === names.length ? 1 : current + 1]);

  return (
    <div aria-hidden="true" className={`showcase-preview relative isolate overflow-hidden rounded-[24px] border border-[#0B0F0D]/[.08] bg-[#0B0F0D] shadow-[0_30px_60px_-30px_rgba(11,15,13,.35)] ${compact ? 'aspect-[16/7] rounded-[20px]' : 'aspect-[16/10]'}`}>
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
      <div className="showcase-fallback absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_28%,rgba(34,197,94,.22),transparent_42%),linear-gradient(135deg,#0B0F0D,#17251D_58%,#0B0F0D)]" />
      {names.map((_, itemIndex) => (
        <span key={itemIndex} data-preview-number={String(itemIndex + 1).padStart(2, '0')} className={`showcase-ghost-number ${current === itemIndex + 1 ? 'showcase-ghost-active' : ''}`} />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0F0D]/45 via-transparent to-transparent" />
      <span data-active-number={String(current).padStart(2, '0')} className="showcase-number-chip absolute bottom-5 left-5 z-10" />
      <style jsx>{`
        .showcase-image { opacity: 0; clip-path: inset(100% 0 0 0); transform: scale(1.06); transition: opacity .7s ease, clip-path .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
        .showcase-image-active { opacity: 1; clip-path: inset(0); transform: scale(1); }
        .showcase-ghost-number { position:absolute; inset:0; display:grid; place-items:center; font:800 clamp(8rem,24vw,20rem)/1 var(--font-display); color:rgba(182,242,61,.12); opacity:0; transition:opacity .5s ease; }
        .showcase-ghost-active { opacity:1; }
        .showcase-ghost-number::before { content:attr(data-preview-number); -webkit-text-stroke:1px rgba(182,242,61,.18); color:transparent; }
        .showcase-number-chip::before { content:attr(data-active-number); display:grid; min-width:3rem; height:2.25rem; place-items:center; border-radius:999px; background:#fff; color:#0B0F0D; font:700 .85rem/1 ui-monospace,monospace; }
        @media (prefers-reduced-motion: reduce) { .showcase-image { transition:opacity .01ms; clip-path:inset(0); transform:none; } }
      `}</style>
    </div>
  );
}
