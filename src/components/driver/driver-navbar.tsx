"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ArchiveBreadcrumb } from "@/components/chrome/archive-breadcrumb";
import { ArchiveHeader } from "@/components/chrome/archive-header";
import { CareerYearNavigation } from "@/components/chrome/career-year-navigation";
import { UnderlineTabs } from "@/components/chrome/underline-tabs";
import { seasonHref } from "@/lib/grid/seasons";
import { DRIVER_TABS, type DriverTabId, isDriverTabId } from "@/lib/driver/types";
import type { DriverProfile } from "@/lib/driver/types";
import { useDriverNavigation } from "./use-driver-navigation";

type DriverNavbarProps = {
  profile: DriverProfile;
  season: number;
};

export function DriverNavbar({ profile, season }: DriverNavbarProps) {
  const t = useTranslations("Common");
  const driverText = useTranslations("Driver");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: DriverTabId = isDriverTabId(tabParam) ? tabParam : "season";
  const { previous, next, hrefFor, navigate } = useDriverNavigation(
    profile.id,
    profile.careerYears,
    season,
  );

  const onSelectTab = (tab: DriverTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "season") params.delete("tab");
    else params.set("tab", tab);
    if (!params.has("season")) params.set("season", String(season));
    const query = params.toString();
    router.replace(`${pathname}?${query}`, { scroll: false });
  };

  return (
    <ArchiveHeader
      breadcrumb={
        <ArchiveBreadcrumb
          items={[
            { href: seasonHref(season), label: t("grid") },
            { label: profile.abbreviation, title: profile.fullName },
          ]}
        />
      }
      tabs={
        <UnderlineTabs
          tabs={DRIVER_TABS.map((tab) => ({
            id: tab.id,
            label: tab.id === "season" ? t("season") : t("results"),
          }))}
          activeId={activeTab}
          onSelect={onSelectTab}
          idPrefix="driver"
          label={driverText("views")}
        />
      }
      yearControl={
        <CareerYearNavigation
          season={season}
          careerYears={profile.careerYears}
          previous={previous}
          next={next}
          hrefFor={hrefFor}
          navigate={navigate}
          listLabel={t("careerSeasons")}
        />
      }
    />
  );
}
