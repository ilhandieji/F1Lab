import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GridViews, {
  type ActivityDriver,
  type ActivityEvent,
  type GridDriver,
  type TeamInfo,
  type TestDriver,
} from "./grid-views";
import "../grid.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const teamLogoPaths: Record<string, { src: string; light: boolean }> = {
  alpine: { src: "/assets/teamAlpine/logo.svg", light: true },
  "aston-martin": {
    src: "/assets/teamAstonMartin/logo.svg",
    light: true,
  },
  audi: { src: "/assets/teamAudi/logo.svg", light: false },
  cadillac: { src: "/assets/teamCadillac/logo.svg", light: false },
  ferrari: { src: "/assets/teamFerrari/logo.svg", light: false },
  haas: { src: "/assets/teamHaas/logo.svg", light: false },
  mclaren: { src: "/assets/teamMcLaren/logo.svg", light: false },
  mercedes: { src: "/assets/teamMercedes/logo.svg", light: true },
  "racing-bulls": { src: "/assets/teamRacingBulls/logo.svg", light: false },
  "red-bull": { src: "/assets/teamRedbull/logo.svg", light: false },
  williams: { src: "/assets/teamWiliams/logo.svg", light: true },
};

async function DriverStandings({ year }: { year: number }) {
  await connection();

  const driverStandings = await prisma.season_driver_standing.findMany({
    where: { year },
    select: {
      year: true,
      position_display_order: true,
      position_text: true,
      points: true,
      driver: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: [{ position_display_order: "asc" }],
  });

  const [seasonEntries, raceResults] = await Promise.all([
    prisma.season_entrant_driver.findMany({
      where: { year },
      select: {
        driver_id: true,
        constructor_id: true,
        rounds: true,
        test_driver: true,
        constructor: true,
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    }),
    prisma.race_data.findMany({
      where: {
        type: "RACE_RESULT",
        race: { year },
      },
      select: {
        position_display_order: true,
        driver_id: true,
        constructor_id: true,
        constructor: false,
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        race: {
          select: {
            round: true,
            official_name: true,
          },
        },
      },
    }),
  ]);

  raceResults.sort(
    (left, right) =>
      left.race.round - right.race.round ||
      left.position_display_order - right.position_display_order ||
      left.driver_id.localeCompare(right.driver_id),
  );

  const teamsById = new Map<string, TeamInfo>();
  const openingTeamByDriver = new Map<string, string>();
  const testDriversById = new Map<
    string,
    { id: string; name: string; teams: Map<string, TeamInfo> }
  >();

  for (const entry of seasonEntries) {
    const constructor = Reflect.get(entry, "constructor") as {
      id: string;
      name: string;
    };
    const logo = teamLogoPaths[constructor.id];
    const team: TeamInfo = {
      id: constructor.id,
      name: constructor.name,
      logoPath: logo?.src ?? null,
      lightLogo: logo?.light ?? false,
    };

    teamsById.set(team.id, team);

    if (entry.test_driver) {
      const testDriver = testDriversById.get(entry.driver.id) ?? {
        id: entry.driver.id,
        name: `${entry.driver.first_name} ${entry.driver.last_name}`,
        teams: new Map<string, TeamInfo>(),
      };

      testDriver.teams.set(team.id, team);
      testDriversById.set(testDriver.id, testDriver);
    }
  }

  const raceRounds = [
    ...new Set(raceResults.map(({ race }) => race.round)),
  ].sort((left, right) => left - right);
  const openingRound = raceRounds[0];
  const openingTeamsByDriver = new Map<string, Set<string>>();
  const openingResultTeamsByDriver = new Map<string, Set<string>>();

  for (const entry of seasonEntries) {
    if (
      !entry.test_driver &&
      openingRound !== undefined &&
      entry.rounds?.split(";").some((round) => Number(round) === openingRound)
    ) {
      const teamIds = openingTeamsByDriver.get(entry.driver_id) ?? new Set();
      teamIds.add(entry.constructor_id);
      openingTeamsByDriver.set(entry.driver_id, teamIds);
    }
  }

  for (const result of raceResults) {
    if (result.race.round !== openingRound) continue;

    const teamIds =
      openingResultTeamsByDriver.get(result.driver_id) ?? new Set();
    teamIds.add(result.constructor_id);
    openingResultTeamsByDriver.set(result.driver_id, teamIds);
  }

  for (const [driverId, teamIds] of openingTeamsByDriver) {
    const candidates = [...teamIds].sort();
    const matchingRaceTeams = candidates.filter((teamId) =>
      openingResultTeamsByDriver.get(driverId)?.has(teamId),
    );
    const openingTeamId =
      matchingRaceTeams.length === 1
        ? matchingRaceTeams[0]
        : candidates.length === 1
          ? candidates[0]
          : undefined;

    if (openingTeamId) {
      openingTeamByDriver.set(driverId, openingTeamId);
    }
  }

  const lineupsByRound = new Map<number, Map<string, Set<string>>>();
  const raceRoundsByTeamDriver = new Map<string, Map<string, Set<number>>>();
  const raceRoundsByDriver = new Map<string, Set<number>>();
  const teamsByDriver = new Map<string, Set<string>>();
  const namesByDriver = new Map<string, string>();
  const eventInfoByRound = new Map<number, { name: string }>();

  for (const result of raceResults) {
    const { round, official_name } = result.race;
    const { driver_id, constructor_id } = result;
    const teamLineups =
      lineupsByRound.get(round) ?? new Map<string, Set<string>>();
    const teamDrivers = teamLineups.get(constructor_id) ?? new Set<string>();
    teamDrivers.add(driver_id);
    teamLineups.set(constructor_id, teamDrivers);
    lineupsByRound.set(round, teamLineups);

    const teamAppearances =
      raceRoundsByTeamDriver.get(constructor_id) ??
      new Map<string, Set<number>>();
    const driverTeamRounds =
      teamAppearances.get(driver_id) ?? new Set<number>();
    driverTeamRounds.add(round);
    teamAppearances.set(driver_id, driverTeamRounds);
    raceRoundsByTeamDriver.set(constructor_id, teamAppearances);

    const driverRounds = raceRoundsByDriver.get(driver_id) ?? new Set<number>();
    driverRounds.add(round);
    raceRoundsByDriver.set(driver_id, driverRounds);

    const driverTeams = teamsByDriver.get(driver_id) ?? new Set<string>();
    driverTeams.add(constructor_id);
    teamsByDriver.set(driver_id, driverTeams);

    namesByDriver.set(
      driver_id,
      `${result.driver.first_name} ${result.driver.last_name}`,
    );
    eventInfoByRound.set(round, { name: official_name });
  }

  const rawChanges: {
    round: number;
    team: TeamInfo;
    outgoing: string[];
    incoming: string[];
  }[] = [];

  for (let index = 1; index < raceRounds.length; index += 1) {
    const previousRound = raceRounds[index - 1];
    const round = raceRounds[index];
    const previousLineups =
      lineupsByRound.get(previousRound) ?? new Map<string, Set<string>>();
    const currentLineups =
      lineupsByRound.get(round) ?? new Map<string, Set<string>>();
    const teamIds = new Set([
      ...previousLineups.keys(),
      ...currentLineups.keys(),
    ]);

    for (const teamId of [...teamIds].sort()) {
      const previousDrivers = previousLineups.get(teamId) ?? new Set<string>();
      const currentDrivers = currentLineups.get(teamId) ?? new Set<string>();
      const outgoing = [...previousDrivers]
        .filter((driverId) => !currentDrivers.has(driverId))
        .sort();
      const incoming = [...currentDrivers]
        .filter((driverId) => !previousDrivers.has(driverId))
        .sort();

      if (outgoing.length === 0 && incoming.length === 0) continue;

      const team = teamsById.get(teamId);
      if (team) rawChanges.push({ round, team, outgoing, incoming });
    }
  }

  const activityEventsByRound = new Map<number, ActivityEvent>();

  for (const change of rawChanges) {
    const eventInfo = eventInfoByRound.get(change.round);
    if (!eventInfo) continue;

    const activityEvent = activityEventsByRound.get(change.round) ?? {
      round: change.round,
      name: eventInfo.name,
      changes: [],
    };
    const incomingId = change.incoming[0];
    const hasMovedFromAnotherTeam =
      incomingId !== undefined &&
      rawChanges.some(
        (otherChange) =>
          otherChange.round === change.round &&
          otherChange.team.id !== change.team.id &&
          otherChange.outgoing.includes(incomingId),
      );
    const hasPreviouslyRacedForTeam =
      incomingId !== undefined &&
      raceRounds.some(
        (round) =>
          round < change.round &&
          lineupsByRound.get(round)?.get(change.team.id)?.has(incomingId),
      );
    const hasOriginalDriverReturned = raceRounds.some(
      (round) =>
        round > change.round &&
        change.outgoing.some((driverId) =>
          lineupsByRound.get(round)?.get(change.team.id)?.has(driverId),
        ),
    );
    const kind = hasMovedFromAnotherTeam
      ? "transfer"
      : hasPreviouslyRacedForTeam
        ? "return"
        : hasOriginalDriverReturned
          ? "substitution"
          : "lineup-change";
    const assignedRounds = incomingId
      ? [...(raceRoundsByTeamDriver.get(change.team.id)?.get(incomingId) ?? [])]
          .filter((round) => round >= change.round)
          .sort((left, right) => left - right)
      : [];
    const stintRounds: number[] = [];

    for (const round of assignedRounds) {
      if (
        stintRounds.length > 0 &&
        round !== stintRounds[stintRounds.length - 1] + 1
      ) {
        break;
      }
      stintRounds.push(round);
    }

    activityEvent.changes.push({
      team: change.team,
      outgoing: change.outgoing.map((id) => ({
        id,
        name: namesByDriver.get(id) ?? id,
      })),
      incoming: change.incoming.map((id) => ({
        id,
        name: namesByDriver.get(id) ?? id,
      })),
      kind,
      stint: {
        startRound: stintRounds[0] ?? change.round,
        endRound: stintRounds.at(-1) ?? change.round,
        weekends: stintRounds.length,
      },
    });
    activityEventsByRound.set(change.round, activityEvent);
  }

  const seenStartingDrivers = new Set<string>();
  const gridDrivers: GridDriver[] = driverStandings.flatMap(
    ({ position_display_order, position_text, points, driver }) => {
      const teamId = openingTeamByDriver.get(driver.id);
      const team = teamId ? teamsById.get(teamId) : undefined;

      if (!team || seenStartingDrivers.has(driver.id)) return [];

      seenStartingDrivers.add(driver.id);
      return team
        ? [
            {
              id: driver.id,
              firstName: driver.first_name,
              lastName: driver.last_name,
              position: position_text,
              positionOrder: position_display_order,
              points: Number(points),
              team,
            },
          ]
        : [];
    },
  );
  const highestPoints = Math.max(...gridDrivers.map(({ points }) => points), 1);
  const activityDrivers: ActivityDriver[] = [...raceRoundsByDriver]
    .map(([id, rounds]) => ({
      id,
      name: namesByDriver.get(id) ?? id,
      weekends: rounds.size,
      teams: [...(teamsByDriver.get(id) ?? [])]
        .map((teamId) => teamsById.get(teamId))
        .filter((team): team is TeamInfo => team !== undefined)
        .sort((left, right) => left.name.localeCompare(right.name)),
      openedSeason: openingTeamByDriver.has(id),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const testDrivers: TestDriver[] = [...testDriversById.values()]
    .map(({ id, name, teams }) => ({
      id,
      name,
      teams: [...teams.values()].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const activityEvents = [...activityEventsByRound.values()]
    .map((event) => ({
      ...event,
      changes: event.changes.sort((left, right) =>
        left.team.name.localeCompare(right.team.name),
      ),
    }))
    .sort((left, right) => left.round - right.round);
  const activitySummary = {
    uniqueRaceDrivers: activityDrivers.length,
    substitutions: activityEvents
      .flatMap(({ changes }) => changes)
      .filter(({ kind }) => kind === "substitution").length,
    changedTeams: new Set(
      activityEvents.flatMap(({ changes }) =>
        changes.map(({ team }) => team.id),
      ),
    ).size,
  };

  return (
    <main className="grid-page">
      <div className="grid-ambient" aria-hidden="true" />

      <div className="grid-content">
        <header className="grid-header">
          <div className="grid-eyebrow">
            <span className="grid-live-dot" />
            {year} SEASON
          </div>

          <h1 className="grid-title">
            Drivers <span>Championship</span>
          </h1>

          <p className="grid-subtitle">
            The battle for the top spot, from lights out to the final flag.
          </p>

          <div className="grid-header-rule">
            <span />
          </div>
        </header>

        <GridViews
          year={year}
          startingDrivers={gridDrivers}
          highestPoints={highestPoints}
          activity={{
            summary: activitySummary,
            events: activityEvents,
            drivers: activityDrivers,
            testDrivers,
          }}
        />
      </div>
    </main>
  );
}

async function GridPage({ params }: PageProps) {
  const { slug } = await params;
  const match = /^(\d{4})$/.exec(slug);

  if (!match) notFound();

  const year = Number(match[1]);

  return <DriverStandings year={year} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={<main className="grid-loading">Loading standings...</main>}
    >
      <GridPage params={params} />
    </Suspense>
  );
}
