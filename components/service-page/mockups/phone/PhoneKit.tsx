import type { ReactNode } from 'react';
import { Activity, Bell, Bolt, Check, Compass, Heart, Layers3, LockKeyhole, Plug, SlidersHorizontal } from 'lucide-react';

export function PhoneFrame({ children, variant = 'round', className = '', decorative = true }: { children: ReactNode; variant?: 'round' | 'punch'; className?: string; decorative?: boolean }) {
  return <div aria-hidden={decorative ? true : undefined} className={`relative rounded-[38px] border-[5px] border-[#35423B] bg-[#080B09] p-[5px] shadow-[0_28px_70px_rgba(0,0,0,.42)] ${className}`}>
    <span className="absolute -right-[7px] top-[24%] z-20 h-12 w-[3px] rounded-r-full bg-[#526058]" />
    <span className="absolute -left-[7px] top-[28%] z-20 h-8 w-[3px] rounded-l-full bg-[#526058]" />
    <div className="relative h-full overflow-hidden rounded-[30px] bg-[#F6FAF7]">
      {variant === 'punch' && <span className="absolute left-1/2 top-2 z-20 size-2.5 -translate-x-1/2 rounded-full bg-[#080B09] ring-2 ring-[#26322B]" />}
      {variant === 'round' && <span className="absolute left-1/2 top-2 z-20 h-3 w-12 -translate-x-1/2 rounded-full bg-[#080B09]" />}
      {children}
    </div>
  </div>;
}

export function AppIcon({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-[0_6px_16px_rgba(22,163,74,.2)] ${className}`}>
    <span className="relative size-[42%] rounded-[5px] border-2 border-[#0B0F0D]/80"><i className="absolute -right-1 -top-1 size-2 rounded-full bg-[#B6F23D]" /></span>
  </span>;
}

export function AppScreen({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return <div aria-hidden="true" className={`relative flex h-full flex-col p-4 pt-9 ${dark ? 'bg-[#101A14]' : 'bg-[#F6FAF7]'} ${className}`}>
    <div className="mb-4 flex items-center justify-between"><span className={`h-2 w-12 rounded-full ${dark ? 'bg-white/70' : 'bg-[#0B0F0D]/75'}`} /><span className={`flex gap-1 ${dark ? 'text-[#22C55E]' : 'text-[#16A34A]'}`}><i className="h-2 w-3 rounded-sm bg-current"/><i className="h-2 w-2 rounded-full bg-current"/></span></div>
    <div className="mb-3 h-2 w-[43%] rounded-full bg-[#16A34A]/60" />
    <div className="relative mb-4 h-[32%] overflow-hidden rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#0F5132] p-3">
      <span className="block h-2 w-1/2 rounded-full bg-white/85"/><span className="mt-2 block h-1.5 w-2/3 rounded-full bg-white/40"/><span className="absolute -bottom-4 right-0 size-20 rounded-full bg-[#B6F23D]/35" />
    </div>
    <div className="mb-2 flex items-center justify-between"><span className={`h-2 w-1/3 rounded-full ${dark ? 'bg-white/50' : 'bg-[#0B0F0D]/30'}`} /><span className="size-2 rounded-full bg-[#16A34A]"/></div>
    {[0, 1, 2].map((item) => <div key={item} className={`mb-2 flex h-10 items-center gap-2 rounded-xl px-2 ${dark ? 'bg-white/[0.06]' : 'bg-white shadow-sm'}`}><span className={`size-6 rounded-lg ${item === 1 ? 'bg-[#B6F23D]/60' : 'bg-[#16A34A]/15'}`} /><span className="flex-1 space-y-1.5"><i className={`block h-1.5 w-2/3 rounded-full ${dark ? 'bg-white/45' : 'bg-[#0B0F0D]/25'}`} /><i className={`block h-1 w-1/2 rounded-full ${dark ? 'bg-white/20' : 'bg-[#0B0F0D]/10'}`} /></span></div>)}
    <div className="mt-auto flex h-8 items-center justify-around border-t border-[#0B0F0D]/10 pt-2">{[0, 1, 2, 3].map((item) => <span key={item} className={`size-2.5 rounded-full ${item === 0 ? 'bg-[#16A34A]' : 'bg-[#0B0F0D]/15'}`} />)}</div>
  </div>;
}

export function Notification({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/[.88] p-3.5 shadow-[0_12px_30px_rgba(11,15,13,.1)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:p-4">
    <AppIcon className="size-9 rounded-xl" />
    <div className="min-w-0 flex-1"><div className="mb-1 flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#16A34A]"/><span className="text-[14px] font-semibold leading-snug text-[#0B0F0D] sm:text-base">{children}</span></div><span aria-hidden="true" className="block h-1 w-[70%] rounded-full bg-[#0B0F0D]/[.12]"/><span aria-hidden="true" className="mt-1 block h-1 w-[46%] rounded-full bg-[#0B0F0D]/[.07]"/></div>
    <span aria-hidden="true" className={`size-1.5 rounded-full ${index === 0 ? 'bg-[#16A34A]' : 'bg-[#16A34A]/30'}`} />
  </div>;
}

export function StoreGlyph({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`relative grid size-12 place-items-center rounded-2xl border border-white/25 bg-white/10 shadow-lg backdrop-blur ${className}`}><span className="absolute top-2 h-1.5 w-5 rounded-sm bg-[#B6F23D]"/><span className="mt-1 size-5 rounded-[6px] border-2 border-white/90"><i className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-[#22C55E]"/></span></span>;
}

export { Activity as Pulse, Bell, Bolt, Compass, Heart, Layers3 as Layers, LockKeyhole as Lock, Plug, SlidersHorizontal as Toggle, Check };
