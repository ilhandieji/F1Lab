import Link from "next/link";
import { CountryFlag } from "@/components/chrome/country-flag";
import { ResultMarks } from "@/components/chrome/result-marks";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { ConstructorSeasonView } from "@/lib/constructor/types";

type ConstructorRaceLogProps = {
  view: ConstructorSeasonView;
};

export function ConstructorRaceLog({ view }: ConstructorRaceLogProps) {
  const { races } = view;

  return (
    <section
      id="constructor-races-panel"
      className="rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      role="tabpanel"
      aria-labelledby="constructor-races-tab"
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
          {view.year}
        </span>
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">Results</h2>
      </div>

      {races.length === 0 ? (
        <p className="text-sm text-white/50">No race results recorded for this season.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                  <th className="pb-2 pe-2">Rnd</th>
                  <th className="pb-2 pe-2">Grand Prix</th>
                  <th className="pb-2 pe-2">Driver</th>
                  <th className="pb-2 pe-2">Grid</th>
                  <th className="pb-2 pe-2">Finish</th>
                  <th className="pb-2 pe-2">Tyres</th>
                  <th className="pb-2 text-end">Pts</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race, index) => (
                  <tr key={`${race.round}-${race.driverId}-${index}`} className="border-t border-white/10">
                    <td className="py-3 pe-2 font-black text-white/70">{race.round}</td>
                    <td className="max-w-[10rem] py-3 pe-2 font-medium text-white">{race.grandPrixName}</td>
                    <td className="py-3 pe-2">
                      <span className="flex items-center gap-2">
                        <DriverAvatar
                          photoUrl={race.portraitUrl}
                          fullName={race.driverName}
                          variant="row"
                        />
                        <CountryFlag alpha2={race.nationalityAlpha2} name={race.nationalityName} />
                        <Link
                          href={driverHref(race.driverId, view.year)}
                          className="text-white underline decoration-white/20 underline-offset-2 hover:text-red-300"
                        >
                          {race.driverName}
                        </Link>
                      </span>
                    </td>
                    <td className="py-3 pe-2 text-white/70">{race.gridPosition ?? "—"}</td>
                    <td className="py-3 pe-2">
                      <span className={race.retired ? "text-amber-200" : "font-semibold text-white"}>
                        {race.finishPosition}
                      </span>
                      <ResultMarks pole={race.pole} fastestLap={race.fastestLap} />
                      {race.retirementReason ? (
                        <span className="mt-0.5 block text-xs text-white/65">{race.retirementReason}</span>
                      ) : null}
                    </td>
                    <td className="py-3 pe-2 text-white/60">{race.tyreManufacturerName}</td>
                    <td className="py-3 text-end font-black tabular-nums text-white">{race.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {races.map((race, index) => (
              <li
                key={`mobile-${race.round}-${race.driverId}-${index}`}
                className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.95),rgba(16,16,18,0.98))] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-400/90">
                      R{race.round}
                    </p>
                    <p className="mt-1 font-semibold text-white">{race.grandPrixName}</p>
                  </div>
                  <p className="text-xl font-black text-white">{race.points} pts</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <DriverAvatar
                    photoUrl={race.portraitUrl}
                    fullName={race.driverName}
                    variant="row"
                  />
                  <CountryFlag alpha2={race.nationalityAlpha2} name={race.nationalityName} />
                  <Link
                    href={driverHref(race.driverId, view.year)}
                    className="text-sm font-medium text-white underline decoration-white/20 underline-offset-2"
                  >
                    {race.driverName}
                  </Link>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/60">
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">Grid</dt>
                    <dd className="mt-0.5 font-semibold text-white">{race.gridPosition ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.12em] text-white/65">Finish</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                      {race.finishPosition}
                      <ResultMarks pole={race.pole} fastestLap={race.fastestLap} />
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="uppercase tracking-[0.12em] text-white/65">Tyres · Engine</dt>
                    <dd className="mt-0.5">
                      {race.tyreManufacturerName} · {race.engineManufacturerName}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
