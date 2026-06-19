"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "./SectionHeading";
import { fadeUpFast, staggerContainer, EASE } from "@/lib/motion";

const features = [
  {
    icon: MessageSquareText,
    title: "Instant AI Feedback",
    description:
      "Every answer is scored on clarity, depth, and structure in seconds — with specific, actionable notes.",
    accent: "from-violet-500 to-indigo-500",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Real Interview Questions",
    description:
      "Curated, role-specific questions modeled on actual loops at top companies.",
    accent: "from-sky-500 to-cyan-500",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Watch your scores climb over time with detailed trend analytics across skill areas.",
    accent: "from-fuchsia-500 to-pink-500",
    span: "",
  },
  {
    icon: Zap,
    title: "Adaptive Difficulty",
    description:
      "The simulator calibrates to your level, pushing you harder exactly where you're strong.",
    accent: "from-emerald-500 to-teal-500",
    span: "md:col-span-2",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Features"
        title="Everything you need to ace the loop"
        subtitle="A complete prep system that mirrors a real interview — then tells you exactly how to improve."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        {features.map((f) => (
          <motion.div key={f.title} variants={fadeUpFast} className={f.span}>
            <GlassCard
              interactive
              className="h-full overflow-hidden p-7"
            >
              {/* hover glow */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
              />
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} shadow-lg`}
              >
                <f.icon className="text-white" size={22} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {f.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Inline AI feedback callout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-6"
      >
        <GlassCard glow className="overflow-hidden p-7 sm:p-9">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-[0_8px_30px_-6px_rgba(124,58,237,0.7)]">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold tracking-tight text-white">
                Feedback that feels like a real interviewer wrote it
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
                We evaluate structure, depth, and edge cases the way a hiring
                committee would — then hand you a rewritten answer you can study.
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 text-sm font-semibold text-emerald-300">
              4.9/5 · 120K sessions
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
