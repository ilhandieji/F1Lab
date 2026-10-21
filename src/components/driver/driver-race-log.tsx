import { GrandPrixName } from "@/components/chrome/grand-prix-name";
import { ResultMarks } from "@/components/chrome/result-marks";
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
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400">
          {view.year}
        </span>
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">Results</h2>
      </div>

      {races.length === 0 ? (
        <p className="text-sm text-white/70">No race results recorded for this season.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[32rem] border-collapse text-start text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                  <th className="pb-2 pe-2 font-bold">Rnd</th>
                  <th className="pb-2 pe-2 font-bold">Grand Prix</th>
                  <th className="pb-2 pe-2 font-bold">Team</th>
                  <th className="pb-2 pe-2 font-bold">Grid</th>
                  <th className="pb-2 pe-2 font-bold">Finish</th>
                  <th className="pb-2 text-end font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race) => (
                  <tr key={race.round} className="border-t border-white/10">
                    <td className="py-3 pe-2 font-black tabular-nums text-white/80">{race.round}</td>
                    <td className="max-w-[14rem] py-3 pe-2 font-medium text-white">
                      <GrandPrixName
                        name={race.grandPrixName}
                        countryAlpha2={race.countryAlpha2}
                        countryName={race.countryName}
                      />
                    </td>
                    <td className="py-3 pe-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={race.team} size="compact" />
                        <span className="text-white/80">{race.team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pe-2 tabular-nums text-white/80">{race.gridPosition ?? "—"}</td>
                    <td className="py-3 pe-2">
                      <span className={race.retired ? "text-amber-200" : "font-semibold text-white"}>
                        {race.finishPosition}
                      </span>
                      <ResultMarks pole={race.pole} fastestLap={race.fastestLap} />
                      {race.retirementReason ? (
                        <span className="mt-0.5 block text-xs text-white/65">{race.retirementReason}</span>
                      ) : null}
                    </td>
                    <td className="py-3 text-end font-black tabular-nums text-white">{race.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {races.map((race) => (
              <li
                key={`mobile-${race.round}`}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.95),rgba(16,16,18,0.98))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-300">
                      R{race.round}
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      <GrandPrixName
                        name={race.grandPrixName}
                        countryAlpha2={race.countryAlpha2}
                        countryName={race.countryName}
                      />
                    </p>
                  </div>
                  <p className="text-xl font-black tabular-nums text-white">{race.points} pts</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                  <TeamLogo team={race.team} size="compact" />
                  <span>{race.team.name}</span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">Grid</dt>
                    <dd className="mt-0.5 font-semibold text-white">{race.gridPosition ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">Finish</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                      {race.finishPosition}
                      <ResultMarks pole={race.pole} fastestLap={race.fastestLap} />
                    </dd>
                  </div>
                </dl>
                {race.retirementReason ? (
                  <p className="mt-2 text-xs text-white/65">{race.retirementReason}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}

      {sprints.length > 0 ? (
        <div className="mt-8">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
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
                  <span className="inline-flex items-center gap-2 text-sm text-white">
                    <span>R{sprint.round}</span>
                    <GrandPrixName
                      name={sprint.grandPrixName}
                      countryAlpha2={sprint.countryAlpha2}
                      countryName={sprint.countryName}
                    />
                  </span>
                </div>
                <span className="text-sm font-black tabular-nums text-white">
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
