"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { parseDriverSeasonParam, resolveDriverSeason } from "@/lib/driver/routes";
import type { DriverProfile } from "@/lib/driver/types";
import { isDriverTabId, type DriverTabId } from "@/lib/driver/types";
import { DriverProfileShell } from "./driver-profile-shell";

type DriverProfileLayoutProps = {
  profile: DriverProfile;
  children: ReactNode;
};

function DriverProfileLayoutConnected({ profile, children }: DriverProfileLayoutProps) {
  const searchParams = useSearchParams();
  const season = resolveDriverSeason(
    profile,
    parseDriverSeasonParam(searchParams.get("season") ?? undefined),
  );
  const tabParam = searchParams.get("tab");
  const activeTab: DriverTabId = isDriverTabId(tabParam) ? tabParam : "season";

  return (
    <DriverProfileShell profile={profile} season={season} activeTab={activeTab}>
      {children}
    </DriverProfileShell>
  );
}

export function DriverProfileLayout({ profile, children }: DriverProfileLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07080c]" aria-busy="true" />}>
      <DriverProfileLayoutConnected profile={profile}>{children}</DriverProfileLayoutConnected>
    </Suspense>
  );
}
