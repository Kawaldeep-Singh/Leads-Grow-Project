'use client';

import React from 'react';
import { MARQUEE_KEYWORDS } from '@/lib/constants';
import { Marquee } from '@/components/ui/Marquee';

export const MarqueeBand: React.FC = () => {
  return (
    <section className="relative py-14 overflow-hidden bg-[#0B0F0D] select-none z-10">
      <div className="relative -rotate-2 scale-105 transform origin-center flex flex-col gap-3">
        {/* Row 1: Brand Green Band - gentle, readable speed */}
        <div className="bg-[#16A34A] py-3.5 shadow-xl shadow-[#16A34A]/20">
          <Marquee
            items={MARQUEE_KEYWORDS}
            baseVelocity={1.2}
            direction="left"
            separator="✦"
            itemClassName="text-sm sm:text-base font-extrabold tracking-wider uppercase text-white"
          />
        </div>

        {/* Row 2: Dark Ink Band with Green Highlights scrolling opposite direction */}
        <div className="bg-[#111815] border-y border-[#1A2420] py-3.5 shadow-lg">
          <Marquee
            items={[...MARQUEE_KEYWORDS].reverse()}
            baseVelocity={1.0}
            direction="right"
            separator="⚡"
            itemClassName="text-sm sm:text-base font-extrabold tracking-wider uppercase text-[#9FB0A7] hover:text-[#B6F23D] transition-colors"
          />
        </div>
      </div>
    </section>
  );
};
