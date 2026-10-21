import type { Metadata } from "next";
import { Suspense } from "react";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { GridExplorer } from "@/components/grid/grid-explorer";
import { GridContentSkeleton } from "@/components/grid/grid-skeleton";
import { routing } from "@/i18n/routing";
import { getSeasonGrid } from "@/lib/grid/season-grid";
import { parseSeasonYear } from "@/lib/grid/seasons";
import { isGridTabId } from "@/lib/grid/types";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/grid/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: resolved, namespace: "Metadata" });
  const year = parseSeasonYear(slug);
  if (!year) {
    return {
      title: t("seasonNotFound"),
      description: t("seasonNotFoundDescription"),
    };
  }

  return {
    title: t("seasonTitle", { year }),
    description: t("seasonDescription", { year }),
  };
}

export default function SeasonPage(props: PageProps<"/[locale]/grid/[slug]">) {
  return (
    <Suspense fallback={<GridContentSkeleton />}>
      <SeasonPageContent {...props} />
    </Suspense>
  );
}

async function SeasonPageContent({
  params,
  searchParams,
}: PageProps<"/[locale]/grid/[slug]">) {
  const year = parseSeasonYear((await params).slug);
  if (!year) notFound();

  const tabValue = (await searchParams).tab;
  const tab = Array.isArray(tabValue) ? tabValue[0] : tabValue;
  const activeTab = typeof tab === "string" && isGridTabId(tab) ? tab : "drivers";
  const data = await getSeasonGrid(year);

  return <GridExplorer data={data} activeTab={activeTab} />;
}
