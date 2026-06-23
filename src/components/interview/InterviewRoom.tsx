"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight, Mic } from "lucide-react";
import type { ChatMessage, Role } from "@/lib/types";
import ChatBubble from "@/components/chat/ChatBubble";
import CodingRound from "@/components/interview/CodingRound";

const THINK_MS = 800;

export default function InterviewRoom({ role }: { role: Role }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // ================= ROUND SYSTEM =================
  const [round, setRound] = useState<"chat" | "coding">("chat");
  const [codingQuestion, setCodingQuestion] = useState("");
  const [canResumeCoding, setCanResumeCoding] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  // ================= SCROLL =================
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  // ================= TYPE EFFECT =================
  const typeText = (text: string, callback: (t: string) => void) => {
    let i = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[i];
      callback(current);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 12);
  };

  const pushAi = (text: string, delay = 0) => {
    setTyping(true);

    setTimeout(() => {
      const id = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id, sender: "ai", text: "", createdAt: Date.now() },
      ]);

      typeText(text, (t) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text: t } : m))
        );
        scrollToBottom();
      });

      setTyping(false);
    }, delay);
  };

  // ================= QUESTION GENERATION =================
  const generateQuestion = async () => {
    try {
      const res = await fetch(`${BASE_URL}/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role.id,
          history: historyRef.current,
          difficulty,
        }),
      });

      const data = await res.json();
      return data.question || "Explain a project you worked on.";
    } catch {
      return "Explain a project you worked on.";
    }
  };

  // ================= INIT =================
  useEffect(() => {
    const firstQ = "Tell me about yourself.";
    currentQuestionRef.current = firstQ;
    historyRef.current = [{ question: firstQ, answer: "" }];
    pushAi(`Welcome to ${role.title}\n\n${firstQ}`, 600);
  }, []);

  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  // ================= DETECT CODING =================
  const isCodingQuestion = (text: string) => {
    return /code|write|program|implement|leetcode|function|algorithm/i.test(
      text
    );
  };

  // ================= SEND ANSWER =================
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text || typing || complete) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text, createdAt: Date.now() },
    ]);

    setInput("");

    historyRef.current[historyRef.current.length - 1].answer = text;

    const nextQ = await generateQuestion();
    currentQuestionRef.current = nextQ;
    historyRef.current.push({ question: nextQ, answer: "" });

    // ================= CODING TRIGGER =================
    if (isCodingQuestion(nextQ)) {
      setCodingQuestion(nextQ);

      setTimeout(() => {
        setRound("coding");
      }, 1000);

      return;
    }

    setTimeout(() => pushAi(nextQ), THINK_MS);

    if (historyRef.current.length >= 5) {
      setTimeout(() => {
        setComplete(true);
        pushAi("Interview completed");
      }, 1200);
    }
  };

  const resumeCoding = () => {
    setRound("coding");
    setCanResumeCoding(false);
  };

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  // ================= CODING VIEW =================
  if (round === "coding") {
    return (
      <CodingRound
        question={codingQuestion}
        onExit={() => {
          setRound("chat");
          setCanResumeCoding(true);
        }}
      />
    );
  }

  // ================= CHAT UI =================
  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-[#0a0a12] to-[#05050a] text-white flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-xl font-semibold">{role.title} Interview</h1>
        <span className="text-white/60">{timeLabel}</span>
      </div>

      {/* DIFFICULTY */}
      <div className="flex justify-center py-4">
        <div className="flex gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-4 py-1 rounded-lg text-sm ${
                difficulty === lvl ? "bg-white text-black" : "text-white/60"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}

        {typing && (
          <div className="text-white/40 animate-pulse">
            AI is typing...
          </div>
        )}
      </div>

      {/* RESUME BUTTON */}
      {canResumeCoding && (
        <div className="px-6 pb-2">
          <button
            onClick={resumeCoding}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            Resume Coding Round
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="px-6 pb-6">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none resize-none"
            placeholder="Type your answer..."
          />

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/10"
          >
            <Mic size={18} />
          </button>

          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-white text-black"
          >
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
