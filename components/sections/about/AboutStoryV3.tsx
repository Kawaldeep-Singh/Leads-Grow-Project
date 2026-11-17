'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { renderStoryScene, StoryScenes } from './StoryScenes';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function chapterWeights(progress: number) {
  const phase = clamp(progress) * 3;
  const chapter = Math.min(2, Math.floor(phase));
  const local = phase - chapter;
  const weights = [0, 0, 0];
  if (chapter < 2 && local >= 0.94) {
    const nextWeight = clamp((local - 0.94) / 0.12);
    weights[chapter] = 1 - nextWeight;
    weights[chapter + 1] = nextWeight;
  } else if (chapter > 0 && local <= 0.06) {
    const currentWeight = clamp(0.5 + local / 0.12);
    weights[chapter - 1] = 1 - currentWeight;
    weights[chapter] = currentWeight;
  } else {
    weights[chapter] = 1;
  }
  return { phase, weights };
}

export function AboutStoryV3() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef<HTMLElement[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const reducedMotion = useReducedMotion();
  const paragraphs = aboutContent.hero.paragraphs.slice(1);

  useGSAP(() => {
    registerGsapPlugins();
    const section = sectionRef.current;
    if (!section || reducedMotion) return;
    const media = gsap.matchMedia();

    media.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const articles = articleRefs.current.filter(Boolean);
      const scenes = articles.map((article) => article.querySelector<HTMLElement>('[data-story-scene]')).filter((scene): scene is HTMLElement => Boolean(scene));
      const driver = { target: 0, current: 0 };
      let inView = false;

      const applyFrame = (progress: number) => {
        const { phase, weights } = chapterWeights(progress);
        articles.forEach((article, index) => {
          const weight = weights[index];
          const direction = index < phase ? -20 : 20;
          article.style.opacity = String(weight);
          article.style.transform = `translate3d(0, ${direction * (1 - weight)}px, 0)`;
          const scene = scenes[index];
          if (scene) renderStoryScene(scene, index, clamp(phase - index));
        });
        const activeIndex = weights.indexOf(Math.max(...weights));
        const activeText = articles[activeIndex]?.querySelector('p');
        const layoutBounds = layoutRef.current?.getBoundingClientRect();
        const textBounds = activeText?.getBoundingClientRect();
        if (dividerRef.current && layoutBounds && textBounds) {
          const top = textBounds.top - layoutBounds.top;
          const height = textBounds.height;
          dividerRef.current.style.top = `${top}px`;
          dividerRef.current.style.height = `${height}px`;
          dotRefs.current.filter(Boolean).forEach((dot, index) => {
            dot.style.top = `${top + height * (index / 2)}px`;
          });
        }
        if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`;
        dotRefs.current.filter(Boolean).forEach((dot, index) => {
          const active = weights[index] > 0.5;
          dot.style.transform = `translate(-50%, -50%) scale(${active ? 1.25 : 1})`;
          dot.style.opacity = active ? '1' : '0.55';
        });
      };

      applyFrame(0);
      const trigger = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => { driver.target = self.progress; },
        onRefresh: (self) => { driver.target = self.progress; },
      });
      const ticker = (_time: number, delta: number) => {
        if (!inView) return;
        const dt = Math.max(0, delta) / 1000;
        driver.current += (driver.target - driver.current) * (1 - Math.exp(-dt * 10));
        applyFrame(driver.current);
      };
      gsap.ticker.add(ticker);
      const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.01 });
      observer.observe(stage);

      return () => {
        gsap.ticker.remove(ticker);
        observer.disconnect();
        trigger.kill();
      };
    });

    media.add('(max-width: 1023px)', () => {
      const articles = articleRefs.current.filter(Boolean);
      articles.forEach((article, index) => {
        const scene = article.querySelector<HTMLElement>('[data-story-scene]');
        if (!scene) return;
        renderStoryScene(scene, index, 0);
        const local = { value: 0 };
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: article, start: 'top 82%', once: true },
        });
        timeline.fromTo(scene, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, 0);
        timeline.to(local, { value: 1, duration: 1.35, ease: 'power2.inOut', onUpdate: () => renderStoryScene(scene, index, local.value) }, 0);
      });
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section ref={sectionRef} aria-label="About LeadsGrow story" className="relative bg-[#F6FAF7] text-[#0B0F0D]">
      <div ref={trackRef} data-story-track className={`relative ${reducedMotion ? '' : 'lg:h-[310svh]'}`}>
        <div ref={stageRef} className={`relative ${reducedMotion ? '' : 'lg:sticky lg:top-[76px] lg:h-[calc(100svh-76px)]'}`}>
          <div className={`relative mx-auto w-[90%] max-w-[1280px] py-16 sm:w-[88%] sm:py-20 lg:w-[85%] ${reducedMotion ? '' : 'lg:h-full lg:py-0'}`}>
            <div ref={layoutRef} className={`relative ${reducedMotion ? 'flex flex-col gap-14' : 'lg:h-full'}`}>
              {!reducedMotion && <div ref={dividerRef} aria-hidden="true" className="absolute left-[57.8%] top-0 hidden w-[3px] bg-[#0B0F0D]/15 lg:block">
                <div ref={progressRef} className="h-full w-full origin-top scale-y-0 bg-[#16A34A]" />
              </div>}
              {!reducedMotion && [0, 1, 2].map((index) => <span key={index} ref={(node) => { if (node) dotRefs.current[index] = node; }} aria-hidden="true" className="absolute left-[calc(57.8%+1.5px)] z-20 hidden size-[10px] rounded-full border-2 border-[#16A34A] bg-[#F6FAF7] transition-transform lg:block" />)}

              {paragraphs.map((paragraph, index) => (
                <article
                  key={paragraph}
                  ref={(node) => { if (node) articleRefs.current[index] = node; }}
                  className={`relative grid grid-cols-1 gap-5 ${reducedMotion ? 'border-t border-[#0B0F0D]/15 pt-8' : `lg:absolute lg:inset-0 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-8 lg:border-0 lg:pt-0 ${index === 0 ? 'lg:opacity-100' : 'lg:opacity-0'}`}`}
                  style={{ zIndex: paragraphs.length - index }}
                >
                  <StoryScenes chapter={index} final={reducedMotion} className="mx-auto h-[220px] w-full max-w-[360px] lg:col-span-6 lg:col-start-1 lg:h-[min(72vh,520px)] lg:max-w-none" />
                  <p className="text-[18px] font-medium leading-[1.5] text-[#0B0F0D] sm:text-[20px] lg:col-span-5 lg:col-start-8 lg:text-[clamp(1.25rem,calc(1rem_+_1vw),1.75rem)]">
                    {paragraph}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
