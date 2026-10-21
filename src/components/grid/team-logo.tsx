import Image from "next/image";
import { ImageZoom } from "@/components/chrome/image-zoom";
import type { TeamInfo } from "@/lib/grid/types";

type TeamLogoProps = {
  team: TeamInfo;
  size?: "default" | "compact" | "tiny" | "featured" | "hero";
  className?: string;
};

const sizeMap = {
  default: "relative h-10 w-12 shrink-0",
  compact: "relative h-7 w-9 shrink-0",
  tiny: "relative h-5 w-7 shrink-0",
  featured: "relative h-12 w-16 shrink-0 sm:h-14 sm:w-[4.5rem]",
  hero: "relative h-20 w-28 shrink-0 sm:h-24 sm:w-32 md:h-[7.5rem] md:w-40",
} as const;

export function TeamLogo({ team, size = "default", className = "" }: TeamLogoProps) {
  const boxClass = `${sizeMap[size]} grid place-items-center rounded-md bg-white/0 ${className}`;

  if (!team.logoPath) {
    return (
      <span
        className={`${boxClass} border border-dashed border-white/20`}
        role="img"
        aria-label={`${team.name} logo unavailable`}
      />
    );
  }

  return (
    <ImageZoom src={team.logoPath} alt={`${team.name} logo`} light={team.lightLogo} className={boxClass}>
      <Image
        src={team.logoPath}
        alt=""
        fill
        className={`object-contain ${team.lightLogo ? "brightness-0 invert" : ""}`}
      />
    </ImageZoom>
  );
}
