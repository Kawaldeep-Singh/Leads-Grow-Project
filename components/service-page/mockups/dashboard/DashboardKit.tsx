import type { ReactNode } from 'react';
import { ArrowUpRight, BriefcaseBusiness, Mail, MessageCircle, MousePointer2, Search, Share2, Smartphone, Video } from 'lucide-react';

const lime = '#B6F23D';
const green = '#22C55E';

export function DashWindow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div aria-hidden="true" className={`relative rounded-[24px] border border-white/10 bg-[#101714] p-3 shadow-[0_30px_100px_rgba(0,0,0,.5)] sm:rounded-[30px] sm:p-4 ${className}`}>
    <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/[.06] bg-[#0B0F0D] px-3 py-2">
      <span className="flex gap-1.5"><i className="size-2 rounded-full bg-[#22C55E]/70"/><i className="size-2 rounded-full bg-white/20"/><i className="size-2 rounded-full bg-white/20"/></span>
      <span className="mx-auto h-2 w-[34%] rounded-full bg-white/[.08]"/>
      <span className="size-2 rounded-full bg-[#22C55E]/50"/>
    </div>{children}
  </div>;
}

export function KpiTile({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" data-pm-kpi="" className={`rounded-xl border border-white/[.07] bg-white/[.035] p-3 ${className}`}>
    <div className="h-1.5 w-[45%] rounded-full bg-white/20"/><div className="mt-3 flex h-7 items-end gap-1.5">
      {[34, 52, 42, 70, 56, 92, 78].map((height, index) => <i key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#16A34A] to-[#B6F23D]/90" style={{ height: `${height}%` }}/>) }
    </div>
  </div>;
}

export function LineChart({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 460 170" preserveAspectRatio="none" className={className}>
    <defs><linearGradient id="pm-chart-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={green} stopOpacity=".34"/><stop offset="1" stopColor={green} stopOpacity="0"/></linearGradient></defs>
    {[38, 78, 118, 158].map((y) => <path key={y} d={`M0 ${y}H460`} stroke="white" strokeOpacity=".075" strokeDasharray="3 7"/>)}
    <path className="pm-chart-area" d="M0 137 C38 130 52 101 91 112 S144 126 177 91 S235 107 265 69 S322 92 351 53 S409 57 460 18 V170 H0Z" fill="url(#pm-chart-area)"/>
    <path className="pm-chart-line" d="M0 137 C38 130 52 101 91 112 S144 126 177 91 S235 107 265 69 S322 92 351 53 S409 57 460 18" fill="none" stroke={lime} strokeWidth="3" strokeLinecap="round"/>
    <circle className="pm-chart-rider" cx="0" cy="137" r="5" fill={lime}/>
  </svg>;
}

export function Gauge({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 140 86" className={className}>
    <path d="M14 72a56 56 0 0 1 112 0" fill="none" stroke="white" strokeOpacity=".12" strokeWidth="12" strokeLinecap="round"/>
    <path className="pm-gauge-fill" d="M14 72a56 56 0 0 1 92-42" fill="none" stroke={green} strokeWidth="12" strokeLinecap="round"/>
    <path className="pm-gauge-needle" d="M70 68 99 36" stroke={lime} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="70" cy="68" r="6" fill={lime}/>
  </svg>;
}

export function Donut({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeOpacity=".12" strokeWidth="12"/>
    <circle className="pm-donut-segment" cx="50" cy="50" r="34" fill="none" stroke={green} strokeWidth="12" strokeDasharray="88 214" strokeDashoffset="-18" transform="rotate(-90 50 50)"/>
    <circle className="pm-donut-segment" cx="50" cy="50" r="34" fill="none" stroke={lime} strokeWidth="12" strokeDasharray="58 214" strokeDashoffset="-115" transform="rotate(-90 50 50)"/>
    <circle cx="50" cy="50" r="15" fill="#111815"/>
  </svg>;
}

export function Target({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="36" fill="#111815" stroke="white" strokeOpacity=".2" strokeWidth="2"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke={green} strokeOpacity=".65" strokeWidth="2"/>
    <circle cx="50" cy="50" r="13" fill="none" stroke={lime} strokeWidth="2"/>
    <circle className="pm-target-hit" cx="50" cy="50" r="4" fill={lime}/>
    <path className="pm-dart" d="m12 17 33 29m-8-28 8 28-28-7" fill="none" stroke={lime} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function FunnelMini({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 140 68" className={className}>
    <path d="M15 10h110L86 38v18l-32 8V38L15 10Z" fill="none" stroke="white" strokeOpacity=".32" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M28 17h84L83 39v13l-13 4V39L28 17Z" fill={green} fillOpacity=".35"/>
    {[28, 47, 68, 92, 110].map((x, index) => <circle key={x} cx={x} cy={index % 2 ? 27 : 22} r="3" fill={index > 2 ? lime : 'white'} opacity={index > 2 ? 1 : .55}/>) }
  </svg>;
}

export function Slider({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`relative h-1 rounded-full bg-white/10 ${className}`}><span className="absolute inset-y-0 left-0 w-[68%] rounded-full bg-gradient-to-r from-[#16A34A] to-[#B6F23D]"/><span className="absolute left-[68%] top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#B6F23D] bg-[#0B0F0D] shadow-[0_0_16px_rgba(34,197,94,.7)]"/></div>;
}

export function PlatformVisual({ index, className = '' }: { index: number; className?: string }) {
  const Icon = [Search, Share2, Video, BriefcaseBusiness, Mail, MessageCircle, Smartphone, ArrowUpRight][index] ?? Search;
  return <div aria-hidden="true" className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,197,94,.28),transparent_62%)]"/>
    <div className={`relative grid w-[74%] place-items-center rounded-2xl border border-white/20 bg-[#0B0F0D]/45 p-4 shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover/platform:scale-105 ${index % 2 === 0 ? 'aspect-[1.5]' : 'aspect-[1.15]'}`}>
      {index === 0 && <div className="w-full"><div className="flex items-center gap-2 rounded-full border border-white/25 px-3 py-2"><Icon className="size-4 text-white/70"/><span className="h-1.5 flex-1 rounded-full bg-white/20"/></div><div className="mt-3 rounded-lg border border-[#22C55E]/45 bg-[#22C55E]/15 p-2"><span className="block h-1.5 w-[78%] rounded-full bg-[#B6F23D]/80"/><span className="mt-1.5 block h-1 w-[50%] rounded-full bg-white/35"/></div></div>}
      {index === 1 && <div className="grid w-full grid-cols-[1.2fr_.8fr] gap-2"><div className="rounded-lg border border-white/20 p-2"><span className="block size-5 rounded-full bg-[#22C55E]/80"/><span className="mt-2 block h-1 w-full rounded-full bg-white/30"/><span className="mt-1 block h-1 w-2/3 rounded-full bg-white/20"/></div><div className="h-full rounded-lg border border-[#B6F23D]/40 bg-[#B6F23D]/15"/></div>}
      {index === 2 && <div className="relative flex w-full items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10"><Icon className="size-5 text-white"/></span><div className="flex-1"><span className="block h-2 w-full rounded-full bg-white/25"/><span className="mt-2 block h-1.5 w-2/3 rounded-full bg-[#22C55E]"/></div><i className="absolute bottom-0 left-0 h-1 w-[72%] rounded-full bg-[#B6F23D]"/></div>}
      {index === 3 && <div className="flex w-full items-center gap-3"><Icon className="size-7 text-[#B6F23D]"/><div className="flex-1 space-y-2"><span className="block h-2 w-[90%] rounded-full bg-white/25"/><span className="block h-1.5 w-[65%] rounded-full bg-white/15"/><span className="block h-1.5 w-[75%] rounded-full bg-[#22C55E]/70"/></div><div className="flex size-8 items-end gap-1"><i className="h-1/3 flex-1 rounded-t bg-[#16A34A]"/><i className="h-2/3 flex-1 rounded-t bg-[#22C55E]"/><i className="h-full flex-1 rounded-t bg-[#B6F23D]"/></div></div>}
      {index === 4 && <div className="w-full"><div className="flex items-center gap-2"><Icon className="size-5 text-[#B6F23D]"/><span className="h-2 flex-1 rounded-full bg-white/25"/></div><div className="mt-3 space-y-1.5 rounded-lg bg-white/[.06] p-2"><span className="block h-1.5 w-full rounded-full bg-white/25"/><span className="block h-1.5 w-[82%] rounded-full bg-white/15"/><span className="block h-1.5 w-[60%] rounded-full bg-[#22C55E]/70"/></div></div>}
      {index === 5 && <div className="w-full space-y-2"><span className="ml-auto block h-5 w-[68%] rounded-xl rounded-br-sm bg-[#16A34A]/80"/><span className="block h-5 w-[72%] rounded-xl rounded-bl-sm bg-white/15"/><span className="ml-auto block h-5 w-[54%] rounded-xl rounded-br-sm bg-[#22C55E]/60"/></div>}
      {index === 6 && <div className="relative h-20 w-12 rounded-xl border-2 border-white/30 bg-[#0B0F0D] p-1.5"><div className="h-full rounded-md bg-gradient-to-b from-[#16A34A]/65 to-[#B6F23D]/20"><div className="mx-auto mt-3 h-1 w-4 rounded bg-white/60"/><div className="mx-1 mt-3 h-5 rounded border border-white/30"/></div></div>}
      {index === 7 && <div className="relative flex items-center"><span className="absolute -left-4 size-4 rounded-full border-2 border-[#B6F23D] bg-[#0B0F0D]"/><span className="absolute -right-4 size-4 rounded-full border-2 border-[#22C55E] bg-[#0B0F0D]"/><div className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/5"><Icon className="size-5 text-[#B6F23D]"/></div><span className="absolute -left-12 h-px w-8 bg-[#22C55E]/70"/><span className="absolute -right-12 h-px w-8 bg-[#22C55E]/70"/></div>}
    </div>
  </div>;
}
