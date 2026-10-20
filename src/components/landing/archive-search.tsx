"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { constructorHref } from "@/lib/constructor/routes";
import type { ConstructorSearchHit } from "@/lib/constructor/types";
import { driverHref } from "@/lib/driver/routes";
import type { DriverSearchHit } from "@/lib/driver/types";
import { DriverSearchMark, TeamSearchMark } from "./archive-search-hit-mark";

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

function ArchiveSearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialUrlQuery);
  const [results, setResults] = useState<ArchiveHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      })
      .catch(() => setResults([]))
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

  return (
    <div ref={wrapperRef} className="relative mt-8 max-w-xl">
      <label htmlFor="archive-search" className="sr-only">
        Search drivers and teams
      </label>
      <input
        id="archive-search"
        type="search"
        value={query}
        placeholder="Search drivers or teams…"
        autoComplete="off"
        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-red-500/40 transition focus:border-red-500/50 focus:ring-2"
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
        role="combobox"
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
                  <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                    Drivers
                  </p>
                  <ul>
                    {driverResults.map((entry) => (
                      <li key={`driver-${entry.hit.id}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={false}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition hover:bg-white/10"
                          onClick={() => onSelect(entry)}
                        >
                          <DriverSearchMark fullName={entry.hit.fullName} />
                          <span className="min-w-0 flex-1 truncate font-semibold text-white">
                            {entry.hit.fullName}
                          </span>
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-red-300/80">
                            Driver
                            {entry.hit.championshipWins > 0
                              ? ` · ${entry.hit.championshipWins}× WDC`
                              : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {teamResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/40">
                    Teams
                  </p>
                  <ul>
                    {teamResults.map((entry) => (
                      <li key={`team-${entry.hit.id}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={false}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition hover:bg-white/10"
                          onClick={() => onSelect(entry)}
                        >
                          <TeamSearchMark teamId={entry.hit.id} />
                          <span className="min-w-0 flex-1 truncate font-semibold text-white">
                            {entry.hit.name}
                          </span>
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                            Team
                            {entry.hit.championshipWins > 0
                              ? ` · ${entry.hit.championshipWins}× WCC`
                              : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
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
      <ArchiveSearchField />
    </Suspense>
  );
}
