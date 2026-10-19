import Image from "next/image";
import { TeamLogo } from "@/components/grid/team-logo";
import { getTeamLogo } from "@/lib/team-logos";
import type { ConstructorProfile } from "@/lib/constructor/types";

type ConstructorHeroProps = {
  profile: ConstructorProfile;
  season: number;
};

export function ConstructorHero({ profile, season }: ConstructorHeroProps) {
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
            className={`object-contain object-right-top ${team.lightLogo ? "brightness-0 invert" : ""}`}
          />
        </div>
      ) : null}
      <div className="relative grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/30 p-4 md:min-h-[8rem] md:min-w-[9rem]">
          <TeamLogo team={team} />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
            Team
          </span>
          <h1 className="mt-1 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-sm text-white/60">{profile.fullName}</p>
          <p className="mt-1 text-sm text-white/50">
            {profile.country} · Active {profile.debutYear}–{profile.careerYears.at(-1) ?? profile.debutYear}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.careerTotals.championshipWins > 0 ? (
              <span className="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
                {profile.careerTotals.championshipWins}× Constructors&apos; Champion
              </span>
            ) : null}
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
              Debut {profile.debutYear}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
