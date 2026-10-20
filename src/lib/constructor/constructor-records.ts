import { prisma } from "@/lib/prisma";

export async function getConstructorProfileRecords(constructorId: string) {
  const record = await prisma["constructor"].findUnique({
    where: { id: constructorId },
  });
  if (!record) return null;

  const [country, seasonYears, chronologyLinks] = await Promise.all([
    prisma.country.findUnique({
      where: { id: record.country_id },
    }),
    prisma.season_constructor.findMany({
      where: { constructor_id: constructorId },
      orderBy: { year: "asc" },
    }),
    prisma.constructor_chronology.findMany({
      where: { constructor_id: constructorId },
      orderBy: { position_display_order: "asc" },
    }),
  ]);

  const otherConstructorIds = [
    ...new Set(chronologyLinks.map((link) => link.other_constructor_id)),
  ];
  const otherConstructors = otherConstructorIds.length
    ? await prisma["constructor"].findMany({
        where: { id: { in: otherConstructorIds } },
      })
    : [];
  const otherConstructorById = new Map(otherConstructors.map((entry) => [entry.id, entry]));

  return {
    record,
    countryName: country?.name ?? "—",
    seasonYears: seasonYears.map((entry) => ({ year: entry.year })),
    chronology: chronologyLinks.map((link) => ({
      ...link,
      otherConstructor: otherConstructorById.get(link.other_constructor_id) ?? null,
    })),
  };
}

export async function getConstructorSeasonRecords(constructorId: string, year: number) {
  const [
    seasonConstructor,
    standingRows,
    entrantConstructors,
    entrantDrivers,
    entrantChassis,
    entrantEngines,
    entrantTyres,
    raceStandings,
    raceResults,
    races,
    seasonEntrants,
  ] = await Promise.all([
    prisma.season_constructor.findUnique({
      where: { year_constructor_id: { year, constructor_id: constructorId } },
    }),
    prisma.season_constructor_standing.findMany({
      where: { year, constructor_id: constructorId },
      orderBy: { position_display_order: "asc" },
      take: 1,
    }),
    prisma.season_entrant_constructor.findMany({
      where: { year, constructor_id: constructorId },
    }),
    prisma.season_entrant_driver.findMany({
      where: { year, constructor_id: constructorId },
    }),
    prisma.season_entrant_chassis.findMany({
      where: { year, constructor_id: constructorId },
    }),
    prisma.season_entrant_engine.findMany({
      where: { year, constructor_id: constructorId },
    }),
    prisma.season_entrant_tyre_manufacturer.findMany({
      where: { year, constructor_id: constructorId },
    }),
    prisma.race_constructor_standing.findMany({
      where: { constructor_id: constructorId, race: { year } },
    }),
    prisma.race_data.findMany({
      where: { constructor_id: constructorId, type: "RACE_RESULT", race: { year } },
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
    prisma.season_entrant.findMany({
      where: { year },
      select: { entrant_id: true, country_id: true },
    }),
  ]);

  const standing = standingRows[0] ?? null;

  const entrantIds = [
    ...new Set([
      ...entrantConstructors.map((entry) => entry.entrant_id),
      ...entrantDrivers.map((entry) => entry.entrant_id),
      ...entrantChassis.map((entry) => entry.entrant_id),
      ...entrantEngines.map((entry) => entry.entrant_id),
      ...entrantTyres.map((entry) => entry.entrant_id),
    ]),
  ];
  const driverIds = [
    ...new Set([
      ...entrantDrivers.map((entry) => entry.driver_id),
      ...raceResults.map((entry) => entry.driver_id),
    ]),
  ];
  const chassisIds = [...new Set(entrantChassis.map((entry) => entry.chassis_id))];
  const engineIds = [...new Set(entrantEngines.map((entry) => entry.engine_id))];
  const engineManufacturerIds = [
    ...new Set([
      ...entrantConstructors.map((entry) => entry.engine_manufacturer_id),
      ...entrantDrivers.map((entry) => entry.engine_manufacturer_id),
      ...entrantChassis.map((entry) => entry.engine_manufacturer_id),
      ...entrantEngines.map((entry) => entry.engine_manufacturer_id),
      ...entrantTyres.map((entry) => entry.engine_manufacturer_id),
      ...raceStandings.map((entry) => entry.engine_manufacturer_id),
      ...raceResults.map((entry) => entry.engine_manufacturer_id),
      ...(standing ? [standing.engine_manufacturer_id] : []),
    ]),
  ];
  const tyreManufacturerIds = [
    ...new Set([
      ...entrantTyres.map((entry) => entry.tyre_manufacturer_id),
      ...raceResults.map((entry) => entry.tyre_manufacturer_id),
    ]),
  ];
  const countryIds = [...new Set(seasonEntrants.map((entry) => entry.country_id))];

  const [entrants, drivers, chassisList, engines, engineManufacturers, tyreManufacturers, countries] =
    await Promise.all([
      entrantIds.length
        ? prisma.entrant.findMany({
            where: { id: { in: entrantIds } },
          })
        : [],
      driverIds.length
        ? prisma.driver.findMany({
            where: { id: { in: driverIds } },
          })
        : [],
      chassisIds.length
        ? prisma.chassis.findMany({
            where: { id: { in: chassisIds } },
          })
        : [],
      engineIds.length
        ? prisma.engine.findMany({
            where: { id: { in: engineIds } },
          })
        : [],
      engineManufacturerIds.length
        ? prisma.engine_manufacturer.findMany({
            where: { id: { in: engineManufacturerIds } },
          })
        : [],
      tyreManufacturerIds.length
        ? prisma.tyre_manufacturer.findMany({
            where: { id: { in: tyreManufacturerIds } },
          })
        : [],
      countryIds.length
        ? prisma.country.findMany({
            where: { id: { in: countryIds } },
          })
        : [],
    ]);

  const entrantById = new Map(entrants.map((entry) => [entry.id, entry]));
  const driverById = new Map(drivers.map((entry) => [entry.id, entry]));
  const chassisById = new Map(chassisList.map((entry) => [entry.id, entry]));
  const engineById = new Map(engines.map((entry) => [entry.id, entry]));
  const engineManufacturerById = new Map(engineManufacturers.map((entry) => [entry.id, entry]));
  const tyreManufacturerById = new Map(tyreManufacturers.map((entry) => [entry.id, entry]));
  const countryById = new Map(countries.map((entry) => [entry.id, entry.name]));
  const raceById = new Map(races.map((race) => [race.id, race]));

  const entrantCountryById = new Map(
    seasonEntrants.map((entry) => [entry.entrant_id, countryById.get(entry.country_id) ?? "—"]),
  );

  const raceStandingsSorted = [...raceStandings].sort((a, b) => {
    const roundA = raceById.get(a.race_id)?.round ?? 0;
    const roundB = raceById.get(b.race_id)?.round ?? 0;
    return roundA - roundB;
  });

  return {
    seasonConstructor,
    standing: standing
      ? {
          ...standing,
          engineManufacturer: engineManufacturerById.get(standing.engine_manufacturer_id) ?? null,
        }
      : null,
    entrantConstructors: entrantConstructors.map((entry) => ({
      ...entry,
      entrant: entrantById.get(entry.entrant_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
      entrantCountry: entrantCountryById.get(entry.entrant_id) ?? "—",
    })),
    entrantDrivers: entrantDrivers.map((entry) => ({
      ...entry,
      driver: driverById.get(entry.driver_id) ?? null,
      entrant: entrantById.get(entry.entrant_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
    })),
    entrantChassis: entrantChassis.map((entry) => ({
      ...entry,
      chassis: chassisById.get(entry.chassis_id) ?? null,
      entrant: entrantById.get(entry.entrant_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
    })),
    entrantEngines: entrantEngines.map((entry) => ({
      ...entry,
      engine: engineById.get(entry.engine_id) ?? null,
      entrant: entrantById.get(entry.entrant_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
    })),
    entrantTyres: entrantTyres.map((entry) => ({
      ...entry,
      tyreManufacturer: tyreManufacturerById.get(entry.tyre_manufacturer_id) ?? null,
      entrant: entrantById.get(entry.entrant_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
    })),
    raceStandings: raceStandingsSorted.map((entry) => ({
      ...entry,
      race: raceById.get(entry.race_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
    })),
    raceResults: raceResults.map((entry) => ({
      ...entry,
      race: raceById.get(entry.race_id) ?? null,
      driver: driverById.get(entry.driver_id) ?? null,
      engineManufacturer: engineManufacturerById.get(entry.engine_manufacturer_id) ?? null,
      tyreManufacturer: tyreManufacturerById.get(entry.tyre_manufacturer_id) ?? null,
    })),
  };
}

export type ConstructorSeasonRecords = Awaited<ReturnType<typeof getConstructorSeasonRecords>>;
