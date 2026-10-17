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
    const raceRounds = [...new Set(raceResults.map((result) => result.race.round))].sort(
      (left, right) => left - right,
    );
    const index = this.indexResults(raceResults);
    const events = this.buildEvents(raceRounds, index);
    const drivers = this.buildRaceDrivers(index, openingTeamByDriver);

    return {
      summary: {
        uniqueRaceDrivers: drivers.length,
        substitutions: events
          .flatMap((event) => event.changes)
          .filter((change) => change.kind === "substitution").length,
        changedTeams: new Set(
          events.flatMap((event) => event.changes.map((change) => change.team.id)),
        ).size,
      },
      events,
      drivers,
      testDrivers: this.buildTestDrivers(),
    };
  }

  private indexResults(raceResults: RaceResult[]) {
    const lineupsByRound = new Map<number, Map<string, Set<string>>>();
    const raceRoundsByTeamDriver = new Map<string, Map<string, Set<number>>>();
    const raceRoundsByDriver = new Map<string, Set<number>>();
    const teamsByDriver = new Map<string, Set<string>>();
    const namesByDriver = new Map<string, string>();
    const eventNames = new Map<number, string>();

    for (const result of raceResults) {
      const { round, official_name: name } = result.race;
      const lineup = lineupsByRound.get(round) ?? new Map<string, Set<string>>();
      const teamDrivers = lineup.get(result.constructor_id) ?? new Set<string>();
      teamDrivers.add(result.driver_id);
      lineup.set(result.constructor_id, teamDrivers);
      lineupsByRound.set(round, lineup);

      const teamAppearances =
        raceRoundsByTeamDriver.get(result.constructor_id) ?? new Map<string, Set<number>>();
      const driverRounds = teamAppearances.get(result.driver_id) ?? new Set<number>();
      driverRounds.add(round);
      teamAppearances.set(result.driver_id, driverRounds);
      raceRoundsByTeamDriver.set(result.constructor_id, teamAppearances);

      const allDriverRounds = raceRoundsByDriver.get(result.driver_id) ?? new Set<number>();
      allDriverRounds.add(round);
      raceRoundsByDriver.set(result.driver_id, allDriverRounds);

      const driverTeams = teamsByDriver.get(result.driver_id) ?? new Set<string>();
      driverTeams.add(result.constructor_id);
      teamsByDriver.set(result.driver_id, driverTeams);
      namesByDriver.set(
        result.driver_id,
        `${result.driver.first_name} ${result.driver.last_name}`,
      );
      eventNames.set(round, name);
    }

    return {
      lineupsByRound,
      raceRoundsByTeamDriver,
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
      const previous = index.lineupsByRound.get(raceRounds[cursor - 1]) ?? new Map();
      const current = index.lineupsByRound.get(raceRounds[cursor]) ?? new Map();
      const teamIds = [...new Set([...previous.keys(), ...current.keys()])].sort();

      for (const teamId of teamIds) {
        const outgoing = [...(previous.get(teamId) ?? new Set<string>())]
          .filter((id) => !current.get(teamId)?.has(id))
          .sort();
        const incoming = [...(current.get(teamId) ?? new Set<string>())]
          .filter((id) => !previous.get(teamId)?.has(id))
          .sort();
        if (outgoing.length === 0 && incoming.length === 0) continue;

        const team = this.teams.get(teamId);
        const round = raceRounds[cursor];
        const name = index.eventNames.get(round);
        if (!team || !name) continue;

        const event = events.get(round) ?? { round, name, changes: [] };
        event.changes.push(
          this.toChange({
            round,
            team,
            outgoing,
            incoming,
            raceRounds,
            ...index,
          }),
        );
        events.set(round, event);
      }
    }

    return [...events.values()]
      .map((event) => ({
        ...event,
        changes: event.changes.sort((left, right) => left.team.name.localeCompare(right.team.name)),
      }))
      .sort((left, right) => left.round - right.round);
  }

  private toChange({
    round,
    team,
    outgoing,
    incoming,
    raceRounds,
    lineupsByRound,
    raceRoundsByTeamDriver,
    namesByDriver,
  }: {
    round: number;
    team: TeamInfo;
    outgoing: string[];
    incoming: string[];
    raceRounds: number[];
    lineupsByRound: Map<number, Map<string, Set<string>>>;
    raceRoundsByTeamDriver: Map<string, Map<string, Set<number>>>;
    namesByDriver: Map<string, string>;
  }): ActivityChange {
    const incomingId = incoming[0];
    const movedTeams =
      incomingId !== undefined &&
      raceRounds.some(
        (candidate) =>
          candidate === round &&
          [...(lineupsByRound.get(candidate) ?? new Map()).entries()].some(
            ([teamId, drivers]) =>
              teamId !== team.id &&
              drivers.has(incomingId) &&
              !lineupsByRound.get(candidate - 1)?.get(teamId)?.has(incomingId),
          ),
      );
    const returned =
      incomingId !== undefined &&
      raceRounds.some(
        (candidate) =>
          candidate < round && lineupsByRound.get(candidate)?.get(team.id)?.has(incomingId),
      );
    const originalDriverReturns = raceRounds.some((candidate) =>
      candidate > round &&
      outgoing.some((driver) => lineupsByRound.get(candidate)?.get(team.id)?.has(driver)),
    );
    const kind: ActivityChangeKind = movedTeams
      ? "transfer"
      : returned
        ? "return"
        : originalDriverReturns
          ? "substitution"
          : "lineup-change";

    const assigned = incomingId
      ? [...(raceRoundsByTeamDriver.get(team.id)?.get(incomingId) ?? [])]
          .filter((candidate) => candidate >= round)
          .sort((left, right) => left - right)
      : [];
    const stint = assigned.reduce<number[]>(
      (contiguous, candidate) =>
        contiguous.length === 0 || candidate === contiguous[contiguous.length - 1] + 1
          ? [...contiguous, candidate]
          : contiguous,
      [],
    );

    return {
      team,
      outgoing: outgoing.map((id) => ({ id, name: namesByDriver.get(id) ?? id })),
      incoming: incoming.map((id) => ({ id, name: namesByDriver.get(id) ?? id })),
      kind,
      stint: {
        startRound: stint[0] ?? round,
        endRound: stint.at(-1) ?? round,
        weekends: stint.length,
      },
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
    const drivers = new Map<string, { id: string; name: string; teams: Map<string, TeamInfo> }>();

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
        teams: [...teams.values()].sort((left, right) => left.name.localeCompare(right.name)),
      }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }
}
