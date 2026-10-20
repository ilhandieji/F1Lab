import Link from "next/link";
import { CountryFlag } from "@/components/chrome/country-flag";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { driverHref } from "@/lib/driver/routes";
import type { DriverFamilyLink } from "@/lib/driver/types";

type DriverFamilyProps = {
  family: DriverFamilyLink[];
  season: number;
};

export function DriverFamily({ family, season }: DriverFamilyProps) {
  if (family.length === 0) return null;

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5">
      <div className="mb-4 border-b border-white/10 pb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Lineage</span>
        <h2 className="text-lg font-black tracking-[-0.04em] text-white">Racing family</h2>
      </div>
      <ul className="grid gap-2">
        {family.map((link) => (
          <li key={`${link.otherDriverId}-${link.type}`}>
            <Link
              href={driverHref(link.otherDriverId, season)}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-red-500/50 hover:bg-red-500/5"
            >
              <span className="flex min-w-0 items-center gap-3">
                <DriverAvatar
                  portraits={link.portraits}
                  season={season}
                  abbreviation={link.otherDriverAbbreviation}
                  fullName={link.otherDriverName}
                  variant="row"
                />
                <CountryFlag alpha2={link.nationalityAlpha2} name={link.nationalityName} />
                <span className="truncate font-semibold text-white">{link.otherDriverName}</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
                {link.type.replace(/_/g, " ")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
