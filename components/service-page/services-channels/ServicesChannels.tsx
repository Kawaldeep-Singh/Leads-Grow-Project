'use client';

import { useRef, type KeyboardEvent } from 'react';
import type { DigitalMarketingContent } from '@/data/servicePages';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { ChannelDial } from './ChannelDial';
import { ChannelRow } from './ChannelRow';
import { useActiveChannel } from './useActiveChannel';
import './services-channels.css';

function renderHeadingWords(value: string, startIndex = 0) {
  return value.split(/(\s+)/).map((word, index) => /\s+/.test(word)
    ? word
    : <span data-channel-heading-word key={`${startIndex + index}-${word}`}>{word}</span>);
}

function ChannelCount({ count, reducedMotion }: { count: string; reducedMotion: boolean }) {
  return (
    <div className="channel-count">
      <svg className="channel-count__ring" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {Array.from({ length: 9 }, (_, index) => {
          const start = -90 + index * 40 + 3;
          const end = start + 33;
          const point = (angle: number) => ({
            x: 12 + 9 * Math.cos(angle * Math.PI / 180),
            y: 12 + 9 * Math.sin(angle * Math.PI / 180),
          });
          const a = point(start);
          const b = point(end);
          return <path key={index} data-count-segment d={`M${a.x} ${a.y} A9 9 0 0 1 ${b.x} ${b.y}`} pathLength="1" strokeDasharray="1" strokeDashoffset={reducedMotion ? 0 : 1} />;
        })}
      </svg>
      <span>{count}</span>
    </div>
  );
}

export function ServicesChannels({ content }: { content: DigitalMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLUListElement>(null);
  const rowButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { activeIndex, isInView, activate, setInteraction, reducedMotion, shouldAutoplay } = useActiveChannel(
    sectionRef,
    stageRef,
    rowsRef,
    content.services.items.length,
  );

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const eyebrow = section.querySelector<HTMLElement>('.channel-header__eyebrow');
    const words = section.querySelectorAll<HTMLElement>('[data-channel-heading-word]');
    const segments = section.querySelectorAll<SVGPathElement>('[data-count-segment]');
    const ring = section.querySelector<SVGCircleElement>('.channel-dial__ring circle');
    const nodes = section.querySelectorAll<HTMLElement>('.channel-dial__node');
    const rows = section.querySelectorAll<HTMLElement>('[data-channel-row]');
    const separators = section.querySelectorAll<HTMLElement>('.channel-row-shell');

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      defaults: { ease: 'expo.out' },
    });
    if (eyebrow) timeline.fromTo(eyebrow, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.65 }, 0);
    if (words.length) timeline.fromTo(words, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05 }, 0.08);
    if (segments.length) timeline.to(segments, { strokeDashoffset: 0, duration: 0.32, stagger: 0.07, ease: 'power2.inOut' }, 0.32);
    if (ring) timeline.fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.3);
    if (nodes.length) timeline.fromTo(nodes, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(2)' }, 0.45);
    if (separators.length) timeline.fromTo(separators, { '--channel-divider-scale': 0 }, { '--channel-divider-scale': 1, duration: 0.42, stagger: 0.06, ease: 'power2.inOut' }, 0.52);
    if (rows.length) timeline.fromTo(rows, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06 }, 0.56);
    return () => timeline.scrollTrigger?.kill();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  const handleRowKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + direction + content.services.items.length) % content.services.items.length;
    rowButtonRefs.current[nextIndex]?.focus();
    activate(nextIndex);
  };

  return (
    <section ref={sectionRef} id="digital-marketing-services" aria-labelledby="digital-marketing-services-title" className="services-channels">
      <div className="services-channels__glow" aria-hidden="true" />
      <div className="services-channels__container">
        <header className="channel-header">
          <div className="channel-header__copy">
            <p className="channel-header__eyebrow"><span>{content.services.eyebrow}</span></p>
            <h2 id="digital-marketing-services-title" className="channel-header__title">
              {renderHeadingWords('Everything Your Brand Needs to ', 0)}
              <span className="channel-header__highlight">{renderHeadingWords('Grow Online.', 40)}</span>
            </h2>
          </div>
          <ChannelCount count={content.services.count} reducedMotion={reducedMotion} />
        </header>

        <div
          ref={stageRef}
          className="channel-stage"
          onPointerEnter={() => setInteraction(true)}
          onPointerLeave={() => setInteraction(false)}
          onFocusCapture={() => setInteraction(true)}
          onBlurCapture={(event) => {
            if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
            setInteraction(false);
          }}
        >
          <div className="channel-stage__dial-column">
            <ChannelDial
              channels={content.services.items}
              activeIndex={activeIndex}
              inView={isInView}
              reducedMotion={reducedMotion}
              onActivate={activate}
            />
          </div>
          <ul ref={rowsRef} className="channel-list" aria-label={content.services.eyebrow}>
            {content.services.items.map((channel, index) => (
              <ChannelRow
                key={channel.n}
                channel={channel}
                index={index}
                active={index === activeIndex}
                autoplaying={shouldAutoplay}
                onActivate={activate}
                buttonRef={(node) => { rowButtonRefs.current[index] = node; }}
                onKeyDown={handleRowKeyDown}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
