"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  glow?: boolean;
  interactive?: boolean;
  className?: string;
}

/**
 * Frosted-glass surface with optional hover lift and animated gradient border.
 */
export default function GlassCard({
  children,
  glow = false,
  interactive = false,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        interactive
          ? { y: -6, scale: 1.015 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative rounded-3xl glass ${
        glow ? "glow-soft" : ""
      } ${className}`}
      {...props}
    >
      {/* Gradient border highlight on hover */}
      {interactive && (
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400/40 via-transparent to-azure-400/30 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />
        </div>
      )}
      {children}
    </motion.div>
  );
}
