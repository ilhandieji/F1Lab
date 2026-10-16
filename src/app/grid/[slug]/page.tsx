import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import YearNavigation from "@/components/grid/year-navigation";
import { gridStyles } from "@/components/grid/styles";
import GridViews, {
  type ActivityDriver,
  type ActivityEvent,
  type ConstructorStanding,
  type GridDriver,
  type TeamInfo,
  type TestDriver,
} from "./grid-views";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// TODO make this Module in lib for later
type TeamLogoOptions = {
  light?: boolean;
  folderName?: string;
  format?: "svg" | "webp";
};

type TeamLogo = {
  src: string;
  light: boolean;
};

type TeamLogoPaths<T extends Record<string, TeamLogoOptions>> = {
  [K in keyof T]: TeamLogo;
};

// E.G: Converts "aston-martin" to "teamAstonMartin"
function toFolderName(slug: string): string {
  return `team${slug
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")}`;
}

function defineTeamLogoPaths<const T extends Record<string, TeamLogoOptions>>(
  teams: T,
): TeamLogoPaths<T> {
  return Object.fromEntries(
    Object.entries(teams).map(([slug, options]) => [
      slug,
      {
        src: `/assets/${options.folderName ?? toFolderName(slug)}/logo.${options.format ?? "svg"}`,
        light: options.light ?? false,
      },
    ]),
  ) as TeamLogoPaths<T>;
}

const teamLogoPaths: Record<string, TeamLogo> = defineTeamLogoPaths({
  alpine: { light: true },
  "aston-martin": { light: true },
  audi: {},
  cadillac: {},
  ferrari: {},
  haas: {},
  mclaren: { folderName: "teamMcLaren" },
  mercedes: { light: true },
  "racing-bulls": { light: true },
  "red-bull": { folderName: "teamRedbull" },
  williams: { folderName: "teamWiliams", light: true },
  "kick-sauber": {},
  rb: { light: true },
  alphatauri: { folderName: "teamRb", light: true },
  "alfa-romeo": {},
  "racing-point": {},
  renault: { light: true },
  "toro-rosso": { light: true },
  "force-india": {},
  sauber: {},
  manor: { format: "webp" },
  "lotus-f1": {},
  marussia: { format: "webp" },
  caterham: {},
  hrt: {},
  "lotus-racing": {},
  virgin: { light: true },
  brawn: {},
  toyota: {},
  "bmw-sauber": {},
  honda: {},
  "super-aguri": { format: "webp" },
  spyker: { format: "webp", light: true },
  midland: { format: "webp" },
  bar: {},
  jordan: { format: "webp" },
  minardi: {},
  jaguar: {},
  arrows: { format: "webp" },
  benetton: {},
  prost: {},
  stewart: { format: "webp" },
  tyrrell: {},
  lola: {},
  footwork: { format: "webp" },
  ligier: { format: "webp" },
  forti: { format: "webp" },
  larrousse: { format: "webp" },
  simtek: { format: "webp" },
  lotus: {},
  march: { format: "webp" },
  dallara: {},
  venturi: {},
  "andrea-moda": { format: "webp" },
  brabham: { format: "webp" },
  fondmetal: {},
  "leyton-house": { format: "webp" },
  ags: { format: "webp" },
  coloni: {},
  modena: { light: true },
});
// TODO

function pointsToNumber(points: unknown): number {
  let value: unknown = points;

  if (points !== null && typeof points === "object") {
    const decimalValue = Reflect.get(points, "value");
    const decimalType = Reflect.get(points, "$type");
    const toNumber = Reflect.get(points, "toNumber");

    if (decimalType === "Decimal" && typeof decimalValue === "string") {
      value = decimalValue;
    } else if (typeof toNumber === "function") {
      value = toNumber.call(points);
    }
  }

  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  if (!Number.isFinite(numericValue)) {
    throw new Error("Invalid points value in constructor standings data.");
  }

  return numericValue;
}

async function DriverStandings({ year }: { year: number }) {
  await connection();

  const [driverStandings, officialConstructorStandings, seasonConstructors] =
    await Promise.all([
      prisma.season_driver_standing.findMany({
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
      }),
      prisma.season_constructor_standing.findMany({
        where: { year },
        select: {
          constructor_id: true,
          position_display_order: true,
          position_text: true,
          points: true,
          constructor: true,
        },
        orderBy: [{ position_display_order: "asc" }],
      }),
      prisma.season_constructor.findMany({
        where: { year },
        select: {
          total_points: true,
          constructor: true,
        },
      }),
    ]);

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
        race_points: true,
        constructor: true,
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

  const makeTeamInfo = (constructor: { id: string; name: string }) => {
    const logo = teamLogoPaths[constructor.id];

    return {
      id: constructor.id,
      name: constructor.name,
      logoPath: logo?.src ?? null,
      lightLogo: logo?.light ?? false,
    };
  };

  const constructorsById = new Map<string, TeamInfo>();
  for (const entry of seasonConstructors) {
    const constructor = Reflect.get(entry, "constructor") as {
      id: string;
      name: string;
    };
    constructorsById.set(constructor.id, makeTeamInfo(constructor));
  }
  for (const result of raceResults) {
    const constructor = Reflect.get(result, "constructor") as {
      id: string;
      name: string;
    };
    constructorsById.set(constructor.id, makeTeamInfo(constructor));
  }

  const officialByConstructor = new Map<
    string,
    {
      team: TeamInfo;
      points: number;
      positionOrder: number;
      position: string;
      records: number;
    }
  >();
  for (const standing of officialConstructorStandings) {
    const existing = officialByConstructor.get(standing.constructor_id);
    const constructor = Reflect.get(standing, "constructor") as {
      id: string;
      name: string;
    };
    officialByConstructor.set(standing.constructor_id, {
      team: makeTeamInfo(constructor),
      points: (existing?.points ?? 0) + pointsToNumber(standing.points),
      positionOrder: Math.min(
        existing?.positionOrder ?? standing.position_display_order,
        standing.position_display_order,
      ),
      position: existing?.position ?? standing.position_text,
      records: (existing?.records ?? 0) + 1,
    });
  }

  let constructorStandings: ConstructorStanding[] = [];
  let constructorStandingsNote: string | null = null;
  let constructorStandingsEmptyMessage: string | null = null;

  const hasOneOfficialRowPerTeam = [...officialByConstructor.values()].every(
    ({ records }) => records === 1,
  );

  if (officialByConstructor.size > 0) {
    const additionalZeroPointTeams = seasonConstructors.flatMap((entry) => {
      if (pointsToNumber(entry.total_points) !== 0) return [];
      const constructor = Reflect.get(entry, "constructor") as {
        id: string;
        name: string;
      };
      if (officialByConstructor.has(constructor.id)) return [];

      return [makeTeamInfo(constructor)];
    });
    const combinedByConstructor = new Map(officialByConstructor);
    for (const team of additionalZeroPointTeams) {
      combinedByConstructor.set(team.id, {
        team,
        points: 0,
        positionOrder: Number.MAX_SAFE_INTEGER,
        position: "",
        records: 0,
      });
    }
    const canUseOfficialPositions = hasOneOfficialRowPerTeam;

    if (canUseOfficialPositions && additionalZeroPointTeams.length === 0) {
      constructorStandings = [...combinedByConstructor.values()]
        .sort(
          (left, right) =>
            left.positionOrder - right.positionOrder ||
            left.team.id.localeCompare(right.team.id),
        )
        .map(({ team, points, position }) => ({ team, points, position }));
    } else {
      constructorStandings = [...combinedByConstructor.values()]
        .sort(
          (left, right) =>
            right.points - left.points ||
            left.positionOrder - right.positionOrder ||
            left.team.name.localeCompare(right.team.name) ||
            left.team.id.localeCompare(right.team.id),
        )
        .map(({ team, points, position }, index) => ({
          team,
          points,
          position:
            canUseOfficialPositions && position !== ""
              ? position
              : String(index + 1),
        }));
      constructorStandingsNote =
        additionalZeroPointTeams.length > 0 && !hasOneOfficialRowPerTeam
          ? "Official points are consolidated by constructor, with additional zero-point season entrants listed afterward."
          : additionalZeroPointTeams.length > 0
            ? "Official standings are followed by constructors recorded for the season with zero points."
            : "Official points are consolidated by constructor. Equal totals follow recorded standings order, then team name.";
    }
  } else {
    const sprintResults = await prisma.race_data.findMany({
      where: {
        type: "SPRINT_RACE_RESULT",
        race: { year },
      },
      select: {
        constructor_id: true,
        race_points: true,
        constructor: true,
      },
    });
    const eventPointsByConstructor = new Map<string, number>();
    let hasScoredResults = false;

    const addEventPoints = (constructorId: string, points: unknown) => {
      if (points === null) return;
      hasScoredResults = true;
      const numericPoints = pointsToNumber(points);
      eventPointsByConstructor.set(
        constructorId,
        (eventPointsByConstructor.get(constructorId) ?? 0) + numericPoints,
      );
    };

    for (const result of raceResults) {
      addEventPoints(result.constructor_id, result.race_points);
    }
    for (const result of sprintResults) {
      const constructor = Reflect.get(result, "constructor") as {
        id: string;
        name: string;
      };
      constructorsById.set(constructor.id, makeTeamInfo(constructor));
      addEventPoints(result.constructor_id, result.race_points);
    }

    if (!hasScoredResults) {
      constructorStandingsEmptyMessage =
        constructorsById.size > 0
          ? `Constructors are recorded for ${year}, but no race or sprint points are available yet.`
          : `No constructor data is recorded for ${year}.`;
    } else {
      constructorStandings = [...constructorsById]
        .map(([constructorId, team]) => ({
          team,
          points: eventPointsByConstructor.get(constructorId) ?? 0,
        }))
        .sort(
          (left, right) =>
            right.points - left.points ||
            left.team.name.localeCompare(right.team.name) ||
            left.team.id.localeCompare(right.team.id),
        )
        .map(({ team, points }, index) => ({
          team,
          points,
          position: String(index + 1),
        }));
      constructorStandingsNote =
        "Calculated from recorded Grand Prix and sprint result points. Ties use a stable team-name order.";
    }
  }

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
    const team = makeTeamInfo(constructor);

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
    <main className={gridStyles.page}>
      <div className={gridStyles.ambient} aria-hidden="true" />

      <div className={gridStyles.content}>
        <YearNavigation year={year} />

        <header className={gridStyles.header}>
          <div className={gridStyles.eyebrow}>
            <span className={gridStyles.liveDot} />
            {year} SEASON
          </div>

          <h1 className={gridStyles.title}>
            Drivers <span className={gridStyles.titleAccent}>Championship</span>
          </h1>

          <p className={gridStyles.subtitle}>
            The battle for the top spot, from lights out to the final flag.
          </p>

          <div className={gridStyles.headerRule}>
            <span className={gridStyles.headerRuleAccent} />
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
          constructorStandings={constructorStandings}
          constructorStandingsNote={constructorStandingsNote}
          constructorStandingsEmptyMessage={constructorStandingsEmptyMessage}
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
  if (year < 1950 || year > 2026) notFound();

  return <DriverStandings year={year} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className={gridStyles.loading}>Loading standings...</main>
      }
    >
      <GridPage params={params} />
    </Suspense>
  );
}
