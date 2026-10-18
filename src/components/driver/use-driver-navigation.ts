"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adjacentCareerYears, driverHref } from "@/lib/driver/routes";

export function useDriverNavigation(
  driverId: string,
  careerYears: number[],
  season: number,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { previous, next } = adjacentCareerYears(careerYears, season);

  const hrefFor = useCallback(
    (targetSeason: number) => driverHref(driverId, targetSeason, tab && tab !== "season" ? tab : undefined),
    [driverId, tab],
  );

  const navigate = useCallback(
    (targetSeason: number) => {
      if (targetSeason === season) return;
      router.push(
        driverHref(driverId, targetSeason, tab && tab !== "season" ? tab : undefined),
        { scroll: false },
      );
    },
    [driverId, router, season, tab],
  );

  useEffect(() => {
    for (const neighbor of [previous, next]) {
      if (neighbor) router.prefetch(driverHref(driverId, neighbor, tab ?? undefined));
    }
  }, [driverId, next, previous, router, tab]);

  return { previous, next, hrefFor, navigate };
}
