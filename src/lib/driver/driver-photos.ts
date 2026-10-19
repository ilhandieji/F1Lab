/**
 * Public driver portraits are stored by F1DB `driver.id`.
 * `objectKey` is the object-storage key, for example `drivers/max-verstappen/2026/portrait.webp`.
 * The public origin comes from `NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL`.
 */

export const DEFAULT_PORTRAIT_SEASON_KEY = "default";

export type DriverPortraitRecord = {
  seasonKey: string;
  objectKey: string;
};

/**
 * Exact season, then the default portrait. Never another year's portrait.
 * A null season skips the exact match and uses the default portrait.
 */
export function selectDriverPortraitObjectKey(
  portraits: readonly DriverPortraitRecord[],
  season: number | null,
): string | null {
  if (season !== null) {
    const exact = portraits.find((portrait) => portrait.seasonKey === String(season));
    if (exact) return exact.objectKey;
  }

  return (
    portraits.find((portrait) => portrait.seasonKey === DEFAULT_PORTRAIT_SEASON_KEY)?.objectKey ?? null
  );
}

export function driverPortraitUrl(objectKey: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL?.trim().replace(/\/+$/, "");
  const key = objectKey?.trim().replace(/^\/+/, "");
  if (!base || !key) return null;
  return `${base}/${key}`;
}
