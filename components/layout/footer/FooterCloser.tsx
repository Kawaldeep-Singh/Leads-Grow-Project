'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiSparkles, HiOutlineEnvelope, HiArrowRight, HiCheck } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa6';
import { BRAND } from '@/lib/constants';
import { subscribeNewsletter } from '@/lib/api';

interface FooterCloserProps {
  onAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const FooterCloser: React.FC<FooterCloserProps> = ({ onAnchorClick }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [hasShaken, setHasShaken] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot anti-spam check: if filled, quietly succeed without sending request
    if (honeypot.trim()) {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid work email.');
      triggerShake();
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await subscribeNewsletter(email);
      setStatus('success');
      setMessage(res?.message || 'Welcome aboard! Check your inbox soon.');
      setEmail('');
    } catch (err: unknown) {
      setStatus('error');
      const errorMessage =
        err instanceof Error ? err.message : 'Unable to subscribe right now. Please try again.';
      setMessage(errorMessage);
      triggerShake();
    }
  };

  const triggerShake = () => {
    setHasShaken(true);
    setTimeout(() => setHasShaken(false), 600);
  };

  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    BRAND.whatsappMessage
  )}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* ── Left Column: Statement & CTAs (7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col items-start">
        {/* Pulsing badge */}
        <div className="footer-closer-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#22C55E]/25 text-[#22C55E] text-xs font-mono uppercase tracking-wider mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
          </span>
          Let&apos;s grow together
        </div>

        {/* Large closer headline */}
        <h2 className="footer-closer-title text-[clamp(2.1rem,3.8vw,3.75rem)] font-extrabold tracking-tight text-white leading-[1.08] mb-4">
          Ready to turn clicks into <span className="text-gradient">customers?</span>
        </h2>

        {/* Supporting copy */}
        <p className="footer-closer-sub text-base sm:text-lg text-[#9FB0A7] max-w-xl leading-relaxed mb-8">
          Tell us your goal. We&apos;ll show you the fastest path to leads, sales and revenue.
        </p>

        {/* Two magnetic action buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/#cta"
            onClick={(e) => onAnchorClick(e, '/#cta')}
            className="footer-closer-btn magnetic-target group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#16A34A]/25 hover:shadow-[0_0_28px_rgba(34,197,94,0.45)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>Book a Free Strategy Call</span>
            <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-closer-btn magnetic-target group px-6 py-3.5 rounded-full bg-[#111815] border border-[#1A2420] hover:border-[#22C55E]/40 text-[#9FB0A7] hover:text-[#22C55E] font-semibold text-sm transition-all duration-300 flex items-center gap-2.5 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] cursor-pointer"
          >
            <FaWhatsapp className="h-4 w-4 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ── Right Column: Compact Newsletter Card (5 cols) ── */}
      <div className="lg:col-span-5">
        <div className="footer-newsletter-card relative rounded-3xl bg-[#111815]/90 backdrop-blur-xl border border-[#1A2420] hover:border-[#22C55E]/30 p-6 sm:p-7 shadow-xl shadow-black/40 transition-colors duration-300">
          {/* Subtle top ambient line */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#22C55E]/40 to-transparent" />

          {/* Card Label */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22C55E] mb-2">
            <HiSparkles className="h-4 w-4 text-[#B6F23D]" />
            <span>Weekly Marketing Playbook</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
            Stay ahead of growth trends.
          </h3>

          <p className="text-xs sm:text-sm text-[#9FB0A7] mb-5 leading-relaxed">
            One actionable growth tactic every week. No spam.
          </p>

          <form onSubmit={handleSubscribe} className="relative flex flex-col gap-2">
            {/* Honeypot field (hidden from view) */}
            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0"
              aria-hidden="true"
            />

            {/* Input pill */}
            <div
              className={`relative flex items-center rounded-full bg-[#080D0A] border p-1 transition-all duration-300 ${
                hasShaken ? 'border-red-500' : 'border-[#1A2420] focus-within:border-[#22C55E] focus-within:ring-2 focus-within:ring-[#22C55E]/20'
              }`}
              style={{
                animation: hasShaken ? 'footerShake 0.4s ease-in-out' : 'none',
              }}
            >
              <style>{`
                @keyframes footerShake {
                  0%, 100% { transform: translateX(0); }
                  20%, 60% { transform: translateX(-6px); }
                  40%, 80% { transform: translateX(6px); }
                }
              `}</style>
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Work Email Address
              </label>
              <HiOutlineEnvelope className="h-5 w-5 text-[#5B6B63] ml-3.5 shrink-0" aria-hidden="true" />
              <input
                id="footer-newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your work email"
                aria-describedby="footer-newsletter-status"
                className="w-full bg-transparent pl-3 pr-2 py-2.5 text-sm text-white placeholder:text-[#5B6B63] focus:outline-none"
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe to weekly marketing playbook"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] text-white flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md shadow-[#16A34A]/25"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : status === 'success' ? (
                  <HiCheck className="h-5 w-5 text-white" />
                ) : (
                  <HiArrowRight className="h-4 w-4 text-white" />
                )}
              </button>
            </div>

            {/* Reserved line for accessible message (prevents layout shifts) */}
            <div
              id="footer-newsletter-status"
              aria-live="polite"
              className="min-h-[22px] px-2 text-xs flex items-center"
            >
              {status === 'success' && (
                <span className="text-[#22C55E] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  {message}
                </span>
              )}
              {status === 'error' && (
                <span className="text-red-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
