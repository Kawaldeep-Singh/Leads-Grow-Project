'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HiXMark,
  HiCheck,
  HiArrowRight,
  HiSparkles,
  HiShieldCheck,
  HiLockClosed,
} from 'react-icons/hi2';
import { FiUser, FiMail, FiPhone, FiTarget, FiTrendingUp, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { submitLead, LeadPayload } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';
import { BRAND } from '@/lib/constants';

const SERVICE_OPTIONS = [
  'Performance Marketing',
  'Lead Generation',
  'Digital Marketing',
  'Website Development',
  'App Development',
  'Creative & Design',
  'Marketing Automation',
  'Complete Growth Suite',
];

const QUICK_GOALS = [
  '🎯 200+ Qualified Leads/mo',
  '📈 Scale ROAS to 4x+',
  '💻 High-Converting Website',
  '⚡ Full-Funnel Automation',
];

const leadFormSchema = z.object({
  name: z.string().min(2, 'Full name is required (at least 2 letters)'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(7, 'Please enter a valid contact number (min 7 digits)'),
  service: z.string().min(1, 'Please select a primary service'),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  source?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  source = 'modal',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);

  const initialService =
    defaultService && SERVICE_OPTIONS.includes(defaultService)
      ? defaultService
      : SERVICE_OPTIONS[0];

  const [activeService, setActiveService] = useState<string>(initialService);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: initialService,
      message: '',
    },
  });

  useEffect(() => {
    if (defaultService) {
      setActiveService(defaultService);
      setValue('service', defaultService);
    }
  }, [defaultService, setValue]);

  const currentMessage = watch('message') || '';

  const handleQuickGoalClick = (goal: string) => {
    if (!currentMessage) {
      setValue('message', `Target goal: ${goal}`);
    } else if (!currentMessage.includes(goal)) {
      setValue('message', `${currentMessage} • ${goal}`);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: LeadPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        source,
      };

      await submitLead(payload);
      setSubmittedData(data);
      setIsSuccess(true);

      // Trigger celebratory multi-angle confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#22C55E', '#B6F23D', '#FFFFFF'],
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setErrorMessage(null);
    reset();
    onClose();
  };

  const whatsappMessage = submittedData
    ? `Hi LeadsGrow team, I just booked a Strategy Call for ${submittedData.service} (Name: ${submittedData.name}). Looking forward to connecting!`
    : BRAND.whatsappMessage;

  const whatsappUrl = `https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseAndReset}
            className="fixed inset-0 bg-[#070B09]/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-4xl rounded-3xl bg-[#0D1411] border border-[#1E2E25] shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_100px_rgba(34,197,94,0.12)] z-10 overflow-hidden my-auto"
          >
            {/* Top ambient glow line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/70 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#22C55E]/20 blur-3xl pointer-events-none" />

            {/* Floating Close Button */}
            <button
              onClick={handleCloseAndReset}
              aria-label="Close modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 rounded-full bg-[#131D18] border border-[#213329] flex items-center justify-center text-[#9FB0A7] hover:text-white hover:border-[#22C55E]/50 hover:bg-[#1A2A22] transition-all cursor-pointer group"
            >
              <HiXMark className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>

            {isSuccess ? (
              /* ─── SUCCESS VIEW ─── */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto"
              >
                {/* Glowing Checkmark Badge */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#16A34A]/20 border-2 border-[#22C55E] mb-6 shadow-[0_0_40px_rgba(34,197,94,0.35)]">
                  <motion.svg
                    className="w-10 h-10 text-[#22C55E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17L4 12"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </motion.svg>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest text-[#B6F23D] bg-[#B6F23D]/10 border border-[#B6F23D]/30 mb-3">
                  <HiSparkles className="w-3.5 h-3.5" />
                  Strategy Session Confirmed
                </span>

                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
                  You&apos;re On The Fast Track To Growth!
                </h3>

                <p className="text-[#9FB0A7] text-sm sm:text-base leading-relaxed mb-6">
                  Thank you, <strong className="text-white">{submittedData?.name}</strong>. A dedicated growth strategist is reviewing your requirements for{' '}
                  <span className="text-[#22C55E] font-semibold">{submittedData?.service}</span> and will reach out with custom benchmarks within{' '}
                  <span className="text-white font-semibold">24 hours</span>.
                </p>

                {/* Submission Snapshot Box */}
                <div className="w-full bg-[#080E0B] border border-[#1A2820] rounded-2xl p-4 text-left mb-6 text-xs text-[#9FB0A7] space-y-1.5 font-mono">
                  <div className="flex justify-between border-b border-[#142019] pb-1.5">
                    <span className="text-[#5B6B63]">Service:</span>
                    <span className="text-white font-medium">{submittedData?.service}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#142019] pb-1.5">
                    <span className="text-[#5B6B63]">Contact:</span>
                    <span className="text-white">{submittedData?.phone} • {submittedData?.email}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#5B6B63]">Status:</span>
                    <span className="text-[#22C55E] font-bold">● Routed to Senior Strategist</span>
                  </div>
                </div>

                {/* Instant Actions */}
                {/* <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                  >
                    <FaWhatsapp className="w-4 h-4 text-black" />
                    <span>Chat on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#131D18] border border-[#213329] text-white text-sm font-medium hover:bg-[#1A2A22] transition-colors"
                  >
                    Done
                  </button>
                </div> */}

                {/* Instant Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                  >
                    <FaWhatsapp className="w-4 h-4 text-black" />
                    <span>Chat on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#131D18] border border-[#213329] text-white text-sm font-medium hover:bg-[#1A2A22] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ─── SPLIT 2-COLUMN FORM EXPERIENCE ─── */
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* ── Left Column: Value & Credibility Showcase (5 cols) ── */}
                <div className="lg:col-span-5 bg-[#090F0C] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#1B2921] flex flex-col justify-between relative overflow-hidden">
                  {/* Subtle corner glow */}
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    {/* Brand header */}
                    <div className="space-y-3">
                      <Logo variant="light" width={180} />
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A34A]/15 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-mono uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
                        </span>
                        30-Min Strategy Call
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-snug">
                        Scale Your Business With High-Velocity Marketing.
                      </h3>
                      <p className="text-xs sm:text-sm text-[#9FB0A7] mt-2 leading-relaxed">
                        We don&apos;t do generic sales calls. You&apos;ll speak directly with an execution strategist who analyzes your numbers.
                      </p>
                    </div>

                    {/* What you get checklist */}
                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#16A34A]/15 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <FiTrendingUp className="w-3.5 h-3.5 text-[#22C55E]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Competitor & CPL Breakdown</p>
                          <p className="text-[11px] text-[#9FB0A7] leading-relaxed">
                            Exact benchmark metrics of what your competitors spend to acquire customers.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#16A34A]/15 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <FiTarget className="w-3.5 h-3.5 text-[#22C55E]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">90-Day Conversion Roadmap</p>
                          <p className="text-[11px] text-[#9FB0A7] leading-relaxed">
                            A clear step-by-step game plan tailored for your specific revenue targets.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#16A34A]/15 border border-[#22C55E]/30 flex items-center justify-center shrink-0 mt-0.5">
                          <FiClock className="w-3.5 h-3.5 text-[#22C55E]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">24-Hour Fast Turnaround</p>
                          <p className="text-[11px] text-[#9FB0A7] leading-relaxed">
                            Zero waiting time. Receive our preliminary research before the call begins.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust & Guarantee bottom badge */}
                  <div className="relative z-10 pt-6 mt-6 border-t border-[#16231C]">
                    <div className="flex items-center gap-3">
                      <div className="flex text-[#F59E0B] text-xs">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-xs font-bold text-white">4.9 / 5</span>
                      <span className="text-[11px] text-[#5B6B63]">• 120+ Brands Retained</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-[#9FB0A7]">
                      <HiShieldCheck className="w-4 h-4 text-[#22C55E]" />
                      <span>100% Confidential • Zero Spam Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* ── Right Column: Interactive Consultation Form (7 cols) ── */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative">
                  <div>
                    {/* Header */}
                    <div className="mb-5 pr-8">
                      <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                        Let&apos;s Talk <span className="text-gradient">Growth!</span>
                      </h3>
                      <p className="text-xs text-[#9FB0A7] mt-1">
                        Tell us about your brand. Takes less than 60 seconds — zero obligation.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* 1. Interactive Service Selector Chips */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[11px] font-bold text-[#9FB0A7] uppercase tracking-wider">
                            Service Interested In <span className="text-[#22C55E]">*</span>
                          </label>
                          <span className="text-[10px] text-[#5B6B63] font-mono">Select primary goal</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {SERVICE_OPTIONS.map((serviceTitle) => {
                            const isSelected = activeService === serviceTitle;
                            return (
                              <button
                                key={serviceTitle}
                                type="button"
                                onClick={() => {
                                  setActiveService(serviceTitle);
                                  setValue('service', serviceTitle, { shouldValidate: true });
                                }}
                                className={`text-[11px] sm:text-xs px-3 py-1.5 rounded-lg border font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#16A34A]/25 border-[#22C55E] text-white shadow-[0_0_12px_rgba(34,197,94,0.3)] ring-1 ring-[#22C55E]'
                                    : 'bg-[#0B100E] border-[#1C2C22] text-[#9FB0A7] hover:border-[#22C55E]/40 hover:text-white hover:bg-[#111A15]'
                                }`}
                              >
                                {isSelected && <HiCheck className="w-3.5 h-3.5 text-[#22C55E]" />}
                                <span>{serviceTitle}</span>
                              </button>
                            );
                          })}
                        </div>
                        <input type="hidden" {...register('service')} />
                        {errors.service && (
                          <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>
                        )}
                      </div>

                      {/* 2. Contact Fields */}
                      <div className="space-y-3.5 pt-1">
                        {/* Name */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                            Your Name <span className="text-[#22C55E]">*</span>
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6B63]" />
                            <input
                              type="text"
                              placeholder="e.g. Rahul Sharma"
                              {...register('name')}
                              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E0B] border text-xs sm:text-sm text-white placeholder:text-[#4A5751] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all ${
                                errors.name ? 'border-red-500' : 'border-[#1C2C22]'
                              }`}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                              Your Email <span className="text-[#22C55E]">*</span>
                            </label>
                            <div className="relative">
                              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6B63]" />
                              <input
                                type="email"
                                placeholder="rahul@company.com"
                                {...register('email')}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E0B] border text-xs sm:text-sm text-white placeholder:text-[#4A5751] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all ${
                                  errors.email ? 'border-red-500' : 'border-[#1C2C22]'
                                }`}
                              />
                            </div>
                            {errors.email && (
                              <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                              Phone / WhatsApp <span className="text-[#22C55E]">*</span>
                            </label>
                            <div className="relative">
                              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6B63]" />
                              <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                {...register('phone')}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E0B] border text-xs sm:text-sm text-white placeholder:text-[#4A5751] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all ${
                                  errors.phone ? 'border-red-500' : 'border-[#1C2C22]'
                                }`}
                              />
                            </div>
                            {errors.phone && (
                              <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Goals / Message with Quick Suggestions */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[11px] font-bold text-[#9FB0A7] uppercase tracking-wider">
                              Your Requirements / Remarks <span className="text-[#5B6B63]">(Optional)</span>
                            </label>
                          </div>

                          <div className="relative mb-2">
                            <FiTarget className="absolute left-3.5 top-3 w-4 h-4 text-[#5B6B63]" />
                            <textarea
                              rows={2}
                              placeholder="e.g. Target: 200+ qualified leads per month for real estate in Bangalore..."
                              {...register('message')}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080E0B] border border-[#1C2C22] text-xs sm:text-sm text-white placeholder:text-[#4A5751] focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 transition-all resize-none"
                            />
                          </div>

                          {/* Quick suggested goal pills */}
                          {/* <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-[#5B6B63] font-mono mr-1">Quick Add:</span>
                            {QUICK_GOALS.map((goal) => (
                              <button
                                key={goal}
                                type="button"
                                onClick={() => handleQuickGoalClick(goal)}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[#111A15] hover:bg-[#16A34A]/20 border border-[#1C2C22] hover:border-[#22C55E]/40 text-[#9FB0A7] hover:text-white transition-colors cursor-pointer"
                              >
                                {goal}
                              </button>
                            ))}
                          </div> */}
                        </div>
                      </div>

                      {/* 3. High-Voltage Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="relative w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#16A34A] bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.55)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Preparing Your Strategy Roadmap...</span>
                            </>
                          ) : (
                            <>
                              <span>Claim Free Strategy Session</span>
                              <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Security Footnote */}
                      <div className="flex items-center justify-center gap-2 text-[10px] text-[#5B6B63] pt-1">
                        <HiLockClosed className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>100% Confidential • NDA Guaranteed • Zero Spam Policy</span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
