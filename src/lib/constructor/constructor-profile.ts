import { cacheLife } from "next/cache";
import { pointsToNumber } from "@/lib/decimal";
import { getConstructorProfileRecords } from "./constructor-records";
import type { ConstructorProfile } from "./types";

class ConstructorProfileService {
  constructor(private readonly constructorId: string) {}

  async assemble(): Promise<ConstructorProfile | null> {
    const bundle = await getConstructorProfileRecords(this.constructorId);
    if (!bundle) return null;

    const { record, countryName, countryAlpha2, seasonYears, chronology } = bundle;
    const careerYears = seasonYears.map((entry) => entry.year);
    const debutYear = careerYears[0] ?? new Date().getFullYear();
    const defaultSeason = careerYears[careerYears.length - 1] ?? debutYear;

    return {
      id: record.id,
      name: record.name,
      fullName: record.full_name,
      country: countryName,
      countryAlpha2,
      careerTotals: {
        championshipWins: record.total_championship_wins,
        raceWins: record.total_race_wins,
        oneTwoFinishes: record.total_1_and_2_finishes,
        podiums: record.total_podiums,
        podiumRaces: record.total_podium_races,
        polePositions: record.total_pole_positions,
        fastestLaps: record.total_fastest_laps,
        careerPoints: pointsToNumber(record.total_points),
        championshipPoints: pointsToNumber(record.total_championship_points),
        raceEntries: record.total_race_entries,
        raceStarts: record.total_race_starts,
        raceLaps: record.total_race_laps,
        bestChampionshipPosition: record.best_championship_position,
        bestRaceResult: record.best_race_result,
        sprintRaceWins: record.total_sprint_race_wins,
      },
      careerYears,
      debutYear,
      defaultSeason,
      chronology: chronology
        .filter((link) => link.otherConstructor)
        .map((link) => ({
          otherConstructorId: link.other_constructor_id,
          otherConstructorName: link.otherConstructor!.name,
          otherConstructorCountryAlpha2: link.otherConstructor!.countryAlpha2,
          otherConstructorCountryName: link.otherConstructor!.countryName,
          yearFrom: link.year_from,
          yearTo: link.year_to,
        })),
    };
  }
}

export async function getConstructorProfile(
  constructorId: string,
): Promise<ConstructorProfile | null> {
  "use cache";
  cacheLife("hours");
  return new ConstructorProfileService(constructorId).assemble();
}
