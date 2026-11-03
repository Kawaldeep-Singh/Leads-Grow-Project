'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarqueeProps {
  items: string[];
  baseVelocity?: number;
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
  separator?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  baseVelocity = 1.0,
  direction = 'left',
  className = '',
  itemClassName = '',
  separator = '✦',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(direction === 'right' ? -50 : 0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 300,
  });

  // Clamp velocity factor so scrolling only gives a very subtle, gentle nudge without zooming
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 0.4], {
    clamp: true,
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const effectiveSpeed = direction === 'left' ? -baseVelocity : baseVelocity;

  useEffect(() => {
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let prevTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - prevTime) / 1000;
      prevTime = currentTime;

      if (!isHovered) {
        const vel = velocityFactor.get();
        const scrollBoost = vel * (direction === 'left' ? -1 : 1);
        // Clean, smooth, readable speed without multiplier
        const moveBy = (effectiveSpeed + scrollBoost) * delta;
        let currentX = baseX.get() + moveBy;

        // Wrap loop smoothly around -50% to 0%
        if (currentX <= -50) {
          currentX = 0;
        } else if (currentX >= 0 && direction === 'right') {
          currentX = -50;
        }

        baseX.set(currentX);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [baseX, effectiveSpeed, isHovered, direction, prefersReducedMotion, velocityFactor]);

  // Repeat the items list multiple times to fill width seamlessly
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`overflow-hidden whitespace-nowrap select-none flex ${className}`}
    >
      <motion.div style={{ x }} className="flex shrink-0 items-center gap-6">
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            <span className={itemClassName}>{item}</span>
            <span className="text-[#B6F23D] opacity-80 text-sm select-none">{separator}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
