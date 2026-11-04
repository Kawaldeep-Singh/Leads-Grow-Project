'use client';

import React, { useRef, useState, useEffect } from 'react';
import { servicesData } from '@/data/services';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ServiceCard3D } from './ServiceCard3D';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { HiChevronDown } from 'react-icons/hi2';

export interface Services3DProps {
  onSelectService: (serviceTitle: string) => void;
  switchSlot?: React.ReactNode;
}

// Particle interface for 3D depth field
interface DepthParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
}

// Keyframe coordinate model for relative progress p
interface KeyframeTransform {
  z: number;
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
  opacity: number;
  scale: number;
  blur: number;
}

const KEYFRAMES: { [key: string]: KeyframeTransform } = {
  farBehind: { z: -900, x: 200, y: -60, rotateY: -24, rotateX: 4, opacity: 0, scale: 0.6, blur: 8 },
  nextUp: { z: -450, x: 140, y: -40, rotateY: -18, rotateX: 4, opacity: 0.35, scale: 0.82, blur: 3 },
  active: { z: 0, x: 0, y: 0, rotateY: 0, rotateX: 0, opacity: 1, scale: 1, blur: 0 },
  justPassed: { z: 500, x: -260, y: 60, rotateY: 24, rotateX: -3, opacity: 0, scale: 1.18, blur: 6 },
  farAhead: { z: 800, x: -350, y: 100, rotateY: 30, rotateX: -5, opacity: 0, scale: 1.3, blur: 10 },
};

/**
 * Calculates effective p with a 35% center hold zone around p = 0
 * When |rawP| <= 0.20, effective p stays within ±0.03 so the active card rests stably.
 */
function getEffectiveP(rawP: number): number {
  const sign = Math.sign(rawP);
  const abs = Math.abs(rawP);
  if (abs <= 0.18) {
    return sign * (abs * 0.12);
  } else if (abs <= 1.0) {
    const t = (abs - 0.18) / 0.82;
    const easeT = t * t * (3 - 2 * t);
    return sign * (0.02 + 0.98 * easeT);
  } else {
    return rawP;
  }
}

/**
 * Interpolates between keyframes based on effective p
 */
function interpolateCardTransform(p: number): KeyframeTransform {
  if (p >= 2) return KEYFRAMES.farBehind;
  if (p >= 1) {
    const t = p - 1;
    return lerpKeyframe(KEYFRAMES.nextUp, KEYFRAMES.farBehind, t);
  }
  if (p >= 0) {
    const t = p;
    return lerpKeyframe(KEYFRAMES.active, KEYFRAMES.nextUp, t);
  }
  if (p >= -1) {
    const t = -p;
    return lerpKeyframe(KEYFRAMES.active, KEYFRAMES.justPassed, t);
  }
  if (p >= -2) {
    const t = -p - 1;
    return lerpKeyframe(KEYFRAMES.justPassed, KEYFRAMES.farAhead, t);
  }
  return KEYFRAMES.farAhead;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpKeyframe(a: KeyframeTransform, b: KeyframeTransform, t: number): KeyframeTransform {
  return {
    z: lerp(a.z, b.z, t),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    rotateY: lerp(a.rotateY, b.rotateY, t),
    rotateX: lerp(a.rotateX, b.rotateX, t),
    opacity: lerp(a.opacity, b.opacity, t),
    scale: lerp(a.scale, b.scale, t),
    blur: lerp(a.blur, b.blur, t),
  };
}

export const Services3D: React.FC<Services3DProps> = ({
  onSelectService,
  switchSlot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floorGridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isFastScrolling, setIsFastScrolling] = useState<boolean>(false);

  // Big digit roller refs
  const tensDigitRef = useRef<HTMLDivElement>(null);
  const unitsDigitRef = useRef<HTMLDivElement>(null);

  // Static 3D depth particles
  const [particles] = useState<DepthParticle[]>(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 900,
      z: -900 + Math.random() * 1200,
      size: 2 + Math.random() * 3,
      opacity: 0.15 + Math.random() * 0.45,
    }))
  );

  // Animate slot-machine digit counter when activeIndex changes
  useEffect(() => {
    const tens = Math.floor((activeIndex + 1) / 10);
    const units = (activeIndex + 1) % 10;

    if (tensDigitRef.current) {
      gsap.to(tensDigitRef.current, {
        yPercent: -tens * 10,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
    if (unitsDigitRef.current) {
      gsap.to(unitsDigitRef.current, {
        yPercent: -units * 10,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }
  }, [activeIndex]);

  // Click handler to scroll to specific service
  const handleScrollToService = (targetIndex: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;

    const totalCount = servicesData.length;
    const progressFraction = targetIndex / (totalCount - 1);
    const targetScroll = st.start + (st.end - st.start) * progressFraction;

    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: number, opts?: Record<string, unknown>) => void };
      }
    ).__lenis;

    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 1.1 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  // Setup GSAP MatchMedia for Desktop 3D Tunnel vs Mobile Sticky Deck
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: 3D Fly-Through Pinned Experience
      // ==========================================
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        if (!containerRef.current || !stageRef.current) return;

        // Create quickSetters for high performance 60fps card transform updates
        const cardSetters = cardsRef.current.map((cardEl) => {
          if (!cardEl) return null;
          return {
            setX: gsap.quickSetter(cardEl, 'x', 'px'),
            setY: gsap.quickSetter(cardEl, 'y', 'px'),
            setZ: gsap.quickSetter(cardEl, 'z', 'px'),
            setRotateY: gsap.quickSetter(cardEl, 'rotateY', 'deg'),
            setRotateX: gsap.quickSetter(cardEl, 'rotateX', 'deg'),
            setScale: gsap.quickSetter(cardEl, 'scale'),
            setOpacity: gsap.quickSetter(cardEl, 'opacity'),
          };
        });

        // Set initial positions
        const updateScene = (progress: number) => {
          const totalServices = servicesData.length;
          const activeFloat = progress * (totalServices - 1);

          // Update activeIndex state (guarded to avoid re-renders)
          const newIndex = Math.min(
            Math.max(0, Math.round(activeFloat)),
            totalServices - 1
          );
          if (newIndex !== activeIndexRef.current) {
            activeIndexRef.current = newIndex;
            setActiveIndex(newIndex);
          }

          if (progress > 0.02 && !hasScrolled) {
            setHasScrolled(true);
          }

          // Animate moving floor grid background forward
          if (floorGridRef.current) {
            const gridOffset = (progress * 600) % 60;
            floorGridRef.current.style.transform = `rotateX(72deg) translateY(${gridOffset}px)`;
          }

          // Update each 3D card position
          for (let i = 0; i < totalServices; i++) {
            const cardEl = cardsRef.current[i];
            const setters = cardSetters[i];
            if (!cardEl || !setters) continue;

            const rawP = i - activeFloat;
            const effP = getEffectiveP(rawP);

            // Visibility culling for performance
            if (effP < -1.4 || effP > 1.8) {
              cardEl.style.visibility = 'hidden';
              continue;
            } else {
              cardEl.style.visibility = 'visible';
            }

            const kf = interpolateCardTransform(effP);
            setters.setX(kf.x);
            setters.setY(kf.y);
            setters.setZ(kf.z);
            setters.setRotateY(kf.rotateY);
            setters.setRotateX(kf.rotateX);
            setters.setScale(kf.scale);
            setters.setOpacity(kf.opacity);

            if (kf.blur > 0.5) {
              cardEl.style.filter = `blur(${kf.blur.toFixed(1)}px)`;
            } else {
              cardEl.style.filter = 'none';
            }
          }
        };

        // ScrollTrigger Pinning Setup
        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 7.5}`,
          pin: stageRef.current,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateScene(self.progress);

            // Velocity threshold check for mouse tilt damping
            const vel = Math.abs(self.getVelocity());
            if (vel > 800) {
              setIsFastScrolling(true);
            } else {
              setIsFastScrolling(false);
            }
          },
        });

        scrollTriggerRef.current = st;

        // Run initial frame setup
        updateScene(0);

        return () => {
          st.kill();
          scrollTriggerRef.current = null;
        };
      });

      // ==========================================
      // MOBILE / TABLET: 3D Stacked Deck Fallback
      // ==========================================
      mm.add('(max-width: 1023px)', () => {
        // Handled via CSS sticky and subtle scroll entrance
        if (!containerRef.current) return;

        const mobileCards = containerRef.current.querySelectorAll('.mobile-deck-card');
        mobileCards.forEach((card, idx) => {
          gsap.fromTo(
            card,
            { opacity: 0.6, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 0.5,
              },
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasScrolled]);

  return (
    <div ref={containerRef} className="relative w-full text-white bg-[#0B0F0D]">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        Service {activeIndex + 1} of {servicesData.length}:{' '}
        {servicesData[activeIndex].title}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP VIEWPORT: Pinned Stage (hidden on mobile/tablet)  */}
      {/* ========================================================= */}
      <div
        ref={stageRef}
        className="hidden lg:flex relative w-full h-screen overflow-hidden items-center justify-between px-[7.5%] select-none"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 45%',
          backgroundColor: '#0B0F0D',
        }}
      >
        {/* Ambient Radial Green Atmosphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#16A34A]/10 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-[#B6F23D]/5 rounded-full blur-[180px] pointer-events-none" />

        {/* 3D Moving Perspective Floor Grid */}
        <div
          className="absolute -bottom-[32vh] -left-[40vw] w-[180vw] h-[110vh] pointer-events-none"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            maskImage:
              'radial-gradient(ellipse at 50% 85%, black 20%, rgba(0,0,0,0.4) 50%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 85%, black 20%, rgba(0,0,0,0.4) 50%, transparent 80%)',
          }}
        >
          <div
            ref={floorGridRef}
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 197, 94, 0.16) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 197, 94, 0.16) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transformOrigin: '50% 100%',
              transform: 'rotateX(72deg)',
            }}
          />
        </div>

        {/* 3D Depth Floating Particles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[#22C55E]"
              style={{
                left: '50%',
                top: '50%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
              }}
            />
          ))}
        </div>

        {/* Giant Ghost Outline Number in Deep Background */}
        <div
          className="absolute right-12 xl:right-28 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0"
          style={{
            transform: 'translateZ(-300px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <span
            className="text-[20rem] xl:text-[26rem] font-black tracking-tighter opacity-10 transition-all duration-700"
            style={{
              WebkitTextStroke: '3px rgba(34, 197, 94, 0.45)',
              color: 'transparent',
              fontFamily: 'monospace',
            }}
          >
            {servicesData[activeIndex]?.number.split('/')[0] || '01'}
          </span>
        </div>

        {/* ========================================================= */}
        {/* LEFT COLUMN: Fixed Stage UI                               */}
        {/* ========================================================= */}
        <div className="relative z-30 w-[380px] xl:w-[420px] h-[85vh] flex flex-col justify-between py-6">
          {/* Top Heading & Switch Block */}
          <div>
            <SectionHeading
              badge="Explore What We Offer"
              plainText="Complete Marketing Solutions."
              highlightText="All Under One Roof."
              subtext="Everything Your Business Needs to Grow."
              align="left"
              theme="dark"
            />

            {/* Segmented Switch Slot */}
            {switchSlot && (
              <div className="mt-4 mb-6">
                {switchSlot}
              </div>
            )}
          </div>

          {/* Center: Big Digit Slot Counter & Vertical Rail */}
          <div className="my-auto flex items-start gap-8">
            {/* Slot-Machine Counter (01 / 08) */}
            <div className="flex items-baseline font-mono text-4xl xl:text-5xl font-black text-white">
              {/* Tens Digit Slot */}
              <div className="h-[1.2em] overflow-hidden leading-none">
                <div ref={tensDigitRef} className="flex flex-col">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="h-[1.2em] flex items-center justify-center">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Units Digit Slot */}
              <div className="h-[1.2em] overflow-hidden leading-none text-[#22C55E]">
                <div ref={unitsDigitRef} className="flex flex-col">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <span key={n} className="h-[1.2em] flex items-center justify-center">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-xl xl:text-2xl text-[#9FB0A7]/50 ml-2">
                / 0{servicesData.length}
              </span>
            </div>

            {/* Vertical Progress Rail */}
            <div className="relative flex flex-col gap-2.5 pl-4 border-l border-[#1A2420]">
              {/* Active Green Rail Pill Marker */}
              <div
                className="absolute left-[-2px] w-[3px] bg-gradient-to-b from-[#22C55E] to-[#B6F23D] rounded-full transition-all duration-300"
                style={{
                  top: `${(activeIndex / (servicesData.length - 1)) * 88}%`,
                  height: '24px',
                  boxShadow: '0 0 12px #22C55E',
                }}
              />

              {servicesData.map((svc, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleScrollToService(idx)}
                    className={`group text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                      isCurrent
                        ? 'text-white font-bold text-sm scale-105 origin-left'
                        : 'text-[#9FB0A7]/60 hover:text-white text-xs font-normal'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isCurrent
                          ? 'bg-[#22C55E] ring-4 ring-[#22C55E]/30 scale-125'
                          : 'bg-[#1A2420] group-hover:bg-[#9FB0A7]'
                      }`}
                    />
                    <span className="truncate max-w-[220px]">
                      {svc.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Hint: Animated Scroll Indicator */}
          <div
            className={`flex items-center gap-2.5 text-xs text-[#9FB0A7]/70 font-mono transition-opacity duration-500 ${
              hasScrolled ? 'opacity-30 hover:opacity-80' : 'opacity-100'
            }`}
          >
            <div className="w-5 h-8 rounded-full border border-[#22C55E]/40 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#22C55E] animate-bounce" />
            </div>
            <span>Scroll to explore services</span>
            <HiChevronDown className="w-4 h-4 text-[#22C55E] animate-pulse" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT/CENTER: 3D Card Tunnel                              */}
        {/* ========================================================= */}
        <div
          className="relative z-20 flex-1 h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {servicesData.map((service, index) => {
            const isCurrent = index === activeIndex;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter',
                }}
              >
                <ServiceCard3D
                  service={service}
                  isActive={isCurrent}
                  onSelectService={onSelectService}
                  isFastScrolling={isFastScrolling}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE / TABLET VIEW: Sticky Stacked 3D Deck (< 1024px)   */}
      {/* ========================================================= */}
      <div className="lg:hidden relative z-10 w-[85%] mx-auto py-20">
        {/* Heading Block */}
        <SectionHeading
          badge="Explore What We Offer"
          plainText="Complete Marketing Solutions."
          highlightText="All Under One Roof."
          subtext="Everything Your Business Needs to Grow."
          align="center"
          theme="dark"
        />

        {/* Switch Component Slot */}
        {switchSlot && (
          <div className="flex justify-center -mt-6 sm:-mt-8 mb-12">
            {switchSlot}
          </div>
        )}

        {/* Sticky Stacked Cards Deck */}
        <div className="relative flex flex-col gap-6 pt-4 pb-20">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="mobile-deck-card sticky transition-transform duration-300"
              style={{
                top: `calc(90px + ${index * 14}px)`,
                zIndex: index + 1,
              }}
            >
              <ServiceCard3D
                service={service}
                isActive={true}
                onSelectService={onSelectService}
                className="w-full !max-w-none shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

