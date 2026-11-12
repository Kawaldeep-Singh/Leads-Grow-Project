'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { Modal } from '@/components/ui/Modal';
import { registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';

import { AboutHero } from './AboutHero';
import { AboutStory } from './AboutStory';
import { AboutMissionVision } from './AboutMissionVision';
import { AboutApproach } from './AboutApproach';
import { AboutCTA } from './AboutCTA';

export const AboutPage: React.FC = () => {
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

  useEffect(() => {
    registerGsapPlugins();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    } else {
      ScrollTrigger.refresh();
    }

    return () => {
      // Clean up triggers created on this route so no leaks occur during navigation
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F0D]">
      {/* Header */}
      <Header onOpenAudit={() => handleOpenModal(undefined, 'about-nav-audit')} />

      {/* Main Content with subtle page transition */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* 1. Hero (dark) */}
        <AboutHero />

        {/* 2. Our Story (light) */}
        <AboutStory />

        {/* 3. Mission & Vision (dark) */}
        <AboutMissionVision />

        {/* 4. Our Approach (light) */}
        <AboutApproach />

        {/* 5. Closing CTA (dark) */}
        <AboutCTA />
      </motion.main>

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
};
