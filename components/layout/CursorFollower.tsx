'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const CursorFollower: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse/trackpad), not touch screens
    if (prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, [data-cursor]');
      const cursorData = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (cursorData) {
        setCursorText(cursorData);
        setIsPointer(true);
      } else if (interactiveEl) {
        setIsPointer(true);
        setCursorText('');
      } else {
        setIsPointer(false);
        setCursorText('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Outer ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorText ? 64 : isPointer ? 44 : 26,
          height: cursorText ? 64 : isPointer ? 44 : 26,
          borderColor: isPointer ? '#22C55E' : 'rgba(34, 197, 94, 0.45)',
          backgroundColor: isPointer ? 'rgba(22, 163, 74, 0.12)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="rounded-full border border-dashed flex items-center justify-center backdrop-blur-[1px]"
      >
        {cursorText && (
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#B6F23D]">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorText ? 0 : isPointer ? 0.6 : 1,
          opacity: cursorText ? 0 : 1,
        }}
        className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]"
      />
    </div>
  );
};

