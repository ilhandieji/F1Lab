import type { DriverProfile } from "./types";

export function driverHref(id: string, season?: number, tab?: string) {
  const params = new URLSearchParams();
  if (season !== undefined) params.set("season", String(season));
  if (tab) params.set("tab", tab);
  const query = params.toString();
  return query ? `/driver/${id}?${query}` : `/driver/${id}`;
}

export function parseDriverSeasonParam(
  value: string | string[] | null | undefined,
): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d{4}$/.test(raw)) return null;
  const year = Number(raw);
  return Number.isFinite(year) ? year : null;
}

export function resolveDriverSeason(profile: DriverProfile, seasonParam: number | null): number {
  if (seasonParam !== null && profile.careerYears.includes(seasonParam)) {
    return seasonParam;
  }
  return profile.defaultSeason;
}

export function adjacentCareerYears(careerYears: number[], year: number) {
  const index = careerYears.indexOf(year);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? careerYears[index - 1]! : null,
    next: index < careerYears.length - 1 ? careerYears[index + 1]! : null,
  };
}
