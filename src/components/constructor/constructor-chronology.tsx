import Link from "next/link";
import { constructorHref } from "@/lib/constructor/routes";
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
        <h2 className="text-lg font-black tracking-[-0.04em] text-white">Constructor lineage</h2>
      </div>
      <ul className="grid gap-2">
        {links.map((link) => (
          <li key={`${link.otherConstructorId}-${link.yearFrom}`}>
            <Link
              href={constructorHref(link.otherConstructorId, link.yearFrom)}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-red-500/50 hover:bg-red-500/5"
            >
              <span className="font-semibold text-white">{link.otherConstructorName}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
                {formatYears(link.yearFrom, link.yearTo)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
