import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // ✅ ADD CONTROLLED PROMPT (IMPORTANT FIX)
  const enhancedBody = {
    ...body,

    // 🧠 FORCE BETTER QUESTIONS
    system_prompt: `
You are a coding interviewer.

Rules:
- Ask ONLY ONE coding question
- Keep it SHORT (max 80-120 words)
- Must be solvable in a SINGLE function
- DO NOT ask system design or theory
- DO NOT require multiple files
- DO NOT give very long descriptions
- Prefer DSA (arrays, strings, hashmap, etc.)
- Difficulty: Easy to Medium
`,
  };

  const res = await fetch(
    "https://ai-interview-simulator-production-10.up.railway.app/generate-question",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enhancedBody), // ✅ USE ENHANCED BODY
    }
  );

  const data = await res.json();

  // ✅ EXTRA SAFETY (trim long questions)
  if (data?.question && data.question.length > 500) {
    data.question = data.question.slice(0, 500) + "...";
  }

  return NextResponse.json(data);
}
