import { getRole } from "@/lib/data";
import ClientPage from "./ClientPage";

export default function Page({ params }: { params: { role: string } }) {
  console.log("SERVER PARAMS:", params);

  if (!params?.role) {
    return <div>Role missing</div>;
  }

  const cleanRole = params.role.toLowerCase().trim();
  const roleData = getRole(cleanRole);

  if (!roleData) {
    return <div>Role not found: {cleanRole}</div>;
  }

  return <ClientPage role={roleData} />;
}
