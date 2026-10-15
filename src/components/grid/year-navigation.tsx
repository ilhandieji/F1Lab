"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { gridStyles } from "./styles";

const FIRST_SEASON = 1950;
const LAST_SEASON = 2026;

type YearNavigationProps = {
  year: number;
};

export default function YearNavigation({ year }: YearNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToYear = (nextYear: number) => {
    if (nextYear < FIRST_SEASON || nextYear > LAST_SEASON) return;

    const nextPath = pathname.replace(/\/\d{4}$/, `/${nextYear}`);
    if (nextPath === pathname) return;

    const query = searchParams.toString();
    router.push(query ? `${nextPath}?${query}` : nextPath, { scroll: false });
  };

  return (
    <nav className={gridStyles.yearNavigation} aria-label="Season navigation">
      <button
        className={gridStyles.yearButton}
        type="button"
        aria-label={`Previous season, ${year - 1}`}
        disabled={year <= FIRST_SEASON}
        onClick={() => navigateToYear(year - 1)}
      >
        <span aria-hidden="true">←</span>
      </button>
      <span className={gridStyles.yearLabel} aria-live="polite">
        {year}
      </span>
      <button
        className={gridStyles.yearButton}
        type="button"
        aria-label={`Next season, ${year + 1}`}
        disabled={year >= LAST_SEASON}
        onClick={() => navigateToYear(year + 1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
