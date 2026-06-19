"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpFast, staggerContainer } from "@/lib/motion";
import { STATS, TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative mx-auto max-w-6xl px-6 py-24"
    >
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by candidates who got the offer"
        subtitle="Real outcomes from people who practiced until it felt effortless."
      />

      {/* Stats band */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="glass mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4"
      >
        {STATS.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUpFast}
            className="flex flex-col items-center gap-1 bg-white/[0.02] px-4 py-7 text-center"
          >
            <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              {s.value}
            </span>
            <span className="text-xs font-medium text-white/45">
              {s.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Testimonial cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {TESTIMONIALS.map((t) => (
          <motion.div key={t.name} variants={fadeUpFast}>
            <div className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:bg-white/[0.07]">
              <Quote
                className="absolute right-6 top-6 text-white/10 transition-colors group-hover:text-brand-400/30"
                size={40}
              />
              <p className="relative text-[15px] leading-relaxed text-white/75">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.accent} text-sm font-semibold text-white shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/45">{t.role}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
