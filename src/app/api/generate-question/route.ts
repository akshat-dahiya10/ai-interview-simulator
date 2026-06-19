import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { role } = await req.json();

  const res = await fetch("http://127.0.0.1:8000/generate-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}