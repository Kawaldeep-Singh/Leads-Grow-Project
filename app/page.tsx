'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { MarqueeBand } from '@/components/sections/MarqueeBand';
import { TechStack } from '@/components/sections/TechStack';
import { Industries } from '@/components/sections/Industries';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { Modal } from '@/components/ui/Modal';

export default function HomePage() {
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
        {/* 1. Hero Section */}
        <Hero onOpenConsultation={() => handleOpenModal(undefined, 'hero-cta')} />

        {/* 2. Stats Strip */}
        <Stats />

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

