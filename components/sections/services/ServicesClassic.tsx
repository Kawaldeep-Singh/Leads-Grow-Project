'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBolt, HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import { servicesData } from '@/data/services';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { serviceIcons } from './serviceIcons';

export type ServiceCategory = 'all' | 'leads' | 'development' | 'design';

export interface ServicesClassicProps {
  onSelectService: (serviceTitle: string) => void;
  switchComponent?: React.ReactNode;
  theme?: 'dark' | 'light';
  activeCategory?: ServiceCategory;
}

export const ServicesClassic: React.FC<ServicesClassicProps> = ({
  onSelectService,
  switchComponent,
  theme = 'dark',
  activeCategory = 'all',
}) => {
  const isLight = theme === 'light';
  const prefersReducedMotion = useReducedMotion();

  // Filter services by category
  const filteredServices = servicesData.filter((service) => {
    if (!activeCategory || activeCategory === 'all') return true;
    if (activeCategory === 'leads') {
      return (
        service.iconKey === 'digital-marketing' ||
        service.iconKey === 'lead-gen' ||
        service.iconKey === 'performance' ||
        service.iconKey === 'automation' ||
        service.iconKey === 'offline'
      );
    }
    if (activeCategory === 'development') {
      return service.iconKey === 'web-dev' || service.iconKey === 'app-dev';
    }
    if (activeCategory === 'design') {
      return service.iconKey === 'design';
    }
    return true;
  });

  return (
    <div className="relative z-10 w-full overflow-hidden py-5 sm:py-8">
      {/* Soft ambient motion gives the full services area a little depth. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(22,163,74,0.08),transparent_58%)]" />
        <motion.div
          className={`absolute -top-28 left-[8%] h-72 w-72 rounded-full blur-3xl ${isLight ? 'bg-[#22C55E]/[0.07]' : 'bg-[#22C55E]/[0.08]'}`}
          animate={prefersReducedMotion ? undefined : { x: [0, 50, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-[38%] -right-24 h-80 w-80 rounded-full blur-3xl ${isLight ? 'bg-[#16A34A]/[0.05]' : 'bg-[#16A34A]/[0.07]'}`}
          animate={prefersReducedMotion ? undefined : { x: [0, -45, 0], y: [0, 45, 0], scale: [1.08, 1, 1.08] }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 21, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={`absolute inset-0 opacity-[0.035] ${isLight ? 'text-[#0B0F0D]' : 'text-white'}`} style={{ backgroundImage: 'radial-gradient(currentColor 0.7px, transparent 0.8px)', backgroundSize: '26px 26px', maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)' }} />
      </div>

      {/* Switch Component Slot */}
      {switchComponent && (
        <div className="relative z-10 flex justify-center -mt-6 sm:-mt-8 mb-12 sm:mb-16">
          {switchComponent}
        </div>
      )}

      {/* Dynamic Grid: Centered gracefully depending on number of filtered cards */}
      <div
        className={`relative z-10 w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300 ${
          filteredServices.length >= 4
            ? 'lg:grid-cols-4'
            : filteredServices.length === 3
            ? 'lg:grid-cols-3 max-w-5xl mx-auto'
            : filteredServices.length === 2
            ? 'lg:grid-cols-2 max-w-3xl mx-auto'
            : 'lg:grid-cols-1 max-w-md mx-auto'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service, index) => {
            const Icon = serviceIcons[service.iconKey] || HiBolt;

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -8 }}
                data-cursor-text="View"
                className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                isLight
                  ? 'bg-white border border-gray-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#22C55E] hover:shadow-[0_14px_35px_rgba(22,197,94,0.18)]'
                  : 'bg-[#111815] border border-[#1A2420] hover:border-[#22C55E]/50 hover:shadow-[0_10px_35px_rgba(22,163,74,0.18)]'
              }`}
            >
              {/* Quiet card texture and service icon watermark */}
              <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                  className={`absolute -top-16 -right-12 h-48 w-48 rounded-full ${
                    isLight
                      ? 'bg-[radial-gradient(circle,rgba(34,197,94,0.13),transparent_70%)]'
                      : 'bg-[radial-gradient(circle,rgba(34,197,94,0.09),transparent_70%)]'
                  }`}
                />
                <motion.div
                  className={`absolute right-5 top-14 h-24 w-24 rounded-full border ${
                    isLight ? 'border-[#0B0F0D]/[0.08]' : 'border-white/[0.08]'
                  }`}
                  initial={{ scale: 0.96, opacity: 0.32 }}
                  whileInView={prefersReducedMotion ? undefined : { scale: 1.06, opacity: 0.58 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 5.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.16 }}
                  viewport={{ once: false, amount: 0.2 }}
                />
                <motion.div
                  className={`absolute right-9 top-[4.5rem] h-16 w-16 rounded-full border ${
                    isLight ? 'border-[#16A34A]/[0.07]' : 'border-[#22C55E]/[0.08]'
                  }`}
                  initial={{ scale: 1, opacity: 0.28 }}
                  whileInView={prefersReducedMotion ? undefined : { scale: 1.12, opacity: 0.55 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 4.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.16 + 0.35 }}
                  viewport={{ once: false, amount: 0.2 }}
                />
                <div
                  className={`absolute inset-0 opacity-[0.06] ${
                    isLight ? 'text-[#0B0F0D]' : 'text-white'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(currentColor 0.75px, transparent 0.85px)',
                    backgroundSize: '16px 16px',
                    maskImage: 'linear-gradient(135deg, transparent 25%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(135deg, transparent 25%, black 100%)',
                  }}
                />
                <motion.div
                  className={`absolute right-7 top-[4.25rem] ${isLight ? 'text-[#0B0F0D]' : 'text-white'}`}
                  initial={{ y: 0, rotate: 8, opacity: 0.045 }}
                  whileInView={prefersReducedMotion ? undefined : { y: -5, rotate: 12, opacity: 0.075 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Icon className="h-[4.5rem] w-[4.5rem] drop-shadow-[0_0_10px_rgba(22,163,74,0.12)]" />
                </motion.div>
                <motion.svg
                  viewBox="0 0 180 170"
                  fill="none"
                  aria-hidden="true"
                  className={`absolute -right-3 top-[34%] h-40 w-40 ${isLight ? 'text-[#0B0F0D]' : 'text-white'}`}
                  initial={{ y: 0, opacity: 0.13 }}
                  whileInView={prefersReducedMotion ? undefined : { y: -5, opacity: 0.21 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 6.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: index * 0.18 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <path d="M171 17 135 35 148 54 105 75 116 96 76 119 52 126 19 153" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1.5" strokeDasharray="4 7" />
                  <motion.path
                    d="M171 17 135 35 148 54 105 75 116 96 76 119 52 126 19 153"
                    stroke="#22C55E"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                    strokeDasharray="4 7"
                    initial={{ strokeDashoffset: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { strokeDashoffset: -33 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: 'linear', delay: index * 0.18 }}
                    viewport={{ once: false, amount: 0.2 }}
                  />
                  <circle cx="135" cy="35" r="3" fill="#22C55E" fillOpacity="0.45" />
                  <circle cx="105" cy="75" r="2.5" fill="currentColor" fillOpacity="0.32" />
                  <circle cx="76" cy="119" r="3" fill="#22C55E" fillOpacity="0.4" />
                  <rect x="106" y="123" width="8" height="30" rx="2" fill="currentColor" fillOpacity="0.14" />
                  <rect x="121" y="111" width="8" height="42" rx="2" fill="currentColor" fillOpacity="0.16" />
                  <rect x="136" y="98" width="8" height="55" rx="2" fill="#22C55E" fillOpacity="0.16" />
                  <rect x="151" y="84" width="8" height="69" rx="2" fill="currentColor" fillOpacity="0.14" />
                </motion.svg>
                <div className={`absolute left-7 top-0 h-px w-28 bg-gradient-to-r from-transparent ${isLight ? 'via-[#0B0F0D]/20' : 'via-white/20'} to-[#22C55E]/30`} />
              </div>

              {/* Large Faded Outline Number in Background */}
              <span
                className="absolute -top-3 -right-2 text-7xl font-black select-none pointer-events-none opacity-5 group-hover:opacity-15 transition-opacity duration-300"
                style={{
                  WebkitTextStroke: isLight ? '2px rgba(0, 0, 0, 0.1)' : '2px rgba(255, 255, 255, 0.4)',
                  color: 'transparent',
                }}
              >
                {service.id}
              </span>

              {/* Ambient hover glow gradient filling from bottom */}
              <div
                className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  isLight ? 'from-[#16A34A]/8' : 'from-[#16A34A]/10'
                }`}
              />

              <div className="relative z-10">
                {/* Top Bar: Number & Badge / Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                      isLight
                        ? 'text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/25'
                        : 'text-[#22C55E] bg-[#16A34A]/10 border-[#16A34A]/20'
                    }`}
                  >
                    {service.number}
                  </span>

                  {service.badge && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isLight
                          ? 'text-[#15803D] bg-[#16A34A]/15 border-[#16A34A]/30'
                          : 'text-[#B6F23D] bg-[#B6F23D]/10 border-[#B6F23D]/25'
                      }`}
                    >
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Icon with rotation & scale on hover */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md ${
                    isLight
                      ? 'bg-[#F0FDF4] border border-[#22C55E]/30 text-[#16A34A] group-hover:border-[#22C55E]/60 group-hover:bg-[#16A34A]/15'
                      : 'bg-[#0B0F0D] border border-[#1A2420] text-[#22C55E] group-hover:border-[#22C55E]/40 group-hover:bg-[#16A34A]/20'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-extrabold mb-2 leading-tight transition-colors ${
                    isLight
                      ? 'text-[#0B0F0D] group-hover:text-[#16A34A]'
                      : 'text-white group-hover:text-[#22C55E]'
                  }`}
                >
                  {service.title}
                </h3>

                {/* Short Description */}
                <p
                  className={`text-xs leading-relaxed mb-5 ${
                    isLight ? 'text-[#4B5563]' : 'text-[#9FB0A7]'
                  }`}
                >
                  {service.shortDescription}
                </p>

                {/* Bullet list of Sub-services */}
                <ul
                  className={`space-y-2 border-t pt-4 mb-6 ${
                    isLight ? 'border-gray-100' : 'border-[#1A2420]'
                  }`}
                >
                  {service.subServices.map((sub, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                        isLight
                          ? 'text-[#4B5563] group-hover:text-[#0B0F0D]'
                          : 'text-[#9FB0A7] group-hover:text-white'
                      }`}
                      style={{
                        transform: 'translateX(0)',
                        transitionDelay: `${i * 20}ms`,
                      }}
                    >
                      <HiCheckCircle
                        className={`h-3.5 w-3.5 shrink-0 opacity-80 group-hover:opacity-100 ${
                          isLight ? 'text-[#16A34A]' : 'text-[#22C55E]'
                        }`}
                      />
                      <span className="line-clamp-1">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Service Link */}
              <div
                className={`relative z-10 pt-2 border-t ${
                  isLight ? 'border-gray-100' : 'border-[#1A2420]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className={`inline-flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                    isLight
                      ? 'text-[#16A34A] group-hover:text-[#15803D]'
                      : 'text-[#22C55E] group-hover:text-[#B6F23D]'
                  }`}
                >
                  <span>Explore Service</span>
                  <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServicesClassic;
