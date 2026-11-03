'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { HiSparkles, HiArrowTrendingUp } from 'react-icons/hi2';
import { BRAND } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';

interface CTAProps {
  onOpenModal: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenModal }) => {
  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    BRAND.whatsappMessage
  )}`;

  const phrases = [
    { text: 'Want More Leads?', gradient: false },
    { text: 'More Sales?', gradient: false },
    { text: 'More Revenue?', gradient: false },
    { text: 'Bigger Growth?', gradient: true },
  ];

  return (
    <section
      id="cta"
      className="relative bg-[#0B0F0D] text-white py-28 sm:py-36 overflow-hidden bg-grid-pattern border-t border-[#1A2420]"
    >
      {/* Intense Glowing Radial Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-[#16A34A]/25 via-[#22C55E]/15 to-transparent rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#B6F23D]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Animated Geometric Shapes & Arrows */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 left-12 hidden lg:flex items-center gap-2 p-3 rounded-2xl bg-[#111815]/70 border border-[#1A2420] text-[#22C55E] backdrop-blur-md"
      >
        <HiArrowTrendingUp className="h-6 w-6 text-[#22C55E]" />
        <span className="text-xs font-bold font-mono text-white">Conversion +140%</span>
      </motion.div>

      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 right-16 hidden lg:flex items-center gap-2 p-3 rounded-2xl bg-[#111815]/70 border border-[#1A2420] text-[#B6F23D] backdrop-blur-md"
      >
        <HiSparkles className="h-6 w-6 text-[#B6F23D]" />
        <span className="text-xs font-bold font-mono text-white">Full-Funnel Automation</span>
      </motion.div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10 text-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16A34A]/20 border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#B6F23D] animate-ping" />
          <span>Transform Your Sales Pipeline</span>
        </motion.div>

        {/* Sequential 4-phrase H2 */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-8">
          {phrases.map((phrase, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.18 }}
              className={`inline-block mr-3 sm:mr-4 ${
                phrase.gradient ? 'text-gradient' : 'text-white'
              }`}
            >
              {phrase.text}
            </motion.span>
          ))}
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-base sm:text-xl text-[#9FB0A7] max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          Book a 30-minute tailored growth consultation. We analyze your competitors, calculate your projected CPL, and deliver an actionable execution roadmap.
        </motion.p>

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Main Magnetic Glowing CTA Button */}
          <MagneticButton onClick={onOpenModal}>
            <Button
              variant="glow"
              size="lg"
              className="text-base sm:text-lg px-9 py-4 font-black shadow-[0_0_35px_rgba(34,197,94,0.55)] border border-[#22C55E]"
            >
              <span className="flex items-center gap-3">
                Let&apos;s Talk LeadsGrow!
                <HiSparkles className="h-5 w-5 text-[#B6F23D]" />
              </span>
            </Button>
          </MagneticButton>

          {/* Secondary WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-[#111815] border border-[#25D366]/40 text-white font-bold text-sm sm:text-base hover:bg-[#25D366]/10 hover:border-[#25D366] transition-all duration-300"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>

        {/* Guarantee notes */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5B6B63]">
          <span>✓ 100% Free Consultation</span>
          <span>✓ No Long-Term Contracts Required</span>
          <span>✓ Dedicated Performance Team</span>
        </div>
      </div>
    </section>
  );
};

