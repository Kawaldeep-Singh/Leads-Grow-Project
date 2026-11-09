'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { BRAND } from '@/lib/constants';

interface AboutCTAProps {
  onOpenModal: () => void;
}

export function AboutCTA({ onOpenModal }: AboutCTAProps) {
  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    BRAND.whatsappMessage
  )}`;

  return (
    <section className="relative bg-[#0B0F0D] text-white py-24 sm:py-32 overflow-hidden border-t border-[#1A2420]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#16A34A]/20 via-[#22C55E]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[92%] sm:w-[85%] max-w-5xl mx-auto relative z-10 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16A34A]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#B6F23D] animate-ping" />
          <span>Partner with Category Leaders</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto"
        >
          Ready to Scale Your Brand with{' '}
          <span className="text-gradient">Predictable Certainty?</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-lg text-[#9FB0A7] max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Stop juggling fragmented agencies, empty promises, and unpredictable freelancers. Let’s engineer a unified marketing and technology engine that scales your revenue month after month.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={onOpenModal}
            className="group relative px-8 py-4 rounded-xl text-sm sm:text-base font-bold bg-[#16A34A] text-white hover:bg-[#15803D] transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <span>Book Free Strategy Consultation</span>
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 rounded-xl text-sm sm:text-base font-semibold border border-white/20 text-white hover:bg-white/5 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
          >
            <FaWhatsapp className="text-[#22C55E] h-5 w-5" />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>

        {/* Assurance Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-[#1A2420] flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#5B6B63] font-mono"
        >
          <span className="flex items-center gap-1.5">
            <HiSparkles className="text-[#22C55E] h-3.5 w-3.5" />
            Tailored Competitor Audit
          </span>
          <span className="flex items-center gap-1.5">
            <HiSparkles className="text-[#22C55E] h-3.5 w-3.5" />
            Zero Obligation or Pressure
          </span>
          <span className="flex items-center gap-1.5">
            <HiSparkles className="text-[#22C55E] h-3.5 w-3.5" />
            Senior Strategists Only
          </span>
        </motion.div>
      </div>
    </section>
  );
}

