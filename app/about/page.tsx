'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { Modal } from '@/components/ui/Modal';

import { AboutHero } from '@/components/sections/about/AboutHero';
import { AboutPillars } from '@/components/sections/about/AboutPillars';
import { AboutTimeline } from '@/components/sections/about/AboutTimeline';
import { AboutTeam } from '@/components/sections/about/AboutTeam';
import { AboutStats } from '@/components/sections/about/AboutStats';
import { AboutCTA } from '@/components/sections/about/AboutCTA';

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [modalSource, setModalSource] = useState<string>('about-cta');

  const handleOpenModal = (service?: string, source: string = 'about-cta') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F0D]">
      {/* Header */}
      <Header onOpenAudit={() => handleOpenModal(undefined, 'about-nav-audit')} />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero & Vision Statement */}
        <AboutHero onOpenConsultation={() => handleOpenModal(undefined, 'about-hero-blueprint')} />

        {/* 2. Core Pillars & Philosophy */}
        <AboutPillars />

        {/* 3. 15+ Year Evolution & Milestones */}
        <AboutTimeline />

        {/* 4. Leadership & Specialists Squad */}
        <AboutTeam />

        {/* 5. Verified Impact & Numbers */}
        <AboutStats />

        {/* 6. Closing Call to Action */}
        <AboutCTA onOpenModal={() => handleOpenModal(undefined, 'about-bottom-cta')} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Widgets */}
      <FloatingWidgets onOpenConsultation={() => handleOpenModal(undefined, 'about-floating-widget')} />

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

