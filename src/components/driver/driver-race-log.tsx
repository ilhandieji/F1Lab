import { useTranslations } from "next-intl";
import { GrandPrixName } from "@/components/chrome/grand-prix-name";
import { ResultMarks } from "@/components/chrome/result-marks";
import { TeamLogo } from "@/components/grid/team-logo";
import type { DriverRaceResult, DriverSeasonView, DriverSprintResult } from "@/lib/driver/types";
import type { TeamInfo } from "@/lib/grid/types";

type DriverRaceLogProps = {
  view: DriverSeasonView;
};

type ResultRow = {
  key: string;
  round: number;
  grandPrixName: string;
  countryAlpha2: string | null;
  countryName: string | null;
  team: TeamInfo;
  race: DriverRaceResult | null;
  sprint: DriverSprintResult | null;
};

function resultRows(races: DriverRaceResult[], sprints: DriverSprintResult[]): ResultRow[] {
  const sprintByRound = new Map(sprints.map((sprint) => [sprint.round, sprint]));
  const raceRounds = new Set(races.map((race) => race.round));
  const rows: ResultRow[] = races.map((race) => ({
    key: `race-${race.round}`,
    round: race.round,
    grandPrixName: race.grandPrixName,
    countryAlpha2: race.countryAlpha2,
    countryName: race.countryName,
    team: race.team,
    race,
    sprint: sprintByRound.get(race.round) ?? null,
  }));

  for (const sprint of sprints) {
    if (raceRounds.has(sprint.round)) continue;
    rows.push({
      key: `sprint-${sprint.round}`,
      round: sprint.round,
      grandPrixName: sprint.grandPrixName,
      countryAlpha2: sprint.countryAlpha2,
      countryName: sprint.countryName,
      team: sprint.team,
      race: null,
      sprint,
    });
  }

  rows.sort((a, b) => a.round - b.round);
  return rows;
}

function SprintMark({ sprint, pointsLabel }: { sprint: DriverSprintResult | null; pointsLabel: (points: number) => string }) {
  if (!sprint) return <span className="text-white/40">—</span>;
  return (
    <span dir="ltr" className="font-semibold tabular-nums text-white">
      {sprint.finishPosition} · {pointsLabel(sprint.points)}
    </span>
  );
}

function ResultsTableColgroup({ showSprint }: { showSprint: boolean }) {
  return (
    <colgroup>
      <col className="w-10" />
      <col />
      <col className="w-[9.5rem]" />
      <col className="w-12" />
      <col className="w-[7.5rem]" />
      {showSprint ? <col className="w-[7.25rem]" /> : null}
      <col className="w-14" />
    </colgroup>
  );
}

const thBase = "pb-2 pe-3 text-start align-bottom font-bold";
const tdBase = "py-3 pe-3 align-top";

export function DriverRaceLog({ view }: DriverRaceLogProps) {
  const t = useTranslations("Common");
  const rows = resultRows(view.races, view.sprints);
  const showSprint = view.sprints.length > 0;
  const pointsLabel = (points: number) => t("pointsValue", { points });

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
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">{t("results")}</h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/70">{t("noRaceResults")}</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table dir="ltr" className="w-full min-w-[40rem] table-fixed border-collapse text-start text-sm">
              <ResultsTableColgroup showSprint={showSprint} />
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                  <th className={thBase}>{t("round")}</th>
                  <th className={thBase}>{t("grandPrix")}</th>
                  <th className={thBase}>{t("team")}</th>
                  <th className={`${thBase} text-end`}>{t("gridCol")}</th>
                  <th className={thBase}>{t("finish")}</th>
                  {showSprint ? <th className={thBase}>{t("sprint")}</th> : null}
                  <th className={`${thBase} text-end`}>{t("pts")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-t border-white/10">
                    <td className={`${tdBase} font-black tabular-nums text-white/80`}>{row.round}</td>
                    <td className={`${tdBase} font-medium text-white`}>
                      <GrandPrixName
                        name={row.grandPrixName}
                        countryAlpha2={row.countryAlpha2}
                        countryName={row.countryName}
                      />
                    </td>
                    <td className={tdBase}>
                      <div className="flex min-w-0 items-center gap-2">
                        <TeamLogo team={row.team} size="compact" />
                        <span className="truncate text-white/80">{row.team.name}</span>
                      </div>
                    </td>
                    <td className={`${tdBase} text-end tabular-nums text-white/80`}>
                      {row.race?.gridPosition ?? "—"}
                    </td>
                    <td className={tdBase}>
                      {row.race ? (
                        <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
                          <span className={row.race.retired ? "text-amber-200" : "font-semibold text-white"}>
                            {row.race.finishPosition}
                          </span>
                          <ResultMarks pole={row.race.pole} fastestLap={row.race.fastestLap} />
                          {row.race.retirementReason ? (
                            <span lang="en" dir="ltr" className="w-full text-xs text-white/65">{row.race.retirementReason}</span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    {showSprint ? (
                      <td className={`${tdBase} whitespace-nowrap`}>
                        <SprintMark sprint={row.sprint} pointsLabel={pointsLabel} />
                      </td>
                    ) : null}
                    <td className={`${tdBase} text-end font-black tabular-nums text-white`}>
                      {row.race ? row.race.points : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {rows.map((row) => (
              <li
                key={`mobile-${row.key}`}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.95),rgba(16,16,18,0.98))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-300">
                      R{row.round}
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      <GrandPrixName
                        name={row.grandPrixName}
                        countryAlpha2={row.countryAlpha2}
                        countryName={row.countryName}
                      />
                    </p>
                  </div>
                  <p className="text-xl font-black tabular-nums text-white">
                    {row.race ? pointsLabel(row.race.points) : "—"}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                  <TeamLogo team={row.team} size="compact" />
                  <span>{row.team.name}</span>
                </div>
                <dl className={`mt-3 grid gap-2 text-xs text-white/70 ${showSprint ? "grid-cols-3" : "grid-cols-2"}`}>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">{t("gridCol")}</dt>
                    <dd className="mt-0.5 font-semibold text-white">{row.race?.gridPosition ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">{t("finish")}</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                      {row.race ? (
                        <>
                          {row.race.finishPosition}
                          <ResultMarks pole={row.race.pole} fastestLap={row.race.fastestLap} />
                        </>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </div>
                  {showSprint ? (
                    <div>
                      <dt className="uppercase tracking-[0.12em] text-white/65">{t("sprint")}</dt>
                      <dd className="mt-0.5">
                        <SprintMark sprint={row.sprint} pointsLabel={pointsLabel} />
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {row.race?.retirementReason ? (
                  <p lang="en" dir="ltr" className="mt-2 text-xs text-white/65">{row.race.retirementReason}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
