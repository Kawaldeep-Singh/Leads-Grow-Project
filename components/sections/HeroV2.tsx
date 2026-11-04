'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSparkles,
  HiArrowRight,
  HiCheckCircle,
  HiBolt,
  HiClock,
  HiUsers,
  HiRocketLaunch,
  HiBuildingOffice2,
  HiSquares2X2,
  HiCube,
} from 'react-icons/hi2';
import { servicesData, ServiceItem } from '@/data/services';
import { serviceIcons } from './services/serviceIcons';
import { statsData } from '@/data/stats';
import { Counter } from '@/components/ui/Counter';
import { Button } from '@/components/ui/Button';
import { Services3D } from './services/Services3D';

interface HeroV2Props {
  onOpenConsultation?: () => void;
  onSelectService: (serviceTitle: string) => void;
}

type ServiceCategory = 'all' | 'marketing' | 'development' | 'creative';

const statsIconMap: Record<string, React.ElementType> = {
  FaHistory: HiClock,
  FaUsers: HiUsers,
  FaBullhorn: HiRocketLaunch,
  FaBuilding: HiBuildingOffice2,
};

export function HeroV2({ onOpenConsultation, onSelectService }: HeroV2Props) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [displayMode, setDisplayMode] = useState<'grid' | '3d'>('grid');

  // Filter services by category
  const filteredServices = servicesData.filter((svc) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'marketing') {
      return ['01', '05', '06'].includes(svc.id); // Digital Mkt, Performance Ads, Lead Gen
    }
    if (activeCategory === 'development') {
      return ['02', '03', '07'].includes(svc.id); // Web, App, Automation
    }
    if (activeCategory === 'creative') {
      return ['04', '08'].includes(svc.id); // Creative, Offline Mkt
    }
    return true;
  });

  const categories = [
    { key: 'all' as ServiceCategory, label: 'All Services (8)' },
    { key: 'marketing' as ServiceCategory, label: 'Performance & Leads' },
    { key: 'development' as ServiceCategory, label: 'Web & App Engineering' },
    { key: 'creative' as ServiceCategory, label: 'Creative & Automation' },
  ];

  return (
    <section
      id="hero"
      className="relative bg-[#0B0F0D] text-white pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 overflow-hidden"
    >
      {/* ── AMBIENT COSMIC BACKGROUND ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#16A34A]/12 rounded-full blur-[240px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[#B6F23D]/6 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      {/* ── 1. HERO HEADER INTRO FOLD ── */}
      <div className="relative z-10 w-[85%] mx-auto text-center mb-16 lg:mb-20">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16A34A]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-mono uppercase tracking-wider mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
          </span>
          <span>Full-Service Growth Agency • All Capabilities</span>
        </motion.div>

        {/* Big Impact Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto mb-6"
        >
          Scale Your Business with{' '}
          <span className="text-gradient">End-to-End Growth Services.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-[#9FB0A7] max-w-3xl mx-auto leading-relaxed mb-10 font-normal"
        >
          From high-ticket B2B lead generation and precision Google/Meta ads to custom web apps and full marketing automation — explore our 8 battle-tested growth engines.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Button
            variant="glow"
            size="lg"
            withArrow
            onClick={onOpenConsultation}
          >
            Get Free Growth Audit
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              const el = document.getElementById('services-grid-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore 8 Services Below
          </Button>
        </motion.div>

        {/* Live Trust Badges Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-mono text-[#9FB0A7]"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            <span><strong className="text-white">50L+</strong> Leads Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B6F23D]" />
            <span><strong className="text-white">5,000+</strong> Campaigns Run</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            <span><strong className="text-white">15+ Years</strong> Marketing Leadership</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B6F23D]" />
            <span><strong className="text-white">98%</strong> Client Retention Rate</span>
          </div>
        </motion.div>
      </div>

      {/* ── 2. INTEGRATED STATS METRICS BAR ── */}
      <div className="relative z-10 w-[85%] mx-auto mb-20 lg:mb-28">
        <div className="rounded-3xl bg-[#111815]/90 border border-[#1A2420] shadow-2xl shadow-black/60 p-6 sm:p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#1A2420]">
            {statsData.map((stat, index) => {
              const Icon = statsIconMap[stat.iconName] || HiRocketLaunch;

              return (
                <div
                  key={stat.id}
                  className={`flex flex-col items-center text-center ${
                    index > 0 ? 'pt-6 sm:pt-0 lg:pl-6' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 text-[#22C55E] border border-[#22C55E]/20 flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {stat.label}
                  </div>
                  <p className="text-xs text-[#9FB0A7] mt-1.5 max-w-[200px] leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. SERVICES SHOWCASE ANCHOR & HEADER ── */}
      <div id="services-grid-anchor" className="relative z-10 w-[85%] mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1A2420]">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#22C55E] flex items-center gap-1.5 mb-2">
              <HiSparkles className="h-4 w-4 text-[#B6F23D]" />
              <span>Full-Stack Capabilities</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Our Core Services
            </h2>
          </div>

          {/* Mode Switcher: Clean Grid vs 3D Tunnel */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-[#111815] border border-[#1A2420] self-start md:self-auto">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30'
                  : 'text-[#9FB0A7] hover:text-white'
              }`}
            >
              <HiSquares2X2 className="h-4 w-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setDisplayMode('3d')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                displayMode === '3d'
                  ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30'
                  : 'text-[#9FB0A7] hover:text-white'
              }`}
            >
              <HiCube className="h-4 w-4" />
              <span>3D Tunnel</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Only shown in Grid Mode) */}
        {displayMode === 'grid' && (
          <div className="flex items-center gap-2 pt-6 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'bg-[#111815] text-[#9FB0A7] border border-[#1A2420] hover:text-white hover:border-[#1A2420]/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 4. SERVICES DISPLAY: GRID OR 3D ── */}
      <div id="services" className="relative z-10 w-[85%] mx-auto">
        {displayMode === '3d' ? (
          <div className="rounded-3xl overflow-hidden border border-[#1A2420] shadow-2xl">
            <Services3D onSelectService={onSelectService} />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredServices.map((service, index) => {
                const Icon = serviceIcons[service.iconKey] || HiBolt;

                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-3xl bg-[#111815]/95 border border-[#1A2420] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#22C55E]/50 hover:bg-[#16A34A]/5 hover:shadow-[0_15px_35px_rgba(22,163,74,0.18)]"
                  >
                    {/* Faded Background Number */}
                    <span
                      className="absolute -top-3 -right-2 text-7xl font-black select-none pointer-events-none opacity-5 group-hover:opacity-15 transition-opacity duration-300"
                      style={{
                        WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)',
                        color: 'transparent',
                      }}
                    >
                      {service.id}
                    </span>

                    <div className="relative z-10">
                      {/* Top Header Row: Number & Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-xs font-bold tracking-widest text-[#22C55E] bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                          {service.number}
                        </span>

                        {service.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B6F23D] bg-[#B6F23D]/10 px-2.5 py-0.5 rounded-full border border-[#B6F23D]/25">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-[#0B0F0D] border border-[#1A2420] text-[#22C55E] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#22C55E]/40 group-hover:bg-[#16A34A]/20 shadow-md">
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

                      {/* Sub-services bullet list */}
                      <ul className="space-y-2 border-t border-[#1A2420] pt-4 mb-6">
                        {service.subServices.map((sub, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-[#9FB0A7] group-hover:text-white transition-colors"
                          >
                            <HiCheckCircle className="h-3.5 w-3.5 text-[#22C55E] shrink-0 opacity-80 group-hover:opacity-100" />
                            <span className="line-clamp-1">{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Button: Click opens consultation with preselected service */}
                    <div className="relative z-10 pt-3 border-t border-[#1A2420]">
                      <button
                        type="button"
                        onClick={() => onSelectService(service.title)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#22C55E] group-hover:text-[#B6F23D] transition-colors cursor-pointer"
                      >
                        <span>Explore & Book Service</span>
                        <HiArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
