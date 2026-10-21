"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { focusRing } from "./focus";

type CareerYearNavigationProps = {
  season: number;
  careerYears: number[];
  previous: number | null;
  next: number | null;
  hrefFor: (year: number) => string;
  navigate: (year: number) => void;
  listLabel: string;
};

export function CareerYearNavigation({
  season,
  careerYears,
  previous,
  next,
  hrefFor,
  navigate,
  listLabel,
}: CareerYearNavigationProps) {
  const t = useTranslations("Common");
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const yearsDescending = [...careerYears].reverse();

  useEffect(() => {
    if (!open) return;
    const pointerHandler = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", pointerHandler);
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("pointerdown", pointerHandler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1"
        aria-label={t("seasonNavigation")}
      >
        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${focusRing}`}
          aria-label={previous ? t("previousSeason", { year: previous }) : t("noEarlierSeason")}
          disabled={previous === null}
          onClick={() => previous !== null && navigate(previous)}
        >
          <ChevronLeft size={16} />
        </button>
        <span
          className="min-w-[4.5rem] text-center text-[12px] font-black uppercase tracking-[0.22em] text-white"
          aria-current="date"
        >
          {season}
        </span>
        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${focusRing}`}
          aria-label={next ? t("nextSeason", { year: next }) : t("noLaterSeason")}
          disabled={next === null}
          onClick={() => next !== null && navigate(next)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white ${focusRing}`}
          aria-label={t("jumpSeason")}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
        >
          <CalendarDays size={16} />
        </button>
        {open ? (
          <div
            className="absolute end-0 z-50 mt-2 max-h-64 w-48 overflow-y-auto rounded-xl border border-white/10 bg-[#0c0d12] p-2 shadow-xl"
            role="dialog"
            aria-label={listLabel}
          >
            <ul className="grid gap-0.5">
              {yearsDescending.map((year) => (
                <li key={year}>
                  <Link
                    href={hrefFor(year)}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10 ${focusRing} ${
                      year === season ? "bg-red-500/20 text-white" : "text-white/80"
                    }`}
                    aria-current={year === season ? "true" : undefined}
                    onClick={() => {
                      setOpen(false);
                      router.prefetch(hrefFor(year));
                    }}
                  >
                    {year}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
