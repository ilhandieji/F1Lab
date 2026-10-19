import { cacheLife } from "next/cache";
import { ConstructorStandingsBuilder } from "./constructor-standings";
import { enrichSeasonGridPortraits } from "./enrich-season-portraits";
import { OpeningGridBuilder } from "./opening-grid";
import { SeasonActivityBuilder } from "./season-activity";
import { getSeasonRecords } from "./season-records";
import { TeamCatalog } from "./team-catalog";
import type { SeasonGrid } from "./types";

class SeasonGridService {
  constructor(private readonly year: number) {}

  async assemble(): Promise<SeasonGrid> {
    const records = await getSeasonRecords(this.year);
    const teams = new TeamCatalog(this.year, records);
    const openingGrid = new OpeningGridBuilder(records, teams);
    const openingTeamByDriver = openingGrid.openingTeamByDriver();
    const startingDrivers = openingGrid.build(openingTeamByDriver);
    const constructors = new ConstructorStandingsBuilder(this.year, records, teams).build();
    const activity = new SeasonActivityBuilder(records, teams).build(openingTeamByDriver);

    const grid: SeasonGrid = {
      year: this.year,
      startingDrivers,
      highestPoints: Math.max(...startingDrivers.map((driver) => driver.points), 1),
      ...constructors,
      activity,
    };
    return enrichSeasonGridPortraits(grid);
  }
}

/** Cached view-model used by the grid page and neighboring-season prefetches. */
export async function getSeasonGrid(year: number): Promise<SeasonGrid> {
  "use cache";
  cacheLife("hours");
  return new SeasonGridService(year).assemble();
}
