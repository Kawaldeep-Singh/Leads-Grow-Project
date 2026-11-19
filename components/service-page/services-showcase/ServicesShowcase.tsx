'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import type { WebsiteDevelopmentContent } from '@/data/servicePages';
import { websiteDevelopmentMedia } from '@/data/servicePages/website-development.media';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { ShowcasePreview } from './ShowcasePreview';
import { ShowcaseRow } from './ShowcaseRow';
import { useActiveRow } from './useActiveRow';

export function ServicesShowcase({ content }: { content: WebsiteDevelopmentContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [mobile, setMobile] = useState(false);
  const reducedMotion = useReducedMotion();
  const rows = useActiveRow(content.services.items.length);
  const activeName = content.services.items[rows.activeIndex] ?? content.services.items[0];
  const entries = useMemo(() => content.services.items.map((name, index) => ({ name, index, media: websiteDevelopmentMedia[index + 1] })), [content.services.items]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    const left = leftRef.current;
    const heading = headingRef.current;
    if (!section || !left || !heading || reducedMotion) return;
    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector<HTMLElement>('[data-showcase-eyebrow]');
      const paragraph = section.querySelector<HTMLElement>('[data-showcase-paragraph]');
      const preview = section.querySelector<HTMLElement>('[data-showcase-preview]');
      const items = gsap.utils.toArray<HTMLElement>('[data-showcase-row]');
      const titles = gsap.utils.toArray<HTMLElement>('[data-showcase-heading-word]');
      gsap.set([eyebrow, ...titles, paragraph, preview, ...items].filter(Boolean), { willChange: 'transform,opacity,clip-path' });
      const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', once: true } });
      timeline.fromTo(eyebrow, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0)', duration: .7, ease: 'expo.out' }, 0)
        .fromTo(titles, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .05 }, .06)
        .fromTo(paragraph, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'expo.out' }, .24)
        .fromTo(preview, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'expo.out' }, .35)
        .fromTo(items, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'expo.out', stagger: .06 }, .45);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    return () => ctx.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  const onRowKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + entries.length) % entries.length;
    sectionRef.current?.querySelectorAll<HTMLButtonElement>('[data-showcase-row] .showcase-row-trigger')[next]?.focus();
  };

  return (
    <section ref={sectionRef} id="website-services-title" aria-labelledby="website-services-heading" className="services-showcase relative bg-[#F6FAF7] text-[#0B0F0D]">
      <div className="services-showcase-container mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="services-showcase-layout grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div ref={leftRef} className="services-showcase-intro min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <p data-showcase-eyebrow className="showcase-eyebrow"><span className="showcase-eyebrow-dot" aria-hidden="true" />{content.services.eyebrow}</p>
            <h2 ref={headingRef} id="website-services-heading" className="showcase-heading font-display">
              <span data-showcase-heading-word className="showcase-heading-line">{content.services.title.split(' We Build It.')[0]}</span>
              <span data-showcase-heading-word className="showcase-heading-line text-[#16A34A]">We Build It.</span>
            </h2>
            <p data-showcase-paragraph className="showcase-paragraph">{content.services.text}</p>
            <div data-showcase-preview className="showcase-preview-wrap">
              <div data-showcase-preview-card className="hidden lg:block">
                <ShowcasePreview index={rows.activeIndex} names={content.services.items} />
              </div>
            </div>
            <div className="showcase-tablet-preview">
              <ShowcasePreview index={rows.activeIndex} names={content.services.items} compact />
            </div>
          </div>

          <div className="services-showcase-list-column min-w-0 lg:col-span-6 lg:col-start-7" onMouseEnter={() => rows.setPointerOnList(true)} onMouseLeave={() => rows.setPointerOnList(false)}>
            <div className="showcase-tablet-sticky"><ShowcasePreview index={rows.activeIndex} names={content.services.items} compact /></div>
            <ul className="showcase-list" role="list" aria-label={content.services.eyebrow}>
              {entries.map(({ name, index, media }) => (
                <ShowcaseRow
                  key={name}
                  index={index}
                  name={name}
                  active={rows.activeIndex === index}
                  mobile={mobile}
                  media={media}
                  onActivate={() => rows.activate(index)}
                  onHover={(hovering) => { if (hovering) { rows.setPointerOnList(true); rows.activate(index); } else rows.setPointerOnList(false); }}
                  onKeyDown={onRowKeyDown(index)}
                  onPress={() => rows.setActiveIndex(index)}
                  preview={<ShowcasePreview index={index} names={content.services.items} />}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        .services-showcase { padding-block:clamp(96px,12vw,180px); }
        .services-showcase-container { width:100%; }
        .showcase-eyebrow { display:inline-flex; align-items:center; gap:.7em; min-height:42px; padding:.6em 1.3em; border-radius:999px; background:#0B0F0D; color:#16A34A; white-space:nowrap; font:700 clamp(1rem,.9rem + .6vw,1.2rem)/1 var(--font-display); }
        .showcase-eyebrow-dot { width:.5em; height:.5em; flex:none; border-radius:999px; background:#22C55E; }
        .showcase-heading { margin-top:26px; max-width:12ch; font-size:clamp(2.1rem,4.2vw,3.8rem); font-weight:800; line-height:1.05; letter-spacing:-.03em; }
        .showcase-heading-line { display:block; }
        .showcase-paragraph { margin-top:20px; max-width:30em; color:#5B6B63; font-size:clamp(1.125rem,1rem + .3vw,1.25rem); line-height:1.65; }
        .showcase-preview-wrap { margin-top:34px; }
        .showcase-tablet-preview,.showcase-tablet-sticky { display:none; }
        .showcase-list { margin:0; padding:0; list-style:none; }
        @media(min-width:640px) and (max-width:1023px) {
          .services-showcase-layout { gap:34px; }
          .showcase-heading { max-width:16ch; }
          .showcase-tablet-preview { display:block; position:sticky; top:88px; z-index:5; margin-top:28px; }
        }
        @media(min-width:640px) and (max-width:1023px) {
          .showcase-tablet-preview { display:none; }
          .showcase-tablet-sticky { display:block; position:sticky; top:88px; z-index:5; margin-bottom:10px; }
          .showcase-list-column { position:relative; }
        }
        @media(max-width:639px) {
          .services-showcase { padding-block:88px; }
          .services-showcase-container { padding-inline:20px; }
          .services-showcase-layout { gap:26px; }
          .showcase-eyebrow { min-height:38px; padding:.6em 1.1em; font-size:1rem; }
          .showcase-heading { max-width:14ch; margin-top:20px; font-size:clamp(2rem,8vw,2.7rem); }
          .showcase-paragraph { margin-top:14px; font-size:1rem; line-height:1.6; }
          .showcase-preview-wrap,.showcase-tablet-preview,.showcase-tablet-sticky { display:none; }
        }
        @media(prefers-reduced-motion:reduce) { .showcase-heading [data-showcase-heading-word],.showcase-eyebrow,.showcase-paragraph,.showcase-preview-wrap,[data-showcase-row] { will-change:auto !important; } }
      `}</style>
    </section>
  );
}
