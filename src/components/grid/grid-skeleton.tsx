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

function ListRowSkeleton() {
  return (
    <div
      className="grid min-h-12 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-white/[0.04] md:grid-cols-[2.75rem_minmax(0,1fr)_auto]"
      aria-hidden="true"
    >
      <Pulse className="mx-auto h-4 w-5 rounded bg-white/10" />
      <div className="flex min-w-0 items-center gap-2 px-2 py-2">
        <Pulse className="h-7 w-9 shrink-0 rounded-md bg-white/10" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Pulse className="h-4 w-28 rounded bg-white/10" />
          <Pulse className="h-3 w-20 rounded-full bg-white/10" />
        </div>
      </div>
      <Pulse className="me-3 h-5 w-10 rounded bg-white/10" />
    </div>
  );
}

function ColumnHeadersSkeleton() {
  return (
    <div
      className="mb-2 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] px-2 py-2 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:px-3"
      aria-hidden="true"
    >
      <Pulse className="h-3 w-6 rounded-full bg-white/10" />
      <Pulse className="h-3 w-14 rounded-full bg-white/10" />
      <Pulse className="ms-auto h-3 w-12 rounded-full bg-white/10" />
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
          <ListRowSkeleton key={index} />
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
      <Pulse className="absolute -start-[1.45rem] top-0 h-5 w-5 rounded-full bg-white/10 md:-start-[1.95rem]" />
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
          className="ms-2 grid gap-5 border-s border-white/15 py-1 ps-4 md:ms-4 md:ps-6"
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
