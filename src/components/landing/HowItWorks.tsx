"use client";

import { motion } from "framer-motion";
import { ListChecks, MessagesSquare, Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpFast, staggerContainer } from "@/lib/motion";

const steps = [
  {
    icon: ListChecks,
    step: "01",
    title: "Pick your role",
    description:
      "Choose Frontend, Backend, AI/ML, or HR. We load a tailored set of real interview questions.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: MessagesSquare,
    step: "02",
    title: "Answer live",
    description:
      "Chat through the interview naturally. Take your time — it's pressure-free practice.",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    icon: Trophy,
    step: "03",
    title: "Get your score",
    description:
      "Receive an instant breakdown with strengths, gaps, and a rewritten answer to study.",
    accent: "from-emerald-500 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="How it works"
        title="From anxious to interview-ready in 3 steps"
        subtitle="No setup, no friction. Start a session and get expert feedback before your coffee gets cold."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

        {steps.map((s) => (
          <motion.div key={s.step} variants={fadeUpFast} className="relative">
            <div className="glass relative flex h-full flex-col items-center rounded-3xl p-8 text-center">
              <div className="relative mb-6">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)]`}
                >
                  <s.icon className="text-white" size={26} />
                </div>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-ink-900 text-[11px] font-semibold text-white/70">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {s.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
