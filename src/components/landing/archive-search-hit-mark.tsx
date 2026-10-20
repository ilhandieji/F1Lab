import Image from "next/image";
import { DriverAvatar } from "@/components/driver/driver-avatar";
import { getTeamLogo } from "@/lib/team-logos";
import { FEATURED_SEASON } from "@/lib/grid/seasons";

export function DriverSearchMark({
  fullName,
  abbreviation,
  portraitUrl,
}: {
  fullName: string;
  abbreviation?: string;
  portraitUrl?: string | null;
}) {
  return (
    <DriverAvatar
      photoUrl={portraitUrl}
      abbreviation={abbreviation}
      fullName={fullName}
      variant="thumb"
    />
  );
}

export function TeamSearchMark({ teamId }: { teamId: string }) {
  const logo = getTeamLogo(teamId, FEATURED_SEASON);

  if (!logo) {
    return (
      <span
        className="relative h-8 w-9 shrink-0 rounded-md border border-dashed border-white/25 bg-white/5"
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="relative h-8 w-9 shrink-0 rounded-md bg-white/5" aria-hidden="true">
      <Image
        src={logo.src}
        alt=""
        fill
        className={`object-contain p-0.5 ${logo.light ? "brightness-0 invert" : ""}`}
      />
    </span>
  );
}
