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
      className={`inline-flex items-center p-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-md shadow-black/5 ${className}`}
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
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
          variant === 'classic' ? 'text-white' : 'text-[#5B6B63] hover:text-[#0B0F0D]'
        }`}
      >
        <HiSquares2X2 className="w-4 h-4 shrink-0" />
        <span>Classic Grid</span>
        {variant === 'classic' && (
          <motion.div
            layoutId="services-switch-pill"
            className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-full -z-10 shadow-md shadow-[#16A34A]/30"
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
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 ${
          variant === '3d' ? 'text-white' : 'text-[#5B6B63] hover:text-[#0B0F0D]'
        }`}
      >
        <HiCube className={`w-4 h-4 shrink-0 ${variant === '3d' ? 'text-white' : 'text-[#16A34A]'}`} />
        <span>3D Experience</span>
        <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full font-mono uppercase shadow-sm ${
          variant === '3d' ? 'bg-white/20 text-white' : 'bg-[#16A34A]/10 text-[#16A34A]'
        }`}>
          NEW
        </span>
        {variant === '3d' && (
          <motion.div
            layoutId="services-switch-pill"
            className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#15803D] rounded-full -z-10 shadow-md shadow-[#16A34A]/30"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
      </button>
    </div>
  );
};
