"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { useTranslations } from "next-intl";
import { ConstructorProfileFocusBar } from "@/components/chrome/profile-focus-bar";
import type { ConstructorProfile, ConstructorTabId } from "@/lib/constructor/types";
import { archiveMainClass } from "@/lib/layout";
import { ConstructorCareerStats } from "./constructor-career-stats";
import { ConstructorChronology } from "./constructor-chronology";
import { ConstructorHero } from "./constructor-hero";
import { ConstructorNavbar } from "./constructor-navbar";
import { ConstructorSeasonRail, type ConstructorSeasonMark } from "./constructor-season-rail";
import { useConstructorNavigation } from "./use-constructor-navigation";

type ConstructorProfileShellProps = {
  profile: ConstructorProfile;
  season: number;
  seasonMarks: ConstructorSeasonMark[];
  activeTab: ConstructorTabId;
  children: ReactNode;
};

function ConstructorProfileShellBody({
  profile,
  season,
  seasonMarks,
  activeTab,
  children,
}: ConstructorProfileShellProps) {
  const common = useTranslations("Common");
  const resultsOnly = activeTab === "races";
  const { previous, next, hrefFor, navigate } = useConstructorNavigation(
    profile.id,
    profile.careerYears,
    season,
  );
  const [announcement, setAnnouncement] = useState("");
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (targetSeason: number) => {
      setAnnouncement(common("seasonAnnouncement", { year: targetSeason }));
      navigate(targetSeason);
    },
    [common, navigate],
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

      <Suspense fallback={null}>
        <ConstructorNavbar profile={profile} season={season} />
      </Suspense>

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      <main id="constructor-main-content" className={archiveMainClass}>
        {resultsOnly ? (
          <ConstructorProfileFocusBar profile={profile} season={season} />
        ) : (
          <>
            <ConstructorHero profile={profile} season={season} />
            <ConstructorSeasonRail
              season={season}
              marks={seasonMarks}
              hrefFor={hrefFor}
              navigate={navigate}
            />
            <ConstructorCareerStats totals={profile.careerTotals} />
            <ConstructorChronology links={profile.chronology} />
          </>
        )}
        <div className={resultsOnly ? "" : "mt-8"}>{children}</div>
      </main>
    </div>
  );
}

export function ConstructorProfileShell(props: ConstructorProfileShellProps) {
  return <ConstructorProfileShellBody {...props} />;
}
