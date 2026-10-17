export const FIRST_SEASON = 1950;
export const LAST_SEASON = 2026;
export const FEATURED_SEASON = 2026;

const YEAR_SLUG = /^\d{4}$/;

export function parseSeasonYear(slug: string): number | null {
  if (!YEAR_SLUG.test(slug)) return null;
  const year = Number(slug);
  if (year < FIRST_SEASON || year > LAST_SEASON) return null;
  return year;
}

export function allSeasonsDescending(): number[] {
  return Array.from(
    { length: LAST_SEASON - FIRST_SEASON + 1 },
    (_, index) => LAST_SEASON - index,
  );
}

export function adjacentSeasons(year: number) {
  return {
    previous: year > FIRST_SEASON ? year - 1 : null,
    next: year < LAST_SEASON ? year + 1 : null,
  };
}

export function seasonHref(year: number, query = "") {
  return query ? `/grid/${year}?${query}` : `/grid/${year}`;
}
