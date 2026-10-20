import { prisma } from "@/lib/prisma";

const driverSelect = { id: true, first_name: true, last_name: true } as const;
const raceSelect = {
  id: true,
  round: true,
  official_name: true,
  grand_prix: { select: { short_name: true } },
} as const;

type DriverRecord = {
  id: string;
  first_name: string;
  last_name: string;
  nationalityAlpha3: string | null;
};

type ConstructorRecord = {
  id: string;
  name: string;
};

function requireRecord<T>(records: Map<string | number, T>, id: string | number, label: string): T {
  const record = records.get(id);
  if (!record) {
    throw new Error(`Season records reference a missing ${label}: ${id}`);
  }
  return record;
}

/** Loads and joins the compact set of Prisma records used by season builders. */
export async function getSeasonRecords(year: number) {
  const [
    driverStandings,
    constructorStandings,
    seasonConstructors,
    entrantDrivers,
    raceResults,
    sprintResults,
    races,
  ] = await Promise.all([
    prisma.season_driver_standing.findMany({
      where: { year },
      select: {
        driver_id: true,
        position_display_order: true,
        position_text: true,
        points: true,
      },
      orderBy: { position_display_order: "asc" },
    }),
    prisma.season_constructor_standing.findMany({
      where: { year },
      orderBy: { position_display_order: "asc" },
    }),
    prisma.season_constructor.findMany({
      where: { year },
    }),
    prisma.season_entrant_driver.findMany({
      where: { year },
    }),
    prisma.race_data.findMany({
      where: { type: "RACE_RESULT", race: { year } },
    }),
    prisma.race_data.findMany({
      where: { type: "SPRINT_RACE_RESULT", race: { year } },
    }),
    prisma.race.findMany({
      where: { year },
      select: raceSelect,
    }),
  ]);

  const constructorIds = [
    ...new Set([
      ...constructorStandings.map(({ constructor_id }) => constructor_id),
      ...seasonConstructors.map(({ constructor_id }) => constructor_id),
      ...entrantDrivers.map(({ constructor_id }) => constructor_id),
      ...raceResults.map(({ constructor_id }) => constructor_id),
      ...sprintResults.map(({ constructor_id }) => constructor_id),
    ]),
  ];
  const driverIds = [
    ...new Set([
      ...driverStandings.map(({ driver_id }) => driver_id),
      ...entrantDrivers.map(({ driver_id }) => driver_id),
      ...raceResults.map(({ driver_id }) => driver_id),
    ]),
  ];

  const [constructors, driverRows, nationalityRows] = await Promise.all([
    constructorIds.length
      ? prisma["constructor"].findMany({
          where: { id: { in: constructorIds } },
        })
      : Promise.resolve<ConstructorRecord[]>([]),
    driverIds.length
      ? prisma.driver.findMany({
          where: { id: { in: driverIds } },
          select: driverSelect,
        })
      : Promise.resolve<{ id: string; first_name: string; last_name: string }[]>([]),
    driverIds.length
      ? prisma.driver.findMany({
          where: { id: { in: driverIds } },
          select: { id: true, nationality_country_id: true },
        })
      : Promise.resolve<{ id: string; nationality_country_id: string }[]>([]),
  ]);

  const nationalityCountryIds = [
    ...new Set(nationalityRows.map((row) => row.nationality_country_id)),
  ];
  const nationalityCountries = nationalityCountryIds.length
    ? await prisma.country.findMany({
        where: { id: { in: nationalityCountryIds } },
      })
    : [];
  const alpha3ByCountryId = new Map(
    nationalityCountries.map((country) => [country.id, country.alpha3_code]),
  );
  const nationalityAlpha3ByDriverId = new Map(
    nationalityRows.map((row) => [
      row.id,
      alpha3ByCountryId.get(row.nationality_country_id) ?? null,
    ]),
  );

  const constructorById = new Map(constructors.map((constructor) => [constructor.id, constructor]));
  const driverById = new Map<string, DriverRecord>(
    driverRows.map((driver) => [
      driver.id,
      {
        ...driver,
        nationalityAlpha3: nationalityAlpha3ByDriverId.get(driver.id) ?? null,
      },
    ]),
  );
  const raceById = new Map(races.map((race) => [race.id, race]));

  return {
    driverStandings: driverStandings.map((standing) => ({
      ...standing,
      driver: requireRecord(driverById, standing.driver_id, "driver"),
    })),
    constructorStandings: constructorStandings.map((standing) => ({
      ...standing,
      constructor: requireRecord(constructorById, standing.constructor_id, "constructor"),
    })),
    seasonConstructors: seasonConstructors.map((entry) => ({
      ...entry,
      constructor: requireRecord(constructorById, entry.constructor_id, "constructor"),
    })),
    entrantDrivers: entrantDrivers.map((entry) => ({
      ...entry,
      constructor: requireRecord(constructorById, entry.constructor_id, "constructor"),
      driver: requireRecord(driverById, entry.driver_id, "driver"),
    })),
    raceResults: raceResults.map((result) => ({
      ...result,
      constructor: requireRecord(constructorById, result.constructor_id, "constructor"),
      driver: requireRecord(driverById, result.driver_id, "driver"),
      race: requireRecord(raceById, result.race_id, "race"),
    })),
    sprintResults: sprintResults.map((result) => ({
      ...result,
      constructor: requireRecord(constructorById, result.constructor_id, "constructor"),
    })),
  };
}

export type SeasonRecords = Awaited<ReturnType<typeof getSeasonRecords>>;
