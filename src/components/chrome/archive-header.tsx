import type { ReactNode } from "react";
import { ArchiveSearchNav } from "@/components/landing/archive-search-nav";
import { archiveHeaderInnerClass } from "@/lib/layout";
import { BrandLink } from "./brand-link";

type ArchiveHeaderProps = {
  breadcrumb?: ReactNode;
  tabs?: ReactNode;
  yearControl?: ReactNode;
  showSearch?: boolean;
};

export function ArchiveHeader({
  breadcrumb,
  tabs,
  yearControl,
  showSearch = true,
}: ArchiveHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-md">
      <div className={`${archiveHeaderInnerClass} flex flex-col gap-2`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <BrandLink />
            {breadcrumb}
          </div>
          {yearControl ? <div className="shrink-0">{yearControl}</div> : null}
        </div>
        {showSearch ? (
          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(12rem,22rem)_minmax(0,1fr)] md:items-center">
            <div className="hidden md:block" aria-hidden="true" />
            <ArchiveSearchNav />
            <div className="hidden md:block" aria-hidden="true" />
          </div>
        ) : null}
        {tabs ? <div className="min-w-0 overflow-x-auto pb-0.5">{tabs}</div> : null}
      </div>
    </header>
  );
}
