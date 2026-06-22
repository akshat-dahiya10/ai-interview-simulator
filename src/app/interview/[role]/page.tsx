import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role;

  if (!role) {
    notFound();
  }

  const roleData = getRole(role.toLowerCase().trim());

  if (!roleData) {
    notFound();
  }

  return <InterviewRoom role={roleData} />;
}
