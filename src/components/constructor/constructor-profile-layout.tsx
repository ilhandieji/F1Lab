"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { parseConstructorSeasonParam, resolveConstructorSeason } from "@/lib/constructor/routes";
import type { ConstructorProfile } from "@/lib/constructor/types";
import { isConstructorTabId, type ConstructorTabId } from "@/lib/constructor/types";
import { ConstructorProfileShell } from "./constructor-profile-shell";
import type { ConstructorSeasonMark } from "./constructor-season-rail";

type ConstructorProfileLayoutProps = {
  profile: ConstructorProfile;
  seasonMarks: ConstructorSeasonMark[];
  children: ReactNode;
};

function ConstructorProfileLayoutConnected({
  profile,
  seasonMarks,
  children,
}: ConstructorProfileLayoutProps) {
  const searchParams = useSearchParams();
  const season = resolveConstructorSeason(
    profile,
    parseConstructorSeasonParam(searchParams.get("season") ?? undefined),
  );
  const tabParam = searchParams.get("tab");
  const activeTab: ConstructorTabId = isConstructorTabId(tabParam) ? tabParam : "season";

  return (
    <ConstructorProfileShell
      profile={profile}
      season={season}
      seasonMarks={seasonMarks}
      activeTab={activeTab}
    >
      {children}
    </ConstructorProfileShell>
  );
}

export function ConstructorProfileLayout({
  profile,
  seasonMarks,
  children,
}: ConstructorProfileLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07080c]" aria-busy="true" />}>
      <ConstructorProfileLayoutConnected profile={profile} seasonMarks={seasonMarks}>
        {children}
      </ConstructorProfileLayoutConnected>
    </Suspense>
  );
}
