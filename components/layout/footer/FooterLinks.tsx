'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiMapPin,
  HiPhone,
  HiOutlineEnvelope,
  HiClock,
  HiArrowUpRight,
  HiPlus,
  HiMinus,
} from 'react-icons/hi2';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa6';
import { BRAND } from '@/lib/constants';
import { servicesData } from '@/data/services';

interface FooterLinksProps {
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const FooterLinks: React.FC<FooterLinksProps> = ({ onAnchorClick }) => {
  // Mobile accordion states
  const [servicesOpen, setServicesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/#services' },
    { label: 'Tech Stack', href: '/#tech-stack' },
    { label: 'Case Studies / Portfolio', href: '/#testimonials' },
    { label: 'Growth Insights & Blog', href: '#' },
    { label: 'Careers (We are hiring!)', href: '#' },
    { label: 'Get Free Consultation', href: '/#cta' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: BRAND.socials.facebook, label: 'Facebook' },
    { icon: FaInstagram, href: BRAND.socials.instagram, label: 'Instagram' },
    {
      icon: FaWhatsapp,
      href: `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(BRAND.whatsappMessage)}`,
      label: 'WhatsApp',
    },
    { icon: FaXTwitter, href: BRAND.socials.x, label: 'Twitter (X)' },
    { icon: FaLinkedinIn, href: BRAND.socials.linkedin, label: 'LinkedIn' },
    { icon: FaYoutube, href: BRAND.socials.youtube, label: 'YouTube' },
  ];

  // Helper for animated interactive link item
  const renderInteractiveLink = (label: string, href: string, key?: string | number) => {
    const isAnchor = href.startsWith('/#') || href.startsWith('#');

    return (
      <li key={key || label} className="relative">
        <Link
          href={href}
          onClick={isAnchor ? (e) => onAnchorClick(e, href) : undefined}
          className="group inline-flex items-center gap-1.5 text-sm text-[#9FB0A7] hover:text-white transition-colors duration-200 py-1"
        >
          <span className="relative transition-transform duration-200 group-hover:translate-x-1">
            {label}
            {/* Animated growing green underline */}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#16A34A] to-[#22C55E] transition-all duration-300 group-hover:w-full" />
          </span>
          <HiArrowUpRight className="h-3.5 w-3.5 text-[#22C55E] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
        </Link>
      </li>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[#1A2420]">
      {/* ── Col 1–4: Brand Block (Logo, description, tagline, social icons) ── */}
      <div className="footer-link-col lg:col-span-4 flex flex-col justify-start">
        {/* Brand Logo & Tagline */}
        <div className="mb-6">
          <Link href="/" className="inline-block relative h-10 w-48 sm:h-11 sm:w-56 mb-3.5 group">
            <Image
              src="/Logo-Light.webp"
              alt="LeadsGrow Logo"
              fill
              className="object-contain object-left transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Agency Description */}
          <p className="text-sm text-[#9FB0A7] leading-relaxed mb-3 max-w-sm">
            {BRAND.description}
          </p>

          {/* Tagline */}
          <div className="text-xs font-semibold text-[#22C55E] italic">
            {BRAND.tagline}
          </div>
        </div>

        {/* Social Icons with Magnetic Hover & Green Glow */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B63] block mb-3 font-mono">
            Connect With Us
          </span>
          <div className="flex items-center gap-2.5">
            {socialLinks.map((s, idx) => {
              const Icon = s.icon;
              return (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="magnetic-target group relative w-9 h-9 rounded-full bg-[#111815] border border-[#1A2420] text-[#9FB0A7] hover:text-white hover:bg-[#16A34A] hover:border-[#16A34A] hover:shadow-[0_0_18px_rgba(22,163,74,0.5)] flex items-center justify-center transition-all duration-300 cursor-pointer"
                >
                  <Icon className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:rotate-[360deg] group-hover:scale-110" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Col 5–7: Our Services (3 cols) ── */}
      <div className="footer-link-col lg:col-span-3">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="w-6 h-0.5 bg-[#22C55E] mb-3 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Our Services
          </h3>
          <nav aria-label="Services navigation">
            <ul className="flex flex-col gap-1.5">
              {servicesData.map((svc) =>
                renderInteractiveLink(svc.title, '/#services', svc.id)
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden border-t border-[#1A2420] pt-4">
          <button
            type="button"
            onClick={() => setServicesOpen(!servicesOpen)}
            aria-expanded={servicesOpen}
            aria-controls="mobile-footer-services"
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#22C55E] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Our Services
              </span>
            </div>
            <span className="text-[#22C55E]">
              {servicesOpen ? <HiMinus className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
            </span>
          </button>
          <AnimatePresence>
            {servicesOpen && (
              <motion.div
                id="mobile-footer-services"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden pl-6 pt-2 pb-3"
              >
                <ul className="flex flex-col gap-2">
                  {servicesData.map((svc) =>
                    renderInteractiveLink(svc.title, '/#services', svc.id)
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Col 8–9: Company (2 cols) ── */}
      <div className="footer-link-col lg:col-span-2">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="w-6 h-0.5 bg-[#22C55E] mb-3 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Company
          </h3>
          <nav aria-label="Company links">
            <ul className="flex flex-col gap-1.5">
              {companyLinks.map((c, i) =>
                renderInteractiveLink(c.label, c.href, i)
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden border-t border-[#1A2420] pt-4">
          <button
            type="button"
            onClick={() => setCompanyOpen(!companyOpen)}
            aria-expanded={companyOpen}
            aria-controls="mobile-footer-company"
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#22C55E] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Company
              </span>
            </div>
            <span className="text-[#22C55E]">
              {companyOpen ? <HiMinus className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
            </span>
          </button>
          <AnimatePresence>
            {companyOpen && (
              <motion.div
                id="mobile-footer-company"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden pl-6 pt-2 pb-3"
              >
                <ul className="flex flex-col gap-2">
                  {companyLinks.map((c, i) =>
                    renderInteractiveLink(c.label, c.href, i)
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Col 10–12: Contact Details & Location (3 cols - Perfectly Aligned) ── */}
      <div className="footer-link-col lg:col-span-3">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="w-6 h-0.5 bg-[#22C55E] mb-3 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
            Contact & Location
          </h3>
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-[#9FB0A7]">
            {/* Location / Head Office */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#16A34A]/25 group-hover:border-[#22C55E]/40 group-hover:text-white transition-all duration-300 shadow-sm">
                <HiMapPin className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                  Head Office
                </span>
                <span className="leading-snug text-xs sm:text-[13px] text-[#9FB0A7] mt-0.5 group-hover:text-white/90 transition-colors">
                  {BRAND.address}
                </span>
              </div>
            </div>

            {/* Direct Phone */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#16A34A]/25 group-hover:border-[#22C55E]/40 group-hover:text-white transition-all duration-300 shadow-sm">
                <HiPhone className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                  Direct Phone
                </span>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="text-xs sm:text-[13px] text-[#9FB0A7] hover:text-[#22C55E] transition-colors mt-0.5"
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#16A34A]/25 group-hover:border-[#22C55E]/40 group-hover:text-white transition-all duration-300 shadow-sm">
                <HiOutlineEnvelope className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                  Email Inquiry
                </span>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="text-xs sm:text-[13px] text-[#9FB0A7] hover:text-[#22C55E] transition-colors mt-0.5"
                >
                  {BRAND.email}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#16A34A]/25 group-hover:border-[#22C55E]/40 group-hover:text-white transition-all duration-300 shadow-sm">
                <HiClock className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                  Business Hours
                </span>
                <span className="text-xs sm:text-[13px] text-[#9FB0A7] mt-0.5">
                  {BRAND.workingHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden border-t border-[#1A2420] pt-4">
          <button
            type="button"
            onClick={() => setContactOpen(!contactOpen)}
            aria-expanded={contactOpen}
            aria-controls="mobile-footer-contact"
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-[#22C55E] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Contact & Location
              </span>
            </div>
            <span className="text-[#22C55E]">
              {contactOpen ? <HiMinus className="h-4 w-4" /> : <HiPlus className="h-4 w-4" />}
            </span>
          </button>
          <AnimatePresence>
            {contactOpen && (
              <motion.div
                id="mobile-footer-contact"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden pl-4 pt-3 pb-3 flex flex-col gap-4 text-xs text-[#9FB0A7]"
              >
                <div className="flex items-start gap-3">
                  <HiMapPin className="h-4 w-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>{BRAND.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <HiPhone className="h-4 w-4 text-[#22C55E] shrink-0" />
                  <a href={`tel:${BRAND.phone}`} className="hover:text-white">
                    {BRAND.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineEnvelope className="h-4 w-4 text-[#22C55E] shrink-0" />
                  <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                    {BRAND.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <HiClock className="h-4 w-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>{BRAND.workingHours}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
