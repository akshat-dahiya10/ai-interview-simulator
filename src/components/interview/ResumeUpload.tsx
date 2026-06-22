"use client";

import { useState } from "react";

export default function ResumeUpload({ onUpload }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ai-interview-simulator-production-10.up.railway.app";

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/upload-resume`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    onUpload(data.resume_text);

    setLoading(false);
  };

  return (
    <div className="p-6 border border-white/10 rounded-xl bg-white/5">
      <h2 className="mb-3">Upload Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="mt-3 px-4 py-2 bg-white text-black rounded-lg"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
