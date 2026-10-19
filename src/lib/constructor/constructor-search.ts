import { prisma } from "@/lib/prisma";
import type { ConstructorSearchHit } from "./types";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 8;

export async function searchConstructors(query: string): Promise<ConstructorSearchHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) return [];

  const constructors = await prisma["constructor"].findMany({
    where: {
      OR: [
        { full_name: { contains: trimmed, mode: "insensitive" } },
        { name: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    orderBy: [
      { total_championship_wins: "desc" },
      { total_race_wins: "desc" },
      { name: "asc" },
    ],
    take: RESULT_LIMIT,
  });

  const countryIds = [...new Set(constructors.map((entry) => entry.country_id))];
  const countries = countryIds.length
    ? await prisma.country.findMany({
        where: { id: { in: countryIds } },
      })
    : [];
  const countryById = new Map(countries.map((entry) => [entry.id, entry.name]));

  return constructors.map((entry) => ({
    id: entry.id,
    name: entry.name,
    fullName: entry.full_name,
    country: countryById.get(entry.country_id) ?? "—",
    championshipWins: entry.total_championship_wins,
  }));
}
