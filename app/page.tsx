'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
// import { Hero } from '@/components/sections/Hero'; // V1 commented out
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { MarqueeBand } from '@/components/sections/MarqueeBand';
import { TechStack } from '@/components/sections/TechStack';
import { Industries } from '@/components/sections/Industries';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Modal } from '@/components/ui/Modal';
// import { useSiteVariant } from '@/context/VariantContext';

export default function HomePage() {
  // const { variant } = useSiteVariant();
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
      {/* Header with Mega Menu */}
      <Header onOpenAudit={() => handleOpenModal(undefined, 'nav-audit')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── VARIANT 1: Classic Creative Flow (COMMENTED OUT AS REQUESTED) ── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/*
          <motion.div
            key="site-variant-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Hero onOpenConsultation={() => handleOpenModal(undefined, 'hero-cta')} />
            <Stats overlap={false} />
            <Services
              onSelectService={(serviceTitle) =>
                handleOpenModal(serviceTitle, `service-card-${serviceTitle}`)
              }
            />
            <MarqueeBand />
            <TechStack />
            <Industries
              onSelectIndustry={(industryName) =>
                handleOpenModal(`Growth for ${industryName}`, `industry-${industryName}`)
              }
            />
            <Testimonials />
            <CTA onOpenModal={() => handleOpenModal(undefined, 'bottom-cta')} />
          </motion.div>
          */}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* ── VARIANT 2: Services-as-Hero Flow (Active with Classic Grid)   ── */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <motion.div
            key="site-variant-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* 1. Services Section directly as Hero Section (Classic Grid) */}
            <Services
              isHeroFold={true}
              onSelectService={(serviceTitle) =>
                handleOpenModal(serviceTitle, `v2-service-${serviceTitle}`)
              }
            />

            {/* 2. Standalone Stats Strip */}
            <Stats overlap={false} />

            {/* 3. Decorative Tilted Dual Marquee Band */}
            <MarqueeBand />

            {/* 4. Technologies & Integrations (6 Tabs) */}
            <TechStack />

            {/* 5. Industries We Serve (10 Industries Grid) */}
            <Industries
              onSelectIndustry={(industryName) =>
                handleOpenModal(`Growth for ${industryName}`, `v2-industry-${industryName}`)
              }
            />

            {/* 6. Testimonials Center-Focused Carousel */}
            <Testimonials />

            {/* 7. Big Final CTA Band */}
            <CTA onOpenModal={() => handleOpenModal(undefined, 'bottom-cta')} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Widgets (WhatsApp & Consultation) */}
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
