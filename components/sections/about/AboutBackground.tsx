'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AboutBackgroundProps {
  className?: string;
  withGrowthLine?: boolean;
}

export const AboutBackground: React.FC<AboutBackgroundProps> = ({
  className = '',
  withGrowthLine = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Mouse-follow spotlight (desktop only)
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      spotlightRef.current.style.opacity = '0.35';
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Subtle radial gradient dark mask */}
      <div className="absolute inset-0 bg-[#0B0F0D]" />

      {/* Faint Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(to right, #22C55E 1px, transparent 1px), linear-gradient(to bottom, #22C55E 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
        }}
      />

      {/* Mouse Spotlight (Desktop only) */}
      {!prefersReduced && (
        <div
          ref={spotlightRef}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-radial from-[#22C55E]/15 to-transparent blur-3xl pointer-events-none transition-transform duration-75 ease-out opacity-0 hidden md:block"
          style={{ willChange: 'transform' }}
        />
      )}

      {/* Static Green Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#16A34A]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] rounded-full bg-[#22C55E]/8 blur-[100px] pointer-events-none" />

      {/* 20 Rising Green Particles (CSS driven, <= 20) */}
      {!prefersReduced && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 18 }).map((_, i) => {
            const left = `${(i * 5.5 + 4) % 94}%`;
            const duration = `${12 + (i % 7) * 2}s`;
            const delay = `${(i % 5) * 1.8}s`;
            const size = (i % 3) + 2;
            return (
              <span
                key={i}
                className="absolute rounded-full bg-[#22C55E] animate-about-float"
                style={{
                  left,
                  bottom: '-10px',
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: 0.2 + (i % 4) * 0.1,
                  animationDuration: duration,
                  animationDelay: delay,
                  boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Growth Line: SVG polyline with arrowhead, 2px green */}
      {withGrowthLine && (
        <svg
          className="absolute inset-x-0 bottom-6 sm:bottom-12 w-full h-32 sm:h-44 pointer-events-none opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 1200 150"
        >
          <defs>
            <linearGradient id="growthLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0" />
              <stop offset="30%" stopColor="#22C55E" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#22C55E" stopOpacity="1" />
              <stop offset="100%" stopColor="#B6F23D" stopOpacity="0.9" />
            </linearGradient>
            <marker
              id="growthArrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#B6F23D" />
            </marker>
          </defs>
          <path
            d="M 0,130 C 250,130 350,90 550,75 C 750,60 900,30 1190,15"
            fill="none"
            stroke="url(#growthLineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd="url(#growthArrow)"
            className={prefersReduced ? '' : 'animate-growth-pulse'}
          />
        </svg>
      )}

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        @keyframes aboutFloat {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-800px);
            opacity: 0;
          }
        }
        @keyframes growthPulse {
          0%, 100% {
            opacity: 0.35;
            filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
          }
          50% {
            opacity: 0.7;
            filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.8));
          }
        }
        .animate-about-float {
          animation: aboutFloat linear infinite;
        }
        .animate-growth-pulse {
          animation: growthPulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
