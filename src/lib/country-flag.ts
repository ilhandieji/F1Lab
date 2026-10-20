/**
 * Public country flags live in object storage as `flags/{alpha2}.svg`.
 * The origin is the same public base used for driver portraits.
 */

export function countryFlagUrl(alpha2: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_DRIVER_IMAGE_BASE_URL?.trim().replace(/\/+$/, "");
  const code = alpha2?.trim().toLowerCase();
  if (!base || !code || !/^[a-z]{2}$/.test(code)) return null;
  return `${base}/flags/${code}.svg`;
}
