import type { ConstructorProfile } from "./types";

export function constructorHref(id: string, season?: number, tab?: string) {
  const params = new URLSearchParams();
  if (season !== undefined) params.set("season", String(season));
  if (tab) params.set("tab", tab);
  const query = params.toString();
  return query ? `/constructor/${id}?${query}` : `/constructor/${id}`;
}

export function parseConstructorSeasonParam(
  value: string | string[] | null | undefined,
): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d{4}$/.test(raw)) return null;
  const year = Number(raw);
  return Number.isFinite(year) ? year : null;
}

export function resolveConstructorSeason(
  profile: ConstructorProfile,
  seasonParam: number | null,
): number {
  if (seasonParam !== null && profile.careerYears.includes(seasonParam)) {
    return seasonParam;
  }
  return profile.defaultSeason;
}

export function adjacentConstructorYears(careerYears: number[], year: number) {
  const index = careerYears.indexOf(year);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? careerYears[index - 1]! : null,
    next: index < careerYears.length - 1 ? careerYears[index + 1]! : null,
  };
}
