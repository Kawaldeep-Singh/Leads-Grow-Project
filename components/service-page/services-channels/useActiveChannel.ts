'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AUTO_CYCLE_MS = 4500;
const RESUME_DELAY_MS = 2000;

export function useActiveChannel(
  sectionRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
  rowsRef: RefObject<HTMLUListElement | null>,
  itemCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const activationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  const activate = useCallback((index: number) => {
    if (activationTimer.current) clearTimeout(activationTimer.current);
    activationTimer.current = setTimeout(() => {
      setActiveIndex(Math.max(0, Math.min(itemCount - 1, index)));
      activationTimer.current = null;
    }, 40);
  }, [itemCount]);

  const setInteraction = useCallback((busy: boolean) => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    if (busy) {
      setIsBusy(true);
      return;
    }
    resumeTimer.current = setTimeout(() => {
      setIsBusy(false);
      resumeTimer.current = null;
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const updatePointer = () => setIsTouchDevice(pointerQuery.matches || navigator.maxTouchPoints > 0);
    updatePointer();
    pointerQuery.addEventListener('change', updatePointer);
    const onVisibility = () => setIsPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => {
      pointerQuery.removeEventListener('change', updatePointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const pause = () => setInteraction(true);
    const resume = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && stage.contains(event.relatedTarget)) return;
      setInteraction(false);
    };
    stage.addEventListener('focusin', pause);
    stage.addEventListener('focusout', resume);
    return () => {
      stage.removeEventListener('focusin', pause);
      stage.removeEventListener('focusout', resume);
    };
  }, [stageRef, setInteraction]);

  useEffect(() => {
    if (!isTouchDevice) return;
    const list = rowsRef.current;
    if (!list) return;
    const buttons = Array.from(list.querySelectorAll<HTMLElement>('[data-channel-row]'));
    if (!buttons.length) return;
    const observer = new IntersectionObserver((entries) => {
      const nearest = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2)
          - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2))[0];
      if (!nearest) return;
      const index = buttons.indexOf(nearest.target as HTMLElement);
      if (index >= 0) setActiveIndex(index);
    }, { rootMargin: '-40% 0px -45% 0px', threshold: 0 });
    buttons.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [isTouchDevice, rowsRef]);

  const shouldAutoplay = !reducedMotion && !isTouchDevice && isInView && !isBusy && isPageVisible;
  useEffect(() => {
    if (!shouldAutoplay || itemCount < 2) return;
    const timer = setTimeout(() => setActiveIndex((current) => (current + 1) % itemCount), AUTO_CYCLE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, itemCount, shouldAutoplay]);

  useEffect(() => () => {
    if (activationTimer.current) clearTimeout(activationTimer.current);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  return {
    activeIndex,
    isInView,
    activate,
    setInteraction,
    reducedMotion,
    shouldAutoplay,
  };
}
