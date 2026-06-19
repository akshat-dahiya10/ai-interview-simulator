"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import TypingIndicator from "@/components/ui/TypingIndicator";

interface ChatBubbleProps {
  message?: ChatMessage;
  typing?: boolean;
}

/**
 * AI bubble: left aligned, gradient border, glass body, sparkle avatar.
 * User bubble: right aligned, clean solid surface.
 */
export default function ChatBubble({ message, typing }: ChatBubbleProps) {
  const isAI = message?.sender === "ai";

  if (typing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <Avatar kind="ai" />
        <div className="relative rounded-2xl rounded-tl-sm glass p-4">
          <div className="bg-gradient-to-r from-transparent via-white/10 to-transparent [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-brand-400/50 to-azure-400/30" />
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>AI is thinking</span>
            <TypingIndicator />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!message) return null;

  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="flex items-start gap-3"
      >
        <Avatar kind="ai" />
        <div className="relative max-w-[78%]">
          {/* Animated gradient border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-400/60 via-transparent to-azure-400/50 opacity-80" />
          <div className="relative rounded-2xl rounded-tl-sm bg-white/[0.06] p-4 backdrop-blur-xl">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
              {message.text}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // User bubble
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-start justify-end gap-3"
    >
      <div className="max-w-[78%] rounded-2xl rounded-tr-sm border border-white/10 bg-gradient-to-br from-brand-600/40 to-indigo-700/30 px-4 py-3 shadow-lg shadow-brand-900/20">
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
        <motion.span
          className="absolute inset-0 rounded-xl ring-2 ring-brand-400/40"
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
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
