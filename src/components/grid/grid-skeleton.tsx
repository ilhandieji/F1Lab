"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { isGridTabId, type GridTabId } from "@/lib/grid/types";

function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse motion-reduce:animate-none ${className ?? ""}`} />;
}

type GridPanelFrameProps = {
  children: ReactNode;
  "aria-label": string;
};

function GridPanelFrame({ children, "aria-label": ariaLabel }: GridPanelFrameProps) {
  return (
    <section
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-2">
          <Pulse className="h-3 w-24 rounded-full bg-white/10" />
          <Pulse className="h-7 w-40 rounded-lg bg-white/10 md:h-8 md:w-48" />
        </div>
        <Pulse className="hidden h-4 max-w-xs flex-1 rounded-full bg-white/10 md:block" />
      </div>
      {children}
    </section>
  );
}

function ListRowSkeleton({ withProgress = false }: { withProgress?: boolean }) {
  return (
    <div
      className="grid min-h-[5.7rem] grid-cols-[3.5rem_minmax(0,_1fr)_auto] items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] md:min-h-[6.7rem] md:grid-cols-[5.3rem_minmax(0,_1fr)_auto]"
      aria-hidden="true"
    >
      <div className="flex h-full flex-col items-center justify-center gap-1 border-r border-white/10 px-2">
        <Pulse className="h-2 w-6 rounded-full bg-white/10" />
        <Pulse className="h-6 w-8 rounded bg-white/10" />
      </div>
      <div className="min-w-0 space-y-3 px-3 py-3 md:px-5">
        <div className="flex items-center gap-3">
          <Pulse className="h-10 w-10 shrink-0 rounded-lg bg-white/10 md:h-12 md:w-12" />
          <div className="min-w-0 flex-1 space-y-2">
            <Pulse className="h-2 w-16 rounded-full bg-white/10" />
            <Pulse className="h-5 w-32 rounded bg-white/10 md:w-40" />
            <Pulse className="h-3 w-24 rounded-full bg-white/10" />
          </div>
        </div>
        {withProgress ? <Pulse className="h-0.5 w-full rounded-full bg-white/10" /> : null}
      </div>
      <div className="px-3 md:px-5">
        <Pulse className="ml-auto h-6 w-12 rounded bg-white/10" />
      </div>
    </div>
  );
}

function ColumnHeadersSkeleton() {
  return (
    <div
      className="mb-2 grid grid-cols-[3.5rem_minmax(0,_1fr)_auto] px-3 py-3 max-sm:hidden md:grid-cols-[5.3rem_minmax(0,_1fr)_auto] md:px-5"
      aria-hidden="true"
    >
      <Pulse className="h-2 w-8 rounded-full bg-white/10" />
      <Pulse className="h-2 w-14 rounded-full bg-white/10" />
      <Pulse className="ml-auto h-2 w-12 rounded-full bg-white/10" />
    </div>
  );
}

const ROW_COUNT = 12;

export function DriverGridSkeleton() {
  return (
    <GridPanelFrame aria-label="Loading drivers' standings">
      <ColumnHeadersSkeleton />
      <div className="grid gap-2">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <ListRowSkeleton key={index} withProgress />
        ))}
      </div>
    </GridPanelFrame>
  );
}

export function ConstructorStandingsSkeleton() {
  return (
    <GridPanelFrame aria-label="Loading constructors' standings">
      <ColumnHeadersSkeleton />
      <div className="grid gap-2">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <ListRowSkeleton key={index} />
        ))}
      </div>
    </GridPanelFrame>
  );
}

function TimelineItemSkeleton() {
  return (
    <li className="relative min-w-0 list-none" aria-hidden="true">
      <Pulse className="absolute -left-[1.45rem] top-0 h-5 w-5 rounded-full bg-white/10 md:-left-[1.95rem]" />
      <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <Pulse className="h-4 w-40 rounded bg-white/10" />
        <Pulse className="h-3 w-24 rounded-full bg-white/10" />
      </div>
      <div className="grid gap-2 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Pulse
            key={index}
            className="min-h-[4.5rem] rounded-xl border border-white/10 bg-white/[0.04]"
          />
        ))}
      </div>
    </li>
  );
}

export function ActivityViewSkeleton() {
  return (
    <section
      className="mt-6 space-y-9 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      aria-busy="true"
      aria-label="Loading driver changes"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Pulse className="h-3 w-28 rounded-full bg-white/10" />
            <Pulse className="h-7 w-44 rounded-lg bg-white/10" />
          </div>
          <Pulse className="h-4 max-w-md flex-1 rounded-full bg-white/10" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Pulse
              key={index}
              className="h-24 rounded-xl border border-white/10 bg-white/[0.04]"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Pulse className="h-3 w-32 rounded-full bg-white/10" />
          <Pulse className="h-7 w-52 rounded-lg bg-white/10" />
        </div>
        <ol
          className="ml-2 grid gap-5 border-l border-white/15 py-1 pl-4 md:ml-4 md:pl-6"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <TimelineItemSkeleton key={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function skeletonForTab(tab: GridTabId) {
  switch (tab) {
    case "activity":
      return <ActivityViewSkeleton />;
    case "constructors":
      return <ConstructorStandingsSkeleton />;
    default:
      return <DriverGridSkeleton />;
  }
}

function GridContentSkeletonInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = isGridTabId(tabParam) ? tabParam : "drivers";

  return skeletonForTab(tab);
}

export function GridContentSkeleton() {
  return (
    <Suspense fallback={<DriverGridSkeleton />}>
      <GridContentSkeletonInner />
    </Suspense>
  );
}

/** @deprecated Use GridContentSkeleton — kept for existing imports */
export function GridSkeleton() {
  return <GridContentSkeleton />;
}
