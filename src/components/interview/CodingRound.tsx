"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";

const defaultCode: Record<string, string> = {
  javascript: `function solve(nums) {
  // write your code here
}`,
  python: `def solve(nums):
    # write your code here
    pass`,
};

export default function CodingRound() {
  const [language, setLanguage] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState(defaultCode["javascript"]);
  const [output, setOutput] = useState("");

  const runCode = () => {
    // Fake execution (later backend se connect karenge)
    if (code.includes("return")) {
      setOutput("✅ Test Cases Passed");
    } else {
      setOutput("❌ Failed: Return missing");
    }
  };

  return (
    <div className="flex h-full w-full gap-4 p-4">
      
      {/* LEFT SIDE - QUESTION */}
      <div className="w-[35%] rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold text-white mb-3">
          Coding Question
        </h2>

        <p className="text-sm text-white/70 leading-relaxed">
          Given an array of numbers, return the sum of all elements.
        </p>

        <div className="mt-4 text-xs text-white/50">
          Example: [1,2,3] → 6
        </div>
      </div>

      {/* RIGHT SIDE - EDITOR */}
      <div className="flex-1 flex flex-col gap-3">
        
        {/* TOP BAR */}
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
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-md text-sm"
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
        <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white/80">
          {output || "Run code to see output..."}
        </div>
      </div>
    </div>
  );
}
