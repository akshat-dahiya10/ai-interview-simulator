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

    const normalized = {
      success: true,

      score:
        data?.final_score ??   
        data?.score ??
        0,

      score_out_of_5: data?.final_score
        ? Math.round(data.final_score / 20)
        : 0,

      feedback: data?.feedback ?? "",

      improved_answer:
        data?.improved_solution ??
        data?.improved_answer ??
        "",

      passed_tests: data?.passed_tests ?? null,
      total_tests: data?.total_tests ?? null,

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
