'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { registerGsapPlugins, gsap } from '@/lib/gsap-register';
import { aboutContent } from '@/data/about';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const AboutCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marquee1Ref = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const markerBarRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  // Marquee scroll animation
  useGSAP(
    () => {
      if (prefersReduced || !sectionRef.current) return;
      registerGsapPlugins();

      if (marquee1Ref.current && marquee2Ref.current) {
        gsap.to(marquee1Ref.current, {
          x: -300,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(marquee2Ref.current, {
          x: 300,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Highlighter bar wipe
      if (markerBarRef.current) {
        gsap.to(markerBarRef.current, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: markerBarRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    },
    { dependencies: [prefersReduced] }
  );

  // Magnetic hover on button & ink-splash canvas effect (desktop fine-pointer only)
  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || !buttonRef.current) return;

    const btn = buttonRef.current;
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.hypot(distX, distY);

      if (distance < 90) {
        xTo(distX * 0.28);
        yTo(distY * 0.28);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    // Canvas ink droplets splash on hover
    const canvas = canvasRef.current;
    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number }[] = [];

    const handleMouseEnter = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Spawn up to 35 soft green droplets
      particles = Array.from({ length: 32 }).map(() => ({
        x: rect.width / 2,
        y: rect.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: Math.random() * 3 + 1.5,
        alpha: 0.8,
        life: 0,
      }));

      const animateParticles = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        let alive = false;
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // subtle gravity
          p.life += 0.02;
          p.alpha = Math.max(0, 0.8 - p.life);

          if (p.alpha > 0) {
            alive = true;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`;
            ctx.fill();
          }
        });

        if (alive) {
          animId = requestAnimationFrame(animateParticles);
        } else {
          ctx.clearRect(0, 0, rect.width, rect.height);
        }
      };

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(animateParticles);
    };

    btn.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      btn.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-cta-title"
      className="relative bg-[#0B0F0D] py-20 sm:py-28 lg:py-36 overflow-x-clip text-center"
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#16A34A]/15 via-[#22C55E]/5 to-transparent blur-3xl" />

        {/* Slow Faint Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(to right, #22C55E 1px, transparent 1px), linear-gradient(to bottom, #22C55E 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Decorative Marquee: Repeating cta.button text as outline text (aria-hidden, hidden on reduced motion) */}
        {!prefersReduced && (
          <div className="decorative-ghost motion-reduce:hidden absolute inset-0 flex flex-col justify-around opacity-[0.06] select-none pointer-events-none">
            <div
              ref={marquee1Ref}
              className="whitespace-nowrap font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-transparent tracking-wider"
              style={{ WebkitTextStroke: '1.5px #22C55E' }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6">
                  {aboutContent.cta.button}
                </span>
              ))}
            </div>
            <div
              ref={marquee2Ref}
              className="whitespace-nowrap font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-transparent tracking-wider"
              style={{ WebkitTextStroke: '1.5px #B6F23D' }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6">
                  {aboutContent.cta.button}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-[92%] sm:w-[85%] max-w-4xl mx-auto flex flex-col items-center">
        {/* H2 Title */}
        <h2
          id="about-cta-title"
          className="font-display font-extrabold text-white text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.12] tracking-[-0.03em] mb-6"
        >
          <span>Ready to Take Your Business to the </span>
          <span className="relative inline-block">
            <span
              ref={markerBarRef}
              aria-hidden="true"
              className="absolute inset-0 -skew-x-6 bg-gradient-to-r from-[#16A34A]/30 to-[#22C55E]/30 rounded-lg -z-0"
              style={{ clipPath: prefersReduced ? 'none' : 'inset(0 100% 0 0)' }}
            />
            <span className="bg-gradient-to-r from-[#22C55E] to-[#B6F23D] bg-clip-text text-transparent">
              Next Level?
            </span>
          </span>
        </h2>

        {/* CTA Paragraph */}
        <p className="text-base sm:text-xl text-[#9FB0A7] leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12">
          {aboutContent.cta.text}
        </p>

        {/* Single Button linking to /contact */}
        <div className="relative inline-flex items-center justify-center w-full sm:w-auto">
          {/* Ink splash canvas */}
          <canvas
            ref={canvasRef}
            width={380}
            height={200}
            aria-hidden="true"
            className="absolute pointer-events-none -inset-16 z-20 hidden md:block"
          />

          <Link
            ref={buttonRef}
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-bold text-sm sm:text-base border border-[#22C55E]/50 shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:shadow-[0_0_45px_rgba(34,197,94,0.6)] hover:border-[#22C55E] transition-all duration-300 w-full sm:w-auto select-none"
          >
            {/* Soft pulsing glow behind */}
            <span
              aria-hidden="true"
              className="absolute -inset-1 rounded-full bg-[#22C55E] opacity-25 group-hover:opacity-50 blur-md transition-opacity"
            />
            <span className="relative z-10">{aboutContent.cta.button}</span>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="relative z-10 w-4 h-4 fill-current transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: '@media (prefers-reduced-motion: reduce) { .decorative-ghost { display: none !important; } }' }} />
    </section>
  );
};
