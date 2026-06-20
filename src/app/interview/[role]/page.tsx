import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const roleId = params.role.toLowerCase().trim();

  const roleData = getRole(roleId);

  if (!roleData) {
    notFound();
  }

  return <InterviewRoom role={roleData} />;
}
