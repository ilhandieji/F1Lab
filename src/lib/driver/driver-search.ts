import {
  compareByNameQuery,
  MIN_SEARCH_QUERY_LENGTH,
  SEARCH_CANDIDATE_LIMIT,
  SEARCH_RESULT_LIMIT,
  searchTokens,
} from "@/lib/search/name-query";
import { getPortraitMapForDriverIds, portraitUrlFromMap } from "@/lib/driver/driver-portrait-records";
import { prisma } from "@/lib/prisma";
import type { DriverSearchHit } from "./types";

function contains(token: string) {
  return { contains: token, mode: "insensitive" as const };
}

function driverTokenWhere(token: string) {
  return {
    OR: [
      { full_name: contains(token) },
      { name: contains(token) },
      { last_name: contains(token) },
      { first_name: contains(token) },
      { abbreviation: contains(token) },
      ...(token.length >= 3
        ? [
            {
              country_driver_nationality_country_idTocountry: {
                OR: [
                  { name: { startsWith: token, mode: "insensitive" as const } },
                  { demonym: { startsWith: token, mode: "insensitive" as const } },
                ],
              },
            },
          ]
        : []),
    ],
  };
}

export async function searchDrivers(query: string): Promise<DriverSearchHit[]> {
  const trimmed = query.trim();
  const tokens = searchTokens(trimmed);
  if (trimmed.length < MIN_SEARCH_QUERY_LENGTH || tokens.length === 0) return [];

  const tokenWhere = { AND: tokens.map((token) => driverTokenWhere(token)) };
  const startsWith = { startsWith: trimmed, mode: "insensitive" as const };
  const include = {
    country_driver_nationality_country_idTocountry: true,
  } as const;

  const [preferred, broad] = await Promise.all([
    prisma.driver.findMany({
      where: {
        AND: [
          tokenWhere,
          {
            OR: [
              { name: startsWith },
              { full_name: startsWith },
              { first_name: startsWith },
              { last_name: startsWith },
              { abbreviation: { equals: trimmed, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 40,
      include,
    }),
    prisma.driver.findMany({
      where: tokenWhere,
      take: SEARCH_CANDIDATE_LIMIT,
      include,
    }),
  ]);

  const seen = new Set<string>();
  const drivers = [...preferred, ...broad].filter((driver) => {
    if (seen.has(driver.id)) return false;
    seen.add(driver.id);
    return true;
  });

  const ranked = [...drivers]
    .sort((a, b) =>
      compareByNameQuery(trimmed)(
        {
          name: a.name,
          fullName: a.full_name,
          firstName: a.first_name,
          lastName: a.last_name,
          abbreviation: a.abbreviation,
          championshipWins: a.total_championship_wins,
        },
        {
          name: b.name,
          fullName: b.full_name,
          firstName: b.first_name,
          lastName: b.last_name,
          abbreviation: b.abbreviation,
          championshipWins: b.total_championship_wins,
        },
      ),
    )
    .slice(0, SEARCH_RESULT_LIMIT);

  const portraitMap = await getPortraitMapForDriverIds(ranked.map((driver) => driver.id));

  return ranked.map((driver) => ({
    id: driver.id,
    name: driver.name,
    fullName: driver.full_name,
    abbreviation: driver.abbreviation,
    nationality: driver.country_driver_nationality_country_idTocountry.name,
    nationalityAlpha2: driver.country_driver_nationality_country_idTocountry.alpha2_code,
    championshipWins: driver.total_championship_wins,
    portraitUrl: portraitUrlFromMap(portraitMap, driver.id, null),
  }));
}
