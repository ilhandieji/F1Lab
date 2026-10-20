import Link from "next/link";
import { driverHref } from "@/lib/driver/routes";

type DriverRef = { id: string; name: string };

export function DriverNameList({ drivers, year }: { drivers: DriverRef[]; year: number }) {
  if (drivers.length === 0) return <>—</>;

  return (
    <>
      {drivers.map((driver, index) => (
        <span key={driver.id}>
          {index > 0 ? " / " : null}
          <Link
            href={driverHref(driver.id, year)}
            className="underline decoration-white/20 underline-offset-2 transition hover:text-red-300 hover:decoration-red-400/50"
          >
            {driver.name}
          </Link>
        </span>
      ))}
    </>
  );
}
