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

export function VariantOne({ onOpenModal }: VariantProps) {
  return (
    <div className="w-full">
      {/* Unified Hero & Services Fold with White Service Boxes */}
      <Hero
        onOpenConsultation={() => onOpenModal(undefined, 'v1-hero-cta')}
        onSelectService={(serviceTitle) =>
          onOpenModal(serviceTitle, `v1-service-${serviceTitle}`)
        }
        theme="light"
        showServicesHeading={true}
      />

      {/* Standalone Stats Strip */}
      {/* <Stats overlap={false} /> */}

      {/* Decorative Tilted Dual Marquee Band */}
      <MarqueeBand />

      {/* Technologies & Integrations (6 Tabs) */}
      <TechStack />

      {/* Industries We Serve (10 Industries Grid) */}
      <Industries
        onSelectIndustry={(industryName) =>
          onOpenModal(`Growth for ${industryName}`, `v1-industry-${industryName}`)
        }
      />

      {/* Testimonials Center-Focused Carousel */}
      <Testimonials />

      {/* Big Final CTA Band */}
      <CTA onOpenModal={() => onOpenModal(undefined, 'v1-bottom-cta')} />
    </div>
  );
}

export default VariantOne;

