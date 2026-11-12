'use client';

import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

interface FooterWordmarkProps {
  wordmarkRef: React.RefObject<HTMLDivElement | null>;
  growthLineRef: React.RefObject<SVGPathElement | null>;
}

const LETTERS = ['L', 'E', 'A', 'D', 'S', 'G', 'R', 'O', 'W'];
const O_INDEX = 7; // the "O" in GROW

/* ── ARROW SETTINGS (tweak here) ────────────────────────────────
   The arrow lives INSIDE the "O" span, so it always sits on the O
   at every screen size (all sizes are relative to the font size).
   The shape is traced from the real LeadsGrow logo arrow. */
const ANGLE_DEG = 48;   // arrow angle from horizontal (45–50 looks best)
const BOX_EM = 1.6;     // size of the arrow box, in em
const TAIL_DIST = 34;   // tail distance from the O centre (lower-left, inside the O)
const TIP_DIST = 46;    // tip distance from the O centre (upper-right, above the O)
const THICKNESS = 1.15; // 1 = same thickness as the logo, bigger = bolder
const NUDGE_X_EM = 0;   // fine-tune: move arrow left (-) / right (+)
const NUDGE_Y_EM = 0;   // fine-tune: move arrow up (-) / down (+)

/* ── Geometry ─────────────────────────────────────────────────── */
const LEN = TAIL_DIST + TIP_DIST; // arrow length in box units (box = 100 x 100)
const RAD = (ANGLE_DEG * Math.PI) / 180;
const r2 = (n: number) => Number(n.toFixed(2));
const TAIL = { x: r2(50 - TAIL_DIST * Math.cos(RAD)), y: r2(50 + TAIL_DIST * Math.sin(RAD)) };
const TIP = { x: r2(50 + TIP_DIST * Math.cos(RAD)), y: r2(50 - TIP_DIST * Math.sin(RAD)) };

// Arrow outline in its own axis (tail at 0,0 -> tip at LEN,0): a tapered needle shaft with a sharp head
const HEAD_X = r2(LEN * 0.8);
const ARROW_POINTS = [
  [LEN, 0],
  [HEAD_X, -9.1 * THICKNESS],
  [HEAD_X, -4.3 * THICKNESS],
  [0, 0],
  [HEAD_X, 4.3 * THICKNESS],
  [HEAD_X, 9.1 * THICKNESS],
]
  .map(([x, y]) => `${r2(x)},${r2(y)}`)
  .join(' ');

// Reveal gradient spans a little beyond the arrow so the soft edge can fully enter/leave
const REV_X1 = -14;
const REV_X2 = LEN + 14;
const REV_SOFT = 0.12; // softness of the reveal edge (fraction of the span)
const REV_FULL = (LEN - REV_X1) / (REV_X2 - REV_X1) + 0.03; // offset where the whole arrow is visible
const SHIMMER_W = 34;  // width of the moving light band

export const FooterWordmark: React.FC<FooterWordmarkProps> = ({
  wordmarkRef,
  growthLineRef,
}) => {
  const uid = useId().replace(/:/g, '');
  const gradId = `fw-grad-${uid}`;
  const revealId = `fw-reveal-${uid}`;
  const maskId = `fw-mask-${uid}`;
  const shimmerId = `fw-shimmer-${uid}`;
  const glowId = `fw-glow-${uid}`;
  const flareId = `fw-flare-${uid}`;

  const stop1Ref = useRef<SVGStopElement>(null);
  const stop2Ref = useRef<SVGStopElement>(null);
  const shimmerRef = useRef<SVGLinearGradientElement>(null);
  const floatRef = useRef<SVGGElement>(null);
  const riseRef = useRef<SVGGElement>(null);
  const starRef = useRef<SVGGElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const root = wordmarkRef.current;
    const s1 = stop1Ref.current;
    const s2 = stop2Ref.current;
    const sh = shimmerRef.current;
    const floatEl = floatRef.current;
    const rise = riseRef.current;
    const star = starRef.current;
    const halo = haloRef.current;
    if (!root || !s1 || !s2 || !sh || !floatEl || !rise || !star || !halo) return;

    const setReveal = (p: number) => {
      s1.setAttribute('offset', String(p));
      s2.setAttribute('offset', String(Math.min(1, p + REV_SOFT)));
    };
    const setShimmer = (x: number) => {
      sh.setAttribute('x1', String(x));
      sh.setAttribute('x2', String(x + SHIMMER_W));
    };

    // Reduced motion: show the finished arrow, no animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReveal(REV_FULL);
      setShimmer(-SHIMMER_W);
      gsap.set([star, halo], { opacity: 0 });
      return;
    }

    const state = { p: 0, s: -SHIMMER_W };
    let introDone = false;
    let sweeping = false;
    let started = false;

    const ctx = gsap.context(() => {
      // Start state: arrow hidden, waiting below its final position
      setReveal(0);
      setShimmer(-SHIMMER_W);
      gsap.set(rise, { x: -10 });
      gsap.set(star, { scale: 0, opacity: 1 });
      gsap.set(halo, { opacity: 0 });

      // One light sweep from the tail to the tip, with a small spark when it reaches the tip
      const sweep = (onDone?: () => void) => {
        const t = gsap.timeline({ onComplete: onDone });
        t.fromTo(
          state,
          { s: -SHIMMER_W },
          { s: LEN, duration: 1.2, ease: 'power2.inOut', onUpdate: () => setShimmer(state.s) }
        )
          .fromTo(
            star,
            { scale: 0, rotation: -40 },
            { scale: 0.8, rotation: 0, duration: 0.28, ease: 'back.out(2.2)' },
            '>-0.3'
          )
          .to(star, { scale: 0, duration: 0.5, ease: 'power2.in' })
          .fromTo(halo, { opacity: 0 }, { opacity: 0.55, duration: 0.25, ease: 'power2.out' }, '<-0.5')
          .to(halo, { opacity: 0.18, duration: 0.7, ease: 'power2.out' }, '>-0.1');
        return t;
      };

      // INTRO: the arrow rises from the bottom (tail) to the top (tip), smooth and soft-edged
      const intro = gsap.timeline({
        paused: true,
        onComplete: () => {
          introDone = true;
          // calm idle: light sweep every few seconds + a very slow drift along the arrow direction
          gsap.timeline({ repeat: -1, repeatDelay: 2.6 }).add(sweep());
          gsap.to(floatEl, { x: 2.6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        },
      });
      intro
        .to(state, { p: REV_FULL, duration: 1.8, ease: 'power3.inOut', onUpdate: () => setReveal(state.p) }, 0)
        .to(rise, { x: 0, duration: 1.8, ease: 'power3.inOut' }, 0)
        .fromTo(halo, { opacity: 0 }, { opacity: 0.8, duration: 0.45, ease: 'power2.out' }, 1.35)
        .fromTo(
          star,
          { scale: 0, rotation: -45 },
          { scale: 1.15, rotation: 0, duration: 0.4, ease: 'back.out(2.2)' },
          1.5
        )
        .to(star, { scale: 0, duration: 0.6, ease: 'power2.in' }, 1.95)
        .to(halo, { opacity: 0.18, duration: 0.9, ease: 'power2.out' }, 1.95);

      // Start when the wordmark scrolls into view (once)
      const io = new IntersectionObserver(
        (entries) => {
          if (!started && entries.some((e) => e.isIntersecting)) {
            started = true;
            intro.play();
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(root);

      // Hover: replay a light sweep (desktop)
      const onEnter = () => {
        if (!introDone || sweeping) return;
        sweeping = true;
        sweep(() => {
          sweeping = false;
        });
      };
      root.addEventListener('mouseenter', onEnter);

      return () => {
        io.disconnect();
        root.removeEventListener('mouseenter', onEnter);
      };
    }, root);

    return () => ctx.revert();
  }, [wordmarkRef]);

  return (
    <div
      ref={wordmarkRef}
      aria-hidden="true"
      className="fw-wordmark relative w-full overflow-hidden select-none py-4 sm:py-6 text-center group cursor-default px-2 sm:px-4"
      style={{
        // Default CSS variable, scrubbed by useFooterAnimations
        ['--p' as string]: '0%',
      }}
    >
      {/* Wordmark sized comfortably so it never clips on any screen.
          (overflow-hidden removed here so the arrow tip is never cut off at the top) */}
      <div className="relative z-10 flex justify-center items-center w-full">
        <span
          className="text-[clamp(2.1rem,8.2vw,7.8rem)] font-black tracking-tight leading-none inline-flex justify-center flex-nowrap"
          style={{
            WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.22)',
            background: 'linear-gradient(to top, #22C55E 0%, #16A34A var(--p), transparent var(--p))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          {LETTERS.map((letter, idx) => (
            <span
              key={idx}
              className="relative inline-block transition-transform duration-300 ease-out group-hover:-translate-y-2"
              style={{ transitionDelay: `${idx * 25}ms` }}
            >
              {letter}

              {/* Growth arrow: only on the "O" of GROW, over the letter at ~48° */}
              {idx === O_INDEX && (
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute pointer-events-none z-20 overflow-visible"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: `${BOX_EM}em`,
                    height: `${BOX_EM}em`,
                    transform: `translate(calc(-50% + ${NUDGE_X_EM}em), calc(-50% + ${NUDGE_Y_EM}em))`,
                    WebkitTextFillColor: 'initial',
                  }}
                >
                  <defs>
                    {/* Body colour: deep green at the tail -> bright lime at the tip */}
                    <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={LEN} y2="0">
                      <stop offset="0" stopColor="#15803D" />
                      <stop offset="0.55" stopColor="#22C55E" />
                      <stop offset="1" stopColor="#B6F23D" />
                    </linearGradient>

                    {/* Rising reveal: a soft edge that sweeps from the tail (bottom) to the tip (top) */}
                    <linearGradient id={revealId} gradientUnits="userSpaceOnUse" x1={REV_X1} y1="0" x2={REV_X2} y2="0">
                      <stop offset="0" stopColor="#fff" />
                      <stop ref={stop1Ref} offset="0" stopColor="#fff" />
                      <stop ref={stop2Ref} offset={REV_SOFT} stopColor="#000" />
                      <stop offset="1" stopColor="#000" />
                    </linearGradient>
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="-20" y="-40" width={LEN + 40} height="80">
                      <rect x="-20" y="-40" width={LEN + 40} height="80" fill={`url(#${revealId})`} />
                    </mask>

                    {/* Moving light band */}
                    <linearGradient
                      ref={shimmerRef}
                      id={shimmerId}
                      gradientUnits="userSpaceOnUse"
                      x1={-SHIMMER_W}
                      y1="0"
                      x2="0"
                      y2="0"
                    >
                      <stop offset="0" stopColor="#fff" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>

                    {/* Soft glow */}
                    <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="2.2" floodColor="#22C55E" floodOpacity="0.45" />
                    </filter>

                    {/* Halo behind the spark at the tip */}
                    <radialGradient id={flareId}>
                      <stop offset="0" stopColor="#B6F23D" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#B6F23D" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Placed at the tail, rotated to the arrow angle */}
                  <g transform={`translate(${TAIL.x} ${TAIL.y}) rotate(${-ANGLE_DEG})`}>
                    <g ref={floatRef} filter={`url(#${glowId})`}>
                      <g ref={riseRef}>
                        <g mask={`url(#${maskId})`}>
                          {/* thin dark outline so the arrow stays readable over the green letters */}
                          <polygon
                            points={ARROW_POINTS}
                            fill="#0B0F0D"
                            stroke="#0B0F0D"
                            strokeWidth="5"
                            strokeLinejoin="round"
                            opacity="0.92"
                          />
                          <polygon points={ARROW_POINTS} fill={`url(#${gradId})`} />
                          <polygon points={ARROW_POINTS} fill={`url(#${shimmerId})`} />
                        </g>
                      </g>
                    </g>
                  </g>

                  {/* Spark + halo at the tip */}
                  <g transform={`translate(${TIP.x} ${TIP.y})`}>
                    <circle ref={haloRef} r="13" fill={`url(#${flareId})`} />
                    <g ref={starRef}>
                      <path
                        d="M0,-10 L1.7,-1.7 L10,0 L1.7,1.7 L0,10 L-1.7,1.7 L-10,0 L-1.7,-1.7 Z"
                        fill="#F4FFD6"
                      />
                    </g>
                  </g>

                  {/* Kept (invisible) so the older scroll hook that expects these still finds them */}
                  <path
                    ref={growthLineRef}
                    d={`M ${TAIL.x} ${TAIL.y} L ${TIP.x} ${TIP.y}`}
                    stroke="transparent"
                    strokeWidth="0"
                    fill="none"
                    opacity="0"
                  />
                  <polygon className="footer-growth-arrow-head" points="0,0 0,0 0,0" opacity="0" />
                </svg>
              )}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};
