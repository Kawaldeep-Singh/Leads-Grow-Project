'use client';

import React from 'react';
import { ServicesSection } from './services/ServicesSection';

interface HeroV2Props {
  onSelectService: (serviceTitle: string) => void;
  onOpenConsultation?: () => void;
}

/**
 * HeroV2 - Variant 2 Hero Section
 * In Variant 2, the original hero fold (headline, growth chart) is removed,
 * and the Services Section itself serves directly as the Hero Section.
 */
export function HeroV2({ onSelectService }: HeroV2Props) {
  return (
    <div
      id="hero"
      className="relative bg-[#0B0F0D] text-white pt-16 sm:pt-20 lg:pt-24 overflow-hidden"
    >
      {/* Ambient background glows for Hero stage atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#16A34A]/10 rounded-full blur-[220px] pointer-events-none" />

      {/* Services Section acting directly as the Hero section */}
      <ServicesSection onSelectService={onSelectService} />
    </div>
  );
}
