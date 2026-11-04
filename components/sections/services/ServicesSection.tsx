'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ServicesClassic } from './ServicesClassic';
import { Services3D } from './Services3D';
import { ServicesSwitch, ServicesVariant } from './ServicesSwitch';
import { ScrollTrigger, gsap } from '@/lib/gsap-register';

export interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  isHeroFold?: boolean;
}

const STORAGE_KEY = 'lg-services-variant';

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  isHeroFold = false,
}) => {
  // Default to '3d', update from localStorage in useEffect
  const [variant, setVariant] = useState<ServicesVariant>('3d');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Safe read from localStorage on mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ServicesVariant | null;
      if (saved === 'classic' || saved === '3d') {
        setVariant(saved);
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }, []);

  // Smooth switch variant handler
  const handleVariantChange = useCallback(
    (newVariant: ServicesVariant) => {
      if (newVariant === variant || isTransitioning) return;

      setIsTransitioning(true);

      // Persist user selection
      try {
        localStorage.setItem(STORAGE_KEY, newVariant);
      } catch {
        // Ignore storage errors
      }

      // Step 1: Fade out wrapper (0.2s)
      if (wrapperRef.current) {
        gsap.to(wrapperRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            // Step 2: Swap the variant
            setVariant(newVariant);

            // Step 3: Double RAF for clean DOM layout & ScrollTrigger refresh
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();

                // Smooth scroll to #services top
                const lenis = (
                  window as unknown as {
                    __lenis?: {
                      scrollTo: (target: string | number, opts?: Record<string, unknown>) => void;
                    };
                  }
                ).__lenis;

                if (lenis) {
                  lenis.scrollTo('#services', { offset: -80, duration: 0.8 });
                } else {
                  const el = document.getElementById('services');
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }

                // Step 4: Fade back in (0.3s)
                if (wrapperRef.current) {
                  gsap.to(wrapperRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                      setIsTransitioning(false);
                      ScrollTrigger.refresh();
                    },
                  });
                } else {
                  setIsTransitioning(false);
                }
              });
            });
          },
        });
      } else {
        setVariant(newVariant);
        setIsTransitioning(false);
      }
    },
    [variant, isTransitioning]
  );

  const switchUI = (
    <ServicesSwitch
      variant={variant}
      onChange={handleVariantChange}
    />
  );

  return (
    <section
      id="services"
      className={`relative bg-[#0B0F0D] text-white overflow-hidden ${
        isHeroFold ? 'border-b border-[#1A2420]/60' : 'border-y border-[#1A2420]/60'
      }`}
    >
      <div ref={wrapperRef} className="w-full transition-opacity">
        {variant === 'classic' ? (
          <div
            className={`pb-24 sm:pb-32 relative bg-dot-pattern ${
              isHeroFold ? 'pt-32 sm:pt-40 lg:pt-44' : 'pt-24 pb-24 sm:pt-32 sm:pb-32'
            }`}
          >
            {/* Ambient gradient lighting for classic */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[#16A34A]/10 rounded-full blur-[220px] pointer-events-none" />
            <div className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-[#B6F23D]/5 rounded-full blur-[180px] pointer-events-none" />
            <ServicesClassic
              onSelectService={onSelectService}
              switchComponent={switchUI}
            />
          </div>
        ) : (
          <div className={isHeroFold ? 'pt-20 lg:pt-24' : ''}>
            <Services3D
              onSelectService={onSelectService}
              switchSlot={switchUI}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
