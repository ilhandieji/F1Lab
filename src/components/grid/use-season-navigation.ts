"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { adjacentSeasons, seasonHref } from "@/lib/grid/seasons";

export function useSeasonNavigation(year: number) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const { previous, next } = adjacentSeasons(year);

  const hrefFor = useCallback(
    (targetYear: number) => seasonHref(targetYear, query),
    [query],
  );

  const navigate = useCallback(
    (targetYear: number) => {
      if (targetYear === year) return;
      router.push(seasonHref(targetYear, query), { scroll: false });
    },
    [query, router, year],
  );

  useEffect(() => {
    for (const neighbor of [previous, next]) {
      if (neighbor) router.prefetch(seasonHref(neighbor, query));
    }
  }, [next, previous, query, router]);

  return {
    previous,
    next,
    hrefFor,
    navigate,
  };
}
