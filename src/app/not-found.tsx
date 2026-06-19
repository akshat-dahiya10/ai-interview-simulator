"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-[0_10px_40px_-8px_rgba(124,58,237,0.7)]">
          <Compass className="text-white" size={28} />
        </div>
        <p className="bg-gradient-to-r from-brand-300 to-azure-400 bg-clip-text text-7xl font-semibold text-transparent">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          This page wandered off
        </h1>
        <p className="mt-2 max-w-sm text-sm text-white/50">
          The interview track you're looking for doesn't exist. Let's get you
          back on track.
        </p>
        <div className="mt-7">
          <AnimatedButton href="/roles" size="md">
            Browse interview tracks
          </AnimatedButton>
        </div>
      </motion.div>
    </main>
  );
}
