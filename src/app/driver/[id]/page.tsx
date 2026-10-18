import { notFound } from "next/navigation";
import { DriverSeasonContent } from "@/components/driver/driver-season-content";
import { getDriverProfile } from "@/lib/driver/driver-profile";
import { getDriverSeasonView } from "@/lib/driver/driver-season";
import { parseDriverSeasonParam, resolveDriverSeason } from "@/lib/driver/routes";
import { isDriverTabId } from "@/lib/driver/types";

type DriverPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string | string[]; tab?: string | string[] }>;
};

export async function generateMetadata({ params }: DriverPageProps) {
  const { id } = await params;
  const profile = await getDriverProfile(id);
  if (!profile) return { title: "Driver not found" };
  return {
    title: profile.fullName,
    description: `Career archive for ${profile.fullName}: championships, seasons, and race results from the F1DB dataset.`,
  };
}

export default function DriverPage({ params, searchParams }: DriverPageProps) {
  return <DriverPageContent params={params} searchParams={searchParams} />;
}

async function DriverPageContent({ params, searchParams }: DriverPageProps) {
  const { id } = await params;
  const profile = await getDriverProfile(id);
  if (!profile) notFound();

  const resolvedSearchParams = await searchParams;
  const season = resolveDriverSeason(
    profile,
    parseDriverSeasonParam(resolvedSearchParams.season),
  );
  const tabValue = resolvedSearchParams.tab;
  const tabRaw = Array.isArray(tabValue) ? tabValue[0] : tabValue;
  const activeTab = typeof tabRaw === "string" && isDriverTabId(tabRaw) ? tabRaw : "season";

  const view = await getDriverSeasonView(id, season);

  return <DriverSeasonContent view={view} activeTab={activeTab} />;
}
