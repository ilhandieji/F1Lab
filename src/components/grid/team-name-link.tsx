import { Link } from "@/i18n/navigation";
import { constructorHref } from "@/lib/constructor/routes";
import type { TeamInfo } from "@/lib/grid/types";

type TeamNameLinkProps = {
  team: TeamInfo;
  year: number;
  className?: string;
};

export function TeamNameLink({ team, year, className }: TeamNameLinkProps) {
  return (
    <Link
      href={constructorHref(team.id, year)}
      className={
        className ??
        "underline decoration-white/20 underline-offset-2 transition hover:text-red-300 hover:decoration-red-400/50"
      }
    >
      {team.name}
    </Link>
  );
}
