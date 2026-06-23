import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://ai-interview-simulator-production-10.up.railway.app/evaluate-answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),

        // ⛑️ safety: prevent hanging requests
        signal: AbortSignal.timeout(15000),
      }
    );

    // ⛑️ handle non-200 responses
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Backend evaluation failed",
          status: res.status,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 🧠 normalize response (VERY IMPORTANT for your score UI)
    return NextResponse.json({
      score: data?.score ?? data?.result?.score ?? null,
      feedback: data?.feedback ?? data?.result?.feedback ?? "",
      suggestion:
        data?.suggestion ?? data?.result?.suggestion ?? "",
      raw: data, // fallback debug (safe)
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Internal evaluation error",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
