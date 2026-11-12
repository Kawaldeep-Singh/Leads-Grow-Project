'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import { FaQuoteLeft } from 'react-icons/fa';
import { testimonialsData } from '@/data/testimonials';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = testimonialsData.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const activeTestimonial = testimonialsData[activeIndex];

  return (
    <section
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#F6FAF7] py-12 sm:py-16 overflow-hidden border-b border-gray-200"
    >
      {/* Decorative Parallax Quote Icon Background */}
      <div className="absolute top-12 right-12 text-gray-200/50 pointer-events-none select-none">
        <FaQuoteLeft className="w-48 h-48 sm:w-72 sm:h-72 opacity-30" />
      </div>

      <div className="w-[92%] sm:w-[85%] mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-6">
          <SectionHeading
            badge="Sample feedback"
            plainText="What Our"
            highlightText="Clients Say"
            subtext="Illustrative examples only; replace with approved customer reviews before publishing."
            align="center"
            theme="light"
          />
        </div>

        {/* Center-Focused Carousel */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          <div className="min-h-[420px] sm:min-h-[340px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="w-full rounded-2xl sm:rounded-3xl bg-white border border-gray-200 p-5 sm:p-8 md:p-12 shadow-xl shadow-gray-200/50 relative overflow-hidden"
              >
                {/* This placeholder content is not attributed to a real person. */}
                <div className="mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A]">
                    Illustrative example
                  </span>
                </div>

                {/* Highlight Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#0B0F0D] mb-4">
                  &ldquo;{activeTestimonial.highlight}&rdquo;
                </h3>

                {/* Main Quote */}
                <p className="text-sm sm:text-base text-[#5B6B63] leading-relaxed mb-8 italic">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </p>

                <div className="border-t border-gray-100 pt-5">
                  <p className="text-sm font-semibold text-[#0B0F0D]">
                    {activeTestimonial.name}
                  </p>
                  <p className="mt-1 text-xs text-[#5B6B63]">
                    {activeTestimonial.role} · {activeTestimonial.company}
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center justify-between mt-8">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="p-3 rounded-full bg-white border border-gray-200 text-[#0B0F0D] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === index
                      ? 'w-8 bg-[#16A34A]'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="p-3 rounded-full bg-white border border-gray-200 text-[#0B0F0D] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
