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
    <div className="relative z-10 w-[85%] mx-auto">
      {/* Section Heading */}
      <SectionHeading
        badge="Explore What We Offer"
        plainText="Complete Marketing Solutions."
        highlightText="All Under One Roof."
        subtext="Everything Your Business Needs to Grow."
        align="center"
        theme="light"
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
              className="group relative rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#16A34A]/50 hover:shadow-[0_16px_40px_rgba(22,163,74,0.14)]"
            >
              {/* Large Faded Outline Number in Background */}
              <span
                className="absolute -top-3 -right-2 text-7xl font-black select-none pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  WebkitTextStroke: '2px rgba(11, 15, 13, 0.25)',
                  color: 'transparent',
                }}
              >
                {service.id}
              </span>

              {/* Ambient hover glow gradient filling from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16A34A]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Top Bar: Number & Badge / Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#16A34A] bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#16A34A]/20">
                    {service.number}
                  </span>

                  {service.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#16A34A]/15 px-2 py-0.5 rounded-full border border-[#16A34A]/25">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Icon with rotation & scale on hover */}
                <div className="w-13 h-13 rounded-2xl bg-[#F6FAF7] border border-[#E2E8F0] text-[#16A34A] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#16A34A]/40 group-hover:bg-[#16A34A] group-hover:text-white shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-[#0B0F0D] group-hover:text-[#16A34A] transition-colors mb-2 leading-tight">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-[#5B6B63] leading-relaxed mb-5">
                  {service.shortDescription}
                </p>

                {/* Bullet list of Sub-services */}
                <ul className="space-y-2 border-t border-gray-100 pt-4 mb-6">
                  {service.subServices.map((sub, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#5B6B63] group-hover:text-[#0B0F0D] transition-all duration-200"
                      style={{
                        transform: 'translateX(0)',
                        transitionDelay: `${i * 20}ms`,
                      }}
                    >
                      <HiCheckCircle className="h-3.5 w-3.5 text-[#16A34A] shrink-0 opacity-80 group-hover:opacity-100" />
                      <span className="line-clamp-1">{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Service Link */}
              <div className="relative z-10 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#16A34A] hover:text-[#15803D] transition-colors cursor-pointer"
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
