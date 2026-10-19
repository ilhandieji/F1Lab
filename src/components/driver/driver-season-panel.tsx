import { TeamLogo } from "@/components/grid/team-logo";
import { TeamNameLink } from "@/components/grid/team-name-link";
import type { DriverSeasonView } from "@/lib/driver/types";

type DriverSeasonPanelProps = {
  view: DriverSeasonView;
};

export function DriverSeasonPanel({ view }: DriverSeasonPanelProps) {
  const { standing, totals, teams } = view;

  return (
    <section
      id="driver-season-panel"
      className="rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      role="tabpanel"
      aria-labelledby="driver-season-tab"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            {view.year} season
          </span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white">Season</h2>
        </div>
        {standing ? (
          <div className="text-end">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Standing</p>
            <p className="text-2xl font-black text-white">
              P{standing.position}
              {standing.championshipWon ? (
                <span className="ms-2 text-sm text-red-400">Champion</span>
              ) : null}
            </p>
            <p className="text-sm text-white/60">{standing.points} pts</p>
          </div>
        ) : (
          <p className="text-sm text-white/50">No championship standing for this year.</p>
        )}
      </div>

      {totals ? (
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Wins", value: totals.wins },
            { label: "Podiums", value: totals.podiums },
            { label: "Poles", value: totals.polePositions },
            { label: "Points", value: totals.points },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Teams</h3>
        {teams.length > 0 ? (
          <ul className="grid gap-2">
            {teams.map((stint) => (
              <li
                key={stint.team.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94))] px-4 py-3"
              >
                <TeamLogo team={stint.team} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">
                    <TeamNameLink team={stint.team} year={view.year} className="text-white no-underline hover:text-red-300" />
                  </p>
                  <p className="text-xs text-white/55">
                    {stint.roundsText ?? stint.rounds ?? "Full season"}
                    {stint.testDriver ? " · Test driver" : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">No entrant record for this season.</p>
        )}
      </div>
    </section>
  );
}
