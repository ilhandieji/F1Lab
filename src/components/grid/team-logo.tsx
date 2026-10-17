import Image from "next/image";
import type { TeamInfo } from "@/lib/grid/types";

type TeamLogoProps = {
  team: TeamInfo;
  size?: "default" | "compact" | "tiny";
};

const sizeMap = {
  default: "relative h-10 w-12 shrink-0",
  compact: "relative h-7 w-9 shrink-0",
  tiny: "relative h-5 w-7 shrink-0",
} as const;

export function TeamLogo({ team, size = "default" }: TeamLogoProps) {
  const className = `${sizeMap[size]} grid place-items-center rounded-md bg-white/0`;

  if (!team.logoPath) {
    return (
      <span
        className={`${className} border border-dashed border-white/20`}
        role="img"
        aria-label={`${team.name} logo unavailable`}
      />
    );
  }

  return (
    <span className={className}>
      <Image
        src={team.logoPath}
        alt={`${team.name} logo`}
        fill
        className={`object-contain ${team.lightLogo ? "brightness-0 invert" : ""}`}
      />
    </span>
  );
}
