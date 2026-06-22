"use client";

import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";
import ResumeUpload from "@/components/interview/ResumeUpload";
import { setResumeText } from "@/lib/resumeStore";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role?: string };
}) {
  const [start, setStart] = useState(false);

  const role = params.role;

  console.log("ROLE:", role); // debug

  if (!role) {
    return <div className="text-white">Role missing</div>;
  }

  const roleData = getRole(role.toLowerCase().trim());

  console.log("ROLE DATA:", roleData); // debug

  if (!roleData) {
    return <div className="text-white">Role not found: {role}</div>;
  }

  if (start) {
    return <InterviewRoom role={roleData} />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-white bg-black">
      <h1 className="text-2xl font-semibold">
        {roleData.title} Interview
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
