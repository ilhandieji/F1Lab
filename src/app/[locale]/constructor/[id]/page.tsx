import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ConstructorSeasonContent } from "@/components/constructor/constructor-season-content";
import { routing } from "@/i18n/routing";
import { getConstructorProfile } from "@/lib/constructor/constructor-profile";
import { getConstructorSeasonView } from "@/lib/constructor/constructor-season";
import {
  parseConstructorSeasonParam,
  resolveConstructorSeason,
} from "@/lib/constructor/routes";
import { isConstructorTabId } from "@/lib/constructor/types";

type ConstructorPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ season?: string | string[]; tab?: string | string[] }>;
};

export async function generateMetadata({ params }: ConstructorPageProps) {
  const { locale, id } = await params;
  const resolved = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: resolved, namespace: "Metadata" });
  const profile = await getConstructorProfile(id);
  if (!profile) return { title: t("constructorNotFound") };
  return {
    title: profile.fullName,
    description: t("constructorDescription", { name: profile.fullName }),
  };
}

export default function ConstructorPage({ params, searchParams }: ConstructorPageProps) {
  return <ConstructorPageContent params={params} searchParams={searchParams} />;
}

async function ConstructorPageContent({ params, searchParams }: ConstructorPageProps) {
  const { id } = await params;
  const profile = await getConstructorProfile(id);
  if (!profile) notFound();

  const resolvedSearchParams = await searchParams;
  const season = resolveConstructorSeason(
    profile,
    parseConstructorSeasonParam(resolvedSearchParams.season),
  );
  const tabValue = resolvedSearchParams.tab;
  const tabRaw = Array.isArray(tabValue) ? tabValue[0] : tabValue;
  const activeTab = typeof tabRaw === "string" && isConstructorTabId(tabRaw) ? tabRaw : "season";

  const view = await getConstructorSeasonView(id, season, profile.name);

  return <ConstructorSeasonContent view={view} activeTab={activeTab} />;
}
