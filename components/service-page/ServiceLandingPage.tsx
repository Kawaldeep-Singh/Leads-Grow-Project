'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Modal } from '@/components/ui/Modal';
import type { ServicePageContent } from '@/data/servicePages';
import { registerGsapPlugins, ScrollTrigger } from '@/lib/gsap-register';
import { ServiceHero } from './ServiceHero';
import { ServiceCTA, ServiceCatalog, ServiceOverview, ServiceProof } from './ServiceSections';
import { ServiceProcess } from './ServiceProcess';
import { WebsiteHero } from './WebsiteHero';
import { WebsiteWhySection, WebsiteServices } from './WebsiteSections';
import { WebsiteDevelopmentProcess } from './WebsiteProcess';
import { TechStack } from '@/components/sections/TechStack';
import { Industries } from '@/components/sections/Industries';
import { AboutStory } from '@/components/sections/about/AboutStory';
import { Stats } from '@/components/sections/Stats';

export function ServiceLandingPage({ content }: { content: ServicePageContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [modalSource, setModalSource] = useState('service-page-nav-audit');

  const openLeadModal = (service?: string, source = 'service-page') => {
    setSelectedService(service);
    setModalSource(source);
    setIsModalOpen(true);
  };

  const sections = content.slug === 'digital-marketing'
    ? (['hero', 'what', 'services', 'why', 'process', 'industries', 'cta'] as const).map((section) => {
      switch (section) {
        case 'hero': return <ServiceHero key={section} content={content} />;
        case 'what': return <ServiceOverview key={section} content={content} />;
        case 'services': return <ServiceCatalog key={section} content={content} />;
        case 'why': return <ServiceProof key={section} content={content} />;
        case 'process': return <ServiceProcess key={section} content={content} />;
        case 'industries': return <Industries key={section} onSelectIndustry={(name) => openLeadModal(`Growth for ${name}`, `service-page-industry-${name}`)} />;
        case 'cta': return <ServiceCTA key={section} content={content} />;
      }
    })
    : content.sections.map((section) => {
      switch (section) {
        case 'hero': return <WebsiteHero key={section} content={content} />;
        case 'why': return <WebsiteWhySection key={section} content={content} />;
        case 'services': return <WebsiteServices key={section} content={content} />;
        case 'process': return <WebsiteDevelopmentProcess key={section} content={content} />;
        case 'techStack': return <TechStack key={section} />;
        case 'whyLeadsGrow': return <AboutStory key={section} />;
        case 'counters': return <Stats key={section} overlap={false} />;
      }
    });

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
        {sections}
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultService={selectedService} source={modalSource} />
      <Footer />
    </div>
  );
}
