"use client";

import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { focusRing } from "@/components/chrome/focus";
import { allSeasonsDescending, FIRST_SEASON, LAST_SEASON } from "@/lib/grid/seasons";

type YearNavigationProps = {
  year: number;
  previous: number | null;
  next: number | null;
  hrefFor: (year: number) => string;
  navigate: (year: number) => void;
};

export function YearNavigation({ year, previous, next, hrefFor, navigate }: YearNavigationProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const pointerHandler = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
    <div className="flex items-center gap-2 self-end md:self-auto">
      <div
        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1"
        aria-label="Season navigation"
      >
        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${focusRing}`}
          aria-label={previous ? `Previous season: ${previous}` : "No earlier season"}
          disabled={previous === null}
          onClick={() => previous !== null && navigate(previous)}
        >
          <ChevronLeft size={16} />
        </button>

        <span className="min-w-[4.5rem] text-center text-[12px] font-black uppercase tracking-[0.22em] text-white" aria-current="date">
          {year}
        </span>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${focusRing}`}
          aria-label={next ? `Next season: ${next}` : "No later season"}
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
          aria-label="Jump to any season"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
        >
          <CalendarDays size={16} />
        </button>

        {open ? (
          <div
            className="absolute end-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#111417]/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-md"
            role="dialog"
            aria-label="Choose a Formula 1 season"
          >
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Every season, {FIRST_SEASON}–{LAST_SEASON}
            </p>
            <div className="grid max-h-64 grid-cols-6 gap-1.5 overflow-y-auto pe-1">
              {allSeasonsDescending().map((candidate) => (
                <Link
                  key={candidate}
                  href={hrefFor(candidate)}
                  prefetch
                  onMouseEnter={() => router.prefetch(hrefFor(candidate))}
                  onFocus={() => router.prefetch(hrefFor(candidate))}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-2 py-2 text-center text-[11px] font-bold text-white/70 transition hover:bg-red-500 hover:text-white ${focusRing} ${candidate === year ? "bg-red-500 text-white" : ""}`}
                >
                  {candidate}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
