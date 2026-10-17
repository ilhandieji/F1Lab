import Link from "next/link";
import { FEATURED_SEASON } from "@/lib/grid/seasons";

const paths = [
  {
    href: `/grid/${FEATURED_SEASON}?tab=drivers`,
    kicker: "01",
    title: "Opening grid",
    copy: "See the first lap, the starting order, and each team’s launch shape.",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=activity`,
    kicker: "02",
    title: "Season activity",
    copy: "Track transfers, substitutions, returns, and the mid-season reshuffles.",
  },
  {
    href: `/grid/${FEATURED_SEASON}?tab=constructors`,
    kicker: "03",
    title: "Constructors",
    copy: "Follow the championship table as the season unfolded across the year.",
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
          <Link href="/" className="text-[11px] font-black uppercase tracking-[0.34em] text-white" aria-label="F1Lab home">
            F1<span className="text-red-500">Lab</span>
          </Link>
          <Link
            href={`/grid/${FEATURED_SEASON}?tab=drivers`}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/90 transition hover:border-red-500/60 hover:bg-red-500/15"
          >
            Enter the grid
          </Link>
        </header>

        <section className="flex flex-1 flex-col justify-center py-10 md:py-16">
          <span className="mb-5 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/60">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            Formula 1, season by season
          </span>

          <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-white md:text-7xl xl:text-[7rem]">
            Read the sport
            <br />
            in <span className="text-red-500">slow motion.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            F1Lab is the archive for championship storylines: opening lineups, mid-season
            driver moves, constructor battles, and the key changes that shaped each year.
            Start with {FEATURED_SEASON} or jump anywhere from 1950 onward.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/grid/${FEATURED_SEASON}?tab=drivers`}
              className="inline-flex items-center rounded-md bg-red-500 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-400"
            >
              Open the {FEATURED_SEASON} grid
            </Link>
          </div>
        </section>

        <nav className="grid gap-3 md:grid-cols-3" aria-label="Ways into the grid">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-red-500/5"
            >
              <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                {path.kicker}
              </span>
              <h2 className="text-xl font-black tracking-[-0.04em] text-white">{path.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{path.copy}</p>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
