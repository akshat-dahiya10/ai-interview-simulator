export type RoleId = "frontend" | "backend" | "hr" | "aiml";

export interface RoleQuestion {
  id: string;
  prompt: string;
  /** Acknowledgment the AI gives before moving to the next question. */
  acknowledge: string;
}

export interface Role {
  id: RoleId;
  title: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name resolved in components
  accent: string; // tailwind gradient stops "from-... to-..."
  glow: string; // rgba for glow
  difficulty: string;
  duration: string;
  questions: RoleQuestion[];
}

export type Sender = "ai" | "user";

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  createdAt: number;
}

export interface ResultBreakdown {
  label: string;
  score: number; // 0-100
  color: string; // tailwind gradient
}

export interface InterviewResult {
  score: number; // overall 0-100
  verdict: string;
  headline: string;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: {
    question: string;
    original: string;
    improved: string;
  };
  breakdown: ResultBreakdown[];
  trend: number[]; // per-question scores for the chart
  tips: string[];
}
