"use client";

import { motion } from "framer-motion";

/**
 * Three bouncing dots that signal the AI is composing a reply.
 */
export default function TypingIndicator() {
  const dots = [0, 1, 2];
  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      {dots.map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-gradient-to-br from-brand-300 to-azure-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
