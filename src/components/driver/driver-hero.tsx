import { useTranslations } from "next-intl";
import type { DriverProfile } from "@/lib/driver/types";
import { NationalityFlags } from "@/components/chrome/country-flag";
import { distinctFullName } from "@/lib/search/name-query";
import { DriverPortrait } from "./driver-portrait";

function formatLifeDates(
  profile: DriverProfile,
  bornLabel: (values: { date: string }) => string,
  bornDiedLabel: (values: { born: string; died: string }) => string,
): string {
  const born = profile.dateOfBirth;
  const died = profile.dateOfDeath;
  return died ? bornDiedLabel({ born, died }) : bornLabel({ date: born });
}

function formatNationalities(profile: DriverProfile): string {
  return profile.secondNationality
    ? `${profile.nationality} / ${profile.secondNationality}`
    : profile.nationality;
}

type DriverHeroProps = {
  profile: DriverProfile;
  season: number;
};

export function DriverHero({ profile, season }: DriverHeroProps) {
  const t = useTranslations("Common");
  const driverText = useTranslations("Driver");
  const legalName = distinctFullName(profile.name, profile.fullName);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-5 md:p-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            {driverText("kicker")}
          </span>
          <h1 lang="en" className="mt-1 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-5xl">
            {profile.name}
          </h1>
          {legalName ? (
            <p lang="en" className="mt-2 text-sm font-medium leading-snug text-white/55">{legalName}</p>
          ) : null}
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <NationalityFlags
              primaryAlpha2={profile.nationalityAlpha2}
              primaryName={profile.nationality}
              secondAlpha2={profile.secondNationalityAlpha2}
              secondName={profile.secondNationality}
              labelled={false}
            />
            <span lang="en">{formatNationalities(profile)}</span>
          </p>
          <p lang="en" className="mt-1 text-sm text-white/65">
            {profile.placeOfBirth}, {profile.countryOfBirth}
          </p>
          <p className="mt-1 text-sm text-white/50">
            {formatLifeDates(profile, (values) => t("born", values), (values) => t("bornDied", values))}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.careerTotals.championshipWins > 0 ? (
              <span className="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
                {t("worldChampion", { count: profile.careerTotals.championshipWins })}
              </span>
            ) : null}
            {profile.permanentNumber ? (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
                #{profile.permanentNumber}
              </span>
            ) : null}
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
              {t("debut", { year: profile.debutYear })}
            </span>
          </div>
        </div>
        <DriverPortrait profile={profile} season={season} className="min-h-[12rem] md:min-h-[14rem]" />
      </div>
    </section>
  );
}
