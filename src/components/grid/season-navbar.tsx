"use client";

import Link from "next/link";
import { useRef, type KeyboardEvent } from "react";
import { GRID_TABS, type GridTabId } from "@/lib/grid/types";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % GRID_TABS.length
        : event.key === "ArrowLeft"
          ? (index - 1 + GRID_TABS.length) % GRID_TABS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? GRID_TABS.length - 1
              : null;

    if (nextIndex === null) return;

    event.preventDefault();
    event.stopPropagation();
    onSelectTab(GRID_TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <header className="grid grid-cols-[minmax(0,_1fr)_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-2 py-2 md:grid-cols-[auto_minmax(0,_1fr)_auto] md:grid-rows-1 md:gap-5">
      <Link
        href="/"
        className="col-start-1 row-start-1 text-[11px] font-black uppercase tracking-[0.34em] text-white transition hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 md:col-start-1 md:row-start-1"
        aria-label="F1Lab home"
      >
        F1<span className="text-red-500">Lab</span>
      </Link>

      <div
        className="col-span-2 col-start-1 row-start-2 flex min-w-0 gap-2 overflow-x-auto md:col-span-1 md:col-start-2 md:row-start-1"
        role="tablist"
        aria-label={`${year} season views`}
      >
        {GRID_TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`grid-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`grid-${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={`relative shrink-0 pb-2 pt-2 text-[10px] font-black uppercase tracking-[0.18em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${isActive ? "text-white" : "text-white/50 hover:text-white"}`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-red-500 transition-transform duration-200" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1">
        <YearNavigation year={year} previous={previous} next={next} hrefFor={hrefFor} navigate={navigate} />
      </div>
    </header>
  );
}
