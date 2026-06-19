"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScoreCircleProps {
  score: number; // 0-100
  size?: number;
  label?: string;
  delay?: number;
}

/**
 * Animated radial score with a gradient stroke and a counting number.
 */
export default function ScoreCircle({
  score,
  size = 200,
  label = "Overall Score",
  delay = 0.2,
}: ScoreCircleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Unique gradient id so multiple circles don't clash.
  const gid = useRef(`score-grad-${Math.random().toString(36).slice(2, 8)}`)
    .current;

  useEffect(() => {
    if (!inView) return;
    const controls = animate(display, score, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, score]);

  const verdictColor =
    score >= 85
      ? "#34d399"
      : score >= 70
        ? "#a78bfa"
        : "#fbbf24";

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 0 10px rgba(124,58,237,0.7))" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-semibold tabular-nums text-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.5 }}
        >
          {display}
        </motion.div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          / 100
        </div>
        <motion.div
          className="mt-1 text-sm font-semibold"
          style={{ color: verdictColor }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.6 }}
        >
          {label}
        </motion.div>
      </div>
    </div>
  );
}
