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
  HiLockClosed,
} from 'react-icons/hi2';
import { FiUser, FiMail, FiPhone, FiTarget } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { submitLead, LeadPayload } from '@/lib/api';
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

const leadFormSchema = z.object({
  name: z.string().min(2, 'Full name is required (at least 2 letters)'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(7, 'Please enter a valid contact number (min 7 digits)'),
  service: z.string().optional(),
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

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload: LeadPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service || defaultService || 'General Consultation',
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container (Light Design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200/90 shadow-[0_25px_70px_rgba(0,0,0,0.35)] z-10 overflow-hidden my-auto text-gray-900"
          >
            {/* Top ambient green accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#15803D]" />

            {/* Floating Close Button */}
            <button
              onClick={handleCloseAndReset}
              aria-label="Close modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-200 transition-all cursor-pointer group"
            >
              <HiXMark className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>

            {isSuccess ? (
              /* ─── SUCCESS VIEW (LIGHT THEME) ─── */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto"
              >
                {/* Glowing Checkmark Badge */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-2 border-[#16A34A] mb-5 shadow-[0_0_30px_rgba(22,163,74,0.2)]">
                  <motion.svg
                    className="w-10 h-10 text-[#16A34A]"
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

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#16A34A] bg-green-50 border border-green-200 mb-3">
                  <HiSparkles className="w-3.5 h-3.5" />
                  Strategy Session Confirmed
                </span>

                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-3">
                  You&apos;re On The Fast Track To Growth!
                </h3>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Thank you, <strong className="text-gray-900">{submittedData?.name}</strong>. A dedicated growth strategist is reviewing your requirements and will reach out with custom benchmarks within{' '}
                  <span className="text-[#16A34A] font-semibold">24 hours</span>.
                </p>

                {/* Submission Snapshot Box */}
                <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left mb-6 text-xs text-gray-600 space-y-2">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-medium">Contact:</span>
                    <span className="text-gray-900 font-semibold">{submittedData?.phone} • {submittedData?.email}</span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-gray-500 font-medium">Status:</span>
                    <span className="text-[#16A34A] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                      Routed to Senior Strategist
                    </span>
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <FaWhatsapp className="w-4 h-4 text-white" />
                    <span>Chat on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleCloseAndReset}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gray-100 border border-gray-200 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ─── CLEAN LIGHT CONSULTATION FORM ─── */
              <div className="p-6 sm:p-9 relative">
                {/* Subtle corner light gradient accent */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-green-100/70 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-6 pr-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[#16A34A] text-xs font-semibold uppercase tracking-wider mb-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                      </span>
                      Get In Touch
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 tracking-tight">
                      Let&apos;s Talk <span className="text-[#16A34A]">Growth!</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
                      Tell us about your brand. Takes less than 60 seconds — zero obligation.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Service Interested In Chips (Commented out per user request) */}
                    {/*
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Service Interested In <span className="text-[#16A34A]">*</span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-mono">Select primary goal</span>
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
                                  ? 'bg-[#16A34A]/15 border-[#16A34A] text-[#16A34A] font-semibold'
                                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#16A34A]/40'
                              }`}
                            >
                              {isSelected && <HiCheck className="w-3.5 h-3.5 text-[#16A34A]" />}
                              <span>{serviceTitle}</span>
                            </button>
                          );
                        })}
                      </div>
                      <input type="hidden" {...register('service')} />
                    </div>
                    */}

                    {/* Contact Fields */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Your Name <span className="text-[#16A34A]">*</span>
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Rahul Sharma"
                            {...register('name')}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/90 border text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all ${
                              errors.name ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Your Email <span className="text-[#16A34A]">*</span>
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              placeholder="rahul@company.com"
                              {...register('email')}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/90 border text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all ${
                                errors.email ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Phone / WhatsApp <span className="text-[#16A34A]">*</span>
                          </label>
                          <div className="relative">
                            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              {...register('phone')}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/90 border text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all ${
                                errors.phone ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Requirements / Remarks */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Your Requirements / Remarks <span className="text-gray-400 font-normal lowercase">(optional)</span>
                          </label>
                        </div>

                        <div className="relative">
                          <FiTarget className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                          <textarea
                            rows={3}
                            placeholder="e.g. Target: 200+ qualified leads per month for real estate in Bangalore..."
                            {...register('message')}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/90 border border-gray-200 hover:border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#16A34A] to-[#15803D] hover:from-[#15803D] hover:to-[#166534] transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
                      <HiLockClosed className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>100% Confidential • NDA Guaranteed • Zero Spam Policy</span>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
