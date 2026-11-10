'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
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
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('lg-variant-toggle-hidden');
      if (saved === 'true') {
        setIsHidden(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleHide = (hidden: boolean) => {
    setIsHidden(hidden);
    try {
      sessionStorage.setItem('lg-variant-toggle-hidden', String(hidden));
    } catch {
      // ignore
    }
  };

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
      <AnimatePresence mode="wait">
        {isHidden ? (
          <motion.button
            key="variant-collapsed"
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleToggleHide(false)}
            title="Click to show variant switcher"
            aria-label="Show variant switcher"
            className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0F0D]/90 backdrop-blur-md border border-[#22C55E]/40 shadow-[0_0_20px_rgba(22,163,74,0.25)] text-[#9FB0A7] hover:text-white hover:border-[#22C55E] transition-all cursor-pointer group select-none ${className}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#E2E8F0]">
              {variant.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#22C55E] font-bold group-hover:underline">
              Change
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="variant-expanded"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2 }}
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

            {/* Hide / Close Button */}
            <button
              type="button"
              onClick={() => handleToggleHide(true)}
              title="Hide variant button"
              aria-label="Hide variant switcher"
              className="flex items-center justify-center w-7 h-7 rounded-xl text-[#9FB0A7] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer ml-0.5"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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

