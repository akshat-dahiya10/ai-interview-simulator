import { notFound } from "next/navigation";
import { getRole, isValidRole } from "@/lib/data";
import InterviewRoom from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default function InterviewPage({
  params,
}: {
  params: { role: string };
}) {
  const { role } = params;

  if (!isValidRole(role)) notFound();

  return <InterviewRoom role={getRole(role)!} />;
}