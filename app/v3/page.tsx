'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWidgets } from '@/components/layout/FloatingWidgets';
import { VariantThree } from '@/components/variants/VariantThree';
import { Modal } from '@/components/ui/Modal';

export default function V3Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [modalSource, setModalSource] = useState<string>('v3-cta');

  const handleOpenModal = (service?: string, source: string = 'v3-cta') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0B0F0D]">
      <Header onOpenAudit={() => handleOpenModal(undefined, 'nav-audit')} theme="top-light" />
      <main className="flex-1">
        <VariantThree onOpenModal={handleOpenModal} />
      </main>
      <Footer />
      <FloatingWidgets onOpenConsultation={() => handleOpenModal(undefined, 'floating-widget')} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
        source={modalSource}
      />
    </div>
  );
}

