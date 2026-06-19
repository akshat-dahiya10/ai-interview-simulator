"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface PerformanceChartProps {
  data: number[]; // 0-100 per question
}

const W = 520;
const H = 200;
const PAD = 24;

/**
 * Animated SVG area + line chart with gradient fill and animated plot points.
 */
export default function PerformanceChart({ data }: PerformanceChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const max = 100;
  const stepX = (W - PAD * 2) / (data.length - 1);
  const points = data.map((v, i) => ({
    x: PAD + i * stepX,
    y: H - PAD - (v / max) * (H - PAD * 2),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - PAD} L ${
    points[0].x
  } ${H - PAD} Z`;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="perf-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(124,58,237,0.45)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </linearGradient>
          <linearGradient id="perf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PAD}
            x2={W - PAD}
            y1={H - PAD - g * (H - PAD * 2)}
            y2={H - PAD - g * (H - PAD * 2)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* area */}
        <motion.path
          d={areaPath}
          fill="url(#perf-area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#perf-line)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 4px 10px rgba(124,58,237,0.5))" }}
        />

        {/* points */}
        {points.map((p, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.12, type: "spring", stiffness: 300 }}
          >
            <circle cx={p.x} cy={p.y} r="5" fill="#0a0a14" stroke="#a78bfa" strokeWidth="2.5" />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="fill-white/60 text-[10px] font-semibold"
            >
              {data[i]}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* x-axis labels */}
      <div className="mt-2 flex justify-between px-6 text-[11px] font-medium text-white/35">
        {data.map((_, i) => (
          <span key={i}>Q{i + 1}</span>
        ))}
      </div>
    </div>
  );
}
