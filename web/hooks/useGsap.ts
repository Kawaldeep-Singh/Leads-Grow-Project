'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useGsap(
  effect: (context: gsap.Context) => void | (() => void),
  deps: React.DependencyList = []
) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useIsomorphicLayoutEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      effectRef.current(ctx);
    });

    return () => ctx.revert();
  }, deps);
}

