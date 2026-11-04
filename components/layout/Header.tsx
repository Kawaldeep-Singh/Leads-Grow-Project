'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  HiMenu,
  HiX,
  HiChevronDown,
  HiPhone,
  HiMail,
  HiArrowRight,
  HiSparkles,
} from 'react-icons/hi';
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { BRAND } from '@/lib/constants';
import { servicesData } from '@/data/services';
import { Button } from '@/components/ui/Button';
import { VariantToggle } from '@/components/ui/VariantToggle';

interface HeaderProps {
  onOpenAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAudit }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesAccordion, setMobileServicesAccordion] = useState(false);

  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Glass background after 80px
    if (latest > 80) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide on scroll down, show on scroll up
    if (latest > lastScrollY && latest > 150) {
      setIsVisible(false);
      setMegaMenuOpen(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(latest);
  });

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#stats' },
    { label: 'Services', href: '#services', hasMegaMenu: true },
    // { label: 'Industries', href: '#industries' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#cta' },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -140 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
    >
      {/* Top Utility Bar (Desktop only, dark) */}
      <div
        className={`hidden lg:flex items-center py-2 text-xs text-[#9FB0A7] bg-[#0B0F0D] border-b border-[#1A2420] transition-opacity duration-300 ${
          isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-9 opacity-100'
        }`}
      >

        <div className="w-[85%] mx-auto flex items-center justify-between">
 <div className="flex items-center gap-4">
         
          <div className="flex items-center gap-2.5 text-[#9FB0A7] ml-2">
            <a href={BRAND.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <FaFacebookF className="h-3 w-3" />
            </a>
            <a href={BRAND.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <FaInstagram className="h-3 w-3" />
            </a>
            <a href={BRAND.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <FaLinkedinIn className="h-3 w-3" />
            </a>
            <a href={BRAND.socials.x} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
              <FaXTwitter className="h-3 w-3" />
            </a>
            <a href={BRAND.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
              <FaYoutube className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <a
            href={`tel:${BRAND.phone}`}
            className="flex items-center gap-1.5 hover:text-[#22C55E] transition-colors"
          >
            <HiPhone className="text-[#22C55E]" />
            <span>{BRAND.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="flex items-center gap-1.5 hover:text-[#22C55E] transition-colors"
          >
            <HiMail className="text-[#22C55E]" />
            <span>{BRAND.email}</span>
          </a>
        </div>

       


        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-lg shadow-black/30 py-3.5'
            : 'bg-[#0B0F0D]/90 backdrop-blur-md border-b border-[#1A2420]/60 py-4 shadow-md shadow-black/20'
        }`}
      >
        <div className="w-[85%] mx-auto flex items-center justify-between">
          {/* Logo on Dark Background */}
          <Link href="/" className="flex items-center gap-2 group relative z-20">
            <div className="relative h-10 w-48 sm:h-11 sm:w-56">
              <Image
                src="/Logo-Light.webp"
                alt="LeadsGrow Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              if (item.hasMegaMenu) {
                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    className="relative py-2"
                  >
                    <button
                      className="group flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-[#22C55E] transition-colors cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <HiChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          megaMenuOpen ? 'rotate-180 text-[#22C55E]' : 'text-white/60'
                        }`}
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                      {megaMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="absolute -left-48 top-full pt-4 w-[850px] z-50 pointer-events-auto"
                        >
                          <div className="rounded-3xl bg-[#0B0F0D]/95 border border-[#1A2420] p-6 shadow-2xl backdrop-blur-xl">
                            {/* Top Mega Menu Header */}
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1A2420]">
                              <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#22C55E]">
                                  Full-Service Growth Solutions
                                </span>
                                <h4 className="text-lg font-bold text-white">
                                  Explore Our Core Capabilities
                                </h4>
                              </div>
                              <div className="flex items-center gap-6 text-xs text-[#9FB0A7]">
                                <span className="font-semibold text-white">
                                  <strong className="text-[#22C55E]">50L+</strong> Leads Generated
                                </span>
                                <span className="font-semibold text-white">
                                  <strong className="text-[#B6F23D]">5K+</strong> Campaigns Run
                                </span>
                              </div>
                            </div>

                            {/* 8 Services Grid */}
                            <div className="grid grid-cols-4 gap-4">
                              {servicesData.map((svc) => (
                                <Link
                                  key={svc.id}
                                  href={`#services`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="group p-3 rounded-2xl bg-[#111815]/60 border border-transparent hover:border-[#22C55E]/40 hover:bg-[#16A34A]/10 transition-all duration-200"
                                >
                                  <div className="text-xs font-bold text-[#22C55E] mb-1">
                                    {svc.number}
                                  </div>
                                  <h5 className="text-sm font-bold text-white group-hover:text-[#22C55E] transition-colors leading-snug">
                                    {svc.title}
                                  </h5>
                                  <p className="text-[11px] text-[#9FB0A7] mt-1 line-clamp-2">
                                    {svc.shortDescription}
                                  </p>
                                </Link>
                              ))}
                            </div>

                            {/* Mega Menu Footer CTA strip */}
                            <div className="mt-5 pt-4 border-t border-[#1A2420] flex items-center justify-between bg-[#111815]/50 -mx-6 -mb-6 px-6 py-4 rounded-b-3xl">
                              <span className="text-xs text-[#9FB0A7]">
                                Looking for custom enterprise growth architecture?
                              </span>
                              <Button
                                size="sm"
                                variant="glow"
                                onClick={() => {
                                  setMegaMenuOpen(false);
                                  onOpenAudit();
                                }}
                              >
                                Get Free Audit
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#16A34A] to-[#B6F23D] transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* Right Action CTA & Variant Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <VariantToggle mode="header" />
            <Button
              variant="glow"
              size="md"
              withArrow
              onClick={onOpenAudit}
            >
              Get Free Audit
            </Button>
          </div>

          {/* Mobile Right Controls: Variant Switch + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <VariantToggle mode="header" className="scale-90 origin-right" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-full bg-[#111815] border border-[#1A2420] text-white hover:text-[#22C55E] transition-colors"
            >
              {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Off-Canvas Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 lg:hidden bg-[#0B0F0D] flex flex-col p-6 overflow-y-auto"
          >
            {/* Top Bar with logo and close button */}
            <div className="flex items-center justify-between pb-6 border-b border-[#1A2420]">
              <div className="relative h-9 w-44 sm:h-10 sm:w-48">
                <Image
                  src="/Logo-Light.webp"
                  alt="LeadsGrow Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2.5 rounded-full bg-[#111815] border border-[#1A2420] text-white"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            {/* Variant Switcher for Mobile Drawer */}
            <div className="pt-3 pb-1">
              <VariantToggle mode="mobile" />
            </div>

            {/* Menu Links List */}
            <div className="py-6 flex flex-col gap-4">
              {navLinks.map((item) => {
                if (item.hasMegaMenu) {
                  return (
                    <div key={item.label} className="border-b border-[#1A2420] pb-3">
                      <button
                        onClick={() => setMobileServicesAccordion(!mobileServicesAccordion)}
                        className="w-full flex items-center justify-between text-lg font-bold text-white py-2"
                      >
                        <span>{item.label}</span>
                        <HiChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            mobileServicesAccordion ? 'rotate-180 text-[#22C55E]' : 'text-[#9FB0A7]'
                          }`}
                        />
                      </button>

                      {/* Accordion content */}
                      <AnimatePresence>
                        {mobileServicesAccordion && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-3 flex flex-col gap-2 pt-2"
                          >
                            {servicesData.map((s) => (
                              <Link
                                key={s.id}
                                href="#services"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-sm text-[#9FB0A7] hover:text-[#22C55E] py-1.5 flex items-center justify-between"
                              >
                                <span>{s.title}</span>
                                <span className="text-xs text-[#5B6B63]">{s.number}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold text-white py-2 border-b border-[#1A2420] hover:text-[#22C55E] transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6 flex flex-col gap-4">
              <Button
                variant="glow"
                size="lg"
                withArrow
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAudit();
                }}
              >
                Get Free Audit
              </Button>

              <div className="text-center text-xs text-[#9FB0A7] flex flex-col gap-1">
                <span>{BRAND.phoneDisplay}</span>
                <span>{BRAND.email}</span>
                <span className="text-[#5B6B63] italic mt-2">{BRAND.tagline}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

