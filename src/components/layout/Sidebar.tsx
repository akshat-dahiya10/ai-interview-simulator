"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BrainCircuit, CheckCircle2, Clock } from "lucide-react";
import type { Role } from "@/lib/types";
import { ICONS } from "@/components/icons";
import ProgressBar from "@/components/ui/ProgressBar";
import { EASE } from "@/lib/motion";

interface SidebarProps {
  role: Role;
  current: number;
  total: number;
  elapsed: number; // seconds
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function Sidebar({
  role,
  current,
  total,
  elapsed,
}: SidebarProps) {
  const Icon = ICONS[role.icon];

  return (
    <aside className="flex h-full w-full flex-col gap-5 p-5 lg:w-72 lg:border-r lg:border-white/8">
      {/* Exit */}
      <a
        href="/roles"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/45 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Exit interview
      </a>

      {/* Role card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="glass overflow-hidden rounded-2xl p-5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} shadow-lg`}
          >
            <Icon className="text-white" size={20} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {role.title}
            </div>
            <div className="truncate text-xs text-white/40">
              {role.difficulty} · {role.duration}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
            Progress
          </span>
          <span className="text-sm font-semibold tabular-nums text-white">
            {current}
            <span className="text-white/40">/{total}</span>
          </span>
        </div>
        <ProgressBar value={current} total={total} />
        <p className="mt-3 text-xs leading-relaxed text-white/45">
          {current >= total
            ? "All questions covered — wrapping up."
            : `Question ${current + 1} of ${total} coming up.`}
        </p>
      </div>

      {/* Timer */}
      <div className="glass flex items-center gap-3 rounded-2xl p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Clock size={17} className="text-azure-400" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
            Elapsed
          </div>
          <div className="text-lg font-semibold tabular-nums text-white">
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Question checklist */}
      <div className="glass hidden flex-1 rounded-2xl p-5 lg:block">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
          <BrainCircuit size={14} className="text-brand-300" />
          Question list
        </div>
        <ol className="space-y-2.5">
          {role.questions.map((q, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={q.id} className="flex items-start gap-2.5">
                {done ? (
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                ) : (
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold ${
                      active
                        ? "border-brand-400 bg-brand-500/30 text-white"
                        : "border-white/15 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
                <span
                  className={`text-xs leading-snug ${
                    done
                      ? "text-white/35 line-through"
                      : active
                        ? "text-white/80"
                        : "text-white/40"
                  }`}
                >
                  {q.prompt.length > 48
                    ? q.prompt.slice(0, 48) + "…"
                    : q.prompt}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
