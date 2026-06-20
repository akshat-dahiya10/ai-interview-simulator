import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const { role } = params;

  const roleData = getRole(role);

  if (!roleData) {
    notFound();
  }

  return <InterviewRoom role={roleData} />;
}
