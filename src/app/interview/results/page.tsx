import { notFound } from "next/navigation";
import { getResult, getRole, isValidRole } from "@/lib/data";
import ResultsDashboard from "@/components/results/ResultsDashboard";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!isValidRole(role)) notFound();
  return <ResultsDashboard role={getRole(role)!} result={getResult(role)} />;
}
