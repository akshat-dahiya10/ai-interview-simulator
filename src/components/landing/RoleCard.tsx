"use client";

import { motion } from "framer-motion";
import { Clock, Signal } from "lucide-react";
import type { Role } from "@/lib/types";
import { resolveIcon } from "@/components/icons";

interface RoleCardProps {
  role: Role;
  index: number;
}

export default function RoleCard({ role, index }: RoleCardProps) {
  const Icon = resolveIcon(role.icon);

  return (
    <motion.a
      href={`/interview/${role.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative block"
    >
      <div className="glass relative h-full overflow-hidden rounded-3xl p-7 transition-colors duration-300 hover:bg-white/[0.07]">
        {/* gradient glow that follows hover */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-40"
          style={{
            backgroundImage: `linear-gradient(135deg, ${role.glow}, transparent)`,
          }}
        />

        {/* animated gradient border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-400/40 via-transparent to-azure-400/30 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-px" />
        </div>

        <div className="relative flex items-start justify-between">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.accent} shadow-[0_10px_30px_-8px_rgba(124,58,237,0.55)] transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className="text-white" size={26} />
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/55">
            {role.questions.length} questions
          </span>
        </div>

        <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-white">
          {role.title}
        </h3>
        <p className="relative mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/35">
          {role.tagline}
        </p>
        <p className="relative mt-3 text-sm leading-relaxed text-white/55">
          {role.description}
        </p>

        <div className="relative mt-6 flex items-center gap-4 border-t border-white/8 pt-5 text-xs text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <Signal size={13} className="text-brand-300" />
            {role.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} className="text-azure-400" />
            {role.duration}
          </span>
        </div>

        <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
          Start interview
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}
