import { getTeamLogo } from "@/lib/team-logos";
import type { SeasonRecords } from "./season-records";
import type { TeamInfo } from "./types";

type ConstructorRef = {
  id: string;
  name: string;
  countryAlpha2?: string | null;
  countryName?: string | null;
};

/** Year-aware constructor identities, including the badge for that season. */
export class TeamCatalog {
  private readonly teams = new Map<string, TeamInfo>();

  constructor(
    private readonly year: number,
    records: SeasonRecords,
  ) {
    for (const entry of records.seasonConstructors) {
      this.register(entry.constructor);
    }
    for (const result of records.raceResults) {
      this.register(result.constructor);
    }
    for (const entry of records.entrantDrivers) {
      this.register(entry.constructor);
    }
    for (const result of records.sprintResults) {
      this.register(result.constructor);
    }
  }

  register(constructor: ConstructorRef): TeamInfo {
    const existing = this.teams.get(constructor.id);
    if (existing) return existing;

    const logo = getTeamLogo(constructor.id, this.year);
    const team: TeamInfo = {
      id: constructor.id,
      name: constructor.name,
      logoPath: logo?.src ?? null,
      lightLogo: logo?.light ?? false,
      countryAlpha2: constructor.countryAlpha2 ?? null,
      countryName: constructor.countryName ?? null,
    };
    this.teams.set(team.id, team);
    return team;
  }

  get(id: string): TeamInfo | undefined {
    return this.teams.get(id);
  }

  all(): TeamInfo[] {
    return [...this.teams.values()];
  }
}
