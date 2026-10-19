import { getPortraitMapForDriverIds, portraitUrlFromMap } from "@/lib/driver/driver-portrait-records";
import { prisma } from "@/lib/prisma";
import type { DriverSearchHit } from "./types";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 8;

export async function searchDrivers(query: string): Promise<DriverSearchHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const drivers = await prisma.driver.findMany({
    where: {
      OR: [
        { full_name: { contains: trimmed, mode: "insensitive" } },
        { name: { contains: trimmed, mode: "insensitive" } },
        { last_name: { contains: trimmed, mode: "insensitive" } },
        { first_name: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    orderBy: [{ total_championship_wins: "desc" }, { total_race_wins: "desc" }, { full_name: "asc" }],
    take: RESULT_LIMIT,
    include: {
      country_driver_nationality_country_idTocountry: true,
    },
  });

  const portraitMap = await getPortraitMapForDriverIds(drivers.map((driver) => driver.id));

  return drivers.map((driver) => ({
    id: driver.id,
    fullName: driver.full_name,
    abbreviation: driver.abbreviation,
    nationality: driver.country_driver_nationality_country_idTocountry.name,
    championshipWins: driver.total_championship_wins,
    portraitUrl: portraitUrlFromMap(portraitMap, driver.id, null),
  }));
}
