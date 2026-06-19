"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { EASE } from "@/lib/motion";

export default function CTASection() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 text-center sm:p-16"
      >
        {/* gradient backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.28),rgba(56,189,248,0.18))] backdrop-blur-xl" />
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/10" />
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-azure-500/25 blur-3xl" />

        <div className="relative">
          <span className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
            <Sparkles size={13} className="text-brand-200" />
            Your next offer starts here
          </span>
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Stop guessing.
            <span className="text-gradient-animate"> Start practicing.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/65">
            Run a full mock interview in minutes and get the feedback that
            turns a maybe into an offer.
          </p>
          <div className="mt-9 flex justify-center">
            <AnimatedButton href="/roles" size="lg">
              Start Interview
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
