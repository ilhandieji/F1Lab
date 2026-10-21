import { useTranslations } from "next-intl";
import { formatGroupedNumber } from "@/lib/format-number";
import type { ConstructorCareerTotals } from "@/lib/constructor/types";

const STAT_ITEMS: {
  key: keyof ConstructorCareerTotals;
  label: "wins" | "oneTwos" | "podiums" | "poles" | "fastestLaps" | "points" | "titles" | "bestFinish";
  format?: "grouped" | "position";
}[] = [
  { key: "raceWins", label: "wins" },
  { key: "oneTwoFinishes", label: "oneTwos" },
  { key: "podiums", label: "podiums" },
  { key: "polePositions", label: "poles" },
  { key: "fastestLaps", label: "fastestLaps" },
  { key: "careerPoints", label: "points", format: "grouped" },
  { key: "championshipWins", label: "titles" },
  { key: "bestChampionshipPosition", label: "bestFinish", format: "position" },
];

type ConstructorCareerStatsProps = {
  totals: ConstructorCareerTotals;
};

export function ConstructorCareerStats({ totals }: ConstructorCareerStatsProps) {
  const t = useTranslations("Common");
  const constructorText = useTranslations("Constructor");

  return (
    <section
      className="mt-8 rounded-3xl border border-white/10 bg-white/3 p-4 md:p-5"
      aria-label={t("careerStats")}
    >
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="text-xl font-black tracking-[-0.04em] text-white">{t("career")}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_ITEMS.map(({ key, label, format }) => {
          const raw = totals[key];
          const value = typeof raw === "number" ? raw : null;
          const display =
            value === null || (key === "bestChampionshipPosition" && value === 0)
              ? "—"
              : format === "grouped"
                ? formatGroupedNumber(value, 0)
                : format === "position"
                  ? t("position", { position: value })
                  : String(value);
          const labelText = label === "oneTwos" ? constructorText("oneTwos") : t(label);
          return (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(28,28,31,0.9),rgba(16,16,18,0.95))] p-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{labelText}</p>
              <p dir="ltr" className="mt-2 text-2xl font-black tabular-nums text-white">{display}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
