"use client";

import { useState } from "react";
import InterviewRoom from "@/components/interview/InterviewRoom";
import ResumeUpload from "@/components/interview/ResumeUpload";
import { setResumeText } from "@/lib/resumeStore";
import type { Role } from "@/lib/types";

export default function ClientPage({ role }: { role: Role }) {
  const [start, setStart] = useState(false);

  if (start) {
    return <InterviewRoom role={role} />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-white bg-black">
      <h1 className="text-2xl font-semibold">
        {role.title} Interview
      </h1>

      <ResumeUpload
        onUpload={(text: string) => {
          setResumeText(text);
        }}
      />

      <button
        onClick={() => setStart(true)}
        className="px-6 py-3 bg-white text-black rounded-xl"
      >
        Start Interview
      </button>
    </div>
  );
}
