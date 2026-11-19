'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getRouteActiveNavKey, HOME_SCROLL_NAV_MAP, type ActiveNavKey } from '@/lib/nav';

export function useActiveNav() {
  const pathname = usePathname();
  const [homeActiveKey, setHomeActiveKey] = useState<ActiveNavKey>('Home');
  const previousKeyRef = useRef<ActiveNavKey | null>(null);
  const [pulseActiveKey, setPulseActiveKey] = useState<ActiveNavKey | null>(null);

  const routeKey = getRouteActiveNavKey(pathname);
  const activeKey = pathname === '/' ? homeActiveKey : routeKey;

  useEffect(() => {
    if (pathname !== '/') {
      setHomeActiveKey('Home');
      return;
    }

    const sections = HOME_SCROLL_NAV_MAP.flatMap(({ id, key }) => {
      const element = document.getElementById(id);
      return element ? [{ element, key }] : [];
    });
    if (!sections.length) return;

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight * 0.475)
          - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight * 0.475))[0];
      if (!visible) return;
      const nextKey = sections.find(({ element }) => element === visible.target)?.key;
      if (!nextKey) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => setHomeActiveKey(nextKey), 80);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(({ element }) => observer.observe(element));

    const checkTop = () => {
      if (window.scrollY <= 8) {
        if (debounceTimer) clearTimeout(debounceTimer);
        setHomeActiveKey('Home');
      }
    };
    window.addEventListener('scroll', checkTop, { passive: true });
    checkTop();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkTop);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (previousKeyRef.current === null) {
      previousKeyRef.current = activeKey;
      return;
    }
    if (activeKey && activeKey !== previousKeyRef.current) {
      previousKeyRef.current = activeKey;
      setPulseActiveKey(activeKey);
    }
  }, [activeKey]);

  const isHomeLocation = pathname === '/' && activeKey !== 'Home';
  const ariaCurrent: 'page' | 'location' | undefined = activeKey
    ? isHomeLocation ? 'location' : 'page'
    : undefined;
  return {
    activeKey,
    pulseActiveKey,
    ariaCurrent,
  };
}
