import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { CountryFlag } from "@/components/chrome/country-flag";
import { GrandPrixName } from "@/components/chrome/grand-prix-name";
import { TeamLogo } from "@/components/grid/team-logo";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { ConstructorSeasonView } from "@/lib/constructor/types";

type ConstructorSeasonPanelProps = {
  view: ConstructorSeasonView;
};

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/70">{title}</h3>
      {children}
    </div>
  );
}

export function ConstructorSeasonPanel({ view }: ConstructorSeasonPanelProps) {
  const t = useTranslations("Common");
  const teamText = useTranslations("Constructor");
  const { standing, totals, entrantRegistrations, lineup, chassis, engines, tyres, championshipProgression } =
    view;

  return (
    <section
      id="constructor-season-panel"
      className="rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      role="tabpanel"
      aria-labelledby="constructor-season-tab"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamLogo team={view.team} size="featured" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
              {t("seasonLabel", { year: view.year })}
            </span>
            <h2 className="text-xl font-black tracking-[-0.04em] text-white">{teamText("entryList")}</h2>
          </div>
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
            <p className="text-sm text-white/60">
              {t("pointsValue", { points: standing.points })} · <span lang="en">{standing.engineManufacturerName}</span>
            </p>
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
            { label: teamText("oneTwoShort"), value: totals.oneTwoFinishes },
            { label: t("fastestLaps"), value: totals.fastestLaps },
            { label: teamText("sprintWins"), value: totals.sprintRaceWins },
            {
              label: teamText("bestResult"),
              value: totals.bestRaceResult ? t("position", { position: totals.bestRaceResult }) : "—",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <DetailSection title={teamText("entrants")}>
        {entrantRegistrations.length > 0 ? (
          <ul className="grid gap-2">
            {entrantRegistrations.map((entry) => (
              <li
                key={`${entry.entrantId}-${entry.engineManufacturerId}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-white">{entry.entrantName}</p>
                <p className="mt-1 text-white/55">
                  <span lang="en">{entry.entrantCountry}</span> · {t("engineLabel", { name: entry.engineManufacturerName })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{teamText("noEntrants")}</p>
        )}
      </DetailSection>

      <DetailSection title={t("drivers")}>
        {lineup.length > 0 ? (
          <ul className="grid gap-2">
            {lineup.map((driver) => (
              <li
                key={`${driver.driverId}-${driver.entrantName}-${driver.engineManufacturerName}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94))] px-4 py-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <DriverAvatar
                    photoUrl={driver.portraitUrl}
                    fullName={driver.driverName}
                    variant="row"
                  />
                  <CountryFlag alpha2={driver.nationalityAlpha2} name={driver.nationalityName} />
                  <Link
                    href={driverHref(driver.driverId, view.year)}
                    className="truncate font-semibold text-white underline decoration-white/20 underline-offset-2 hover:text-red-300"
                  >
                    {driver.driverName}
                  </Link>
                </span>
                <div className="text-end text-xs text-white/55">
                  <p>{driver.entrantName}</p>
                  <p>
                    <span lang={driver.roundsText || driver.rounds ? "en" : undefined} dir="ltr">
                      {driver.roundsText ?? driver.rounds ?? t("fullSeason")}
                    </span>
                    {driver.testDriver ? t("testShort") : ""} · <span lang="en">{driver.engineManufacturerName}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{teamText("noDrivers")}</p>
        )}
      </DetailSection>

      <DetailSection title={teamText("chassis")}>
        {chassis.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {chassis.map((entry, index) => (
              <li
                key={`${entry.chassisFullName}-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-white">{entry.chassisFullName}</p>
                <p className="mt-1 text-white/55">
                  {entry.entrantName} · {entry.engineManufacturerName}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{teamText("noChassis")}</p>
        )}
      </DetailSection>

      <DetailSection title={teamText("engines")}>
        {engines.length > 0 ? (
          <ul className="grid gap-2">
            {engines.map((entry, index) => (
              <li
                key={`${entry.engineFullName}-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-white">{entry.engineFullName}</p>
                <p className="mt-1 text-white/55">
                  {entry.engineManufacturerName} · {entry.entrantName}
                </p>
                {(entry.capacity ?? entry.configuration ?? entry.aspiration) ? (
                  <p className="mt-1 text-xs text-white/45">
                    {[entry.capacity ? `${entry.capacity}L` : null, entry.configuration, entry.aspiration]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{teamText("noEngines")}</p>
        )}
      </DetailSection>

      <DetailSection title={t("tyres")}>
        {tyres.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {tyres.map((entry, index) => (
              <li
                key={`${entry.tyreManufacturerName}-${index}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
              >
                {entry.tyreManufacturerName}
                <span className="text-white/45"> · {entry.entrantName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">{teamText("noTyres")}</p>
        )}
      </DetailSection>

      {championshipProgression.length > 0 ? (
        <DetailSection title={teamText("progression")}>
          <div className="overflow-x-auto">
            <table dir="ltr" className="w-full min-w-[28rem] border-collapse text-start text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                  <th className="pb-2 pe-2">{t("round")}</th>
                  <th className="pb-2 pe-2">{t("grandPrix")}</th>
                  <th className="pb-2 pe-2">{t("pos")}</th>
                  <th className="pb-2 pe-2">{t("engine")}</th>
                  <th className="pb-2 text-end">{t("pts")}</th>
                </tr>
              </thead>
              <tbody>
                {championshipProgression.map((row) => (
                  <tr key={row.round} className="border-t border-white/10">
                    <td className="py-2 pe-2 font-black text-white/70">{row.round}</td>
                    <td className="max-w-[14rem] py-2 pe-2 text-white">
                      <GrandPrixName
                        name={row.grandPrixName}
                        countryAlpha2={row.countryAlpha2}
                        countryName={row.countryName}
                      />
                    </td>
                    <td className="py-2 pe-2 font-semibold text-white">{row.position}</td>
                    <td className="py-2 pe-2 text-white/60">{row.engineManufacturerName}</td>
                    <td className="py-2 text-end tabular-nums text-white">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      ) : null}
    </section>
  );
}
