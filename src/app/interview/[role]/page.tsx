import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role?.toLowerCase().trim();

  console.log("ROLE:", role);

  if (!role) return notFound();

  const roleData = getRole(role);

  if (!roleData) {
    console.log("NOT FOUND ROLE:", role);
    return notFound();
  }

  return <ClientPage role={roleData} />;
}
