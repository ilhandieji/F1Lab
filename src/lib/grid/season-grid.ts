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

    return {
      year: this.year,
      startingDrivers,
      highestPoints: Math.max(...startingDrivers.map((driver) => driver.points), 1),
      ...constructors,
      activity,
    };
  }
}

/** Cached season records and standings. Portrait URLs are applied afterward so new `driver_portrait` rows show up without waiting for this cache to expire. */
export async function getSeasonGridData(year: number): Promise<SeasonGrid> {
  "use cache";
  cacheLife("hours");
  return new SeasonGridService(year).assemble();
}

/** Grid page view-model: standings from cache, portraits always from the database. */
export async function getSeasonGrid(year: number): Promise<SeasonGrid> {
  return enrichSeasonGridPortraits(await getSeasonGridData(year));
}
