import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({ params }: { params: { role: string } }) {
  const cleanRole = decodeURIComponent(params.role).toLowerCase().trim();

  console.log("ROLE:", cleanRole);

  const roleData = getRole(cleanRole);

  if (!roleData) {
    return <div style={{ color: "white" }}>Role not found: {cleanRole}</div>;
  }

  return <ClientPage role={roleData} />;
}
