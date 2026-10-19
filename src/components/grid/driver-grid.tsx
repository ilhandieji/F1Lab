import Link from "next/link";
import { driverHref } from "@/lib/driver/routes";
import type { GridDriver } from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

type DriverGridProps = {
  year: number;
  drivers: GridDriver[];
  highestPoints: number;
};

export function DriverGrid({ year, drivers, highestPoints }: DriverGridProps) {
  return (
    <section
      id="grid-drivers-panel"
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-drivers-tab"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            WDC
          </span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            Drivers&apos; standings
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/60">
          Championship order and points at the season opener.
        </p>
      </div>

      {drivers.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[3.5rem_minmax(0,_1fr)_auto] px-3 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/40 md:grid-cols-[5.3rem_minmax(0,_1fr)_auto] md:px-5 max-sm:hidden"
            aria-hidden="true"
          >
            <span>Pos</span>
            <span>Driver</span>
            <span className="text-right">Points</span>
          </div>
          <ol className="grid gap-2" aria-label={`${year} season-start driver grid`}>
            {drivers.map((driver) => {
              const progress = Math.min((driver.points / highestPoints) * 100, 100);
              return (
                <li key={driver.id}>
                  <Link
                    href={driverHref(driver.id, year)}
                    className="group relative grid min-h-[5.7rem] grid-cols-[3.5rem_minmax(0,_1fr)_auto] items-center overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] transition hover:border-white/25 md:min-h-[6.7rem] md:grid-cols-[5.3rem_minmax(0,_1fr)_auto]"
                  >
                  <span
                    className="absolute inset-y-0 left-0 w-[3px] bg-red-500 opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="grid h-full content-center justify-items-center border-r border-white/10 px-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.14em] text-white/40 md:text-[10px]">
                      Pos
                    </span>
                    <strong className="text-lg font-black text-white">{driver.position}</strong>
                  </div>

                  <div className="min-w-0 px-3 py-3 md:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <TeamLogo team={driver.team} />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                          {driver.firstName}
                        </span>
                        <h3 className="truncate text-xl font-black uppercase tracking-[-0.045em] text-white">
                          {driver.lastName}
                        </h3>
                        <p className="mt-1 text-xs text-white/55">{driver.team.name}</p>
                      </div>
                    </div>
                    <div
                      className="mt-3 h-0.5 overflow-hidden bg-white/10"
                      role="progressbar"
                      aria-label={`${driver.firstName} ${driver.lastName} points`}
                      aria-valuenow={driver.points}
                      aria-valuemin={0}
                      aria-valuemax={highestPoints}
                    >
                      <span className="block h-full bg-gradient-to-r from-red-900 to-red-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 px-3 py-3 md:gap-2 md:px-5">
                    <strong className="text-2xl font-black tracking-[-0.05em] text-white">
                      {driver.points}
                    </strong>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                      Pts
                    </span>
                  </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
          No drivers&apos; standings are recorded for {year}. Try another season or check back
          after the archive is updated.
        </p>
      )}

      <footer className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
        <span>Drivers&apos; standings</span>
        <span>{drivers.length} drivers</span>
        <span>{year}</span>
      </footer>
    </section>
  );
}
