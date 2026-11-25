import type { ReactNode } from 'react';

const crop = 'absolute size-3 border-[#0B0F0D]/35';

export function Artboard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative rounded-[18px] border border-[#0B0F0D]/10 bg-white p-5 shadow-[0_18px_40px_rgba(11,15,13,.14)] ${className}`}>
    <i className={`${crop} left-2 top-2 border-l border-t`} /><i className={`${crop} right-2 top-2 border-r border-t`} />
    <i className={`${crop} bottom-2 left-2 border-b border-l`} /><i className={`${crop} bottom-2 right-2 border-b border-r`} />
    {children}
  </div>;
}

export function PenHandles({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 180 72" className={className} fill="none">
    <path d="M12 55C52 8 114 9 166 20" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 24 29 59M120 16l15 30" stroke="#0B0F0D" strokeOpacity=".35" strokeDasharray="3 4" />
    <circle cx="48" cy="24" r="5" fill="#B6F23D" stroke="#0B0F0D" strokeWidth="2" /><circle cx="120" cy="16" r="5" fill="#22C55E" stroke="#0B0F0D" strokeWidth="2" />
    <rect x="8" y="51" width="8" height="8" fill="white" stroke="#0B0F0D" strokeWidth="2" /><rect x="162" y="16" width="8" height="8" fill="white" stroke="#0B0F0D" strokeWidth="2" />
  </svg>;
}

export function SwatchRow({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`flex items-center gap-2 ${className}`}><i className="size-5 rounded-full bg-[#16A34A]"/><i className="size-5 rounded-full bg-[#22C55E]"/><i className="size-5 rounded-full bg-[#B6F23D]"/><i className="size-5 rounded-full bg-[#0B0F0D]"/><i className="size-5 rounded-full border border-black/10 bg-white"/></div>;
}

export function StickyNote({ className = '', tone = 'lime' }: { className?: string; tone?: 'lime' | 'white' }) {
  return <div aria-hidden="true" className={`relative aspect-square w-24 rotate-[-5deg] rounded-[8px] p-4 shadow-[0_12px_24px_rgba(0,0,0,.16)] ${tone === 'lime' ? 'bg-[#B6F23D]' : 'bg-white'} ${className}`}>
    <i className="absolute right-0 top-0 size-5 bg-gradient-to-bl from-black/10 to-transparent" />
    <i className="mb-2 block h-2 w-3/4 rounded-full bg-[#0B0F0D]/35"/><i className="mb-1.5 block h-1.5 w-full rounded-full bg-[#0B0F0D]/15"/><i className="mb-1.5 block h-1.5 w-4/5 rounded-full bg-[#0B0F0D]/15"/><i className="block h-1.5 w-1/2 rounded-full bg-[#0B0F0D]/15"/>
  </div>;
}

export function Tape({ className = '' }: { className?: string }) { return <span aria-hidden="true" className={`absolute left-1/2 top-0 z-20 h-4 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] border-x border-white/50 bg-[#CFE8FF]/65 shadow-sm backdrop-blur-sm ${className}`} />; }

export function CursorArrow({ className = '' }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 36 46" className={className}><path d="M3 2v33l9-8 6 15 6-3-6-14 13-1L3 2Z" fill="#0B0F0D" stroke="white" strokeWidth="2" strokeLinejoin="round"/><rect x="19" y="4" width="15" height="7" rx="3.5" fill="#22C55E" /></svg>;
}

export function Ruler({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`flex h-7 items-start gap-2 border-t border-[#0B0F0D]/30 pt-1 ${className}`}>{Array.from({ length: 12 }, (_, index) => <i key={index} className={`w-px bg-[#0B0F0D]/50 ${index % 3 === 0 ? 'h-3' : 'h-1.5'}`} />)}</div>;
}

export function GridGuides({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`absolute inset-4 grid grid-cols-4 gap-2 ${className}`}>{Array.from({ length: 4 }, (_, index) => <i key={index} className="border-x border-[#16A34A]/15 bg-[#22C55E]/[.035]" />)}</div>;
}

function Mark({ className = '' }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 72 72" className={className}><path d="M12 54 35 12l25 42H12Z" fill="#16A34A"/><circle cx="36" cy="36" r="12" fill="#B6F23D"/><path d="M14 58 56 16" stroke="#0B0F0D" strokeWidth="5" strokeLinecap="round"/></svg>; }

export function ArtifactOne() { return <div className="grid h-full grid-cols-2 gap-2 p-3"><Mark className="w-full rounded-lg bg-[#F6FAF7] p-3"/><Mark className="w-full rounded-lg bg-[#F6FAF7] p-3 opacity-75"/><div className="col-span-2 flex items-center justify-between rounded-lg bg-[#F6FAF7] px-3"><i className="h-2 w-1/3 rounded-full bg-[#0B0F0D]/25"/><SwatchRow/></div></div>; }
export function ArtifactTwo() { return <div className="relative grid h-full place-items-center overflow-hidden bg-[#FFD9C2]"><div className="absolute -right-7 -top-8 size-28 rounded-full bg-[#16A34A]"/><div className="absolute bottom-2 left-2 h-20 w-20 rotate-12 rounded-[24px] bg-[#B6F23D]"/><div className="relative h-24 w-24 rotate-[-8deg] bg-white shadow-lg"><i className="absolute left-3 top-3 h-2 w-12 rounded-full bg-[#0B0F0D]"/><i className="absolute bottom-4 left-3 h-2 w-16 rounded-full bg-[#16A34A]"/></div></div>; }
export function ArtifactThree() { return <div className="grid h-full grid-cols-3 gap-1.5 p-2">{['bg-[#CFE8FF]','bg-[#B6F23D]','bg-[#FFD9C2]'].map((tone, index) => <div key={tone} className={`relative overflow-hidden rounded-lg ${tone}`}><span className={`absolute -right-2 top-2 size-10 rounded-full ${index === 1 ? 'bg-[#16A34A]' : 'bg-white'}`}/><i className="absolute bottom-4 left-2 h-2 w-4/5 rounded-full bg-[#0B0F0D]/70"/><i className="absolute bottom-1 left-2 h-1 w-1/2 rounded-full bg-[#0B0F0D]/30"/><i className="absolute right-2 top-2 size-1.5 rounded-full bg-[#16A34A]"/></div>)}</div>; }
export function ArtifactFour() { return <div className="relative flex h-full items-center gap-3 overflow-hidden bg-gradient-to-r from-[#0B0F0D] to-[#16A34A] p-4"><i className="h-3 w-2/5 rounded-full bg-white"/><i className="h-2 w-1/4 rounded-full bg-white/45"/><div className="relative ml-auto grid size-16 place-items-center rounded-full bg-[#B6F23D]"><svg viewBox="0 0 48 28" className="w-12" aria-hidden="true"><path d="M2 22 30 6v7l16-3-16 17v-7L2 22Z" fill="#0B0F0D"/></svg></div></div>; }
export function ArtifactFive() { return <div className="relative h-full bg-white p-4"><i className="mb-3 block h-3 w-3/5 rounded-full bg-[#0B0F0D]/70"/><i className="mb-2 block h-1.5 w-full rounded-full bg-[#0B0F0D]/15"/><i className="mb-2 block h-1.5 w-4/5 rounded-full bg-[#0B0F0D]/15"/><i className="mb-2 block h-1.5 w-11/12 rounded-full bg-[#0B0F0D]/15"/><PenHandles className="absolute bottom-1 right-2 h-14 w-32"/></div>; }
export function ArtifactSix() { return <div className="relative grid h-full place-items-center bg-[#F6FAF7] p-3"><div className="relative h-4/5 w-4/5 rounded-xl border-2 border-dashed border-[#16A34A] bg-white p-3"><i className="mb-2 block h-2 w-2/3 rounded-full bg-[#0B0F0D]/25"/><i className="mb-2 block h-10 rounded-lg bg-[#CFE8FF]"/><i className="block h-2 w-1/2 rounded-full bg-[#16A34A]"/><CursorArrow className="absolute -bottom-2 -right-2 h-10 w-8"/></div></div>; }
export function ArtifactSeven() { return <div className="flex h-full items-center justify-center gap-2 bg-[#CFE8FF]/60 p-3"><div className="h-[72%] w-[60%] rounded-lg border-[3px] border-[#0B0F0D] bg-white p-2"><i className="block h-2 w-1/2 rounded bg-[#16A34A]"/><i className="mt-2 block h-12 rounded bg-[#B6F23D]/70"/><i className="mt-2 block h-2 rounded bg-[#0B0F0D]/15"/></div><div className="h-[66%] w-[24%] rounded-xl border-[3px] border-[#0B0F0D] bg-white p-1.5"><i className="block h-2 rounded bg-[#16A34A]"/><i className="mt-2 block h-8 rounded bg-[#B6F23D]/70"/></div></div>; }
export function ArtifactEight() { return <div className="flex h-full items-center justify-center gap-2 bg-[#FFD9C2]/70 p-3"><div className="flex h-4/5 w-3/5 -skew-y-3 overflow-hidden rounded-md bg-white shadow-md">{[0,1,2].map((panel) => <div key={panel} className={`flex-1 border-r border-[#0B0F0D]/10 p-1.5 ${panel === 1 ? 'bg-[#16A34A]/15' : ''}`}><i className="mb-2 block h-2 rounded bg-[#16A34A]"/><i className="mb-1 block h-1 rounded bg-[#0B0F0D]/15"/><i className="block h-1 w-2/3 rounded bg-[#0B0F0D]/15"/></div>)}</div><div className="h-3/5 w-1/4 rotate-6 rounded-md bg-[#B6F23D] shadow-md"/></div>; }
export function ArtifactNine() { return <div className="relative h-full bg-[#F6FAF7] p-3"><div className="h-[75%] rounded-lg border border-[#0B0F0D]/15 bg-white p-3"><i className="block h-2 w-2/5 rounded-full bg-[#0B0F0D]/30"/><div className="mt-3 flex h-[65%] items-end gap-2 border-b border-[#0B0F0D]/15 px-2">{[35,70,52,90].map((height,index)=><i key={index} className="flex-1 rounded-t bg-[#16A34A]" style={{height:`${height}%`}}/>)}</div></div><div className="mt-2 flex gap-1">{[0,1,2,3].map((item)=><i key={item} className="h-2 flex-1 rounded bg-[#0B0F0D]/15"/>)}</div></div>; }
export function ArtifactTen() { return <div className="flex h-full items-center gap-2 bg-[#0B0F0D] p-3"><div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#B6F23D]"><i className="ml-1 border-y-[9px] border-y-transparent border-l-[14px] border-l-[#0B0F0D]"/></div><div className="flex h-10 flex-1 flex-col justify-between"><i className="h-3 w-3/4 rounded bg-[#16A34A]"/><i className="h-3 w-1/2 rounded bg-[#B6F23D]"/></div><svg aria-hidden="true" viewBox="0 0 90 36" className="h-9 w-24"><path d="M2 29C25 31 25 6 47 13s22 14 41-9" stroke="#22C55E" strokeWidth="3" fill="none"/></svg></div>; }

export const artifactIllustrations = [ArtifactOne, ArtifactTwo, ArtifactThree, ArtifactFour, ArtifactFive, ArtifactSix, ArtifactSeven, ArtifactEight, ArtifactNine, ArtifactTen] as const;

export function StudioDoodle({ index }: { index: number }) {
  return <svg aria-hidden="true" viewBox="0 0 120 74" className="h-[74px] w-[120px] text-[#22C55E]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {index === 0 && <><circle cx="46" cy="36" r="20"/><circle cx="46" cy="36" r="8"/><path d="M72 18h28M78 27h18M77 46h25"/><circle cx="46" cy="36" r="3" fill="#B6F23D"/></>}
    {index === 1 && <><path d="M40 53c-1-9-12-13-12-27a18 18 0 1 1 36 0c0 14-11 18-12 27M38 59h16M40 65h12"/><path d="m85 15 4-7m12 20 8 1M78 41l-7 5"/><circle cx="46" cy="24" r="6" fill="#B6F23D"/></>}
    {index === 2 && <><path d="m30 54 32-33 12 12-33 32-15 4 4-15Z"/><path d="m57 26 12 12M82 22l8-8m-4 26 13-2M27 20l-5-8"/><circle cx="91" cy="53" r="10" fill="#B6F23D"/></>}
    {index === 3 && <><circle cx="48" cy="31" r="20"/><path d="m62 46 18 18M39 32l7 7 13-15"/><rect x="82" y="16" width="19" height="26" rx="4"/><path d="M87 23h9m-9 7h9"/></>}
    {index === 4 && <><path d="M25 39 90 14v18L25 57V39Z" fill="#16A34A"/><path d="m91 17 14-7-4 15M50 31l-12-9M60 27l2-13"/><path d="m82 49 5 6 12-14"/></>}
    <path d="M18 65h84" strokeOpacity=".25"/><circle cx="18" cy="65" r="3" fill="#B6F23D" stroke="none"/>
  </svg>;
}
