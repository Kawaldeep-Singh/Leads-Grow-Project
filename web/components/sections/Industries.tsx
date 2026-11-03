'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaWifi,
  FaShoppingBag,
  FaUserTie,
  FaHeartbeat,
  FaGraduationCap,
  FaStore,
  FaLaptopCode,
} from 'react-icons/fa';
import { HiArrowUpRight } from 'react-icons/hi2';
import { industriesData } from '@/data/industries';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Marquee } from '@/components/ui/Marquee';

const industryIcons: Record<string, React.ElementType> = {
  FaHome,
  FaWifi,
  FaShoppingBag,
  FaUserTie,
  FaHeartbeat,
  FaGraduationCap,
  FaStore,
  FaLaptopCode,
};

interface IndustriesProps {
  onSelectIndustry: (name: string) => void;
}

export const Industries: React.FC<IndustriesProps> = ({ onSelectIndustry }) => {
  const industryNames = industriesData.map((ind) => ind.name);

  return (
    <section
      id="industries"
      className="relative bg-white py-24 sm:py-32 overflow-hidden"
    >
      {/* 2-Row Infinite Marquee Behind Grid as Texture - slow ambient motion */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 opacity-[0.035] pointer-events-none select-none overflow-hidden">
        <Marquee
          items={industryNames}
          baseVelocity={0.6}
          direction="left"
          separator="•"
          itemClassName="text-6xl sm:text-8xl font-black uppercase tracking-tight text-[#0B0F0D]"
        />
        <Marquee
          items={[...industryNames].reverse()}
          baseVelocity={0.6}
          direction="right"
          separator="•"
          itemClassName="text-6xl sm:text-8xl font-black uppercase tracking-tight text-[#0B0F0D]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="Industries"
          plainText="Growing Businesses"
          highlightText="Across Industries."
          subtext="Domain-specific growth funnels optimized for high ticket and high volume conversion."
          align="center"
          theme="light"
        />

        {/* 8 Industries Interactive Grid (4 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industriesData.map((industry, index) => {
            const Icon = industryIcons[industry.iconName] || FaStore;

            return (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelectIndustry(industry.name)}
                data-cursor-text="Grow"
                className="group relative rounded-3xl bg-[#F6FAF7] border border-gray-200/90 p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:bg-[#111815] hover:border-[#16A34A] hover:shadow-2xl cursor-pointer min-h-[235px]"
              >
                {/* Top: Icon & Stat Badge (Standardized baseline & 1-line badge) */}
                <div className="flex items-center justify-between gap-2.5 mb-4 h-12">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#22C55E] flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#16A34A] bg-[#16A34A]/10 group-hover:bg-[#22C55E]/20 group-hover:text-[#B6F23D] px-3 py-1.5 rounded-full transition-colors border border-[#16A34A]/20 whitespace-nowrap shrink-0 text-center">
                    {industry.statBadge}
                  </span>
                </div>

                {/* Middle: Industry Title & Benefit (Uniform Heights) */}
                <div className="flex-1 flex flex-col justify-center my-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0B0F0D] group-hover:text-white transition-colors leading-snug min-h-[2.5rem] flex items-center">
                    {industry.name}
                  </h3>

                  {/* Benefit microcopy */}
                  <p className="text-xs text-[#5B6B63] group-hover:text-[#9FB0A7] transition-colors mt-2 leading-relaxed line-clamp-2 min-h-[2rem]">
                    {industry.benefit}
                  </p>
                </div>

                {/* Bottom Arrow Cue */}
                <div className="mt-4 pt-3 border-t border-gray-200/80 group-hover:border-[#1A2420] flex items-center justify-between text-xs text-[#16A34A] group-hover:text-[#22C55E] transition-colors">
                  <span className="font-semibold text-[11px] group-hover:text-white">
                    Explore Playbook
                  </span>
                  <HiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
