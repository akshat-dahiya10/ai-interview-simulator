"use client";

import { motion } from "framer-motion";

/**
 * Ambient, full-bleed background: deep gradient base, floating glow orbs,
 * a subtle grid, and a film-grain noise overlay. Rendered fixed behind content.
 */
export default function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950"
    >
      {/* Base vertical gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#15102e_0%,#0a0a14_45%,#050509_100%)]" />

      {/* Violet glow orb */}
      <motion.div
        className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.45),transparent_60%)] blur-3xl"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blue glow orb */}
      <motion.div
        className="absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.32),transparent_60%)] blur-3xl"
        animate={{ y: [0, -50, 0], x: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fuchsia accent orb */}
      <motion.div
        className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.22),transparent_60%)] blur-3xl"
        animate={{ y: [0, -30, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid with radial mask */}
      <div className="bg-grid mask-radial absolute inset-0 opacity-60" />

      {/* Film-grain noise */}
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />

      {/* Top vignette for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
