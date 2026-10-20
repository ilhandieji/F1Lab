import Link from "next/link";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { focusRing } from "@/components/chrome/focus";
import { driverHref } from "@/lib/driver/routes";
import type { ActivityDriverRef } from "@/lib/grid/types";

export function DriverNameList({ drivers, year }: { drivers: ActivityDriverRef[]; year: number }) {
  if (drivers.length === 0) return <>—</>;

  return (
    <>
      {drivers.map((driver, index) => (
        <span key={driver.id} className="inline-flex max-w-full items-center gap-1.5 align-middle">
          {index > 0 ? <span className="text-white/40"> / </span> : null}
          <DriverAvatar
            photoUrl={driver.portraitUrl}
            fullName={driver.name}
            variant="thumb"
            className="inline-flex align-middle"
          />
          <Link
            href={driverHref(driver.id, year)}
            className={`underline decoration-white/20 underline-offset-2 transition hover:text-red-300 hover:decoration-red-400/50 ${focusRing}`}
          >
            {driver.name}
          </Link>
        </span>
      ))}
    </>
  );
}
