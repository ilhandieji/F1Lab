"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageZoom } from "@/components/chrome/image-zoom";
import { focusRing } from "@/components/chrome/focus";

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
              <div
                className={`flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 transition ${
                  active
                    ? "border-red-500/50 bg-red-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {mark.logoPath ? (
                  <ImageZoom
                    src={mark.logoPath}
                    alt={`${mark.year} team logo`}
                    light={mark.lightLogo}
                    className="relative h-5 w-7"
                  >
                    <Image
                      src={mark.logoPath}
                      alt=""
                      fill
                      className={`object-contain ${mark.lightLogo ? "brightness-0 invert" : ""}`}
                    />
                  </ImageZoom>
                ) : (
                  <span className="h-5 w-7 rounded border border-dashed border-white/20" aria-hidden="true" />
                )}
                <Link
                  href={hrefFor(mark.year)}
                  className={`text-[10px] font-black uppercase tracking-[0.16em] ${focusRing}`}
                  aria-current={active ? "true" : undefined}
                >
                  {mark.year}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
