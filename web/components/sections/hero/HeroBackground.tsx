'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─────────────────────────────────────────────────────────────
   PARTICLE SYSTEM
   30-40 tiny green dots rising upward, mouse-reactive
───────────────────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vy: number;
  size: number;
  opacity: number;
  speed: number;
}

function initParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vy: -(0.3 + Math.random() * 0.9),
    size: 1 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.55,
    speed: 0.3 + Math.random() * 0.7,
  }));
}

/* ─────────────────────────────────────────────────────────────
   MOUSE SPOTLIGHT — lazy-imported to avoid SSR issues
───────────────────────────────────────────────────────────── */
function useMouseSpotlight(spotlightRef: React.RefObject<HTMLDivElement | null>) {
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    let gsapInstance: typeof import('gsap').default | null = null;

    async function init() {
      const { default: gsap } = await import('gsap');
      gsapInstance = gsap;

      if (!spotlightRef.current) return;
      xTo.current = gsap.quickTo(spotlightRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
      yTo.current = gsap.quickTo(spotlightRef.current, 'y', { duration: 0.6, ease: 'power2.out' });
    }

    init();

    function onMove(e: MouseEvent) {
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [spotlightRef]);
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useMouseSpotlight(spotlightRef);

  /* ── Particle canvas ── */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hidden = false;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height, 38);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMouse(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouse, { passive: true });

    function onVisibility() {
      hidden = document.hidden;
    }
    document.addEventListener('visibilitychange', onVisibility);

    function draw() {
      if (hidden || !canvas || !ctx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mouse parallax offset (max ±8px)
      const mx = (mouseRef.current.x / (window.innerWidth || 1) - 0.5) * 16;
      const my = (mouseRef.current.y / (window.innerHeight || 1) - 0.5) * 16;

      for (const p of particlesRef.current) {
        // Depth-based parallax (size is proxy for depth)
        const depthFactor = p.size / 3.5;
        const px = p.x + mx * depthFactor;
        const py = p.y + my * depthFactor;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,197,94,${p.opacity})`;
        ctx.fill();

        p.y += p.vy * p.speed;

        // Reset when off-screen top
        if (p.y + p.size < 0) {
          p.y = canvas.height + p.size;
          p.x = Math.random() * canvas.width;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* ── Film-grain SVG noise ── */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── 48px grid with radial fade mask ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0,0,0,0.9) 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0,0,0,0.9) 0%, transparent 100%)',
        }}
      />

      {/* ── Mouse spotlight ── */}
      {!prefersReducedMotion && (
        <div
          ref={spotlightRef}
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            top: 0,
            left: 0,
            willChange: 'transform',
          }}
        />
      )}

      {/* ── Rising particles canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
