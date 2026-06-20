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
  const [q, setQ] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [typing, setTyping] = useState(false);
  const [complete, setComplete] = useState(false);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const Icon = resolveIcon(role.icon);

  // ✅ BACKEND CALL
  const generateQuestion = async () => {
    try {
      const res = await fetch(
        "https://ai-interview-simulator-production-3414.up.railway.app/generate-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: role.id }),
        }
      );

      const data = await res.json();
      return data.question || "Tell me about yourself.";
    } catch (err) {
      console.error("API Error:", err);
      return "Tell me about yourself.";
    }
  };

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
    [scrollToBottom]
  );

  // 🚀 START INTERVIEW (DYNAMIC QUESTION)
  useEffect(() => {
    const start = async () => {
      const firstQ = await generateQuestion();

      pushAi(
        `Thanks for joining the ${role.title} mock interview.\n\n${firstQ}`,
        700
      );

      setDelivered(1);
    };

    start();
    // eslint-disable-next-line
  }, []);

  // TIMER
  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // 🚀 SEND ANSWER + GET NEXT QUESTION
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || typing || complete) return;

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), sender: "user", text, createdAt: Date.now() },
    ]);

    setInput("");

    const nextQ = await generateQuestion();

    pushAi(nextQ, THINK_MS);

    setQ((prev) => prev + 1);
    setDelivered((prev) => prev + 1);

    // OPTIONAL LIMIT
    if (delivered + 1 >= 5) {
      setTimeout(() => {
        setComplete(true);
      }, THINK_MS + 200);
    }
  };

  const progressValue = complete ? delivered : delivered;

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar role={role} current={delivered} total={total} elapsed={elapsed} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between px-4 py-3 lg:hidden">
          <span className="text-sm text-white">{role.title}</span>
          <span className="text-xs text-white/60">{timeLabel}</span>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {typing && <ChatBubble typing />}
          </div>
        </div>

        <div className="p-4">
          {complete ? (
            <div className="text-center text-white">Interview Complete ✅</div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 rounded bg-black text-white"
                placeholder="Type your answer..."
              />
              <button type="submit" className="bg-purple-500 px-4 rounded">
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
