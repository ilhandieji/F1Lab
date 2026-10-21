import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as localeParam } from "next/root-params";
import { routing } from "./routing";

declare module "next/root-params" {
  export function locale(): Promise<string>;
}

export default getRequestConfig(async ({ locale }) => {
  let resolved = locale;
  if (!resolved) {
    const value = await localeParam();
    resolved = hasLocale(routing.locales, value) ? value : routing.defaultLocale;
  } else if (!hasLocale(routing.locales, resolved)) {
    resolved = routing.defaultLocale;
  }

  const messages = {
    en: (await import("../../messages/en.json")).default,
    fa: (await import("../../messages/fa.json")).default,
  }[resolved];

  return { locale: resolved, messages };
});
