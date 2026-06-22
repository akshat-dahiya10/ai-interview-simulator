import { notFound } from "next/navigation";
import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({ params }: { params: { role: string } }) {
  console.log("PARAM ROLE:", params.role); // debug

  const roleData = getRole(params.role);

  if (!roleData) {
    console.log("ROLE NOT FOUND");
    notFound();
  }

  return <ClientPage role={roleData} />;
}
