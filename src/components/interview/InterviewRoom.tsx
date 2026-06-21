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

const THINK_MS = 800;

export default function InterviewRoom({ role }: { role: Role }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

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

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) return;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const generateQuestion = async () => {
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
    return data.question;
  };

  const evaluateAnswer = async (question: string, answer: string) => {
    const res = await fetch(`${BASE_URL}/evaluate-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        answer,
        code,
      }),
    });
    return await res.json();
  };

  useEffect(() => {
    const firstQ = "Tell me about yourself.";
    currentQuestionRef.current = firstQ;
    historyRef.current = [{ question: firstQ, answer: "" }];
    pushAi(`Welcome to ${role.title} interview\n\n${firstQ}`, 600);
  }, []);

  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text || typing || complete) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text, createdAt: Date.now() },
    ]);

    setInput("");

    const currentQ = currentQuestionRef.current;
    historyRef.current[historyRef.current.length - 1].answer = text;

    const feedback = await evaluateAnswer(currentQ, text);

    pushAi(
      `Score: ${feedback.score}/10\n\nStrengths:\n- ${feedback.strengths.join(
        "\n- "
      )}\n\nWeaknesses:\n- ${feedback.weaknesses.join(
        "\n- "
      )}\n\nImproved:\n${feedback.improved_answer}`,
      THINK_MS
    );

    if (historyRef.current.length >= 5) {
      setTimeout(() => {
        setComplete(true);
        pushAi("Interview completed");
      }, 1200);
      return;
    }

    const nextQ = await generateQuestion();
    currentQuestionRef.current = nextQ;
    historyRef.current.push({ question: nextQ, answer: "" });

    setTimeout(() => pushAi(nextQ), 1200);
  };

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-[#0a0a12] to-[#05050a] text-white flex flex-col">

      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <h1 className="text-xl font-semibold">{role.title} Interview</h1>
        <span className="text-white/60">{timeLabel}</span>
      </div>

      <div className="flex justify-center py-4">
        <div className="flex gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              className={`px-4 py-1 rounded-lg text-sm ${
                difficulty === lvl
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="animate-[fadeIn_0.4s_ease]">
            <ChatBubble message={m} />
          </div>
        ))}
        {typing && <div className="text-white/40 animate-pulse">AI is typing...</div>}
      </div>

      <div className="px-6 pb-6">
        {currentQuestionRef.current.toLowerCase().includes("code") && (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full mb-3 h-32 bg-black border border-green-500/20 rounded-xl p-3 text-green-400 font-mono"
            placeholder="Write your code..."
          />
        )}

        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-xl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none resize-none text-white placeholder-white/30"
            placeholder="Type your answer..."
          />

          <button
            type="button"
            onClick={startListening}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
              isListening
                ? "bg-red-500 animate-pulse"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <Mic size={18} />
          </button>

          <button
            type="submit"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition"
          >
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
