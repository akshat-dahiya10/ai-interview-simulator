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
  const [code, setCode] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [historyState, setHistoryState] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
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

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  };

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

    const initialHistory = [{ question: firstQ, answer: "" }];
    historyRef.current = initialHistory;
    setHistoryState(initialHistory);

    pushAi(`Welcome to ${role.title} interview.\n\n${firstQ}`, 800);
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

    pushAi(
      `Score: ${feedback.score}/10

Strengths:
- ${feedback.strengths.join("\n- ")}

Weaknesses:
- ${feedback.weaknesses.join("\n- ")}

Improved:
${feedback.improved_answer}`,
      THINK_MS
    );

    if (historyRef.current.length >= 5) {
      setTimeout(() => {
        setComplete(true);
        pushAi("Interview completed");
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

  const isCoding = currentQuestionRef.current.toLowerCase().includes("code");

  const timeLabel = useMemo(() => {
    const m = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  return (
    <div className="flex h-[100dvh] w-full bg-[#0b0b0f] text-white">
      <div className="flex flex-1 flex-col">
        <div className="px-6 py-4 flex justify-between">
          <h1>{role.title} Interview</h1>
          <span>{timeLabel}</span>
        </div>

        <div className="px-6">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mb-3 bg-white/10 p-2 rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {typing && <ChatBubble typing />}
        </div>

        <div className="px-6 pb-6">
          {isCoding && (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-32 bg-black text-green-400 mb-3 p-2"
              placeholder="Write code here..."
            />
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/10 p-2"
            />
            <button type="button" onClick={startListening}>
              🎤
            </button>
            <button>
              <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
