import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CountryFlag } from "@/components/chrome/country-flag";
import { focusRing } from "@/components/chrome/focus";
import { constructorHref } from "@/lib/constructor/routes";
import { formatGroupedNumber } from "@/lib/format-number";
import type {
  ConstructorStanding,
  ConstructorStandingsEmptyCode,
  ConstructorStandingsNoteCode,
} from "@/lib/grid/types";
import { TeamLogo } from "./team-logo";

type ConstructorStandingsProps = {
  year: number;
  standings: ConstructorStanding[];
  note: ConstructorStandingsNoteCode | null;
  emptyMessage: ConstructorStandingsEmptyCode | null;
};

export function ConstructorStandings({
  year,
  standings,
  note,
  emptyMessage,
}: ConstructorStandingsProps) {
  const t = useTranslations("Grid");
  const common = useTranslations("Common");

  return (
    <section
      id="grid-constructors-panel"
      className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-3 shadow-lg shadow-black/10 md:p-5"
      role="tabpanel"
      aria-labelledby="grid-constructors-tab"
    >
      <div className="mb-4 flex items-end justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-red-400">{t("wcc")}</span>
          <h2 className="text-xl font-black tracking-[-0.04em] text-white md:text-2xl">
            {t("constructorsStandings")}
          </h2>
        </div>
        <p className="max-w-xl text-sm text-white/70">
          {t("teamPoints", { year })}
        </p>
      </div>

      {standings.length > 0 ? (
        <>
          <div
            className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/70 md:grid-cols-[2.75rem_minmax(0,1fr)_auto] md:px-3"
            aria-hidden="true"
          >
            <span>{common("pos")}</span>
            <span>{common("constructor")}</span>
            <span className="text-end">{common("points")}</span>
          </div>
          <ol className="grid gap-1.5" aria-label={t("standingsLabel", { year })}>
            {standings.map(({ team, position, points }) => (
              <li
                key={team.id}
                className="grid min-h-12 grid-cols-[2.25rem_auto_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-[linear-gradient(105deg,rgba(28,28,31,0.94),rgba(20,20,22,0.94)_75%)] transition hover:border-red-500/40 md:grid-cols-[2.75rem_auto_minmax(0,1fr)_auto]"
              >
                <strong dir="ltr" className="text-center text-sm font-black tabular-nums text-white">
                  {position}
                </strong>
                <TeamLogo team={team} size="compact" />
                <Link
                  href={constructorHref(team.id, year)}
                  className={`flex min-w-0 items-center gap-2 px-2 py-2 ${focusRing}`}
                >
                  <CountryFlag alpha2={team.countryAlpha2} name={team.countryName} />
                  <h3 lang="en" className="truncate text-base font-black uppercase tracking-[-0.04em] text-white">
                    {team.name}
                  </h3>
                </Link>
                <Link
                  href={constructorHref(team.id, year)}
                  className={`flex items-baseline gap-1 pe-3 ${focusRing}`}
                >
                  <strong dir="ltr" className="text-lg font-black tabular-nums tracking-[-0.04em] text-white">
                    {formatGroupedNumber(points, 2)}
                  </strong>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/65">{common("pts")}</span>
                </Link>
              </li>
            ))}
          </ol>
          {note ? <p className="mt-3 text-xs leading-6 text-white/65">{t(`notes.${note}`)}</p> : null}
        </>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/70">
          {t(`empty.${emptyMessage ?? "unavailable"}`, { year })}
        </p>
      )}
    </section>
  );
}
