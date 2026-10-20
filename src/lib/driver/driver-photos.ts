/**
 * Manual driver portraits: add `public/assets/drivers/{driverId}.webp` or `.jpg`
 * where `{driverId}` matches the F1DB `driver.id` slug (e.g. `max-verstappen`).
 */

const WEBP = "/assets/drivers";
const JPG = "/assets/drivers";

export function driverPhotoCandidates(driverId: string): string[] {
  return [`${WEBP}/${driverId}.webp`, `${JPG}/${driverId}.jpg`];
}

/** Primary path for UI; browser falls back via onError when the file is missing. */
export function driverPhotoUrl(driverId: string): string {
  return `${WEBP}/${driverId}.webp`;
}
