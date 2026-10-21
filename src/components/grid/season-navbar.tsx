"use client";

import { useTranslations } from "next-intl";
import { GRID_TABS, type GridTabId } from "@/lib/grid/types";
import { ArchiveBreadcrumb } from "@/components/chrome/archive-breadcrumb";
import { ArchiveHeader } from "@/components/chrome/archive-header";
import { UnderlineTabs } from "@/components/chrome/underline-tabs";
import { YearNavigation } from "./year-navigation";

type SeasonNavbarProps = {
  year: number;
  previous: number | null;
  next: number | null;
  hrefFor: (year: number) => string;
  navigate: (year: number) => void;
  activeTab: GridTabId;
  onSelectTab: (tab: GridTabId) => void;
};

export function SeasonNavbar({
  year,
  previous,
  next,
  hrefFor,
  navigate,
  activeTab,
  onSelectTab,
}: SeasonNavbarProps) {
  const t = useTranslations("Grid");
  const tabs = GRID_TABS.map((tab) => ({ id: tab.id, label: t(`tabs.${tab.id}`) }));

  return (
    <ArchiveHeader
      breadcrumb={<ArchiveBreadcrumb items={[{ label: t("breadcrumb") }]} />}
      tabs={
        <UnderlineTabs
          tabs={tabs}
          activeId={activeTab}
          onSelect={onSelectTab}
          idPrefix="grid"
          label={t("views", { year })}
        />
      }
      yearControl={
        <YearNavigation
          year={year}
          previous={previous}
          next={next}
          hrefFor={hrefFor}
          navigate={navigate}
        />
      }
    />
  );
}
