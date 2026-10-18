import { TeamLogo } from "@/components/grid/team-logo";
import type { DriverSeasonView } from "@/lib/driver/types";

type DriverRaceLogProps = {
  view: DriverSeasonView;
};

export function DriverRaceLog({ view }: DriverRaceLogProps) {
  const { races, sprints } = view;

  return (
    <section
      id="driver-races-panel"
      className="rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      role="tabpanel"
      aria-labelledby="driver-races-tab"
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
          {view.year}
        </span>
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">Race log</h2>
      </div>

      {races.length === 0 ? (
        <p className="text-sm text-white/50">No race results recorded for this season.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="text-[9px] font-black uppercase tracking-[0.14em] text-white/40">
                <th className="pb-2 pe-2">Rnd</th>
                <th className="pb-2 pe-2">Grand Prix</th>
                <th className="pb-2 pe-2">Team</th>
                <th className="pb-2 pe-2">Grid</th>
                <th className="pb-2 pe-2">Finish</th>
                <th className="pb-2 text-end">Pts</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr key={race.round} className="border-t border-white/10">
                  <td className="py-3 pe-2 font-black text-white/70">{race.round}</td>
                  <td className="max-w-[10rem] py-3 pe-2 font-medium text-white">{race.grandPrixName}</td>
                  <td className="py-3 pe-2">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={race.team} size="compact" />
                      <span className="hidden text-white/70 sm:inline">{race.team.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pe-2 text-white/70">{race.gridPosition ?? "—"}</td>
                  <td className="py-3 pe-2">
                    <span className={race.retired ? "text-amber-400/90" : "font-semibold text-white"}>
                      {race.finishPosition}
                    </span>
                    {race.pole ? (
                      <span className="ms-1 text-[9px] font-black uppercase text-purple-300">Pole</span>
                    ) : null}
                    {race.fastestLap ? (
                      <span className="ms-1 text-[9px] font-black uppercase text-violet-300">FL</span>
                    ) : null}
                    {race.retirementReason ? (
                      <span className="mt-0.5 block text-xs text-white/45">{race.retirementReason}</span>
                    ) : null}
                  </td>
                  <td className="py-3 text-end font-black tabular-nums text-white">{race.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sprints.length > 0 ? (
        <div className="mt-8">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
            Sprint results
          </h3>
          <ul className="grid gap-2">
            {sprints.map((sprint) => (
              <li
                key={`sprint-${sprint.round}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <TeamLogo team={sprint.team} size="compact" />
                  <span className="text-sm text-white">
                    R{sprint.round} · {sprint.grandPrixName}
                  </span>
                </div>
                <span className="text-sm font-black text-white">
                  {sprint.finishPosition} · {sprint.points} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
