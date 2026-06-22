import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role;

  if (!role) {
    console.log("Role missing:", role);
    notFound();
  }

  const roleData = getRole(role.toLowerCase().trim());

  if (!roleData) {
    console.log("Role not found:", role);
    notFound();
  }

  return <ClientPage role={roleData} />;
}
