import Link from "next/link";
import { ArchiveHeader } from "@/components/chrome/archive-header";
import { focusRing } from "@/components/chrome/focus";
import { archiveMaxWidthClass } from "@/lib/layout";
import { FEATURED_CONSTRUCTOR_ID } from "@/lib/constructor/constants";
import { constructorHref } from "@/lib/constructor/routes";
import { FEATURED_DRIVER_ID } from "@/lib/driver/constants";
import { driverHref } from "@/lib/driver/routes";
import { FEATURED_SEASON } from "@/lib/grid/seasons";

const paths = [
  {
    href: `/grid/${FEATURED_SEASON}?tab=drivers`,
    kicker: "WDC",
    title: "Drivers' standings",
    copy: "Championship order, points, and who started the season in each seat",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=activity`,
    kicker: "Changes",
    title: "Driver changes",
    copy: "Substitutions, seat swaps, and mid-season moves as they happened",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=constructors`,
    kicker: "WCC",
    title: "Constructors' standings",
    copy: "The WCC table, team points, and how each constructor finished the year",
  },
  {
    href: driverHref(FEATURED_DRIVER_ID, FEATURED_SEASON),
    kicker: "Driver",
    title: "Drivers",
    copy: "Career stats, family links, and season-by-season results",
  },
  {
    href: constructorHref(FEATURED_CONSTRUCTOR_ID, FEATURED_SEASON),
    kicker: "Team",
    title: "Teams",
    copy: "Entry lists, engines, tyres, and every race result by constructor",
  },
] as const;

export function LandingHero() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#07080c] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-[-8%] -z-30 bg-[url('/ferrariBackground.webp')] bg-cover bg-[center_40%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(5,5,7,0.92)_0%,rgba(5,5,7,0.68)_48%,rgba(5,5,7,0.3)_100%),linear-gradient(0deg,rgba(5,5,7,0.82),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,rgba(239,68,68,0.14),transparent_20%),radial-gradient(circle_at_80%_0%,rgba(220,38,38,0.2),transparent_26%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <ArchiveHeader
        yearControl={
          <Link
            href={`/grid/${FEATURED_SEASON}?tab=drivers`}
            className={`min-h-10 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/90 transition hover:border-red-500/60 hover:bg-red-500/15 ${focusRing}`}
          >
            {FEATURED_SEASON} season
          </Link>
        }
      />

      <div
        className={`relative z-10 mx-auto flex min-h-[calc(100vh-4.5rem)] w-full ${archiveMaxWidthClass} flex-col px-4 pb-10 md:px-6`}
      >
        <section className="flex flex-1 flex-col justify-center py-8 md:py-12">
          <span className="mb-5 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            Formula 1 archive · 1950 onward
          </span>

          <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-white md:text-7xl xl:text-[7rem]">
            Every season
            <br />
            <span className="text-red-500">Every detail</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Driver and team standings, seat changes, and season results from 1950
            onward, search above or jump into {FEATURED_SEASON}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/grid/${FEATURED_SEASON}?tab=drivers`}
              className={`inline-flex min-h-11 items-center rounded-md bg-red-500 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-400 motion-reduce:transition-none ${focusRing}`}
            >
              {FEATURED_SEASON} drivers&apos; standings
            </Link>
          </div>
        </section>

        <nav
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
          aria-label="Explore the archive"
        >
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className={`flex min-h-[9.5rem] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-red-500/40 motion-reduce:transition-none ${focusRing}`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                {path.kicker}
              </span>
              <div>
                <h2 className="text-lg font-black tracking-[-0.04em] text-white">{path.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">{path.copy}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
