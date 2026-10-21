import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { focusRing } from "@/components/chrome/focus";
import { GrandPrixName } from "@/components/chrome/grand-prix-name";
import { driverHref } from "@/lib/driver/routes";
import type { ActivityChangeKind, ActivityEvent } from "@/lib/grid/types";
import { DriverNameList } from "./driver-name-link";
import { TeamLogo } from "./team-logo";

const changeLabel: Record<ActivityChangeKind, string> = {
  transfer: "Team swap",
  return: "Back in seat",
  substitution: "Sub",
  "lineup-change": "Line-up change",
};

const changeColor: Record<ActivityChangeKind, string> = {
  transfer: "text-amber-200",
  return: "text-emerald-200",
  substitution: "text-red-300",
  "lineup-change": "text-white/75",
};

export function ActivityTimeline({ events, year }: { events: ActivityEvent[]; year: number }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
        This season kept a settled race lineup — no seat changes are recorded between Grands Prix.
      </p>
    );
  }

  return (
    <ol
      className="ms-2 grid list-none gap-5 border-s border-white/15 py-1 ps-4 md:ms-4 md:ps-6"
      aria-label="Chronological driver changes"
    >
      {events.map((event) => (
        <li className="relative min-w-0" key={event.round}>
          <span
            className="absolute -start-[1.45rem] top-0 grid h-6 w-6 place-items-center rounded-full border border-red-400/40 bg-[#190e10] text-[10px] font-black text-red-300 md:-start-[1.95rem]"
            aria-hidden="true"
          >
            {event.round}
          </span>
          <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
            <h3 className="text-sm font-extrabold text-white">
              <GrandPrixName
                name={event.name}
                countryAlpha2={event.countryAlpha2}
                countryName={event.countryName}
              />
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">
              {event.changes.length} seat {event.changes.length === 1 ? "change" : "changes"}
            </span>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {event.changes.map((change) => (
              <article
                className="min-w-0 rounded-xl border border-white/10 bg-[#111417]/80 p-3"
                key={`${event.round}-${change.team.id}`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <TeamLogo team={change.team} size="compact" />
                  <h4 className="min-w-0 flex-1 truncate text-sm font-bold text-white">
                    {change.team.name}
                  </h4>
                  <span
                    className={`shrink-0 text-[11px] font-bold uppercase tracking-[0.08em] ${changeColor[change.kind]}`}
                  >
                    {changeLabel[change.kind]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                  <div className="grid min-w-0 gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                      Out
                    </span>
                    <strong className="break-words text-xs leading-5 text-white/85">
                      {change.outgoing.length > 0 ? (
                        <DriverNameList drivers={change.outgoing} year={year} />
                      ) : (
                        "No prior race seat"
                      )}
                    </strong>
                  </div>
                  <ChevronRight className="text-red-400 rtl:rotate-180" size={14} aria-hidden="true" />
                  <div className="grid min-w-0 gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                      In
                    </span>
                    <strong className="break-words text-xs leading-5 text-white/85">
                      {change.incoming.length > 0 ? (
                        <DriverNameList drivers={change.incoming} year={year} />
                      ) : (
                        "Seat vacant"
                      )}
                    </strong>
                  </div>
                </div>
                {change.stints.length > 0 ? (
                  <div className="mt-3 grid gap-1 border-t border-white/10 pt-2 text-xs text-white/65">
                    {change.stints.map((stint) => {
                      const driverName =
                        change.incoming.find((driver) => driver.id === stint.driverId)?.name ??
                        stint.driverId;

                      return (
                        <p key={stint.driverId}>
                          <Link
                            href={driverHref(stint.driverId, year)}
                            className={`font-semibold text-white/80 underline decoration-white/20 underline-offset-2 hover:text-red-300 ${focusRing}`}
                          >
                            {driverName}:
                          </Link>{" "}
                          Raced rounds {stint.startRound}
                          {stint.endRound !== stint.startRound ? `–${stint.endRound}` : ""} ·{" "}
                          {stint.weekends} GP {stint.weekends === 1 ? "weekend" : "weekends"}
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
