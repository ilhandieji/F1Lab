import { cacheLife } from "next/cache";
import { pointsToNumber } from "@/lib/decimal";
import { circuitCountry, grandPrixDisplayName } from "@/lib/race/grand-prix-display";
import { TeamCatalog } from "@/lib/grid/team-catalog";
import { getSeasonRecords } from "@/lib/grid/season-records";
import { getDriverSeasonRecords } from "./driver-records";
import type { DriverRaceResult, DriverSeasonView, DriverSprintResult, DriverTeamStint } from "./types";

function racePointsToNumber(points: unknown): number {
  if (points === null || points === undefined) return 0;
  return pointsToNumber(points);
}

function isRetirement(positionText: string, reason: string | null): boolean {
  if (reason) return true;
  const normalized = positionText.toUpperCase();
  return normalized === "R" || normalized === "DNF" || normalized === "DNS" || normalized === "NC";
}

class DriverSeasonService {
  constructor(
    private readonly driverId: string,
    private readonly year: number,
  ) {}

  async assemble(): Promise<DriverSeasonView> {
    const records = await getDriverSeasonRecords(this.driverId, this.year);
    const seasonRecords = await getSeasonRecords(this.year);
    const teams = new TeamCatalog(this.year, seasonRecords);

    const teamStints: DriverTeamStint[] = records.entrantDrivers
      .filter((entry) => entry.constructor)
      .map((entry) => ({
        team: teams.register(entry.constructor!),
        rounds: entry.rounds,
        roundsText: entry.rounds_text,
        testDriver: entry.test_driver,
      }));

    const races: DriverRaceResult[] = records.raceResults
      .filter((result) => result.race && result.constructor)
      .map((result) => {
        const finishPosition = result.position_text;
        const retired = isRetirement(finishPosition, result.race_reason_retired);
        const country = circuitCountry(result.race!);
        return {
          round: result.race!.round,
          grandPrixName: grandPrixDisplayName(result.race!),
          countryAlpha2: country.alpha2,
          countryName: country.name,
          team: teams.register(result.constructor!),
          gridPosition: result.race_grid_position_text,
          finishPosition,
          finishNumber: result.position_number,
          points: racePointsToNumber(result.race_points),
          pole: result.race_pole_position ?? false,
          fastestLap: result.race_fastest_lap ?? false,
          retired,
          retirementReason: result.race_reason_retired,
          driverOfTheDay: result.race_driver_of_the_day ?? false,
        };
      })
      .sort((a, b) => a.round - b.round);

    const sprints: DriverSprintResult[] = records.sprintResults
      .filter((result) => result.race && result.constructor)
      .map((result) => {
        const country = circuitCountry(result.race!);
        return {
          round: result.race!.round,
          grandPrixName: grandPrixDisplayName(result.race!),
          countryAlpha2: country.alpha2,
          countryName: country.name,
          team: teams.register(result.constructor!),
          finishPosition: result.position_text,
          points: racePointsToNumber(result.race_points),
        };
      })
      .sort((a, b) => a.round - b.round);

    const seasonDriver = records.seasonDriver;
    const standing = records.standing;

    return {
      year: this.year,
      standing: standing
        ? {
            position: standing.position_text,
            positionNumber: standing.position_number,
            points: pointsToNumber(standing.points),
            championshipWon: standing.championship_won,
          }
        : null,
      totals: seasonDriver
        ? {
            raceEntries: seasonDriver.total_race_entries,
            raceStarts: seasonDriver.total_race_starts,
            wins: seasonDriver.total_race_wins,
            podiums: seasonDriver.total_podiums,
            polePositions: seasonDriver.total_pole_positions,
            fastestLaps: seasonDriver.total_fastest_laps,
            points: pointsToNumber(seasonDriver.total_points),
            grandSlams: seasonDriver.total_grand_slams,
            sprintRaceWins: seasonDriver.total_sprint_race_wins,
            driverOfTheDay: seasonDriver.total_driver_of_the_day,
          }
        : null,
      teams: teamStints,
      races,
      sprints,
    };
  }
}

export async function getDriverSeasonView(driverId: string, year: number): Promise<DriverSeasonView> {
  "use cache";
  cacheLife("hours");
  return new DriverSeasonService(driverId, year).assemble();
}
