import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CountryFlag } from "@/components/chrome/country-flag";
import { focusRing } from "@/components/chrome/focus";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { GridDriver } from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

type DriverGridProps = {
  year: number;
  drivers: GridDriver[];
};

export function DriverGrid({ year, drivers }: DriverGridProps) {
  const t = useTranslations("Grid");
  const common = useTranslations("Common");

  return (
    <section
      id="grid-drivers-panel"
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-drivers-tab"
    >
      <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400">{t("wdc")}</span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            {t("driversStandings")}
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          {t("pointsOrder")}
        </p>
      </div>

      {drivers.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-1 px-1 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:gap-x-2 md:px-3"
            aria-hidden="true"
          >
            <span>{common("pos")}</span>
            <span>{common("driver")}</span>
            <span className="text-end">{common("pts")}</span>
          </div>
          <ol className="grid gap-2" aria-label={t("driverGrid", { year })}>
            {drivers.map((driver) => (
              <li
                key={driver.id}
                className="grid min-h-[4.25rem] grid-cols-[2.25rem_minmax(0,1fr)_auto] items-stretch rounded-xl border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] py-1 transition hover:border-red-500/40 md:min-h-12 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:items-center md:py-0"
              >
                <strong dir="ltr" className="flex items-center justify-center text-sm font-black tabular-nums text-white">
                  {driver.position}
                </strong>
                <div className="flex min-w-0 items-center gap-2.5 px-2 py-2">
                  <DriverAvatar
                    photoUrl={driver.portraitUrl}
                    fullName={`${driver.firstName} ${driver.lastName}`}
                    variant="row"
                  />
                  <TeamLogo team={driver.team} size="compact" />
                  <Link href={driverHref(driver.id, year)} className={`min-w-0 flex-1 ${focusRing}`}>
                    <h3 lang="en" className="text-base font-black uppercase leading-tight tracking-[-0.04em] text-white line-clamp-2 md:truncate md:line-clamp-none">
                      {driver.lastName}
                    </h3>
                    <p className="mt-0.5 text-xs leading-snug text-white/70 line-clamp-2 md:truncate md:line-clamp-none">
                      {driver.firstName} · {driver.team.name}
                    </p>
                  </Link>
                </div>
                <Link
                  href={driverHref(driver.id, year)}
                  className={`flex flex-col items-end justify-center gap-1 pe-3 text-end ${focusRing}`}
                >
                  <CountryFlag alpha2={driver.nationalityAlpha2} name={driver.nationalityName} />
                  <span className="flex items-baseline gap-1">
                    <strong dir="ltr" className="text-lg font-black tabular-nums tracking-[-0.04em] text-white">
                      {driver.points}
                    </strong>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-white/65">{common("pts")}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
          {t("noStandings", { year })}
        </p>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/65">
        <span>{t("driversStandings")}</span>
        <span dir="ltr">{t("driverCount", { count: drivers.length })}</span>
        <span>{year}</span>
      </footer>
    </section>
  );
}
