"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { DriverSearchHit } from "@/lib/driver/types";
import { distinctFullName } from "@/lib/search/name-query";

function SearchFieldSkeleton() {
  return (
    <div
      className="h-[3.25rem] rounded-2xl border border-white/15 bg-white/5"
      aria-hidden="true"
    />
  );
}

function DriverSearchField() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DriverSearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const fetchResults = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/drivers/search?q=${encodeURIComponent(trimmed)}`)
      .then((response) => response.json())
      .then((data: { drivers?: DriverSearchHit[] }) => {
        setResults(data.drivers ?? []);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const scheduleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchResults(value);
      }, 220);
    },
    [fetchResults],
  );

  const onChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    scheduleSearch(value);
  };

  const onSelect = (hit: DriverSearchHit) => {
    setOpen(false);
    setQuery(hit.name);
    router.push(driverHref(hit.id));
  };

  return (
    <div ref={wrapperRef} className="relative mt-8 max-w-xl">
      <label htmlFor="driver-search" className="sr-only">Search drivers</label>
      <input
        id="driver-search"
        type="search"
        value={query}
        placeholder="Search drivers by name…"
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
        aria-controls="driver-search-listbox"
        aria-autocomplete="list"
        role="combobox"
      />
      {open && (results.length > 0 || loading || query.trim().length >= 2) ? (
        <ul
          id="driver-search-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0d12] p-2 shadow-xl"
        >
          {loading ? (
            <li className="px-3 py-2 text-sm text-white/50">Searching…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-white/50">No drivers found.</li>
          ) : (
            results.map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm transition hover:bg-white/10"
                  onClick={() => onSelect(hit)}
                >
                  <DriverAvatar
                    photoUrl={hit.portraitUrl}
                    abbreviation={hit.abbreviation}
                    fullName={hit.name}
                    variant="thumb"
                    zoomable={false}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-white">{hit.name}</span>
                    {distinctFullName(hit.name, hit.fullName) ? (
                      <span className="mt-0.5 block truncate text-xs text-white/55">
                        {hit.fullName}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.12em] text-white/45">
                    {hit.nationality}
                    {hit.championshipWins > 0 ? ` · ${hit.championshipWins}× WDC` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

export function DriverSearch() {
  return (
    <Suspense fallback={<SearchFieldSkeleton />}>
      <DriverSearchField />
    </Suspense>
  );
}
