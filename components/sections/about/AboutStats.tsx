'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Counter } from '@/components/ui/Counter';
import { HiTrophy, HiUsers, HiChartBar, HiHeart } from 'react-icons/hi2';

const metrics = [
  {
    icon: HiTrophy,
    value: 15,
    suffix: '+',
    label: 'Years in Business',
    desc: 'Over a decade and a half of engineering profitable digital funnels.',
  },
  {
    icon: HiUsers,
    value: 250,
    suffix: '+',
    label: 'Brands Scaled',
    desc: 'From high-growth startups to enterprise real estate and SaaS.',
  },
  {
    icon: HiChartBar,
    value: 1200,
    suffix: 'k+',
    label: 'Qualified Leads',
    desc: 'High-intent B2B and B2C conversions delivered to sales teams.',
  },
  {
    icon: HiHeart,
    value: 98,
    suffix: '%',
    label: 'Client Retention',
    desc: 'Partners stay because our revenue metrics speak for themselves.',
  },
];

export function AboutStats() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#0E1411] border-t border-[#1A2420] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#16A34A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[92%] sm:w-[85%] max-w-6xl mx-auto relative z-10">
        <SectionHeading
          badge="VERIFIED IMPACT"
          plainText="Proven Numbers That Speak Louder Than"
          highlightText="Words."
          subtext="We evaluate our performance by the exact same metric you do: business growth and commercial ROI."
          align="center"
          theme="dark"
        />

        {/* Stats Card Container */}
        <div className="rounded-3xl bg-[#111815] border border-[#1A2420] p-6 sm:p-10 shadow-2xl shadow-black/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#1A2420]">
            {metrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`flex flex-col items-center text-center ${
                    idx > 0 ? 'pt-6 sm:pt-0 lg:pl-6' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0B0F0D] border border-[#1A2420] text-[#22C55E] flex items-center justify-center mb-4 shadow-sm hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
                    <Counter value={item.value} suffix={item.suffix} />
                  </div>

                  <div className="text-sm font-bold text-white mt-1">
                    {item.label}
                  </div>

                  <p className="text-xs text-[#9FB0A7] mt-1.5 max-w-[210px] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

