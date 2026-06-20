import { notFound } from "next/navigation";
import { getRole, isValidRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  console.log("ROLE:", params.role); // ✅ yahan daal

  const { role } = params;

  return <div>ROLE WORKING: {role}</div>;

  const roleData = getRole(role);

  if (!roleData) return notFound();

  return <InterviewRoom role={roleData} />;
}
