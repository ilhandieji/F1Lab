"use client";

import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ConstructorYearNavigationProps = {
  season: number;
  careerYears: number[];
  previous: number | null;
  next: number | null;
  hrefFor: (year: number) => string;
  navigate: (year: number) => void;
};

export function ConstructorYearNavigation({
  season,
  careerYears,
  previous,
  next,
  hrefFor,
  navigate,
}: ConstructorYearNavigationProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

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

  const yearsDescending = [...careerYears].reverse();

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1"
        aria-label="Season navigation"
      >
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={previous ? `Previous season: ${previous}` : "No earlier season"}
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-transparent text-white/80 transition hover:border-white/10 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/80 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
          aria-label="Jump to any season"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <CalendarDays size={16} />
        </button>
        {open ? (
          <div
            className="absolute right-0 z-50 mt-2 max-h-64 w-48 overflow-y-auto rounded-xl border border-white/10 bg-[#0c0d12] p-2 shadow-xl"
            role="listbox"
            aria-label="Active seasons"
          >
            {yearsDescending.map((year) => (
              <Link
                key={year}
                href={hrefFor(year)}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10 ${
                  year === season ? "bg-red-500/20 text-white" : "text-white/80"
                }`}
                role="option"
                aria-selected={year === season}
                onClick={() => {
                  setOpen(false);
                  router.prefetch(hrefFor(year));
                }}
              >
                {year}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
