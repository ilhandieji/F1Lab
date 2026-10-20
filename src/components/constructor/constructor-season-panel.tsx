import Link from "next/link";
import type { ReactNode } from "react";
import { TeamLogo } from "@/components/grid/team-logo";
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
      <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/45">{title}</h3>
      {children}
    </div>
  );
}

export function ConstructorSeasonPanel({ view }: ConstructorSeasonPanelProps) {
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
          <TeamLogo team={view.team} />
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
              {view.year} season
            </span>
            <h2 className="text-xl font-black tracking-[-0.04em] text-white">Entry list</h2>
          </div>
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
            <p className="text-sm text-white/60">
              {standing.points} pts · {standing.engineManufacturerName}
            </p>
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
            { label: "1–2s", value: totals.oneTwoFinishes },
            { label: "Fastest laps", value: totals.fastestLaps },
            { label: "Sprint wins", value: totals.sprintRaceWins },
            {
              label: "Best result",
              value: totals.bestRaceResult ? `P${totals.bestRaceResult}` : "—",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <DetailSection title="Entrant registrations">
        {entrantRegistrations.length > 0 ? (
          <ul className="grid gap-2">
            {entrantRegistrations.map((entry) => (
              <li
                key={`${entry.entrantId}-${entry.engineManufacturerId}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-white">{entry.entrantName}</p>
                <p className="mt-1 text-white/55">
                  {entry.entrantCountry} · Engine: {entry.engineManufacturerName}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">No entrant registration recorded.</p>
        )}
      </DetailSection>

      <DetailSection title="Drivers">
        {lineup.length > 0 ? (
          <ul className="grid gap-2">
            {lineup.map((driver) => (
              <li
                key={`${driver.driverId}-${driver.entrantName}-${driver.engineManufacturerName}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94))] px-4 py-3"
              >
                <Link
                  href={driverHref(driver.driverId, view.year)}
                  className="font-semibold text-white underline decoration-white/20 underline-offset-2 hover:text-red-300"
                >
                  {driver.driverName}
                </Link>
                <div className="text-end text-xs text-white/55">
                  <p>{driver.entrantName}</p>
                  <p>
                    {driver.roundsText ?? driver.rounds ?? "Full season"}
                    {driver.testDriver ? " · Test" : ""} · {driver.engineManufacturerName}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50">No drivers entered for this constructor.</p>
        )}
      </DetailSection>

      <DetailSection title="Chassis">
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
          <p className="text-sm text-white/50">No chassis on record.</p>
        )}
      </DetailSection>

      <DetailSection title="Engines">
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
          <p className="text-sm text-white/50">No engine specification on record.</p>
        )}
      </DetailSection>

      <DetailSection title="Tyres">
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
          <p className="text-sm text-white/50">No tyre supplier on record.</p>
        )}
      </DetailSection>

      {championshipProgression.length > 0 ? (
        <DetailSection title="Points after each round">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr className="text-[9px] font-black uppercase tracking-[0.14em] text-white/40">
                  <th className="pb-2 pe-2">Rnd</th>
                  <th className="pb-2 pe-2">Grand Prix</th>
                  <th className="pb-2 pe-2">Pos</th>
                  <th className="pb-2 pe-2">Engine</th>
                  <th className="pb-2 text-end">Pts</th>
                </tr>
              </thead>
              <tbody>
                {championshipProgression.map((row) => (
                  <tr key={row.round} className="border-t border-white/10">
                    <td className="py-2 pe-2 font-black text-white/70">{row.round}</td>
                    <td className="max-w-[12rem] py-2 pe-2 text-white">{row.grandPrixName}</td>
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
