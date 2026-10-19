import Link from "next/link";
import { focusRing } from "@/components/chrome/focus";
import { driverHref } from "@/lib/driver/routes";
import type { GridDriver } from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

type DriverGridProps = {
  year: number;
  drivers: GridDriver[];
};

export function DriverGrid({ year, drivers }: DriverGridProps) {
  return (
    <section
      id="grid-drivers-panel"
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-drivers-tab"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400">WDC</span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            Drivers&apos; standings
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          Championship order and points at the season opener.
        </p>
      </div>

      {drivers.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:px-3"
            aria-hidden="true"
          >
            <span>Pos</span>
            <span>Driver</span>
            <span className="text-end">Points</span>
          </div>
          <ol className="grid gap-1.5" aria-label={`${year} season-start driver grid`}>
            {drivers.map((driver) => (
              <li key={driver.id}>
                <Link
                  href={driverHref(driver.id, year)}
                  className={`group grid min-h-12 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] transition hover:border-red-500/40 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] ${focusRing}`}
                >
                  <strong className="text-center text-sm font-black tabular-nums text-white">
                    {driver.position}
                  </strong>
                  <div className="flex min-w-0 items-center gap-2 px-2 py-2">
                    <TeamLogo team={driver.team} size="compact" />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black uppercase tracking-[-0.04em] text-white">
                        {driver.lastName}
                      </h3>
                      <p className="truncate text-xs text-white/70">
                        {driver.firstName} · {driver.team.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 pe-3">
                    <strong className="text-lg font-black tabular-nums tracking-[-0.04em] text-white">
                      {driver.points}
                    </strong>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/65">Pts</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
          No drivers&apos; standings are recorded for {year}. Try another season or check back
          after the archive is updated.
        </p>
      )}

      <footer className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-white/65">
        <span>Drivers&apos; standings</span>
        <span>{drivers.length} drivers</span>
        <span>{year}</span>
      </footer>
    </section>
  );
}
