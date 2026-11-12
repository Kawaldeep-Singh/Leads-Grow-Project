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
import { useSiteVariant } from '@/context/VariantContext';

interface HeaderProps {
  onOpenAudit: () => void;
  theme?: 'dark' | 'light' | 'top-light';
}

export const Header: React.FC<HeaderProps> = ({ onOpenAudit, theme }) => {
  const { variant } = useSiteVariant();
  const isTopBarLight = theme
    ? theme === 'light' || theme === 'top-light'
    : variant === 'v2' || variant === 'v3';
  const isNavLight = theme ? theme === 'light' : variant === 'v2';
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesAccordion, setMobileServicesAccordion] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Keep navbar sticky fixed, collapse top utility bar on scroll down
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(BRAND.whatsappMessage)}`,
      icon: FaWhatsapp,
    },
    {
      name: 'Facebook',
      href: BRAND.socials.facebook,
      icon: FaFacebookF,
    },
    {
      name: 'Instagram',
      href: BRAND.socials.instagram,
      icon: FaInstagram,
    },
    {
      name: 'LinkedIn',
      href: BRAND.socials.linkedin,
      icon: FaLinkedinIn,
    },
    {
      name: 'Twitter (X)',
      href: BRAND.socials.x,
      icon: FaXTwitter,
    },
    {
      name: 'YouTube',
      href: BRAND.socials.youtube,
      icon: FaYoutube,
    },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/' },
    { label: 'Services', href: '/#services', hasMegaMenu: true },
    // { label: 'Industries', href: '#industries' },
    { label: 'Tech Stack', href: '/#tech-stack' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'Contact', href: '/#cta' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Utility Bar (Desktop only) - collapses smoothly on scroll */}
      <div
        className={`hidden lg:flex items-center text-xs transition-all duration-300 ${isTopBarLight
            ? 'bg-white border-b border-gray-200/90 text-gray-700 shadow-xs'
            : 'bg-[#0B0F0D] border-b border-[#1A2420] text-[#9FB0A7]'
          } ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden border-b-0' : 'h-10.5 py-1.5 opacity-100'
          }`}
      >
        <div className="w-[85%] mx-auto flex items-center justify-between">
          {/* Left Social Links with Circular Animation */}
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className={`group relative w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${isTopBarLight
                      ? 'bg-gray-100/90 border-gray-200/80 text-gray-600 hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] hover:shadow-[0_0_12px_rgba(22,163,74,0.35)]'
                      : 'bg-[#121915] border-[#1C2621] text-[#9FB0A7] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] hover:shadow-[0_0_12px_rgba(22,163,74,0.45)]'
                    }`}
                >
                  <Icon className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110" />
                </a>
              );
            })}
          </div>

          {/* Right Contact Info with Increased Size & Circular Icon Badges */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${BRAND.phone}`}
              className={`group flex items-center gap-2 py-1 px-3 rounded-full text-sm font-semibold transition-all duration-300 ${isTopBarLight
                  ? 'text-gray-800 hover:text-[#16A34A] hover:bg-gray-100'
                  : 'text-[#E2E8F0] hover:text-[#22C55E] hover:bg-[#121915]'
                }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isTopBarLight
                    ? 'bg-green-50 border-green-200/80 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] group-hover:shadow-[0_0_10px_rgba(22,163,74,0.35)]'
                    : 'bg-[#121915] border-[#1C2621] text-[#22C55E] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] group-hover:shadow-[0_0_10px_rgba(22,163,74,0.4)]'
                  }`}
              >
                <HiPhone className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </span>
              <span>{BRAND.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${BRAND.email}`}
                className={`group flex items-center gap-2 py-1 px-3 rounded-full text-sm font-semibold transition-all duration-300 ${isTopBarLight
                    ? 'text-gray-800 hover:text-[#16A34A] hover:bg-gray-100'
                    : 'text-[#E2E8F0] hover:text-[#22C55E] hover:bg-[#121915]'
                  }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isTopBarLight
                      ? 'bg-green-50 border-green-200/80 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] group-hover:shadow-[0_0_10px_rgba(22,163,74,0.35)]'
                      : 'bg-[#121915] border-[#1C2621] text-[#22C55E] group-hover:bg-[#16A34A] group-hover:text-white group-hover:border-[#16A34A] group-hover:shadow-[0_0_10px_rgba(22,163,74,0.4)]'
                    }`}
                >
                  <HiMail className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                </span>
                <span>{BRAND.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 ${isNavLight
              ? isScrolled
                ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md shadow-gray-200/50 py-3.5'
                : 'bg-white border-b border-gray-200/80 py-4 shadow-sm shadow-gray-100'
              : isScrolled
                ? 'glass-nav shadow-lg shadow-black/30 py-3.5'
                : 'bg-[#0B0F0D]/90 backdrop-blur-md border-b border-[#1A2420]/60 py-4 shadow-md shadow-black/20'
            }`}
        >
          <div className="w-[85%] mx-auto flex items-center justify-between">
            {/* Logo on Light/Dark Background */}
            <Link href="/" className="flex items-center gap-2 group relative z-20">
              <div className="relative h-10 w-48 sm:h-11 sm:w-56">
                <Image
                  src={isNavLight ? "/Logo-dark.webp" : "/Logo-Light.webp"}
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
                        className={`group flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer ${isNavLight
                            ? 'text-[#0B0F0D] hover:text-[#16A34A]'
                            : 'text-white/90 hover:text-[#22C55E]'
                          }`}
                      >
                        <span>{item.label}</span>
                        <HiChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen
                              ? 'rotate-180 text-[#16A34A]'
                              : isNavLight
                                ? 'text-gray-500 group-hover:text-[#16A34A]'
                                : 'text-white/60'
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
                            <div
                              className={`rounded-3xl p-6 shadow-2xl backdrop-blur-xl border ${isNavLight
                                  ? 'bg-white border-gray-200 shadow-gray-300/40'
                                  : 'bg-[#0B0F0D]/95 border-[#1A2420]'
                                }`}
                            >
                              {/* Top Mega Menu Header */}
                              <div
                                className={`flex items-center justify-between pb-4 mb-4 border-b ${isNavLight ? 'border-gray-200' : 'border-[#1A2420]'
                                  }`}
                              >
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                                    Full-Service Growth Solutions
                                  </span>
                                <h4
                                  className={`text-lg font-bold ${isNavLight ? 'text-[#0B0F0D]' : 'text-white'
                                    }`}
                                >
                                  Explore Our Core Capabilities
                                </h4>
                              </div>
                              <div
                                className={`flex items-center gap-6 text-xs ${isNavLight ? 'text-gray-600' : 'text-[#9FB0A7]'
                                  }`}
                              >
                                <span className={`font-semibold ${isNavLight ? 'text-[#0B0F0D]' : 'text-white'}`}>
                                  <strong className="text-[#16A34A]">50L+</strong> Leads Generated
                                </span>
                                <span className={`font-semibold ${isNavLight ? 'text-[#0B0F0D]' : 'text-white'}`}>
                                  <strong className="text-[#15803D]">5K+</strong> Campaigns Run
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
                                  className={`group p-3 rounded-2xl border transition-all duration-200 ${isNavLight
                                      ? 'bg-gray-50/80 border-gray-100 hover:border-[#16A34A]/40 hover:bg-[#16A34A]/10 shadow-xs'
                                      : 'bg-[#111815]/60 border-transparent hover:border-[#22C55E]/40 hover:bg-[#16A34A]/10'
                                    }`}
                                >
                                  <div className="text-xs font-bold text-[#16A34A] mb-1">
                                    {svc.number}
                                  </div>
                                  <h5
                                    className={`text-sm font-bold transition-colors leading-snug ${isNavLight
                                        ? 'text-[#0B0F0D] group-hover:text-[#16A34A]'
                                        : 'text-white group-hover:text-[#22C55E]'
                                      }`}
                                  >
                                    {svc.title}
                                  </h5>
                                  <p
                                    className={`text-[11px] mt-1 line-clamp-2 ${isNavLight ? 'text-gray-500' : 'text-[#9FB0A7]'
                                      }`}
                                  >
                                    {svc.shortDescription}
                                  </p>
                                </Link>
                              ))}
                            </div>

                            {/* Mega Menu Footer CTA strip */}
                            <div
                              className={`mt-5 pt-4 border-t flex items-center justify-between -mx-6 -mb-6 px-6 py-4 rounded-b-3xl ${isNavLight
                                  ? 'border-gray-200 bg-gray-50 text-gray-600'
                                  : 'border-[#1A2420] bg-[#111815]/50 text-[#9FB0A7]'
                                }`}
                            >
                              <span className="text-xs">
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
                                Contact Us
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
                  className={`group relative py-2 text-sm font-semibold transition-colors ${isNavLight
                      ? 'text-[#0B0F0D] hover:text-[#16A34A]'
                      : 'text-white/90 hover:text-white'
                    }`}
                >
                  <span>{item.label}</span>
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] transition-all duration-300 group-hover:w-full" />
                </Link>
              );
            })}
          </div>

          {/* Right Action CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="glow"
              size="md"
              withArrow
              onClick={onOpenAudit}
            >
              Contact Us
            </Button>
          </div>

          {/* Mobile Right Controls: Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className={`p-2.5 rounded-full border transition-colors ${isNavLight
                  ? 'bg-gray-100 border-gray-200 text-[#0B0F0D] hover:text-[#16A34A]'
                  : 'bg-[#111815] border-[#1A2420] text-white hover:text-[#22C55E]'
                }`}
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
            className={`fixed inset-0 z-50 lg:hidden flex flex-col p-6 overflow-y-auto ${isNavLight ? 'bg-white text-[#0B0F0D]' : 'bg-[#0B0F0D] text-white'
              }`}
          >
            {/* Top Bar with logo and close button */}
            <div
              className={`flex items-center justify-between pb-6 border-b ${isNavLight ? 'border-gray-200' : 'border-[#1A2420]'
                }`}
            >
              <div className="relative h-9 w-44 sm:h-10 sm:w-48">
                <Image
                  src={isNavLight ? "/Logo-dark.webp" : "/Logo-Light.webp"}
                  alt="LeadsGrow Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className={`p-2.5 rounded-full border ${isNavLight
                    ? 'bg-gray-100 border-gray-200 text-[#0B0F0D]'
                    : 'bg-[#111815] border-[#1A2420] text-white'
                  }`}
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            {/* Menu Links List */}
            <div className="py-6 flex flex-col gap-4">
              {navLinks.map((item) => {
                if (item.hasMegaMenu) {
                  return (
                    <div
                      key={item.label}
                      className={`border-b pb-3 ${isNavLight ? 'border-gray-200' : 'border-[#1A2420]'
                        }`}
                    >
                      <button
                        onClick={() => setMobileServicesAccordion(!mobileServicesAccordion)}
                        className={`w-full flex items-center justify-between text-lg font-bold py-2 ${isNavLight ? 'text-[#0B0F0D]' : 'text-white'
                          }`}
                      >
                        <span>{item.label}</span>
                        <HiChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${mobileServicesAccordion
                              ? 'rotate-180 text-[#16A34A]'
                              : isNavLight
                                ? 'text-gray-500'
                                : 'text-[#9FB0A7]'
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
                                className={`text-sm py-1.5 flex items-center justify-between transition-colors ${isNavLight
                                    ? 'text-gray-600 hover:text-[#16A34A]'
                                    : 'text-[#9FB0A7] hover:text-[#22C55E]'
                                  }`}
                              >
                                <span>{s.title}</span>
                                <span className={`text-xs ${isNavLight ? 'text-gray-400' : 'text-[#5B6B63]'}`}>
                                  {s.number}
                                </span>
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
                    className={`text-lg font-bold py-2 border-b hover:text-[#16A34A] transition-colors ${isNavLight
                        ? 'text-[#0B0F0D] border-gray-200'
                        : 'text-white border-[#1A2420]'
                      }`}
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
                Contact Us
              </Button>

              <div className={`text-center text-xs flex flex-col gap-1 ${isNavLight ? 'text-gray-600' : 'text-[#9FB0A7]'}`}>
                <span>{BRAND.phoneDisplay}</span>
                <span>{BRAND.email}</span>
                <span className={`italic mt-2 ${isNavLight ? 'text-gray-400' : 'text-[#5B6B63]'}`}>{BRAND.tagline}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

