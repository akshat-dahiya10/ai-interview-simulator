import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const roleData = getRole(params.role);

  if (!roleData) {
    notFound();
  }

  return <ClientPage role={roleData} />;
}
