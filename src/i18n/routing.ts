import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locale-href";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
