'use client';

import React, { useRef } from 'react';
import { ServicesClassic } from './ServicesClassic';
// 3D version commented out as requested
// import { Services3D } from './Services3D';
// import { ServicesSwitch, ServicesVariant } from './ServicesSwitch';

export interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  isHeroFold?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  isHeroFold = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /*
  // ── 3D SWITCHING LOGIC (Commented out - V2 uses Classic Grid only) ──
  const [variant, setVariant] = useState<ServicesVariant>('classic');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const STORAGE_KEY = 'lg-services-variant';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ServicesVariant | null;
      if (saved === 'classic' || saved === '3d') {
        setVariant(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleVariantChange = useCallback((newVariant: ServicesVariant) => { ... }, []);
  const switchUI = <ServicesSwitch variant={variant} onChange={handleVariantChange} />;
  */

  return (
    <section
      id="services"
      className={`relative bg-[#0B0F0D] text-white overflow-hidden ${
        isHeroFold ? 'border-b border-[#1A2420]/60' : 'border-y border-[#1A2420]/60'
      }`}
    >
      <div ref={wrapperRef} className="w-full transition-opacity">
        {/* ── Classic Grid (Active in V2) ── */}
        <div
          className={`pb-24 sm:pb-32 relative bg-dot-pattern ${
            isHeroFold ? 'pt-32 sm:pt-40 lg:pt-44' : 'pt-24 pb-24 sm:pt-32 sm:pb-32'
          }`}
        >
          {/* Ambient gradient lighting */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#16A34A]/10 rounded-full blur-[220px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-[#B6F23D]/5 rounded-full blur-[180px] pointer-events-none" />

          <ServicesClassic
            onSelectService={onSelectService}
            // switchComponent={switchUI} /* 3D Switch commented out */
          />
        </div>

        {/* ── 3D Experience (Commented out as requested) ──
        <div className={isHeroFold ? 'pt-20 lg:pt-24' : ''}>
          <Services3D
            onSelectService={onSelectService}
            switchSlot={switchUI}
          />
        </div>
        */}
      </div>
    </section>
  );
};

export default ServicesSection;
