import Image from "next/image";
import Link from "next/link";
import { ArchiveSearchLazy } from "@/components/landing/archive-search-lazy";
import { FEATURED_CONSTRUCTOR_ID } from "@/lib/constructor/constants";
import { constructorHref } from "@/lib/constructor/routes";
import { FEATURED_DRIVER_ID } from "@/lib/driver/constants";
import { driverHref } from "@/lib/driver/routes";
import { FEATURED_SEASON } from "@/lib/grid/seasons";

const paths = [
  {
    href: `/grid/${FEATURED_SEASON}?tab=drivers`,
    image: "/talon-kai-honeyman-EwUZ8hjWXSk-unsplash.webp",
    title: "Drivers' standings",
    copy: "Championship order, points, and who started the season in each seat.",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=activity`,
    image: "/marc-kleen-fJjtt4kHews-unsplash.webp",
    title: "Driver changes",
    copy: "Substitutions, seat swaps, and mid-season moves as they happened.",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=constructors`,
    image: "/toby-s-bb-bW4Ea5mM-unsplash.webp",
    title: "Constructors' standings",
    copy: "The WCC table, team points, and how each constructor finished the year.",
  },
  {
    href: driverHref(FEATURED_DRIVER_ID, FEATURED_SEASON),
    image: "/isaac-maffeis-UU1txX-LtEA-unsplash.webp",
    title: "Drivers",
    copy: "Career stats, family links, and season-by-season results.",
  },
  {
    href: constructorHref(FEATURED_CONSTRUCTOR_ID, FEATURED_SEASON),
    image: "/roy-tsong-W0haDrVTW58-unsplash.webp",
    title: "Teams",
    copy: "Entry lists, engines, tyres, and every race result by constructor.",
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

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-10 pt-5 md:px-6">
        <header className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-[11px] font-black uppercase tracking-[0.34em] text-white"
            aria-label="F1Lab home"
          >
            F1<span className="text-red-500">Lab</span>
          </Link>
          <Link
            href={`/grid/${FEATURED_SEASON}?tab=drivers`}
            className="min-h-11 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/60 hover:bg-red-500/15"
          >
            {FEATURED_SEASON} season
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10 md:py-16">
          <span className="mb-5 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            Formula 1 archive · 1950 onward
          </span>

          <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-white md:text-7xl xl:text-[7rem]">
            Every season.
            <br />
            <span className="text-red-500">Every detail.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Drivers&apos; standings, driver changes, constructors&apos; standings, and full team
            entry data from the F1DB archive. Jump into {FEATURED_SEASON} or pick any year back to
            1950.
          </p>

          <ArchiveSearchLazy />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/grid/${FEATURED_SEASON}?tab=drivers`}
              className="inline-flex min-h-11 items-center rounded-md bg-red-500 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-400"
            >
              {FEATURED_SEASON} drivers&apos; standings
            </Link>
          </div>
        </section>

        <nav className="grid gap-3 md:grid-cols-2 lg:grid-cols-3" aria-label="Explore the archive">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group relative flex min-h-[11rem] overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-0.5 hover:border-red-500/50 md:min-h-[13rem]"
            >
              <Image
                src={path.image}
                alt=""
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,7,0.92)_0%,rgba(5,5,7,0.45)_45%,rgba(5,5,7,0.15)_100%)]"
              />
              <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
                <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
                  {path.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/75">{path.copy}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
