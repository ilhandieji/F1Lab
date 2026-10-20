import type { DriverProfile } from "@/lib/driver/types";
import { DriverPortrait } from "./driver-portrait";

function formatLifeDates(profile: DriverProfile): string {
  const born = profile.dateOfBirth;
  const died = profile.dateOfDeath;
  return died ? `Born ${born} · Died ${died}` : `Born ${born}`;
}

type DriverHeroProps = {
  profile: DriverProfile;
  season: number;
};

export function DriverHero({ profile, season }: DriverHeroProps) {
  const nationalities = profile.secondNationality
    ? `${profile.nationality} / ${profile.secondNationality}`
    : profile.nationality;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 p-5 md:p-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
          Driver
        </span>
        <h1 className="mt-1 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white md:text-5xl">
          {profile.fullName}
        </h1>
        <p className="mt-3 text-sm text-white/65">
          {nationalities} · {profile.placeOfBirth}, {profile.countryOfBirth}
        </p>
        <p className="mt-1 text-sm text-white/50">{formatLifeDates(profile)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.careerTotals.championshipWins > 0 ? (
            <span className="rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-300">
              {profile.careerTotals.championshipWins}× World Champion
            </span>
          ) : null}
          {profile.permanentNumber ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/80">
              #{profile.permanentNumber}
            </span>
          ) : null}
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
            Debut {profile.debutYear}
          </span>
        </div>
      </div>
      <DriverPortrait profile={profile} season={season} className="min-h-[12rem] md:min-h-[14rem]" />
      </div>
    </section>
  );
}
