'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  HiClock,
  HiUsers,
  HiRocketLaunch,
  HiBuildingOffice2,
} from 'react-icons/hi2';
import { statsData } from '@/data/stats';
import { Counter } from '@/components/ui/Counter';

const iconMap: Record<string, React.ElementType> = {
  FaHistory: HiClock,
  FaUsers: HiUsers,
  FaBullhorn: HiRocketLaunch,
  FaBuilding: HiBuildingOffice2,
};

interface StatsProps {
  overlap?: boolean;
  className?: string;
}

export const Stats: React.FC<StatsProps> = ({ overlap = false, className = '' }) => {
  return (
    <section
      id="stats"
      className={`relative z-20 w-full bg-[#0B0F0D] py-16 sm:py-24 overflow-hidden ${
        overlap ? '-translate-y-1/2 -mb-20 sm:-mb-24 lg:-mb-28 z-30' : ''
      } ${className}`}
    >
      {/* Ambient background glow & subtle grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A2420_1px,transparent_1px),linear-gradient(to_bottom,#1A2420_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="w-[88%] sm:w-[85%] mx-auto relative z-10">
        {/* Section Header: "You Believe. We Achieve." */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#22C55E]/25 text-[#22C55E] text-xs font-mono uppercase tracking-wider mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span>Proven Track Record</span>
          </motion.div>

          {/* Main Title: You Believe. We Achieve. */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-3"
          >
            You Believe.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#B6F23D] drop-shadow-[0_0_25px_rgba(34,197,94,0.4)]">
              We Achieve.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xs sm:text-sm md:text-base text-[#9FB0A7] max-w-xl mx-auto leading-relaxed"
          >
            Measurable growth architecture that transforms ambitious vision into market-dominating numbers.
          </motion.p>
        </div>

        {/* 4 Stats Cards Container */}
        <div className="rounded-3xl bg-[#111815]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(22,163,74,0.1)] border border-[#1A2420] p-6 sm:p-8 lg:p-12 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#1A2420]">
            {statsData.map((stat, index) => {
              const Icon = iconMap[stat.iconName] || HiRocketLaunch;

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group flex flex-col items-center text-center transition-colors ${
                    index > 0 ? 'pt-8 sm:pt-0 lg:pl-6' : ''
                  }`}
                >
                  {/* Icon Pill */}
                  <div className="w-14 h-14 rounded-2xl bg-[#0B0F0D] border border-[#1A2420] text-[#22C55E] flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:border-[#22C55E]/50 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Animated Stat Value with suffix */}
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-1 group-hover:text-[#B6F23D] transition-colors">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-sm sm:text-base font-bold text-white mt-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#9FB0A7] mt-1.5 max-w-[210px] leading-relaxed">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
