"use client";

import { useRef, type KeyboardEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { gridStyles } from "@/components/grid/styles";

export type TeamInfo = {
  id: string;
  name: string;
  logoPath: string | null;
  lightLogo: boolean;
};

export type GridDriver = {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  positionOrder: number;
  points: number;
  team: TeamInfo;
};

export type ConstructorStanding = {
  team: TeamInfo;
  position: string;
  points: number;
};

export type ActivityDriver = {
  id: string;
  name: string;
  weekends: number;
  teams: TeamInfo[];
  openedSeason: boolean;
};

export type TestDriver = {
  id: string;
  name: string;
  teams: TeamInfo[];
};

export type ActivityEvent = {
  round: number;
  name: string;
  changes: {
    team: TeamInfo;
    outgoing: { id: string; name: string }[];
    incoming: { id: string; name: string }[];
    kind: "transfer" | "return" | "substitution" | "lineup-change";
    stint: { startRound: number; endRound: number; weekends: number };
  }[];
};

type GridViewsProps = {
  year: number;
  startingDrivers: GridDriver[];
  highestPoints: number;
  constructorStandings: ConstructorStanding[];
  constructorStandingsNote: string | null;
  constructorStandingsEmptyMessage: string | null;
  activity: {
    summary: {
      uniqueRaceDrivers: number;
      substitutions: number;
      changedTeams: number;
    };
    events: ActivityEvent[];
    drivers: ActivityDriver[];
    testDrivers: TestDriver[];
  };
};

const activityLabels = {
  transfer: "TEAM TRANSFER",
  return: "RETURNED TO SEAT",
  substitution: "SUBSTITUTE",
  "lineup-change": "LINEUP CHANGE",
} as const;

const activityKindStyles = {
  transfer: gridStyles.activityKindTransfer,
  return: gridStyles.activityKindReturn,
  substitution: gridStyles.activityKindSubstitution,
  "lineup-change": "",
} as const;

const gridTabs = [
  { id: "drivers", label: "Season-start grid" },
  { id: "activity", label: "Season activity" },
  { id: "constructors", label: "Constructors' standings" },
] as const;

type GridTabId = (typeof gridTabs)[number]["id"];

function isGridTabId(value: string | null): value is GridTabId {
  return gridTabs.some((tab) => tab.id === value);
}

function TeamLogo({ team }: { team: TeamInfo }) {
  if (!team.logoPath) {
    return (
      <span
        className={gridStyles.teamLogoMissing}
        role="img"
        aria-label={`${team.name} logo unavailable`}
      />
    );
  }

  return (
    <Image
      src={team.logoPath}
      alt={`${team.name} logo`}
      width={64}
      height={48}
      className={`${gridStyles.teamLogoImage} ${
        team.lightLogo ? gridStyles.teamLogoLight : ""
      }`}
    />
  );
}

function StartingGrid({
  year,
  drivers,
  highestPoints,
}: {
  year: number;
  drivers: GridDriver[];
  highestPoints: number;
}) {
  return (
    <section
      id="grid-drivers-panel"
      className={gridStyles.panel}
      role="tabpanel"
      aria-labelledby="grid-drivers-tab"
      tabIndex={0}
    >
      <div className={gridStyles.tableHeading} aria-hidden="true">
        <span>POS</span>
        <span>DRIVER</span>
        <span className={gridStyles.tableHeadingLast}>POINTS</span>
      </div>

      <section
        className={gridStyles.standings}
        aria-label={`${year} season-start driver grid`}
      >
        {drivers.map((driver) => {
          const progress = (driver.points / highestPoints) * 100;

          return (
            <article className={gridStyles.driverCard} key={driver.id}>
              <div className={gridStyles.position}>
                <span className={gridStyles.positionLabel}>POS</span>
                <span className={gridStyles.positionNumber}>
                  {driver.position}
                </span>
              </div>

              <div className={gridStyles.driverInfo}>
                <div className={gridStyles.driverIdentity}>
                  <div className={gridStyles.teamLogos}>
                    <div className={gridStyles.teamLogo}>
                      <TeamLogo team={driver.team} />
                    </div>
                  </div>

                  <div className={gridStyles.driverDetails}>
                    <span className={gridStyles.driverFirstName}>
                      {driver.firstName}
                    </span>
                    <h2 className={gridStyles.driverLastName}>
                      {driver.lastName}
                    </h2>
                    <p>Team: {driver.team.name}</p>
                  </div>
                </div>

                <div
                  className={gridStyles.progressTrack}
                  role="progressbar"
                  aria-label={`${driver.firstName} ${driver.lastName} points`}
                  aria-valuenow={driver.points}
                  aria-valuemin={0}
                  aria-valuemax={highestPoints}
                >
                  <span
                    className={gridStyles.progressValue}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className={gridStyles.score}>
                <span className={gridStyles.scoreValue}>{driver.points}</span>
                <span className={gridStyles.scoreLabel}>PTS</span>
              </div>
            </article>
          );
        })}
      </section>

      <footer className={gridStyles.footer}>
        <span>SEASON START</span>
        <span>{drivers.length} DRIVERS</span>
        <span>{year}</span>
      </footer>
    </section>
  );
}

function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <p className={gridStyles.activityEmpty}>
        No race-driver lineup changes are recorded for this season.
      </p>
    );
  }

  return (
    <ol
      className={gridStyles.activityTimeline}
      aria-label="Chronological driver changes"
    >
      {events.map((event) => (
        <li className={gridStyles.activityEvent} key={event.round}>
          <div className={gridStyles.activityRound} aria-hidden="true">
            R{event.round}
          </div>

          <div>
            <header className={gridStyles.activityEventHeading}>
              <div>
                <h3 className={gridStyles.activityEventTitle}>{event.name}</h3>
              </div>
              <span className={gridStyles.activityEventCount}>
                {event.changes.length} TEAM SEAT CHANGES
              </span>
            </header>

            <div className={gridStyles.activityChangeList}>
              {event.changes.map((change) => (
                <article
                  className={gridStyles.activityChange}
                  key={`${event.round}-${change.team.id}`}
                >
                  <div className={gridStyles.activityTeamHeading}>
                    <div className={gridStyles.activityTeamLogo}>
                      <TeamLogo team={change.team} />
                    </div>
                    <h4 className={gridStyles.activityTeamName}>
                      {change.team.name}
                    </h4>
                    <span
                      className={`${gridStyles.activityKind} ${activityKindStyles[change.kind]}`}
                    >
                      {activityLabels[change.kind]}
                    </span>
                  </div>

                  <div className={gridStyles.activitySeatChange}>
                    <div className={gridStyles.activitySeat}>
                      <span className={gridStyles.activitySeatLabel}>OUT</span>
                      <strong className={gridStyles.activitySeatValue}>
                        {change.outgoing.map(({ name }) => name).join(" / ") ||
                          "No prior race seat"}
                      </strong>
                    </div>
                    <span
                      className={gridStyles.activityArrow}
                      aria-hidden="true"
                    >
                      TO
                    </span>
                    <div className={gridStyles.activitySeat}>
                      <span className={gridStyles.activitySeatLabel}>IN</span>
                      <strong className={gridStyles.activitySeatValue}>
                        {change.incoming.map(({ name }) => name).join(" / ") ||
                          "Seat vacant"}
                      </strong>
                    </div>
                  </div>

                  {change.incoming.length > 0 && (
                    <p className={gridStyles.activityStint}>
                      Raced rounds {change.stint.startRound}
                      {change.stint.endRound !== change.stint.startRound &&
                        `-${change.stint.endRound}`}{" "}
                      · {change.stint.weekends} GP
                      {change.stint.weekends === 1 ? " weekend" : " weekends"}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ActivityView({ activity }: { activity: GridViewsProps["activity"] }) {
  return (
    <section
      id="grid-activity-panel"
      className={`${gridStyles.panel} ${gridStyles.activityView}`}
      role="tabpanel"
      aria-labelledby="grid-activity-tab"
      tabIndex={0}
    >
      <section
        className={gridStyles.activitySection}
        aria-labelledby="activity-title"
      >
        <div className={gridStyles.activitySectionHeading}>
          <div>
            <span className={gridStyles.activityKicker}>SEASON OVERVIEW</span>
            <h2 id="activity-title" className={gridStyles.activitySectionTitle}>
              The moving grid
            </h2>
          </div>
          <p className={gridStyles.activitySectionDescription}>
            Race-result entries, ordered by Grand Prix round.
          </p>
        </div>

        <div className={gridStyles.activityStats}>
          <article className={gridStyles.activityStat}>
            <span className={gridStyles.activityStatLabel}>
              UNIQUE RACE DRIVERS
            </span>
            <strong className={gridStyles.activityStatValue}>
              {activity.summary.uniqueRaceDrivers}
            </strong>
          </article>
          <article
            className={`${gridStyles.activityStat} ${gridStyles.activityStatDivider}`}
          >
            <span className={gridStyles.activityStatLabel}>
              SUBSTITUTION STINTS
            </span>
            <strong className={gridStyles.activityStatValue}>
              {activity.summary.substitutions}
            </strong>
          </article>
          <article
            className={`${gridStyles.activityStat} ${gridStyles.activityStatDivider}`}
          >
            <span className={gridStyles.activityStatLabel}>
              TEAMS WITH CHANGES
            </span>
            <strong className={gridStyles.activityStatValue}>
              {activity.summary.changedTeams}
            </strong>
          </article>
        </div>
        <p className={gridStyles.activityNote}>
          A substitution is counted when a new driver fills a seat and the
          previous race driver later returns. Cross-team moves and returns are
          shown separately.
        </p>
      </section>

      <section
        className={gridStyles.activitySection}
        aria-labelledby="changes-title"
      >
        <div className={gridStyles.activitySectionHeading}>
          <div>
            <span className={gridStyles.activityKicker}>CHRONOLOGY</span>
            <h2 id="changes-title" className={gridStyles.activitySectionTitle}>
              Driver changes
            </h2>
          </div>
          <p className={gridStyles.activitySectionDescription}>
            Outgoing and incoming race drivers at each affected team.
          </p>
        </div>
        <ActivityTimeline events={activity.events} />
      </section>

      <section
        className={gridStyles.activitySection}
        aria-labelledby="race-drivers-title"
      >
        <div className={gridStyles.activitySectionHeading}>
          <div>
            <span className={gridStyles.activityKicker}>RACE RESULTS</span>
            <h2
              id="race-drivers-title"
              className={gridStyles.activitySectionTitle}
            >
              Race-driver appearances
            </h2>
          </div>
          <p className={gridStyles.activitySectionDescription}>
            Distinct Grand Prix weekends with a race-result entry.
          </p>
        </div>

        <ul className={gridStyles.activityList}>
          {activity.drivers.map((driver) => (
            <li className={gridStyles.activityDriver} key={driver.id}>
              <div className={gridStyles.activityDriverLogos}>
                {driver.teams.map((team) => (
                  <div className={gridStyles.activityDriverLogo} key={team.id}>
                    <TeamLogo team={team} />
                  </div>
                ))}
              </div>
              <div className={gridStyles.activityDriverInfo}>
                <strong className={gridStyles.activityDriverName}>
                  {driver.name}
                </strong>
                <span className={gridStyles.activityDriverDescription}>
                  {driver.openedSeason
                    ? "Opening driver"
                    : "Joined during season"}
                  {driver.teams.length > 0 &&
                    ` · ${driver.teams.map(({ name }) => name).join(" / ")}`}
                </span>
              </div>
              <span className={gridStyles.activityWeekendCount}>
                {driver.weekends} GP{" "}
                {driver.weekends === 1 ? "weekend" : "weekends"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={gridStyles.activitySection}
        aria-labelledby="test-drivers-title"
      >
        <div className={gridStyles.activitySectionHeading}>
          <div>
            <span className={gridStyles.activityKicker}>
              EXPLICIT SEASON ASSIGNMENTS
            </span>
            <h2
              id="test-drivers-title"
              className={gridStyles.activitySectionTitle}
            >
              Test drivers
            </h2>
          </div>
          <p className={gridStyles.activitySectionDescription}>
            Designations from the season entrant records.
          </p>
        </div>

        {activity.testDrivers.length > 0 ? (
          <ul className={gridStyles.activityList}>
            {activity.testDrivers.map((driver) => (
              <li className={gridStyles.activityTestDriver} key={driver.id}>
                <strong className={gridStyles.activityDriverName}>
                  {driver.name}
                </strong>
                <div className={gridStyles.activityTestTeams}>
                  {driver.teams.map((team) => (
                    <span className={gridStyles.activityTestTeam} key={team.id}>
                      <span className={gridStyles.activityTestLogo}>
                        <TeamLogo team={team} />
                      </span>
                      {team.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={gridStyles.activityEmpty}>
            No test-driver designations are recorded for this season.
          </p>
        )}
        <p className={gridStyles.activityNote}>
          Reserve-driver roles and test-session appearances are not recorded in
          this dataset.
        </p>
      </section>
    </section>
  );
}

function ConstructorsStandings({
  year,
  standings,
  note,
  emptyMessage,
}: {
  year: number;
  standings: ConstructorStanding[];
  note: string | null;
  emptyMessage: string | null;
}) {
  return (
    <section
      id="grid-constructors-panel"
      className={gridStyles.panel}
      role="tabpanel"
      aria-labelledby="grid-constructors-tab"
      tabIndex={0}
    >
      {standings.length > 0 ? (
        <>
          <div className={gridStyles.constructorHeading} aria-hidden="true">
            <span>POS</span>
            <span>CONSTRUCTOR</span>
            <span className={gridStyles.tableHeadingLast}>POINTS</span>
          </div>
          <ol
            className={gridStyles.constructorList}
            aria-label={`${year} Constructors' Championship standings`}
          >
            {standings.map(({ team, position, points }) => (
              <li className={gridStyles.constructorRow} key={team.id}>
                <div className={gridStyles.constructorPosition}>
                  <span className={gridStyles.positionLabel}>POS</span>
                  <span className={gridStyles.positionNumber}>
                    {position}
                  </span>
                </div>
                <div className={gridStyles.constructorIdentity}>
                  <div className={gridStyles.constructorLogo}>
                    <TeamLogo team={team} />
                  </div>
                  <h2 className={gridStyles.constructorName}>{team.name}</h2>
                </div>
                <div className={gridStyles.constructorScore}>
                  <span
                    className={`${gridStyles.scoreValue} ${gridStyles.scoreValueWide}`}
                  >
                    {points.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className={gridStyles.scoreLabel}>PTS</span>
                </div>
              </li>
            ))}
          </ol>
          {note && <p className={gridStyles.activityNote}>{note}</p>}
        </>
      ) : (
        <p className={gridStyles.activityEmpty}>
          {emptyMessage ?? `No constructor standings are available for ${year}.`}
        </p>
      )}
    </section>
  );
}

export default function GridViews({
  year,
  startingDrivers,
  highestPoints,
  activity,
  constructorStandings,
  constructorStandingsNote,
  constructorStandingsEmptyMessage,
}: GridViewsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab: GridTabId = isGridTabId(requestedTab)
    ? requestedTab
    : "drivers";
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectTab = (tab: GridTabId) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("tab", tab);
    router.push(`${pathname}?${nextSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % gridTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + gridTabs.length) % gridTabs.length;
    } else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = gridTabs.length - 1;
    else return;

    event.preventDefault();
    selectTab(gridTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <div
        className={gridStyles.tabs}
        role="tablist"
        aria-label={`${year} season views`}
      >
        {gridTabs.map((tab, index) => (
          <button
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`grid-${tab.id}-tab`}
            className={gridStyles.tab}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`grid-${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => selectTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div hidden={activeTab !== "drivers"}>
        <StartingGrid
          year={year}
          drivers={startingDrivers}
          highestPoints={highestPoints}
        />
      </div>
      <div hidden={activeTab !== "activity"}>
        <ActivityView activity={activity} />
      </div>
      <div hidden={activeTab !== "constructors"}>
        <ConstructorsStandings
          year={year}
          standings={constructorStandings}
          note={constructorStandingsNote}
          emptyMessage={constructorStandingsEmptyMessage}
        />
      </div>
    </>
  );
}
