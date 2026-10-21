type RaceGrandPrixFields = {
  official_name: string;
  grand_prix?: { short_name: string } | null;
};

type RaceCircuitFields = {
  countryAlpha2: string | null;
  countryName: string | null;
};

/** Country of the circuit that hosted the race. */
export function circuitCountry(race: RaceCircuitFields): {
  alpha2: string | null;
  name: string | null;
} {
  return {
    alpha2: race.countryAlpha2,
    name: race.countryName,
  };
}

/** Prefer F1DB short_name (e.g. Australian Grand Prix) over sponsor-heavy official_name. */
export function grandPrixDisplayName(race: RaceGrandPrixFields): string {
  const short = race.grand_prix?.short_name?.trim();
  if (short) return short;
  return stripSponsorOfficialName(race.official_name);
}

function stripSponsorOfficialName(official: string): string {
  let name = official.trim();
  name = name.replace(/^Formula\s+1\s+/i, "");
  name = name.replace(/\s+\d{4}$/, "");
  const grandPrix = name.match(/(.+Grand Prix)\s*$/i);
  if (grandPrix) return grandPrix[1]!.trim();
  return name;
}
