'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SiteVariant = 'v1' | 'v2';

interface VariantContextType {
  variant: SiteVariant;
  setVariant: (variant: SiteVariant) => void;
  toggleVariant: () => void;
  isMounted: boolean;
}

const STORAGE_KEY = 'lg_site_variant';

const VariantContext = createContext<VariantContextType>({
  variant: 'v1',
  setVariant: () => {},
  toggleVariant: () => {},
  isMounted: false,
});

export const VariantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [variant, setVariantState] = useState<SiteVariant>('v1');
  const [isMounted, setIsMounted] = useState(false);

  // Read initial variant from URL param or localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlVariant = searchParams.get('variant') || searchParams.get('v');

      if (urlVariant === 'v2' || urlVariant === '2') {
        setVariantState('v2');
        return;
      }
      if (urlVariant === 'v1' || urlVariant === '1') {
        setVariantState('v1');
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY) as SiteVariant | null;
      if (saved === 'v1' || saved === 'v2') {
        setVariantState(saved);
      }
    } catch {
      // Ignore storage/search errors
    }
  }, []);

  const setVariant = useCallback((newVariant: SiteVariant) => {
    setVariantState(newVariant);

    try {
      localStorage.setItem(STORAGE_KEY, newVariant);

      // Optionally update URL query param without reload
      const url = new URL(window.location.href);
      url.searchParams.set('v', newVariant);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore storage errors
    }

    // Refresh ScrollTrigger and smooth scroll after variant DOM layout changes
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          try {
            const { ScrollTrigger } = await import('@/lib/gsap-register');
            ScrollTrigger.refresh();

            const lenis = (
              window as unknown as {
                __lenis?: { resize: () => void };
              }
            ).__lenis;
            lenis?.resize();
          } catch {
            // Ignore animation library errors
          }
        });
      });
    }
  }, []);

  const toggleVariant = useCallback(() => {
    setVariant(variant === 'v1' ? 'v2' : 'v1');
  }, [variant, setVariant]);

  return (
    <VariantContext.Provider value={{ variant, setVariant, toggleVariant, isMounted }}>
      {children}
    </VariantContext.Provider>
  );
};

export const useSiteVariant = () => useContext(VariantContext);

