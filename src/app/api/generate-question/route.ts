import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role } = await req.json();

  const res = await fetch("https://ai-interview-simulator-production-3414.up.railway.app/generate-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
