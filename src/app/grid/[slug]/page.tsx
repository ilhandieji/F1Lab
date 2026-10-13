import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import "../grid.css";

type PageProps = {
  params: Promise<{ slug: string }>;
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

  const seasonEntries = await prisma.season_entrant_driver.findMany({
    where: {
      year,
      test_driver: false,
    },
    select: {
      driver_id: true,
      constructor: true,
    },
  });

  // ارتباط شناسهٔ راننده با نام تیم
  const constructorsByDriver = new Map<string, string[]>();

  for (const entry of seasonEntries) {
    const constructorName = entry.constructor.name;

    if (!constructorName) continue;

    const existingNames = constructorsByDriver.get(entry.driver_id) ?? [];

    if (!existingNames.includes(constructorName)) {
      existingNames.push(constructorName);
      constructorsByDriver.set(entry.driver_id, existingNames);
    }
  }

  const highestPoints = Math.max(
    ...driverStandings.map(({ points }) => Number(points)),
    1,
  );

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

          <div className="grid-table-heading" aria-hidden="true">
            <span>POS</span>
            <span>DRIVER</span>
            <span>POINTS</span>
          </div>
        </header>

        <section
          className="grid-standings"
          aria-label={`${year} driver standings`}
        >
          {driverStandings.map(
            ({ position_display_order, position_text, points, driver }) => {
              const numericPoints = Number(points);
              const progress = (numericPoints / highestPoints) * 100;

              const constructorNames =
                constructorsByDriver.get(driver.id) ?? [];

              return (
                <article
                  className="grid-driver-card"
                  key={position_display_order}
                >
                  <div className="grid-position">
                    <span className="grid-position-label">POS</span>

                    <span className="grid-position-number">
                      {position_text}
                    </span>

                    <div className="grid-team-logo">
                      <Image
                        src="/assets/teamRedbull/oracle-red-bull-racing-logo-brandlogos.net_l1rigy4u2.svg"
                        alt="Red Bull Racing"
                        width={60}
                        height={20}
                        className="grid-team-logo-image"
                      />
                    </div>
                  </div>

                  <div className="grid-driver-info">
                    <span className="grid-driver-first-name">
                      {driver.first_name}
                    </span>

                    <h2 className="grid-driver-last-name">
                      {driver.last_name}
                    </h2>

                    <p>
                      Team:{" "}
                      {constructorNames.length > 0
                        ? constructorNames.join(" / ")
                        : "Unknown"}
                    </p>

                    <div
                      className="grid-progress-track"
                      role="progressbar"
                      aria-label={`${driver.first_name} ${driver.last_name} points`}
                      aria-valuenow={numericPoints}
                      aria-valuemin={0}
                      aria-valuemax={highestPoints}
                    >
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="grid-score">
                    <span className="grid-score-value">{numericPoints}</span>
                    <span className="grid-score-label">PTS</span>
                  </div>
                </article>
              );
            },
          )}
        </section>

        <footer className="grid-footer">
          <span>STANDINGS</span>
          <span>AFTER ALL ROUNDS</span>
          <span>{driverStandings.length} DRIVERS</span>
        </footer>
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
