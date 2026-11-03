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

export const Stats: React.FC = () => {
  return (
    <section id="stats" className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-5 sm:px-8">
      {/* Light Glass/Solid Card Container on dark/light boundary */}
      <div className="rounded-3xl bg-white shadow-2xl shadow-black/10 border border-[#E2E8F0] p-6 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
          {statsData.map((stat, index) => {
            const Icon = iconMap[stat.iconName] || HiRocketLaunch;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col items-center text-center ${
                  index > 0 ? 'pt-6 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                {/* Icon Pill */}
                <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Animated Stat Value with suffix */}
                <div className="text-4xl sm:text-5xl font-black text-[#0B0F0D] tracking-tight mb-1">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-sm font-bold text-[#0B0F0D] mt-1">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="text-xs text-[#5B6B63] mt-1.5 max-w-[200px] leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

