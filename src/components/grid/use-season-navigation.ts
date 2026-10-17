"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { adjacentSeasons } from "@/lib/grid/seasons";

export function useSeasonNavigation(year: number) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const { previous, next } = adjacentSeasons(year);
  const hrefFor = useCallback(
    (targetYear: number) => {
      const path = pathname.replace(/\/\d{4}$/, `/${targetYear}`);
      return query ? `${path}?${query}` : path;
    },
    [pathname, query],
  );

  const navigate = useCallback(
    (targetYear: number) => {
      if (targetYear === year) return;
      router.push(hrefFor(targetYear), { scroll: false });
    },
    [hrefFor, router, year],
  );

  useEffect(() => {
    for (const neighbor of [previous, next]) {
      if (neighbor) router.prefetch(hrefFor(neighbor));
    }
  }, [hrefFor, next, previous, router]);

  return {
    previous,
    next,
    hrefFor,
    navigate,
  };
}
