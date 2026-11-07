'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { VariantOne } from '@/components/variants/VariantOne';
import { VariantTwo } from '@/components/variants/VariantTwo';
import { VariantThree } from '@/components/variants/VariantThree';
import { useSiteVariant } from '@/context/VariantContext';
import { Modal } from '@/components/ui/Modal';

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
      {/* Header with Mega Menu */}
      <Header onOpenAudit={() => handleOpenModal(undefined, 'nav-audit')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`variant-${variant}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {variant === 'v1' && <VariantOne onOpenModal={handleOpenModal} />}
            {variant === 'v2' && <VariantTwo onOpenModal={handleOpenModal} />}
            {variant === 'v3' && <VariantThree onOpenModal={handleOpenModal} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {/* <Footer /> */}

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
