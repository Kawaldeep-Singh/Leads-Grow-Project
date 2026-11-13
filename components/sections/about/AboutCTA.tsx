'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ctaBars = [18, 28, 38, 54, 32, 64, 42, 74, 48, 86, 56, 68, 34, 78, 44, 92, 58, 72, 38, 60, 30, 80, 48, 66, 36];

export const AboutCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barsRef = useRef<HTMLSpanElement[]>([]);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !sectionRef.current) return;
    registerGsapPlugins();
    const words = titleRef.current?.querySelectorAll<HTMLElement>('[data-cta-word]');
    if (words?.length) {
      gsap.fromTo(words, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.055,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: titleRef.current, start: 'top 82%', once: true },
      });
    }
    if (revealRef.current) {
      gsap.fromTo(revealRef.current, { scaleY: 0, transformOrigin: '50% 100%' }, {
        scaleY: 1,
        duration: 0.45,
        ease: 'power2.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 82%', once: true },
      });
    }
    gsap.fromTo(barsRef.current.filter(Boolean), { scaleY: 0, transformOrigin: '50% 100%' }, {
      scaleY: 1,
      duration: 0.9,
      stagger: 0.035,
      ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
    });
  }, { dependencies: [reduced], revertOnUpdate: true });

  useEffect(() => {
    if (reduced || !buttonRef.current || !window.matchMedia('(pointer: fine)').matches) return;
    const button = buttonRef.current;
    const xTo = gsap.quickTo(button, 'x', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: 0.35, ease: 'power2.out' });
    const fill = button.querySelector<HTMLElement>('[data-cursor-fill]');
    const onMove = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (fill) {
        fill.style.left = `${x}px`;
        fill.style.top = `${y}px`;
        fill.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) < 100) {
        xTo(dx * 0.12);
        yTo(dy * 0.12);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      if (fill) fill.style.transform = 'translate(-50%, -50%) scale(0)';
    };
    button.addEventListener('pointermove', onMove);
    button.addEventListener('pointerleave', onLeave);
    return () => {
      button.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(button);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} aria-labelledby="about-cta-title" className="relative isolate overflow-x-clip bg-[#16A34A] py-24 text-[#0B0F0D] sm:py-28 lg:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex h-40 items-end justify-around overflow-hidden opacity-[0.1] sm:h-56">
        {ctaBars.map((height, index) => (
          <span key={index} ref={(node) => { if (node) barsRef.current[index] = node; }} className="w-[3.2%] origin-bottom rounded-t-sm bg-[#0B0F0D]" style={{ height: `${height}%` }} />
        ))}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 top-1/2 h-px w-[130%] -rotate-[7deg] border-t border-dashed border-[#0B0F0D]/15" />
        <div className="absolute -left-10 top-[62%] h-px w-[130%] rotate-[5deg] border-t border-dashed border-[#0B0F0D]/10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0B0F0D]/[0.04] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-[90%] max-w-5xl flex-col items-center text-center">
        <h2 ref={titleRef} id="about-cta-title" className="font-display text-[clamp(1.35rem,4vw,3.1rem)] font-extrabold leading-[1.25] tracking-[-0.03em] sm:leading-[1.2]">
          <span data-cta-word className="inline-block">Ready</span>{' '}
          <span data-cta-word className="inline-block">to</span>{' '}
          <span data-cta-word className="inline-block">Take</span>{' '}
          <span data-cta-word className="inline-block">Your</span>{' '}
          <span data-cta-word className="inline-block">Business</span>{' '}
          <span data-cta-word className="inline-block">to</span>{' '}
          <span data-cta-word className="inline-block">the</span>{' '}
          <span className="relative inline-block px-[0.08em]">
            <span ref={revealRef} aria-hidden="true" className="absolute inset-0 -z-0 origin-bottom bg-[#0B0F0D]" />
            <span data-cta-word className="relative text-white">Next</span>{' '}
            <span data-cta-word className="relative text-white">Level?</span>
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#0B0F0D]/80 sm:text-xl">{aboutContent.cta.text}</p>
        <Link
          ref={buttonRef}
          href="/contact"
          prefetch={false}
          className="group relative mt-9 inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#0B0F0D] px-8 py-4 text-center text-sm font-bold text-white transition-transform duration-200 hover:text-[#0B0F0D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B0F0D] sm:mt-10 sm:w-auto sm:px-10 sm:text-base"
        >
          <span data-cursor-fill aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[#B6F23D] transition-transform duration-500 ease-out group-hover:scale-100" />
          <span className="relative z-10">{aboutContent.cta.button}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="relative z-10 h-4 w-4 fill-current transition-transform duration-300 group-hover:translate-x-1">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </section>
  );
};
