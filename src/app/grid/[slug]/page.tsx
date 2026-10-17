import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GridExplorer } from "@/components/grid/grid-explorer";
import { GridSkeleton } from "@/components/grid/grid-skeleton";
import { getSeasonGrid } from "@/lib/grid/season-grid";
import { parseSeasonYear } from "@/lib/grid/seasons";
import { isGridTabId } from "@/lib/grid/types";

export async function generateMetadata({
  params,
}: PageProps<"/grid/[slug]">): Promise<Metadata> {
  const year = parseSeasonYear((await params).slug);
  if (!year) {
    return {
      title: "Season not found",
      description: "This Formula 1 season is not in the supported archive range.",
    };
  }

  return {
    title: `${year} season archive`,
    description: `Read the ${year} opening grid, constructor standings, and driver movement across the championship season.`,
  };
}

export default function SeasonPage(props: PageProps<"/grid/[slug]">) {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <SeasonPageContent {...props} />
    </Suspense>
  );
}

async function SeasonPageContent({
  params,
  searchParams,
}: PageProps<"/grid/[slug]">) {
  const year = parseSeasonYear((await params).slug);
  if (!year) notFound();

  const tabValue = (await searchParams).tab;
  const tab = Array.isArray(tabValue) ? tabValue[0] : tabValue;
  const activeTab = typeof tab === "string" && isGridTabId(tab) ? tab : "drivers";
  const data = await getSeasonGrid(year);

  return <GridExplorer data={data} activeTab={activeTab} />;
}
