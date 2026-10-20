import {
  getPortraitMapForDriverIds,
  portraitUrlFromMap,
} from "@/lib/driver/driver-portrait-records";
import type { SeasonActivity, SeasonGrid } from "./types";

function collectDriverIdsFromActivity(activity: SeasonActivity): string[] {
  const ids = new Set<string>();
  for (const driver of activity.drivers) ids.add(driver.id);
  for (const driver of activity.testDrivers) ids.add(driver.id);
  for (const event of activity.events) {
    for (const change of event.changes) {
      for (const person of change.outgoing) ids.add(person.id);
      for (const person of change.incoming) ids.add(person.id);
    }
  }
  return [...ids];
}

export async function enrichSeasonGridPortraits(grid: SeasonGrid): Promise<SeasonGrid> {
  const ids = [
    ...new Set([
      ...grid.startingDrivers.map((driver) => driver.id),
      ...collectDriverIdsFromActivity(grid.activity),
    ]),
  ];
  const map = await getPortraitMapForDriverIds(ids);
  const season = grid.year;

  return {
    ...grid,
    startingDrivers: grid.startingDrivers.map((driver) => ({
      ...driver,
      portraitUrl: portraitUrlFromMap(map, driver.id, season),
    })),
    activity: {
      ...grid.activity,
      drivers: grid.activity.drivers.map((driver) => ({
        ...driver,
        portraitUrl: portraitUrlFromMap(map, driver.id, season),
      })),
      testDrivers: grid.activity.testDrivers.map((driver) => ({
        ...driver,
        portraitUrl: portraitUrlFromMap(map, driver.id, season),
      })),
      events: grid.activity.events.map((event) => ({
        ...event,
        changes: event.changes.map((change) => ({
          ...change,
          outgoing: change.outgoing.map((person) => ({
            ...person,
            portraitUrl: portraitUrlFromMap(map, person.id, season),
          })),
          incoming: change.incoming.map((person) => ({
            ...person,
            portraitUrl: portraitUrlFromMap(map, person.id, season),
          })),
        })),
      })),
    },
  };
}
