"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import TypingIndicator from "@/components/ui/TypingIndicator";

interface ChatBubbleProps {
  message?: ChatMessage;
  typing?: boolean;
}

export default function ChatBubble({ message, typing }: ChatBubbleProps) {
  const isAI = message?.sender === "ai";

  // 🔥 IMPROVED typing indicator (more alive)
  if (typing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-start gap-3"
      >
        <Avatar kind="ai" />
        <div className="relative rounded-2xl rounded-tl-sm glass px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>AI is thinking</span>
            <TypingIndicator />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!message) return null;

  // 🔥 AI MESSAGE
  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.01 }} // 🔥 hover effect
        className="flex items-start gap-3"
      >
        <Avatar kind="ai" />

        <div className="relative max-w-[78%]">
          {/* glowing border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-400/60 via-transparent to-azure-400/50 opacity-70 blur-[1px]" />

          <div className="relative rounded-2xl rounded-tl-sm bg-white/[0.06] p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.09]">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
              {message.text}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // 🔥 USER MESSAGE
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.01 }} // 🔥 hover feel
      className="flex items-start justify-end gap-3"
    >
      <div className="max-w-[78%] rounded-2xl rounded-tr-sm border border-white/10 bg-gradient-to-br from-brand-600/40 to-indigo-700/30 px-4 py-3 shadow-lg shadow-brand-900/20 transition-all duration-300 hover:shadow-xl">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/90">
          {message.text}
        </p>
      </div>

      <Avatar kind="user" />
    </motion.div>
  );
}

function Avatar({ kind }: { kind: "ai" | "user" }) {
  if (kind === "ai") {
    return (
      <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-[0_4px_18px_-4px_rgba(124,58,237,0.8)]">
        <Sparkles className="h-4.5 w-4.5 text-white" size={18} />

        {/* 🔥 pulse animation */}
        <motion.span
          className="absolute inset-0 rounded-xl ring-2 ring-brand-400/40"
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    );
  }

  return (
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
      <User className="text-white/70" size={16} />
    </div>
  );
}
