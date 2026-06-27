import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://ai-interview-simulator-production-10.up.railway.app/evaluate-answer-pro", // ✅ FIXED ENDPOINT
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),

        signal: AbortSignal.timeout(15000),
      }
    );

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

    // 🧠 NORMALIZED RESPONSE
    const normalized = {
      success: true,

      // ✅ SCORE
      score:
        data?.score ??
        data?.result?.score ??
        data?.evaluation?.score ??
        0,

      // ✅ FEEDBACK
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

      // ✅ FIXED TEST CASE FIELDS (IMPORTANT)
      passed_tests:
        data?.passed_tests ??
        data?.hidden_tests_passed ??
        data?.result?.passed_tests ??
        null,

      total_tests:
        data?.total_tests ??
        data?.result?.total_tests ??
        null,

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
