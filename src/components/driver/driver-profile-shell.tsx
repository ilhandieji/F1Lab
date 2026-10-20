"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { DriverProfileFocusBar } from "@/components/chrome/profile-focus-bar";
import type { DriverProfile, DriverTabId } from "@/lib/driver/types";
import { archiveMainClass } from "@/lib/layout";
import { DriverCareerStats } from "./driver-career-stats";
import { DriverFamily } from "./driver-family";
import { DriverHero } from "./driver-hero";
import { DriverNavbar } from "./driver-navbar";
import { useDriverNavigation } from "./use-driver-navigation";

type DriverProfileShellProps = {
  profile: DriverProfile;
  season: number;
  activeTab: DriverTabId;
  children: ReactNode;
};

function DriverProfileShellBody({ profile, season, activeTab, children }: DriverProfileShellProps) {
  const resultsOnly = activeTab === "races";
  const { previous, next, navigate } = useDriverNavigation(profile.id, profile.careerYears, season);
  const [announcement, setAnnouncement] = useState("");
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (targetSeason: number) => {
      setAnnouncement(`Season ${targetSeason}`);
      navigate(targetSeason);
    },
    [navigate],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('[role="tablist"], [role="dialog"], input, textarea')) return;
      if (event.key === "ArrowLeft" && previous) {
        event.preventDefault();
        goTo(previous);
      }
      if (event.key === "ArrowRight" && next) {
        event.preventDefault();
        goTo(next);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, previous]);

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    setTouchStart(null);
    if (Math.abs(deltaX) < 72 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    const targetSeason = deltaX < 0 ? next : previous;
    if (targetSeason) goTo(targetSeason);
  };

  return (
    <div
      className="relative min-h-screen bg-[#07080c] text-white"
      onTouchStart={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a, button, [role=tablist], input, textarea")) return;
        const touch = event.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      }}
      onTouchEnd={onTouchEnd}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,68,68,0.12),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(220,38,38,0.08),transparent_24%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <Suspense fallback={<div className="h-44 md:h-32" aria-hidden="true" />}>
        <DriverNavbar profile={profile} season={season} />
      </Suspense>

      <div className="sr-only" aria-live="polite">{announcement}</div>

      <div aria-hidden="true" className="h-44 md:h-32" />

      <main id="driver-main-content" className={archiveMainClass}>
        {resultsOnly ? (
          <DriverProfileFocusBar profile={profile} season={season} />
        ) : (
          <>
            <DriverHero profile={profile} season={season} />
            <DriverCareerStats totals={profile.careerTotals} />
            <DriverFamily family={profile.family} season={season} />
          </>
        )}
        <div className={resultsOnly ? "" : "mt-8"}>{children}</div>
      </main>
    </div>
  );
}

export function DriverProfileShell({
  profile,
  season,
  activeTab,
  children,
}: DriverProfileShellProps) {
  return (
    <DriverProfileShellBody profile={profile} season={season} activeTab={activeTab}>
      {children}
    </DriverProfileShellBody>
  );
}
