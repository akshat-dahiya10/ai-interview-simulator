import type { Variants } from "framer-motion";

/** Premium ease-out cubic bezier used across the app. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Parent variant that staggers its children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

/** Standard fade + slide-up child variant. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Smaller, faster fade-up for dense grids. */
export const fadeUpFast: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Helper to build a viewport reveal config. */
export const revealOnce = { once: true, margin: "-80px" } as const;
