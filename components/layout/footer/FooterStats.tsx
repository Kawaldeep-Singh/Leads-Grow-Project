'use client';

import React from 'react';
import { Counter } from '@/components/ui/Counter';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const PROOF_STATS: StatItem[] = [
  { value: 7, suffix: '+', label: 'Years Experience' },
  { value: 50, suffix: 'L+', label: 'Quality Leads' },
  { value: 5, suffix: 'K+', label: 'Campaigns Managed' },
  { value: 10, suffix: '+', label: 'Industries Served' },
];

export const FooterStats: React.FC = () => {
  return (
    <div className="w-full border-t border-b border-[#1A2420] py-8 sm:py-10 my-12 sm:my-16 bg-[#111815]/25 backdrop-blur-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:gap-0 lg:divide-x lg:divide-[#1A2420]">
        {PROOF_STATS.map((stat, idx) => (
          <div
            key={idx}
            className="footer-stat-item flex flex-col items-center justify-center text-center px-4 sm:px-6"
          >
            <div className="flex items-baseline justify-center mb-1.5">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                duration={1.8}
                className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight"
              />
            </div>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#9FB0A7] font-medium font-mono">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
