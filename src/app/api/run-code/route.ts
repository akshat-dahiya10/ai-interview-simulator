export async function POST(req: Request) {
  try {
    const { code, language, input } = await req.json();

    const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: language === "python" ? 71 : 63,
        stdin: input || "",
      }),
    });

    const data = await response.json();

    return Response.json({
      output:
        data.stdout ||
        data.stderr ||
        data.compile_output ||
        "No output",
    });
  } catch (err: any) {
    return Response.json(
      { error: "Execution failed", details: err.message },
      { status: 500 }
    );
  }
}
