import Link from "next/link";
import { constructorHref } from "@/lib/constructor/routes";
import type { ConstructorStanding } from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

type ConstructorStandingsProps = {
  year: number;
  standings: ConstructorStanding[];
  note: string | null;
  emptyMessage: string | null;
};

export function ConstructorStandings({
  year,
  standings,
  note,
  emptyMessage,
}: ConstructorStandingsProps) {
  return (
    <section
      id="grid-constructors-panel"
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-constructors-tab"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            WCC
          </span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            Constructors&apos; standings
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/60">
          Official team points and championship order for {year}.
        </p>
      </div>

      {standings.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[3.5rem_minmax(0,_1fr)_auto] px-3 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/40 md:grid-cols-[5.3rem_minmax(0,_1fr)_auto] md:px-5 max-sm:hidden"
            aria-hidden="true"
          >
            <span>Pos</span>
            <span>Constructor</span>
            <span className="text-right">Points</span>
          </div>
          <ol className="grid gap-2" aria-label={`${year} Constructors' Championship standings`}>
            {standings.map(({ team, position, points }) => (
              <li key={team.id}>
              <Link
                href={constructorHref(team.id, year)}
                className="group relative grid min-h-[5.7rem] grid-cols-[3.5rem_minmax(0,_1fr)_auto] items-center overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] transition hover:border-red-500/40 hover:border-white/25 md:min-h-[6.7rem] md:grid-cols-[5.3rem_minmax(0,_1fr)_auto]"
              >
                <span
                  className="absolute inset-y-0 left-0 w-[3px] bg-red-500 opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="grid h-full content-center justify-items-center border-r border-white/10 px-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.14em] text-white/40 md:text-[10px]">
                    Pos
                  </span>
                  <strong className="text-lg font-black text-white">{position}</strong>
                </div>
                <div className="flex min-w-0 items-center gap-3 px-3 py-3 md:px-5">
                  <TeamLogo team={team} />
                  <h3 className="truncate text-xl font-black uppercase tracking-[-0.045em] text-white">
                    {team.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-1.5 px-3 py-3 md:gap-2 md:px-5">
                  <strong className="text-2xl font-black tracking-[-0.05em] text-white">
                    {points.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </strong>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Pts</span>
                </div>
              </Link>
              </li>
            ))}
          </ol>
          {note ? <p className="mt-3 text-xs leading-6 text-white/45">{note}</p> : null}
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
          {emptyMessage ?? `Constructor standings for ${year} are not available yet.`}
        </p>
      )}
    </section>
  );
}
