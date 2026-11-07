'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBolt, HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import { servicesData } from '@/data/services';
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
    <div className="relative z-10 w-[85%] mx-auto">
      {/* Switch Component Slot */}
      {switchComponent && (
        <div className="flex justify-center -mt-6 sm:-mt-8 mb-12 sm:mb-16">
          {switchComponent}
        </div>
      )}

      {/* Dynamic Grid: Centered gracefully depending on number of filtered cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-300 ${
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
