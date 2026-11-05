'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type SiteVariant = 'v1' | 'v2' | 'v3';

interface VariantContextType {
  variant: SiteVariant;
  setVariant: (variant: SiteVariant) => void;
  isMounted: boolean;
}

const VariantContext = createContext<VariantContextType>({
  variant: 'v1',
  setVariant: () => {},
  isMounted: false,
});

const STORAGE_KEY = 'lg-site-variant';

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<SiteVariant>('v1');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from URL or localStorage
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    if (pathname === '/v1') {
      setVariantState('v1');
      localStorage.setItem(STORAGE_KEY, 'v1');
    } else if (pathname === '/v2') {
      setVariantState('v2');
      localStorage.setItem(STORAGE_KEY, 'v2');
    } else if (pathname === '/v3') {
      setVariantState('v3');
      localStorage.setItem(STORAGE_KEY, 'v3');
    } else {
      const saved = localStorage.getItem(STORAGE_KEY) as SiteVariant | null;
      if (saved === 'v1' || saved === 'v2' || saved === 'v3') {
        setVariantState(saved);
      }
    }
  }, [pathname]);

  const setVariant = (newVariant: SiteVariant) => {
    setVariantState(newVariant);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newVariant);
    }
    // If user is explicitly on a variant sub-route, navigate accordingly
    if (pathname === '/v1' || pathname === '/v2' || pathname === '/v3') {
      router.push(`/${newVariant}`);
    }
  };

  return (
    <VariantContext.Provider value={{ variant, setVariant, isMounted }}>
      {children}
    </VariantContext.Provider>
  );
}

export const useSiteVariant = () => useContext(VariantContext);

