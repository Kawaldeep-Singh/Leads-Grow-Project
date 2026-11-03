'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX, HiCheck, HiOutlineSparkles } from 'react-icons/hi';
import confetti from 'canvas-confetti';
import { submitLead, LeadPayload } from '@/lib/api';
import { servicesData } from '@/data/services';
import { Button } from './Button';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Full name is required (at least 2 letters)'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(7, 'Please enter a valid contact number'),
  service: z.string().min(1, 'Please choose a primary service'),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      service: defaultService || servicesData[0].title,
      message: '',
    },
  });

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
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#22C55E', '#B6F23D', '#FFFFFF'],
      });

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shakeAnimation = {
    x: [0, -6, 6, -6, 6, 0],
    transition: { duration: 0.4 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0F0D]/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl rounded-3xl bg-[#111815] border border-[#1A2420] p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top glowing ambient highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent blur-sm" />

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full text-[#9FB0A7] hover:text-white hover:bg-white/5 transition-colors"
            >
              <HiX className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center flex flex-col items-center justify-center"
              >
                {/* Animated checkmark circle */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#16A34A]/20 border border-[#22C55E]/40 mb-6">
                  <motion.svg
                    className="w-10 h-10 text-[#22C55E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
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

                <h3 className="text-2xl font-bold text-white mb-2">
                  Strategy Call Requested!
                </h3>
                <p className="text-[#9FB0A7] text-sm max-w-md mx-auto leading-relaxed">
                  Thank you! Our growth strategist will review your brand requirements and contact you within{' '}
                  <span className="text-[#22C55E] font-semibold">24 hours</span>.
                </p>
                <div className="mt-6 text-xs text-[#5B6B63]">
                  Window will automatically close shortly...
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4 pr-8">
                    <div className="relative h-8 w-44">
                      <Image
                        src="/Logo-Light.webp"
                        alt="LeadsGrow Logo"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#16A34A]/15 text-[#22C55E] border border-[#16A34A]/30">
                      <HiOutlineSparkles className="h-3 w-3 text-[#B6F23D]" />
                      <span>Free Strategy Call</span>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Let&apos;s Talk <span className="text-gradient">Growth!</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9FB0A7] mt-1">
                    Tell us about your project and we will prepare custom ROI benchmarks for your industry.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('name')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#0B0F0D] border text-sm text-white placeholder:text-[#5B6B63] focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                        errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#1A2420]'
                      }`}
                    />
                    {errors.name && (
                      <motion.p
                        animate={shakeAnimation}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        placeholder="rahul@company.com"
                        {...register('email')}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0B0F0D] border text-sm text-white placeholder:text-[#5B6B63] focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                          errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-[#1A2420]'
                        }`}
                      />
                      {errors.email && (
                        <motion.p
                          animate={shakeAnimation}
                          className="text-red-400 text-xs mt-1"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        {...register('phone')}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0B0F0D] border text-sm text-white placeholder:text-[#5B6B63] focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                          errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-[#1A2420]'
                        }`}
                      />
                      {errors.phone && (
                        <motion.p
                          animate={shakeAnimation}
                          className="text-red-400 text-xs mt-1"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Primary Service Select */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                      Service Interested In *
                    </label>
                    <select
                      {...register('service')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#0B0F0D] border text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                        errors.service ? 'border-red-500 ring-1 ring-red-500' : 'border-[#1A2420]'
                      }`}
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title} className="bg-[#111815] text-white">
                          {s.title}
                        </option>
                      ))}
                      <option value="All Marketing & Growth Services" className="bg-[#111815] text-white">
                        Complete Growth Package (All-in-One)
                      </option>
                    </select>
                  </div>

                  {/* Message (optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#9FB0A7] uppercase tracking-wider mb-1.5">
                      Your Goals / Requirements (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We are targeting 200+ qualified leads per month for our real estate project in Bangalore..."
                      {...register('message')}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0B0F0D] border border-[#1A2420] text-sm text-white placeholder:text-[#5B6B63] focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="glow"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting Request...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Request Free Strategy Session
                          <HiOutlineSparkles className="h-4 w-4 text-[#B6F23D]" />
                        </span>
                      )}
                    </Button>
                  </div>

                  <p className="text-[11px] text-center text-[#5B6B63]">
                    🔒 We respect your privacy. No spam. 100% confidential.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

