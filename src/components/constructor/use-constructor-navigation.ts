"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { adjacentConstructorYears, constructorHref } from "@/lib/constructor/routes";

export function useConstructorNavigation(
  constructorId: string,
  careerYears: number[],
  season: number,
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const { previous, next } = adjacentConstructorYears(careerYears, season);

  const hrefFor = useCallback(
    (targetSeason: number) =>
      constructorHref(
        constructorId,
        targetSeason,
        tab && tab !== "season" ? tab : undefined,
      ),
    [constructorId, tab],
  );

  const navigate = useCallback(
    (targetSeason: number) => {
      if (targetSeason === season) return;
      router.push(
        constructorHref(
          constructorId,
          targetSeason,
          tab && tab !== "season" ? tab : undefined,
        ),
        { scroll: false },
      );
    },
    [constructorId, router, season, tab],
  );

  useEffect(() => {
    for (const neighbor of [previous, next]) {
      if (neighbor) router.prefetch(constructorHref(constructorId, neighbor, tab ?? undefined));
    }
  }, [constructorId, next, previous, router, tab]);

  return { previous, next, hrefFor, navigate };
}
