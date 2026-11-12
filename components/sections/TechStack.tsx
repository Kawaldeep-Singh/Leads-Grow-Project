'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiHtml5,
  SiJavascript,
  SiPhp,
  SiCodeigniter,
  SiLaravel,
  SiWordpress,
  SiShopify,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiAngular,
  SiNextdotjs,
  SiTypescript,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiGooglecloud,
  SiFirebase,
  SiAndroidstudio,
  SiApple,
  SiFlutter,
  SiFigma,
  SiRazorpay,
  SiPaypal,
  SiStripe,
  SiPhonepe,
  SiTailwindcss,
  SiGithub,
  SiDocker,
} from 'react-icons/si';
import {
  FaCss3Alt,
  FaOpencart,
  FaAws,
  FaJava,
  FaShareNodes,
} from 'react-icons/fa6';
import {
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeAfterEffect,
  TbBrandAmazon,
  TbAutomation,
} from 'react-icons/tb';
import {
  MdMobileFriendly,
  MdBrush,
  MdShoppingCart,
  MdStore,
  MdLocalMall,
  MdShoppingBag,
  MdPayment,
  MdAccountBalance,
  MdAccountBalanceWallet,
} from 'react-icons/md';
import { techTabs, techStackData, TechCategoryKey } from '@/data/techStack';
import { SectionHeading } from '@/components/ui/SectionHeading';

const iconComponentMap: Record<string, React.ElementType> = {
  SiHtml5,
  FaCss3Alt,
  SiJavascript,
  SiPhp,
  SiCodeigniter,
  SiLaravel,
  SiWordpress,
  FaOpencart,
  SiShopify,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiAngular,
  SiNextdotjs,
  SiTypescript,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  FaAws,
  SiGooglecloud,
  SiFirebase,
  FaJava,
  SiAndroidstudio,
  SiApple,
  SiFlutter,
  MdMobileFriendly,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandAdobePremiere,
  TbBrandAdobeAfterEffect,
  MdBrush,
  SiFigma,
  TbBrandAmazon,
  MdShoppingCart,
  MdStore,
  MdLocalMall,
  MdShoppingBag,
  SiRazorpay,
  MdPayment,
  SiPaypal,
  MdAccountBalance,
  SiStripe,
  MdAccountBalanceWallet,
  SiPhonepe,
  SiTailwindcss,
  SiGithub,
  SiDocker,
  TbAutomation,
  FaShareNodes,
};

export const TechStack: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TechCategoryKey>('web');

  const currentItems = techStackData[activeTab] || [];

  return (
    <section
      id="tech-stack"
      className="relative bg-[#F6FAF7] py-12 sm:py-16 overflow-hidden bg-dot-pattern-light border-y border-gray-200"
    >
      {/* Floating blurred green/blue ambient blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#16A34A]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#3B82F6]/10 blur-[150px] pointer-events-none" />

      <div className="w-[85%] mx-auto relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="Engineered For Growth"
          plainText="Modern Frameworks &"
          highlightText="Digital Ecosystems."
          subtext="The battle-tested platforms, high-speed cloud infrastructure, and smart automation driving your business forward."
          align="center"
          theme="light"
        />

        {/* 6 Tabs Pill Buttons (Horizontal scroll on mobile) */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm max-w-full overflow-x-auto no-scrollbar">
            {techTabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-white' : 'text-[#5B6B63] hover:text-[#0B0F0D]'
                  }`}
                >
                  {/* Shared layoutId background slider (Framer Motion) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTechTabPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] shadow-md shadow-[#16A34A]/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Centered, Wrapping Tech Icon Grid */}
        <div className="min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto"
            >
              {currentItems.map((item, index) => {
                const IconComponent = iconComponentMap[item.iconName] || MdStore;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.035,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.06,
                      transition: { duration: 0.2 },
                    }}
                    className="group relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-gray-200/80 p-3 shadow-sm hover:shadow-xl hover:border-[#16A34A]/40 transition-all duration-300 select-none cursor-pointer"
                  >
                    {/* Brand Icon */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: item.color || '#16A34A' }}
                    >
                      <IconComponent className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>

                    {/* Label */}
                    <span className="text-[11px] sm:text-xs font-semibold text-[#0B0F0D] group-hover:text-[#16A34A] transition-colors text-center line-clamp-1">
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
