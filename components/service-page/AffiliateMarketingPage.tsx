'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, BadgeIndianRupee, BadgePercent, BookOpen, Check, Handshake, HeartHandshake, IndianRupee, Link2, Megaphone, Network, ShoppingBag, UsersRound } from 'lucide-react';
import { AboutStory } from '@/components/sections/about/AboutStory';
import { Industries } from '@/components/sections/Industries';
import type { AffiliateMarketingContent } from '@/data/servicePages/affiliate-marketing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { ServiceBreadcrumb } from './ServiceBreadcrumb';
import { Eyebrow } from './ServiceUI';
import {
  AffiliateServicesToggle,
  AffiliateServicesV2,
  type AffiliateServicesView,
} from './AffiliateServicesV2';

const lime = '#B6F23D';

function useAffiliateReveal(sectionRef: RefObject<HTMLElement | null>, selector: string, stagger = 0) {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = Array.from(section.querySelectorAll<HTMLElement>(selector));
    if (reducedMotion) {
      targets.forEach((target) => { target.style.opacity = '1'; target.style.transform = 'none'; });
      return;
    }

    targets.forEach((target) => { target.style.opacity = '0'; target.style.transform = 'translate3d(0, 26px, 0)'; });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        const animation = target.animate(
          [{ opacity: 0, transform: 'translate3d(0, 26px, 0)' }, { opacity: 1, transform: 'translate3d(0, 0, 0)' }],
          { duration: 720, delay: stagger * targets.indexOf(target), easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' },
        );
        animation.onfinish = () => { target.style.opacity = '1'; target.style.transform = 'none'; animation.cancel(); };
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [reducedMotion, sectionRef, selector, stagger]);
}

function AffiliateHero({ content }: { content: AffiliateMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !sectionRef.current) return;
    const titleLines = titleRef.current?.querySelectorAll('[data-title-line]');
    if (titleLines?.length) gsap.fromTo(titleLines, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .12, ease: 'expo.out', delay: .15 });
    const nodes = visualRef.current?.querySelectorAll('[data-partner-node]');
    if (nodes?.length) gsap.fromTo(nodes, { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, stagger: .08, delay: .65, ease: 'back.out(1.7)' });
    const orbitRings = visualRef.current?.querySelectorAll<HTMLElement>('[data-orbit-ring]');
    orbitRings?.forEach((ring, index) => gsap.to(ring, { rotation: index === 0 ? 360 : -360, duration: index === 0 ? 42 : 29, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }));
    const paths = visualRef.current?.querySelectorAll('[data-network-line]');
    paths?.forEach((path) => {
      const line = path as SVGPathElement;
      const length = line.getTotalLength();
      gsap.fromTo(line, { strokeDasharray: `5 ${length}`, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.1, delay: .3, ease: 'power2.out', onComplete: () => gsap.to(line, { strokeDashoffset: -length, duration: 5, repeat: -1, ease: 'none' }) });
    });
    if (nodes?.length) gsap.to(nodes, { y: -5, duration: 1.8, stagger: { each: .17, from: 'random' }, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={sectionRef} aria-labelledby="affiliate-hero-title" className="relative isolate min-h-[min(850px,100svh)] overflow-hidden bg-[#0B0F0D] text-white">
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[16%] h-[500px] w-[500px] rounded-full bg-[#16A34A]/15 blur-[140px]" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.14] [background-image:linear-gradient(rgba(34,197,94,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,.13)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(ellipse_at_75%_45%,black,transparent_62%)]" />
    <div className="relative z-10 mx-auto grid min-h-[min(850px,100svh)] w-[90%] max-w-7xl content-center gap-y-8 pb-12 pt-32 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:pb-10 lg:pt-36">
      <div className="lg:col-span-6"><ServiceBreadcrumb current={content.hero.eyebrow} />
        <h1 ref={titleRef} id="affiliate-hero-title" className="hero-display-title mt-7 max-w-[11ch] text-[clamp(2.55rem,5.4vw,5rem)] leading-[.99] tracking-[-.055em] max-[639px]:text-[clamp(2.35rem,11vw,3.7rem)]">
          <span data-title-line className="block">Grow Your Sales</span><span data-title-line className="block text-white">Through the Power</span><span data-title-line className="block bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#B6F23D] bg-clip-text text-transparent">of Partnerships.</span>
        </h1>
        <p className="mt-7 max-w-[39em] text-base leading-[1.75] text-white/70 sm:text-lg">{content.hero.text}</p>
      </div>
      <div ref={visualRef} className="relative mx-auto grid aspect-square w-full max-w-[440px] place-items-center lg:col-span-6 lg:max-w-[530px]">
        <div data-orbit-ring aria-hidden="true" className="absolute inset-[7%] rounded-full border border-[#22C55E]/20 [border-top-color:rgba(74,222,128,.8)]" /><div data-orbit-ring aria-hidden="true" className="absolute inset-[19%] rounded-full border border-dashed border-white/10 [border-left-color:rgba(182,242,61,.65)]" />
        <svg aria-hidden="true" viewBox="0 0 500 500" className="absolute inset-0 h-full w-full overflow-visible"><path data-network-line d="M250 250 250 72M250 250 407 145M250 250 412 344M250 250 250 430M250 250 88 345M250 250 90 145" fill="none" stroke="#22C55E" strokeOpacity=".55" strokeWidth="1.5" />{[['250','72'],['407','145'],['412','344'],['250','430'],['88','345'],['90','145']].map(([cx,cy]) => <circle key={cx+cy} cx={cx} cy={cy} r="4" fill={lime} />)}</svg>
        <div className="relative z-10 grid size-[122px] place-items-center rounded-[34px] border border-[#22C55E]/50 bg-[#11251A] shadow-[0_0_70px_rgba(34,197,94,.2)] sm:size-[144px]"><div className="grid size-[78px] place-items-center rounded-[25px] bg-[#16A34A] text-[#0B0F0D] sm:size-[88px]"><Handshake aria-hidden="true" className="size-10 sm:size-12" strokeWidth={1.7} /></div><span aria-hidden="true" className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full border-4 border-[#0B0F0D] bg-[#B6F23D] text-[#0B0F0D]"><Link2 className="size-4" /></span></div>
        {[
          { icon: UsersRound, label: 'Creators', pos: 'left-1/2 top-[4%] -translate-x-1/2' }, { icon: BookOpen, label: 'Publishers', pos: 'right-[2%] top-[22%]' }, { icon: ShoppingBag, label: 'Stores', pos: 'right-[2%] bottom-[20%]' }, { icon: BadgeIndianRupee, label: 'Partners', pos: 'left-1/2 bottom-[1%] -translate-x-1/2' }, { icon: Megaphone, label: 'Influencers', pos: 'left-[2%] bottom-[20%]' }, { icon: Network, label: 'Networks', pos: 'left-[2%] top-[22%]' },
        ].map(({ icon: Icon, label, pos }) => <div key={label} data-partner-node className={`absolute ${pos} grid size-[58px] place-items-center rounded-2xl border border-white/10 bg-[#111815] text-[#4ADE80] shadow-[0_15px_40px_rgba(0,0,0,.32)] sm:size-[68px]`}><Icon aria-label={label} className="size-6 sm:size-7" strokeWidth={1.7} /></div>)}
      </div>
    </div>
  </section>;
}

function AffiliateOverview({ content }: { content: AffiliateMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useAffiliateReveal(sectionRef, '[data-overview-reveal]', 130);
  useGSAP(() => {
    registerGsapPlugins();
    if (reducedMotion || !visualRef.current) return;
    const ring = visualRef.current.querySelector<HTMLElement>('[data-overview-ring]');
    const diamond = visualRef.current.querySelector<HTMLElement>('[data-overview-diamond]');
    const core = visualRef.current.querySelector<HTMLElement>('[data-overview-core]');
    const satellites = visualRef.current.querySelectorAll<HTMLElement>('[data-overview-float]');
    if (ring) gsap.to(ring, { rotation: 360, duration: 36, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    if (diamond) gsap.to(diamond, { rotation: 405, duration: 42, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    if (core) gsap.to(core, { scale: 1.06, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (satellites.length) gsap.to(satellites, { y: -7, duration: 1.8, stagger: { each: .22, from: 'center' }, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });
  return <section ref={sectionRef} aria-labelledby="affiliate-what-title" className="relative overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-24 lg:py-28"><div className="mx-auto grid w-[90%] max-w-[1280px] items-center gap-10 lg:grid-cols-12 lg:gap-16">
    <div data-overview-reveal className="lg:col-span-7"><Eyebrow tone="ink">Affiliate Marketing</Eyebrow><h2 id="affiliate-what-title" className="mt-5 max-w-[18ch] font-display text-[clamp(2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.045em]">{content.what.title}</h2><p className="mt-6 max-w-[44em] text-base leading-[1.8] text-[#526058] sm:text-lg">{content.what.text}</p></div>
    <div ref={visualRef} data-overview-reveal aria-hidden="true" className="relative mx-auto grid aspect-square w-full max-w-[360px] place-items-center lg:col-span-5"><div data-overview-ring className="absolute inset-[7%] rounded-[42%] border border-[#16A34A]/20 [border-top-color:rgba(22,163,74,.75)]" /><div data-overview-diamond className="absolute inset-[20%] rotate-45 rounded-[28px] border border-[#16A34A]/30 bg-[#16A34A]/[.06]" /><div data-overview-core className="relative grid size-24 place-items-center rounded-[28px] bg-[#0B0F0D] text-[#B6F23D] shadow-[0_18px_55px_rgba(11,15,13,.18)]"><Handshake className="size-11" strokeWidth={1.5} /></div><span data-overview-float className="absolute left-[8%] top-[24%] grid size-14 place-items-center rounded-2xl border border-[#0B0F0D]/10 bg-white text-[#16A34A] shadow-lg"><Link2 className="size-6" /></span><span data-overview-float className="absolute right-[7%] top-[23%] grid size-14 place-items-center rounded-2xl border border-[#0B0F0D]/10 bg-white text-[#16A34A] shadow-lg"><UsersRound className="size-6" /></span><span data-overview-float className="absolute bottom-[14%] left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-2xl border border-[#0B0F0D]/10 bg-white text-[#16A34A] shadow-lg"><BadgePercent className="size-6" /></span></div>
  </div></section>;
}

const benefitIcons = [UsersRound, Megaphone, Handshake, IndianRupee, BadgePercent, ArrowUpRight];
function AffiliateBenefits({ content }: { content: AffiliateMarketingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  useAffiliateReveal(sectionRef, '[data-benefit]', 90);
  return <section ref={sectionRef} aria-labelledby="affiliate-benefits-title" className="relative overflow-hidden bg-[#0B0F0D] py-20 text-white sm:py-24 lg:py-28"><div aria-hidden="true" className="pointer-events-none absolute -left-36 top-12 size-[430px] rounded-full bg-[#16A34A]/10 blur-[130px]" /><div className="relative mx-auto w-[90%] max-w-[1280px]"><h2 id="affiliate-benefits-title" className="font-display text-[clamp(2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.045em]">{content.benefits.title}</h2>
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{content.benefits.points.map((point, index) => { const Icon = benefitIcons[index]; return <li key={point} data-benefit className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/[.09] bg-[#111815] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#22C55E]/50 hover:shadow-[0_18px_45px_rgba(0,0,0,.3)] sm:min-h-[190px] sm:p-6"><span aria-hidden="true" className="absolute right-4 top-2 font-display text-[78px] font-black leading-none text-white/[.035]">0{index+1}</span><div className="grid size-12 place-items-center rounded-2xl bg-[#16A34A] text-[#0B0F0D] transition-transform duration-300 group-hover:rotate-[-7deg] group-hover:scale-105"><Icon aria-hidden="true" className="size-6" strokeWidth={1.8} /></div><div className="mt-8 flex items-end justify-between gap-4"><h3 className="max-w-[18ch] text-lg font-bold leading-snug sm:text-xl">{point}</h3><span aria-hidden="true" className="mb-1 size-2 shrink-0 rounded-full bg-[#B6F23D] shadow-[0_0_16px_rgba(182,242,61,.6)]" /></div></li>; })}</ul>
  </div></section>;
}

const serviceIcons = [Network, UsersRound, HeartHandshake, Link2, BadgeIndianRupee, Megaphone, Check, BadgePercent, IndianRupee];
function AffiliateServices({
  content,
  onChangeView,
}: {
  content: AffiliateMarketingContent;
  onChangeView: (view: AffiliateServicesView) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useAffiliateReveal(sectionRef, '[data-service-row]', 65);
  return <section ref={sectionRef} aria-labelledby="affiliate-services-title" className="relative overflow-hidden bg-[#F6FAF7] py-20 text-[#0B0F0D] sm:py-24 lg:py-28"><div className="mx-auto w-[90%] max-w-[1280px]"><div className="grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-12"><h2 id="affiliate-services-title" className="max-w-[16ch] font-display text-[clamp(2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.045em] lg:col-span-5">{content.services.title}</h2><div className="flex flex-col items-start gap-5 lg:col-span-7 lg:items-end"><AffiliateServicesToggle value="v1" onChange={onChangeView} /><p className="max-w-[48em] text-base leading-[1.8] text-[#526058] sm:text-lg lg:text-right">{content.services.text}</p></div></div>
    <div className="relative mt-10 overflow-hidden rounded-[28px] border border-white/[.08] bg-[#0B0F0D] p-4 text-white shadow-[0_28px_80px_rgba(11,15,13,.16)] sm:p-7 lg:p-9"><div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/80 to-transparent" /><div className="mb-4 hidden grid-cols-[56px_1fr_150px] items-center gap-4 border-b border-white/[.1] px-4 pb-3 font-mono text-[10px] uppercase tracking-[.2em] text-white/35 sm:grid"><span>Index</span><span>Program capability</span><span className="text-right">Coverage</span></div>
      <ul className="divide-y divide-white/[.08]">{content.services.items.map((item, index) => { const Icon = serviceIcons[index]; return <li key={item} data-service-row className="group grid min-h-[66px] grid-cols-[40px_1fr_auto] items-center gap-3 py-3 transition-colors hover:bg-white/[.025] sm:grid-cols-[56px_1fr_150px] sm:gap-4 sm:px-4"><span aria-hidden="true" className="font-mono text-xs tracking-[.14em] text-[#4ADE80]/60">{String(index+1).padStart(2,'0')}</span><span className="flex min-w-0 items-center gap-3 text-[15px] font-semibold leading-snug sm:text-[17px]"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#22C55E]/20 bg-[#16A34A]/10 text-[#4ADE80] transition-colors group-hover:bg-[#16A34A] group-hover:text-[#0B0F0D]"><Icon aria-hidden="true" className="size-[17px]" /></span>{item}</span><span aria-hidden="true" className="hidden h-1 w-[92px] justify-self-end rounded-full bg-white/[.1] sm:flex"><span className="h-full rounded-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] transition-all duration-500 group-hover:w-full" style={{ width: `${38 + (index % 5) * 12}%` }} /></span></li>; })}</ul>
    </div>
  </div></section>;
}

const channelIcons = [HeartHandshake, BookOpen, BadgePercent, Megaphone, BadgeIndianRupee];
function AffiliateChannels({ content }: { content: AffiliateMarketingContent }) {
  const [active, setActive] = useState(0);
  const iconRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const Icon = channelIcons[active];
  useGSAP(() => {
    registerGsapPlugins();
    if (!iconRef.current || reducedMotion) return;
    gsap.fromTo(iconRef.current, { scale: .72, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, rotate: 0, duration: .48, ease: 'back.out(1.8)' });
  }, { dependencies: [active, reducedMotion], revertOnUpdate: true });
  return <section aria-labelledby="affiliate-channels-title" className="relative overflow-hidden bg-[#0B0F0D] py-20 text-white sm:py-24 lg:py-28"><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent" /><div className="mx-auto w-[90%] max-w-[1280px]"><h2 id="affiliate-channels-title" className="max-w-[22ch] font-display text-[clamp(2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-.045em]">{content.channels.title}</h2><p className="mt-5 max-w-[48em] text-base leading-[1.8] text-white/70 sm:text-lg">{content.channels.text}</p>
    <div className="mt-10 grid gap-5 lg:grid-cols-[.85fr_1.15fr]"><div role="tablist" aria-label={content.channels.title} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{content.channels.items.map((item,index) => { const ChannelIcon = channelIcons[index]; const selected = index === active; return <button key={item} id={`affiliate-channel-tab-${index}`} type="button" role="tab" aria-selected={selected} aria-controls="affiliate-channel-panel" onClick={() => setActive(index)} onKeyDown={(event) => { if (event.key === 'ArrowDown' || event.key === 'ArrowRight') { event.preventDefault(); const next=(index+1)%content.channels.items.length; setActive(next); document.getElementById(`affiliate-channel-tab-${next}`)?.focus(); } if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') { event.preventDefault(); const next=(index-1+content.channels.items.length)%content.channels.items.length; setActive(next); document.getElementById(`affiliate-channel-tab-${next}`)?.focus(); } }} className={`group flex min-h-[66px] items-center gap-4 rounded-2xl border px-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4ADE80] sm:px-5 ${selected ? 'border-[#22C55E]/55 bg-[#16A34A]/15' : 'border-white/[.08] bg-[#111815] hover:border-white/20'}`}><span className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors ${selected ? 'bg-[#16A34A] text-[#0B0F0D]' : 'bg-white/[.06] text-[#4ADE80]'}`}><ChannelIcon aria-hidden="true" className="size-5" /></span><span className={`min-w-0 flex-1 text-[15px] font-semibold leading-snug sm:text-base ${selected ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{item}</span><span aria-hidden="true" className={`size-2 rounded-full ${selected ? 'bg-[#B6F23D] shadow-[0_0_12px_rgba(182,242,61,.65)]' : 'bg-white/15'}`} /></button>; })}</div>
      <div id="affiliate-channel-panel" role="tabpanel" aria-labelledby={`affiliate-channel-tab-${active}`} className="relative grid min-h-[300px] overflow-hidden rounded-[28px] border border-white/[.09] bg-[#111815] p-7 sm:min-h-[340px] sm:p-10"><div aria-hidden="true" className="absolute inset-0 opacity-[.13] [background-image:radial-gradient(rgba(74,222,128,.8)_1px,transparent_1px)] [background-size:22px_22px]" /><div aria-hidden="true" className="relative m-auto grid size-40 place-items-center rounded-full border border-dashed border-[#22C55E]/40 sm:size-52"><span className="absolute inset-[18%] rounded-full border border-white/10" /><span ref={iconRef} className="relative grid size-20 place-items-center rounded-[26px] bg-[#16A34A] text-[#0B0F0D] shadow-[0_0_55px_rgba(34,197,94,.2)] sm:size-24"><Icon aria-hidden="true" className="size-10 sm:size-12" strokeWidth={1.5} /></span><span className="absolute left-1/2 top-0 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-[#0B0F0D]"><span className="size-2 rounded-full bg-[#B6F23D]" /></span><span className="absolute bottom-0 left-1/2 grid size-10 -translate-x-1/2 translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-[#0B0F0D]"><span className="size-2 rounded-full bg-[#B6F23D]" /></span><span className="absolute left-0 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-[#0B0F0D]"><span className="size-2 rounded-full bg-[#B6F23D]" /></span><span className="absolute right-0 top-1/2 grid size-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-[#0B0F0D]"><span className="size-2 rounded-full bg-[#B6F23D]" /></span></div><div aria-hidden="true" className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-white/35 sm:bottom-7 sm:left-8"><span className="size-1.5 rounded-full bg-[#22C55E]" />{String(active+1).padStart(2,'0')} / {String(content.channels.items.length).padStart(2,'0')}</div></div>
    </div>
  </div></section>;
}

export function AffiliateMarketingPage({
  content,
  onSelectIndustry,
  initialServicesView = 'v1',
}: {
  content: AffiliateMarketingContent;
  onSelectIndustry: (name: string) => void;
  initialServicesView?: AffiliateServicesView;
}) {
  const [servicesView, setServicesView] = useState<AffiliateServicesView>(initialServicesView);

  useEffect(() => {
    setServicesView(initialServicesView);
  }, [initialServicesView]);

  useEffect(() => {
    const syncView = () =>
      setServicesView(new URLSearchParams(window.location.search).get('services') === 'v2' ? 'v2' : 'v1');
    window.addEventListener('popstate', syncView);
    return () => window.removeEventListener('popstate', syncView);
  }, []);

  const changeServicesView = (view: AffiliateServicesView) => {
    setServicesView(view);
    const url = new URL(window.location.href);
    if (view === 'v2') url.searchParams.set('services', 'v2');
    else url.searchParams.delete('services');
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [servicesView]);

  const sectionRegistry = {
    hero: () => <AffiliateHero key="hero" content={content} />,
    what: () => <AffiliateOverview key="what" content={content} />,
    benefits: () => <AffiliateBenefits key="benefits" content={content} />,
    services: () =>
      servicesView === 'v2' ? (
        <AffiliateServicesV2 key="services-v2" content={content} onChangeView={changeServicesView} />
      ) : (
        <AffiliateServices key="services-v1" content={content} onChangeView={changeServicesView} />
      ),
    channels: () => <AffiliateChannels key="channels" content={content} />,
    whyLeadsGrow: () => <AboutStory key="whyLeadsGrow" />,
    industries: () => <Industries key="industries" onSelectIndustry={onSelectIndustry} />,
  };
  return <>{content.sections.map((section) => sectionRegistry[section]())}</>;
}
