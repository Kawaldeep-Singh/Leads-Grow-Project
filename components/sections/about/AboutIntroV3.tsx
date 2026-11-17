'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, SplitText } from '@/lib/gsap-register';

export function AboutIntroV3() {
  const rootRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<HTMLElement[]>([]);
  const reduced = useReducedMotion();

  useGSAP(() => {
    registerGsapPlugins();
    if (reduced || !rootRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = rootRef.current;
    const splits: SplitText[] = [];
    const context = gsap.context(() => {
      rowRefs.current.filter(Boolean).forEach((row) => {
        const paragraph = row.querySelector<HTMLElement>('[data-intro-copy]');
        const line = row.querySelector<HTMLElement>('[data-intro-line]');
        const dot = row.querySelector<HTMLElement>('[data-intro-dot]');
        if (!paragraph || !line || !dot) return;

        const split = new SplitText(paragraph, { type: 'words' });
        splits.push(split);

        gsap.fromTo(split.words, { opacity: 0.25 }, {
          opacity: 1,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 80%', once: true },
        });
        gsap.fromTo(dot, { scale: 0 }, {
          scale: 1,
          duration: 0.55,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: row, start: 'top 80%', once: true },
        });
      });
    }, root);

    return () => {
      splits.forEach((split) => split.revert());
      context.revert();
    };
  }, { scope: rootRef, dependencies: [reduced], revertOnUpdate: true });

  return (
    <section ref={rootRef} aria-label="About LeadsGrow introduction" className="bg-[#F6FAF7] text-[#0B0F0D]">
      <div className="mx-auto w-[90%] max-w-[1200px] py-[clamp(80px,12vw,160px)] sm:w-[88%] lg:w-[85%]">
        <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
          {aboutContent.hero.paragraphs.slice(1).map((paragraph, index) => (
            <article
              key={paragraph}
              ref={(node) => { if (node) rowRefs.current[index] = node; }}
              className="relative"
            >
              <span data-intro-line className={`mb-5 block h-px w-full origin-left bg-[#0B0F0D]/[0.14] ${reduced ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
              <div className="grid grid-cols-1 items-start lg:grid-cols-12">
                <div className="mb-4 flex lg:col-span-3 lg:mb-0 lg:pt-[0.8em]">
                  <span data-intro-dot className={`size-[10px] rounded-full bg-[#22C55E] ${reduced ? 'scale-100' : 'scale-0'}`} aria-hidden="true" />
                </div>
                <p
                  data-intro-copy
                  className="text-[clamp(1.125rem,3vw,1.25rem)] leading-[1.45] text-[#0B0F0D] lg:col-span-9 lg:text-[clamp(1.25rem,calc(1rem_+_1.2vw),1.9rem)] lg:font-medium"
                >
                  {paragraph}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
