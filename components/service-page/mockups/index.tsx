import type { ReactNode } from 'react';

type MockupProps = { className?: string; children?: ReactNode };

export function BrowserFrame({ className = '', children }: MockupProps) {
  return (
    <div aria-hidden="true" className={`overflow-hidden rounded-xl border border-white/15 bg-[#0B0F0D] shadow-2xl ${className}`}>
      <div className="flex h-6 items-center gap-1.5 border-b border-white/10 bg-[#18211C] px-2.5">
        <span className="size-1.5 rounded-full bg-[#22C55E]/70" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/15" />
        <span className="ml-2 h-2.5 flex-1 rounded-full bg-white/[0.06]" />
      </div>
      <div className="relative h-[calc(100%-1.5rem)]">{children}</div>
    </div>
  );
}

export function LaptopFrame({ className = '', children }: MockupProps) {
  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <div className="h-[88%] overflow-hidden rounded-t-[1.2rem] border-[5px] border-[#27342C] bg-[#0B0F0D] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] sm:rounded-t-[1.5rem] sm:border-[7px] sm:p-2">
        <div className="h-full overflow-hidden rounded-lg">{children}</div>
      </div>
      <div className="relative mx-auto h-[12%] w-[108%] -translate-x-[4%] rounded-b-[1rem] bg-gradient-to-b from-[#A8B1AA] via-[#59635C] to-[#242C27] shadow-lg">
        <div className="mx-auto h-[22%] w-[24%] rounded-b-md bg-[#29312C]" />
      </div>
    </div>
  );
}

export function PhoneFrame({ className = '', children }: MockupProps) {
  return (
    <div aria-hidden="true" className={`rounded-[1.5rem] border-[4px] border-[#526058] bg-[#080B09] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,.55)] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[1.1rem] bg-[#F6FAF7]">
        <div className="absolute left-1/2 top-1 z-10 h-1.5 w-9 -translate-x-1/2 rounded-full bg-[#0B0F0D]/80" />
        {children}
      </div>
    </div>
  );
}

export function UiSkeleton({ live = false, compact = false, className = '' }: MockupProps & { live?: boolean; compact?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex h-full flex-col gap-2.5 bg-[#F6FAF7] p-3 ${compact ? 'gap-1.5 p-2' : ''} ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`h-2.5 w-[22%] rounded-full ${live ? 'bg-[#16A34A]' : 'bg-[#0B0F0D]/15'}`} />
        <div className="flex gap-1.5"><i className="h-1.5 w-5 rounded-full bg-[#0B0F0D]/10" /><i className="h-1.5 w-5 rounded-full bg-[#0B0F0D]/10" /><i className="h-1.5 w-5 rounded-full bg-[#0B0F0D]/10" /></div>
        <span className={`h-4 w-[14%] rounded-full ${live ? 'bg-[#16A34A]' : 'bg-[#0B0F0D]/10'}`} />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_.85fr] gap-2 rounded-lg bg-white p-2 shadow-sm">
        <div className="flex flex-col justify-center gap-2">
          <i className={`h-2.5 w-[82%] rounded-full ${live ? 'bg-[#0B0F0D]/80' : 'bg-[#0B0F0D]/15'}`} />
          <i className={`h-2 w-[68%] rounded-full ${live ? 'bg-[#0B0F0D]/45' : 'bg-[#0B0F0D]/10'}`} />
          <i className={`h-2 w-[54%] rounded-full ${live ? 'bg-[#0B0F0D]/30' : 'bg-[#0B0F0D]/10'}`} />
          <i className={`mt-1 h-4 w-[36%] rounded-full ${live ? 'bg-[#22C55E]' : 'bg-[#0B0F0D]/12'}`} />
        </div>
        <div className={`relative overflow-hidden rounded-md ${live ? 'bg-gradient-to-br from-[#16A34A]/35 via-[#22C55E]/25 to-[#B6F23D]/45' : 'border border-dashed border-[#0B0F0D]/15 bg-[#0B0F0D]/[0.025]'}`}>
          {live && <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" fill="none"><circle cx="75" cy="18" r="8" fill="#B6F23D" /><path d="M0 46Q25 28 48 42T100 30V60H0Z" fill="#16A34A" opacity=".75" /><path d="M0 51Q28 38 53 49T100 39V60H0Z" fill="#0B0F0D" opacity=".3" /></svg>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => <div key={item} className={`h-3 rounded ${live ? 'bg-[#16A34A]/15' : 'border border-dashed border-[#0B0F0D]/10 bg-[#0B0F0D]/[0.025]'}`} />)}
      </div>
    </div>
  );
}

export function CodePanel({ className = '', cursorBlink = false }: MockupProps & { cursorBlink?: boolean }) {
  const lines = [
    ['w-[78%]', 'bg-[#22C55E]/80'], ['w-[58%]', 'bg-[#B6F23D]/75'], ['w-[88%]', 'bg-white/35'],
    ['w-[46%]', 'bg-[#22C55E]/55'], ['w-[70%]', 'bg-[#B6F23D]/60'], ['w-[53%]', 'bg-white/25'],
    ['w-[82%]', 'bg-[#22C55E]/65'], ['w-[38%]', 'bg-[#B6F23D]/70'],
  ];
  return (
    <div aria-hidden="true" className={`rounded-xl border border-white/10 bg-[#101713] p-3 shadow-xl ${className}`}>
      <div className="mb-3 flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#22C55E]/70" /><i className="size-1.5 rounded-full bg-white/20" /><i className="size-1.5 rounded-full bg-white/15" /><i className="ml-auto h-1.5 w-6 rounded-full bg-white/10" /></div>
      <div className="space-y-2">
        {lines.map(([width, color], index) => <div key={index} className={`h-1.5 rounded-full ${width} ${color}`} style={{ marginLeft: `${(index % 3) * 8}%` }} />)}
        <i className={`ml-[8%] block h-2 w-1 rounded-full bg-[#B6F23D] ${cursorBlink ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
}

export function ShieldBadge({ className = '' }: MockupProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 72" className={className} fill="none">
      <path d="M32 4 55 13v19c0 16-9.7 27.7-23 36C18.7 59.7 9 48 9 32V13L32 4Z" fill="#16A34A" />
      <path d="m21 35 7 7 15-16" stroke="#0B0F0D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SpeedGauge({ className = '' }: MockupProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 64" className={className} fill="none">
      <path d="M12 52a38 38 0 1 1 76 0" stroke="#526058" strokeWidth="8" strokeLinecap="round" />
      <path d="M50 14a38 38 0 0 1 36 26" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
      <path d="m50 48 22-22" stroke="#B6F23D" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="48" r="6" fill="#0B0F0D" stroke="#B6F23D" strokeWidth="2" />
    </svg>
  );
}
