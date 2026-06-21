"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight } from "lucide-react";
import type { ChatMessage, Role } from "@/lib/types";
import ChatBubble from "@/components/chat/ChatBubble";
import Sidebar from "@/components/layout/Sidebar";

const THINK_MS = 1200;

export default function InterviewRoom({ role }: { role: Role }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-3414.up.railway.app";

  // =============================
  // SCROLL
  // =============================
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // =============================
  // PUSH AI MESSAGE
  // =============================
  const pushAi = (text: string, delay = 0) => {
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          text,
          createdAt: Date.now(),
        },
      ]);
      setTyping(false);
      scrollToBottom();
    }, delay);
  };

  // =============================
  // GENERATE QUESTION
  // =============================
  const generateQuestion = async () => {
    try {
      const res = await fetch(`${BASE_URL}/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role.id,
          history: historyRef.current,
        }),
      });

      const data = await res.json();
      return data.question || "Explain your recent project.";
    } catch (err) {
      console.error(err);
      return "Explain your recent project.";
    }
  };

  // =============================
  // EVALUATE ANSWER
  // =============================
  const evaluateAnswer = async (question: string, answer: string) => {
    try {
      const res = await fetch(`${BASE_URL}/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
        }),
      });

      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // =============================
  // START INTERVIEW (FIXED FIRST Q)
  // =============================
  useEffect(() => {
    const firstQ = "Tell me about yourself.";
    currentQuestionRef.current = firstQ;

    pushAi(
      `Welcome to ${role.title} interview.\n\n${firstQ}`,
      800
    );
  }, []);

  // =============================
  // TIMER
  // =============================
  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  // =============================
  // HANDLE SEND
  // =============================
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text || typing || complete) return;

    // user message
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text,
        createdAt: Date.now(),
      },
    ]);

    setInput("");

    // =============================
    // 1. EVALUATION
    // =============================
    const feedback = await evaluateAnswer(
      currentQuestionRef.current,
      text
    );

    if (feedback) {
      pushAi(
        `Score: ${feedback.score}/10

Strengths:
- ${feedback.strengths?.join("\n- ")}

Weaknesses:
- ${feedback.weaknesses?.join("\n- ")}

Improved Answer:
${feedback.improved_answer}`,
        THINK_MS
      );
    }

    // save history
    historyRef.current.push({
      question: currentQuestionRef.current,
      answer: text,
    });

    // =============================
    // 2. NEXT QUESTION
    // =============================
    const nextQ = await generateQuestion();
    currentQuestionRef.current = nextQ;

    pushAi(nextQ, THINK_MS + 800);

    // =============================
    // COMPLETE AFTER 5 Q
    // =============================
    if (historyRef.current.length >= 5) {
      setTimeout(() => {
        setComplete(true);
        pushAi("Interview completed ✅");
      }, 2000);
    }
  };

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="flex h-[100dvh] w-full">
      <div className="hidden lg:block">
        <Sidebar
          role={role}
          current={historyRef.current.length}
          total={5}
          elapsed={elapsed}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {typing && <ChatBubble typing />}
          </div>
        </div>

        <div className="p-4">
          {complete ? (
            <div className="text-center text-white text-lg">
              Interview Complete ✅
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 rounded bg-black text-white"
                placeholder="Type your answer..."
              />
              <button className="bg-purple-600 px-4 rounded text-white">
                <ArrowRight />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
