'use client';

import { Images, LayoutGrid } from 'lucide-react';

export type PlatformsView = 'v1' | 'v2';

export function PlatformsViewToggle({
  value,
  onChange,
}: {
  value: PlatformsView;
  onChange: (value: PlatformsView) => void;
}) {
  return (
    <div
      aria-label="Platforms display style"
      role="group"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#111815] p-1 shadow-lg"
    >
      <button
        type="button"
        aria-label="Show abstract view (Variant 1)"
        aria-pressed={value === 'v1'}
        onClick={() => onChange('v1')}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6F23D] ${
          value === 'v1' ? 'bg-[#22C55E] text-[#0B0F0D]' : 'text-white/70 hover:text-white'
        }`}
      >
        <LayoutGrid aria-hidden="true" className="size-3.5" />
        <span aria-hidden="true">V1</span>
      </button>
      <button
        type="button"
        aria-label="Show real visual view (Variant 2)"
        aria-pressed={value === 'v2'}
        onClick={() => onChange('v2')}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6F23D] ${
          value === 'v2' ? 'bg-[#22C55E] text-[#0B0F0D]' : 'text-white/70 hover:text-white'
        }`}
      >
        <Images aria-hidden="true" className="size-3.5" />
        <span aria-hidden="true">V2</span>
      </button>
    </div>
  );
}
