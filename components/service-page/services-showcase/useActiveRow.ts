'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useActiveRow(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerOnList, setPointerOnList] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activate = useCallback((index: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setActiveIndex(Math.max(0, Math.min(count - 1, index))), 40);
  }, [count]);

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-showcase-row]'));
    if (!rows.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (pointerOnList) return;
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2)
          - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2))[0];
      if (visible) setActiveIndex(Number((visible.target as HTMLElement).dataset.index));
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [pointerOnList]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { activeIndex, setActiveIndex, activate, pointerOnList, setPointerOnList };
}
