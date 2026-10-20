"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { constructorHref } from "@/lib/constructor/routes";
import type { ConstructorSearchHit } from "@/lib/constructor/types";
import { driverHref } from "@/lib/driver/routes";
import type { DriverSearchHit } from "@/lib/driver/types";
import { DriverSearchMark, TeamSearchMark } from "./archive-search-hit-mark";
import { focusRing } from "@/components/chrome/focus";

type ArchiveHit =
  | { kind: "driver"; hit: DriverSearchHit }
  | { kind: "constructor"; hit: ConstructorSearchHit };

function SearchFieldSkeleton() {
  return (
    <div
      className="mt-8 h-[3.25rem] max-w-xl rounded-2xl border border-white/15 bg-white/5"
      aria-hidden="true"
    />
  );
}

type ArchiveSearchFieldProps = {
  variant?: "hero" | "nav";
  inputId?: string;
};

export function ArchiveSearchField({
  variant = "hero",
  inputId = "archive-search",
}: ArchiveSearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialUrlQuery);
  const [results, setResults] = useState<ArchiveHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const driverResults = useMemo(
    () => results.filter((entry): entry is Extract<ArchiveHit, { kind: "driver" }> => entry.kind === "driver"),
    [results],
  );
  const teamResults = useMemo(
    () =>
      results.filter(
        (entry): entry is Extract<ArchiveHit, { kind: "constructor" }> => entry.kind === "constructor",
      ),
    [results],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const syncUrl = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      const queryString = params.toString();
      router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  const fetchResults = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch(`/api/drivers/search?q=${encodeURIComponent(trimmed)}`).then((response) => response.json()),
      fetch(`/api/constructors/search?q=${encodeURIComponent(trimmed)}`).then((response) =>
        response.json(),
      ),
    ])
      .then(([driversPayload, constructorsPayload]) => {
        const drivers = (driversPayload.drivers ?? []) as DriverSearchHit[];
        const constructors = (constructorsPayload.constructors ?? []) as ConstructorSearchHit[];
        const merged: ArchiveHit[] = [
          ...drivers.map((hit) => ({ kind: "driver" as const, hit })),
          ...constructors.map((hit) => ({ kind: "constructor" as const, hit })),
        ];
        setResults(merged);
        setActiveIndex(merged.length > 0 ? 0 : -1);
      })
      .catch(() => {
        setResults([]);
        setActiveIndex(-1);
      })
      .finally(() => setLoading(false));
  }, []);

  const scheduleSearch = useCallback(
    (value: string, sync: boolean) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchResults(value);
        if (sync) syncUrl(value);
      }, 220);
    },
    [fetchResults, syncUrl],
  );

  const onChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    scheduleSearch(value, true);
  };

  const onSelect = (entry: ArchiveHit) => {
    setOpen(false);
    if (entry.kind === "driver") {
      setQuery(entry.hit.fullName);
      router.push(driverHref(entry.hit.id));
      return;
    }
    setQuery(entry.hit.name);
    router.push(constructorHref(entry.hit.id));
  };

  const optionId = (index: number) => `archive-search-option-${index}`;

  const moveActive = (index: number) => {
    if (results.length === 0) return;
    const next = (index + results.length) % results.length;
    setActiveIndex(next);
    requestAnimationFrame(() => {
      document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" });
    });
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      moveActive(activeIndex < 0 ? 0 : activeIndex + 1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      moveActive(activeIndex < 0 ? results.length - 1 : activeIndex - 1);
      return;
    }
    if ((event.key === "Home" || event.key === "End") && open && results.length > 0) {
      event.preventDefault();
      moveActive(event.key === "Home" ? 0 : results.length - 1);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Enter" && open && results[activeIndex]) {
      event.preventDefault();
      onSelect(results[activeIndex]);
    }
  };

  const renderOption = (entry: ArchiveHit) => {
    const index = results.indexOf(entry);
    const selected = index === activeIndex;
    return (
      <li key={`${entry.kind}-${entry.hit.id}`}>
        <button
          id={optionId(index)}
          type="button"
          role="option"
          aria-selected={selected}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition hover:bg-white/10 ${focusRing} ${
            selected ? "bg-white/10" : ""
          }`}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => onSelect(entry)}
        >
          {entry.kind === "driver" ? (
            <DriverSearchMark
              fullName={entry.hit.fullName}
              abbreviation={entry.hit.abbreviation}
              portraitUrl={entry.hit.portraitUrl}
            />
          ) : (
            <TeamSearchMark teamId={entry.hit.id} />
          )}
          <span className="min-w-0 flex-1 truncate font-semibold text-white">
            {entry.kind === "driver" ? entry.hit.fullName : entry.hit.name}
          </span>
          <span
            className={`shrink-0 text-xs font-bold uppercase tracking-[0.12em] ${
              entry.kind === "driver" ? "text-red-300" : "text-white/75"
            }`}
          >
            {entry.kind === "driver" ? "Driver" : "Team"}
            {entry.hit.championshipWins > 0
              ? ` · ${entry.hit.championshipWins}× ${entry.kind === "driver" ? "WDC" : "WCC"}`
              : ""}
          </span>
        </button>
      </li>
    );
  };

  const isNav = variant === "nav";

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${isNav ? "z-50 max-w-none" : "mt-8 max-w-xl"}`}
    >
      <label htmlFor={inputId} className="sr-only">
        Search drivers and teams
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={isNav ? "Search drivers or teams…" : "Find a driver or team…"}
        autoComplete="off"
        className={`w-full border border-white/15 bg-white/5 text-white placeholder:text-white/40 outline-none ring-red-500/40 transition focus:border-red-500/50 focus:ring-2 ${
          isNav
            ? "rounded-xl px-3 py-2 text-sm"
            : "rounded-2xl px-4 py-3 text-sm"
        }`}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => onChange(event.currentTarget.value)}
        onFocus={() => {
          setOpen(true);
          if (query.trim().length >= 2 && results.length === 0 && !loading) {
            fetchResults(query);
          }
        }}
        aria-expanded={open}
        aria-controls="archive-search-listbox"
        aria-autocomplete="list"
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        role="combobox"
        onKeyDown={onInputKeyDown}
      />
      {open && (results.length > 0 || loading || query.trim().length >= 2) ? (
        <div
          id="archive-search-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0d12] p-2 shadow-xl"
        >
          {loading ? (
            <p className="px-3 py-2 text-sm text-white/50">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-white/50">No matches found.</p>
          ) : (
            <>
              {driverResults.length > 0 ? (
                <div className="mb-2">
                  <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    Drivers
                  </p>
                  <ul>{driverResults.map((entry) => renderOption(entry))}</ul>
                </div>
              ) : null}
              {teamResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    Teams
                  </p>
                  <ul>{teamResults.map((entry) => renderOption(entry))}</ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function ArchiveSearch() {
  return (
    <Suspense fallback={<SearchFieldSkeleton />}>
      <ArchiveSearchField variant="hero" />
    </Suspense>
  );
}
