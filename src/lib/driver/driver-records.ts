import { prisma } from "@/lib/prisma";

export async function getDriverProfileRecords(driverId: string) {
  return prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      country_driver_country_of_birth_country_idTocountry: true,
      country_driver_nationality_country_idTocountry: true,
      country_driver_second_nationality_country_idTocountry: true,
      driver_family_relationship_driver_family_relationship_driver_idTodriver: {
        orderBy: { position_display_order: "asc" },
        include: {
          driver_driver_family_relationship_other_driver_idTodriver: {
            select: { id: true, full_name: true, abbreviation: true },
          },
        },
      },
      season_driver: {
        orderBy: { year: "asc" },
        select: { year: true },
      },
      driver_portrait: {
        select: { season_key: true, object_key: true },
      },
    },
  });
}

export async function getDriverSeasonRecords(driverId: string, year: number) {
  const [seasonDriver, standing, entrantDrivers, raceResults, sprintResults, races] = await Promise.all([
    prisma.season_driver.findUnique({
      where: { year_driver_id: { year, driver_id: driverId } },
    }),
    prisma.season_driver_standing.findFirst({
      where: { year, driver_id: driverId },
      select: {
        position_text: true,
        position_number: true,
        points: true,
        championship_won: true,
      },
    }),
    prisma.season_entrant_driver.findMany({
      where: { year, driver_id: driverId },
    }),
    prisma.race_data.findMany({
      where: { driver_id: driverId, type: "RACE_RESULT", race: { year } },
    }),
    prisma.race_data.findMany({
      where: { driver_id: driverId, type: "SPRINT_RACE_RESULT", race: { year } },
    }),
    prisma.race.findMany({
      where: { year },
      select: {
        id: true,
        round: true,
        official_name: true,
        grand_prix: { select: { short_name: true } },
      },
      orderBy: { round: "asc" },
    }),
  ]);

  const constructorIds = [
    ...new Set([
      ...entrantDrivers.map((entry) => entry.constructor_id),
      ...raceResults.map((result) => result.constructor_id),
      ...sprintResults.map((result) => result.constructor_id),
    ]),
  ];

  const constructors = constructorIds.length
    ? await prisma["constructor"].findMany({
        where: { id: { in: constructorIds } },
      })
    : [];

  const constructorById = new Map(constructors.map((entry) => [entry.id, entry]));
  const raceById = new Map(races.map((race) => [race.id, race]));

  return {
    seasonDriver,
    standing,
    entrantDrivers: entrantDrivers.map((entry) => ({
      ...entry,
      constructor: constructorById.get(entry.constructor_id) ?? null,
    })),
    raceResults: raceResults.map((result) => ({
      ...result,
      constructor: constructorById.get(result.constructor_id) ?? null,
      race: raceById.get(result.race_id) ?? null,
    })),
    sprintResults: sprintResults.map((result) => ({
      ...result,
      constructor: constructorById.get(result.constructor_id) ?? null,
      race: raceById.get(result.race_id) ?? null,
    })),
  };
}

export type DriverSeasonRecords = Awaited<ReturnType<typeof getDriverSeasonRecords>>;
