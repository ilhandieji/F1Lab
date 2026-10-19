import Link from "next/link";
import { focusRing } from "@/components/chrome/focus";
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
          kicker="Season overview"
          title="Driver changes"
          description="Substitutions, seat swaps, and teams that reshuffled their line-up."
        />

        <div className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Unique race drivers</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.uniqueRaceDrivers}</strong>
          </article>
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Substitution stints</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.substitutions}</strong>
          </article>
          <article className="grid gap-1.5 p-3 md:p-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Teams with changes</span>
            <strong className="mt-2 block text-2xl font-black tracking-[-0.05em] text-white">{activity.summary.changedTeams}</strong>
          </article>
        </div>

        <p className="text-sm leading-6 text-white/65">
          A substitute stint is counted when a replacement fills a seat and the previous race
          driver later returns. Transfers and mid-season returns are listed separately.
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="activity-changes-title">
        <SectionHeading
          id="activity-changes-title"
          kicker="Chronology"
          title="Driver changes"
          description="Outgoing and incoming race drivers, weekend by weekend."
        />
        <ActivityTimeline events={activity.events} year={year} />
      </section>

      <section className="space-y-4" aria-labelledby="race-drivers-title">
        <SectionHeading
          id="race-drivers-title"
          kicker="Race results"
          title="Race-driver appearances"
          description="Every driver with a recorded Grand Prix result this season."
        />
        {activity.drivers.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {activity.drivers.map((driver) => (
              <li className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3" key={driver.id}>
                {driver.teams[0] ? <TeamLogo team={driver.teams[0]} size="tiny" /> : null}
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <Link
                    href={driverHref(driver.id, year)}
                    className={`truncate text-sm font-bold text-white transition hover:text-red-300 ${focusRing}`}
                  >
                    {driver.name}
                  </Link>
                  <span className="truncate text-xs leading-4 text-white/65">
                    {driver.openedSeason ? "From round 1" : "Joined mid-season"}
                    {driver.teams.length > 0
                      ? ` · ${driver.teams.map((team) => team.name).join(" / ")}`
                      : ""}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-bold text-white/70">{driver.weekends} GP</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">No race-driver appearances are recorded for this season.</p>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="test-drivers-title">
        <SectionHeading
          id="test-drivers-title"
          kicker="Season assignments"
          title="Test drivers"
          description="Roles written into the official season entry list."
        />
        {activity.testDrivers.length > 0 ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {activity.testDrivers.map((driver) => (
              <li className="flex min-w-0 flex-col items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3" key={driver.id}>
                <Link
                  href={driverHref(driver.id, year)}
                  className={`truncate text-sm font-bold text-white transition hover:text-red-300 ${focusRing}`}
                >
                  {driver.name}
                </Link>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
                  {driver.teams.map((team) => (
                    <CompactTeam team={team} key={team.id} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
            No test-driver designations are recorded for this championship.
          </p>
        )}
        <p className="text-sm leading-6 text-white/65">
          Reserve-driver roles and private test sessions sit outside this dataset.
        </p>
      </section>
    </section>
  );
}
