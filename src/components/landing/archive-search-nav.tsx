"use client";

import { Suspense } from "react";
import { ArchiveSearchField } from "./archive-search";

function SearchNavSkeleton() {
  return (
    <div
      className="h-8 w-full rounded-xl border border-white/15 bg-white/5"
      aria-hidden="true"
    />
  );
}

export function ArchiveSearchNav() {
  return (
    <Suspense fallback={<SearchNavSkeleton />}>
      <ArchiveSearchField variant="nav" inputId="archive-search-nav" />
    </Suspense>
  );
}
