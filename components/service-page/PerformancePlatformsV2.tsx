'use client';

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import {
  BadgeIndianRupee,
  CheckCheck,
  Handshake,
  Heart,
  Link2,
  MailOpen,
  MessageCircle,
  MessageSquareText,
  Play,
  Search,
  Share2,
  SkipForward,
  TrendingUp,
} from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import {
  SiFacebook,
  SiGmail,
  SiGoogleads,
  SiInstagram,
  SiMeta,
  SiWhatsapp,
  SiYoutube,
} from 'react-icons/si';
import type { PerformanceMarketingContent } from '@/data/servicePages/performance-marketing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins } from '@/lib/gsap-register';
import { Eyebrow } from './ServiceUI';
import { PlatformsViewToggle, type PlatformsView } from './PlatformsViewToggle';

interface PlatformVisualConfig {
  image: string;
  accent: string;
  renderBadge: () => React.ReactNode;
  renderUiStrip: () => React.ReactNode;
}

const platformConfigs: PlatformVisualConfig[] = [
  {
    image: '/images/platforms/01-google-ads.jpg',
    accent: 'rgba(66, 133, 244, 0.25)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <SiGoogleads className="size-4 text-[#FBBC05]" />
        <span className="h-3 w-px bg-white/15" />
        <Search className="size-3.5 text-[#4285F4]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="rounded bg-[#FBBC05]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#FBBC05]">
            Ad
          </span>
          <span className="truncate font-mono text-[10px] text-white/80">Search Top #1</span>
        </div>
        <span className="flex items-center gap-1 font-mono text-[9px] text-[#4ADE80]">
          <TrendingUp className="size-3" /> CPC
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/02-meta-ads.jpg',
    accent: 'rgba(228, 64, 95, 0.22)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <SiMeta className="size-4 text-[#0866FF]" />
        <SiFacebook className="size-3.5 text-[#1877F2]" />
        <SiInstagram className="size-3.5 text-[#E4405F]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <span className="size-2 rounded-full bg-gradient-to-tr from-[#FBBC05] via-[#E4405F] to-[#833AB4]" />
          Sponsored Feed
        </span>
        <span className="flex items-center gap-1.5 text-white/75">
          <Heart className="size-3 fill-[#E4405F] text-[#E4405F]" />
          <MessageCircle className="size-3" />
          <Share2 className="size-3" />
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/03-youtube-ads.jpg',
    accent: 'rgba(255, 0, 0, 0.22)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <SiYoutube className="size-4.5 text-[#FF0000]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <div className="mb-1.5 h-1 w-full overflow-hidden rounded-full bg-white/20">
          <div className="relative h-full w-[62%] rounded-full bg-[#FF0000]">
            <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#FBBC05]" />
          </div>
        </div>
        <div className="flex items-center justify-between font-mono text-[9px] text-white/80">
          <span className="flex items-center gap-1">
            <Play className="size-2.5 fill-white" /> Ad • 0:15
          </span>
          <span className="inline-flex items-center gap-0.5 rounded bg-white/15 px-1.5 py-0.5 text-white">
            Skip <SkipForward className="size-2.5" />
          </span>
        </div>
      </div>
    ),
  },
  {
    image: '/images/platforms/04-linkedin-ads.jpg',
    accent: 'rgba(10, 102, 194, 0.25)',
    renderBadge: () => (
      <span className="grid size-5 place-items-center rounded bg-[#0A66C2] text-white">
        <FaLinkedinIn className="size-3" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <span className="size-1.5 rounded-full bg-[#38BDF8]" />
          Promoted B2B
        </span>
        <span className="rounded bg-[#0A66C2]/30 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#7DD3FC]">
          Lead Form
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/05-email-marketing.jpg',
    accent: 'rgba(234, 67, 53, 0.2)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <SiGmail className="size-4 text-[#EA4335]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <MailOpen className="size-3 text-[#4ADE80]" />
          Primary Inbox
        </span>
        <span className="rounded bg-[#16A34A]/30 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#4ADE80]">
          Campaign
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/06-whatsapp-marketing.jpg',
    accent: 'rgba(37, 211, 102, 0.24)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <SiWhatsapp className="size-4 text-[#25D366]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#25D366]/25 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <span className="size-1.5 rounded-full bg-[#25D366]" />
          Business Chat
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-[#38BDF8]">
          <CheckCheck className="size-3.5" /> Read
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/07-sms-marketing.jpg',
    accent: 'rgba(34, 197, 94, 0.22)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <MessageSquareText className="size-4 text-[#22C55E]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <span className="size-1.5 animate-pulse rounded-full bg-[#B6F23D]" />
          Messages • Now
        </span>
        <span className="rounded bg-[#22C55E]/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#4ADE80]">
          Instant
        </span>
      </div>
    ),
  },
  {
    image: '/images/platforms/08-affiliate-marketing.jpg',
    accent: 'rgba(182, 242, 61, 0.2)',
    renderBadge: () => (
      <span className="flex items-center gap-1.5">
        <Handshake className="size-4 text-[#B6F23D]" />
        <BadgeIndianRupee className="size-3.5 text-[#22C55E]" />
      </span>
    ),
    renderUiStrip: () => (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-[#0B0F0D]/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/85">
          <Link2 className="size-3 text-[#B6F23D]" />
          Partner Link
        </span>
        <span className="inline-flex items-center gap-0.5 rounded bg-[#B6F23D]/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#B6F23D]">
          <BadgeIndianRupee className="size-2.5" /> Payout
        </span>
      </div>
    ),
  },
];

export function PerformancePlatformsV2({
  content,
  onChangeView,
}: {
  content: PerformanceMarketingContent;
  onChangeView: (view: PlatformsView) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 40 });
  const [hovered, setHovered] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;
      const tween = gsap.fromTo(
        cards,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.58,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        },
      );
      return () => tween.scrollTrigger?.kill();
    },
    { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  const moveSpotlight = (event: PointerEvent<HTMLUListElement>) => {
    if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="performance-platforms-title"
      className="relative overflow-hidden bg-[#0B0F0D] pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div className="mx-auto w-[90%] max-w-[1280px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow>{content.platforms.eyebrow}</Eyebrow>
          <PlatformsViewToggle value="v2" onChange={onChangeView} />
        </div>

        <h2
          id="performance-platforms-title"
          className="mt-5 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-.04em]"
        >
          Your Audience Is Everywhere.{' '}
          <span className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
            So Are We.
          </span>
        </h2>
        <p className="mt-5 max-w-[44em] text-base leading-[1.75] text-white/75 sm:text-lg">
          {content.platforms.text}
        </p>

        <ul
          onPointerMove={moveSpotlight}
          className="relative mt-10 grid grid-cols-1 gap-4 rounded-[28px] sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5"
          style={
            {
              '--spot-x': `${spotlight.x}%`,
              '--spot-y': `${spotlight.y}%`,
              background:
                'radial-gradient(340px circle at var(--spot-x) var(--spot-y), rgba(34,197,94,.14), transparent 72%)',
            } as CSSProperties
          }
        >
          {content.platforms.items.map((item, index) => {
            const config = platformConfigs[index];
            const isActive = hovered === index;
            const isDimmed = hovered !== null && hovered !== index;
            return (
              <li
                key={item}
                ref={(node) => {
                  if (node) cardRefs.current[index] = node;
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`group/platform relative z-10 flex min-h-[300px] min-w-0 flex-col overflow-hidden rounded-[24px] border bg-[#111815] transition duration-300 motion-safe:hover:-translate-y-1.5 sm:min-h-[315px] ${
                  isDimmed ? 'opacity-75' : 'opacity-100'
                } ${
                  isActive
                    ? 'border-[#22C55E]/70 shadow-[0_24px_55px_rgba(0,0,0,.45)]'
                    : 'border-white/[.09] shadow-[0_14px_32px_rgba(0,0,0,.28)]'
                }`}
              >
                {/* Background Real Photo */}
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                  <Image
                    src={config.image}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover/platform:scale-105"
                  />
                  {/* Scrim for high readability */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(11,15,13,0.45) 0%, rgba(11,15,13,0.32) 38%, rgba(11,15,13,0.92) 78%, rgba(11,15,13,0.98) 100%)`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/platform:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 25%, ${config.accent}, transparent 68%)`,
                    }}
                  />
                </div>

                {/* Top Real Brand Icon + Index */}
                <div
                  aria-hidden="true"
                  className="relative z-10 flex items-center justify-between px-4 pt-4"
                >
                  <div className="inline-flex h-10 items-center rounded-2xl border border-white/15 bg-[#0B0F0D]/75 px-3 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover/platform:scale-105">
                    {config.renderBadge()}
                  </div>
                  <span className="rounded-full border border-white/20 bg-[#0B0F0D]/65 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[.15em] text-white/85 backdrop-blur-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom Authentic UI Cue + Title */}
                <div className="relative z-10 mt-auto px-4 pb-5 pt-16 sm:px-5">
                  <div aria-hidden="true" className="mb-3 transition-transform duration-300 group-hover/platform:-translate-y-0.5">
                    {config.renderUiStrip()}
                  </div>
                  <p className="font-display text-[17px] font-bold leading-snug text-white sm:text-[18px]">
                    {item}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
