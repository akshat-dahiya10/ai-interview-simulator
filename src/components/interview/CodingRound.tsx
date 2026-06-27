"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";

type Props = {
  question?: string;
  onExit?: () => void;
};

const defaultCode: Record<string, string> = {
  javascript: `function solve(nums) {
  // write your code here
  return nums.reduce((a,b)=>a+b,0);
}`,
  python: `def solve(nums):
    return sum(nums)`,
};

export default function CodingRound({ question, onExit }: Props) {
  const [language, setLanguage] =
    useState<"javascript" | "python">("javascript");

  const [code, setCode] = useState(defaultCode["javascript"]);
  const [output, setOutput] = useState("");

  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hiddenTests, setHiddenTests] = useState<string>("");

  const runCode = async () => {
    try {
      // 🚨 VALIDATION
      if (!code || code.trim().length < 10) {
        alert("Please write some valid code first.");
        return;
      }

      setOutput("Running...");
      setHiddenTests("");
      setScore(null);
      setFeedback("");

      // ================= RUN CODE =================
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");

      // ================= EVALUATE CODE =================
      const evalRes = await fetch("/api/evaluate-answer-pro", {  // ✅ FIXED API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || "Coding Problem",
          code: code, // ✅ FIXED FIELD
        }),
      });

      const evalData = await evalRes.json();

      console.log("Eval response:", evalData);

      // ✅ SCORE
      if (typeof evalData.score === "number") {
        setScore(evalData.score);
      } else {
        setScore(0);
      }

      // ✅ TEST CASES
      if (
        typeof evalData.passed_tests === "number" &&
        typeof evalData.total_tests === "number"
      ) {
        setHiddenTests(
          `${evalData.passed_tests}/${evalData.total_tests} test cases passed`
        );
      } else {
        setHiddenTests("Test case data not available");
      }

      // ✅ FEEDBACK
      setFeedback(
        evalData.feedback ||
          evalData.retry_suggestion ||
          "Improve logic, handle edge cases, and optimize your solution."
      );
    } catch (err) {
      console.error(err);
      setOutput("Error running code");
    }
  };

  return (
    <div className="flex h-full w-full gap-4 p-4">

      {/* LEFT PANEL */}
      <div className="w-[35%] rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold text-white mb-3">
          Coding Question
        </h2>

        <p className="text-sm text-white/70">
          {question || "Solve the problem"}
        </p>

        {/* Test cases */}
        {hiddenTests && (
          <div className="mt-3 text-xs text-yellow-400">
            {hiddenTests}
          </div>
        )}

        <button
          onClick={onExit}
          className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
        >
          Exit Coding Round
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col gap-3">

        <div className="flex items-center justify-between">

          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value as "javascript" | "python";
              setLanguage(lang);
              setCode(defaultCode[lang]);
            }}
            className="bg-black/40 border border-white/10 rounded-md px-3 py-1 text-sm text-white"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={runCode}
            disabled={!code || code.trim().length < 10}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm disabled:opacity-50"
          >
            <Play size={16} />
            Run Code
          </button>

        </div>

        {/* EDITOR */}
        <div className="h-[400px] rounded-xl overflow-hidden border border-white/10">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

        {/* OUTPUT */}
        <div className="p-3 bg-black/40 border border-white/10 rounded">
          <pre className="text-green-400 text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>

        {/* SCORE PANEL */}
        {score !== null && (
          <div className="p-3 border border-white/20 rounded">
            <h3 className="text-white">
              Score: {score}/100 ⭐
            </h3>

            <p className="text-white/70 text-sm mt-1">
              {feedback}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
