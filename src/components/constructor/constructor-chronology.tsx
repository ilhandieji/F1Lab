import Link from "next/link";
import { TeamLogo } from "@/components/grid/team-logo";
import { constructorHref } from "@/lib/constructor/routes";
import { getTeamLogo } from "@/lib/team-logos";
import type { ConstructorChronologyLink } from "@/lib/constructor/types";

type ConstructorChronologyProps = {
  links: ConstructorChronologyLink[];
};

function formatYears(from: number, to: number | null): string {
  return to === null || to === from ? String(from) : `${from}–${to}`;
}

export function ConstructorChronology({ links }: ConstructorChronologyProps) {
  if (links.length === 0) return null;

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5">
      <div className="mb-4 border-b border-white/10 pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Heritage</span>
        <h2 className="text-lg font-black tracking-[-0.04em] text-white">Previous names</h2>
        <p className="mt-1 text-sm text-white/65">Earlier constructor identities in the archive.</p>
      </div>
      <ul className="grid gap-2">
        {links.map((link) => {
          const logo = getTeamLogo(link.otherConstructorId, link.yearFrom);
          const team = {
            id: link.otherConstructorId,
            name: link.otherConstructorName,
            logoPath: logo?.src ?? null,
            lightLogo: logo?.light ?? false,
          };
          return (
            <li key={`${link.otherConstructorId}-${link.yearFrom}`}>
              <Link
                href={constructorHref(link.otherConstructorId, link.yearFrom)}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-red-500/50 hover:bg-red-500/5"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <TeamLogo team={team} size="compact" />
                  <span className="truncate font-semibold text-white">{link.otherConstructorName}</span>
                </span>
                <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
                  {formatYears(link.yearFrom, link.yearTo)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
