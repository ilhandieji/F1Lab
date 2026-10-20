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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-md">
      <div className={archiveHeaderInnerClass}>
        {/* Mobile: brand row, search, optional tabs */}
        <div className="flex flex-col gap-1.5 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <BrandLink />
              {breadcrumb}
            </div>
            {yearControl ? <div className="shrink-0">{yearControl}</div> : null}
          </div>
          {showSearch ? <ArchiveSearchNav /> : null}
          {tabs ? <div className="min-w-0 overflow-x-auto pb-0.5">{tabs}</div> : null}
        </div>

        {/* Desktop: single row */}
        <div className="hidden min-h-11 items-center gap-3 md:flex">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <BrandLink />
            {breadcrumb}
          </div>
          {tabs ? (
            <div className="min-w-0 flex-1 overflow-x-auto">{tabs}</div>
          ) : showSearch ? (
            <div className="min-w-0 flex-1" aria-hidden="true" />
          ) : null}
          {showSearch ? (
            <div className="w-[min(20rem,22vw)] shrink-0">
              <ArchiveSearchNav />
            </div>
          ) : null}
          {yearControl ? <div className="shrink-0">{yearControl}</div> : null}
        </div>
      </div>
    </header>
  );
}
