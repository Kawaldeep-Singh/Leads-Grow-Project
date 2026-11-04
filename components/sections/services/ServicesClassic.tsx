'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiBolt, HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import { servicesData } from '@/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { serviceIcons } from './serviceIcons';

export interface ServicesClassicProps {
  onSelectService: (serviceTitle: string) => void;
  switchComponent?: React.ReactNode;
}

export const ServicesClassic: React.FC<ServicesClassicProps> = ({
  onSelectService,
  switchComponent,
}) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
      {/* Section Heading */}
      <SectionHeading
        badge="Explore What We Offer"
        plainText="Complete Marketing Solutions."
        highlightText="All Under One Roof."
        subtext="Everything Your Business Needs to Grow."
        align="center"
        theme="dark"
      />

      {/* Switch Component Slot */}
      {switchComponent && (
        <div className="flex justify-center -mt-6 sm:-mt-8 mb-12 sm:mb-16">
          {switchComponent}
        </div>
      )}

      {/* 8 Numbered Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicesData.map((service, index) => {
          const Icon = serviceIcons[service.iconKey] || HiBolt;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              data-cursor-text="View"
              className="group relative rounded-3xl bg-[#111815] border border-[#1A2420] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#22C55E]/50 hover:shadow-[0_10px_35px_rgba(22,163,74,0.18)]"
            >
              {/* Large Faded Outline Number in Background */}
              <span
                className="absolute -top-3 -right-2 text-7xl font-black select-none pointer-events-none opacity-5 group-hover:opacity-15 transition-opacity duration-300"
                style={{
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)',
                  color: 'transparent',
                }}
              >
                {service.id}
              </span>

              {/* Ambient hover glow gradient filling from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16A34A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Top Bar: Number & Badge / Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#22C55E] bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#16A34A]/20">
                    {service.number}
                  </span>

                  {service.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B6F23D] bg-[#B6F23D]/10 px-2 py-0.5 rounded-full border border-[#B6F23D]/25">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Icon with rotation & scale on hover */}
                <div className="w-13 h-13 rounded-2xl bg-[#0B0F0D] border border-[#1A2420] text-[#22C55E] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#22C55E]/40 group-hover:bg-[#16A34A]/20 shadow-md">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-white group-hover:text-[#22C55E] transition-colors mb-2 leading-tight">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-[#9FB0A7] leading-relaxed mb-5">
                  {service.shortDescription}
                </p>

                {/* Bullet list of Sub-services */}
                <ul className="space-y-2 border-t border-[#1A2420] pt-4 mb-6">
                  {service.subServices.map((sub, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#9FB0A7] group-hover:text-white transition-all duration-200"
                      style={{
                        transform: 'translateX(0)',
                        transitionDelay: `${i * 20}ms`,
                      }}
                    >
                      <HiCheckCircle className="h-3.5 w-3.5 text-[#22C55E] shrink-0 opacity-70 group-hover:opacity-100" />
                      <span className="line-clamp-1">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Service Link */}
              <div className="relative z-10 pt-2 border-t border-[#1A2420]/60">
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#22C55E] group-hover:text-[#B6F23D] transition-colors cursor-pointer"
                >
                  <span>Explore Service</span>
                  <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

