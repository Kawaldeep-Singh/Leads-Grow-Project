'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';

interface FloatingWidgetsProps {
  onOpenConsultation: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = ({ onOpenConsultation }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Appear after 3s as specified
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed z-40 pointer-events-none inset-x-0 bottom-0 flex items-end justify-end px-[calc(1rem_+_env(safe-area-inset-right))] pt-4 pb-[calc(1rem_+_env(safe-area-inset-bottom))] sm:px-[calc(1.5rem_+_env(safe-area-inset-right))] sm:pt-6 sm:pb-[calc(1.5rem_+_env(safe-area-inset-bottom))]">
          {/* Floating variant switcher temporarily disabled. */}
          {/* <VariantToggle mode="floating" /> */}

          {/* Consultation Button (Bottom-Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="pointer-events-auto relative group"
          >
            {/* Pulse ring */}
            <span className="absolute -inset-1 rounded-full bg-[#22C55E] opacity-30 group-hover:opacity-60 animate-pulse duration-1000" />
            <button
              onClick={onOpenConsultation}
              className="relative flex min-h-11 items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] border border-[#22C55E]/60 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#16A34A]/40 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all duration-300 cursor-pointer"
            >
              {/* <HiSparkles className="h-4 w-4 text-[#16A34A] animate-spin" style={{ animationDuration: '4s' }} /> */}
              <span>Get Free Consultation</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


