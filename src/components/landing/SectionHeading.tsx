"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`mx-auto flex max-w-2xl flex-col items-center text-center ${className}`}
    >
      <motion.span
        variants={fadeUp}
        className="glass mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-brand-200"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        variants={fadeUp}
        className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/55"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
