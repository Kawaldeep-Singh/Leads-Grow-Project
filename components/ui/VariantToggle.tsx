'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';
import { BsLayersFill } from 'react-icons/bs';
import { useSiteVariant, SiteVariant } from '@/context/VariantContext';

interface VariantToggleProps {
  mode?: 'header' | 'mobile' | 'floating' | 'inline';
  className?: string;
}

export const VariantToggle: React.FC<VariantToggleProps> = ({
  mode = 'header',
  className = '',
}) => {
  const { variant, setVariant, isMounted } = useSiteVariant();

  // Prevent hydration flicker before client mount
  const currentVariant: SiteVariant = isMounted ? variant : 'v1';

  if (mode === 'header') {
    return (
      <div
        className={`relative inline-flex items-center p-1 rounded-full bg-[#111815]/90 border border-[#1A2420] shadow-inner backdrop-blur-md ${className}`}
        role="group"
        aria-label="Website variant toggle"
      >
        {/* V1 Button */}
        <button
          type="button"
          onClick={() => setVariant('v1')}
          aria-pressed={currentVariant === 'v1'}
          title="Variant 1: Classic layout with separate services section"
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
            currentVariant === 'v1'
              ? 'text-white'
              : 'text-[#9FB0A7] hover:text-white'
          }`}
        >
          {currentVariant === 'v1' && (
            <motion.div
              layoutId="variant-indicator-header"
              className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-full shadow-[0_0_14px_rgba(34,197,94,0.45)] border border-[#22C55E]/50"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <BsLayersFill className="h-3 w-3" />
            <span>V1</span>
            <span className="hidden xl:inline text-[10px] text-white/80 font-normal">Classic</span>
          </span>
        </button>

        {/* V2 Button */}
        <button
          type="button"
          onClick={() => setVariant('v2')}
          aria-pressed={currentVariant === 'v2'}
          title="Variant 2: New layout with services integrated in Hero"
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer ${
            currentVariant === 'v2'
              ? 'text-white'
              : 'text-[#9FB0A7] hover:text-white'
          }`}
        >
          {currentVariant === 'v2' && (
            <motion.div
              layoutId="variant-indicator-header"
              className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-full shadow-[0_0_14px_rgba(34,197,94,0.45)] border border-[#22C55E]/50"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <HiSparkles className="h-3 w-3 text-[#B6F23D]" />
            <span>V2</span>
            
          </span>
        </button>
      </div>
    );
  }

  if (mode === 'mobile') {
    return (
      <div className={`flex flex-col gap-2 p-3.5 rounded-2xl bg-[#111815] border border-[#1A2420] ${className}`}>
        <div className="flex items-center justify-between text-xs text-[#9FB0A7]">
          <span className="font-mono uppercase tracking-wider text-[11px] text-[#22C55E]">
            Website Variant
          </span>
          <span className="text-[10px] font-mono text-[#5B6B63]">
            {currentVariant === 'v1' ? 'Current: V1 Classic' : 'Current: V2 Hero+Services'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B0F0D] rounded-xl border border-[#1A2420]/70">
          <button
            type="button"
            onClick={() => setVariant('v1')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              currentVariant === 'v1'
                ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30 border border-[#22C55E]/50'
                : 'text-[#9FB0A7] hover:text-white'
            }`}
          >
            <BsLayersFill className="h-3.5 w-3.5" />
            <span>V1 Classic</span>
          </button>

          <button
            type="button"
            onClick={() => setVariant('v2')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              currentVariant === 'v2'
                ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30 border border-[#22C55E]/50'
                : 'text-[#9FB0A7] hover:text-white'
            }`}
          >
            <HiSparkles className="h-3.5 w-3.5 text-[#B6F23D]" />
            <span>V2 New (Hero)</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'floating') {
    return (
      <div
        className={`pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-[#0B0F0D]/95 border border-[#22C55E]/30 shadow-2xl shadow-black/80 backdrop-blur-xl ${className}`}
      >
        <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-1 text-[11px] font-mono text-[#9FB0A7]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="uppercase tracking-wider">Layout:</span>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-full bg-[#111815] border border-[#1A2420]">
          <button
            type="button"
            onClick={() => setVariant('v1')}
            aria-pressed={currentVariant === 'v1'}
            title="Switch to Variant 1 (Classic)"
            className={`relative px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              currentVariant === 'v1' ? 'text-white' : 'text-[#9FB0A7] hover:text-white'
            }`}
          >
            {currentVariant === 'v1' && (
              <motion.div
                layoutId="variant-indicator-floating"
                className="absolute inset-0 bg-[#16A34A] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)] border border-[#22C55E]/60"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <BsLayersFill className="h-3 w-3" />
              <span>V1</span>
              <span className="hidden md:inline text-[10px] opacity-80">Classic</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVariant('v2')}
            aria-pressed={currentVariant === 'v2'}
            title="Switch to Variant 2 (Hero + Services)"
            className={`relative px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              currentVariant === 'v2' ? 'text-white' : 'text-[#9FB0A7] hover:text-white'
            }`}
          >
            {currentVariant === 'v2' && (
              <motion.div
                layoutId="variant-indicator-floating"
                className="absolute inset-0 bg-[#16A34A] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)] border border-[#22C55E]/60"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <HiSparkles className="h-3 w-3 text-[#B6F23D]" />
              <span>V2</span>
              <span className="hidden md:inline text-[10px] text-[#B6F23D]">Hero+Services</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback inline mode
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setVariant('v1')}
        className={`px-3 py-1 text-xs rounded-full font-bold border transition-colors ${
          currentVariant === 'v1'
            ? 'bg-[#16A34A] text-white border-[#22C55E]'
            : 'bg-[#111815] text-[#9FB0A7] border-[#1A2420]'
        }`}
      >
        V1 Classic
      </button>
      <button
        onClick={() => setVariant('v2')}
        className={`px-3 py-1 text-xs rounded-full font-bold border transition-colors ${
          currentVariant === 'v2'
            ? 'bg-[#16A34A] text-white border-[#22C55E]'
            : 'bg-[#111815] text-[#9FB0A7] border-[#1A2420]'
        }`}
      >
        V2 
      </button>
    </div>
  );
};

