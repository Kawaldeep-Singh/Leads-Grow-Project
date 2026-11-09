'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FiTrendingUp, FiCode, FiCrosshair, FiPenTool } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const squadRoles = [
  {
    role: 'Performance Ad Strategists',
    subtitle: 'Paid Acquisition & Media Buying',
    icon: FiTrendingUp,
    description:
      'Senior media buyers who manage algorithmic bidding, custom audience segmentation, and multi-touch attribution across Google, Meta, and LinkedIn with zero budget wastage.',
    skills: ['Google Ads', 'Meta Ads', 'LinkedIn B2B', 'ROAS Optimization'],
    stat: '₹45Cr+ Ad Spend Managed',
  },
  {
    role: 'Full-Stack Web Architects',
    subtitle: 'Frontend & Cloud Engineering',
    icon: FiCode,
    description:
      'Engineers who construct lightweight, lightning-fast digital platforms using Next.js and modern cloud stacks, guaranteeing flawless Core Web Vitals and zero bounce rate.',
    skills: ['Next.js / React', 'TypeScript', 'Tailwind CSS', 'API Pipelines'],
    stat: '<1.2s Average Load Speed',
  },
  {
    role: 'Conversion & Funnel Specialists',
    subtitle: 'CRO & Lead Qualification Tech',
    icon: FiCrosshair,
    description:
      'Behavioral psychology experts who diagnose user drop-offs, optimize conversion flows, and build automated CRM funnels that convert visitors into scheduled meetings.',
    skills: ['A/B Testing', 'Heatmap Analysis', 'CRM Automation', 'WhatsApp Funnels'],
    stat: '3.4× Avg. Conversion Lift',
  },
  {
    role: 'Brand & Creative Directors',
    subtitle: 'Visual Identity & Ad Creatives',
    icon: FiPenTool,
    description:
      'Creative visualizers who craft thumb-stopping ad creatives, clear product value propositions, and sleek design systems that elevate your brand authority in your market.',
    skills: ['Motion Creatives', 'UI/UX Design', 'Brand Systems', 'Video Production'],
    stat: '250+ Brand Kits Delivered',
  },
];

export function AboutTeam() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[#0B0F0D] border-t border-[#1A2420]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[92%] sm:w-[85%] max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="OUR SPECIALISTS"
          plainText="Cross-Functional Minds Dedicated to"
          highlightText="Your Growth."
          subtext="No junior hand-offs or outsourced chaos. Work directly with senior specialists across performance ads, engineering, and visual design."
          align="center"
          theme="dark"
        />

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {squadRoles.map((member, idx) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="group relative rounded-3xl bg-[#111815] border border-[#1A2420] p-6 sm:p-8 hover:border-[#22C55E]/40 hover:bg-[#141C18] transition-all duration-300 shadow-xl shadow-black/40 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] group-hover:bg-[#16A34A] group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A2420] text-[#B6F23D] text-[11px] font-mono font-bold">
                      <HiSparkles className="h-3 w-3 text-[#22C55E]" />
                      {member.stat}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
                    {member.role}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-[#22C55E] mb-3">
                    {member.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-[#9FB0A7] leading-relaxed mb-6">
                    {member.description}
                  </p>
                </div>

                {/* Skill Chips */}
                <div className="pt-4 border-t border-[#1A2420] flex flex-wrap gap-2">
                  {member.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-[#0B0F0D] border border-[#1F2C25] text-[#9FB0A7] text-[11px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

