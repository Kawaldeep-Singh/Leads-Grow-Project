'use client';

import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { MarqueeBand } from '@/components/sections/MarqueeBand';
import { TechStack } from '@/components/sections/TechStack';
import { Industries } from '@/components/sections/Industries';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

interface VariantProps {
  onOpenModal: (service?: string, source?: string) => void;
}

export function VariantTwo({ onOpenModal }: VariantProps) {
  return (
    <div className="w-full">
      {/* Unified Hero & Services Fold with White Service Boxes */}
      <Hero
        onOpenConsultation={() => onOpenModal(undefined, 'v2-hero-cta')}
        onSelectService={(serviceTitle) =>
          onOpenModal(serviceTitle, `v2-service-${serviceTitle}`)
        }
        theme="light"
      />

      {/* Decorative Tilted Dual Marquee Band */}
      <MarqueeBand />

      {/* Technologies & Integrations (6 Tabs) */}
      <TechStack />

      {/* Industries We Serve (8 Industries Grid) */}
      <Industries
        onSelectIndustry={(industryName) =>
          onOpenModal(`Growth for ${industryName}`, `v2-industry-${industryName}`)
        }
      />

      {/* Standalone Stats Strip: "You Believe. We Achieve." */}
      <Stats overlap={false} />

      {/* Testimonials Center-Focused Carousel */}
      <Testimonials />

      {/* Big Final CTA Band */}
      <CTA onOpenModal={() => onOpenModal(undefined, 'v2-bottom-cta')} />
    </div>
  );
}

export default VariantTwo;

