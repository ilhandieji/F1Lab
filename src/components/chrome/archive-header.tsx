import type { ReactNode } from "react";
import { BrandLink } from "./brand-link";

type ArchiveHeaderProps = {
  breadcrumb: ReactNode;
  tabs: ReactNode;
  yearControl: ReactNode;
};

export function ArchiveHeader({ breadcrumb, tabs, yearControl }: ArchiveHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-2 px-4 py-2 md:grid-cols-[auto_minmax(0,1fr)_auto] md:grid-rows-1 md:gap-5 md:px-6">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
          <BrandLink />
          {breadcrumb}
        </div>
        <div className="col-span-2 col-start-1 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
          {tabs}
        </div>
        <div className="col-start-2 row-start-1 justify-self-end md:col-start-3">{yearControl}</div>
      </div>
    </header>
  );
}
