'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  BadgePercent,
  Check,
  Handshake,
  HeartHandshake,
  IndianRupee,
  LayoutGrid,
  Link2,
  Megaphone,
  Network,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import type { AffiliateMarketingContent } from '@/data/servicePages/affiliate-marketing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';

export type AffiliateServicesView = 'v1' | 'v2';

export function AffiliateServicesToggle({
  value,
  onChange,
}: {
  value: AffiliateServicesView;
  onChange: (value: AffiliateServicesView) => void;
}) {
  return (
    <div
      aria-label="Affiliate services display style"
      role="group"
      className="inline-flex items-center gap-1 rounded-full border border-[#0B0F0D]/12 bg-white p-1 shadow-[0_8px_24px_rgba(11,15,13,.08)]"
    >
      <button
        type="button"
        aria-label="Show list view (Variant 1)"
        aria-pressed={value === 'v1'}
        onClick={() => onChange('v1')}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] ${
          value === 'v1' ? 'bg-[#0B0F0D] text-[#B6F23D]' : 'text-[#526058] hover:text-[#0B0F0D]'
        }`}
      >
        <LayoutGrid aria-hidden="true" className="size-3.5" />
        <span aria-hidden="true">V1</span>
      </button>
      <button
        type="button"
        aria-label="Show interactive animated view (Variant 2)"
        aria-pressed={value === 'v2'}
        onClick={() => onChange('v2')}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A] ${
          value === 'v2' ? 'bg-[#16A34A] text-white' : 'text-[#526058] hover:text-[#0B0F0D]'
        }`}
      >
        <Sparkles aria-hidden="true" className="size-3.5" />
        <span aria-hidden="true">V2</span>
      </button>
    </div>
  );
}

const serviceIcons = [
  Network,
  UsersRound,
  HeartHandshake,
  Link2,
  BadgeIndianRupee,
  Megaphone,
  Check,
  BadgePercent,
  IndianRupee,
];

function ServiceStageVisual({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage || reducedMotion) return;

      const tweens: gsap.core.Tween[] = [];
      const pulse = stage.querySelectorAll<HTMLElement>('[data-v2-pulse]');
      if (pulse.length) {
        tweens.push(
          gsap.to(pulse, {
            scale: 1.16,
            opacity: 1,
            duration: 1.35,
            stagger: 0.25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        );
      }

      const bars = stage.querySelectorAll<HTMLElement>('[data-v2-bar]');
      if (bars.length) {
        tweens.push(
          gsap.to(bars, {
            scaleY: 0.45,
            duration: 0.9,
            stagger: { each: 0.14, from: 'random' },
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: '50% 100%',
          }),
        );
      }

      const runner = stage.querySelector<SVGCircleElement>('[data-v2-runner]');
      const track = stage.querySelector<SVGPathElement>('[data-v2-track]');
      if (runner && track) {
        const len = track.getTotalLength();
        const prog = { v: 0 };
        tweens.push(
          gsap.to(prog, {
            v: 1,
            duration: 2.8,
            repeat: -1,
            ease: 'none',
            onUpdate: () => {
              const p = track.getPointAtLength(prog.v * len);
              runner.setAttribute('cx', String(p.x));
              runner.setAttribute('cy', String(p.y));
            },
          }),
        );
      }

      const spin = stage.querySelector<HTMLElement>('[data-v2-spin]');
      if (spin) {
        tweens.push(
          gsap.to(spin, {
            rotation: 360,
            duration: 18,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%',
          }),
        );
      }

      const needle = stage.querySelector<SVGPathElement>('[data-v2-needle]');
      if (needle) {
        tweens.push(
          gsap.fromTo(
            needle,
            { rotation: -65, svgOrigin: '60 56' },
            { rotation: 15, duration: 2.1, repeat: -1, yoyo: true, ease: 'sine.inOut' },
          ),
        );
      }

      const floatEl = stage.querySelectorAll<HTMLElement>('[data-v2-float]');
      if (floatEl.length) {
        tweens.push(
          gsap.to(floatEl, {
            y: -5,
            duration: 1.7,
            stagger: 0.22,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        );
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          const active = entry.isIntersecting && !document.hidden;
          tweens.forEach((t) => (active ? t.play() : t.pause()));
        },
        { threshold: 0.05 },
      );
      observer.observe(stage);

      return () => {
        observer.disconnect();
        tweens.forEach((t) => t.kill());
      };
    },
    { scope: stageRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="relative flex h-[118px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[.08] bg-[#0B0F0D] p-3"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,197,94,.2),transparent_70%)]" />

      {index === 0 && (
        <div className="relative flex w-full items-center justify-center gap-3 px-2">
          <span data-v2-pulse className="grid size-10 place-items-center rounded-xl border border-[#22C55E]/40 bg-[#16A34A]/20 text-[#4ADE80]">
            <Network className="size-4" />
          </span>
          <span className="h-0.5 w-8 rounded-full bg-gradient-to-r from-[#22C55E] to-[#B6F23D]" />
          <span data-v2-float className="grid size-11 place-items-center rounded-2xl bg-[#16A34A] text-[#0B0F0D] shadow-[0_0_24px_rgba(34,197,94,.45)]">
            <Handshake className="size-5" />
          </span>
          <span className="h-0.5 w-8 rounded-full bg-gradient-to-r from-[#B6F23D] to-[#22C55E]" />
          <span data-v2-pulse className="grid size-10 place-items-center rounded-xl border border-[#B6F23D]/45 bg-[#B6F23D]/15 text-[#B6F23D]">
            <Check className="size-4" />
          </span>
        </div>
      )}

      {index === 1 && (
        <div className="relative flex items-center justify-center">
          <div data-v2-spin className="size-20 rounded-full border border-dashed border-[#22C55E]/45" />
          <span data-v2-float className="absolute -left-5 grid size-8 place-items-center rounded-full border border-[#22C55E]/40 bg-[#11251A] text-[#4ADE80]">
            <UsersRound className="size-3.5" />
          </span>
          <span data-v2-float className="absolute -right-5 grid size-8 place-items-center rounded-full border border-[#B6F23D]/40 bg-[#11251A] text-[#B6F23D]">
            <UsersRound className="size-3.5" />
          </span>
          <span data-v2-pulse className="absolute grid size-10 place-items-center rounded-xl bg-[#16A34A] text-[#0B0F0D] shadow-[0_0_22px_rgba(34,197,94,.45)]">
            <UsersRound className="size-5" />
          </span>
        </div>
      )}

      {index === 2 && (
        <div className="relative flex items-center gap-3">
          <span data-v2-pulse className="grid size-12 place-items-center rounded-full border border-[#22C55E]/45 bg-[#16A34A]/15 text-[#4ADE80]">
            <HeartHandshake className="size-6" />
          </span>
          <div className="space-y-1.5">
            <span className="block h-2 w-24 rounded-full bg-white/25" />
            <span className="block h-1.5 w-16 rounded-full bg-[#B6F23D]/80" />
            <div className="flex gap-1 pt-0.5">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} data-v2-pulse className="size-2 rounded-full bg-[#22C55E]/80" />
              ))}
            </div>
          </div>
        </div>
      )}

      {index === 3 && (
        <svg viewBox="0 0 180 80" className="h-full w-full">
          <path
            data-v2-track
            d="M25 56 C62 14, 118 14, 155 56"
            fill="none"
            stroke="#22C55E"
            strokeOpacity=".4"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <line x1="25" y1="56" x2="90" y2="62" stroke="#16A34A" strokeOpacity=".45" strokeWidth="1.5" />
          <line x1="90" y1="62" x2="155" y2="56" stroke="#16A34A" strokeOpacity=".45" strokeWidth="1.5" />
          <circle cx="25" cy="56" r="7" fill="#16A34A" />
          <circle cx="90" cy="62" r="8" fill="#0B0F0D" stroke="#22C55E" strokeWidth="2" />
          <circle cx="155" cy="56" r="7" fill="#B6F23D" />
          <circle data-v2-runner cx="25" cy="56" r="4" fill="#B6F23D" />
        </svg>
      )}

      {index === 4 && (
        <div className="flex w-full items-end justify-center gap-3 px-4">
          <div className="flex h-16 items-end gap-1.5">
            {[42, 66, 52, 84, 100].map((h, i) => (
              <i
                key={h}
                data-v2-bar
                className="w-3 rounded-t-md"
                style={{
                  height: `${h}%`,
                  background: i === 4 ? '#B6F23D' : i >= 2 ? '#22C55E' : '#16A34A',
                }}
              />
            ))}
          </div>
          <span
            data-v2-float
            className="mb-1 grid size-11 place-items-center rounded-2xl border border-[#B6F23D]/40 bg-[#16A34A]/20 text-[#B6F23D] shadow-[0_0_20px_rgba(182,242,61,.25)]"
          >
            <BadgeIndianRupee className="size-6" />
          </span>
        </div>
      )}

      {index === 5 && (
        <div className="flex w-full items-center justify-center gap-4">
          <span data-v2-float className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-[#0B0F0D] shadow-[0_0_24px_rgba(34,197,94,.4)]">
            <Megaphone className="size-6" />
          </span>
          <div className="flex h-12 items-end gap-1.5">
            {[55, 92, 68, 100, 74, 88].map((h, i) => (
              <i
                key={i}
                data-v2-bar
                className="w-2 rounded-full bg-[#B6F23D]"
                style={{ height: `${h}%`, opacity: 0.45 + (i % 3) * 0.25 }}
              />
            ))}
          </div>
        </div>
      )}

      {index === 6 && (
        <svg viewBox="0 0 180 76" className="h-full w-full">
          <defs>
            <linearGradient id="aff-v2-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity=".4" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M12 60 C40 56, 56 36, 86 42 S126 16, 168 14 V70 H12 Z" fill="url(#aff-v2-area)" />
          <path
            data-v2-track
            d="M12 60 C40 56, 56 36, 86 42 S126 16, 168 14"
            fill="none"
            stroke="#B6F23D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle data-v2-runner cx="12" cy="60" r="4.5" fill="#B6F23D" />
        </svg>
      )}

      {index === 7 && (
        <svg viewBox="0 0 120 72" className="h-full w-32">
          <path d="M16 56a44 44 0 0 1 88 0" fill="none" stroke="white" strokeOpacity=".15" strokeWidth="9" strokeLinecap="round" />
          <path d="M16 56a44 44 0 0 1 72-34" fill="none" stroke="#22C55E" strokeWidth="9" strokeLinecap="round" />
          <path data-v2-needle d="M60 56 L86 24" stroke="#B6F23D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="56" r="5" fill="#B6F23D" />
        </svg>
      )}

      {index === 8 && (
        <div className="flex w-full items-center justify-between gap-2 px-3">
          <span data-v2-float className="grid size-11 place-items-center rounded-2xl border border-[#22C55E]/45 bg-[#16A34A]/20 text-[#4ADE80]">
            <IndianRupee className="size-5" />
          </span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <span data-v2-pulse className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-gradient-to-r from-[#16A34A] to-[#B6F23D]" />
          </div>
          <span data-v2-pulse className="grid size-9 place-items-center rounded-full bg-[#B6F23D] text-[#0B0F0D] shadow-[0_0_20px_rgba(182,242,61,.45)]">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
        </div>
      )}
    </div>
  );
}

export function AffiliateServicesV2({
  content,
  onChangeView,
}: {
  content: AffiliateMarketingContent;
  onChangeView: (view: AffiliateServicesView) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (visible && hovered === null && !document.hidden && !timer) {
        timer = setInterval(
          () => setActiveIndex((prev) => (prev + 1) % content.services.items.length),
          1600,
        );
      }
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      stop();
    };
  }, [reducedMotion, hovered, content.services.items.length]);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;
      const tween = gsap.fromTo(
        cards,
        { y: 28, scale: 0.96, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 84%', once: true },
        },
      );
      return () => tween.scrollTrigger?.kill();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  const handleCardMove = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="affiliate-services-title"
      className="relative overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-[90%] max-w-[1280px]">
        <div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <h2
              id="affiliate-services-title"
              className="max-w-[16ch] font-display text-[clamp(2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.045em]"
            >
              {content.services.title}
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5 lg:col-span-7 lg:items-end">
            <AffiliateServicesToggle value="v2" onChange={onChangeView} />
            <p className="max-w-[48em] text-base leading-[1.8] text-[#526058] sm:text-lg lg:text-right">
              {content.services.text}
            </p>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {content.services.items.map((item, index) => {
            const Icon = serviceIcons[index];
            const isHighlighted = hovered === index || (hovered === null && activeIndex === index);
            return (
              <li
                key={item}
                ref={(node) => {
                  if (node) cardRefs.current[index] = node;
                }}
                onPointerMove={handleCardMove}
                onMouseEnter={() => {
                  setHovered(index);
                  setActiveIndex(index);
                }}
                onMouseLeave={() => setHovered(null)}
                style={{ '--spot-x': '50%', '--spot-y': '40%' } as CSSProperties}
                className={`group relative isolate flex flex-col justify-between overflow-hidden rounded-[26px] border bg-white p-5 transition duration-300 before:pointer-events-none before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] before:[background:radial-gradient(240px_circle_at_var(--spot-x)_var(--spot-y),rgba(22,163,74,.1),transparent_70%)] hover:before:opacity-100 motion-safe:hover:-translate-y-1.5 sm:p-6 ${
                  isHighlighted
                    ? 'border-[#16A34A]/55 shadow-[0_22px_50px_rgba(11,15,13,.12)]'
                    : 'border-[#0B0F0D]/[.08] shadow-[0_12px_32px_rgba(11,15,13,.045)]'
                }`}
              >
                {/* Live Animated Stage */}
                <ServiceStageVisual index={index} reducedMotion={reducedMotion} />

                {/* Card Meta + Title */}
                <div className="relative z-10 mt-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-[#16A34A] text-white scale-105'
                          : 'bg-[#16A34A]/10 text-[#16A34A]'
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <span
                        aria-hidden="true"
                        className="block font-mono text-[11px] font-bold tracking-[.15em] text-[#16A34A]"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-[16px] font-bold leading-snug text-[#0B0F0D] sm:text-[18px]">
                        {item}
                      </h3>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                      isHighlighted
                        ? 'border-[#16A34A] bg-[#0B0F0D] text-[#B6F23D] translate-x-0.5 -translate-y-0.5'
                        : 'border-[#0B0F0D]/10 text-[#0B0F0D]/35'
                    }`}
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>

                {/* Active Bottom Accent Line */}
                <span
                  aria-hidden="true"
                  className={`mt-5 block h-[2px] rounded-full bg-gradient-to-r from-[#16A34A] to-[#B6F23D] transition-all duration-500 ${
                    isHighlighted ? 'w-full opacity-100' : 'w-12 opacity-30'
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
