import type { ActivityChangeKind, ActivityEvent } from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

const changeLabel: Record<ActivityChangeKind, string> = {
  transfer: "Team transfer",
  return: "Returned to seat",
  substitution: "Substitute",
  "lineup-change": "Lineup change",
};

const changeColor: Record<ActivityChangeKind, string> = {
  transfer: "text-amber-300",
  return: "text-emerald-300",
  substitution: "text-red-300",
  "lineup-change": "",
};

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/60">
        This season kept a settled race lineup — no seat changes are recorded between Grands Prix.
      </p>
    );
  }

  return (
    <ol
      className="ml-2 grid list-none gap-5 border-l border-white/15 py-1 pl-4 md:ml-4 md:pl-6"
      aria-label="Chronological driver changes"
    >
      {events.map((event) => (
        <li className="relative min-w-0" key={event.round}>
          <span
            className="absolute -left-[1.45rem] top-0 grid h-5 w-5 place-items-center rounded-full border border-red-400/40 bg-[#190e10] text-[8px] font-black text-red-300 md:-left-[1.95rem]"
            aria-hidden="true"
          >
            R{event.round}
          </span>
          <div className="mb-2 flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
            <h3 className="text-sm font-extrabold text-white/90">{event.name}</h3>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
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
                  <h4 className="min-w-0 flex-1 truncate text-xs font-bold text-white/85">{change.team.name}</h4>
                  <span className={`shrink-0 text-[8px] font-black uppercase tracking-[0.1em] text-white/50 ${changeColor[change.kind]}`}>
                    {changeLabel[change.kind]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] items-center gap-2">
                  <div className="grid min-w-0 gap-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white/35">Out</span>
                    <strong className="break-words text-[11px] leading-5 text-white/80">
                      {change.outgoing.map((driver) => driver.name).join(" / ") ||
                        "No prior race seat"}
                    </strong>
                  </div>
                  <span className="text-xs font-black text-red-400" aria-hidden="true">
                    →
                  </span>
                  <div className="grid min-w-0 gap-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.12em] text-white/35">In</span>
                    <strong className="break-words text-[11px] leading-5 text-white/80">
                      {change.incoming.map((driver) => driver.name).join(" / ") || "Seat vacant"}
                    </strong>
                  </div>
                </div>
                {change.incoming.length > 0 ? (
                  <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-white/45">
                    Raced rounds {change.stint.startRound}
                    {change.stint.endRound !== change.stint.startRound
                      ? `–${change.stint.endRound}`
                      : ""}{" "}
                    · {change.stint.weekends} GP{" "}
                    {change.stint.weekends === 1 ? "weekend" : "weekends"}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
