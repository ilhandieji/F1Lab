"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import { localeHref, type AppLocale } from "@/i18n/locale-href";
import { usePathname } from "@/i18n/navigation";
import { focusRing } from "./focus";

const options: { locale: AppLocale; label: string; name: string }[] = [
  { locale: "en", label: "EN", name: "English" },
  { locale: "fa", label: "فا", name: "فارسی" },
];

export function LocaleSwitcher() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const path = pathname || "/";

  const onClick = (target: AppLocale) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    const hash = window.location.hash;
    if (!hash) return;
    event.preventDefault();
    window.location.assign(localeHref(target, path, search, hash));
  };

  return (
    <nav aria-label={t("language")} className="flex shrink-0 items-center gap-0.5">
      {options.map((option, index) => {
        const active = locale === option.locale;
        const className = `rounded-md px-1.5 py-1 text-[11px] font-black tracking-[0.12em] ${focusRing} ${
          active ? "text-red-300" : "text-white/55 hover:text-white"
        }`;
        return (
          <span key={option.locale} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="px-0.5 text-[11px] text-white/25">
                |
              </span>
            ) : null}
            {active ? (
              <span lang={option.locale} aria-current="true" aria-label={option.name} className={className}>
                {option.label}
              </span>
            ) : (
              <a
                href={localeHref(option.locale, path, search)}
                hrefLang={option.locale}
                lang={option.locale}
                aria-label={option.name}
                onClick={onClick(option.locale)}
                className={className}
              >
                {option.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
