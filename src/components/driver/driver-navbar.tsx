"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { seasonHref } from "@/lib/grid/seasons";
import { DRIVER_TABS, type DriverTabId, isDriverTabId } from "@/lib/driver/types";
import type { DriverProfile } from "@/lib/driver/types";
import { DriverYearNavigation } from "./driver-year-navigation";
import { useDriverNavigation } from "./use-driver-navigation";

type DriverNavbarProps = {
  profile: DriverProfile;
  season: number;
};

export function DriverNavbar({ profile, season }: DriverNavbarProps) {
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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#07080c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="shrink-0 text-[11px] font-black uppercase tracking-[0.34em] text-white"
            aria-label="F1Lab home"
          >
            F1<span className="text-red-500">Lab</span>
          </Link>
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
            <Link href={seasonHref(season)} className="transition hover:text-white">
              Grid
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-white/80" title={profile.fullName}>
              {profile.abbreviation}
            </span>
          </nav>
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Driver profile views"
        >
          {DRIVER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`driver-${tab.id}-tab`}
              aria-selected={activeTab === tab.id}
              aria-controls={`driver-${tab.id}-panel`}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                activeTab === tab.id
                  ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/40"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DriverYearNavigation
          season={season}
          careerYears={profile.careerYears}
          previous={previous}
          next={next}
          hrefFor={hrefFor}
          navigate={navigate}
        />
      </div>
    </header>
  );
}
