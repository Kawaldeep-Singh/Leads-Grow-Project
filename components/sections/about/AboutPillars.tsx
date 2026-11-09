'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FiTrendingUp, FiLayers, FiZap, FiShield } from 'react-icons/fi';
import { HiSparkles, HiArrowNarrowRight } from 'react-icons/hi';

const pillars = [
  {
    id: '01',
    icon: FiTrendingUp,
    title: 'Data Over Dogma',
    tagline: 'Zero guesswork. Verifiable commercial ROI.',
    desc: 'We never guess what works. Every marketing budget and development sprint is tracked meticulously against customer acquisition cost (CAC), pipeline velocity, and return on investment. If a campaign doesn’t drive real revenue, it gets audited and retooled.',
    metric: '100%',
    metricLabel: 'Attributed Pipeline',
    gradient: 'from-[#16A34A] to-[#22C55E]',
  },
  {
    id: '02',
    icon: FiLayers,
    title: 'Full-Funnel Ownership',
    tagline: 'From first impression to signed contract.',
    desc: 'Traditional agencies hand you disconnected clicks and wash their hands. LeadsGrow unifies your brand story, high-converting ad campaigns, custom web/app landing funnels, and automated CRM pipelines into one continuous machine.',
    metric: 'End-to-End',
    metricLabel: 'Seamless Handoff',
    gradient: 'from-[#22C55E] to-[#B6F23D]',
  },
  {
    id: '03',
    icon: FiZap,
    title: 'High-Velocity Engineering',
    tagline: 'Built for speed, scalability, and high conversion.',
    desc: 'A slow website is a silent revenue killer. We build modern, lightweight digital platforms utilizing Next.js, React, and mobile architectures that load in under 1.2 seconds, boosting Core Web Vitals, organic search ranks, and immediate visitor conversions.',
    metric: '<1.2s',
    metricLabel: 'Core Web Vitals',
    gradient: 'from-[#B6F23D] to-[#16A34A]',
  },
  {
    id: '04',
    icon: FiShield,
    title: 'Radical Transparency',
    tagline: 'Live reporting dashboards. No hidden markups.',
    desc: 'You deserve absolute clarity on where your marketing capital goes. We provide real-time performance dashboards, regular transparent strategy reviews, and direct communication with senior growth strategists rather than generic account managers.',
    metric: '24/7',
    metricLabel: 'Live Dashboard Access',
    gradient: 'from-[#16A34A] to-[#15803D]',
  },
];

export function AboutPillars() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#0B0F0D] border-t border-[#1A2420]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[92%] sm:w-[85%] max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR PHILOSOPHY"
          plainText="Four Non-Negotiable Pillars Behind"
          highlightText="Every Win."
          subtext="The foundational principles that govern every strategy call, line of production code, and marketing rupee we deploy."
          align="center"
          theme="dark"
        />

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="group relative rounded-3xl bg-[#111815]/90 border border-[#1A2420] p-6 sm:p-8 hover:border-[#22C55E]/40 hover:bg-[#141C18] transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between overflow-hidden"
              >
                {/* Glow accent in corner on hover */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-2xl group-hover:bg-[#22C55E]/20 transition-all duration-300 pointer-events-none" />

                <div>
                  {/* Top Header: ID & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] group-hover:bg-[#16A34A] group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#5B6B63] uppercase tracking-wider">
                        Pillar {pillar.id}
                      </span>
                    </div>

                    {/* Metric pill */}
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-white font-mono">
                        {pillar.metric}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#9FB0A7] font-medium">
                        {pillar.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                    {pillar.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-[#22C55E] mb-4 flex items-center gap-1.5">
                    <HiSparkles className="h-3.5 w-3.5 shrink-0 text-[#B6F23D]" />
                    <span>{pillar.tagline}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-[#9FB0A7] leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom line accent */}
                <div className="pt-4 border-t border-[#1A2420] flex items-center justify-between text-xs text-[#5B6B63] group-hover:text-[#9FB0A7] transition-colors">
                  <span>Engineered for Maximum Impact</span>
                  <HiArrowNarrowRight className="h-4 w-4 text-[#22C55E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

