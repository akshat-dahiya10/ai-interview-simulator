import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";
import InterviewRoom from "@/components/interview/InterviewRoom";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role;

  const cleanRole = decodeURIComponent(role).toLowerCase().trim();

  console.log("ROLE:", cleanRole);

  const roleData = getRole(cleanRole);

  if (!roleData) {
    return <div style={{ color: "white" }}>Role not found: {cleanRole}</div>;
  }

  return <InterviewRoom role={roleData} />;
}
