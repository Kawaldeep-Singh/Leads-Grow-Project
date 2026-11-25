'use client';

import { Images, LayoutGrid } from 'lucide-react';

export type ServicesView = 'v1' | 'v2';

export function ServicesViewToggle({ value, onChange }: { value: ServicesView; onChange: (value: ServicesView) => void }) {
  return <div aria-label="Services display style" role="group" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 p-1">
    <button type="button" aria-label="Show pinboard layout" aria-pressed={value === 'v1'} onClick={() => onChange('v1')} className={`grid size-10 place-items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6F23D] ${value === 'v1' ? 'bg-[#22C55E] text-[#0B0F0D]' : 'text-white/65 hover:text-white'}`}><LayoutGrid aria-hidden="true" className="size-4"/></button>
    <button type="button" aria-label="Show photo wall" aria-pressed={value === 'v2'} onClick={() => onChange('v2')} className={`grid size-10 place-items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6F23D] ${value === 'v2' ? 'bg-[#22C55E] text-[#0B0F0D]' : 'text-white/65 hover:text-white'}`}><Images aria-hidden="true" className="size-4"/></button>
  </div>;
}
