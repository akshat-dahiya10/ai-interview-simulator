import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code or language missing" });
    }

    // ================= TEST CASES =================
    const testCases = [
      { input: "1 2 3", output: "6" },
      { input: "5 5", output: "10" },
      { input: "10 20 30", output: "60" },
      { input: "0 0 0", output: "0" },
      { input: "100", output: "100" },
    ];

    // ================= TEMP FOLDER =================
    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // ================= FILE SETUP =================
    const fileName =
      language === "javascript"
        ? path.join(tempDir, "code.js")
        : path.join(tempDir, "code.py");

    fs.writeFileSync(fileName, code);

    let passed = 0;
    const results: any[] = [];

    // ================= RUN TEST CASES =================
    for (const test of testCases) {
      const output = await new Promise<string>((resolve) => {
        let result = "";

        const child =
          language === "javascript"
            ? spawn("node", [fileName])
            : spawn("python3", [fileName]);

        // 👉 INPUT SEND
        child.stdin.write(test.input);
        child.stdin.end();

        // 👉 OUTPUT COLLECT
        child.stdout.on("data", (data) => {
          result += data.toString();
        });

        // 👉 ERROR HANDLE
        child.stderr.on("data", () => {
          resolve("ERROR");
        });

        child.on("close", () => {
          resolve(result.trim());
        });
      });

      const isPass = output === test.output;

      if (isPass) passed++;

      results.push({
        input: test.input,
        expected: test.output,
        got: output,
        passed: isPass,
      });
    }

    // ================= SCORE =================
    const total = testCases.length;
    const score = Math.floor((passed / total) * 100);

    return NextResponse.json({
      output: `Passed ${passed}/${total} test cases`,
      passed_tests: passed,
      total_tests: total,
      score,
      details: results,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Execution failed" });
  }
}
