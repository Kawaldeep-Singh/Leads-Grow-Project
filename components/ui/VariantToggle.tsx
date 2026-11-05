'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSiteVariant, SiteVariant } from '@/context/VariantContext';

interface VariantToggleProps {
  mode?: 'header' | 'floating' | 'mobile';
  className?: string;
}

const variants: { id: SiteVariant; label: string; badge?: string }[] = [
  { id: 'v1', label: 'V1' },
  { id: 'v2', label: 'V2' },
  { id: 'v3', label: 'V3' },
];

export const VariantToggle: React.FC<VariantToggleProps> = ({
  mode = 'header',
  className = '',
}) => {
  const { variant, setVariant, isMounted } = useSiteVariant();

  if (!isMounted) {
    return (
      <div className={`flex items-center rounded-full bg-[#111815] border border-[#1A2420] p-1 ${className}`}>
        <div className="w-24 h-7" />
      </div>
    );
  }

  // Floating Mode (Bottom-Left fixed or standalone)
  if (mode === 'floating') {
    return (
      <div
        className={`pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B0F0D]/90 backdrop-blur-md border border-[#22C55E]/40 shadow-[0_0_25px_rgba(22,163,74,0.25)] ${className}`}
      >
        <span className="text-[10px] font-mono font-bold tracking-wider text-[#9FB0A7] px-2 uppercase select-none">
          Variant
        </span>
        <div className="flex items-center gap-1 bg-[#111815] p-1 rounded-xl border border-[#1A2420]">
          {variants.map((v) => {
            const isActive = variant === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer select-none ${
                  isActive ? 'text-[#0B0F0D]' : 'text-[#9FB0A7] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-floating-variant"
                    className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-lg shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile Drawer Mode
  if (mode === 'mobile') {
    return (
      <div className={`w-full flex flex-col gap-2 p-3 rounded-2xl bg-[#111815] border border-[#1A2420] ${className}`}>
        <span className="text-xs font-mono font-semibold text-[#9FB0A7] uppercase tracking-wider">
          Select Design Variant
        </span>
        <div className="grid grid-cols-3 gap-2 bg-[#0B0F0D] p-1 rounded-xl border border-[#1A2420]">
          {variants.map((v) => {
            const isActive = variant === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setVariant(v.id)}
                className={`relative py-2 rounded-lg text-xs font-bold transition-colors text-center cursor-pointer ${
                  isActive ? 'text-[#0B0F0D]' : 'text-[#9FB0A7] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-variant"
                    className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: Header Mode (Compact Pill)
  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-full bg-[#111815] border border-[#1A2420] shadow-inner ${className}`}
    >
      {variants.map((v) => {
        const isActive = variant === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={`relative px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition-colors cursor-pointer select-none ${
              isActive ? 'text-[#0B0F0D]' : 'text-[#9FB0A7] hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-header-variant"
                className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VariantToggle;

