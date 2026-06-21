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

  // 🎤 VOICE STATE
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);
  const currentQuestionRef = useRef<string>("");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  // =============================
  // 🔊 SPEAK AI
  // =============================
  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // =============================
  // 🎤 START LISTENING
  // =============================
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

  // =============================
  // SCROLL
  // =============================
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // =============================
  // AI MESSAGE
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

      speakText(text); // 🔥 VOICE OUTPUT

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
    } catch {
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
    } catch {
      return null;
    }
  };

  // =============================
  // START INTERVIEW
  // =============================
  useEffect(() => {
    const firstQ = "Tell me about yourself.";
    currentQuestionRef.current = firstQ;

    const initialHistory = [{ question: firstQ, answer: "" }];
    historyRef.current = initialHistory;
    setHistoryState(initialHistory);

    pushAi(`Welcome to ${role.title} interview.\n\n${firstQ}`, 800);
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
  // SEND ANSWER
  // =============================
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
    <div className="flex h-[100dvh] w-full">
      <div className="hidden lg:block">
        <Sidebar
          role={role}
          current={historyState.length}
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
                placeholder="Type or Speak..."
              />

              {/* 🎤 VOICE BUTTON */}
              <button
                type="button"
                onClick={startListening}
                className={`px-4 py-2 rounded ${
                  isListening ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {isListening ? "Listening..." : "🎤"}
              </button>

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
