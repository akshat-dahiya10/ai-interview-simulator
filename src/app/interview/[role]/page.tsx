import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientInterviewPage from "./ClientInterviewPage";

export default function Page({
  params,
}: {
  params: { role?: string };
}) {
  const role = params.role;

  if (!role) {
    notFound();
  }

  const roleData = getRole(role.toLowerCase().trim());

  if (!roleData) {
    notFound();
  }

  return <ClientInterviewPage role={roleData} />;
}
