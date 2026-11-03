'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiSparkles, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { BRAND } from '@/lib/constants';

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

  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    BRAND.whatsappMessage
  )}`;

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed z-40 pointer-events-none inset-x-0 bottom-0 p-4 sm:p-6 flex justify-between items-end">
          {/* WhatsApp Button (Bottom-Left) */}
          <div>
            
          </div>
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.5, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="pointer-events-auto relative group"
          >
            
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-60 animate-ping duration-1000" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:scale-105 transition-all duration-300"
            >
              <FaWhatsapp className="h-6 w-6" />
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                Chat on WhatsApp
              </span>
            </a>
          </motion.div> */}

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
              className="relative flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] border border-[#22C55E]/60 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#16A34A]/40 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all duration-300 cursor-pointer"
            >
              <HiSparkles className="h-4 w-4 text-[#B6F23D] animate-spin" style={{ animationDuration: '4s' }} />
              <span>Get Free Consultation</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

