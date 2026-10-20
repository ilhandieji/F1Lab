import Image from "next/image";
import { getTeamLogo } from "@/lib/team-logos";
import { FEATURED_SEASON } from "@/lib/grid/seasons";

function driverInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function DriverSearchMark({ fullName }: { fullName: string }) {
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-red-500/50 bg-red-500/15 text-[10px] font-black uppercase tracking-tight text-red-200"
      aria-hidden="true"
    >
      {driverInitials(fullName)}
    </span>
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
