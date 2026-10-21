import { useTranslations } from "next-intl";
import Image from "next/image";
import { CountryFlag } from "@/components/chrome/country-flag";
import { TeamLogo } from "@/components/grid/team-logo";
import { getTeamLogo } from "@/lib/team-logos";
import type { ConstructorProfile } from "@/lib/constructor/types";

type ConstructorHeroProps = {
  profile: ConstructorProfile;
  season: number;
};

export function ConstructorHero({ profile, season }: ConstructorHeroProps) {
  const t = useTranslations("Common");
  const teamText = useTranslations("Constructor");
  const logo = getTeamLogo(profile.id, season);
  const team = {
    id: profile.id,
    name: profile.name,
    logoPath: logo?.src ?? null,
    lightLogo: logo?.light ?? false,
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-5 md:p-8">
      {team.logoPath ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-6 -top-6 h-40 w-52 opacity-[0.12] md:h-56 md:w-72 md:opacity-[0.16]"
        >
          <Image
            src={team.logoPath}
            alt=""
            fill
            className={`object-contain object-right-top rtl:object-left-top ${team.lightLogo ? "brightness-0 invert" : ""}`}
          />
        </div>
      ) : null}
      <div className="relative grid gap-5 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:items-stretch md:gap-8">
        <div className="flex min-h-[6.5rem] items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3 md:min-h-[10rem] md:px-5 md:py-4">
          <TeamLogo team={team} size="hero" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            {teamText("kicker")}
          </span>
          <h1 lang="en" className="mt-1 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-5xl">
            {profile.name}
          </h1>
          <p lang="en" className="mt-2 text-sm text-white/60">{profile.fullName}</p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <CountryFlag alpha2={profile.countryAlpha2} name={profile.country} labelled={false} />
            <span>
              <span lang="en">{profile.country}</span> · {t("active", {
                from: profile.debutYear,
                to: profile.careerYears.at(-1) ?? profile.debutYear,
              })}
            </span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.careerTotals.championshipWins > 0 ? (
              <span className="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
                {t("constructorsChampion", { count: profile.careerTotals.championshipWins })}
              </span>
            ) : null}
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
              {t("debut", { year: profile.debutYear })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
