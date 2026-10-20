import { grandPrixDisplayName } from "@/lib/race/grand-prix-display";
import type { SeasonRecords } from "./season-records";
import type { TeamCatalog } from "./team-catalog";
import type {
  ActivityChange,
  ActivityChangeKind,
  ActivityDriver,
  ActivityEvent,
  SeasonActivity,
  TeamInfo,
  TestDriver,
} from "./types";

type RaceResult = SeasonRecords["raceResults"][number];

type ChangeClassificationArgs = {
  round: number;
  team: TeamInfo;
  outgoing: string[];
  incoming: string[];
  lineups: LineupIndex;
};

type IncomingDriverClassificationArgs = {
  incomingId: string;
  round: number;
  team: TeamInfo;
  lineups: LineupIndex;
};

/**
 * Encapsulates lineup lookups so consumers do not need to work directly with
 * nested Maps and Sets.
 */
class LineupIndex {
  private readonly roundsInOrder: number[];
  private readonly emptyDrivers = new Set<string>();

  constructor(
    private readonly lineupsByRound: Map<number, Map<string, Set<string>>>,
  ) {
    this.roundsInOrder = [...lineupsByRound.keys()].sort(
      (left, right) => left - right,
    );
  }

  rounds(): number[] {
    return [...this.roundsInOrder];
  }

  roundsBefore(round: number): number[] {
    return this.roundsInOrder
      .filter((candidate) => candidate < round)
      .reverse();
  }

  roundsAfter(round: number): number[] {
    return this.roundsInOrder.filter((candidate) => candidate > round);
  }

  roundsFrom(round: number): number[] {
    return this.roundsInOrder.filter((candidate) => candidate >= round);
  }

  teamIdsAt(round: number): string[] {
    return [...(this.lineupsByRound.get(round)?.keys() ?? [])].sort();
  }

  teamsAt(round: number): Array<{
    teamId: string;
    drivers: ReadonlySet<string>;
  }> {
    return [...(this.lineupsByRound.get(round) ?? new Map())].map(
      ([teamId, drivers]) => ({ teamId, drivers }),
    );
  }

  driversAt(round: number, teamId: string): ReadonlySet<string> {
    return this.lineupsByRound.get(round)?.get(teamId) ?? this.emptyDrivers;
  }

  hasDriver(round: number, teamId: string, driverId: string): boolean {
    return this.lineupsByRound.get(round)?.get(teamId)?.has(driverId) ?? false;
  }

  hasDrivenForTeamBefore(
    round: number,
    teamId: string,
    driverId: string,
  ): boolean {
    return this.roundsBefore(round).some((candidate) =>
      this.hasDriver(candidate, teamId, driverId),
    );
  }

  previousTeamsOfDriver(round: number, driverId: string): string[] {
    for (const previousRound of this.roundsBefore(round)) {
      const teamIds = this.teamsAt(previousRound)
        .filter(({ drivers }) => drivers.has(driverId))
        .map(({ teamId }) => teamId)
        .sort();

      if (teamIds.length > 0) return teamIds;
    }

    return [];
  }
}

export class SeasonActivityBuilder {
  constructor(
    private readonly records: SeasonRecords,
    private readonly teams: TeamCatalog,
  ) {}

  build(openingTeamByDriver: Map<string, string>): SeasonActivity {
    const raceResults = [...this.records.raceResults].sort(
      (left, right) =>
        left.race.round - right.race.round ||
        left.position_display_order - right.position_display_order ||
        left.driver_id.localeCompare(right.driver_id),
    );

    const index = this.indexResults(raceResults);
    const raceRounds = index.lineups.rounds();
    const events = this.buildEvents(raceRounds, index);
    const drivers = this.buildRaceDrivers(index, openingTeamByDriver);

    return {
      summary: {
        uniqueRaceDrivers: drivers.length,
        substitutions: events
          .flatMap((event) => event.changes)
          .filter((change) => change.kind === "substitution").length,
        changedTeams: new Set(
          events.flatMap((event) =>
            event.changes.map((change) => change.team.id),
          ),
        ).size,
      },
      events,
      drivers,
      testDrivers: this.buildTestDrivers(),
    };
  }

  private indexResults(raceResults: RaceResult[]) {
    const lineupsByRound = new Map<number, Map<string, Set<string>>>();
    const raceRoundsByDriver = new Map<string, Set<number>>();
    const teamsByDriver = new Map<string, Set<string>>();
    const namesByDriver = new Map<string, string>();
    const eventNames = new Map<number, string>();

    for (const result of raceResults) {
      const { round } = result.race;
      const name = grandPrixDisplayName(result.race);
      const lineup =
        lineupsByRound.get(round) ?? new Map<string, Set<string>>();
      const teamDrivers =
        lineup.get(result.constructor_id) ?? new Set<string>();

      teamDrivers.add(result.driver_id);
      lineup.set(result.constructor_id, teamDrivers);
      lineupsByRound.set(round, lineup);

      const allDriverRounds =
        raceRoundsByDriver.get(result.driver_id) ?? new Set<number>();
      allDriverRounds.add(round);
      raceRoundsByDriver.set(result.driver_id, allDriverRounds);

      const driverTeams =
        teamsByDriver.get(result.driver_id) ?? new Set<string>();
      driverTeams.add(result.constructor_id);
      teamsByDriver.set(result.driver_id, driverTeams);

      namesByDriver.set(
        result.driver_id,
        `${result.driver.first_name} ${result.driver.last_name}`,
      );
      eventNames.set(round, name);
    }

    return {
      lineups: new LineupIndex(lineupsByRound),
      raceRoundsByDriver,
      teamsByDriver,
      namesByDriver,
      eventNames,
    };
  }

  private buildEvents(
    raceRounds: number[],
    index: ReturnType<SeasonActivityBuilder["indexResults"]>,
  ): ActivityEvent[] {
    const events = new Map<number, ActivityEvent>();

    for (let cursor = 1; cursor < raceRounds.length; cursor += 1) {
      const previousRound = raceRounds[cursor - 1];
      const round = raceRounds[cursor];
      const teamIds = [
        ...new Set([
          ...index.lineups.teamIdsAt(previousRound),
          ...index.lineups.teamIdsAt(round),
        ]),
      ].sort();

      for (const teamId of teamIds) {
        const outgoing = [...index.lineups.driversAt(previousRound, teamId)]
          .filter(
            (driverId) => !index.lineups.hasDriver(round, teamId, driverId),
          )
          .sort();
        const incoming = [...index.lineups.driversAt(round, teamId)]
          .filter(
            (driverId) =>
              !index.lineups.hasDriver(previousRound, teamId, driverId),
          )
          .sort();

        if (outgoing.length === 0 && incoming.length === 0) continue;

        const team = this.teams.get(teamId);
        const name = index.eventNames.get(round);
        if (!team || !name) continue;

        const event = events.get(round) ?? { round, name, changes: [] };
        event.changes.push(
          this.toChange({
            round,
            team,
            outgoing,
            incoming,
            index,
          }),
        );
        events.set(round, event);
      }
    }

    return [...events.values()]
      .map((event) => ({
        ...event,
        changes: event.changes.sort((left, right) =>
          left.team.name.localeCompare(right.team.name),
        ),
      }))
      .sort((left, right) => left.round - right.round);
  }

  private toChange({
    round,
    team,
    outgoing,
    incoming,
    index,
  }: {
    round: number;
    team: TeamInfo;
    outgoing: string[];
    incoming: string[];
    index: ReturnType<SeasonActivityBuilder["indexResults"]>;
  }): ActivityChange {
    const kind = this.classifyChange({
      round,
      team,
      outgoing,
      incoming,
      lineups: index.lineups,
    });

    const stints = incoming.map((incomingId) => ({
      driverId: incomingId,
      ...this.buildStint(team.id, incomingId, round, index.lineups),
    }));

    return {
      team,
      outgoing: outgoing.map((id) => ({
        id,
        name: index.namesByDriver.get(id) ?? id,
      })),
      incoming: incoming.map((id) => ({
        id,
        name: index.namesByDriver.get(id) ?? id,
      })),
      kind,
      stints,
    };
  }

  private classifyChange(args: ChangeClassificationArgs): ActivityChangeKind {
    // A return takes precedence over a transfer when a driver has previously
    // raced for this team and later came back from another team.
    const returningDriver = args.incoming.some((incomingId) =>
      this.didDriverReturnToTeam({
        incomingId,
        round: args.round,
        team: args.team,
        lineups: args.lineups,
      }),
    );
    if (returningDriver) return "return";

    const transferringDriver = args.incoming.some((incomingId) =>
      this.didDriverTransferIn({
        incomingId,
        round: args.round,
        team: args.team,
        lineups: args.lineups,
      }),
    );
    if (transferringDriver) return "transfer";

    if (this.didOriginalDriverReturn(args)) return "substitution";

    return "lineup-change";
  }

  private didDriverTransferIn({
    incomingId,
    round,
    team,
    lineups,
  }: IncomingDriverClassificationArgs): boolean {
    const previousTeams = lineups.previousTeamsOfDriver(round, incomingId);
    return previousTeams.some((teamId) => teamId !== team.id);
  }

  private didDriverReturnToTeam({
    incomingId,
    round,
    team,
    lineups,
  }: IncomingDriverClassificationArgs): boolean {
    return lineups.hasDrivenForTeamBefore(round, team.id, incomingId);
  }

  private didOriginalDriverReturn({
    round,
    team,
    outgoing,
    lineups,
  }: ChangeClassificationArgs): boolean {
    return lineups
      .roundsAfter(round)
      .some((candidate) =>
        outgoing.some((driverId) =>
          lineups.hasDriver(candidate, team.id, driverId),
        ),
      );
  }

  private buildStint(
    teamId: string,
    incomingId: string,
    round: number,
    lineups: LineupIndex,
  ): Omit<ActivityChange["stints"][number], "driverId"> {
    const stintRounds: number[] = [];

    for (const candidate of lineups.roundsFrom(round)) {
      if (!lineups.hasDriver(candidate, teamId, incomingId)) break;
      stintRounds.push(candidate);
    }

    return {
      startRound: stintRounds[0] ?? round,
      endRound: stintRounds.at(-1) ?? round,
      weekends: stintRounds.length,
    };
  }

  private buildRaceDrivers(
    index: ReturnType<SeasonActivityBuilder["indexResults"]>,
    openingTeamByDriver: Map<string, string>,
  ): ActivityDriver[] {
    return [...index.raceRoundsByDriver]
      .map(([id, rounds]) => ({
        id,
        name: index.namesByDriver.get(id) ?? id,
        weekends: rounds.size,
        teams: [...(index.teamsByDriver.get(id) ?? [])]
          .map((teamId) => this.teams.get(teamId))
          .filter((team): team is TeamInfo => Boolean(team))
          .sort((left, right) => left.name.localeCompare(right.name)),
        openedSeason: openingTeamByDriver.has(id),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  private buildTestDrivers(): TestDriver[] {
    const drivers = new Map<
      string,
      { id: string; name: string; teams: Map<string, TeamInfo> }
    >();

    for (const entry of this.records.entrantDrivers) {
      if (!entry.test_driver) continue;

      const driver = drivers.get(entry.driver.id) ?? {
        id: entry.driver.id,
        name: `${entry.driver.first_name} ${entry.driver.last_name}`,
        teams: new Map<string, TeamInfo>(),
      };
      const team = this.teams.get(entry.constructor_id);
      if (team) driver.teams.set(team.id, team);
      drivers.set(driver.id, driver);
    }

    return [...drivers.values()]
      .map(({ id, name, teams }) => ({
        id,
        name,
        teams: [...teams.values()].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }
}
