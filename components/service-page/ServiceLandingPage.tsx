'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import type { ServicePageContent } from '@/data/servicePages';
import { registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { ServiceHero } from './ServiceHero';
import { ServiceCTA, ServiceCatalog, ServiceIndustries, ServiceOverview, ServiceProof } from './ServiceSections';
import { ServiceProcess } from './ServiceProcess';

export function ServiceLandingPage({ content }: { content: ServicePageContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [modalSource, setModalSource] = useState('service-page-nav-audit');

  const openLeadModal = (service?: string, source = 'service-page') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  useEffect(() => {
    registerGsapPlugins();
    let mounted = true;
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(() => { if (mounted) refresh(); });
    else refresh();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B0F0D] font-sans">
      <Header theme="dark" onOpenAudit={() => openLeadModal(undefined, 'service-page-nav-audit')} />
      <main className="relative flex-1 overflow-x-clip">
        <ServiceHero content={content} />
        <ServiceOverview content={content} />
        <ServiceCatalog content={content} />
        {/* <ServiceProof content={content} /> */}
        {/* <ServiceProcess content={content} /> */}
        {/* <ServiceIndustries content={content} onSelectIndustry={(name) => openLeadModal(`Growth for ${name}`, `service-page-industry-${name}`)} /> */}
        {/* <ServiceCTA content={content} /> */}
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultService={selectedService} source={modalSource} />
      <Footer />
    </div>
  );
}
