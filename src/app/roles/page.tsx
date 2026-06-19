"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import RoleCard from "@/components/landing/RoleCard";
import { ROLES } from "@/lib/data";

export default function RolesPage() {
  return (
    <main className="relative mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-28 sm:pt-32">
      {/* back link */}
      <motion.a
        href="/"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back home
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mx-auto mt-8 max-w-2xl text-center"
      >
        <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-brand-200">
          <Sparkles size={13} />
          Choose your track
        </span>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          What role are you
          <span className="text-gradient"> interviewing for?</span>
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-white/55">
          Each track uses real, role-specific questions and adapts to your
          answers. Pick one to begin a live mock interview.
        </p>
      </motion.div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {ROLES.map((role, i) => (
          <RoleCard key={role.id} role={role} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-col items-center gap-3 text-center"
      >
        <p className="text-sm text-white/40">
          Not sure where to start? Try the Frontend track — it's the most
          popular.
        </p>
        <AnimatedButton href="/interview/frontend" variant="secondary" size="sm">
          Quick start: Frontend
        </AnimatedButton>
      </motion.div>
    </main>
  );
}
