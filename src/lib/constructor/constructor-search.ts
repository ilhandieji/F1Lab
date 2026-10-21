import { prisma } from "@/lib/prisma";
import {
  compareByNameQuery,
  MIN_SEARCH_QUERY_LENGTH,
  SEARCH_CANDIDATE_LIMIT,
  SEARCH_RESULT_LIMIT,
  searchTokens,
} from "@/lib/search/name-query";
import type { ConstructorSearchHit } from "./types";

function contains(token: string) {
  return { contains: token, mode: "insensitive" as const };
}

function constructorTokenWhere(token: string) {
  return {
    OR: [
      { full_name: contains(token) },
      { name: contains(token) },
      ...(token.length >= 3
        ? [
            {
              country: {
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

export async function searchConstructors(query: string): Promise<ConstructorSearchHit[]> {
  const trimmed = query.trim();
  const tokens = searchTokens(trimmed);
  if (trimmed.length < MIN_SEARCH_QUERY_LENGTH || tokens.length === 0) return [];

  const tokenWhere = { AND: tokens.map((token) => constructorTokenWhere(token)) };
  const startsWith = { startsWith: trimmed, mode: "insensitive" as const };
  const include = { country: true } as const;

  const [preferred, broad] = await Promise.all([
    prisma["constructor"].findMany({
      where: {
        AND: [
          tokenWhere,
          {
            OR: [{ name: startsWith }, { full_name: startsWith }],
          },
        ],
      },
      take: 40,
      include,
    }),
    prisma["constructor"].findMany({
      where: tokenWhere,
      take: SEARCH_CANDIDATE_LIMIT,
      include,
    }),
  ]);

  const seen = new Set<string>();
  const constructors = [...preferred, ...broad].filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });

  const ranked = [...constructors]
    .sort((a, b) =>
      compareByNameQuery(trimmed)(
        {
          name: a.name,
          fullName: a.full_name,
          championshipWins: a.total_championship_wins,
        },
        {
          name: b.name,
          fullName: b.full_name,
          championshipWins: b.total_championship_wins,
        },
      ),
    )
    .slice(0, SEARCH_RESULT_LIMIT);

  return ranked.map((entry) => ({
    id: entry.id,
    name: entry.name,
    fullName: entry.full_name,
    country: entry.country?.name ?? "—",
    countryAlpha2: entry.country?.alpha2_code ?? null,
    championshipWins: entry.total_championship_wins,
  }));
}
