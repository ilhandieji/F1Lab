export const MIN_SEARCH_QUERY_LENGTH = 2;
export const SEARCH_RESULT_LIMIT = 8;
export const SEARCH_CANDIDATE_LIMIT = 80;

export type RankableName = {
  name: string;
  fullName: string;
  firstName?: string | null;
  lastName?: string | null;
  abbreviation?: string | null;
  championshipWins: number;
};

export function searchTokens(query: string): string[] {
  return query.trim().split(/\s+/).filter((token) => token.length > 0);
}

function normalized(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function startsWithToken(value: string | null | undefined, token: string): boolean {
  const text = normalized(value);
  return text.length > 0 && text.startsWith(token);
}

/** Higher scores are closer to how the query was typed. */
export function nameQueryRank(entry: RankableName, query: string): number {
  const q = normalized(query);
  if (!q) return 0;

  const name = normalized(entry.name);
  const fullName = normalized(entry.fullName);
  const lastName = normalized(entry.lastName);
  const abbreviation = normalized(entry.abbreviation);
  let score = 0;

  if (abbreviation && abbreviation === q) score = Math.max(score, 400);
  else if (abbreviation && q.length >= 2 && abbreviation.startsWith(q)) score = Math.max(score, 300);

  if (name === q || fullName === q) score = Math.max(score, 350);
  // The common name outranks a legal name that merely begins with the same letters.
  if (name && name.startsWith(q)) score = Math.max(score, 220);
  if (startsWithToken(entry.firstName, q)) score = Math.max(score, 200);
  if (fullName && fullName.startsWith(q)) score = Math.max(score, 160);
  if (lastName && lastName.startsWith(q)) score = Math.max(score, 140);

  const tokens = searchTokens(query).map((token) => token.toLowerCase());
  if (tokens.length > 1) {
    const first = tokens[0]!;
    const last = tokens[tokens.length - 1]!;
    const firstHit =
      startsWithToken(entry.name, first) ||
      startsWithToken(entry.fullName, first) ||
      startsWithToken(entry.firstName, first);
    const lastHit =
      startsWithToken(entry.lastName, last) || name.endsWith(last) || fullName.endsWith(last);
    if (firstHit && lastHit) score = Math.max(score, 250);
  }

  return score;
}

export function compareByNameQuery<T extends RankableName>(query: string) {
  return (a: T, b: T): number => {
    const byRank = nameQueryRank(b, query) - nameQueryRank(a, query);
    if (byRank !== 0) return byRank;
    const byTitles = b.championshipWins - a.championshipWins;
    if (byTitles !== 0) return byTitles;
    return a.name.localeCompare(b.name);
  };
}

export function distinctFullName(name: string, fullName: string): string | null {
  return normalized(name) === normalized(fullName) ? null : fullName;
}
