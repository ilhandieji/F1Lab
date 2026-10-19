"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { seasonHref } from "@/lib/grid/seasons";
import {
  CONSTRUCTOR_TABS,
  type ConstructorProfile,
  type ConstructorTabId,
  isConstructorTabId,
} from "@/lib/constructor/types";
import { ConstructorYearNavigation } from "./constructor-year-navigation";
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
          <nav className="flex min-w-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
            <Link href={seasonHref(season)} className="shrink-0 transition hover:text-white">
              Grid
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-white/80" title={profile.fullName}>
              {profile.name}
            </span>
          </nav>
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Constructor profile views"
        >
          {CONSTRUCTOR_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`constructor-${tab.id}-tab`}
              aria-selected={activeTab === tab.id}
              aria-controls={`constructor-${tab.id}-panel`}
              className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition ${
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

        <ConstructorYearNavigation
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
