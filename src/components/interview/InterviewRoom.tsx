"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import type { ChatMessage, Role } from "@/lib/types";
import ChatBubble from "@/components/chat/ChatBubble";
import Sidebar from "@/components/layout/Sidebar";
import ProgressBar from "@/components/ui/ProgressBar";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { resolveIcon } from "@/components/icons";

const THINK_MS = 1400;

export default function InterviewRoom({ role }: { role: Role }) {
  const total = role.questions.length;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [q, setQ] = useState(0); // index of question awaiting answer
  const [delivered, setDelivered] = useState(0); // questions posed by AI
  const [typing, setTyping] = useState(false);
  const [complete, setComplete] = useState(false);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resizeTextarea = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const Icon = resolveIcon(role.icon);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  const pushAi = useCallback(
    (text: string, after = 0) => {
      setTyping(true);
      const t = setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), sender: "ai", text, createdAt: Date.now() },
        ]);
        setTyping(false);
        setTimeout(scrollToBottom, 60);
      }, after);
      timers.current.push(t);
    },
    [scrollToBottom],
  );

  // Kick off the session: greeting + first question.
  useEffect(() => {
    pushAi(
      `Thanks for joining the ${role.title} mock interview. I'll ask you ${total} questions — answer in as much detail as you'd like. Whenever you're ready:\n\n${role.questions[0].prompt}`,
      700,
    );
    setDelivered(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer.
  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  // Auto-scroll on new messages / typing.
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing || complete) return;

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), sender: "user", text, createdAt: Date.now() },
    ]);
    setInput("");

    const current = q;
    const isLast = current + 1 >= total;

    const ack = role.questions[current].acknowledge;
    const reply = isLast
      ? `${ack}\n\nThat wraps up our session — great work today. I'm analyzing your responses now and your full breakdown will be ready in a moment.`
      : `${ack}\n\n${role.questions[current + 1].prompt}`;

    pushAi(reply, THINK_MS);

    if (isLast) {
      const t = setTimeout(() => {
        setComplete(true);
        setDelivered(total);
      }, THINK_MS + 200);
      timers.current.push(t);
    } else {
      setQ(current + 1);
      setDelivered(current + 2);
    }
  };

  const progressValue = complete ? total : delivered;

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block">
        <Sidebar role={role} current={delivered} total={total} elapsed={elapsed} />
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3 lg:hidden">
          <a
            href="/roles"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50"
          >
            Exit
          </a>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${role.accent}`}
            >
              <Icon className="text-white" size={15} />
            </div>
            <span className="text-sm font-semibold text-white">
              {role.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/55">
            <Clock size={13} className="text-azure-400" />
            {timeLabel}
          </div>
        </header>

        {/* Top progress strip (desktop) */}
        <div className="hidden items-center justify-between gap-4 border-b border-white/8 px-8 py-4 lg:flex">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={15} className="text-brand-300" />
            <span className="font-medium text-white">
              Question {complete ? total : q + 1}
              <span className="text-white/40"> / {total}</span>
            </span>
            <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
              {complete ? "Complete" : "In progress"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-56">
              <ProgressBar value={progressValue} total={total} />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums text-white/70">
              <Clock size={15} className="text-azure-400" />
              {timeLabel}
            </div>
          </div>
        </div>

        {/* Chat scroll area */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}

            {typing && <ChatBubble typing />}

            {/* Completion CTA */}
            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <div className="glass relative overflow-hidden rounded-2xl p-6 text-center">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-azure-500 shadow-lg">
                      <Sparkles className="text-white" size={22} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Interview complete
                    </h3>
                    <p className="mx-auto mt-1 max-w-md text-sm text-white/55">
                      Your detailed performance breakdown is ready. See your
                      score, strengths, and a rewritten answer.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <AnimatedButton href={`/interview/${role.id}/results`} size="md">
                        View my results
                        <ArrowRight size={16} />
                      </AnimatedButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 pb-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            {complete ? (
              <div className="glass flex items-center justify-between rounded-2xl px-5 py-4 text-sm text-white/55">
                <span>This session is complete.</span>
                <AnimatedButton href={`/interview/${role.id}/results`} variant="secondary" size="sm">
                  See results
                </AnimatedButton>
              </div>
            ) : (
              <form onSubmit={handleSend} className="glass-strong flex items-end gap-2 rounded-2xl p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Type your answer…  (Enter to send · Shift+Enter for a new line)"
                  className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || typing}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c3aed,#6366f1,#0ea5e9)] text-white shadow-[0_8px_24px_-6px_rgba(124,58,237,0.8)] disabled:opacity-40 disabled:shadow-none"
                  aria-label="Send answer"
                >
                  <span className="absolute inset-0 rounded-xl bg-white/0 transition-colors group-hover:bg-white/15 group-disabled:bg-transparent" />
                  <ArrowRight size={18} className="relative transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              </form>
            )}
            <p className="mt-2 text-center text-[11px] text-white/30">
              MockMind is a simulation — responses are generated for practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
