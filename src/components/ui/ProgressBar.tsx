"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  /** Current value (e.g. answered questions). */
  value: number;
  /** Total value. */
  total: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  total,
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/60">
          <span>Progress</span>
          <span className="tabular-nums text-white/80">
            {value}/{total}
          </span>
        </div>
      )}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#7c3aed,#6366f1,#38bdf8)] shadow-[0_0_18px_rgba(124,58,237,0.7)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          {/* Shimmer streak */}
          <div className="absolute inset-0 animate-[shimmer_2.5s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] bg-[length:200%_100%]" />
        </motion.div>
      </div>
    </div>
  );
}
