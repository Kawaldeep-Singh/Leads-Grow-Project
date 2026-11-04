'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiArrowUp,
  HiOutlineEnvelope,
  HiMapPin,
  HiPhone,
  HiClock,
  HiSparkles,
} from 'react-icons/hi2';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { BRAND } from '@/lib/constants';
import { servicesData } from '@/data/services';
import { industriesData } from '@/data/industries';
import { subscribeNewsletter } from '@/lib/api';
import { registerGsapPlugins, gsap, ScrollToPlugin } from '@/lib/gsap-register';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    try {
      const res = await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage(res.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus('error');
      setNewsletterMessage(err.message || 'Failed to subscribe.');
    }
  };

  const scrollToTop = () => {
    registerGsapPlugins();
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: 0, autoKill: true },
      ease: 'power3.inOut',
    });
  };

  const companyLinks = [
    { label: 'About Us', href: '#stats' },
    { label: 'Our Services', href: '#services' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Case Studies / Portfolio', href: '#testimonials' },
    { label: 'Growth Insights & Blog', href: '#' },
    { label: 'Careers (We are hiring!)', href: '#' },
    { label: 'Get Free Consultation', href: '#cta' },
  ];

  return (
    <footer className="relative bg-[#0B0F0D] text-white pt-20 pb-10 border-t border-[#1A2420] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#16A34A]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#22C55E]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[85%] mx-auto relative z-10">
        {/* Newsletter Subscription Strip */}
        <div className="rounded-3xl bg-[#111815] border border-[#1A2420] p-6 sm:p-10 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22C55E] mb-2">
              <HiSparkles className="text-[#B6F23D]" />
              <span>Weekly Marketing Playbook</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Stay ahead of digital growth trends.
            </h3>
            <p className="text-sm text-[#9FB0A7] mt-1">
              Join 15,000+ founders and marketers receiving actionable CAC reduction tactics and lead gen case studies.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative min-w-[280px]">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5B6B63]" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#0B0F0D] border border-[#1A2420] text-sm text-white placeholder:text-[#5B6B63] focus:outline-none focus:border-[#22C55E]"
              />
            </div>
            <button
              type="submit"
              disabled={newsletterStatus === 'loading'}
              className="px-6 py-3.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#16A34A]/25 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        </div>

        {newsletterStatus === 'success' && (
          <p className="text-xs text-[#22C55E] -mt-12 mb-8 text-center">{newsletterMessage}</p>
        )}
        {newsletterStatus === 'error' && (
          <p className="text-xs text-red-400 -mt-12 mb-8 text-center">{newsletterMessage}</p>
        )}

        {/* 5 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#1A2420]">
          {/* Column 1: Brand Logo & Description */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="relative h-11 w-56 mb-4">
              <Image
                src="/Logo-Light.webp"
                alt="LeadsGrow Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-[#9FB0A7] leading-relaxed mb-6">
              {BRAND.description}
            </p>
            <div className="text-xs font-semibold text-[#22C55E] italic mb-6">
              {BRAND.tagline}
            </div>

            {/* Social Icons with Hover Bounce */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebookF, href: BRAND.socials.facebook, label: 'Facebook' },
                { icon: FaInstagram, href: BRAND.socials.instagram, label: 'Instagram' },
                { icon: FaLinkedinIn, href: BRAND.socials.linkedin, label: 'LinkedIn' },
                { icon: FaXTwitter, href: BRAND.socials.x, label: 'Twitter' },
                { icon: FaYoutube, href: BRAND.socials.youtube, label: 'YouTube' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    whileHover={{ y: -4, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="w-9 h-9 rounded-full bg-[#111815] border border-[#1A2420] text-[#9FB0A7] hover:text-[#22C55E] hover:border-[#22C55E]/40 flex items-center justify-center transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Our Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#9FB0A7]">
              {servicesData.map((s) => (
                <li key={s.id}>
                  <Link
                    href="#services"
                    className="hover:text-[#22C55E] transition-colors inline-block"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#9FB0A7]">
              {companyLinks.map((c, i) => (
                <li key={i}>
                  <Link
                    href={c.href}
                    className="hover:text-[#22C55E] transition-colors inline-block"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Industries */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Industries
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#9FB0A7]">
              {industriesData.slice(0, 8).map((ind) => (
                <li key={ind.id}>
                  <Link
                    href="#industries"
                    className="hover:text-[#22C55E] transition-colors inline-block"
                  >
                    {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3.5 text-sm text-[#9FB0A7]">
              <div className="flex items-start gap-3">
                <HiMapPin className="h-5 w-5 text-[#22C55E] shrink-0 mt-0.5" />
                <span className="leading-snug">{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <HiPhone className="h-5 w-5 text-[#22C55E] shrink-0" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">
                  {BRAND.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineEnvelope className="h-5 w-5 text-[#22C55E] shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">
                  {BRAND.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <HiClock className="h-5 w-5 text-[#22C55E] shrink-0 mt-0.5" />
                <span>{BRAND.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Giant Faded Outline LEADSGROW Wordmark */}
        <div className="py-12 select-none overflow-hidden text-center opacity-10 hover:opacity-15 transition-opacity">
          <span
            className="text-[14vw] sm:text-[15vw] font-black tracking-tighter leading-none inline-block text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)',
            }}
          >
            LEADSGROW
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#5B6B63] border-t border-[#1A2420]">
          <div>
            © {new Date().getFullYear()} {BRAND.name}
            {BRAND.trademark}. All rights reserved. •{' '}
            <span className="text-[#9FB0A7]">{BRAND.tagline}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111815] border border-[#1A2420] text-[#9FB0A7] hover:text-[#22C55E] hover:border-[#22C55E]/40 transition-all cursor-pointer"
          >
            <span>Back to top</span>
            <span className="w-6 h-6 rounded-full bg-[#1A2420] group-hover:bg-[#16A34A] group-hover:text-white flex items-center justify-center transition-colors">
              <HiArrowUp className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

