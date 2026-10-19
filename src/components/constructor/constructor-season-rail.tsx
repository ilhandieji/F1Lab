"use client";

import Image from "next/image";
import Link from "next/link";

export type ConstructorSeasonMark = {
  year: number;
  logoPath: string | null;
  lightLogo: boolean;
};

type ConstructorSeasonRailProps = {
  season: number;
  marks: ConstructorSeasonMark[];
  hrefFor: (year: number) => string;
};

export function ConstructorSeasonRail({ season, marks, hrefFor }: ConstructorSeasonRailProps) {
  const yearsDescending = [...marks].sort((a, b) => b.year - a.year);

  return (
    <nav
      className="mt-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
      aria-label="Season timeline"
    >
      <ul className="flex min-w-min gap-2 pb-1">
        {yearsDescending.map((mark) => {
          const active = mark.year === season;
          return (
            <li key={mark.year}>
              <Link
                href={hrefFor(mark.year)}
                className={`flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 transition ${
                  active
                    ? "border-red-500/50 bg-red-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white"
                }`}
                aria-current={active ? "true" : undefined}
              >
                {mark.logoPath ? (
                  <span className="relative h-5 w-7">
                    <Image
                      src={mark.logoPath}
                      alt=""
                      fill
                      className={`object-contain ${mark.lightLogo ? "brightness-0 invert" : ""}`}
                    />
                  </span>
                ) : (
                  <span className="h-5 w-7 rounded border border-dashed border-white/20" aria-hidden="true" />
                )}
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">{mark.year}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
