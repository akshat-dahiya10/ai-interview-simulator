import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" });
    }

    // 🧠 TEST CASES (REAL)
    const testCases = [
      { input: "1 2 3", output: "6" },
      { input: "5 5", output: "10" },
      { input: "10 20 30", output: "60" },
      { input: "0 0 0", output: "0" },
      { input: "100", output: "100" },
    ];

    const filePath = path.join(process.cwd(), "temp");

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    let fileName = "";
    let command = "";

    // ================= LANGUAGE HANDLING =================
    if (language === "javascript") {
      fileName = path.join(filePath, "code.js");
      fs.writeFileSync(fileName, code);

      command = `node ${fileName}`;
    } else if (language === "python") {
      fileName = path.join(filePath, "code.py");
      fs.writeFileSync(fileName, code);

      command = `python3 ${fileName}`;
    }

    let passed = 0;
    let results: any[] = [];

    // ================= RUN TEST CASES =================
    for (const test of testCases) {
      const output = await new Promise<string>((resolve) => {
        exec(command, { input: test.input }, (error, stdout) => {
          if (error) return resolve("ERROR");
          resolve(stdout.trim());
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
    return NextResponse.json({ error: "Execution failed" });
  }
}
