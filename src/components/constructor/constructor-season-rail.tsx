"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
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
  navigate: (year: number) => void;
};

export function ConstructorSeasonRail({ season, marks, hrefFor, navigate }: ConstructorSeasonRailProps) {
  const t = useTranslations("Constructor");
  const common = useTranslations("Common");
  const yearsDescending = [...marks].sort((a, b) => b.year - a.year);
  const navRef = useRef<HTMLElement>(null);
  const scrollLeftRef = useRef(0);

  const captureScroll = () => {
    const nav = navRef.current;
    if (nav) scrollLeftRef.current = nav.scrollLeft;
  };

  const restoreScroll = () => {
    const nav = navRef.current;
    if (!nav) return;
    const left = scrollLeftRef.current;
    nav.scrollLeft = left;
    requestAnimationFrame(() => {
      nav.scrollLeft = left;
    });
  };

  useLayoutEffect(() => {
    restoreScroll();
  }, [season]);

  const onYearClick = (event: MouseEvent<HTMLAnchorElement>, year: number) => {
    captureScroll();
    if (year === season) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    navigate(year);
  };

  return (
    <nav
      ref={navRef}
      className="mt-6 -mx-4 overflow-x-auto px-4 [overflow-anchor:none] md:mx-0 md:px-0"
      dir="ltr"
      aria-label={t("timeline")}
      onScroll={captureScroll}
    >
      <ul className="flex min-w-min gap-2 pb-1">
        {yearsDescending.map((mark) => {
          const active = mark.year === season;
          return (
            <li key={mark.year}>
              <Link
                href={hrefFor(mark.year)}
                scroll={false}
                aria-current={active ? "true" : undefined}
                aria-label={common("seasonLabel", { year: mark.year })}
                onClick={(event) => onYearClick(event, mark.year)}
                className={`flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 no-underline transition ${focusRing} ${
                  active
                    ? "border-red-500/50 bg-red-500/15 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {mark.logoPath ? (
                  <span className="relative block h-5 w-7 shrink-0" aria-hidden="true">
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
