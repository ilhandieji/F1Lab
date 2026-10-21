import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CountryFlag } from "@/components/chrome/country-flag";
import { focusRing } from "@/components/chrome/focus";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { SeasonActivity, TeamInfo } from "@/lib/grid/types";
import { ActivityTimeline } from "./activity-timeline";
import { TeamLogo } from "./team-logo";

function SectionHeading({
  kicker,
  title,
  description,
  id,
}: {
  kicker: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-red-400">{kicker}</span>
        <h2 className="mt-1 text-xl font-black uppercase tracking-[-0.04em] text-white" id={id}>
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-white/70">{description}</p>
    </div>
  );
}

function CompactTeam({ team }: { team: TeamInfo }) {
  return (
    <span className="inline-flex items-center gap-1">
      <TeamLogo team={team} size="tiny" />
      {team.name}
    </span>
  );
}

export function ActivityView({ activity, year }: { activity: SeasonActivity; year: number }) {
  const t = useTranslations("Grid");

  return (
    <section
      id="grid-activity-panel"
      className="mt-6 space-y-9 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-activity-tab"
    >
      <section className="space-y-4" aria-labelledby="activity-overview-title">
        <SectionHeading
          id="activity-overview-title"
          kicker={t("overviewKicker")}
          title={t("seatChanges")}
          description={t("seatChangesDescription")}
        />

        <div className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t("raceDrivers")}</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.uniqueRaceDrivers}</strong>
          </article>
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t("subStints")}</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.substitutions}</strong>
          </article>
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">{t("teamsWithChanges")}</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.changedTeams}</strong>
          </article>
        </div>

        <p className="text-sm leading-6 text-white/65">
          {t("subStintExplainer")}
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="activity-changes-title">
        <SectionHeading
          id="activity-changes-title"
          kicker={t("chronology")}
          title={t("weekendByWeekend")}
          description={t("weekendDescription")}
        />
        <ActivityTimeline events={activity.events} year={year} />
      </section>

      <section className="space-y-4" aria-labelledby="race-drivers-title">
        <SectionHeading
          id="race-drivers-title"
          kicker={t("raceResults")}
          title={t("whoRaced")}
          description={t("whoRacedDescription")}
        />
        {activity.drivers.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {activity.drivers.map((driver) => (
              <li className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5" key={driver.id}>
                <DriverAvatar photoUrl={driver.portraitUrl} fullName={driver.name} variant="row" />
                <CountryFlag alpha2={driver.nationalityAlpha2} name={driver.nationalityName} />
                {driver.teams[0] ? <TeamLogo team={driver.teams[0]} size="tiny" /> : null}
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <Link
                    href={driverHref(driver.id, year)}
                    className={`truncate text-sm font-bold text-white transition hover:text-red-300 ${focusRing}`}
                  >
                    {driver.name}
                  </Link>
                  <span className="truncate text-xs leading-4 text-white/65">
                    {driver.openedSeason ? t("fromRound1") : t("joinedMidSeason")}
                    {driver.teams.length > 0
                      ? ` · ${driver.teams.map((team) => team.name).join(" / ")}`
                      : ""}
                  </span>
                </div>
                <span dir="ltr" className="shrink-0 text-xs font-bold text-white/70">{t("gpCount", { count: driver.weekends })}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">{t("noRaceDrivers")}</p>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="test-drivers-title">
        <SectionHeading
          id="test-drivers-title"
          kicker={t("assignments")}
          title={t("testDrivers")}
          description={t("testDriversDescription")}
        />
        {activity.testDrivers.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {activity.testDrivers.map((driver) => (
              <li className="flex min-w-0 items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3" key={driver.id}>
                <DriverAvatar photoUrl={driver.portraitUrl} fullName={driver.name} variant="row" />
                <CountryFlag alpha2={driver.nationalityAlpha2} name={driver.nationalityName} />
                <div className="min-w-0 flex-1">
                <Link
                  href={driverHref(driver.id, year)}
                  className={`truncate text-sm font-bold text-white transition hover:text-red-300 ${focusRing}`}
                >
                  {driver.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
                  {driver.teams.map((team) => (
                    <CompactTeam team={team} key={team.id} />
                  ))}
                </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
            {t("noTestDrivers")}
          </p>
        )}
        <p className="text-sm leading-6 text-white/65">
          {t("reserveNote")}
        </p>
      </section>
    </section>
  );
}
