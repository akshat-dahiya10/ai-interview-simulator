import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role?.toLowerCase().trim();

  console.log("ROLE:", role); // debug

  if (!role) {
    notFound();
  }

  const roleData = getRole(role);

  if (!roleData) {
    console.log("Role not found in data:", role);
    notFound();
  }

  return <InterviewRoom role={roleData} />;
}
