"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
        <a href="/" className="flex items-center gap-2.5 pl-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-[0_4px_14px_-2px_rgba(124,58,237,0.8)]">
            <Sparkles className="text-white" size={16} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            MockMind
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/roles"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline-block"
          >
            Sign in
          </a>
          <AnimatedButton href="/roles" size="sm">
            Start Interview
          </AnimatedButton>
        </div>
      </nav>
    </motion.header>
  );
}
