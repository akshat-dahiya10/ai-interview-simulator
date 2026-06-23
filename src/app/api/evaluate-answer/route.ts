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

        // ⛑️ prevent hanging requests
        signal: AbortSignal.timeout(15000),
      }
    );

    // ❌ backend failure handling
    if (!res.ok) {
      const errorText = await res.text().catch(() => "");

      return NextResponse.json(
        {
          success: false,
          error: "Backend evaluation failed",
          status: res.status,
          details: errorText,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 🧠 STANDARDIZED RESPONSE (IMPORTANT FOR YOUR UI)
    const normalized = {
      success: true,

      // core scoring
      score:
        data?.score ??
        data?.result?.score ??
        data?.evaluation?.score ??
        0,

      // feedback fields (multi-format safe)
      feedback:
        data?.feedback ??
        data?.result?.feedback ??
        data?.evaluation?.feedback ??
        "",

      suggestion:
        data?.suggestion ??
        data?.result?.suggestion ??
        data?.retry_suggestion ??
        "",

      improved_answer:
        data?.improved_answer ??
        data?.result?.improved_answer ??
        "",

      // optional advanced fields (future-proof)
      hidden_tests_passed:
        data?.hidden_tests_passed ??
        data?.result?.hidden_tests_passed ??
        null,

      total_tests:
        data?.total_tests ??
        data?.result?.total_tests ??
        null,

      // raw debug (safe for development)
      raw: data,
    };

    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal evaluation error",
        message: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
