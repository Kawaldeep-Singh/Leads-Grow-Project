'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import { FiTarget, FiEye, FiTrendingUp, FiAward } from 'react-icons/fi';

interface AboutHeroProps {
  onOpenConsultation?: () => void;
}

export function AboutHero({ onOpenConsultation }: AboutHeroProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24 bg-[#0B0F0D]">
      {/* ── Ambient Glow & Grid Backdrop ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-[#16A34A]/20 via-[#22C55E]/10 to-transparent rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#B6F23D]/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Subtle dot matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 w-[92%] sm:w-[88%] max-w-6xl mx-auto">
        {/* ── Top Header Block ── */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Pulsing Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#22C55E]/25 text-[#22C55E] text-xs font-mono uppercase tracking-wider mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span>About LeadsGrow™ • You Believe. We Achieve.</span>
          </motion.div>

          {/* Main H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6"
          >
            We Don’t Just Run Campaigns.{' '}
            <span className="text-gradient block sm:inline mt-1 sm:mt-0">
              We Engineer Predictable Growth.
            </span>
          </motion.h1>

          {/* Origin Story Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-sm sm:text-base md:text-lg text-[#9FB0A7] leading-relaxed max-w-3xl mb-8"
          >
            Founded with a singular conviction: scaling businesses don’t need more vanity metrics or disconnected agencies—they need high-intent qualified pipeline, high-converting digital products, and engineered revenue acceleration. Over 15+ years, LeadsGrow has evolved from an elite performance desk into a full-funnel digital powerhouse trusted by 250+ brands.
          </motion.p>

          {/* Quick Metrics Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
          >
            {[
              { label: '15+ Years Track Record', icon: FiAward },
              { label: '250+ Scaled Brands', icon: FiTrendingUp },
              { label: '4.9/5 Client Rating', icon: HiSparkles },
              { label: '100% Data-Driven ROI', icon: HiCheckCircle },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#111815]/80 border border-[#1A2420] text-white text-xs sm:text-sm font-semibold shadow-xs"
                >
                  <Icon className="text-[#22C55E] h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Interactive Mission & Vision Blueprint Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#141C18] to-[#0F1512] border border-[#22C55E]/20 p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/60 overflow-hidden"
        >
          {/* Subtle decorative background accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A34A]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Tab switcher and rich narrative */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Tab Selector */}
              <div className="inline-flex p-1 rounded-xl bg-[#0B0F0D] border border-[#1A2420] w-fit mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('mission')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'mission'
                      ? 'bg-[#16A34A] text-white shadow-[0_0_15px_rgba(34,197,94,0.35)]'
                      : 'text-[#9FB0A7] hover:text-white'
                  }`}
                >
                  <FiTarget className="h-4 w-4" />
                  <span>Our Mission</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('vision')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'vision'
                      ? 'bg-[#16A34A] text-white shadow-[0_0_15px_rgba(34,197,94,0.35)]'
                      : 'text-[#9FB0A7] hover:text-white'
                  }`}
                >
                  <FiEye className="h-4 w-4" />
                  <span>Our Vision</span>
                </button>
              </div>

              {/* Dynamic Tab Content */}
              {activeTab === 'mission' ? (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    To bridge the broken gap between traffic generation and real business revenue.
                  </h3>
                  <p className="text-sm sm:text-base text-[#9FB0A7] leading-relaxed">
                    Most marketing agencies stop when a lead clicks an ad. We take complete ownership from that initial click all the way through automated nurturing, conversion-optimized web platforms, and sales pipeline closure. Our mission is delivering verifiable return on capital for founders and enterprise leaders.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#B6F23D] font-mono font-medium">
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ Zero Vanity Metrics</span>
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ Qualified B2B & B2C Pipeline</span>
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ High-Speed Digital Architecture</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    To be the gold standard in full-stack business scaling across the globe.
                  </h3>
                  <p className="text-sm sm:text-base text-[#9FB0A7] leading-relaxed">
                    We envision a business ecosystem where growth isn’t left to guesswork, generic templates, or fractured freelancer teams. By combining battle-tested media buying, high-performance software engineering, and psychological brand design, LeadsGrow sets the new industry benchmark for end-to-end commercial growth.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#B6F23D] font-mono font-medium">
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ Global Market Reach</span>
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ AI-Enhanced Marketing Engines</span>
                    <span className="bg-[#1A2420] px-2.5 py-1 rounded-md">✦ Lifetime Commercial Partnerships</span>
                  </div>
                </div>
              )}

              {/* CTA link */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#22C55E] hover:text-[#B6F23D] transition-colors group cursor-pointer"
                >
                  <span>Explore our scaling methodology</span>
                  <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Right Column: High-Tech Blueprint Visual Card */}
            <div className="lg:col-span-5 bg-[#0B0F0D]/90 border border-[#1F2C25] rounded-2xl p-6 sm:p-7 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#1A2420] mb-4">
                <span className="text-xs font-mono text-[#5B6B63] uppercase tracking-wider">
                  The LeadsGrow Standard
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#22C55E] text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Active Engine
                </span>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    title: 'Multi-Channel Acquisition',
                    desc: 'Google Ads, Meta, LinkedIn & programmatic ads targeted with precision.',
                    stat: '3.8× Avg. ROAS',
                  },
                  {
                    title: 'Conversion Architecture',
                    desc: 'Fast, secure web & app platforms built for frictionless customer signups.',
                    stat: '<1.2s Load Speed',
                  },
                  {
                    title: 'Pipeline Automation',
                    desc: 'Automated WhatsApp, email, and CRM workflows that prevent lead drop-off.',
                    stat: '94% Nurture Rate',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#121915] border border-[#1A2420] hover:border-[#22C55E]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white">{row.title}</h4>
                      <span className="text-[11px] font-mono font-bold text-[#B6F23D]">
                        {row.stat}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#9FB0A7] leading-relaxed">
                      {row.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

