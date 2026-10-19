"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adjacentSeasons, seasonHref } from "@/lib/grid/seasons";
import { isGridTabId, type GridTabId } from "@/lib/grid/types";
import { SeasonNavbar } from "./season-navbar";
import { useSeasonNavigation } from "./use-season-navigation";

type GridShellProps = {
  year: number;
  children: ReactNode;
};

type GridShellBodyProps = GridShellProps & {
  activeTab: GridTabId;
  onSelectTab: (tab: GridTabId) => void;
  previous: number | null;
  next: number | null;
  hrefFor: (year: number) => string;
  navigate: (year: number) => void;
};

function GridShellBody({
  year,
  children,
  activeTab,
  onSelectTab,
  previous,
  next,
  hrefFor,
  navigate,
}: GridShellBodyProps) {
  const [announcement, setAnnouncement] = useState("");
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (targetYear: number) => {
      setAnnouncement(`Season ${targetYear}`);
      navigate(targetYear);
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
    const targetYear = deltaX < 0 ? next : previous;
    if (targetYear) goTo(targetYear);
  };

  return (
    <main
      className="relative isolate min-h-screen overflow-x-clip bg-[#07080c] text-white selection:bg-red-500/40"
      onTouchStart={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest(
            'a, button, input, textarea, [role="tablist"], [role="dialog"]',
          )
        ) {
          setTouchStart(null);
          return;
        }
        const touch = event.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      }}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="absolute inset-[-8%] -z-30 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.18),transparent_18%),radial-gradient(circle_at_80%_0%,rgba(220,38,38,0.22),transparent_24%),linear-gradient(135deg,#07080c_0%,#0d1116_53%,#090a0e_100%)] bg-cover bg-center"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden="true"
      />

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <SeasonNavbar
        year={year}
        previous={previous}
        next={next}
        hrefFor={hrefFor}
        navigate={goTo}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
      />

      <div aria-hidden="true" className="h-36 md:h-20" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 md:px-6">
        <header className="mt-6 md:mt-8">
          <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            Season archive
          </div>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-[-0.08em] text-white md:text-6xl">
            {year} <span className="text-red-500">season</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            Drivers&apos; standings, driver changes, and constructors&apos; standings for the full
            championship year. Use the season controls to move between years. On a touch screen, a
            horizontal swipe does the same.
          </p>
        </header>

        <div id="grid-main-content">{children}</div>
      </div>
    </main>
  );
}

function GridShellStatic({ year, children }: GridShellProps) {
  const { previous, next } = adjacentSeasons(year);
  const hrefFor = (targetYear: number) => seasonHref(targetYear);

  return (
    <GridShellBody
      year={year}
      previous={previous}
      next={next}
      hrefFor={hrefFor}
      navigate={() => {}}
      activeTab="drivers"
      onSelectTab={() => {}}
    >
      {children}
    </GridShellBody>
  );
}

function GridShellConnected({ year, children }: GridShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("tab");
  const activeTab = isGridTabId(tabValue) ? tabValue : "drivers";
  const { previous, next, hrefFor, navigate } = useSeasonNavigation(year);

  const onSelectTab = useCallback(
    (tab: GridTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <GridShellBody
      year={year}
      previous={previous}
      next={next}
      hrefFor={hrefFor}
      navigate={navigate}
      activeTab={activeTab}
      onSelectTab={onSelectTab}
    >
      {children}
    </GridShellBody>
  );
}

export function GridShell({ year, children }: GridShellProps) {
  return (
    <Suspense fallback={<GridShellStatic year={year}>{children}</GridShellStatic>}>
      <GridShellConnected year={year}>{children}</GridShellConnected>
    </Suspense>
  );
}
