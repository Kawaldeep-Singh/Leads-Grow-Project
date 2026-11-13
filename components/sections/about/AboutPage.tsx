'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { Modal } from '@/components/ui/Modal';
import { registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { AboutHero } from './AboutHero';
import { AboutHeroV2 } from './AboutHeroV2';
import { AboutStory } from './AboutStory';
import { AboutMissionVision } from './AboutMissionVision';
import { AboutApproach } from './AboutApproach';
import { AboutCTA } from './AboutCTA';

export const AboutPage: React.FC<{ heroVariant?: 'v1' | 'v2' }> = ({ heroVariant = 'v2' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [modalSource, setModalSource] = useState('about-cta');

  const handleOpenModal = (service?: string, source = 'about-cta') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  useEffect(() => {
    registerGsapPlugins();
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    else refresh();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F0D]">
      <Header onOpenAudit={() => handleOpenModal(undefined, 'about-nav-audit')} />
      <motion.main
        className="relative flex-1 overflow-x-clip"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div role="group" aria-label="About hero version" className="pointer-events-auto absolute right-[5%] top-[102px] z-40 flex items-center rounded-full border border-[#0B0F0D]/10 bg-white/95 p-1 shadow-sm">
          {(['v1', 'v2'] as const).map((variant) => (
            <Link
              key={variant}
              href={`/about?hero=${variant}`}
              aria-current={heroVariant === variant ? 'page' : undefined}
              className={`rounded-full px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wide transition-colors ${heroVariant === variant ? 'bg-[#16A34A] text-white' : 'text-[#5B6B63] hover:bg-[#F6FAF7]'}`}
            >
              {variant}
            </Link>
          ))}
        </div>
        {heroVariant === 'v1' ? <AboutHero /> : <AboutHeroV2 />}
        <AboutStory />
        <AboutMissionVision />
        <AboutApproach />
        <AboutCTA />
      </motion.main>
      <Footer />
      <FloatingWidgets onOpenConsultation={() => handleOpenModal(undefined, 'about-floating-widget')} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
        source={modalSource}
      />
    </div>
  );
};
