import { pointsToNumber } from "@/lib/decimal";
import type { SeasonRecords } from "./season-records";
import type { TeamCatalog } from "./team-catalog";
import type { GridDriver } from "./types";

export class OpeningGridBuilder {
  constructor(
    private readonly records: SeasonRecords,
    private readonly teams: TeamCatalog,
  ) {}

  openingTeamByDriver(): Map<string, string> {
    const raceResults = this.sortedRaceResults();
    const openingRound = [
      ...new Set(raceResults.map((result) => result.race.round)),
    ].sort((left, right) => left - right)[0];
    if (openingRound === undefined) return new Map();

    const declared = new Map<string, Set<string>>();
    const raced = new Map<string, Set<string>>();

    for (const entry of this.records.entrantDrivers) {
      const openedRound = entry.rounds
        ?.split(";")
        .some((round) => Number(round) === openingRound);
      if (entry.test_driver || !openedRound) continue;
      const teams = declared.get(entry.driver_id) ?? new Set<string>();
      teams.add(entry.constructor_id);
      declared.set(entry.driver_id, teams);
    }

    for (const result of raceResults) {
      if (result.race.round !== openingRound) continue;
      const teams = raced.get(result.driver_id) ?? new Set<string>();
      teams.add(result.constructor_id);
      raced.set(result.driver_id, teams);
    }

    const openingTeams = new Map<string, string>();
    for (const [driverId, teams] of declared) {
      const candidates = [...teams].sort();
      const matching = candidates.filter((team) =>
        raced.get(driverId)?.has(team),
      );
      const team =
        matching.length === 1
          ? matching[0]
          : candidates.length === 1
            ? candidates[0]
            : undefined;
      if (team) openingTeams.set(driverId, team);
    }
    return openingTeams;
  }

  build(openingTeamByDriver: Map<string, string>): GridDriver[] {
    const seen = new Set<string>();
    const drivers: GridDriver[] = [];

    for (const standing of this.records.driverStandings) {
      const team = this.teams.get(
        openingTeamByDriver.get(standing.driver.id) ?? "",
      );
      if (!team || seen.has(standing.driver.id)) continue;

      seen.add(standing.driver.id);
      drivers.push({
        id: standing.driver.id,
        firstName: standing.driver.first_name,
        lastName: standing.driver.last_name,
        position: String(drivers.length + 1),
        points: pointsToNumber(standing.points),
        team,
        nationalityAlpha2: standing.driver.nationalityAlpha2,
        nationalityName: standing.driver.nationalityName,
      });
    }

    return drivers;
  }

  private sortedRaceResults() {
    return [...this.records.raceResults].sort(
      (left, right) =>
        left.race.round - right.race.round ||
        left.position_display_order - right.position_display_order ||
        left.driver_id.localeCompare(right.driver_id),
    );
  }
}
