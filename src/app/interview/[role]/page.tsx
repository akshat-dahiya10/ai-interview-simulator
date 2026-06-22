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

  if (!role) {
    notFound();
  }

  const roleData = getRole(role.toLowerCase().trim());

  if (!roleData) {
    notFound();
  }

  // 👉 INTERVIEW START HONE KE BAAD
  if (start) {
    return <InterviewRoom role={roleData} />;
  }

  // 👉 START SCREEN UI
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 text-white bg-black">
      <h1 className="text-2xl font-semibold">
        {roleData.title} Interview
      </h1>

      {/* ✅ Resume Upload */}
      <ResumeUpload
        onUpload={(text: string) => {
          setResumeText(text);
        }}
      />

      {/* ✅ Start Button */}
      <button
        onClick={() => setStart(true)}
        className="px-6 py-3 bg-white text-black rounded-xl"
      >
        Start Interview
      </button>
    </div>
  );
}
