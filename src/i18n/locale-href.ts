export const locales = ["en", "fa"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isAppLocale(value: string): value is AppLocale {
  return locales.some((locale) => locale === value);
}

/**
 * Map an in-app path to the equivalent URL in another locale.
 * English stays unprefixed. Persian uses `/fa`. Query and hash are copied through.
 * A missing path falls back to that locale's home.
 */
export function localeHref(
  locale: AppLocale,
  pathname: string,
  search = "",
  hash = "",
): string {
  const raw = pathname.trim();
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  const stripped = withSlash.replace(/^\/fa(?=\/|$)/, "") || "/";
  const path = stripped === "" ? "/" : stripped;
  const prefixed = locale === "en" ? path : path === "/" ? "/fa" : `/fa${path}`;
  const query = search.startsWith("?") ? search.slice(1) : search;
  const hashPart = hash === "" ? "" : hash.startsWith("#") ? hash : `#${hash}`;
  return `${prefixed}${query ? `?${query}` : ""}${hashPart}`;
}
