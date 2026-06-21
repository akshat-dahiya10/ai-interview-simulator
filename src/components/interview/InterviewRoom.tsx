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
  const [historyState, setHistoryState] = useState<any[]>([]);

  // 🎤 VOICE
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  // 🔊 SPEAK
  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🎤 LISTEN
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

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

  // SCROLL
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // AI MESSAGE
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

      speakText(text);

      setTyping(false);
      scrollToBottom();
    }, delay);
  };

  // GENERATE QUESTION
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
    } catch {
      return "Explain your recent project.";
    }
  };

  // EVALUATE
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
    } catch {
      return null;
    }
  };

  // START
  useEffect(() => {
    const firstQ = "Tell me about yourself.";
    currentQuestionRef.current = firstQ;

    const initialHistory = [{ question: firstQ, answer: "" }];
    historyRef.current = initialHistory;
    setHistoryState(initialHistory);

    pushAi(`Welcome to ${role.title} interview.\n\n${firstQ}`, 800);
  }, []);

  // TIMER
  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [complete]);

  // SEND
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text || typing || complete) return;

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

    const currentQ = currentQuestionRef.current;

    const updatedHistory = historyRef.current.map((item, index) =>
      index === historyRef.current.length - 1
        ? { ...item, answer: text }
        : item
    );

    historyRef.current = updatedHistory;
    setHistoryState(updatedHistory);

    const feedback = await evaluateAnswer(currentQ, text);

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

    if (historyRef.current.length >= 5) {
      setTimeout(() => {
        setComplete(true);
        pushAi("Interview completed ✅");
      }, 1500);
      return;
    }

    const nextQ = await generateQuestion();
    currentQuestionRef.current = nextQ;

    const newHistory = [
      ...historyRef.current,
      { question: nextQ, answer: "" },
    ];

    historyRef.current = newHistory;
    setHistoryState(newHistory);

    setTimeout(() => {
      pushAi(nextQ);
    }, 1500);
  };

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="flex h-[100dvh] w-full bg-[#0b0b0f] text-white">
      <div className="hidden lg:block border-r border-white/10">
        <Sidebar
          role={role}
          current={historyState.length}
          total={5}
          elapsed={elapsed}
        />
      </div>

      <div className="flex flex-1 flex-col backdrop-blur-xl">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between">
          <h1 className="text-lg font-semibold">
            {role.title} Interview
          </h1>
          <span className="text-white/50">{timeLabel}</span>
        </div>

        {/* CHAT */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth px-6 py-6"
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {messages.map((m) => (
              <ChatBubble
                key={m.id}
                message={m}
                className="transition-all duration-300"
              />
            ))}
            {typing && <ChatBubble typing />}
          </div>
        </div>

        {/* INPUT */}
        <div className="px-6 pb-6">
          {complete ? (
            <div className="text-center text-white/70 text-lg py-6">
              Interview Complete ✅
            </div>
          ) : (
            <form
              onSubmit={handleSend}
              className="max-w-3xl mx-auto flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none resize-none"
                placeholder="Type or speak..."
              />

              <button
                type="button"
                onClick={startListening}
                className={`w-10 h-10 rounded-full ${
                  isListening
                    ? "bg-red-500"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                🎤
              </button>

              <button className="w-10 h-10 rounded-full bg-white text-black">
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
