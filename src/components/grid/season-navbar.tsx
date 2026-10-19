"use client";

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
  return (
    <ArchiveHeader
      breadcrumb={<ArchiveBreadcrumb items={[{ label: "Season" }]} />}
      tabs={
        <UnderlineTabs
          tabs={GRID_TABS}
          activeId={activeTab}
          onSelect={onSelectTab}
          idPrefix="grid"
          label={`${year} season views`}
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
