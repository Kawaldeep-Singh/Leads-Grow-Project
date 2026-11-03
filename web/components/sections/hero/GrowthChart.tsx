'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { line, area, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─────────────────────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────────────────────── */
type Period = '7D' | '30D' | '90D';

interface DataSet {
  leads: number[];
  sales: number[];
  revenue: number[];
}

// SSR-safe seed data (12 points, used on initial render)
const SEED_DATA: DataSet = {
  leads:   [120, 180, 240, 200, 320, 410, 380, 520, 490, 640, 720, 860],
  sales:   [60,  90,  110, 95,  160, 200, 185, 260, 240, 310, 360, 430],
  revenue: [40,  70,  90,  80,  130, 170, 155, 220, 200, 270, 310, 380],
};

const CHART_COLORS = {
  leads:   '#22C55E',
  sales:   '#B6F23D',
  revenue: '#FFFFFF',
};

const W = 460;
const H = 220;
const PAD = { top: 20, right: 16, bottom: 36, left: 8 };

/* ─────────────────────────────────────────────────────────────
   DATA GENERATOR
───────────────────────────────────────────────────────────── */
function generateData(points: number): DataSet {
  const lead = (prev: number) => Math.round(Math.max(60, prev + (Math.random() - 0.28) * 80));
  const arr = (seed: number) =>
    Array.from({ length: points }, (_, i) => {
      let v = seed;
      for (let j = 0; j <= i; j++) v = lead(v);
      return v;
    });
  const l = arr(100);
  const s = l.map(v => Math.round(v * (0.4 + Math.random() * 0.2)));
  const r = l.map(v => Math.round(v * (0.28 + Math.random() * 0.18)));
  return { leads: l, sales: s, revenue: r };
}

/* ─────────────────────────────────────────────────────────────
   SVG PATH HELPERS
───────────────────────────────────────────────────────────── */
function buildPaths(data: DataSet) {
  const n = data.leads.length;
  const allVals = [...data.leads, ...data.sales, ...data.revenue];
  const maxVal = Math.max(...allVals) * 1.12;

  const xScale = scaleLinear()
    .domain([0, n - 1])
    .range([PAD.left, W - PAD.right]);

  const yScale = scaleLinear()
    .domain([0, maxVal])
    .range([H - PAD.bottom, PAD.top]);

  const lineFn = (key: keyof DataSet) =>
    line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(curveMonotoneX)(data[key]) ?? '';

  const areaFn = (key: keyof DataSet) =>
    area<number>()
      .x((_, i) => xScale(i))
      .y0(H - PAD.bottom)
      .y1((d) => yScale(d))
      .curve(curveMonotoneX)(data[key]) ?? '';

  const points = (key: keyof DataSet) =>
    data[key].map((v, i) => ({ x: xScale(i), y: yScale(v), value: v }));

  const xTicks = data.leads.map((_, i) => ({
    x: xScale(i),
    label: i % 2 === 0 ? `W${i + 1}` : '',
  }));

  const yGridLines = [0.25, 0.5, 0.75, 1].map((t) => ({
    y: yScale(maxVal * t),
    label: Math.round(maxVal * t),
  }));

  return { lineFn, areaFn, points, xTicks, yGridLines, xScale, yScale, maxVal };
}

/* ─────────────────────────────────────────────────────────────
   FLOATING CHIP
───────────────────────────────────────────────────────────── */
interface ChipProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  visible: boolean;
}

function FloatingChip({ children, delay = 0, yOffset = 0, visible }: ChipProps) {
  return (
    <div
      className="absolute pointer-events-none z-20 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? `translateY(${yOffset}px)` : 'translateY(12px)',
        transitionDelay: `${delay}ms`,
        animation: visible ? `chipFloat ${3 + delay * 0.001}s ease-in-out infinite alternate` : 'none',
      }}
    >
      <div className="bg-[#0F1613]/90 border border-[#22C55E]/30 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg shadow-black/40">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   GROWTH CHART (MAIN)
───────────────────────────────────────────────────────────── */
interface GrowthChartProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
}

export function GrowthChart({ chartRef }: GrowthChartProps) {
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [period, setPeriod] = useState<Period>('30D');
  const [data, setData] = useState<DataSet>(SEED_DATA);
  const [drawProgress, setDrawProgress] = useState(0); // 0→1
  const [chipsVisible, setChipsVisible] = useState([false, false, false]);
  const [liveRevenue, setLiveRevenue] = useState(380);
  const [liveGrowth] = useState(248);

  const morphTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tilt on hover via GSAP quickTo
  const rotXTo = useRef<((v: number) => void) | null>(null);
  const rotYTo = useRef<((v: number) => void) | null>(null);

  /* ── Generate client-side data ── */
  useEffect(() => {
    const pts = period === '7D' ? 7 : period === '30D' ? 12 : 16;
    setData(generateData(pts));
    setDrawProgress(0);
    setChipsVisible([false, false, false]);
  }, [period]);

  /* ── Panel tilt setup ── */
  useEffect(() => {
    if (prefersReducedMotion || !panelRef.current) return;
    (async () => {
      const { default: gsap } = await import('gsap');
      if (!panelRef.current) return;
      rotXTo.current = gsap.quickTo(panelRef.current, 'rotateX', { duration: 0.4, ease: 'power2.out' });
      rotYTo.current = gsap.quickTo(panelRef.current, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    })();
  }, [prefersReducedMotion]);

  /* ── Draw animation ── */
  useEffect(() => {
    if (prefersReducedMotion) {
      setDrawProgress(1);
      setChipsVisible([true, true, true]);
      setLiveRevenue(data.revenue[data.revenue.length - 1]);
      return;
    }

    let frame: number;
    let start: number | null = null;
    const DURATION = 2400; // ms

    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / DURATION, 1);

      // Ease: power2.inOut approximation
      const t = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      setDrawProgress(t);

      // Live revenue sync
      const maxRev = data.revenue[data.revenue.length - 1];
      setLiveRevenue(Math.round(maxRev * t));

      // Chip reveal triggers
      if (t > 0.5 && !chipsVisible[0]) setChipsVisible(p => [true, p[1], p[2]]);
      if (t > 0.75 && !chipsVisible[1]) setChipsVisible(p => [p[0], true, p[2]]);
      if (t >= 1 && !chipsVisible[2]) setChipsVisible([true, true, true]);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);

    // Morph every 6s
    if (morphTimerRef.current) clearTimeout(morphTimerRef.current);
    morphTimerRef.current = setTimeout(function morph() {
      const pts = period === '7D' ? 7 : period === '30D' ? 12 : 16;
      setData(generateData(pts));
      setDrawProgress(0);
      setChipsVisible([false, false, false]);
      morphTimerRef.current = setTimeout(morph, 6000);
    }, 6000);

    return () => {
      cancelAnimationFrame(frame);
      if (morphTimerRef.current) clearTimeout(morphTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, prefersReducedMotion]);

  /* ── Mouse tilt ── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !panelRef.current) return;
    const { left, top, width, height } = panelRef.current.getBoundingClientRect();
    const nx = ((e.clientX - left) / width - 0.5) * 2;
    const ny = ((e.clientY - top) / height - 0.5) * 2;
    rotXTo.current?.(-ny * 6);
    rotYTo.current?.(nx * 6);
  }, [prefersReducedMotion]);

  const onMouseLeave = useCallback(() => {
    rotXTo.current?.(0);
    rotYTo.current?.(0);
  }, []);

  /* ── Build SVG paths ── */
  const { lineFn, areaFn, points, xTicks, yGridLines } = buildPaths(data);

  /* ── Clip progress for line/area draw ── */
  const clipWidth = drawProgress * W;

  /* ── Tracker dot: last visible point on Leads line ── */
  const leadPts = points('leads');
  const trackerIdx = Math.min(
    Math.floor(drawProgress * (leadPts.length - 1)),
    leadPts.length - 1
  );
  const tracker = leadPts[trackerIdx] ?? leadPts[0];

  return (
    <div
      ref={chartRef}
      className="relative w-full max-w-[500px] mx-auto lg:mx-0"
      style={{ perspective: '1200px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Ambient green glow behind panel */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(34,197,94,0.15) 0%, transparent 70%)',
          animation: 'glowBreathe 4s ease-in-out infinite alternate',
        }}
        aria-hidden
      />

      {/* Main panel */}
      <div
        ref={panelRef}
        className="relative rounded-3xl border border-[#1E2B25] overflow-hidden"
        style={{
          background: '#0F1613',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── Panel Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2B25]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9FB0A7]">
              Business Growth
            </span>
            {/* Live dot */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
            </span>
          </div>

          {/* Period pills */}
          <div className="flex items-center gap-0.5 bg-[#111815] rounded-lg p-0.5">
            {(['7D', '30D', '90D'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md font-mono text-[10px] tracking-widest transition-all duration-200 ${
                  period === p
                    ? 'bg-[#22C55E] text-black font-bold'
                    : 'text-[#9FB0A7] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Live Revenue Number ── */}
        <div className="px-5 pt-4 pb-2 flex items-end gap-3">
          <span className="font-display font-extrabold text-white text-3xl tabular-nums">
            ₹{(liveRevenue * 1000).toLocaleString('en-IN')}
          </span>
          <span
            className="mb-1 inline-flex items-center gap-1 text-xs font-mono text-[#22C55E] font-bold"
            style={{ opacity: drawProgress > 0.5 ? 1 : 0, transition: 'opacity 0.5s' }}
          >
            ▲ {Math.round(liveGrowth * drawProgress)}%
          </span>
        </div>

        {/* ── Legend ── */}
        <div className="flex gap-4 px-5 pb-3">
          {(['leads', 'sales', 'revenue'] as (keyof typeof CHART_COLORS)[]).map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className="inline-block w-4 h-px rounded-full"
                style={{
                  backgroundColor: CHART_COLORS[k],
                  borderStyle: k === 'revenue' ? 'dashed' : 'solid',
                  height: 2,
                }}
              />
              <span className="font-mono text-[10px] text-[#9FB0A7] capitalize">{k}</span>
            </div>
          ))}
        </div>

        {/* ── SVG Chart ── */}
        <div className="relative px-3 pb-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height="auto"
            className="overflow-visible"
            style={{ display: 'block' }}
          >
            <defs>
              {/* Clip path for progressive draw */}
              <clipPath id="chartClip">
                <rect x={PAD.left} y={0} width={Math.max(0, clipWidth)} height={H} />
              </clipPath>

              {/* Area gradients */}
              {(['leads', 'sales', 'revenue'] as const).map((k) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[k]} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={CHART_COLORS[k]} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            {/* Grid lines */}
            {yGridLines.map(({ y }) => (
              <line
                key={y}
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}

            {/* X-axis labels */}
            {xTicks.map(({ x, label }) =>
              label ? (
                <text
                  key={`xt-${label}`}
                  x={x}
                  y={H - 4}
                  textAnchor="middle"
                  fill="#9FB0A7"
                  fontSize={9}
                  fontFamily="var(--font-mono, monospace)"
                >
                  {label}
                </text>
              ) : null
            )}

            {/* Areas (clipped) */}
            {(['revenue', 'sales', 'leads'] as const).map((k) => (
              <path
                key={`area-${k}`}
                d={areaFn(k)}
                fill={`url(#grad-${k})`}
                clipPath="url(#chartClip)"
              />
            ))}

            {/* Lines (clipped) */}
            <path
              d={lineFn('revenue')}
              fill="none"
              stroke={CHART_COLORS.revenue}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              clipPath="url(#chartClip)"
            />
            <path
              d={lineFn('sales')}
              fill="none"
              stroke={CHART_COLORS.sales}
              strokeWidth={2}
              clipPath="url(#chartClip)"
            />
            <path
              d={lineFn('leads')}
              fill="none"
              stroke={CHART_COLORS.leads}
              strokeWidth={3}
              strokeLinecap="round"
              clipPath="url(#chartClip)"
            />

            {/* Data dots — leads only */}
            {points('leads').map(({ x, y }, i) => {
              const threshold = i / (leadPts.length - 1);
              const visible = drawProgress > threshold;
              return (
                <circle
                  key={`dot-${i}`}
                  cx={x}
                  cy={y}
                  r={visible ? 3.5 : 0}
                  fill="#0F1613"
                  stroke="#22C55E"
                  strokeWidth={2}
                  style={{ transition: 'r 0.3s ease' }}
                />
              );
            })}

            {/* Tracker dot */}
            {tracker && drawProgress > 0.05 && (
              <g>
                {/* Pulse ring */}
                <circle
                  cx={tracker.x}
                  cy={tracker.y}
                  r={12}
                  fill="rgba(34,197,94,0.15)"
                  style={{ animation: 'trackerPulse 1.5s ease-out infinite' }}
                />
                <circle cx={tracker.x} cy={tracker.y} r={5} fill="#22C55E" />
                <circle cx={tracker.x} cy={tracker.y} r={2.5} fill="white" />
              </g>
            )}
          </svg>

          {/* Floating chips */}
          <FloatingChip
            visible={chipsVisible[0]}
            delay={0}
            yOffset={-8}
            // Top-right corner
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="font-mono text-[11px] text-white font-bold">
              +248 New Leads
            </span>
          </FloatingChip>
        </div>

        {/* ── Bottom stat row ── */}
        <div className="grid grid-cols-3 divide-x divide-[#1E2B25] border-t border-[#1E2B25]">
          {[
            { label: 'Leads', value: data.leads[data.leads.length - 1] ?? 860, prefix: '' },
            { label: 'Conv. Rate', value: 4.8, prefix: '', suffix: '%' },
            { label: 'ROAS', value: 4.8, prefix: '', suffix: 'x' },
          ].map(({ label, value, prefix, suffix }) => (
            <div key={label} className="px-4 py-3 flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-[#9FB0A7] uppercase tracking-widest">{label}</span>
              <span className="font-display font-bold text-white text-base tabular-nums">
                {prefix}{typeof value === 'number' && value > 10 ? value.toLocaleString() : value}{suffix}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating chips (outside panel) ── */}
      <div
        className="absolute -top-4 -right-4"
        style={{ zIndex: 30 }}
      >
        <FloatingChip visible={chipsVisible[1]} delay={200} yOffset={0}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
          </span>
          <span className="font-mono text-[11px] text-white">Campaign Live</span>
        </FloatingChip>
      </div>

      <div
        className="absolute -bottom-2 -left-4"
        style={{ zIndex: 30 }}
      >
        <FloatingChip visible={chipsVisible[2]} delay={400} yOffset={0}>
          <span className="font-mono text-[11px] text-[#B6F23D] font-bold">ROAS</span>
          <span className="font-mono text-[11px] text-white font-bold">4.8x</span>
        </FloatingChip>
      </div>

      <style>{`
        @keyframes chipFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-6px); }
        }
        @keyframes glowBreathe {
          from { opacity: 0.4; }
          to   { opacity: 0.75; }
        }
        @keyframes trackerPulse {
          0%   { r: 6; opacity: 0.7; }
          100% { r: 18; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

