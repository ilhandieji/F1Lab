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
        ...(trimmed.length >= 3
          ? [
              {
                country: {
                  OR: [
                    { name: { startsWith: trimmed, mode: "insensitive" as const } },
                    { demonym: { startsWith: trimmed, mode: "insensitive" as const } },
                  ],
                },
              },
            ]
          : []),
      ],
    },
    orderBy: [
      { total_championship_wins: "desc" },
      { total_race_wins: "desc" },
      { name: "asc" },
    ],
    take: RESULT_LIMIT,
    include: {
      country: true,
    },
  });

  return constructors.map((entry) => ({
    id: entry.id,
    name: entry.name,
    fullName: entry.full_name,
    country: entry.country?.name ?? "—",
    countryAlpha2: entry.country?.alpha2_code ?? null,
    championshipWins: entry.total_championship_wins,
  }));
}
