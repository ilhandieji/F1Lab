import Link from "next/link";
import { focusRing } from "@/components/chrome/focus";
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
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400">WCC</span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            Constructors&apos; standings
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          Official team points and championship order for {year}.
        </p>
      </div>

      {standings.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:px-3"
            aria-hidden="true"
          >
            <span>Pos</span>
            <span>Constructor</span>
            <span className="text-end">Points</span>
          </div>
          <ol className="grid gap-1.5" aria-label={`${year} Constructors' Championship standings`}>
            {standings.map(({ team, position, points }) => (
              <li key={team.id}>
                <Link
                  href={constructorHref(team.id, year)}
                  className={`group grid min-h-12 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] transition hover:border-red-500/40 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] ${focusRing}`}
                >
                  <strong className="text-center text-sm font-black tabular-nums text-white">
                    {position}
                  </strong>
                  <div className="flex min-w-0 items-center gap-2 px-2 py-2">
                    <TeamLogo team={team} size="compact" />
                    <h3 className="truncate text-base font-black uppercase tracking-[-0.04em] text-white">
                      {team.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 pe-3">
                    <strong className="text-lg font-black tabular-nums tracking-[-0.04em] text-white">
                      {points.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </strong>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/65">Pts</span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          {note ? <p className="mt-3 text-xs leading-6 text-white/65">{note}</p> : null}
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
          {emptyMessage ?? `Constructor standings for ${year} are not available yet.`}
        </p>
      )}
    </section>
  );
}
