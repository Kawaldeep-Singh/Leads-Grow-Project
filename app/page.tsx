'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { Hero } from '@/components/sections/Hero';
import { HeroV2 } from '@/components/sections/HeroV2';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { MarqueeBand } from '@/components/sections/MarqueeBand';
import { TechStack } from '@/components/sections/TechStack';
import { Industries } from '@/components/sections/Industries';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Modal } from '@/components/ui/Modal';
import { useSiteVariant } from '@/context/VariantContext';

export default function HomePage() {
  const { variant } = useSiteVariant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [modalSource, setModalSource] = useState<string>('home-cta');

  const handleOpenModal = (service?: string, source: string = 'home-cta') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F0D]">
      {/* Header with Mega Menu & Variant Switcher */}
      <Header onOpenAudit={() => handleOpenModal(undefined, 'nav-audit')} />

      {/* Main Content Sections with Variant Switching */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {variant === 'v1' ? (
            /* ── VARIANT 1: Classic Creative Flow (Hero -> Floating Stats (50/50) -> Services -> Rest) ── */
            <motion.div
              key="site-variant-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* 1. Hero Section */}
              <Hero onOpenConsultation={() => handleOpenModal(undefined, 'hero-cta')} />

              {/* 2. Stats Strip (Floats 50% on Hero & 50% on Services) */}
              <Stats overlap={true} />

              {/* 3. Explore What We Offer (8 Service Cards) */}
              <Services
                onSelectService={(serviceTitle) =>
                  handleOpenModal(serviceTitle, `service-card-${serviceTitle}`)
                }
              />

              {/* 4. Decorative Tilted Dual Marquee Band */}
              <MarqueeBand />

              {/* 5. Technologies & Integrations (6 Tabs) */}
              <TechStack />

              {/* 6. Industries We Serve (10 Industries Grid) */}
              <Industries
                onSelectIndustry={(industryName) =>
                  handleOpenModal(`Growth for ${industryName}`, `industry-${industryName}`)
                }
              />

              {/* 7. Testimonials Center-Focused Carousel */}
              <Testimonials />

              {/* 8. Big Final CTA Band */}
              <CTA onOpenModal={() => handleOpenModal(undefined, 'bottom-cta')} />
            </motion.div>
          ) : (
            /* ── VARIANT 2: Services-First Enterprise Flow (HeroV2 with Integrated Stats & Services -> Rest) ── */
            <motion.div
              key="site-variant-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* 1. Services-First Hero (Headline + Stats Bar + Category Explorer + 8 Service Cards) */}
              <HeroV2
                onOpenConsultation={() => handleOpenModal(undefined, 'hero-v2-cta')}
                onSelectService={(serviceTitle) =>
                  handleOpenModal(serviceTitle, `hero-v2-service-${serviceTitle}`)
                }
              />

              {/* 2. Decorative Tilted Dual Marquee Band */}
              <MarqueeBand />

              {/* 3. Technologies & Integrations (6 Tabs) */}
              <TechStack />

              {/* 4. Industries We Serve (10 Industries Grid) */}
              <Industries
                onSelectIndustry={(industryName) =>
                  handleOpenModal(`Growth for ${industryName}`, `industry-${industryName}`)
                }
              />

              {/* 5. Testimonials Center-Focused Carousel */}
              <Testimonials />

              {/* 6. Big Final CTA Band */}
              <CTA onOpenModal={() => handleOpenModal(undefined, 'bottom-cta')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Widgets (WhatsApp & Consultation & Floating Variant Switcher) */}
      <FloatingWidgets onOpenConsultation={() => handleOpenModal(undefined, 'floating-widget')} />

      {/* Lead Capture Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultService={selectedService}
        source={modalSource}
      />
    </div>
  );
}
