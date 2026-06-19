import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, answer } = await req.json();

  const res = await fetch("http://127.0.0.1:8000/evaluate-answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, answer }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
