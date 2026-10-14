"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

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

function TeamLogo({ team }: { team: TeamInfo }) {
  if (!team.logoPath) return null;

  return (
    <Image
      src={team.logoPath}
      alt={`${team.name} logo`}
      width={64}
      height={48}
      className={`grid-team-logo-image${
        team.lightLogo ? " grid-team-logo-image--light" : ""
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
      id="grid-start-panel"
      className="grid-view-panel"
      role="tabpanel"
      aria-labelledby="grid-start-tab"
      tabIndex={0}
    >
      <div className="grid-table-heading" aria-hidden="true">
        <span>POS</span>
        <span>DRIVER</span>
        <span>POINTS</span>
      </div>

      <section
        className="grid-standings"
        aria-label={`${year} season-start driver grid`}
      >
        {drivers.map((driver) => {
          const progress = (driver.points / highestPoints) * 100;

          return (
            <article className="grid-driver-card" key={driver.id}>
              <div className="grid-position">
                <span className="grid-position-label">POS</span>
                <span className="grid-position-number">{driver.position}</span>
              </div>

              <div className="grid-driver-info">
                <div className="grid-driver-identity">
                  <div className="grid-team-logos">
                    <div className="grid-team-logo">
                      <TeamLogo team={driver.team} />
                    </div>
                  </div>

                  <div className="grid-driver-details">
                    <span className="grid-driver-first-name">
                      {driver.firstName}
                    </span>
                    <h2 className="grid-driver-last-name">{driver.lastName}</h2>
                    <p>Team: {driver.team.name}</p>
                  </div>
                </div>

                <div
                  className="grid-progress-track"
                  role="progressbar"
                  aria-label={`${driver.firstName} ${driver.lastName} points`}
                  aria-valuenow={driver.points}
                  aria-valuemin={0}
                  aria-valuemax={highestPoints}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="grid-score">
                <span className="grid-score-value">{driver.points}</span>
                <span className="grid-score-label">PTS</span>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="grid-footer">
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
      <p className="activity-empty">
        No race-driver lineup changes are recorded for this season.
      </p>
    );
  }

  return (
    <ol className="activity-timeline" aria-label="Chronological driver changes">
      {events.map((event) => (
        <li className="activity-event" key={event.round}>
          <div className="activity-round-marker" aria-hidden="true">
            R{event.round}
          </div>

          <div className="activity-event-content">
            <header className="activity-event-heading">
              <div>
                <h3>{event.name}</h3>
              </div>
              <span>{event.changes.length} TEAM SEAT CHANGES</span>
            </header>

            <div className="activity-change-list">
              {event.changes.map((change) => (
                <article
                  className="activity-change"
                  key={`${event.round}-${change.team.id}`}
                >
                  <div className="activity-team-heading">
                    <div className="activity-team-logo">
                      <TeamLogo team={change.team} />
                    </div>
                    <h4>{change.team.name}</h4>
                    <span
                      className={`activity-kind activity-kind--${change.kind}`}
                    >
                      {activityLabels[change.kind]}
                    </span>
                  </div>

                  <div className="activity-seat-change">
                    <div>
                      <span>OUT</span>
                      <strong>
                        {change.outgoing.map(({ name }) => name).join(" / ") ||
                          "No prior race seat"}
                      </strong>
                    </div>
                    <span className="activity-change-arrow" aria-hidden="true">
                      TO
                    </span>
                    <div>
                      <span>IN</span>
                      <strong>
                        {change.incoming.map(({ name }) => name).join(" / ") ||
                          "Seat vacant"}
                      </strong>
                    </div>
                  </div>

                  {change.incoming.length > 0 && (
                    <p className="activity-stint">
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
      className="grid-view-panel activity-view"
      role="tabpanel"
      aria-labelledby="grid-activity-tab"
      tabIndex={0}
    >
      <section className="activity-overview" aria-labelledby="activity-title">
        <div className="activity-section-heading">
          <div>
            <span className="activity-kicker">SEASON OVERVIEW</span>
            <h2 id="activity-title">The moving grid</h2>
          </div>
          <p>Race-result entries, ordered by Grand Prix round.</p>
        </div>

        <div className="activity-stats">
          <article className="activity-stat">
            <span>UNIQUE RACE DRIVERS</span>
            <strong>{activity.summary.uniqueRaceDrivers}</strong>
          </article>
          <article className="activity-stat">
            <span>SUBSTITUTION STINTS</span>
            <strong>{activity.summary.substitutions}</strong>
          </article>
          <article className="activity-stat">
            <span>TEAMS WITH CHANGES</span>
            <strong>{activity.summary.changedTeams}</strong>
          </article>
        </div>
        <p className="activity-stat-note">
          A substitution is counted when a new driver fills a seat and the
          previous race driver later returns. Cross-team moves and returns are
          shown separately.
        </p>
      </section>

      <section className="activity-section" aria-labelledby="changes-title">
        <div className="activity-section-heading">
          <div>
            <span className="activity-kicker">CHRONOLOGY</span>
            <h2 id="changes-title">Driver changes</h2>
          </div>
          <p>Outgoing and incoming race drivers at each affected team.</p>
        </div>
        <ActivityTimeline events={activity.events} />
      </section>

      <section
        className="activity-section"
        aria-labelledby="race-drivers-title"
      >
        <div className="activity-section-heading">
          <div>
            <span className="activity-kicker">RACE RESULTS</span>
            <h2 id="race-drivers-title">Race-driver appearances</h2>
          </div>
          <p>Distinct Grand Prix weekends with a race-result entry.</p>
        </div>

        <ul className="activity-driver-list">
          {activity.drivers.map((driver) => (
            <li className="activity-driver" key={driver.id}>
              <div className="activity-driver-logos">
                {driver.teams.map((team) => (
                  <div className="activity-driver-logo" key={team.id}>
                    <TeamLogo team={team} />
                  </div>
                ))}
              </div>
              <div className="activity-driver-info">
                <strong>{driver.name}</strong>
                <span>
                  {driver.openedSeason
                    ? "Opening driver"
                    : "Joined during season"}
                  {driver.teams.length > 0 &&
                    ` · ${driver.teams.map(({ name }) => name).join(" / ")}`}
                </span>
              </div>
              <span className="activity-weekend-count">
                {driver.weekends} GP{" "}
                {driver.weekends === 1 ? "weekend" : "weekends"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="activity-section"
        aria-labelledby="test-drivers-title"
      >
        <div className="activity-section-heading">
          <div>
            <span className="activity-kicker">EXPLICIT SEASON ASSIGNMENTS</span>
            <h2 id="test-drivers-title">Test drivers</h2>
          </div>
          <p>Designations from the season entrant records.</p>
        </div>

        {activity.testDrivers.length > 0 ? (
          <ul className="activity-test-list">
            {activity.testDrivers.map((driver) => (
              <li className="activity-test-driver" key={driver.id}>
                <strong>{driver.name}</strong>
                <div className="activity-test-teams">
                  {driver.teams.map((team) => (
                    <span key={team.id}>
                      <span className="activity-test-logo">
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
          <p className="activity-empty">
            No test-driver designations are recorded for this season.
          </p>
        )}
        <p className="activity-data-note">
          Reserve-driver roles and test-session appearances are not recorded in
          this dataset.
        </p>
      </section>
    </section>
  );
}

export default function GridViews({
  year,
  startingDrivers,
  highestPoints,
  activity,
}: GridViewsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % 2;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex + 1) % 2;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = 1;
    else return;

    event.preventDefault();
    setActiveTab(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      <div
        className="grid-tabs"
        role="tablist"
        aria-label={`${year} season views`}
      >
        <button
          ref={(node) => {
            tabRefs.current[0] = node;
          }}
          id="grid-start-tab"
          className="grid-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 0}
          aria-controls="grid-start-panel"
          tabIndex={activeTab === 0 ? 0 : -1}
          onClick={() => setActiveTab(0)}
          onKeyDown={(event) => handleTabKeyDown(event, 0)}
        >
          Season-start grid
        </button>
        <button
          ref={(node) => {
            tabRefs.current[1] = node;
          }}
          id="grid-activity-tab"
          className="grid-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 1}
          aria-controls="grid-activity-panel"
          tabIndex={activeTab === 1 ? 0 : -1}
          onClick={() => setActiveTab(1)}
          onKeyDown={(event) => handleTabKeyDown(event, 1)}
        >
          Season activity
        </button>
      </div>

      <div hidden={activeTab !== 0}>
        <StartingGrid
          year={year}
          drivers={startingDrivers}
          highestPoints={highestPoints}
        />
      </div>
      <div hidden={activeTab !== 1}>
        <ActivityView activity={activity} />
      </div>
    </>
  );
}
