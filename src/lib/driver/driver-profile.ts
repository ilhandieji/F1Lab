import { cacheLife } from "next/cache";
import { pointsToNumber } from "@/lib/decimal";
import { getPortraitMapForDriverIds } from "./driver-portrait-records";
import { getDriverProfileRecords } from "./driver-records";
import type { DriverProfile } from "./types";

function formatDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

class DriverProfileService {
  constructor(private readonly driverId: string) {}

  async assemble(): Promise<DriverProfile | null> {
    const record = await getDriverProfileRecords(this.driverId);
    if (!record) return null;

    const careerYears = record.season_driver.map((entry) => entry.year);
    const debutYear = careerYears[0] ?? new Date(record.date_of_birth).getFullYear();
    const defaultSeason = careerYears[careerYears.length - 1] ?? debutYear;
    const familyLinks =
      record.driver_family_relationship_driver_family_relationship_driver_idTodriver;
    const familyPortraitMap = await getPortraitMapForDriverIds(
      familyLinks.map((link) => link.other_driver_id),
    );

    return {
      id: record.id,
      fullName: record.full_name,
      firstName: record.first_name,
      lastName: record.last_name,
      abbreviation: record.abbreviation,
      permanentNumber: record.permanent_number,
      dateOfBirth: formatDate(record.date_of_birth),
      dateOfDeath: record.date_of_death ? formatDate(record.date_of_death) : null,
      placeOfBirth: record.place_of_birth,
      countryOfBirth: record.country_driver_country_of_birth_country_idTocountry.name,
      nationality: record.country_driver_nationality_country_idTocountry.name,
      nationalityAlpha2: record.country_driver_nationality_country_idTocountry.alpha2_code,
      secondNationality: record.country_driver_second_nationality_country_idTocountry?.name ?? null,
      secondNationalityAlpha2:
        record.country_driver_second_nationality_country_idTocountry?.alpha2_code ?? null,
      careerTotals: {
        championshipWins: record.total_championship_wins,
        raceWins: record.total_race_wins,
        podiums: record.total_podiums,
        polePositions: record.total_pole_positions,
        fastestLaps: record.total_fastest_laps,
        careerPoints: pointsToNumber(record.total_points),
        grandSlams: record.total_grand_slams,
        raceEntries: record.total_race_entries,
        raceStarts: record.total_race_starts,
        bestChampionshipPosition: record.best_championship_position,
        driverOfTheDay: record.total_driver_of_the_day,
      },
      careerYears,
      debutYear,
      defaultSeason,
      family: familyLinks.map((link) => ({
        type: link.type,
        otherDriverId: link.other_driver_id,
        otherDriverName: link.driver_driver_family_relationship_other_driver_idTodriver.full_name,
        otherDriverAbbreviation:
          link.driver_driver_family_relationship_other_driver_idTodriver.abbreviation,
        nationalityAlpha2:
          link.driver_driver_family_relationship_other_driver_idTodriver
            .country_driver_nationality_country_idTocountry?.alpha2_code ?? null,
        nationalityName:
          link.driver_driver_family_relationship_other_driver_idTodriver
            .country_driver_nationality_country_idTocountry?.name ?? null,
        portraits: (familyPortraitMap.get(link.other_driver_id) ?? []).map((portrait) => ({
          seasonKey: portrait.seasonKey,
          objectKey: portrait.objectKey,
        })),
      })),
      portraits: record.driver_portrait.map((portrait) => ({
        seasonKey: portrait.season_key,
        objectKey: portrait.object_key,
      })),
    };
  }
}

export async function getDriverProfile(driverId: string): Promise<DriverProfile | null> {
  "use cache";
  cacheLife("hours");
  return new DriverProfileService(driverId).assemble();
}
