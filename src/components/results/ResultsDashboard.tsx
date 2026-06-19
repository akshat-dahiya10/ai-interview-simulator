"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Sparkles,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import type { InterviewResult, Role } from "@/lib/types";
import ScoreCircle from "@/components/ui/ScoreCircle";
import PerformanceChart from "@/components/results/PerformanceChart";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { resolveIcon } from "@/components/icons";
import {
  EASE,
  fadeUp,
  fadeUpFast,
  staggerContainer,
} from "@/lib/motion";

export default function ResultsDashboard({
  role,
  result,
}: {
  role: Role;
  result: InterviewResult;
}) {
  const Icon = resolveIcon(role.icon);

  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
      {/* breadcrumb */}
      <motion.a
        href="/roles"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition-colors hover:text-white"
      >
        ← Back to roles
      </motion.a>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-6"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white/70">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br ${role.accent}`}
            >
              <Icon className="text-white" size={11} />
            </span>
            {role.title}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            {result.verdict}
          </span>
        </motion.div>

        {/* HERO SCORE CARD */}
        <motion.div
          variants={fadeUp}
          className="glass-strong relative mt-5 overflow-hidden rounded-[2rem] p-7 sm:p-10"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-azure-500/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <div className="mx-auto">
              <ScoreCircle score={result.score} size={210} />
            </div>

            <div className="text-center lg:text-left">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200"
              >
                <Sparkles size={13} />
                Performance Analysis
              </motion.div>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {result.headline}
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-pretty text-base leading-relaxed text-white/55 lg:mx-0">
                You answered{" "}
                <span className="font-semibold text-white">
                  {role.questions.length} questions
                </span>{" "}
                in the {role.title} track. Here's how a hiring committee would
                read your responses.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <AnimatedButton href={`/interview/${role.id}`} size="md">
                  <RotateCcw size={16} />
                  Retake Interview
                </AnimatedButton>
                <AnimatedButton href="/roles" variant="secondary" size="md">
                  Try Different Role
                  <ArrowRight size={16} />
                </AnimatedButton>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* STRENGTHS + WEAKNESSES */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Strengths */}
        <motion.div variants={fadeUpFast}>
          <div className="glass h-full overflow-hidden rounded-3xl border-emerald-400/15 p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15">
                <ThumbsUp className="text-emerald-400" size={18} />
              </span>
              <h2 className="text-lg font-semibold text-white">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {result.strengths.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: EASE }}
                  className="flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] p-3"
                >
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  <span className="text-sm leading-relaxed text-white/75">
                    {s}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div variants={fadeUpFast}>
          <div className="glass h-full overflow-hidden rounded-3xl border-rose-400/15 p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-400/15">
                <TriangleAlert className="text-rose-400" size={18} />
              </span>
              <h2 className="text-lg font-semibold text-white">
                Areas to Improve
              </h2>
            </div>
            <ul className="space-y-3">
              {result.weaknesses.map((w, i) => (
                <motion.li
                  key={w}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, ease: EASE }}
                  className="flex items-start gap-3 rounded-xl border border-rose-400/10 bg-rose-400/[0.06] p-3"
                >
                  <TriangleAlert
                    size={17}
                    className="mt-0.5 shrink-0 text-rose-400"
                  />
                  <span className="text-sm leading-relaxed text-white/75">
                    {w}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* BREAKDOWN + CHART */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Breakdown bars */}
        <motion.div variants={fadeUpFast}>
          <div className="glass h-full rounded-3xl p-7">
            <h2 className="text-lg font-semibold text-white">
              Skill Breakdown
            </h2>
            <p className="mt-1 text-sm text-white/45">
              How you scored across key dimensions.
            </p>
            <div className="mt-6 space-y-5">
              {result.breakdown.map((b, i) => (
                <div key={b.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-white/80">
                      {b.label}
                    </span>
                    <span className="tabular-nums font-semibold text-white">
                      {b.score}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.score}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: 0.15 + i * 0.12,
                        ease: EASE,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance chart */}
        <motion.div variants={fadeUpFast}>
          <div className="glass h-full rounded-3xl p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Performance Trend
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  Score per question across the session.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                +{result.trend[result.trend.length - 1] - result.trend[0]} pts
              </div>
            </div>
            <div className="mt-4">
              <PerformanceChart data={result.trend} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* IMPROVED ANSWER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-6"
      >
        <div className="glass-strong relative overflow-hidden rounded-3xl p-7 sm:p-9">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-lg">
              <Sparkles className="text-white" size={18} />
            </span>
            <h2 className="text-lg font-semibold text-white">
              Improved Answer
            </h2>
          </div>

          <p className="mb-5 text-sm font-medium text-white/55">
            {result.improvedAnswer.question}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Original */}
            <div className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-rose-300">
                <TriangleAlert size={13} />
                Your answer
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {result.improvedAnswer.original}
              </p>
            </div>
            {/* Improved */}
            <div className="relative rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
              <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-azure-400/10 opacity-50 blur-sm" />
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                <CheckCircle2 size={13} />
                AI rewrite
              </div>
              <p className="text-sm leading-relaxed text-white/85">
                {result.improvedAnswer.improved}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TIPS */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {result.tips.map((tip) => (
          <motion.div
            key={tip}
            variants={fadeUpFast}
            className="glass flex items-start gap-3 rounded-2xl p-5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15">
              <Lightbulb className="text-amber-300" size={17} />
            </span>
            <p className="text-sm leading-relaxed text-white/70">{tip}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* FINAL CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row"
      >
        <AnimatedButton href={`/interview/${role.id}`} size="lg">
          <RotateCcw size={17} />
          Practice again
        </AnimatedButton>
        <AnimatedButton href="/roles" variant="secondary" size="lg">
          Explore other roles
          <ArrowRight size={17} />
        </AnimatedButton>
      </motion.div>
    </main>
  );
}
