"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArchiveBreadcrumb } from "@/components/chrome/archive-breadcrumb";
import { ArchiveHeader } from "@/components/chrome/archive-header";
import { CareerYearNavigation } from "@/components/chrome/career-year-navigation";
import { UnderlineTabs } from "@/components/chrome/underline-tabs";
import { seasonHref } from "@/lib/grid/seasons";
import {
  CONSTRUCTOR_TABS,
  type ConstructorProfile,
  type ConstructorTabId,
  isConstructorTabId,
} from "@/lib/constructor/types";
import { useConstructorNavigation } from "./use-constructor-navigation";

type ConstructorNavbarProps = {
  profile: ConstructorProfile;
  season: number;
};

export function ConstructorNavbar({ profile, season }: ConstructorNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: ConstructorTabId = isConstructorTabId(tabParam) ? tabParam : "season";
  const { previous, next, hrefFor, navigate } = useConstructorNavigation(
    profile.id,
    profile.careerYears,
    season,
  );

  const onSelectTab = (tab: ConstructorTabId) => {
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
            { href: seasonHref(season), label: "Grid" },
            { label: profile.name, title: profile.fullName },
          ]}
        />
      }
      tabs={
        <UnderlineTabs
          tabs={CONSTRUCTOR_TABS}
          activeId={activeTab}
          onSelect={onSelectTab}
          idPrefix="constructor"
          label="Constructor profile views"
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
          listLabel="Active seasons"
        />
      }
    />
  );
}
