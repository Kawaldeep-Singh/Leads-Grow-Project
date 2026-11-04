'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { HiSquares2X2, HiCube } from 'react-icons/hi2';

export type ServicesVariant = 'classic' | '3d';

export interface ServicesSwitchProps {
  variant: ServicesVariant;
  onChange: (variant: ServicesVariant) => void;
  className?: string;
}

export const ServicesSwitch: React.FC<ServicesSwitchProps> = ({
  variant,
  onChange,
  className = '',
}) => {
  const classicBtnRef = useRef<HTMLButtonElement>(null);
  const threeDBtnRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, current: ServicesVariant) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (current === 'classic') {
        onChange('3d');
        threeDBtnRef.current?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (current === '3d') {
        onChange('classic');
        classicBtnRef.current?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Services Display Mode"
      className={`inline-flex items-center p-1.5 rounded-full bg-[#111815]/90 border border-[#1A2420] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Option A: Classic */}
      <button
        ref={classicBtnRef}
        type="button"
        role="tab"
        id="tab-services-classic"
        aria-controls="services-classic-panel"
        aria-selected={variant === 'classic'}
        tabIndex={variant === 'classic' ? 0 : -1}
        onClick={() => onChange('classic')}
        onKeyDown={(e) => handleKeyDown(e, 'classic')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F0D] ${
          variant === 'classic' ? 'text-white' : 'text-[#9FB0A7] hover:text-white'
        }`}
      >
        <HiSquares2X2 className="w-4 h-4 shrink-0" />
        <span>Classic Grid</span>
        {variant === 'classic' && (
          <motion.div
            layoutId="services-switch-pill"
            className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full -z-10 shadow-[0_0_15px_rgba(34,197,94,0.35)]"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
      </button>

      {/* Option B: 3D Experience */}
      <button
        ref={threeDBtnRef}
        type="button"
        role="tab"
        id="tab-services-3d"
        aria-controls="services-3d-panel"
        aria-selected={variant === '3d'}
        tabIndex={variant === '3d' ? 0 : -1}
        onClick={() => onChange('3d')}
        onKeyDown={(e) => handleKeyDown(e, '3d')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F0D] ${
          variant === '3d' ? 'text-white' : 'text-[#9FB0A7] hover:text-white'
        }`}
      >
        <HiCube className="w-4 h-4 shrink-0 text-[#22C55E] group-hover:text-white" />
        <span>3D Experience</span>
        <span className="text-[9px] font-black tracking-widest text-[#0B0F0D] bg-[#B6F23D] px-1.5 py-0.2 rounded-full font-mono uppercase shadow-sm">
          NEW
        </span>
        {variant === '3d' && (
          <motion.div
            layoutId="services-switch-pill"
            className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full -z-10 shadow-[0_0_15px_rgba(34,197,94,0.35)]"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
      </button>
    </div>
  );
};

