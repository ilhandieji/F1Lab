import { DriverPortrait } from "@/components/driver/driver-portrait";
import { CountryFlag, NationalityFlags } from "@/components/chrome/country-flag";
import { TeamLogo } from "@/components/grid/team-logo";
import type { ConstructorProfile } from "@/lib/constructor/types";
import type { DriverProfile } from "@/lib/driver/types";
import { getTeamLogo } from "@/lib/team-logos";

export function DriverProfileFocusBar({
  profile,
  season,
}: {
  profile: DriverProfile;
  season: number;
}) {
  return (
    <section
      className="mb-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-3 md:p-4"
      aria-label={profile.fullName}
    >
      <DriverPortrait profile={profile} season={season} className="h-20 w-20 shrink-0 md:h-24 md:w-24" />
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Results</p>
        <h1 className="flex min-w-0 items-center gap-2 text-xl font-black uppercase tracking-[-0.04em] text-white md:text-2xl">
          <NationalityFlags
            primaryAlpha2={profile.nationalityAlpha2}
            primaryName={profile.nationality}
            secondAlpha2={profile.secondNationalityAlpha2}
            secondName={profile.secondNationality}
          />
          <span className="truncate">{profile.fullName}</span>
        </h1>
        <p className="text-sm text-white/65">{season} season</p>
      </div>
    </section>
  );
}

export function ConstructorProfileFocusBar({
  profile,
  season,
}: {
  profile: ConstructorProfile;
  season: number;
}) {
  const logo = getTeamLogo(profile.id, season);
  const team = {
    id: profile.id,
    name: profile.name,
    logoPath: logo?.src ?? null,
    lightLogo: logo?.light ?? false,
  };

  return (
    <section
      className="mb-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-3 md:p-4"
      aria-label={profile.name}
    >
      <div className="flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 md:px-4">
        <TeamLogo team={team} size="hero" className="!h-16 !w-[4.5rem] md:!h-20 md:!w-28" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Results</p>
        <h1 className="flex min-w-0 items-center gap-2 text-xl font-black uppercase tracking-[-0.04em] text-white md:text-2xl">
          <CountryFlag alpha2={profile.countryAlpha2} name={profile.country} />
          <span className="truncate">{profile.name}</span>
        </h1>
        <p className="text-sm text-white/65">{season} season</p>
      </div>
    </section>
  );
}
