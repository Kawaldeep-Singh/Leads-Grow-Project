'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HiCheck, HiSparkles } from 'react-icons/hi';

const milestones = [
  {
    year: '2011',
    title: 'The Inception & First Growth Desks',
    desc: 'Founded with a clear focus on performance marketing and lead generation. While typical agencies sold vague impressions, LeadsGrow aligned directly with business revenue, serving regional SMBs and healthcare clinics in India.',
    metric: '50+ Initial Partners',
    highlight: 'Revenue-First Approach',
  },
  {
    year: '2016',
    title: 'Full-Stack Software & Web Expansion',
    desc: 'Recognizing that world-class ads fail when sent to slow, clunky websites, we established an in-house engineering team specializing in high-converting landing architectures, custom web applications, and fast mobile experiences.',
    metric: '100% In-House Dev',
    highlight: 'Zero Agency Handoff Gap',
  },
  {
    year: '2020',
    title: 'Crossing Borders & Enterprise Scale',
    desc: 'Expanded our operations internationally, scaling high-ticket lead pipelines and performance campaigns for clients across the United States, UAE, Singapore, and Australia in real estate, B2B SaaS, and e-commerce.',
    metric: '12 Global Markets',
    highlight: 'Cross-Border Ad Ops',
  },
  {
    year: '2023',
    title: 'Proprietary Automation & AI Qualification',
    desc: 'Engineered automated WhatsApp and CRM qualification workflows that nurture and filter leads within 60 seconds of form submission, tripling sales conversation conversion rates for our partner sales teams.',
    metric: '3× Lead-to-Call Rate',
    highlight: 'Instant CRM Dispatch',
  },
  {
    year: 'Today & Beyond',
    title: 'Category Dominance & Multi-Disciplinary Excellence',
    desc: 'A robust team of 40+ senior media buyers, full-stack engineers, UI/UX designers, and growth strategists managing multi-million-rupee monthly ad spends with an outstanding 98.4% client retention rate.',
    metric: '1.2M+ Leads Delivered',
    highlight: 'End-to-End Growth Engine',
  },
];

export function AboutTimeline() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#0E1411] border-t border-[#1A2420] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#16A34A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[92%] sm:w-[85%] max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR JOURNEY"
          plainText="15+ Years of Evolution,"
          highlightText="Milestones & Mastery."
          subtext="From humble beginnings to an award-winning growth partner for category leaders across the globe."
          align="center"
          theme="dark"
        />

        {/* Timeline Container */}
        <div className="relative mt-12 sm:mt-16">
          {/* Vertical Glowing Center Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#16A34A] via-[#22C55E] to-[#1A2420] opacity-40 hidden sm:block" />
          <div className="absolute left-4.5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#16A34A] via-[#22C55E] to-[#1A2420] opacity-40 sm:hidden" />

          {/* Timeline Nodes */}
          <div className="space-y-10 sm:space-y-16">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left / Right Content Box */}
                  <div className="w-full sm:w-[46%] pl-12 sm:pl-0">
                    <div className="p-6 sm:p-7 rounded-2xl bg-[#111815] border border-[#1A2420] hover:border-[#22C55E]/40 transition-all duration-300 shadow-xl shadow-black/40 group">
                      {/* Year badge & metric */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#22C55E] border border-[#22C55E]/20 text-xs font-mono font-bold">
                          <HiSparkles className="h-3 w-3 text-[#B6F23D]" />
                          {item.year}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-[#B6F23D] bg-black/40 px-2.5 py-1 rounded-md">
                          {item.metric}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#22C55E] transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#9FB0A7] leading-relaxed mb-4">
                        {item.desc}
                      </p>

                      <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5B6B63]">
                        <HiCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                        <span>{item.highlight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Node on desktop */}
                  <div className="absolute left-4.5 sm:left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#0B0F0D] border-2 border-[#22C55E] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B6F23D] animate-pulse" />
                  </div>

                  {/* Empty Spacer on other side for desktop */}
                  <div className="hidden sm:block sm:w-[46%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

