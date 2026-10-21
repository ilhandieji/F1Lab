import { useTranslations } from "next-intl";
import { CountryFlag } from "@/components/chrome/country-flag";
import { TeamLogo } from "@/components/grid/team-logo";
import { TeamNameLink } from "@/components/grid/team-name-link";
import type { DriverSeasonView } from "@/lib/driver/types";

type DriverSeasonPanelProps = {
  view: DriverSeasonView;
};

export function DriverSeasonPanel({ view }: DriverSeasonPanelProps) {
  const t = useTranslations("Common");
  const driverText = useTranslations("Driver");
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
            {t("seasonLabel", { year: view.year })}
          </span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white">{t("season")}</h2>
        </div>
        {standing ? (
          <div className="text-end">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{t("standing")}</p>
            <p className="text-2xl font-black text-white">
              <span dir="ltr">{t("position", { position: standing.position })}</span>
              {standing.championshipWon ? (
                <span className="ms-2 text-sm text-red-400">{t("champion")}</span>
              ) : null}
            </p>
            <p className="text-sm text-white/60">{t("pointsValue", { points: standing.points })}</p>
          </div>
        ) : (
          <p className="text-sm text-white/50">{t("noStanding")}</p>
        )}
      </div>

      {totals ? (
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: t("wins"), value: totals.wins },
            { label: t("podiums"), value: totals.podiums },
            { label: t("poles"), value: totals.polePositions },
            { label: t("points"), value: totals.points },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{stat.label}</p>
              <p dir="ltr" className="text-lg font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/70">{t("teams")}</h3>
        {teams.length > 0 ? (
          <ul className="grid gap-2">
            {teams.map((stint) => (
              <li
                key={stint.team.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94))] px-4 py-3"
              >
                <TeamLogo team={stint.team} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <CountryFlag alpha2={stint.team.countryAlpha2} name={stint.team.countryName} />
                    <TeamNameLink team={stint.team} year={view.year} className="text-white no-underline hover:text-red-300" />
                  </p>
                  <p className="text-xs text-white/55">
                    <span lang={stint.roundsText || stint.rounds ? "en" : undefined} dir="ltr">
                      {stint.roundsText ?? stint.rounds ?? t("fullSeason")}
                    </span>
                    {stint.testDriver ? t("testDriver") : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{driverText("noEntrant")}</p>
        )}
      </div>
    </section>
  );
}
