'use client';

import { useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import type { ServiceChannel } from '@/data/servicePages/types';

type ChannelRowProps = {
  channel: ServiceChannel;
  index: number;
  active: boolean;
  autoplaying: boolean;
  onActivate: (index: number) => void;
  buttonRef?: (node: HTMLButtonElement | null) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
};

export function ChannelRow({ channel, index, active, autoplaying, onActivate, buttonRef, onKeyDown }: ChannelRowProps) {
  const arrowRef = useRef<HTMLSpanElement>(null);

  const moveArrow = (event: PointerEvent<HTMLButtonElement>) => {
    if (!active || event.pointerType === 'touch' || !arrowRef.current) return;
    const rect = arrowRef.current.getBoundingClientRect();
    const x = Math.max(-6, Math.min(6, (event.clientX - (rect.left + rect.width / 2)) * 0.16));
    const y = Math.max(-6, Math.min(6, (event.clientY - (rect.top + rect.height / 2)) * 0.16));
    arrowRef.current.style.setProperty('--arrow-x', `${x}px`);
    arrowRef.current.style.setProperty('--arrow-y', `${y}px`);
  };

  const resetArrow = () => {
    arrowRef.current?.style.setProperty('--arrow-x', '0px');
    arrowRef.current?.style.setProperty('--arrow-y', '0px');
  };

  return (
    <li className="channel-row-shell">
      <button
        ref={buttonRef}
        data-channel-row
        type="button"
        aria-pressed={active}
        onPointerEnter={() => onActivate(index)}
        onPointerMove={moveArrow}
        onPointerLeave={resetArrow}
        onFocus={() => onActivate(index)}
        onClick={() => onActivate(index)}
        onKeyDown={(event) => onKeyDown(event, index)}
        className="channel-row"
        data-active={active ? 'true' : 'false'}
        data-autoplay={autoplaying ? 'true' : 'false'}
      >
        <span className="channel-row__number">{channel.n}</span>
        <span className="channel-row__copy">
          <span className="channel-row__tag">{channel.tag}</span>
          <span className="channel-row__name">{channel.name}</span>
        </span>
        <span ref={arrowRef} className="channel-row__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" focusable="false">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span aria-hidden="true" className="channel-row__progress" />
      </button>
    </li>
  );
}
