"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { staggerContainer as container, fadeUp as item } from "@/lib/motion";

export default function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-36 text-center sm:pt-44">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        {/* Eyebrow pill */}
        <motion.div
          variants={item}
          className="glass mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
        >
          <span className="flex -space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <Star
                key={i}
                size={12}
                className="fill-amber-300 text-amber-300"
              />
            ))}
          </span>
          Trusted by 120,000+ candidates
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient-animate">Crack Interviews</span>
          <br />
          <span className="text-white/95">with AI</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/55"
        >
          Practice real interview questions and get instant AI feedback.
          Simulate the pressure, master your answers, and walk in with
          confidence.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <AnimatedButton href="/roles" size="lg" className="w-full sm:w-auto">
            Start Interview
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </AnimatedButton>
          <AnimatedButton
            href="/roles"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Play size={15} className="fill-white/80" />
            View Demo
          </AnimatedButton>
        </motion.div>

        {/* Trust line */}
        <motion.div
          variants={item}
          className="mt-7 flex items-center gap-2 text-xs text-white/40"
        >
          <Sparkles size={13} className="text-brand-300" />
          No sign-up required · Free to try
        </motion.div>
      </motion.div>

      {/* Hero preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-20 w-full max-w-5xl"
      >
        <div className="absolute -inset-x-10 -top-10 bottom-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.35),transparent_60%)] blur-2xl" />
        <HeroMockup />
      </motion.div>
    </section>
  );
}

/** A stylized chat preview that hints at the interview product. */
function HeroMockup() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-3 shadow-[0_40px_120px_-30px_rgba(80,40,200,0.6)]">
      <div className="rounded-2xl bg-ink-950/60 p-5 sm:p-7">
        {/* window dots */}
        <div className="mb-5 flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="h-3 w-3 rounded-full bg-white/15" />
          <span className="ml-3 text-xs text-white/30">
            mockmind.ai / interview / frontend
          </span>
        </div>

        <div className="space-y-4 text-left">
          {/* AI message */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex items-start gap-3"
          >
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-azure-500">
              <Sparkles size={14} className="text-white" />
            </span>
            <div className="relative max-w-md rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-3.5">
              Walk me through what happens when you type a URL and hit enter —
              from a rendering perspective.
            </div>
          </motion.div>

          {/* User message */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="flex justify-end"
          >
            <div className="max-w-md rounded-2xl rounded-tr-sm border border-white/10 bg-gradient-to-br from-brand-600/50 to-indigo-700/40 p-3.5 text-white/90">
              The browser parses HTML into the DOM, builds the CSSOM, then
              constructs the render tree and lays out pixels before painting…
            </div>
          </motion.div>

          {/* AI feedback inline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
            className="ml-11 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300"
          >
            ✓ Great breakdown of the critical render path
          </motion.div>
        </div>
      </div>
    </div>
  );
}
