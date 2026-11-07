'use client';

import React from 'react';

interface FooterBackgroundProps {
  spotlightRef: React.RefObject<HTMLDivElement | null>;
}

// 10 subtle floating growth spark particles with distinct positions and timing
const PARTICLES = [
  { id: 1, left: '6%', size: 3, duration: 11, delay: 0, color: '#22C55E' },
  { id: 2, left: '16%', size: 2, duration: 14, delay: 3, color: '#16A34A' },
  { id: 3, left: '28%', size: 4, duration: 9, delay: 1.5, color: '#B6F23D' },
  { id: 4, left: '38%', size: 2.5, duration: 13, delay: 5, color: '#22C55E' },
  { id: 5, left: '50%', size: 3, duration: 10, delay: 2, color: '#16A34A' },
  { id: 6, left: '62%', size: 3.5, duration: 12, delay: 4.5, color: '#B6F23D' },
  { id: 7, left: '74%', size: 2, duration: 15, delay: 1, color: '#22C55E' },
  { id: 8, left: '83%', size: 4, duration: 9.5, delay: 3.5, color: '#16A34A' },
  { id: 9, left: '92%', size: 2.5, duration: 13.5, delay: 6, color: '#22C55E' },
  { id: 10, left: '46%', size: 3, duration: 11.5, delay: 7, color: '#B6F23D' },
];

export const FooterBackground: React.FC<FooterBackgroundProps> = ({ spotlightRef }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* ── Keyframes for background animation ── */}
      <style>{`
        @keyframes footerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(320%); }
        }
        @keyframes footerSweepGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(320%); }
        }
        @keyframes particleFloat {
          0% {
            transform: translate3d(0, 100%, 0) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.65;
          }
          75% {
            opacity: 0.65;
          }
          100% {
            transform: translate3d(0, -120px, 0) scale(1.15);
            opacity: 0;
          }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.02); }
        }
      `}</style>

      {/* ── Sweeping Light Beam on Top Border ── */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden z-20 pointer-events-none">
        {/* Soft Aura Trail */}
        <div
          className="w-1/3 h-1 -top-0.5 absolute bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent blur-[2px]"
          style={{ animation: 'footerSweepGlow 6.5s ease-in-out infinite' }}
        />
        {/* Sharp Laser Beam */}
        <div
          className="w-1/4 h-full absolute bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-95"
          style={{ animation: 'footerSweep 6.5s ease-in-out infinite' }}
        />
      </div>

      {/* ── 3 Floating Glowing Orbs (Aurora effect) ── */}
      {/* Orb 1: Emerald Top-Left */}
      <div className="footer-orb-1 absolute top-1/4 -left-24 w-[520px] h-[520px] bg-[#16A34A]/12 rounded-full blur-[140px]" />

      {/* Orb 2: Mint Center-Right */}
      <div className="footer-orb-2 absolute bottom-1/4 -right-24 w-[540px] h-[540px] bg-[#22C55E]/10 rounded-full blur-[150px]" />

      {/* Orb 3: Lime Horizon Glow behind Wordmark at Bottom */}
      <div className="footer-orb-3 absolute -bottom-16 left-1/2 -translate-x-1/2 w-[720px] h-[260px] bg-gradient-to-t from-[#B6F23D]/12 via-[#16A34A]/14 to-transparent rounded-full blur-[120px]" />

      {/* ── Faint Dotted Radial Grid with Gentle Pulse ── */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#1A2420_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"
        style={{
          animation: 'gridPulse 9s ease-in-out infinite',
        }}
      />

      {/* ── Floating Growth Sparkles / Particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 rounded-full will-change-transform"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              animation: `particleFloat ${p.duration}s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Interactive Mouse Spotlight (Follows cursor on desktop) ── */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute w-[460px] h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.16)_0%,rgba(22,163,74,0.06)_40%,transparent_70%)] opacity-0 transition-opacity duration-300 blur-2xl z-10"
      />
    </div>
  );
};

