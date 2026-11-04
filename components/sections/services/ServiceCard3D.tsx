'use client';

import React, { useRef, useEffect } from 'react';
import { HiArrowRight, HiBolt, HiCheckCircle } from 'react-icons/hi2';
import { ServiceItem } from '@/data/services';
import { serviceIcons } from './serviceIcons';
import { gsap } from '@/lib/gsap-register';

export interface ServiceCard3DProps {
  service: ServiceItem;
  isActive: boolean;
  onSelectService: (serviceTitle: string) => void;
  isFastScrolling?: boolean;
  className?: string;
}

export const ServiceCard3D: React.FC<ServiceCard3DProps> = ({
  service,
  isActive,
  onSelectService,
  isFastScrolling = false,
  className = '',
}) => {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const quickRotXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickRotYRef = useRef<gsap.QuickToFunc | null>(null);

  const Icon = serviceIcons[service.iconKey] || HiBolt;

  // Initialize mouse tilt quickTo handlers
  useEffect(() => {
    if (!cardInnerRef.current) return;

    quickRotXRef.current = gsap.quickTo(cardInnerRef.current, 'rotateX', {
      duration: 0.35,
      ease: 'power2.out',
    });
    quickRotYRef.current = gsap.quickTo(cardInnerRef.current, 'rotateY', {
      duration: 0.35,
      ease: 'power2.out',
    });

    return () => {
      quickRotXRef.current = null;
      quickRotYRef.current = null;
    };
  }, []);

  // Stagger sub-service chips when card becomes active
  useEffect(() => {
    if (!chipsRef.current) return;

    if (isActive) {
      const items = Array.from(chipsRef.current.children);
      gsap.fromTo(
        items,
        { y: 18, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: 'back.out(1.6)',
          overwrite: true,
        }
      );
    } else {
      gsap.set(chipsRef.current.children, { opacity: 0.4, y: 0, scale: 1 });
    }
  }, [isActive]);

  // Mouse move tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || isFastScrolling || !cardInnerRef.current) return;

    const rect = cardInnerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const maxTilt = 8;
    const targetRotX = -ny * maxTilt * 2;
    const targetRotY = nx * maxTilt * 2;

    quickRotXRef.current?.(targetRotX);
    quickRotYRef.current?.(targetRotY);

    if (glareRef.current) {
      const px = ((nx + 0.5) * 100).toFixed(1);
      const py = ((ny + 0.5) * 100).toFixed(1);
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255, 255, 255, 0.45) 0%, rgba(34, 197, 94, 0.08) 40%, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    quickRotXRef.current?.(0);
    quickRotYRef.current?.(0);
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Glass Card Container */}
      <div
        ref={cardInnerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-text={isActive ? 'View' : undefined}
        onClick={() => {
          if (isActive) onSelectService(service.title);
        }}
        tabIndex={isActive ? 0 : -1}
        role="article"
        aria-label={`${service.number} ${service.title}`}
        className={`relative w-[340px] sm:w-[460px] lg:w-[520px] min-h-[420px] sm:min-h-[440px] rounded-3xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
          isActive
            ? 'pointer-events-auto cursor-pointer shadow-[0_24px_60px_-12px_rgba(0,0,0,0.12),0_0_35px_rgba(22,163,74,0.18)] border border-[#16A34A]/50 bg-white/95 backdrop-blur-xl'
            : 'pointer-events-none opacity-80 border border-gray-200 bg-white/80 backdrop-blur-md shadow-lg shadow-black/5'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Dynamic Glare Overlay */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 z-30"
        />

        {/* Subtle Ambient Border Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#16A34A]/10 via-transparent to-[#B6F23D]/5 pointer-events-none z-0" />

        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#16A34A]/40 to-transparent pointer-events-none" />

        {/* Top Header Row (TranslateZ: 30px) */}
        <div
          className="relative z-10 flex items-center justify-between"
          style={{ transform: 'translateZ(30px)' }}
        >
          {/* Number Chip */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#16A34A] bg-[#16A34A]/10 border border-[#16A34A]/25 px-3 py-1 rounded-full">
              {service.number}
            </span>
            {service.badge && (
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#15803D] bg-[#16A34A]/15 border border-[#16A34A]/30 px-2.5 py-1 rounded-full">
                {service.badge}
              </span>
            )}
          </div>

          {/* Floating Icon Container (TranslateZ: 65px + float animation) */}
          <div
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#15803D] border border-[#22C55E]/40 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(22,163,74,0.3)] transition-transform duration-300"
            style={{
              transform: 'translateZ(65px)',
              animation: isActive ? 'cardIconFloat 3.5s ease-in-out infinite' : 'none',
            }}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Card Body: Title & Description (TranslateZ: 45px & 30px) */}
        <div className="relative z-10 my-4 sm:my-5">
          <h3
            className="text-2xl sm:text-3xl font-extrabold text-[#0B0F0D] tracking-tight leading-snug"
            style={{ transform: 'translateZ(45px)' }}
          >
            {service.title}
          </h3>
          <p
            className="mt-2.5 text-sm sm:text-base text-[#5B6B63] leading-relaxed line-clamp-2"
            style={{ transform: 'translateZ(30px)' }}
          >
            {service.shortDescription}
          </p>
        </div>

        {/* Sub-Services Pill Chips (TranslateZ: 55px) */}
        <div
          ref={chipsRef}
          className="relative z-10 flex flex-wrap gap-2 my-2"
          style={{ transform: 'translateZ(55px)' }}
        >
          {service.subServices.map((sub, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F6FAF7] border border-gray-200 text-[#0B0F0D] group-hover:border-[#16A34A]/40 transition-colors"
            >
              <HiCheckCircle className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span>{sub}</span>
            </span>
          ))}
        </div>

        {/* Card Footer: Action Button (TranslateZ: 75px) */}
        <div
          className="relative z-10 pt-4 mt-2 border-t border-gray-100 flex items-center justify-between"
          style={{ transform: 'translateZ(75px)' }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectService(service.title);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#16A34A] hover:text-[#15803D] transition-colors group/btn cursor-pointer"
          >
            <span>Explore Service</span>
            <HiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </button>

          <span className="text-[11px] font-mono text-[#5B6B63]">
            Click to book consultation
          </span>
        </div>
      </div>

      {/* Floor Shadow / Reflection Ellipse */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[34px] bg-[#16A34A]/20 blur-2xl rounded-full pointer-events-none transition-all duration-500"
        style={{
          opacity: isActive ? 0.75 : 0.2,
          transform: `translateX(-50%) scale(${isActive ? 1 : 0.75})`,
        }}
      />
    </div>
  );
};
