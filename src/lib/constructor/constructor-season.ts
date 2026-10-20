import { cacheLife } from "next/cache";
import { pointsToNumber } from "@/lib/decimal";
import {
  getPortraitMapForDriverIds,
  portraitUrlFromMap,
} from "@/lib/driver/driver-portrait-records";
import { getTeamLogo } from "@/lib/team-logos";
import { getConstructorSeasonRecords } from "./constructor-records";
import type { ConstructorSeasonView } from "./types";

function racePointsToNumber(points: unknown): number {
  if (points === null || points === undefined) return 0;
  return pointsToNumber(points);
}

function decimalToNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function isRetirement(positionText: string, reason: string | null): boolean {
  if (reason) return true;
  const normalized = positionText.toUpperCase();
  return normalized === "R" || normalized === "DNF" || normalized === "DNS" || normalized === "NC";
}

class ConstructorSeasonService {
  constructor(
    private readonly constructorId: string,
    private readonly year: number,
    private readonly constructorName: string,
  ) {}

  async assemble(): Promise<ConstructorSeasonView> {
    const records = await getConstructorSeasonRecords(this.constructorId, this.year);
    const logo = getTeamLogo(this.constructorId, this.year);
    const team = {
      id: this.constructorId,
      name: this.constructorName,
      logoPath: logo?.src ?? null,
      lightLogo: logo?.light ?? false,
    };

    const entrantRegistrations = records.entrantConstructors
      .filter((entry) => entry.entrant && entry.engineManufacturer)
      .map((entry) => ({
        entrantId: entry.entrant_id,
        entrantName: entry.entrant!.name,
        entrantCountry: entry.entrantCountry,
        engineManufacturerId: entry.engine_manufacturer_id,
        engineManufacturerName: entry.engineManufacturer!.name,
      }));

    const lineupDriverIds = records.entrantDrivers.map((entry) => entry.driver_id);
    const raceDriverIds = records.raceResults.map((result) => result.driver_id);
    const portraitMap = await getPortraitMapForDriverIds([
      ...new Set([...lineupDriverIds, ...raceDriverIds]),
    ]);

    const lineup = records.entrantDrivers
      .filter((entry) => entry.driver && entry.entrant && entry.engineManufacturer)
      .map((entry) => ({
        driverId: entry.driver_id,
        driverName: entry.driver!.full_name,
        portraitUrl: portraitUrlFromMap(portraitMap, entry.driver_id, this.year),
        entrantName: entry.entrant!.name,
        engineManufacturerName: entry.engineManufacturer!.name,
        rounds: entry.rounds,
        roundsText: entry.rounds_text,
        testDriver: entry.test_driver,
      }));

    const chassis = records.entrantChassis
      .filter((entry) => entry.chassis && entry.entrant && entry.engineManufacturer)
      .map((entry) => ({
        entrantName: entry.entrant!.name,
        chassisName: entry.chassis!.name,
        chassisFullName: entry.chassis!.full_name,
        engineManufacturerName: entry.engineManufacturer!.name,
      }));

    const engines = records.entrantEngines
      .filter((entry) => entry.engine && entry.entrant && entry.engineManufacturer)
      .map((entry) => ({
        entrantName: entry.entrant!.name,
        engineName: entry.engine!.name,
        engineFullName: entry.engine!.full_name,
        engineManufacturerName: entry.engineManufacturer!.name,
        capacity: decimalToNumber(entry.engine!.capacity),
        configuration: entry.engine!.configuration,
        aspiration: entry.engine!.aspiration,
      }));

    const tyres = records.entrantTyres
      .filter((entry) => entry.tyreManufacturer && entry.entrant && entry.engineManufacturer)
      .map((entry) => ({
        entrantName: entry.entrant!.name,
        tyreManufacturerName: entry.tyreManufacturer!.name,
        engineManufacturerName: entry.engineManufacturer!.name,
      }));

    const championshipProgression = records.raceStandings
      .filter((row) => row.race && row.engineManufacturer)
      .map((row) => ({
        round: row.race!.round,
        grandPrixName: row.race!.official_name,
        position: row.position_text,
        positionNumber: row.position_number,
        points: pointsToNumber(row.points),
        championshipWon: row.championship_won,
        engineManufacturerName: row.engineManufacturer!.name,
      }));

    const races = records.raceResults
      .filter(
        (result) =>
          result.race && result.driver && result.engineManufacturer && result.tyreManufacturer,
      )
      .map((result) => {
        const finishPosition = result.position_text;
        const retired = isRetirement(finishPosition, result.race_reason_retired);
        return {
          round: result.race!.round,
          grandPrixName: result.race!.official_name,
          driverId: result.driver_id,
          driverName: result.driver!.full_name,
          portraitUrl: portraitUrlFromMap(portraitMap, result.driver_id, this.year),
          gridPosition: result.race_grid_position_text,
          finishPosition,
          finishNumber: result.position_number,
          points: racePointsToNumber(result.race_points),
          pole: result.race_pole_position ?? false,
          fastestLap: result.race_fastest_lap ?? false,
          retired,
          retirementReason: result.race_reason_retired,
          tyreManufacturerName: result.tyreManufacturer!.name,
          engineManufacturerName: result.engineManufacturer!.name,
        };
      })
      .sort((a, b) => a.round - b.round);

    const seasonConstructor = records.seasonConstructor;
    const standing = records.standing;

    return {
      year: this.year,
      team,
      standing: standing
        ? {
            position: standing.position_text,
            positionNumber: standing.position_number,
            points: pointsToNumber(standing.points),
            championshipWon: standing.championship_won,
            engineManufacturerName: standing.engineManufacturer?.name ?? "—",
          }
        : null,
      totals: seasonConstructor
        ? {
            raceEntries: seasonConstructor.total_race_entries,
            raceStarts: seasonConstructor.total_race_starts,
            wins: seasonConstructor.total_race_wins,
            oneTwoFinishes: seasonConstructor.total_1_and_2_finishes,
            podiums: seasonConstructor.total_podiums,
            podiumRaces: seasonConstructor.total_podium_races,
            polePositions: seasonConstructor.total_pole_positions,
            fastestLaps: seasonConstructor.total_fastest_laps,
            points: pointsToNumber(seasonConstructor.total_points),
            sprintRaceStarts: seasonConstructor.total_sprint_race_starts,
            sprintRaceWins: seasonConstructor.total_sprint_race_wins,
            bestStartingGridPosition: seasonConstructor.best_starting_grid_position,
            bestRaceResult: seasonConstructor.best_race_result,
          }
        : null,
      entrantRegistrations,
      lineup,
      chassis,
      engines,
      tyres,
      championshipProgression,
      races,
    };
  }
}

export async function getConstructorSeasonView(
  constructorId: string,
  year: number,
  constructorName: string,
): Promise<ConstructorSeasonView> {
  "use cache";
  cacheLife("hours");
  return new ConstructorSeasonService(constructorId, year, constructorName).assemble();
}
