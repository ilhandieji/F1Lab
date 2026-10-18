"use client";

import dynamic from "next/dynamic";

function SearchMountPlaceholder() {
  return (
    <div
      className="mt-8 h-[3.25rem] max-w-xl rounded-2xl border border-white/15 bg-white/5"
      aria-hidden="true"
    />
  );
}

export const DriverSearchLazy = dynamic(
  () => import("@/components/driver/driver-search").then((mod) => mod.DriverSearch),
  { ssr: false, loading: SearchMountPlaceholder },
);
