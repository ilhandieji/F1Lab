import { pointsToNumber } from "@/lib/decimal";
import type { SeasonRecords } from "./season-records";
import type { TeamCatalog } from "./team-catalog";
import type { ConstructorStanding, ConstructorStandingsView } from "./types";

export class ConstructorStandingsBuilder {
  constructor(
    private readonly year: number,
    private readonly records: SeasonRecords,
    private readonly teams: TeamCatalog,
  ) {}

  build(): ConstructorStandingsView {
    const official = this.officialByTeam();
    if (official.size > 0) return this.fromOfficial(official);
    return this.fromRacePoints();
  }

  private officialByTeam() {
    const official = new Map<
      string,
      { team: ReturnType<TeamCatalog["register"]>; points: number; order: number; position: string; rows: number }
    >();

    for (const standing of this.records.constructorStandings) {
      const existing = official.get(standing.constructor_id);
      official.set(standing.constructor_id, {
        team: this.teams.register(standing.constructor),
        points: (existing?.points ?? 0) + pointsToNumber(standing.points),
        order: Math.min(
          existing?.order ?? standing.position_display_order,
          standing.position_display_order,
        ),
        position: existing?.position ?? standing.position_text,
        rows: (existing?.rows ?? 0) + 1,
      });
    }

    return official;
  }

  private fromOfficial(
    official: ReturnType<ConstructorStandingsBuilder["officialByTeam"]>,
  ): ConstructorStandingsView {
    const hasOneRowPerTeam = [...official.values()].every(({ rows }) => rows === 1);
    const zeroPointTeams = this.records.seasonConstructors.flatMap((entry) => {
      if (pointsToNumber(entry.total_points) !== 0 || official.has(entry.constructor.id)) {
        return [];
      }
      return [this.teams.register(entry.constructor)];
    });

    const combined = new Map(official);
    for (const team of zeroPointTeams) {
      combined.set(team.id, {
        team,
        points: 0,
        order: Number.MAX_SAFE_INTEGER,
        position: "",
        rows: 0,
      });
    }

    const constructorStandings = [...combined.values()]
      .sort((left, right) =>
        hasOneRowPerTeam && zeroPointTeams.length === 0
          ? left.order - right.order || left.team.id.localeCompare(right.team.id)
          : right.points - left.points ||
            left.order - right.order ||
            left.team.name.localeCompare(right.team.name),
      )
      .map(({ team, points, position }, index) => ({
        team,
        points,
        position: hasOneRowPerTeam && position ? position : String(index + 1),
      }));

    return {
      constructorStandings,
      constructorStandingsNote:
        zeroPointTeams.length === 0 && hasOneRowPerTeam
          ? null
          : zeroPointTeams.length > 0
            ? "official-plus-zero"
            : "grouped-ties",
      constructorStandingsEmptyMessage: null,
    };
  }

  private fromRacePoints(): ConstructorStandingsView {
    const pointsByTeam = new Map<string, number>();
    let hasScoredResult = false;
    const addPoints = (teamId: string, points: unknown) => {
      if (points === null) return;
      hasScoredResult = true;
      pointsByTeam.set(teamId, (pointsByTeam.get(teamId) ?? 0) + pointsToNumber(points));
    };

    for (const result of this.records.raceResults) {
      addPoints(result.constructor_id, result.race_points);
    }
    for (const result of this.records.sprintResults) {
      this.teams.register(result.constructor);
      addPoints(result.constructor_id, result.race_points);
    }

    if (!hasScoredResult) {
      return {
        constructorStandings: [],
        constructorStandingsNote: null,
        constructorStandingsEmptyMessage:
          this.teams.all().length > 0
            ? "entry-list-no-points"
            : "no-data",
      };
    }

    const constructorStandings: ConstructorStanding[] = this.teams
      .all()
      .map((team) => ({ team, points: pointsByTeam.get(team.id) ?? 0 }))
      .sort(
        (left, right) =>
          right.points - left.points || left.team.name.localeCompare(right.team.name),
      )
      .map(({ team, points }, index) => ({
        team,
        points,
        position: String(index + 1),
      }));

    return {
      constructorStandings,
      constructorStandingsNote:
        "built-from-results",
      constructorStandingsEmptyMessage: null,
    };
  }
}
